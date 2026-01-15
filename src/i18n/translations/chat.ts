export const chatTranslations = {
  // 페이지
  pageTitle: {
    ko: '익명 채팅',
    en: 'Anonymous Chat',
    ja: '匿名チャット'
  },
  pageDescription: {
    ko: '익명으로 낯선 사람과 1:1 실시간 채팅. P2P 연결로 대화 내용이 서버에 저장되지 않습니다.',
    en: 'Chat anonymously with strangers in real-time. P2P connection means nothing is stored on servers.',
    ja: '匿名で見知らぬ人と1:1リアルタイムチャット。P2P接続で会話内容はサーバーに保存されません。'
  },

  // 연결 상태
  status: {
    initializing: { ko: '초기화 중...', en: 'Initializing...', ja: '初期化中...' },
    waiting: { ko: '상대방을 기다리는 중...', en: 'Waiting for peer...', ja: '相手を待っています...' },
    connecting: { ko: '연결 중...', en: 'Connecting...', ja: '接続中...' },
    connected: { ko: '연결됨', en: 'Connected', ja: '接続済み' },
    disconnected: { ko: '연결 끊김', en: 'Disconnected', ja: '切断されました' },
    expired: { ko: '세션 만료', en: 'Session Expired', ja: 'セッション期限切れ' },
    error: { ko: '오류 발생', en: 'Error Occurred', ja: 'エラーが発生しました' },
  },

  // UI 요소
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

  // 메시지
  messages: {
    peerConnected: {
      ko: '상대방이 연결되었습니다!',
      en: 'Peer connected!',
      ja: '相手が接続されました！'
    },
    peerDisconnected: {
      ko: '상대방과의 연결이 끊어졌습니다.',
      en: 'Peer disconnected.',
      ja: '相手との接続が切断されました。'
    },
    sessionExpired: {
      ko: '세션이 만료되었습니다.',
      en: 'Session has expired.',
      ja: 'セッションが期限切れになりました。'
    },
    connectionLost: {
      ko: '연결이 끊어졌습니다.',
      en: 'Connection lost.',
      ja: '接続が失われました。'
    },
    waitingMessage: {
      ko: '상대방이 접속하기를 기다리는 중...',
      en: 'Waiting for peer to join...',
      ja: '相手の参加を待っています...'
    },
    connectingMessage: {
      ko: '연결 준비 중...',
      en: 'Preparing connection...',
      ja: '接続準備中...'
    },
    emptyChat: {
      ko: '메시지를 입력하여 대화를 시작하세요!',
      en: 'Type a message to start chatting!',
      ja: 'メッセージを入力して会話を始めましょう！'
    },
  },

  // 사용 방법
  howToUse: {
    title: { ko: '사용 방법', en: 'How to Use', ja: '使い方' },
    step1: {
      ko: '페이지 접속 시 자동으로 대기 중인 사람과 매칭됩니다',
      en: 'Automatically matches with waiting users on page load',
      ja: 'ページアクセス時に待機中のユーザーと自動マッチング'
    },
    step2: {
      ko: '대기 중인 사람이 없으면 새 채팅방이 생성됩니다',
      en: 'Creates a new room if no one is waiting',
      ja: '待機中のユーザーがいない場合、新しいチャットルームが作成されます'
    },
    step3: {
      ko: '생성된 링크를 공유하면 특정 사람과 대화할 수 있습니다',
      en: 'Share the link to chat with a specific person',
      ja: '生成されたリンクを共有すると特定の人と会話できます'
    },
    step4: {
      ko: '모든 대화는 P2P로 이루어지며 서버에 저장되지 않습니다',
      en: 'All messages are P2P and not stored on servers',
      ja: 'すべての会話はP2Pで行われ、サーバーに保存されません'
    },
    step5: {
      ko: '세션은 최대 1시간 후 자동 종료됩니다',
      en: 'Sessions automatically end after 1 hour',
      ja: 'セッションは最大1時間後に自動終了します'
    },
  },

  // 설명
  description: {
    p2p: {
      ko: '서버 없이 브라우저 간 직접 연결되는 P2P 채팅입니다.',
      en: 'P2P chat with direct browser-to-browser connection, no server.',
      ja: 'サーバーなしでブラウザ間で直接接続されるP2Pチャットです。'
    },
    privacy: {
      ko: '대화 내용은 저장되지 않으며, 세션은 최대 1시간 유지됩니다.',
      en: 'Messages are not stored, sessions last up to 1 hour.',
      ja: '会話内容は保存されず、セッションは最大1時間保持されます。'
    },
  },

  // 보안 안내
  security: {
    title: { ko: '안심하고 대화하세요', en: 'Chat with confidence', ja: '安心してチャット' },
    noStorage: { ko: '대화 내용이 저장되지 않습니다', en: 'Messages are not stored', ja: 'メッセージは保存されません' },
    p2p: { ko: 'P2P 직접 연결', en: 'Direct P2P connection', ja: 'P2Pダイレクト接続' },
    sessionLimit: { ko: '1시간 후 자동 종료', en: 'Auto-ends after 1 hour', ja: '1時間後に自動終了' },
  },

  // 간단 가이드
  quickGuide: {
    share: { ko: '링크 공유로 친구 초대', en: 'Share link to invite friends', ja: 'リンク共有で友達を招待' },
    random: { ko: '또는 랜덤 매칭 대기', en: 'Or wait for random match', ja: 'またはランダムマッチング待機' },
  },
} as const;
