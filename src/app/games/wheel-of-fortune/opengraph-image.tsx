import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '운명의 룰렛 - 온라인 룰렛 게임';
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
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 120, marginRight: 30 }}>🎯</div>
          <div style={{ fontSize: 80 }}>운명의 룰렛</div>
        </div>
        
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
            zIndex: 1,
          }}
        >
          커스터마이징 가능한 온라인 룰렛 게임!<br />
          공정한 랜덤 선택을 경험하세요.
        </div>
        
        <div
          style={{
            display: 'flex',
            marginTop: 50,
            gap: 30,
            zIndex: 1,
          }}
        >
          <div 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              padding: '15px 25px',
              fontSize: 24,
            }}
          >
            무료 플레이
          </div>
          <div 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              padding: '15px 25px',
              fontSize: 24,
            }}
          >
            공정한 결과
          </div>
          <div 
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 20,
              padding: '15px 25px',
              fontSize: 24,
            }}
          >
            커스터마이징
          </div>
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1,
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
