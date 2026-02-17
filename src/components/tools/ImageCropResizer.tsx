import { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { IMAGE_CROP_PRESETS, getCoverCropRect } from '../../lib/imageCropPresets';

interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageCropResizer() {
  const { t, translations } = useTranslation();
  const tc = translations.tools.common;

  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState(IMAGE_CROP_PRESETS[0].id);
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedPreset = IMAGE_CROP_PRESETS.find(preset => preset.id === selectedPresetId) ?? IMAGE_CROP_PRESETS[0];

  const loadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setOriginal({
        file,
        url,
        width: img.width,
        height: img.height,
      });
      setResult(null);
    };

    img.src = url;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  const processImage = useCallback(() => {
    if (!original || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = selectedPreset.width;
    canvas.height = selectedPreset.height;

    const img = new Image();
    img.onload = () => {
      const crop = getCoverCropRect(
        img.naturalWidth,
        img.naturalHeight,
        selectedPreset.width,
        selectedPreset.height,
        focusX,
        focusY
      );

      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        selectedPreset.width,
        selectedPreset.height
      );

      setResult(canvas.toDataURL('image/png', 1.0));
    };
    img.src = original.url;
  }, [original, selectedPreset, focusX, focusY]);

  const download = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.download = `${selectedPreset.id}.png`;
    link.href = result;
    link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <canvas ref={canvasRef} className="hidden" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!original && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed
            rounded-xl cursor-pointer transition-colors
            ${isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-[var(--color-border)] hover:border-primary-500 hover:bg-[var(--color-card)]'
            }`}
        >
          <p className="text-[var(--color-text-muted)] text-center">
            {t({
              ko: '이미지를 드래그하거나 클릭해서 업로드하세요',
              en: 'Drag or click to upload an image',
              ja: '画像をドラッグまたはクリックしてアップロードしてください',
            })}
          </p>
        </div>
      )}

      {original && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text)]">
              {t({ ko: '프리셋 선택', en: 'Preset', ja: 'プリセット' })}
            </label>
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
                bg-[var(--color-card)] text-[var(--color-text)]"
            >
              {IMAGE_CROP_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {IMAGE_CROP_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-3 py-2 text-xs rounded-lg border transition-colors ${selectedPresetId === preset.id
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-card-hover)]'}`}
              >
                {preset.width}×{preset.height}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-text)]">
                {t({ ko: '가로 포커스', en: 'Horizontal focus', ja: '横フォーカス' })}: {focusX}%
              </label>
              <input type="range" min="0" max="100" value={focusX} onChange={(e) => setFocusX(Number(e.target.value))} className="w-full accent-primary-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--color-text)]">
                {t({ ko: '세로 포커스', en: 'Vertical focus', ja: '縦フォーカス' })}: {focusY}%
              </label>
              <input type="range" min="0" max="100" value={focusY} onChange={(e) => setFocusY(Number(e.target.value))} className="w-full accent-primary-500" />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={processImage}
              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              {t({ ko: '크롭 + 리사이즈', en: 'Crop + Resize', ja: 'クロップ + リサイズ' })}
            </button>
            <button
              onClick={() => {
                setOriginal(null);
                setResult(null);
              }}
              className="px-4 py-3 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] border border-[var(--color-border)] rounded-lg transition-colors"
            >
              {t(tc.reset)}
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-muted)]">
            {t({ ko: '결과 크기', en: 'Output size', ja: '出力サイズ' })}: {selectedPreset.width} × {selectedPreset.height}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">{t({ ko: '원본', en: 'Original', ja: '元画像' })}</span>
              <img src={original.url} alt="Original" className="w-full max-h-80 object-contain rounded-lg border border-[var(--color-border)]" />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">{t({ ko: '결과', en: 'Result', ja: '結果' })}</span>
              <div className="w-full max-h-80 min-h-[200px] flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
                {result ? (
                  <img src={result} alt="Result" className="w-full h-auto object-contain" />
                ) : (
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {t({ ko: '버튼을 눌러 결과를 생성하세요', en: 'Generate the result to preview', ja: 'ボタンを押して結果を生成してください' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {result && (
            <button
              onClick={download}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {t(tc.download)}
            </button>
          )}
        </>
      )}
    </div>
  );
}
