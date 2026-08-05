import { lazy, Suspense, type ComponentType } from 'react';
import type { Language } from '../../data/tools/types';
import { TranslationProvider } from '../../i18n/useTranslation';

const toolComponents: Record<string, ComponentType> = {
  'pdf-merge': lazy(() => import('./pdf/PdfMergeTool')),
  'pdf-split': lazy(() => import('./pdf/PdfSplitTool')),
  'pdf-rotate': lazy(() => import('./pdf/PdfRotateTool')),
  'images-to-pdf': lazy(() => import('./pdf/ImagesToPdfTool')),
  'pdf-to-images': lazy(() => import('./pdf/PdfToImagesTool')),
  'csv-json': lazy(() => import('./data-text/CsvJsonTool')),
  'text-cleaner': lazy(() => import('./data-text/TextCleanerTool')),
  'seo-generator': lazy(() => import('./data-text/SeoGeneratorTool')),
  'modern-image-converter': lazy(() => import('./media-calc/ModernImageConverterTool')),
  'exif-remover': lazy(() => import('./media-calc/ExifRemoverTool')),
  'favicon-generator': lazy(() => import('./media-calc/FaviconGeneratorTool')),
  'loan-calculator': lazy(() => import('./media-calc/LoanCalculatorTool')),
  'audio-trimmer': lazy(() => import('./media-calc/AudioTrimmerTool')),
  'ladder-game': lazy(() => import('./random/LadderGameTool')),
};

export default function AdditionalToolIsland({ slug, lang }: { slug: string; lang: Language }) {
  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) return null;

  return (
    <TranslationProvider initialLanguage={lang}>
      <Suspense fallback={<div className="fc-tool-panel fc-surface-soft min-h-40" aria-label="Loading tool" />}>
        <ToolComponent />
      </Suspense>
    </TranslationProvider>
  );
}
