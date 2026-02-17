import { describe, it, expect } from 'vitest';
import { IMAGE_CROP_PRESETS, getCoverCropRect } from '../imageCropPresets';

describe('imageCropPresets', () => {
  it('provides 10 curated presets', () => {
    expect(IMAGE_CROP_PRESETS).toHaveLength(10);
    expect(IMAGE_CROP_PRESETS.map(preset => preset.id)).toContain('slack-avatar');
    expect(IMAGE_CROP_PRESETS.map(preset => preset.id)).toContain('iphone-6-9');
  });

  it('calculates centered crop area for wider source images', () => {
    const crop = getCoverCropRect(2000, 1000, 1000, 1000, 50, 50);

    expect(crop.width).toBe(1000);
    expect(crop.height).toBe(1000);
    expect(crop.x).toBe(500);
    expect(crop.y).toBe(0);
  });

  it('respects focus point when source is taller than target ratio', () => {
    const crop = getCoverCropRect(1000, 2000, 1000, 1000, 0, 100);

    expect(crop.width).toBe(1000);
    expect(crop.height).toBe(1000);
    expect(crop.x).toBe(0);
    expect(crop.y).toBe(1000);
  });
});
