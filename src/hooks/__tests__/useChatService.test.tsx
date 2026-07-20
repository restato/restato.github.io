import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  chatServiceConstructor: vi.fn(function ChatServiceMock() { return ({
    disconnect: vi.fn(),
    findRandomMatch: vi.fn(),
  }); }),
  isFirebaseConfigured: vi.fn(() => false),
}));

vi.mock('../../lib/chatService', () => ({
  ChatService: mocks.chatServiceConstructor,
}));

vi.mock('../../lib/firebase', () => ({
  isFirebaseConfigured: mocks.isFirebaseConfigured,
}));

import { useChatService } from '../useChatService';

const callbacks = () => ({
  onMessage: vi.fn(),
  onStatusChange: vi.fn(),
  onPeerConnected: vi.fn(),
  onPeerDisconnected: vi.fn(),
  onRoomCreated: vi.fn(),
  onTimeUpdate: vi.fn(),
});

describe('useChatService without Firebase configuration', () => {
  it('keeps a new-chat reconnect local and reports an error without creating ChatService', () => {
    const initial = callbacks();
    const { result } = renderHook(() => useChatService({ ...initial, initialRoomId: null }));
    const next = callbacks();

    result.current.reconnect(next);

    expect(mocks.chatServiceConstructor).not.toHaveBeenCalled();
    expect(next.onStatusChange).toHaveBeenCalledWith('error');
  });
});
