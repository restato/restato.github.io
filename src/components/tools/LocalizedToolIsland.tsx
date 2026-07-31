import type { ComponentType } from 'react';
import type { Language } from '../../data/tools/types';
import { TranslationProvider } from '../../i18n/useTranslation';
import QRCodeGenerator from './QRCodeGenerator';
import PasswordGenerator from './PasswordGenerator';
import UuidGenerator from './UuidGenerator';
import LoremIpsumGenerator from './LoremIpsumGenerator';
import ColorPalette from './ColorPalette';
import HashGenerator from './HashGenerator';
import ColorConverter from './ColorConverter';
import UnitConverter from './UnitConverter';
import Base64Tool from './Base64Tool';
import ImageConverter from './ImageConverter';
import TextCounter from './TextCounter';
import MarkdownPreview from './MarkdownPreview';
import DiffTool from './DiffTool';
import JsonFormatter from './JsonFormatter';
import RegexTester from './RegexTester';
import UrlEncoder from './UrlEncoder';
import JwtDecoder from './JwtDecoder';
import CronGenerator from './CronGenerator';
import TimestampConverter from './TimestampConverter';
import LlmCostCalculator from './LlmCostCalculator';
import GradientGenerator from './GradientGenerator';
import BoxShadowGenerator from './BoxShadowGenerator';
import ImageResizer from './ImageResizer';
import ExifViewer from './ExifViewer';
import BackgroundRemover from './BackgroundRemover';
import ImageMetadataViewer from './ImageMetadataViewer';
import UtmBuilder from './UtmBuilder';
import TimerStopwatch from './TimerStopwatch';
import PomodoroTimer from './PomodoroTimer';
import WorldClock from './WorldClock';
import PercentCalculator from './PercentCalculator';
import DiscountCalculator from './DiscountCalculator';
import BmiCalculator from './BmiCalculator';
import AgeCalculator from './AgeCalculator';
import DdayCalculator from './DdayCalculator';
import DutchPayCalculator from './DutchPayCalculator';
import CoinFlip from './CoinFlip';
import DiceRoller from './DiceRoller';
import KorEngConverter from './KorEngConverter';
import AppStoreScreenshotResizer from './AppStoreScreenshotResizer';
import { isAdditionalToolSlug } from './additionalToolSlugs';

const toolComponents: Record<string, ComponentType> = {
  'qr-code': QRCodeGenerator,
  password: PasswordGenerator,
  uuid: UuidGenerator,
  'lorem-ipsum': LoremIpsumGenerator,
  'color-palette': ColorPalette,
  hash: HashGenerator,
  color: ColorConverter,
  unit: UnitConverter,
  base64: Base64Tool,
  'image-converter': ImageConverter,
  'text-counter': TextCounter,
  markdown: MarkdownPreview,
  diff: DiffTool,
  json: JsonFormatter,
  regex: RegexTester,
  'url-encoder': UrlEncoder,
  'jwt-decoder': JwtDecoder,
  cron: CronGenerator,
  timestamp: TimestampConverter,
  'llm-cost': LlmCostCalculator,
  gradient: GradientGenerator,
  'box-shadow': BoxShadowGenerator,
  'image-resizer': ImageResizer,
  exif: ExifViewer,
  'background-remover': BackgroundRemover,
  'image-metadata': ImageMetadataViewer,
  utm: UtmBuilder,
  timer: TimerStopwatch,
  pomodoro: PomodoroTimer,
  'world-clock': WorldClock,
  percent: PercentCalculator,
  discount: DiscountCalculator,
  bmi: BmiCalculator,
  age: AgeCalculator,
  dday: DdayCalculator,
  'dutch-pay': DutchPayCalculator,
  'coin-flip': CoinFlip,
  dice: DiceRoller,
  'kor-eng': KorEngConverter,
  'appstore-screenshot': AppStoreScreenshotResizer,
};

export const hasLocalizedToolComponent = (slug: string): boolean => slug in toolComponents || isAdditionalToolSlug(slug);

export default function LocalizedToolIsland({ slug, lang }: { slug: string; lang: Language }) {
  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) return null;

  return (
    <TranslationProvider initialLanguage={lang}>
      <ToolComponent />
    </TranslationProvider>
  );
}
