import { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

export default function ImageResizer() {
  const { t, translations } = useTranslation();
  const tt = translations.tools.imageResizer;
  const tc = translations.tools.common;

  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [resized, setResized] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    width: 800,
    height: 600,
    keepAspectRatio: true,
    quality: 80,
    format: 'jpeg' as 'jpeg' | 'png' | 'webp',
  });
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setSettings((prev) => ({
        ...prev,
        width: img.width,
        height: img.height,
      }));
      setResized(null);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleWidthChange = (value: number) => {
    if (settings.keepAspectRatio && original) {
      const ratio = original.height / original.width;
      setSettings({ ...settings, width: value, height: Math.round(value * ratio) });
    } else {
      setSettings({ ...settings, width: value });
    }
  };

  const handleHeightChange = (value: number) => {
    if (settings.keepAspectRatio && original) {
      const ratio = original.width / original.height;
      setSettings({ ...settings, height: value, width: Math.round(value * ratio) });
    } else {
      setSettings({ ...settings, height: value });
    }
  };

  const resize = useCallback(() => {
    if (!original || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = settings.width;
    canvas.height = settings.height;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, settings.width, settings.height);

      const mimeType = `image/${settings.format}`;
      const quality = settings.format === 'png' ? undefined : settings.quality / 100;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      setResized(dataUrl);
    };
    img.src = original.url;
  }, [original, settings]);

  const download = () => {
    if (!resized) return;

    const link = document.createElement('a');
    link.download = `resized.${settings.format}`;
    link.href = resized;
    link.click();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drop Zone */}
      {!original && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed
            rounded-xl cursor-pointer transition-colors
            ${isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-[var(--color-border)] hover:border-primary-500 hover:bg-[var(--color-card)]'
            }`}
        >
          <svg className="w-12 h-12 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[var(--color-text-muted)] text-center">
            {t(tt.dropzone)}
          </p>
        </div>
      )}

      {/* Image Loaded */}
      {original && (
        <>
          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Width */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text)]">
                {t(tt.width)} (px)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={settings.width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
                  bg-[var(--color-card)] text-[var(--color-text)]
                  focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--color-text)]">
                {t(tt.height)} (px)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={settings.height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)]
                  bg-[var(--color-card)] text-[var(--color-text)]
                  focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Keep Aspect Ratio */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.keepAspectRatio}
                onChange={(e) => setSettings({ ...settings, keepAspectRatio: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500
                  focus:ring-primary-500"
              />
              <span className="text-sm text-[var(--color-text)]">{t(tt.keepAspectRatio)}</span>
            </label>

            {/* Quality */}
            {settings.format !== 'png' && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--color-text)]">{t(tt.quality)}:</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.quality}
                  onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
                  className="w-24 accent-primary-500"
                />
                <span className="text-sm text-[var(--color-text-muted)]">{settings.quality}%</span>
              </div>
            )}

            {/* Format */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-[var(--color-text)]">{t(tt.format)}:</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value as typeof settings.format })}
                className="px-3 py-1 rounded border border-[var(--color-border)]
                  bg-[var(--color-card)] text-[var(--color-text)]"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: '50%', factor: 0.5 },
              { label: '75%', factor: 0.75 },
              { label: '100%', factor: 1 },
              { label: '150%', factor: 1.5 },
              { label: '200%', factor: 2 },
            ].map(({ label, factor }) => (
              <button
                key={label}
                onClick={() => {
                  setSettings({
                    ...settings,
                    width: Math.round(original.width * factor),
                    height: Math.round(original.height * factor),
                  });
                }}
                className="px-3 py-1 text-sm bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
                  border border-[var(--color-border)] rounded transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={resize}
              className="flex-1 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                font-medium transition-colors"
            >
              {t({ ko: '리사이즈', en: 'Resize', ja: 'リサイズ' })}
            </button>
            <button
              onClick={() => {
                setOriginal(null);
                setResized(null);
              }}
              className="px-4 py-3 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
                border border-[var(--color-border)] rounded-lg transition-colors"
            >
              {t(tc.reset)}
            </button>
          </div>

          {/* Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--color-text)]">{t(tt.original)}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {original.width} x {original.height} • {formatBytes(original.file.size)}
                </span>
              </div>
              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)]">
                <img
                  src={original.url}
                  alt="Original"
                  className="w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>

            {/* Resized */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--color-text)]">{t(tt.resized)}</span>
                {resized && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {settings.width} x {settings.height}
                  </span>
                )}
              </div>
              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg)] min-h-[200px] flex items-center justify-center">
                {resized ? (
                  <img
                    src={resized}
                    alt="Resized"
                    className="w-full h-auto max-h-64 object-contain"
                  />
                ) : (
                  <span className="text-[var(--color-text-muted)] text-sm">
                    {t({ ko: '리사이즈 버튼을 클릭하세요', en: 'Click resize button', ja: 'リサイズボタンをクリック' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Download */}
          {resized && (
            <button
              onClick={download}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg
                font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t(tc.download)}
            </button>
          )}
        </>
      )}
    </div>
  );
}
