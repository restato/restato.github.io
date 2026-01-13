import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import {
  createRoom,
  joinRoom,
  findWaitingRoom,
  subscribeToRoom,
  deleteRoom,
  cleanupExpiredRooms,
  type Room
} from './firebase';
import { PeerConnectionError, SessionExpiredError, RoomNotFoundError } from './errors';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  timestamp: number;
}

export type ConnectionStatus =
  | 'initializing'
  | 'waiting'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'expired';

export interface ChatCallbacks {
  onMessage: (message: ChatMessage) => void;
  onStatusChange: (status: ConnectionStatus) => void;
  onPeerConnected: () => void;
  onPeerDisconnected: () => void;
  onRoomCreated: (roomId: string) => void;
  onTimeUpdate: (remainingMs: number) => void;
}

export class ChatService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private roomId: string | null = null;
  private isHost: boolean = false;
  private callbacks: ChatCallbacks;
  private unsubscribeRoom: (() => void) | null = null;
  private timerInterval: number | null = null;
  private expiresAt: number = 0;
  private isDestroyed: boolean = false;
  private connectionTimeout: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(callbacks: ChatCallbacks) {
    this.callbacks = callbacks;
  }

  // Exponential backoff 계산
  private getReconnectDelay(): number {
    return Math.min(1000 * Math.pow(2, this.reconnectAttempts), 8000);
  }

  // PeerJS 초기화
  private initPeer(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isDestroyed) {
        reject(new PeerConnectionError('Service is destroyed'));
        return;
      }

      // 고유 ID 생성
      const peerId = `restato-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      this.peer = new Peer(peerId, {
        debug: 2, // 더 상세한 디버깅
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log('[Chat] PeerJS connected with ID:', id);
        this.reconnectAttempts = 0; // 연결 성공 시 재시도 카운터 리셋
        resolve(id);
      });

      this.peer.on('error', (err) => {
        console.error('[Chat] PeerJS error:', err);
        if (!this.isDestroyed) {
          this.callbacks.onStatusChange('error');
        }
        reject(err);
      });

      this.peer.on('connection', (conn) => {
        console.log('[Chat] Incoming connection from:', conn.peer);
        if (!this.connection) {
          this.setupConnection(conn);
        }
      });

      this.peer.on('disconnected', () => {
        console.log('[Chat] PeerJS signaling disconnected');
        // Exponential backoff으로 재연결 시도
        if (this.peer && !this.peer.destroyed && !this.isDestroyed && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = this.getReconnectDelay();
          console.log(`[Chat] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);

          setTimeout(() => {
            if (this.peer && !this.peer.destroyed && !this.isDestroyed) {
              this.reconnectAttempts++;
              this.peer.reconnect();
            }
          }, delay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('[Chat] Max reconnection attempts reached');
          if (!this.isDestroyed) {
            this.callbacks.onStatusChange('error');
          }
        }
      });

      this.peer.on('close', () => {
        console.log('[Chat] PeerJS closed');
      });
    });
  }

  // 연결 설정
  private setupConnection(conn: DataConnection) {
    // 이미 연결이 있으면 무시
    if (this.connection && this.connection.open) {
      console.log('[Chat] Already have an open connection, ignoring new one');
      return;
    }

    this.connection = conn;
    console.log('[Chat] Setting up connection with:', conn.peer);

    // 이전 타임아웃 정리
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    // 연결 타임아웃 설정 (30초)
    this.connectionTimeout = window.setTimeout(() => {
      if (this.connection && !this.connection.open && !this.isDestroyed) {
        console.log('[Chat] Connection timeout');
        this.connection.close();
        this.callbacks.onStatusChange('error');
      }
    }, 30000);

    conn.on('open', () => {
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      console.log('[Chat] Data connection OPEN');
      if (!this.isDestroyed) {
        this.callbacks.onStatusChange('connected');
        this.callbacks.onPeerConnected();
      }
    });

    conn.on('data', (data) => {
      if (this.isDestroyed) return;
      // 메시지 복사해서 수정 (원본 변경 방지)
      const message: ChatMessage = {
        ...(data as ChatMessage),
        sender: 'peer'
      };
      this.callbacks.onMessage(message);
    });

    conn.on('close', () => {
      console.log('[Chat] Connection CLOSED');
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      this.connection = null;
      if (!this.isDestroyed) {
        this.callbacks.onPeerDisconnected();
        this.callbacks.onStatusChange('disconnected');
      }
    });

    conn.on('error', (err) => {
      console.error('[Chat] Connection error:', err);
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
      if (!this.isDestroyed) {
        this.callbacks.onStatusChange('error');
      }
    });
  }

  // 타이머 시작
  private startTimer() {
    if (this.timerInterval) {
      return; // 이미 실행 중이면 무시
    }

    this.timerInterval = window.setInterval(() => {
      if (this.isDestroyed) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        return;
      }

      const remaining = this.expiresAt - Date.now();

      if (remaining <= 0) {
        this.callbacks.onTimeUpdate(0);
        this.callbacks.onStatusChange('expired');
        this.disconnect();
      } else {
        this.callbacks.onTimeUpdate(remaining);
      }
    }, 1000);
  }

  // 새 방 만들기 (링크 공유용)
  async createNewRoom(): Promise<string> {
    if (this.isDestroyed) throw new Error('Service is destroyed');

    this.callbacks.onStatusChange('initializing');

    try {
      const peerId = await this.initPeer();
      const roomId = await createRoom(peerId);

      this.roomId = roomId;
      this.isHost = true;

      // 방 구독 (게스트 입장 감지)
      this.unsubscribeRoom = subscribeToRoom(roomId, (room) => {
        if (this.isDestroyed) return;

        if (room && room.guestPeerId && !this.connection) {
          // 게스트가 들어옴 - 연결 시도
          console.log('[Chat] Guest joined, connecting to:', room.guestPeerId);
          this.callbacks.onStatusChange('connecting');

          // 약간의 딜레이 후 연결 (게스트 PeerJS 준비 대기)
          setTimeout(() => {
            if (this.peer && !this.peer.destroyed && !this.connection) {
              const conn = this.peer.connect(room.guestPeerId!, {
                reliable: true,
                serialization: 'json'
              });
              this.setupConnection(conn);
            }
          }, 500);
        }

        if (room && this.expiresAt === 0) {
          this.expiresAt = room.expiresAt;
          this.startTimer();
        }
      });

      this.callbacks.onStatusChange('waiting');
      this.callbacks.onRoomCreated(roomId);

      return roomId;
    } catch (error) {
      console.error('[Chat] Failed to create room:', error);
      if (!this.isDestroyed) {
        this.callbacks.onStatusChange('error');
      }
      throw error;
    }
  }

  // 특정 방에 참가
  async joinExistingRoom(roomId: string): Promise<boolean> {
    if (this.isDestroyed) return false;

    this.callbacks.onStatusChange('initializing');

    try {
      const peerId = await this.initPeer();
      const room = await joinRoom(roomId, peerId);

      if (!room) {
        console.log('[Chat] Room not found or expired');
        this.callbacks.onStatusChange('error');
        throw new RoomNotFoundError(`Room ${roomId} not found or expired`);
      }

      this.roomId = roomId;
      this.isHost = false;
      this.expiresAt = room.expiresAt;
      this.startTimer();

      console.log('[Chat] Joined room, waiting for host to connect...');
      this.callbacks.onStatusChange('connecting');
      this.callbacks.onRoomCreated(roomId);

      return true;
    } catch (error) {
      console.error('[Chat] Failed to join room:', error);
      if (!this.isDestroyed) {
        this.callbacks.onStatusChange('error');
      }
      throw error;
    }
  }

  // 랜덤 매칭
  async findRandomMatch(): Promise<string | null> {
    if (this.isDestroyed) return null;

    this.callbacks.onStatusChange('initializing');

    try {
      // 만료된 방 정리
      await cleanupExpiredRooms();

      // 대기 중인 방 찾기
      const waitingRoom = await findWaitingRoom();

      if (waitingRoom) {
        // 대기 중인 방 발견 - 참가
        console.log('[Chat] Found waiting room:', waitingRoom.id);
        const success = await this.joinExistingRoom(waitingRoom.id);
        return success ? waitingRoom.id : null;
      } else {
        // 대기 중인 방 없음 - 새로 만들고 대기
        console.log('[Chat] No waiting room, creating new one');
        const roomId = await this.createNewRoom();
        return roomId;
      }
    } catch (error) {
      console.error('[Chat] Failed to find match:', error);
      if (!this.isDestroyed) {
        this.callbacks.onStatusChange('error');
      }
      throw error;
    }
  }

  // 메시지 전송
  sendMessage(text: string): ChatMessage | null {
    if (!this.connection) {
      console.error('[Chat] No connection');
      return null;
    }

    if (!this.connection.open) {
      console.error('[Chat] Connection not open');
      return null;
    }

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'me',
      text,
      timestamp: Date.now()
    };

    try {
      this.connection.send(message);
      console.log('[Chat] Message sent');
      return message;
    } catch (error) {
      console.error('[Chat] Failed to send message:', error);
      return null;
    }
  }

  // 연결 해제
  disconnect() {
    console.log('[Chat] Disconnecting...');
    this.isDestroyed = true;

    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
      this.unsubscribeRoom = null;
    }

    if (this.connection) {
      try {
        this.connection.close();
      } catch (e) {
        console.error('[Chat] Error closing connection:', e);
      }
      this.connection = null;
    }

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {
        console.error('[Chat] Error destroying peer:', e);
      }
      this.peer = null;
    }

    // 호스트만 방 삭제
    if (this.roomId && this.isHost) {
      deleteRoom(this.roomId).catch(console.error);
    }

    this.roomId = null;
    this.isHost = false;
    this.expiresAt = 0;
  }

  // 상태 확인
  isConnected(): boolean {
    return this.connection !== null && this.connection.open === true;
  }

  getRoomId(): string | null {
    return this.roomId;
  }
}
