export type ToolResultAdoption = {
  slug: string;
  component: string;
  mode: 'tool-result' | 'self-announcing';
  rationale: string;
};

const liveValue = 'The result updates in an always-visible value or preview that already names its output.';
const generatedValue = 'The generated value is shown in a labeled output field or preview with its own copy/download action.';
const directDownload = 'A successful operation announces itself through the browser download; errors and working state remain visible in the tool.';
const statefulDisplay = 'This is a stateful display rather than a submit/result workflow; its labeled display updates continuously.';

/**
 * Reader-facing result contract for every component published by the standard
 * and additional tool registries. New public tools must choose a mode here.
 */
export const toolResultAdoption: readonly ToolResultAdoption[] = [
  { slug: 'qr-code', component: 'QRCodeGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'password', component: 'PasswordGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'uuid', component: 'UuidGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'lorem-ipsum', component: 'LoremIpsumGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'color-palette', component: 'ColorPalette', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'hash', component: 'HashGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'color', component: 'ColorConverter', mode: 'self-announcing', rationale: liveValue },
  { slug: 'unit', component: 'UnitConverter', mode: 'self-announcing', rationale: liveValue },
  { slug: 'base64', component: 'Base64Tool', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'image-converter', component: 'ImageConverter', mode: 'tool-result', rationale: 'Conversion progress is announced through ToolResult before the labeled download output is exposed.' },
  { slug: 'text-counter', component: 'TextCounter', mode: 'self-announcing', rationale: liveValue },
  { slug: 'markdown', component: 'MarkdownPreview', mode: 'self-announcing', rationale: 'The named preview pane updates beside the editor as the user types.' },
  { slug: 'diff', component: 'DiffTool', mode: 'self-announcing', rationale: 'The labeled comparison view updates directly from both source fields.' },
  { slug: 'json', component: 'JsonFormatter', mode: 'tool-result', rationale: 'Formatted output and validation errors are announced through ToolResult.' },
  { slug: 'regex', component: 'RegexTester', mode: 'tool-result', rationale: 'Invalid expressions are announced through ToolResult; matches are identified inline in the named test area.' },
  { slug: 'url-encoder', component: 'UrlEncoder', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'jwt-decoder', component: 'JwtDecoder', mode: 'tool-result', rationale: 'Decode failures are announced through ToolResult and decoded sections are individually labeled.' },
  { slug: 'cron', component: 'CronGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'timestamp', component: 'TimestampConverter', mode: 'self-announcing', rationale: liveValue },
  { slug: 'llm-cost', component: 'LlmCostCalculator', mode: 'tool-result', rationale: 'The cost comparison and exchange-rate failures are announced through ToolResult.' },
  { slug: 'gradient', component: 'GradientGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'box-shadow', component: 'BoxShadowGenerator', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'image-resizer', component: 'ImageResizer', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'exif', component: 'ExifViewer', mode: 'self-announcing', rationale: 'Parsed metadata appears in a named metadata table immediately after selection.' },
  { slug: 'background-remover', component: 'BackgroundRemover', mode: 'tool-result', rationale: 'Processing failures are announced through ToolResult and the successful image is exposed in a labeled preview/download area.' },
  { slug: 'image-metadata', component: 'ImageMetadataViewer', mode: 'self-announcing', rationale: 'Selected-image properties appear in an explicitly labeled metadata view.' },
  { slug: 'appstore-screenshot', component: 'AppStoreScreenshotResizer', mode: 'self-announcing', rationale: directDownload },
  { slug: 'utm', component: 'UtmBuilder', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'timer', component: 'TimerStopwatch', mode: 'self-announcing', rationale: statefulDisplay },
  { slug: 'pomodoro', component: 'PomodoroTimer', mode: 'self-announcing', rationale: statefulDisplay },
  { slug: 'world-clock', component: 'WorldClock', mode: 'self-announcing', rationale: statefulDisplay },
  { slug: 'percent', component: 'PercentCalculator', mode: 'self-announcing', rationale: liveValue },
  { slug: 'discount', component: 'DiscountCalculator', mode: 'tool-result', rationale: 'Calculated savings, final price, and comparison are grouped in a success ToolResult.' },
  { slug: 'bmi', component: 'BmiCalculator', mode: 'tool-result', rationale: 'The BMI value and interpretation are grouped in a success ToolResult.' },
  { slug: 'age', component: 'AgeCalculator', mode: 'tool-result', rationale: 'Age, birthday, zodiac, and lifetime statistics are grouped in a success ToolResult.' },
  { slug: 'dday', component: 'DdayCalculator', mode: 'self-announcing', rationale: liveValue },
  { slug: 'dutch-pay', component: 'DutchPayCalculator', mode: 'self-announcing', rationale: 'Per-person amounts and settlements update in explicitly labeled calculation sections.' },
  { slug: 'coin-flip', component: 'CoinFlip', mode: 'self-announcing', rationale: 'The animated coin face and named heads/tails history announce each outcome.' },
  { slug: 'dice', component: 'DiceRoller', mode: 'self-announcing', rationale: 'The dice faces and total update in the persistent roll display.' },
  { slug: 'kor-eng', component: 'KorEngConverter', mode: 'self-announcing', rationale: generatedValue },
  { slug: 'anonymous-chat', component: 'Chat', mode: 'self-announcing', rationale: 'Connection state and incoming messages are announced in the live chat workspace.' },
  { slug: 'csv-json', component: 'CsvJsonTool', mode: 'tool-result', rationale: 'Converted data and conversion errors are announced through ToolResult.' },
  { slug: 'text-cleaner', component: 'TextCleanerTool', mode: 'tool-result', rationale: 'Transformed text is grouped in a success ToolResult.' },
  { slug: 'seo-generator', component: 'SeoGeneratorTool', mode: 'tool-result', rationale: 'Generation errors use ToolResult; successful artifacts are exposed in three labeled output fields.' },
  { slug: 'modern-image-converter', component: 'ModernImageConverterTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'exif-remover', component: 'ExifRemoverTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'favicon-generator', component: 'FaviconGeneratorTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'loan-calculator', component: 'LoanCalculatorTool', mode: 'self-announcing', rationale: liveValue },
  { slug: 'audio-trimmer', component: 'AudioTrimmerTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'pdf-merge', component: 'PdfMergeTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'pdf-split', component: 'PdfSplitTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'pdf-rotate', component: 'PdfRotateTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'images-to-pdf', component: 'ImagesToPdfTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'pdf-to-images', component: 'PdfToImagesTool', mode: 'self-announcing', rationale: directDownload },
  { slug: 'ladder-game', component: 'LadderGameTool', mode: 'self-announcing', rationale: 'Each traced player appends to an always-visible labeled outcomes list beside the highlighted ladder path.' },
];
