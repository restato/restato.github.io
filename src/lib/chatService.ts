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

  constructor(callbacks: ChatCallbacks) {
    this.callbacks = callbacks;
  }

  // PeerJS 초기화
  private initPeer(): Promise<string> {
    return new Promise((resolve, reject) => {
      // 고유 ID 생성
      const peerId = `restato-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      this.peer = new Peer(peerId, {
        debug: 1, // 디버깅용 로그 레벨
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
          ]
        }
      });

      this.peer.on('open', (id) => {
        console.log('PeerJS connected with ID:', id);
        resolve(id);
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        this.callbacks.onStatusChange('error');
        reject(err);
      });

      this.peer.on('connection', (conn) => {
        console.log('Incoming connection from:', conn.peer);
        this.setupConnection(conn);
      });

      this.peer.on('disconnected', () => {
        console.log('PeerJS signaling server disconnected, attempting to reconnect...');
        // 시그널링 서버 연결 끊김 - 재연결 시도
        // peer 연결은 여전히 유지될 수 있으므로 바로 disconnected로 변경하지 않음
        if (this.peer && !this.peer.destroyed) {
          this.peer.reconnect();
        }
      });
    });
  }

  // 연결 설정
  private setupConnection(conn: DataConnection) {
    this.connection = conn;

    // 연결 타임아웃 설정 (30초)
    const connectionTimeout = window.setTimeout(() => {
      if (!conn.open) {
        console.log('Connection timeout');
        conn.close();
        this.callbacks.onStatusChange('error');
      }
    }, 30000);

    conn.on('open', () => {
      clearTimeout(connectionTimeout);
      console.log('Data connection open');
      this.callbacks.onStatusChange('connected');
      this.callbacks.onPeerConnected();
    });

    conn.on('data', (data) => {
      const message = data as ChatMessage;
      message.sender = 'peer';
      this.callbacks.onMessage(message);
    });

    conn.on('close', () => {
      clearTimeout(connectionTimeout);
      console.log('Connection closed');
      this.callbacks.onPeerDisconnected();
      this.callbacks.onStatusChange('disconnected');
      this.connection = null;
    });

    conn.on('error', (err) => {
      clearTimeout(connectionTimeout);
      console.error('Connection error:', err);
      this.callbacks.onStatusChange('error');
    });
  }

  // 타이머 시작
  private startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = window.setInterval(() => {
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
    this.callbacks.onStatusChange('initializing');

    try {
      const peerId = await this.initPeer();
      const roomId = await createRoom(peerId);

      this.roomId = roomId;
      this.isHost = true;

      // 방 구독 (게스트 입장 감지)
      this.unsubscribeRoom = subscribeToRoom(roomId, (room) => {
        if (room && room.guestPeerId && !this.connection) {
          // 게스트가 들어옴 - 연결 시도
          console.log('Guest joined, connecting to:', room.guestPeerId);
          this.callbacks.onStatusChange('connecting');
          const conn = this.peer!.connect(room.guestPeerId, { reliable: true });
          this.setupConnection(conn);
        }

        if (room && this.expiresAt === 0) {
          // 타이머는 한 번만 시작
          this.expiresAt = room.expiresAt;
          this.startTimer();
        }
      });

      this.callbacks.onStatusChange('waiting');
      this.callbacks.onRoomCreated(roomId);

      return roomId;
    } catch (error) {
      console.error('Failed to create room:', error);
      this.callbacks.onStatusChange('error');
      throw error;
    }
  }

  // 특정 방에 참가
  async joinExistingRoom(roomId: string): Promise<boolean> {
    this.callbacks.onStatusChange('initializing');

    try {
      const peerId = await this.initPeer();
      const room = await joinRoom(roomId, peerId);

      if (!room) {
        this.callbacks.onStatusChange('error');
        return false;
      }

      this.roomId = roomId;
      this.isHost = false;
      this.expiresAt = room.expiresAt;
      this.startTimer();

      // 호스트가 연결해올 때까지 대기
      this.callbacks.onStatusChange('connecting');

      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      this.callbacks.onStatusChange('error');
      throw error;
    }
  }

  // 랜덤 매칭
  async findRandomMatch(): Promise<string | null> {
    this.callbacks.onStatusChange('initializing');

    try {
      // 만료된 방 정리
      await cleanupExpiredRooms();

      // 대기 중인 방 찾기
      const waitingRoom = await findWaitingRoom();

      if (waitingRoom) {
        // 대기 중인 방 발견 - 참가
        console.log('Found waiting room:', waitingRoom.id);
        const success = await this.joinExistingRoom(waitingRoom.id);
        return success ? waitingRoom.id : null;
      } else {
        // 대기 중인 방 없음 - 새로 만들고 대기
        console.log('No waiting room, creating new one');
        const roomId = await this.createNewRoom();
        return roomId;
      }
    } catch (error) {
      console.error('Failed to find match:', error);
      this.callbacks.onStatusChange('error');
      throw error;
    }
  }

  // 메시지 전송
  sendMessage(text: string): ChatMessage | null {
    if (!this.connection || this.connection.open === false) {
      console.error('No active connection');
      return null;
    }

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'me',
      text,
      timestamp: Date.now()
    };

    this.connection.send(message);
    return message;
  }

  // 연결 해제
  disconnect() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
      this.unsubscribeRoom = null;
    }

    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    if (this.roomId && this.isHost) {
      deleteRoom(this.roomId).catch(console.error);
    }

    this.roomId = null;
    this.isHost = false;
  }

  // 상태 확인
  isConnected(): boolean {
    return this.connection !== null && this.connection.open === true;
  }

  getRoomId(): string | null {
    return this.roomId;
  }
}
