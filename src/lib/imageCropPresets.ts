export interface ImagePreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const IMAGE_CROP_PRESETS: ImagePreset[] = [
  { id: 'slack-avatar', label: 'Slack 프로필 (512×512)', width: 512, height: 512 },
  { id: 'slack-emoji', label: 'Slack 커스텀 이모지 (128×128)', width: 128, height: 128 },
  { id: 'iphone-6-9', label: 'iPhone 6.9" App Store (1290×2796)', width: 1290, height: 2796 },
  { id: 'iphone-6-5', label: 'iPhone 6.5" App Store (1284×2778)', width: 1284, height: 2778 },
  { id: 'iphone-6-3', label: 'iPhone 6.3" App Store (1179×2556)', width: 1179, height: 2556 },
  { id: 'youtube-thumbnail', label: 'YouTube 썸네일 (1280×720)', width: 1280, height: 720 },
  { id: 'instagram-post', label: 'Instagram 피드 정사각형 (1080×1080)', width: 1080, height: 1080 },
  { id: 'instagram-story', label: 'Instagram 스토리 (1080×1920)', width: 1080, height: 1920 },
  { id: 'x-header', label: 'X 헤더 (1500×500)', width: 1500, height: 500 },
  { id: 'og-image', label: 'Open Graph 썸네일 (1200×630)', width: 1200, height: 630 },
];

export function getCoverCropRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  focusXPercent: number,
  focusYPercent: number
): CropRect {
  const srcAspect = sourceWidth / sourceHeight;
  const targetAspect = targetWidth / targetHeight;

  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;

  if (srcAspect > targetAspect) {
    cropWidth = sourceHeight * targetAspect;
  } else if (srcAspect < targetAspect) {
    cropHeight = sourceWidth / targetAspect;
  }

  const maxX = sourceWidth - cropWidth;
  const maxY = sourceHeight - cropHeight;

  const x = maxX * (Math.min(Math.max(focusXPercent, 0), 100) / 100);
  const y = maxY * (Math.min(Math.max(focusYPercent, 0), 100) / 100);

  return { x, y, width: cropWidth, height: cropHeight };
}
