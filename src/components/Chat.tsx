import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatService, type ChatMessage, type ConnectionStatus } from '../lib/chatService';

// URL hash에서 roomId 추출
function getRoomIdFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1); // '#' 제거
  return hash || null;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<ConnectionStatus>('initializing');
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const chatServiceRef = useRef<ChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStartedRef = useRef(false); // 중복 초기화 방지

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 채팅 서비스 초기화 (한 번만 실행)
  useEffect(() => {
    // 이미 시작했으면 무시 (React Strict Mode 대응)
    if (isStartedRef.current) {
      console.log('[Chat UI] Already started, skipping...');
      return;
    }
    isStartedRef.current = true;

    const initialRoomId = getRoomIdFromHash();
    if (initialRoomId) {
      setCurrentRoomId(initialRoomId);
    }

    console.log('[Chat UI] Starting chat service, roomId:', initialRoomId);

    const service = new ChatService({
      onMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onStatusChange: (newStatus) => {
        console.log('[Chat UI] Status changed:', newStatus);
        setStatus(newStatus);
      },
      onPeerConnected: () => {
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          sender: 'peer' as const,
          text: '상대방이 연결되었습니다!',
          timestamp: Date.now()
        }]);
      },
      onPeerDisconnected: () => {
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          sender: 'peer' as const,
          text: '상대방과의 연결이 끊어졌습니다.',
          timestamp: Date.now()
        }]);
      },
      onRoomCreated: (roomId) => {
        console.log('[Chat UI] Room created/joined:', roomId);
        setCurrentRoomId(roomId);
      },
      onTimeUpdate: (remainingMs) => {
        setRemainingTime(remainingMs);
      }
    });

    chatServiceRef.current = service;

    // 초기화
    if (initialRoomId) {
      service.joinExistingRoom(initialRoomId);
    } else {
      service.findRandomMatch();
    }

    // 페이지 종료 시 정리
    const handleBeforeUnload = () => {
      service.disconnect();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // React Strict Mode에서는 cleanup이 호출되지만,
      // isStartedRef 덕분에 다시 초기화되지 않음
      // 실제 언마운트 시에만 disconnect
      if (!document.hidden) {
        // 페이지가 보이는 상태에서 언마운트 = 실제 컴포넌트 제거
        service.disconnect();
        isStartedRef.current = false;
      }
    };
  }, []); // 빈 의존성 - 마운트 시 한 번만 실행

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatServiceRef.current) return;

    const message = chatServiceRef.current.sendMessage(inputText.trim());
    if (message) {
      setMessages(prev => [...prev, message]);
      setInputText('');
    }
  };

  const handleCopyLink = async () => {
    if (!currentRoomId) return;

    const url = `${window.location.origin}/chat#${currentRoomId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewChat = () => {
    if (chatServiceRef.current) {
      chatServiceRef.current.disconnect();
    }
    setMessages([]);
    setCurrentRoomId(null);
    setStatus('initializing');

    const service = new ChatService({
      onMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onStatusChange: (newStatus) => {
        console.log('[Chat UI] Status changed:', newStatus);
        setStatus(newStatus);
      },
      onPeerConnected: () => {
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          sender: 'peer' as const,
          text: '상대방이 연결되었습니다!',
          timestamp: Date.now()
        }]);
      },
      onPeerDisconnected: () => {
        setMessages(prev => [...prev, {
          id: `system-${Date.now()}`,
          sender: 'peer' as const,
          text: '상대방과의 연결이 끊어졌습니다.',
          timestamp: Date.now()
        }]);
      },
      onRoomCreated: (roomId) => {
        console.log('[Chat UI] Room created/joined:', roomId);
        setCurrentRoomId(roomId);
      },
      onTimeUpdate: (remainingMs) => {
        setRemainingTime(remainingMs);
      }
    });

    chatServiceRef.current = service;
    service.findRandomMatch();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (status) {
      case 'initializing':
        return '초기화 중...';
      case 'waiting':
        return '상대방을 기다리는 중...';
      case 'connecting':
        return '연결 중...';
      case 'connected':
        return '연결됨';
      case 'disconnected':
        return '연결 끊김';
      case 'expired':
        return '세션 만료';
      case 'error':
        return '오류 발생';
      default:
        return status;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'waiting':
      case 'connecting':
      case 'initializing':
        return 'bg-yellow-500';
      case 'disconnected':
      case 'expired':
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-card)]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-[var(--color-text-muted)]">{getStatusText()}</span>
        </div>
        {remainingTime > 0 && (
          <div className="text-sm text-[var(--color-text-muted)]">
            남은 시간: {formatTime(remainingTime)}
          </div>
        )}
      </div>

      {/* 공유 링크 */}
      {currentRoomId && status === 'waiting' && (
        <div className="px-4 py-3 bg-blue-500/10 border-b border-[var(--color-border)]">
          <p className="text-sm mb-2 text-[var(--color-text)]">이 링크를 공유하세요:</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/chat#${currentRoomId}`}
              className="flex-1 px-3 py-2 text-sm rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && status === 'connected' && (
          <p className="text-center text-[var(--color-text-muted)] text-sm">
            메시지를 입력하여 대화를 시작하세요!
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                msg.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]'
              }`}
            >
              <p className="break-words">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-[var(--color-text-muted)]'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 만료/에러 상태 */}
      {(status === 'expired' || status === 'error' || status === 'disconnected') && (
        <div className="px-4 py-3 bg-red-500/10 border-t border-[var(--color-border)]">
          <p className="text-sm text-center mb-2 text-[var(--color-text)]">
            {status === 'expired' ? '세션이 만료되었습니다.' : '연결이 끊어졌습니다.'}
          </p>
          <button
            onClick={handleNewChat}
            className="w-full py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            새 대화 시작
          </button>
        </div>
      )}

      {/* 입력 영역 */}
      {status === 'connected' && (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--color-border)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              전송
            </button>
          </div>
        </form>
      )}

      {/* 대기 중일 때 입력창 대신 안내 */}
      {(status === 'waiting' || status === 'connecting' || status === 'initializing') && (
        <div className="p-4 border-t border-[var(--color-border)] text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)]">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">
              {status === 'waiting' ? '상대방이 접속하기를 기다리는 중...' : '연결 준비 중...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
