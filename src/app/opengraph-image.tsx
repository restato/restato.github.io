import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '럭키 드로우 게임 - 재미있는 랜덤 게임';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#667eea',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: 60,
          fontWeight: 700,
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 120, marginRight: 20 }}>🎯</div>
          <div style={{ fontSize: 80 }}>럭키 드로우 게임</div>
        </div>
        
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          재미있고 공정한 랜덤 게임들을 무료로 플레이하세요!
        </div>
        
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            gap: 20,
          }}
        >
          <div style={{ fontSize: 40 }}>🎲</div>
          <div style={{ fontSize: 40 }}>🃏</div>
          <div style={{ fontSize: 40 }}>🎫</div>
          <div style={{ fontSize: 40 }}>🪙</div>
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          restato.github.io
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
