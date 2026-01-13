import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, onValue, remove, onDisconnect } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9cO6TJFoUIFkM4qsPm7v2AiCV-_Oyzls",
  authDomain: "restato-52824.firebaseapp.com",
  databaseURL: "https://restato-52824-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restato-52824",
  storageBucket: "restato-52824.firebasestorage.app",
  messagingSenderId: "713753016756",
  appId: "1:713753016756:web:1a1d7012539b5cf4d55ae1",
  measurementId: "G-S32724KQVZ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 1시간 = 3600000ms
const SESSION_TIMEOUT = 60 * 60 * 1000;

export interface Room {
  id: string;
  createdAt: number;
  hostPeerId: string;
  guestPeerId?: string;
  expiresAt: number;
}

// 방 생성
export async function createRoom(peerId: string): Promise<string> {
  const roomsRef = ref(db, 'rooms');
  const newRoomRef = push(roomsRef);
  const roomId = newRoomRef.key!;

  const now = Date.now();
  const room: Room = {
    id: roomId,
    createdAt: now,
    hostPeerId: peerId,
    expiresAt: now + SESSION_TIMEOUT
  };

  await set(newRoomRef, room);

  // 연결 끊기면 방 삭제
  onDisconnect(newRoomRef).remove();

  return roomId;
}

// 방 참가
export async function joinRoom(roomId: string, peerId: string): Promise<Room | null> {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return null;
  }

  const room = snapshot.val() as Room;

  // 만료된 방
  if (Date.now() > room.expiresAt) {
    await remove(roomRef);
    return null;
  }

  // 게스트로 참가
  await set(ref(db, `rooms/${roomId}/guestPeerId`), peerId);

  return room;
}

// 방 정보 조회
export async function getRoom(roomId: string): Promise<Room | null> {
  const roomRef = ref(db, `rooms/${roomId}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val() as Room;
}

// 방 실시간 구독
export function subscribeToRoom(roomId: string, callback: (room: Room | null) => void): () => void {
  const roomRef = ref(db, `rooms/${roomId}`);

  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as Room);
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

// 대기 중인 방 찾기 (랜덤 매칭)
export async function findWaitingRoom(): Promise<Room | null> {
  const roomsRef = ref(db, 'rooms');
  const snapshot = await get(roomsRef);

  if (!snapshot.exists()) {
    return null;
  }

  const rooms = snapshot.val() as Record<string, Room>;
  const now = Date.now();

  // 게스트가 없고 만료되지 않은 방 찾기
  const waitingRooms = Object.values(rooms).filter(
    room => !room.guestPeerId && room.expiresAt > now
  );

  if (waitingRooms.length === 0) {
    return null;
  }

  // 랜덤 선택
  const randomIndex = Math.floor(Math.random() * waitingRooms.length);
  return waitingRooms[randomIndex];
}

// 방 삭제
export async function deleteRoom(roomId: string): Promise<void> {
  const roomRef = ref(db, `rooms/${roomId}`);
  await remove(roomRef);
}

// 만료된 방 정리 (클라이언트에서 주기적 호출)
export async function cleanupExpiredRooms(): Promise<void> {
  const roomsRef = ref(db, 'rooms');
  const snapshot = await get(roomsRef);

  if (!snapshot.exists()) {
    return;
  }

  const rooms = snapshot.val() as Record<string, Room>;
  const now = Date.now();

  for (const [id, room] of Object.entries(rooms)) {
    if (room.expiresAt < now) {
      await remove(ref(db, `rooms/${id}`));
    }
  }
}

export { db };
