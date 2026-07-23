import { useState, useRef } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ToolPanel } from './ui/ToolPanel';

interface ExifData {
  // Basic
  fileName?: string;
  fileSize?: number;
  fileType?: string;

  // Camera
  make?: string;
  model?: string;
  software?: string;

  // Image
  width?: number;
  height?: number;
  orientation?: number;
  colorSpace?: string;

  // Capture Settings
  exposureTime?: number;
  fNumber?: number;
  iso?: number;
  focalLength?: number;
  focalLength35mm?: number;
  exposureProgram?: number;
  meteringMode?: number;
  flash?: number;
  whiteBalance?: number;

  // Date/Time
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;

  // GPS
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  gpsLatitudeRef?: string;
  gpsLongitudeRef?: string;

  // Lens
  lensModel?: string;
  lensMake?: string;

  // Other
  copyright?: string;
  artist?: string;

  error?: string;
}

// Enhanced EXIF parser with GPS support
async function parseExif(file: File): Promise<ExifData> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new DataView(e.target?.result as ArrayBuffer);
      const exif: ExifData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };

      // Check for JPEG
      if (data.getUint16(0) !== 0xffd8) {
        resolve({ ...exif, error: 'Not a JPEG file' });
        return;
      }

      let offset = 2;
      const length = data.byteLength;
      let littleEndian = false;
      let tiffOffset = 0;

      const tags: { [key: number]: keyof ExifData } = {
        0x010f: 'make',
        0x0110: 'model',
        0x0112: 'orientation',
        0x0131: 'software',
        0x0132: 'dateTime',
        0x8298: 'copyright',
        0x829a: 'exposureTime',
        0x829d: 'fNumber',
        0x8822: 'exposureProgram',
        0x8827: 'iso',
        0x9003: 'dateTimeOriginal',
        0x9004: 'dateTimeDigitized',
        0x9207: 'meteringMode',
        0x9209: 'flash',
        0x920a: 'focalLength',
        0xa001: 'colorSpace',
        0xa002: 'width',
        0xa003: 'height',
        0xa405: 'focalLength35mm',
        0xa406: 'whiteBalance',
        0xa432: 'lensModel',
        0xa433: 'lensMake',
        0x013b: 'artist',
      };

      const gpsTags: { [key: number]: string } = {
        0x0001: 'gpsLatitudeRef',
        0x0002: 'gpsLatitude',
        0x0003: 'gpsLongitudeRef',
        0x0004: 'gpsLongitude',
        0x0006: 'gpsAltitude',
      };

      const getUint16 = (offset: number) =>
        littleEndian ? data.getUint16(offset, true) : data.getUint16(offset);
      const getUint32 = (offset: number) =>
        littleEndian ? data.getUint32(offset, true) : data.getUint32(offset);

      const readRational = (offset: number): number => {
        const numerator = getUint32(offset);
        const denominator = getUint32(offset + 4);
        return denominator !== 0 ? numerator / denominator : 0;
      };

      const readGpsCoordinate = (offset: number): number => {
        const degrees = readRational(offset);
        const minutes = readRational(offset + 8);
        const seconds = readRational(offset + 16);
        return degrees + minutes / 60 + seconds / 3600;
      };

      const readString = (offset: number, count: number): string => {
        let str = '';
        for (let i = 0; i < count - 1; i++) {
          const char = data.getUint8(offset + i);
          if (char === 0) break;
          str += String.fromCharCode(char);
        }
        return str.trim();
      };

      const readIFD = (ifdOffset: number, isGps = false) => {
        const entries = getUint16(tiffOffset + ifdOffset);

        for (let i = 0; i < entries; i++) {
          const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
          const tag = getUint16(entryOffset);
          const type = getUint16(entryOffset + 2);
          const count = getUint32(entryOffset + 4);
          const valueOffset = entryOffset + 8;

          const tagMap = isGps ? gpsTags : tags;
          const tagName = tagMap[tag];

          if (!tagName) continue;

          try {
            let dataOffset = valueOffset;
            const valueSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1;
            if (count * valueSize > 4) {
              dataOffset = tiffOffset + getUint32(valueOffset);
            }

            if (isGps) {
              if (tagName === 'gpsLatitudeRef' || tagName === 'gpsLongitudeRef') {
                (exif as any)[tagName] = String.fromCharCode(data.getUint8(dataOffset));
              } else if (tagName === 'gpsLatitude' || tagName === 'gpsLongitude') {
                (exif as any)[tagName] = readGpsCoordinate(dataOffset);
              } else if (tagName === 'gpsAltitude') {
                (exif as any)[tagName] = readRational(dataOffset);
              }
            } else {
              // Type 2 = ASCII
              if (type === 2) {
                (exif as any)[tagName] = readString(dataOffset, count);
              }
              // Type 3 = SHORT (16-bit)
              else if (type === 3) {
                (exif as any)[tagName] = getUint16(dataOffset);
              }
              // Type 4 = LONG (32-bit)
              else if (type === 4) {
                (exif as any)[tagName] = getUint32(dataOffset);
              }
              // Type 5 = RATIONAL
              else if (type === 5) {
                (exif as any)[tagName] = readRational(dataOffset);
              }
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      };

      while (offset < length) {
        if (data.getUint8(offset) !== 0xff) break;

        const marker = data.getUint8(offset + 1);

        // APP1 marker (EXIF)
        if (marker === 0xe1) {
          const exifOffset = offset + 4;

          // Check for "Exif\0\0"
          const exifHeader = String.fromCharCode(
            data.getUint8(exifOffset),
            data.getUint8(exifOffset + 1),
            data.getUint8(exifOffset + 2),
            data.getUint8(exifOffset + 3)
          );

          if (exifHeader === 'Exif') {
            tiffOffset = exifOffset + 6;
            littleEndian = data.getUint16(tiffOffset) === 0x4949;

            const ifdOffset = getUint32(tiffOffset + 4);
            readIFD(ifdOffset);

            // Look for EXIF IFD pointer
            const entries = getUint16(tiffOffset + ifdOffset);
            for (let i = 0; i < entries; i++) {
              const entryOffset = tiffOffset + ifdOffset + 2 + i * 12;
              const tag = getUint16(entryOffset);

              // EXIF IFD pointer
              if (tag === 0x8769) {
                const exifIfdOffset = getUint32(entryOffset + 8);
                readIFD(exifIfdOffset);
              }

              // GPS IFD pointer
              if (tag === 0x8825) {
                const gpsIfdOffset = getUint32(entryOffset + 8);
                readIFD(gpsIfdOffset, true);
              }
            }
          }
          break;
        }

        // Move to next marker
        if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
          offset += 2;
        } else {
          const segmentLength = data.getUint16(offset + 2);
          offset += 2 + segmentLength;
        }
      }

      // Apply GPS reference
      if (exif.gpsLatitude && exif.gpsLatitudeRef === 'S') {
        exif.gpsLatitude = -exif.gpsLatitude;
      }
      if (exif.gpsLongitude && exif.gpsLongitudeRef === 'W') {
        exif.gpsLongitude = -exif.gpsLongitude;
      }

      resolve(exif);
    };

    reader.readAsArrayBuffer(file);
  });
}

// Device detection
function detectDevice(make?: string, model?: string): { brand: string; icon: string; type: string } {
  const makeUpper = (make || '').toUpperCase();
  const modelUpper = (model || '').toUpperCase();

  if (makeUpper.includes('APPLE') || modelUpper.includes('IPHONE')) {
    const iphoneMatch = modelUpper.match(/IPHONE\s*(\d+)/);
    return { brand: 'Apple', icon: '🍎', type: iphoneMatch ? `iPhone ${iphoneMatch[1]}` : 'iPhone' };
  }
  if (makeUpper.includes('SAMSUNG') || modelUpper.includes('GALAXY') || modelUpper.includes('SM-')) {
    return { brand: 'Samsung', icon: '📱', type: 'Galaxy' };
  }
  if (makeUpper.includes('GOOGLE') || modelUpper.includes('PIXEL')) {
    return { brand: 'Google', icon: '📱', type: 'Pixel' };
  }
  if (makeUpper.includes('HUAWEI')) {
    return { brand: 'Huawei', icon: '📱', type: 'Huawei' };
  }
  if (makeUpper.includes('XIAOMI') || makeUpper.includes('REDMI')) {
    return { brand: 'Xiaomi', icon: '📱', type: 'Xiaomi' };
  }
  if (makeUpper.includes('LG')) {
    return { brand: 'LG', icon: '📱', type: 'LG' };
  }
  if (makeUpper.includes('SONY')) {
    return { brand: 'Sony', icon: '📷', type: modelUpper.includes('XPERIA') ? 'Xperia' : 'Sony Camera' };
  }
  if (makeUpper.includes('CANON')) {
    return { brand: 'Canon', icon: '📷', type: 'DSLR/Mirrorless' };
  }
  if (makeUpper.includes('NIKON')) {
    return { brand: 'Nikon', icon: '📷', type: 'DSLR/Mirrorless' };
  }
  if (makeUpper.includes('FUJIFILM') || makeUpper.includes('FUJI')) {
    return { brand: 'Fujifilm', icon: '📷', type: 'Mirrorless' };
  }
  if (makeUpper.includes('PANASONIC') || makeUpper.includes('LUMIX')) {
    return { brand: 'Panasonic', icon: '📷', type: 'Lumix' };
  }
  if (makeUpper.includes('OLYMPUS') || makeUpper.includes('OM SYSTEM')) {
    return { brand: 'Olympus', icon: '📷', type: 'Mirrorless' };
  }
  if (makeUpper.includes('GOPRO')) {
    return { brand: 'GoPro', icon: '🎬', type: 'Action Camera' };
  }
  if (makeUpper.includes('DJI')) {
    return { brand: 'DJI', icon: '🚁', type: 'Drone' };
  }

  if (make) {
    return { brand: make, icon: '📷', type: 'Camera' };
  }

  return { brand: 'Unknown', icon: '❓', type: 'Unknown' };
}

export default function ImageMetadataViewer() {
  const { t } = useTranslation();
  const tr = (ko: string, en: string, ja: string) => t({ ko, en, ja });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'camera' | 'gps' | 'all'>('basic');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);

    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Get image dimensions
    const img = new Image();
    img.onload = async () => {
      const exif = await parseExif(file);
      if (!exif.width) exif.width = img.width;
      if (!exif.height) exif.height = img.height;
      setExifData(exif);
      setIsLoading(false);
    };
    img.onerror = async () => {
      const exif = await parseExif(file);
      setExifData(exif);
      setIsLoading(false);
    };
    img.src = url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const device = exifData ? detectDevice(exifData.make, exifData.model) : null;

  const exposurePrograms: { [key: number]: string } = {
    0: tr('정의되지 않음', 'Undefined', '未定義'),
    1: tr('수동', 'Manual', 'マニュアル'),
    2: tr('프로그램 자동', 'Program auto', 'プログラムAE'),
    3: tr('조리개 우선 (A/Av)', 'Aperture priority (A/Av)', '絞り優先 (A/Av)'),
    4: tr('셔터 우선 (S/Tv)', 'Shutter priority (S/Tv)', 'シャッター優先 (S/Tv)'),
    5: tr('크리에이티브', 'Creative', 'クリエイティブ'),
    6: tr('액션', 'Action', 'アクション'),
    7: tr('인물', 'Portrait', 'ポートレート'),
    8: tr('풍경', 'Landscape', '風景'),
  };

  const meteringModes: { [key: number]: string } = {
    0: tr('알 수 없음', 'Unknown', '不明'),
    1: tr('평균', 'Average', '平均'),
    2: tr('중앙중점', 'Center-weighted', '中央重点'),
    3: tr('스팟', 'Spot', 'スポット'),
    4: tr('멀티스팟', 'Multi-spot', 'マルチスポット'),
    5: tr('패턴', 'Pattern', 'パターン'),
    6: tr('부분', 'Partial', '部分'),
  };

  const flashModes: { [key: number]: string } = {
    0: tr('플래시 미발광', 'Flash did not fire', 'フラッシュ未発光'),
    1: tr('플래시 발광', 'Flash fired', 'フラッシュ発光'),
    5: tr('플래시 발광 (반사광 감지 안됨)', 'Flash fired (return not detected)', 'フラッシュ発光（反射光未検出）'),
    7: tr('플래시 발광 (반사광 감지됨)', 'Flash fired (return detected)', 'フラッシュ発光（反射光検出）'),
    16: tr('플래시 미발광 (강제)', 'Flash suppressed', 'フラッシュ強制停止'),
    24: tr('플래시 미발광 (자동)', 'Auto, flash did not fire', '自動、未発光'),
    25: tr('플래시 발광 (자동)', 'Auto, flash fired', '自動、発光'),
  };

  return (
    <ToolPanel className="gap-6">
      <input
        ref={fileInputRef}
        type="file"
        aria-label={tr('이미지 파일 선택', 'Choose an image file', '画像ファイルを選択')}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drop Zone */}
      {!imageUrl && (
        <ToolPanel
          variant="drop-zone"
          onActivate={() => fileInputRef.current?.click()}
          aria-label={tr('이미지를 드래그하거나 클릭하여 업로드', 'Drag an image or click to upload', '画像をドラッグするかクリックしてアップロード')}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
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
          <div className="text-center">
            <p className="text-[var(--color-text)]">
              {tr('이미지를 드래그하거나 클릭하여 업로드', 'Drag an image or click to upload', '画像をドラッグするかクリックしてアップロード')}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {tr('JPEG, PNG, HEIC 등 모든 이미지 형식 지원', 'Supports common formats including JPEG, PNG, and HEIC', 'JPEG、PNG、HEICなどの一般的な形式に対応')}
            </p>
          </div>
        </ToolPanel>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-8">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--color-text)]">{tr('분석 중...', 'Analyzing...', '解析中…')}</span>
        </div>
      )}

      {/* Results */}
      {imageUrl && exifData && !isLoading && (
        <div className="space-y-6">
          {/* Device Summary Card */}
          {device && (
            <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-primary-500/20">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{device.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--color-text)]">
                    {device.brand} {device.type}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {exifData.model || tr('모델 정보 없음', 'No model information', 'モデル情報なし')}
                  </p>
                </div>
                {exifData.gpsLatitude && exifData.gpsLongitude && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <span>📍</span>
                    <span className="text-sm font-medium">{tr('위치 정보 있음', 'Location data present', '位置情報あり')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Preview */}
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)]">
                <img src={imageUrl} alt={exifData.fileName} className="w-full h-auto" />
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2 text-center truncate">
                {exifData.fileName}
              </p>
              <button
                onClick={() => {
                  setImageUrl(null);
                  setExifData(null);
                }}
                className="w-full mt-2 px-4 py-2 bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
                  border border-[var(--color-border)] rounded-lg transition-colors text-sm"
              >
                {tr('다른 이미지 선택', 'Choose another image', '別の画像を選択')}
              </button>
            </div>

            {/* Metadata */}
            <div className="md:w-2/3 space-y-4">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-[var(--color-border)] pb-2">
                {[
                  { id: 'basic', label: `📋 ${tr('기본', 'Basic', '基本')}` },
                  { id: 'camera', label: `📷 ${tr('카메라', 'Camera', 'カメラ')}` },
                  { id: 'gps', label: `📍 ${tr('위치', 'Location', '位置')}` },
                  { id: 'all', label: `📑 ${tr('전체', 'All', 'すべて')}` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-[var(--color-card)] text-[var(--color-text-muted)]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {/* Basic Info */}
                {(activeTab === 'basic' || activeTab === 'all') && (
                  <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                    <div className="px-4 py-2 bg-[var(--color-card)] border-b border-[var(--color-border)]">
                      <h3 className="font-medium text-[var(--color-text)]">📋 {tr('파일 정보', 'File information', 'ファイル情報')}</h3>
                    </div>
                    <div className="divide-y divide-[var(--color-border)]">
                      <Row label={tr('파일명', 'File name', 'ファイル名')} value={exifData.fileName} />
                      <Row label={tr('파일 크기', 'File size', 'ファイルサイズ')} value={exifData.fileSize ? formatFileSize(exifData.fileSize) : undefined} />
                      <Row label={tr('파일 형식', 'File type', 'ファイル形式')} value={exifData.fileType} />
                      <Row label={tr('해상도', 'Resolution', '解像度')} value={exifData.width && exifData.height ? `${exifData.width} × ${exifData.height}` : undefined} />
                      <Row label={tr('촬영 날짜', 'Date taken', '撮影日')} value={exifData.dateTimeOriginal || exifData.dateTime} />
                    </div>
                  </div>
                )}

                {/* Camera Info */}
                {(activeTab === 'camera' || activeTab === 'all') && (
                  <>
                    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                      <div className="px-4 py-2 bg-[var(--color-card)] border-b border-[var(--color-border)]">
                        <h3 className="font-medium text-[var(--color-text)]">📷 {tr('카메라/기기 정보', 'Camera and device', 'カメラ・機器情報')}</h3>
                      </div>
                      <div className="divide-y divide-[var(--color-border)]">
                        <Row label={tr('제조사', 'Make', 'メーカー')} value={exifData.make} />
                        <Row label={tr('모델', 'Model', 'モデル')} value={exifData.model} />
                        <Row label={tr('소프트웨어', 'Software', 'ソフトウェア')} value={exifData.software} />
                        <Row label={tr('렌즈', 'Lens', 'レンズ')} value={exifData.lensModel} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                      <div className="px-4 py-2 bg-[var(--color-card)] border-b border-[var(--color-border)]">
                        <h3 className="font-medium text-[var(--color-text)]">⚙️ {tr('촬영 설정', 'Capture settings', '撮影設定')}</h3>
                      </div>
                      <div className="divide-y divide-[var(--color-border)]">
                        <Row
                          label={tr('노출 시간', 'Exposure time', '露出時間')}
                          value={exifData.exposureTime
                            ? exifData.exposureTime >= 1
                              ? `${exifData.exposureTime}s`
                              : `1/${Math.round(1 / exifData.exposureTime)}s`
                            : undefined}
                        />
                        <Row label={tr('조리개', 'Aperture', '絞り')} value={exifData.fNumber ? `f/${exifData.fNumber}` : undefined} />
                        <Row label="ISO" value={exifData.iso ? `ISO ${exifData.iso}` : undefined} />
                        <Row label={tr('초점 거리', 'Focal length', '焦点距離')} value={exifData.focalLength ? `${exifData.focalLength}mm` : undefined} />
                        <Row label={tr('35mm 환산', '35mm equivalent', '35mm換算')} value={exifData.focalLength35mm ? `${exifData.focalLength35mm}mm` : undefined} />
                        <Row label={tr('촬영 모드', 'Exposure mode', '撮影モード')} value={exifData.exposureProgram !== undefined ? exposurePrograms[exifData.exposureProgram] : undefined} />
                        <Row label={tr('측광 모드', 'Metering mode', '測光モード')} value={exifData.meteringMode !== undefined ? meteringModes[exifData.meteringMode] : undefined} />
                        <Row label={tr('플래시', 'Flash', 'フラッシュ')} value={exifData.flash !== undefined ? flashModes[exifData.flash] || `${tr('플래시 코드', 'Flash code', 'フラッシュコード')}: ${exifData.flash}` : undefined} />
                      </div>
                    </div>
                  </>
                )}

                {/* GPS Info */}
                {(activeTab === 'gps' || activeTab === 'all') && (
                  <div className="rounded-lg border border-[var(--color-border)] overflow-hidden">
                    <div className="px-4 py-2 bg-[var(--color-card)] border-b border-[var(--color-border)]">
                      <h3 className="font-medium text-[var(--color-text)]">📍 {tr('위치 정보', 'Location information', '位置情報')}</h3>
                    </div>
                    {exifData.gpsLatitude && exifData.gpsLongitude ? (
                      <div className="p-4 space-y-4">
                        <div className="divide-y divide-[var(--color-border)] -mx-4 -mt-4 border-b border-[var(--color-border)]">
                          <Row label={tr('위도', 'Latitude', '緯度')} value={`${exifData.gpsLatitude.toFixed(6)}°`} />
                          <Row label={tr('경도', 'Longitude', '経度')} value={`${exifData.gpsLongitude.toFixed(6)}°`} />
                          {exifData.gpsAltitude && <Row label={tr('고도', 'Altitude', '高度')} value={`${exifData.gpsAltitude.toFixed(1)}m`} />}
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`https://www.google.com/maps?q=${exifData.gpsLatitude},${exifData.gpsLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-center text-sm font-medium transition-colors"
                          >
                            🗺️ {tr('Google Maps에서 보기', 'View in Google Maps', 'Google Mapsで表示')}
                          </a>
                          <a
                            href={`https://map.naver.com/v5/search/${exifData.gpsLatitude},${exifData.gpsLongitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-center text-sm font-medium transition-colors"
                          >
                            🗺️ {tr('네이버 지도에서 보기', 'View in Naver Map', 'NAVERマップで表示')}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-[var(--color-text-muted)]">
                        <span className="text-4xl mb-2 block">📍</span>
                        <p>{tr('위치 정보가 없습니다', 'No location data', '位置情報はありません')}</p>
                        <p className="text-sm mt-1">
                          {tr('사진에 GPS 데이터가 없거나 개인정보 보호를 위해 제거되었을 수 있습니다.', 'The photo may not contain GPS data, or it may have been removed for privacy.', '写真にGPSデータがないか、プライバシー保護のため削除された可能性があります。')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Warning */}
          {exifData.gpsLatitude && exifData.gpsLongitude && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">{tr('개인정보 주의', 'Privacy notice', 'プライバシーに関する注意')}</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {tr('이 사진에는 촬영 위치 정보가 있습니다. 공유하기 전에 위치 정보를 제거하는 것이 좋습니다.', 'This photo contains location data. Consider removing it before sharing the photo.', 'この写真には位置情報があります。共有前に削除することをおすすめします。')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-medium text-[var(--color-text)] mb-2">💡 {tr('확인 가능한 정보', 'Information you can inspect', '確認できる情報')}</h3>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          <li>• {tr('기기 정보: 카메라와 휴대전화 모델', 'Device: camera or phone model', '機器：カメラやスマートフォンのモデル')}</li>
          <li>• {tr('촬영 설정: 조리개, 셔터 속도, ISO, 초점 거리', 'Capture settings: aperture, shutter speed, ISO, focal length', '撮影設定：絞り、シャッター速度、ISO、焦点距離')}</li>
          <li>• {tr('위치 정보: 포함된 경우 GPS 좌표와 지도 링크', 'Location: GPS coordinates and map links when present', '位置情報：含まれる場合はGPS座標と地図リンク')}</li>
          <li>• {tr('날짜와 시간: 사진 촬영 시각', 'Date and time: when the photo was taken', '日時：写真の撮影時刻')}</li>
        </ul>
      </div>
    </ToolPanel>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between px-4 py-2">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className="font-mono text-[var(--color-text)] text-right max-w-[60%] truncate">
        {value ?? '-'}
      </span>
    </div>
  );
}
