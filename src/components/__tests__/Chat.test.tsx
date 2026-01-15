import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chat from '../Chat';

// Mock useChatService
const mockSendMessage = vi.fn();
const mockReconnect = vi.fn();
let mockOnStatusChange: ((status: string) => void) | null = null;
let mockOnMessage: ((message: unknown) => void) | null = null;
let mockOnPeerConnected: (() => void) | null = null;
let mockOnRoomCreated: ((roomId: string) => void) | null = null;
let mockOnTimeUpdate: ((time: number) => void) | null = null;

vi.mock('../../hooks/useChatService', () => ({
  useChatService: (options: {
    onMessage: (message: unknown) => void;
    onStatusChange: (status: string) => void;
    onPeerConnected: () => void;
    onPeerDisconnected: () => void;
    onRoomCreated: (roomId: string) => void;
    onTimeUpdate: (time: number) => void;
  }) => {
    mockOnStatusChange = options.onStatusChange;
    mockOnMessage = options.onMessage;
    mockOnPeerConnected = options.onPeerConnected;
    mockOnRoomCreated = options.onRoomCreated;
    mockOnTimeUpdate = options.onTimeUpdate;
    return {
      sendMessage: mockSendMessage,
      reconnect: mockReconnect,
    };
  },
}));

// Mock useTranslation
vi.mock('../../i18n/useTranslation', () => ({
  useTranslation: () => ({
    lang: 'ko',
    t: (obj: Record<string, string>) => obj.ko || obj.en || Object.values(obj)[0],
    changeLanguage: vi.fn(),
    translations: {
      chat: {
        pageTitle: { ko: '낯선 사람 채팅', en: 'Stranger Chat', ja: '見知らぬ人とチャット' },
        status: {
          initializing: { ko: '초기화 중...', en: 'Initializing...', ja: '初期化中...' },
          waiting: { ko: '상대방을 기다리는 중...', en: 'Waiting for peer...', ja: '相手を待っています...' },
          connecting: { ko: '연결 중...', en: 'Connecting...', ja: '接続中...' },
          connected: { ko: '연결됨', en: 'Connected', ja: '接続済み' },
          disconnected: { ko: '연결 끊김', en: 'Disconnected', ja: '切断されました' },
          expired: { ko: '세션 만료', en: 'Session Expired', ja: 'セッション期限切れ' },
          error: { ko: '오류 발생', en: 'Error Occurred', ja: 'エラーが発生しました' },
        },
        ui: {
          shareLink: { ko: '이 링크를 공유하세요:', en: 'Share this link:', ja: 'このリンクを共有してください:' },
          copy: { ko: '복사', en: 'Copy', ja: 'コピー' },
          copied: { ko: '복사됨!', en: 'Copied!', ja: 'コピーしました！' },
          send: { ko: '전송', en: 'Send', ja: '送信' },
          inputPlaceholder: { ko: '메시지를 입력하세요...', en: 'Type a message...', ja: 'メッセージを入力...' },
          remainingTime: { ko: '남은 시간:', en: 'Time left:', ja: '残り時間:' },
          newChat: { ko: '새 대화 시작', en: 'Start New Chat', ja: '新しいチャットを開始' },
          myMessage: { ko: '내 메시지', en: 'My message', ja: '自分のメッセージ' },
          peerMessage: { ko: '상대방 메시지', en: "Peer's message", ja: '相手のメッセージ' },
          messageInputForm: { ko: '메시지 입력 폼', en: 'Message input form', ja: 'メッセージ入力フォーム' },
        },
        messages: {
          peerConnected: { ko: '상대방이 연결되었습니다!', en: 'Peer connected!', ja: '相手が接続されました！' },
          peerDisconnected: { ko: '상대방과의 연결이 끊어졌습니다.', en: 'Peer disconnected.', ja: '相手との接続が切断されました。' },
          sessionExpired: { ko: '세션이 만료되었습니다.', en: 'Session has expired.', ja: 'セッションが期限切れになりました。' },
          connectionLost: { ko: '연결이 끊어졌습니다.', en: 'Connection lost.', ja: '接続が失われました。' },
          waitingMessage: { ko: '상대방이 접속하기를 기다리는 중...', en: 'Waiting for peer to join...', ja: '相手の参加を待っています...' },
          connectingMessage: { ko: '연결 준비 중...', en: 'Preparing connection...', ja: '接続準備中...' },
          emptyChat: { ko: '메시지를 입력하여 대화를 시작하세요!', en: 'Type a message to start chatting!', ja: 'メッセージを入力して会話を始めましょう！' },
        },
      },
    },
  }),
}));

// Mock useScrollToBottom
vi.mock('../../hooks/useScrollToBottom', () => ({
  useScrollToBottom: () => ({ current: null }),
}));

// Mock useTimeFormat
vi.mock('../../hooks/useTimeFormat', () => ({
  useTimeFormat: () => ({
    formatTime: (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
  }),
}));

// Mock window.location
const mockLocation = {
  hash: '',
  origin: 'https://example.com',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock clipboard API
const mockWriteText = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal('navigator', {
  ...navigator,
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.hash = '';
    mockOnStatusChange = null;
    mockOnMessage = null;
    mockOnPeerConnected = null;
    mockOnRoomCreated = null;
    mockOnTimeUpdate = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders chat component with initializing status', () => {
      render(<Chat />);
      expect(screen.getByText('초기화 중...')).toBeInTheDocument();
    });

    it('displays loading spinner during initialization', () => {
      render(<Chat />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Status Changes', () => {
    it('shows waiting status when waiting for peer', async () => {
      render(<Chat />);

      // Simulate status change to waiting
      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('waiting');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('상대방을 기다리는 중...')).toBeInTheDocument();
      });
    });

    it('shows connected status when peer connects', async () => {
      render(<Chat />);

      // Simulate status change to connected
      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('연결됨')).toBeInTheDocument();
      });
    });

    it('shows disconnected status', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('disconnected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('연결 끊김')).toBeInTheDocument();
      });
    });

    it('shows expired status', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('expired');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('세션 만료')).toBeInTheDocument();
      });
    });
  });

  describe('Share Link', () => {
    it('shows share link when room is created and waiting', async () => {
      render(<Chat />);

      // Simulate room creation and waiting status
      await act(async () => {
        if (mockOnRoomCreated) {
          mockOnRoomCreated('test-room-123');
        }
        if (mockOnStatusChange) {
          mockOnStatusChange('waiting');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('이 링크를 공유하세요:')).toBeInTheDocument();
        expect(screen.getByDisplayValue(/test-room-123/)).toBeInTheDocument();
      });
    });

    it('copies link to clipboard when copy button is clicked', async () => {
      render(<Chat />);

      // Set up room and waiting status
      await act(async () => {
        if (mockOnRoomCreated) {
          mockOnRoomCreated('test-room-123');
        }
        if (mockOnStatusChange) {
          mockOnStatusChange('waiting');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('복사')).toBeInTheDocument();
      });

      const copyButton = screen.getByText('복사');
      await act(async () => {
        copyButton.click();
      });

      expect(mockWriteText).toHaveBeenCalledWith(
        'https://example.com/anonymous-chat#test-room-123'
      );

      await waitFor(() => {
        expect(screen.getByText('복사됨!')).toBeInTheDocument();
      });
    });
  });

  describe('Message Input', () => {
    it('shows input field when connected', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('메시지를 입력하세요...')).toBeInTheDocument();
        expect(screen.getByText('전송')).toBeInTheDocument();
      });
    });

    it('does not show input field when not connected', () => {
      render(<Chat />);
      expect(screen.queryByPlaceholderText('메시지를 입력하세요...')).not.toBeInTheDocument();
    });

    it('sends message when form is submitted', async () => {
      mockSendMessage.mockReturnValue({
        id: 'msg-1',
        sender: 'me',
        text: 'Hello',
        timestamp: Date.now(),
      });

      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('메시지를 입력하세요...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('메시지를 입력하세요...');
      await act(async () => {
        input.focus();
        await new Promise(r => setTimeout(r, 0));
      });

      // Type into input
      await act(async () => {
        const event = new Event('input', { bubbles: true });
        Object.defineProperty(event, 'target', { value: { value: 'Hello' } });
        input.value = 'Hello';
        input.dispatchEvent(event);
      });

      const form = screen.getByRole('form');
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });

      expect(mockSendMessage).toHaveBeenCalledWith('Hello');
    });

    it('does not send empty message', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('전송')).toBeInTheDocument();
      });

      const form = screen.getByRole('form');
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });

      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('disables send button when input is empty', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        const sendButton = screen.getByText('전송');
        expect(sendButton).toBeDisabled();
      });
    });
  });

  describe('Messages Display', () => {
    it('displays received messages', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
        if (mockOnMessage) {
          mockOnMessage({
            id: 'msg-1',
            sender: 'peer',
            text: 'Hello from peer',
            timestamp: Date.now(),
          });
        }
      });

      await waitFor(() => {
        expect(screen.getByText('Hello from peer')).toBeInTheDocument();
      });
    });

    it('shows empty chat message when connected with no messages', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('메시지를 입력하여 대화를 시작하세요!')).toBeInTheDocument();
      });
    });
  });

  describe('Remaining Time', () => {
    it('displays remaining time when available', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnTimeUpdate) {
          mockOnTimeUpdate(1800000); // 30 minutes
        }
      });

      await waitFor(() => {
        expect(screen.getByText(/남은 시간/)).toBeInTheDocument();
      });
    });
  });

  describe('New Chat', () => {
    it('shows new chat button when disconnected', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('disconnected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('새 대화 시작')).toBeInTheDocument();
      });
    });

    it('shows new chat button when expired', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('expired');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('새 대화 시작')).toBeInTheDocument();
      });
    });

    it('calls reconnect when new chat button is clicked', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('disconnected');
        }
      });

      await waitFor(() => {
        expect(screen.getByText('새 대화 시작')).toBeInTheDocument();
      });

      const newChatButton = screen.getByText('새 대화 시작');
      await act(async () => {
        newChatButton.click();
      });

      expect(mockReconnect).toHaveBeenCalled();
    });
  });

  describe('Peer Events', () => {
    it('adds system message when peer connects', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
        if (mockOnPeerConnected) {
          mockOnPeerConnected();
        }
      });

      await waitFor(() => {
        expect(screen.getByText('상대방이 연결되었습니다!')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', async () => {
      render(<Chat />);

      await act(async () => {
        if (mockOnStatusChange) {
          mockOnStatusChange('connected');
        }
      });

      await waitFor(() => {
        expect(screen.getByRole('form')).toHaveAttribute('aria-label', '메시지 입력 폼');
        expect(screen.getByRole('log')).toBeInTheDocument();
      });
    });

    it('has live regions for status updates', () => {
      render(<Chat />);
      const statusElements = screen.getAllByRole('status');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });
});
