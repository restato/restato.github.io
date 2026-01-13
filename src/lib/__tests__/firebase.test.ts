import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock Firebase before importing the module
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/database', async () => {
  const {
    get,
    set,
    push,
    remove,
    onValue,
    ref,
    getDatabase,
    resetMockDatabase,
    setMockData,
  } = await import('../../test/mocks/firebase');

  return {
    getDatabase,
    ref,
    set,
    get,
    push,
    onValue,
    remove,
  };
});

import { createRoom, joinRoom, findWaitingRoom, cleanupExpiredRooms, getRoom } from '../firebase';
import { resetMockDatabase, setMockData } from '../../test/mocks/firebase';

describe('Firebase Functions', () => {
  beforeEach(() => {
    resetMockDatabase();
    vi.clearAllMocks();
  });

  describe('createRoom', () => {
    it('should create a room with valid peerId', async () => {
      const peerId = 'test-peer-123';
      const roomId = await createRoom(peerId);

      expect(roomId).toBeDefined();
      expect(typeof roomId).toBe('string');
    });

    it('should create room with correct structure', async () => {
      const peerId = 'test-peer-123';
      const beforeTime = Date.now();
      const roomId = await createRoom(peerId);
      const afterTime = Date.now();

      const room = await getRoom(roomId);

      expect(room).toBeDefined();
      expect(room?.hostPeerId).toBe(peerId);
      expect(room?.createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(room?.createdAt).toBeLessThanOrEqual(afterTime);
      expect(room?.expiresAt).toBeGreaterThan(room!.createdAt);
      expect(room?.guestPeerId).toBeUndefined();
    });

    it('should set expiration time 1 hour from now', async () => {
      const peerId = 'test-peer-123';
      const now = Date.now();
      const roomId = await createRoom(peerId);
      const room = await getRoom(roomId);

      const expectedExpiration = now + 60 * 60 * 1000; // 1 hour
      const tolerance = 1000; // 1 second tolerance

      expect(room?.expiresAt).toBeGreaterThanOrEqual(expectedExpiration - tolerance);
      expect(room?.expiresAt).toBeLessThanOrEqual(expectedExpiration + tolerance);
    });
  });

  describe('joinRoom', () => {
    it('should join an existing room', async () => {
      const hostPeerId = 'host-123';
      const guestPeerId = 'guest-456';

      const roomId = await createRoom(hostPeerId);
      const room = await joinRoom(roomId, guestPeerId);

      expect(room).toBeDefined();
      expect(room?.hostPeerId).toBe(hostPeerId);
      expect(room?.guestPeerId).toBe(guestPeerId);
    });

    it('should return null for non-existent room', async () => {
      const guestPeerId = 'guest-456';
      const room = await joinRoom('non-existent-room', guestPeerId);

      expect(room).toBeNull();
    });

    it('should return null for expired room', async () => {
      const hostPeerId = 'host-123';
      const guestPeerId = 'guest-456';

      // Create room and manually set it as expired
      const roomId = await createRoom(hostPeerId);
      setMockData(`rooms/${roomId}`, {
        id: roomId,
        hostPeerId,
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        expiresAt: Date.now() - 60 * 60 * 1000, // 1 hour ago (expired)
      });

      const room = await joinRoom(roomId, guestPeerId);

      expect(room).toBeNull();
    });
  });

  describe('findWaitingRoom', () => {
    it('should return null when no rooms exist', async () => {
      const room = await findWaitingRoom();
      expect(room).toBeNull();
    });

    it('should find a waiting room without guest', async () => {
      const hostPeerId = 'host-123';
      await createRoom(hostPeerId);

      const room = await findWaitingRoom();

      expect(room).toBeDefined();
      expect(room?.hostPeerId).toBe(hostPeerId);
      expect(room?.guestPeerId).toBeUndefined();
    });

    it('should not return rooms that already have a guest', async () => {
      const hostPeerId = 'host-123';
      const guestPeerId = 'guest-456';

      const roomId = await createRoom(hostPeerId);
      await joinRoom(roomId, guestPeerId);

      const room = await findWaitingRoom();

      // Should be null since the only room has a guest
      expect(room).toBeNull();
    });

    it('should not return expired rooms', async () => {
      const hostPeerId = 'host-123';
      const roomId = await createRoom(hostPeerId);

      // Manually expire the room
      setMockData(`rooms/${roomId}`, {
        id: roomId,
        hostPeerId,
        createdAt: Date.now() - 2 * 60 * 60 * 1000,
        expiresAt: Date.now() - 1000, // expired
      });

      const room = await findWaitingRoom();

      expect(room).toBeNull();
    });
  });

  describe('cleanupExpiredRooms', () => {
    it('should remove expired rooms', async () => {
      const now = Date.now();

      // Create expired room
      const expiredRoomId = await createRoom('expired-host');
      setMockData(`rooms/${expiredRoomId}`, {
        id: expiredRoomId,
        hostPeerId: 'expired-host',
        createdAt: now - 2 * 60 * 60 * 1000,
        expiresAt: now - 1000, // expired
      });

      // Create valid room
      const validRoomId = await createRoom('valid-host');

      await cleanupExpiredRooms();

      const expiredRoom = await getRoom(expiredRoomId);
      const validRoom = await getRoom(validRoomId);

      expect(expiredRoom).toBeNull();
      expect(validRoom).toBeDefined();
    });

    it('should handle empty rooms collection', async () => {
      await expect(cleanupExpiredRooms()).resolves.not.toThrow();
    });
  });
});
