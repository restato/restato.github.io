import { supportedLanguages } from './locales';
import type { Language, Localized, ToolContent, ToolPrivacyMode } from './types';
import { localizedProfilesCore, localizedSemanticsCore } from './localizedProfilesCore';
import { localizedProfilesWest } from './localizedProfilesWest';
import { localizedProfilesAsia } from './localizedProfilesAsia';
import { buildLocalizedWorkflow } from './localizedWorkflows';
import { additionalTools as pdfTools } from './additions/pdf';
import { additionalTools as dataTextTools } from './additions/data-text';
import { additionalTools as mediaCalcTools } from './additions/media-calc';
import { additionalTools as randomTools } from './additions/random';
import { additionalTools as dateTools } from './additions/dates';

export { getToolWorkflow } from './localizedWorkflows';

interface ToolProfile {
  label: string;
  input: string;
  output: string;
  example: string;
  caveat: string;
}

export interface AdditionalToolProfile {
  name: string;
  input: string;
  output: string;
  example: string;
  limitation: string;
}

const profiles: Record<string, ToolProfile> = {
  'qr-code': { label: 'QR Code Generator', input: 'a URL or short text', output: 'a scannable QR image', example: 'https://example.com → QR PNG', caveat: 'very dense content can be harder for older cameras to scan' },
  password: { label: 'Password Generator', input: 'length and character rules', output: 'a random password', example: '20 characters with letters, numbers and symbols', caveat: 'each website may enforce different password rules' },
  uuid: { label: 'UUID v4 Generator', input: 'quantity and letter-case options', output: 'random UUID v4 identifiers', example: '550e8400-e29b-41d4-a716-446655440000', caveat: 'random UUIDs are not sequential database keys' },
  'lorem-ipsum': { label: 'Lorem Ipsum Generator', input: 'paragraph, sentence or word count', output: 'placeholder copy', example: '3 paragraphs for a layout mock-up', caveat: 'placeholder copy must be replaced before publication' },
  'color-palette': { label: 'Color Palette Generator', input: 'a base color and harmony rule', output: 'a coordinated color palette', example: '#3366FF → complementary palette', caveat: 'generated colors do not guarantee accessible contrast' },
  hash: { label: 'Hash Generator', input: 'text and a hash algorithm', output: 'a hexadecimal digest', example: 'hello → SHA-256 digest', caveat: 'a hash is one-way and is not encryption' },
  color: { label: 'Color Converter', input: 'a HEX, RGB or HSL color', output: 'equivalent color notations', example: '#FF0000 → rgb(255, 0, 0)', caveat: 'rounded channels can cause tiny conversion differences' },
  unit: { label: 'Unit Converter', input: 'a value, unit and target unit', output: 'a converted measurement', example: '1 kilometre → 1000 metres', caveat: 'results should not replace calibrated scientific measurements' },
  base64: { label: 'Base64 Encoder/Decoder', input: 'plain text or Base64 text', output: 'encoded or decoded text', example: 'hello → aGVsbG8=', caveat: 'Base64 is an encoding and provides no secrecy' },
  'image-converter': { label: 'Image Converter', input: 'an image and output format', output: 'a converted image file', example: 'photo.png → photo.webp', caveat: 'lossy formats can reduce image quality' },
  'text-counter': { label: 'Text Counter', input: 'the text to analyse', output: 'character, word, line and sentence counts', example: 'Hello world → 11 characters and 2 words', caveat: 'word boundaries vary between writing systems' },
  markdown: { label: 'Markdown Preview', input: 'Markdown source', output: 'a rendered live preview', example: '**bold** → bold text', caveat: 'rendering may differ from a specific publishing platform' },
  diff: { label: 'Text Diff', input: 'an original and revised text', output: 'highlighted additions and removals', example: 'cat → cats highlights the added “s”', caveat: 'large documents can be visually difficult to review' },
  json: { label: 'JSON Formatter', input: 'JSON text', output: 'formatted, minified or validated JSON', example: '{"ok":true} → indented JSON', caveat: 'comments and trailing commas are not valid standard JSON' },
  regex: { label: 'Regex Tester', input: 'a pattern, flags and test text', output: 'matching ranges and groups', example: '\\d+ matches 2026', caveat: 'browser regular-expression syntax may differ from server runtimes' },
  'url-encoder': { label: 'URL Encoder/Decoder', input: 'text or an encoded URL component', output: 'encoded or decoded text', example: 'hello world → hello%20world', caveat: 'encoding a complete URL differs from encoding one query value' },
  'jwt-decoder': { label: 'JWT Decoder', input: 'a JSON Web Token', output: 'decoded header and payload', example: 'eyJ… token → readable JSON claims', caveat: 'decoding does not verify the token signature' },
  cron: { label: 'Cron Generator', input: 'schedule fields', output: 'a cron expression and readable schedule', example: 'every day at 09:00 → 0 9 * * *', caveat: 'cron dialects and time zones vary by scheduler' },
  timestamp: { label: 'Timestamp Converter', input: 'a Unix timestamp or date', output: 'human-readable and epoch time', example: '0 → 1970-01-01T00:00:00Z', caveat: 'seconds and milliseconds must not be confused' },
  'llm-cost': { label: 'LLM Cost Calculator', input: 'model, token counts and currency', output: 'an estimated API cost', example: 'one million input tokens → model-specific estimate', caveat: 'provider prices and exchange rates can change' },
  gradient: { label: 'CSS Gradient Generator', input: 'colors, direction and stops', output: 'a gradient preview and CSS', example: '#3366FF to #8B5CF6 → linear-gradient CSS', caveat: 'appearance can vary slightly across displays' },
  'box-shadow': { label: 'CSS Box Shadow Generator', input: 'offset, blur, spread and color', output: 'a shadow preview and CSS', example: '0 8px 24px rgba(0,0,0,.2)', caveat: 'heavy shadows can reduce readability or rendering performance' },
  'image-resizer': { label: 'Image Resizer & Compressor', input: 'an image, crop, target dimensions, format and quality', output: 'a resized or compressed image file', example: '2400×1600 → 1200×800 WebP', caveat: 'enlarging a small source cannot restore missing detail' },
  exif: { label: 'EXIF Viewer', input: 'an image containing EXIF metadata', output: 'camera and capture metadata', example: 'JPEG → camera model, lens and exposure', caveat: 'many editors and social networks remove EXIF fields' },
  'background-remover': { label: 'Background Remover', input: 'a foreground image', output: 'an image with transparent background', example: 'product photo → transparent PNG', caveat: 'hair, glass and low-contrast edges may need manual review' },
  'image-metadata': { label: 'Image Metadata Viewer', input: 'an image file', output: 'dimensions, format, size and color details', example: 'photo.webp → 1600×900, WebP, 240 KB', caveat: 'available fields depend on the source file' },
  'appstore-screenshot': { label: 'App Store Screenshot Resizer', input: 'a screenshot and device presets', output: 'store-ready image sizes', example: 'app screen → iPhone listing dimensions', caveat: 'store requirements can change and should be checked before submission' },
  utm: { label: 'UTM Builder', input: 'a destination URL and campaign parameters', output: 'a tagged campaign URL', example: 'example.com + source=newsletter → tagged URL', caveat: 'parameter names are visible to anyone opening the link' },
  timer: { label: 'Timer and Stopwatch', input: 'a duration or stopwatch action', output: 'elapsed or remaining time', example: '10:00 countdown with an end alert', caveat: 'background-tab throttling can delay browser alerts' },
  pomodoro: { label: 'Pomodoro Timer', input: 'focus, break and cycle durations', output: 'guided focus intervals', example: '25 minutes focus + 5 minutes break', caveat: 'one interval pattern does not suit every workflow' },
  'world-clock': { label: 'World Clock', input: 'cities or time zones', output: 'current local times', example: 'Seoul 09:00 → London 01:00 in winter', caveat: 'daylight-saving rules change by date and region' },
  percent: { label: 'Percentage Calculator', input: 'a base value and percentage', output: 'percentage values or rate changes', example: '15% of 200 → 30', caveat: 'choose the correct base when calculating percentage change' },
  discount: { label: 'Discount Calculator', input: 'original price, discount and tax', output: 'discount amount and final price', example: '$100 with 20% off → $80 before tax', caveat: 'rounding and local tax rules can alter the checkout total' },
  bmi: { label: 'BMI Calculator', input: 'height and weight', output: 'BMI and a reference range', example: '70 kg and 175 cm → BMI 22.9', caveat: 'BMI is a screening measure, not a medical diagnosis' },
  age: { label: 'Age Calculator', input: 'birth date and reference date', output: 'calendar age and elapsed time', example: '2000-01-01 to 2026-01-01 → 26 years', caveat: 'legal age rules can differ by country' },
  dday: { label: 'D-Day Calculator', input: 'a target calendar date', output: 'days remaining or elapsed', example: 'tomorrow → D-1', caveat: 'the calculation uses local calendar dates rather than exact hours' },
  'dutch-pay': { label: 'Bill Split Calculator', input: 'bill total, people, tip and adjustments', output: 'each person’s share', example: '$120 among 4 people → $30 each', caveat: 'unequal orders require individual adjustments' },
  'coin-flip': { label: 'Coin Flip', input: 'a flip action', output: 'heads or tails', example: 'flip → heads', caveat: 'browser randomness is not suitable for gambling or security decisions' },
  dice: { label: 'Dice Roller', input: 'dice type and quantity', output: 'individual rolls and a total', example: '2d6 → 4 + 5 = 9', caveat: 'browser randomness is not certified for regulated games' },
  'kor-eng': { label: 'Korean-English Keyboard Converter', input: 'text typed with the wrong keyboard layout', output: 'converted Korean or Latin keystrokes', example: 'dkssud → 안녕', caveat: 'intentional mixed-language text may need manual correction' },
  'anonymous-chat': { label: 'Anonymous P2P Chat', input: 'a room link and chat messages', output: 'a direct peer conversation', example: 'share a room link → one-to-one chat', caveat: 'direct WebRTC connection can fail on restrictive networks' },
};

const localizedProfiles: Record<Exclude<Language, 'en'>, Record<string, { name: string; input: string; output: string; example: string; limitation: string }>> = {
  ko: Object.fromEntries(Object.entries(localizedProfilesCore.ko).map(([slug, profile]) => [slug, {
    ...profile,
    ...localizedSemanticsCore[slug],
  }])),
  ...localizedProfilesWest,
  ...localizedProfilesAsia,
};

interface LanguagePack {
  title: (name: string) => string;
  description: (name: string, input: string, output: string) => string;
  intent: (name: string) => string;
  overview: (name: string, input: string, output: string) => string;
  steps: (name: string, input: string, output: string) => string[];
  example: (name: string, example: string) => string;
  limitation: (name: string, caveat: string) => string;
  faq: (name: string, output: string, caveat: string) => Array<{ question: string; answer: string }>;
}

interface SemanticPack {
  overview: (example: string) => string;
  step: (example: string) => string;
}

const stripTerminalPunctuation = (value: string): string =>
  value.trim().replace(/[.!?。！？।]+$/u, '');

export const normalizeLocalizedPunctuation = (value: string): string =>
  value.replace(/([.!?。！？।])(?:\s*[.!?。！？।])+/gu, '$1');

const packs: Record<Language, LanguagePack> = {
  ko: { title: n => `${n} - 무료 브라우저 도구`, description: (n, i, o) => `${n}: ${i} 입력을 처리하고 ${o} 항목을 바로 보여 줍니다. 설치와 회원가입이 필요 없습니다.`, intent: n => `${n} 무료 온라인 사용 및 결과 확인`, overview: (n, i, o) => `${n} 기능은 ${i} 입력을 처리해 ${o} 항목을 생성합니다. 설정부터 결과까지 현재 페이지에서 단계별로 확인할 수 있습니다.`, steps: (_n, i, o) => [`${i} 항목을 입력하거나 선택합니다.`, `필요한 옵션을 검토한 뒤 실행 버튼을 누릅니다.`, `${o} 항목을 확인합니다.`], example: (n, e) => `${n} 활용 예시: ${e}`, limitation: (n, c) => `${n} 주의사항: ${c}. 중요한 결과는 원본과 다시 확인하세요.`, faq: (n, o, c) => [{ question: `${n}에서 어떤 결과를 확인할 수 있나요?`, answer: `입력과 선택한 옵션을 바탕으로 ${o} 항목을 제공합니다.` }, { question: `${n} 결과는 바로 사용해도 되나요?`, answer: `${c}. 중요한 작업에서는 결과를 검토하세요.` }] },
  en: { title: n => `${n} - Free browser tool`, description: (n, i, o) => `Use ${n} to enter ${i} and get ${o} immediately, with no installation or account required.`, intent: n => `free online ${n} with practical results`, overview: (n, i, o) => `${n} is a focused browser utility that accepts ${i} and produces ${o}. You can review each option and result without leaving the page.`, steps: (n, i, o) => [`Enter or select ${i} in ${n}.`, `Review the available options, then run ${n}.`, `Check ${o}, then copy or download it when available.`], example: (n, e) => `${n} example: ${e}`, limitation: (n, c) => `${n} limitation: ${c}. Verify important output against the original source.`, faq: (n, o, c) => [{ question: `What does ${n} produce?`, answer: `It uses your input and selected options to produce ${o}.` }, { question: `Can I rely on every ${n} result?`, answer: `${c}. Review the result before using it for important work.` }] },
  ja: { title: n => `${n} - 無料ブラウザツール`, description: (n, i, o) => `${n} に ${i} を入力して ${o} をすぐ確認できます。インストールやアカウントは不要です。`, intent: n => `${n}を無料でオンライン利用して結果を確認`, overview: (n, i, o) => `${n} は ${i} を受け取り、${o} を作成する実用的なブラウザツールです。設定と結果をページ内で順番に確認できます。`, steps: (n, i, o) => [`${n} に ${i} を入力または選択します。`, `設定を確認してから ${n} を実行します。`, `${o} を確認し、必要に応じてコピーまたはダウンロードします。`], example: (n, e) => `${n} の例: ${e}`, limitation: (n, c) => `${n} の注意点: ${c}。重要な結果は元データと照合してください。`, faq: (n, o, c) => [{ question: `${n} では何が得られますか？`, answer: `入力と設定に基づいて ${o} を提供します。` }, { question: `${n} の結果はそのまま使えますか？`, answer: `${c}。重要な用途では必ず確認してください。` }] },
  'zh-CN': { title: n => `${n} - 免费浏览器工具`, description: (n, i, o) => `在 ${n} 中输入 ${i}，即可获得 ${o}；无需安装软件或注册账号。`, intent: n => `免费在线使用 ${n} 并查看实用结果`, overview: (n, i, o) => `${n} 是一款实用的浏览器工具，可接收 ${i} 并生成 ${o}。设置和结果都能在当前页面逐步检查。`, steps: (n, i, o) => [`在 ${n} 中输入或选择 ${i}。`, `检查所需选项，然后运行 ${n}。`, `查看 ${o}，并按需复制或下载。`], example: (n, e) => `${n} 示例：${e}`, limitation: (n, c) => `${n} 的限制：${c}。重要结果请与原始资料核对。`, faq: (n, o, c) => [{ question: `${n} 会生成什么？`, answer: `它会根据输入和所选设置生成 ${o}。` }, { question: `${n} 的结果可以直接使用吗？`, answer: `${c}。用于重要工作前请检查结果。` }] },
  'zh-TW': { title: n => `${n} - 免費瀏覽器工具`, description: (n, i, o) => `在 ${n} 輸入 ${i}，即可取得 ${o}；不必安裝軟體或註冊帳號。`, intent: n => `免費線上使用 ${n} 並查看實用結果`, overview: (n, i, o) => `${n} 是實用的瀏覽器工具，可接收 ${i} 並產生 ${o}。設定與結果都能在目前頁面逐步檢查。`, steps: (n, i, o) => [`在 ${n} 輸入或選擇 ${i}。`, `檢查所需選項，然後執行 ${n}。`, `查看 ${o}，並視需要複製或下載。`], example: (n, e) => `${n} 範例：${e}`, limitation: (n, c) => `${n} 的限制：${c}。重要結果請與原始資料核對。`, faq: (n, o, c) => [{ question: `${n} 會產生什麼？`, answer: `它會依輸入與所選設定產生 ${o}。` }, { question: `${n} 的結果可以直接使用嗎？`, answer: `${c}。用於重要工作前請先檢查。` }] },
  es: { title: n => `${n} - Herramienta gratuita`, description: (n, i, o) => `Usa ${n} para introducir ${i} y obtener ${o} al instante, sin instalar nada ni crear una cuenta.`, intent: n => `${n} gratis en línea con resultados prácticos`, overview: (n, i, o) => `${n} es una herramienta de navegador que recibe ${i} y genera ${o}. Puedes revisar las opciones y el resultado sin salir de la página.`, steps: (n, i, o) => [`Introduce o selecciona ${i} en ${n}.`, `Revisa las opciones disponibles y ejecuta ${n}.`, `Comprueba el resultado: ${o}, y revisa los valores necesarios.`], example: (n, e) => `Ejemplo de ${n}: ${e}`, limitation: (n, c) => `Limitación de ${n}: ${c}. Verifica los resultados importantes con la fuente original.`, faq: (n, o, c) => [{ question: `¿Qué resultado ofrece ${n}?`, answer: `Utiliza la entrada y las opciones elegidas para generar ${o}.` }, { question: `¿Puedo confiar siempre en ${n}?`, answer: `${c}. Revisa el resultado antes de usarlo en una tarea importante.` }] },
  pt: { title: n => `${n} - Ferramenta gratuita`, description: (n, i, o) => `Use ${n} para inserir ${i} e obter ${o} imediatamente, sem instalação ou criação de conta.`, intent: n => `${n} grátis online com resultados práticos`, overview: (n, i, o) => `${n} é uma ferramenta de navegador que recebe ${i} e produz ${o}. As opções e o resultado podem ser conferidos sem sair da página.`, steps: (n, i, o) => [`Insira ou selecione ${i} em ${n}.`, `Confira as opções disponíveis e execute ${n}.`, `Verifique ${o} e copie ou baixe quando necessário.`], example: (n, e) => `Exemplo de ${n}: ${e}`, limitation: (n, c) => `Limitação de ${n}: ${c}. Confira resultados importantes com a fonte original.`, faq: (n, o, c) => [{ question: `O que ${n} produz?`, answer: `A ferramenta usa a entrada e as opções escolhidas para produzir ${o}.` }, { question: `Posso confiar em todo resultado de ${n}?`, answer: `${c}. Revise o resultado antes de um uso importante.` }] },
  de: { title: n => `${n} - Kostenloses Browser-Werkzeug`, description: (n, i, o) => `Mit ${n} geben Sie ${i} ein und erhalten sofort ${o}, ohne Installation oder Benutzerkonto.`, intent: n => `${n} kostenlos online mit praktischem Ergebnis`, overview: (n, i, o) => `${n} ist ein Browser-Werkzeug, das ${i} entgegennimmt und ${o} erzeugt. Optionen und Ergebnis lassen sich direkt auf der Seite prüfen.`, steps: (n, i, o) => [`Geben oder wählen Sie ${i} in ${n}.`, `Prüfen Sie die Optionen und starten Sie ${n}.`, `Kontrollieren Sie ${o} und kopieren oder laden Sie es bei Bedarf herunter.`], example: (n, e) => `Beispiel für ${n}: ${e}`, limitation: (n, c) => `Einschränkung von ${n}: ${c}. Wichtige Ergebnisse sollten mit der Quelle abgeglichen werden.`, faq: (n, o, c) => [{ question: `Was erzeugt ${n}?`, answer: `Aus Eingabe und Einstellungen wird ${o} erzeugt.` }, { question: `Ist jedes Ergebnis von ${n} verlässlich?`, answer: `${c}. Prüfen Sie das Ergebnis vor einer wichtigen Nutzung.` }] },
  fr: { title: n => `${n} - Outil gratuit dans le navigateur`, description: (n, i, o) => `Utilisez ${n} pour saisir ${i} et obtenir ${o} immédiatement, sans installation ni compte.`, intent: n => `${n} gratuit en ligne avec un résultat pratique`, overview: (n, i, o) => `${n} est un outil de navigateur qui reçoit ${i} et produit ${o}. Les options et le résultat se vérifient sans quitter la page.`, steps: (n, i, o) => [`Saisissez ou choisissez ${i} dans ${n}.`, `Vérifiez les options disponibles, puis lancez ${n}.`, `Contrôlez ${o}, puis copiez ou téléchargez le résultat si nécessaire.`], example: (n, e) => `Exemple avec ${n} : ${e}`, limitation: (n, c) => `Limite de ${n} : ${c}. Comparez tout résultat important à la source.`, faq: (n, o, c) => [{ question: `Que produit ${n} ?`, answer: `L’outil utilise la saisie et les options choisies pour produire ${o}.` }, { question: `Tous les résultats de ${n} sont-ils fiables ?`, answer: `${c}. Vérifiez le résultat avant un usage important.` }] },
  it: { title: n => `${n} - Strumento gratuito`, description: (n, i, o) => `Usa ${n} per inserire ${i} e ottenere ${o} subito, senza installazione né account.`, intent: n => `${n} gratis online con risultati pratici`, overview: (n, i, o) => `${n} è uno strumento nel browser che riceve ${i} e produce ${o}. Puoi controllare opzioni e risultato senza lasciare la pagina.`, steps: (n, i, o) => [`Inserisci o seleziona ${i} in ${n}.`, `Controlla le opzioni disponibili e avvia ${n}.`, `Verifica ${o}, quindi copia o scarica il risultato quando serve.`], example: (n, e) => `Esempio di ${n}: ${e}`, limitation: (n, c) => `Limite di ${n}: ${c}. Confronta i risultati importanti con la fonte originale.`, faq: (n, o, c) => [{ question: `Che cosa produce ${n}?`, answer: `Usa i dati inseriti e le opzioni scelte per produrre ${o}.` }, { question: `Posso usare sempre il risultato di ${n}?`, answer: `${c}. Controlla il risultato prima di un uso importante.` }] },
  id: { title: n => `${n} - Alat browser gratis`, description: (n, i, o) => `Gunakan ${n} untuk memasukkan ${i} dan memperoleh ${o} seketika, tanpa instalasi atau akun.`, intent: n => `${n} gratis online dengan hasil praktis`, overview: (n, i, o) => `${n} adalah alat browser yang menerima ${i} dan menghasilkan ${o}. Opsi dan hasil dapat diperiksa langsung di halaman ini.`, steps: (n, i, o) => [`Masukkan atau pilih ${i} di ${n}.`, `Periksa opsi yang tersedia lalu jalankan ${n}.`, `Tinjau ${o}, kemudian salin atau unduh jika diperlukan.`], example: (n, e) => `Contoh ${n}: ${e}`, limitation: (n, c) => `Batasan ${n}: ${c}. Cocokkan hasil penting dengan sumber asli.`, faq: (n, o, c) => [{ question: `Apa yang dihasilkan ${n}?`, answer: `Alat ini memakai masukan dan opsi pilihan untuk menghasilkan ${o}.` }, { question: `Apakah semua hasil ${n} dapat diandalkan?`, answer: `${c}. Periksa hasil sebelum dipakai untuk pekerjaan penting.` }] },
  hi: { title: n => `${n} - मुफ़्त ब्राउज़र टूल`, description: (n, i, o) => `${n} में ${i} दर्ज करके ${o} तुरंत पाएँ; किसी इंस्टॉलेशन या खाते की आवश्यकता नहीं है।`, intent: n => `${n} का मुफ़्त ऑनलाइन उपयोग और व्यावहारिक परिणाम`, overview: (n, i, o) => `${n} एक ब्राउज़र टूल है जो ${i} लेता है और ${o} देता है। विकल्प और परिणाम इसी पेज पर क्रम से जाँचे जा सकते हैं।`, steps: (n, i, o) => [`${n} में ${i} दर्ज करें या चुनें।`, `उपलब्ध विकल्प जाँचें और ${n} चलाएँ।`, `${o} जाँचें, फिर आवश्यकता होने पर कॉपी या डाउनलोड करें।`], example: (n, e) => `${n} उदाहरण: ${e}`, limitation: (n, c) => `${n} की सीमा: ${c}। महत्वपूर्ण परिणाम को मूल स्रोत से मिलाएँ।`, faq: (n, o, c) => [{ question: `${n} क्या परिणाम देता है?`, answer: `यह इनपुट और चुने गए विकल्पों से ${o} देता है।` }, { question: `क्या ${n} के हर परिणाम पर भरोसा किया जा सकता है?`, answer: `${c}। महत्वपूर्ण उपयोग से पहले परिणाम जाँचें।` }] },
};

const semanticPacks: Record<Language, SemanticPack> = {
  ko: {
    overview: example => `활용 예시: ${stripTerminalPunctuation(example)}.`,
    step: example => `결과 확인 예시: ${stripTerminalPunctuation(example)}.`,
  },
  en: {
    overview: example => `Practical example: ${stripTerminalPunctuation(example)}.`,
    step: example => `Result-check example: ${stripTerminalPunctuation(example)}.`,
  },
  ja: {
    overview: example => `活用例：${stripTerminalPunctuation(example)}。`,
    step: example => `結果確認の例：${stripTerminalPunctuation(example)}。`,
  },
  'zh-CN': {
    overview: example => `实际示例：${stripTerminalPunctuation(example)}。`,
    step: example => `结果检查示例：${stripTerminalPunctuation(example)}。`,
  },
  'zh-TW': {
    overview: example => `實際範例：${stripTerminalPunctuation(example)}。`,
    step: example => `結果檢查範例：${stripTerminalPunctuation(example)}。`,
  },
  es: {
    overview: example => `Ejemplo práctico: ${stripTerminalPunctuation(example)}.`,
    step: example => `Ejemplo para comprobar el resultado: ${stripTerminalPunctuation(example)}.`,
  },
  pt: {
    overview: example => `Exemplo prático: ${stripTerminalPunctuation(example)}.`,
    step: example => `Exemplo para conferir o resultado: ${stripTerminalPunctuation(example)}.`,
  },
  de: {
    overview: example => `Praxisbeispiel: ${stripTerminalPunctuation(example)}.`,
    step: example => `Beispiel zur Ergebniskontrolle: ${stripTerminalPunctuation(example)}.`,
  },
  fr: {
    overview: example => `Exemple concret : ${stripTerminalPunctuation(example)}.`,
    step: example => `Exemple de vérification du résultat : ${stripTerminalPunctuation(example)}.`,
  },
  it: {
    overview: example => `Esempio pratico: ${stripTerminalPunctuation(example)}.`,
    step: example => `Esempio per verificare il risultato: ${stripTerminalPunctuation(example)}.`,
  },
  id: {
    overview: example => `Contoh praktis: ${stripTerminalPunctuation(example)}.`,
    step: example => `Contoh pemeriksaan hasil: ${stripTerminalPunctuation(example)}.`,
  },
  hi: {
    overview: example => `व्यावहारिक उदाहरण: ${stripTerminalPunctuation(example)}।`,
    step: example => `परिणाम जाँचने का उदाहरण: ${stripTerminalPunctuation(example)}।`,
  },
};

const privacy: Record<Language, Record<ToolPrivacyMode, (name: string) => string>> = {
  ko: { 'local-only': () => '이 도구는 입력한 값을 브라우저에서 로컬로 처리합니다. 입력한 값은 외부 서비스로 전송되지 않습니다.', 'local-with-assets': () => '배경 제거에 필요한 모델 및 WASM 자산은 최초 실행 시 IMG.LY 자산 서버에서 다운로드될 수 있습니다. 선택한 이미지 바이트는 업로드되지 않으며 브라우저에서 로컬로 처리됩니다.', 'local-with-network-data': () => '현재 환율을 표시하기 위해 외부 환율 서비스에 요청합니다. 입력한 토큰 수, 모델 선택 및 비용 계산 값은 이 요청에 전송되지 않으며 브라우저에서 처리됩니다.', 'peer-to-peer': () => '익명 채팅은 연결 설정을 위해 PeerJS 시그널링과 STUN을 사용해 직접 WebRTC 연결을 시도합니다. TURN 릴레이는 구성하지 않습니다. 메시지는 의도한 상대 피어에게 전송됩니다. STUN으로 직접 연결을 설정하지 못할 수 있으며, 이 경우 채팅 연결이 실패할 수 있습니다. 애플리케이션 서버에 메시지 내용을 저장하도록 설계되지 않았지만, 방 연결 정보는 연결을 조정하기 위해 별도 서비스에 일시적으로 기록될 수 있습니다.' },
  en: { 'local-only': () => 'This tool processes the values you provide locally in your browser. It does not send those values to an external service.', 'local-with-assets': () => 'The model and WASM assets required for background removal may be downloaded from IMG.LY asset servers on first use. Selected image bytes are not uploaded and are processed locally in your browser.', 'local-with-network-data': () => 'Current exchange-rate data is requested from an external exchange-rate service. Your token counts, model selections, and cost-calculation values are not sent with that request and stay in your browser.', 'peer-to-peer': () => 'Anonymous chat uses PeerJS signaling and a STUN-assisted direct WebRTC connection to establish a session. No TURN relay is configured. Messages transfer to the intended peer. A direct connection may fail when STUN cannot establish a path. Message content is not designed to be stored on the application server, but room connection metadata may be temporarily recorded by a separate service to coordinate the connection.' },
  ja: { 'local-only': () => 'このツールは入力した値をブラウザ内でローカルに処理します。入力した値が外部サービスに送信されることはありません。', 'local-with-assets': () => '背景除去に必要なモデルと WASM アセットは、初回実行時に IMG.LY のアセットサーバーからダウンロードされる場合があります。選択した画像のバイトはアップロードされません。ブラウザ内でローカルに処理されます。', 'local-with-network-data': () => '現在の為替レートを表示するため、外部の為替レートサービスにリクエストします。入力したトークン数、モデルの選択、費用計算の値はそのリクエストに送信されません。ブラウザ内で処理されます。', 'peer-to-peer': () => '匿名チャットは接続確立のために PeerJS シグナリングと STUN を利用した直接の WebRTC 接続を試みます。TURN リレーは構成していません。メッセージは意図した相手のピアに転送されます。STUN で直接接続を確立できない場合があります。その場合、チャット接続が失敗することがあります。アプリケーションサーバーにメッセージ内容を保存するようには設計されていませんが、接続を調整するため、ルーム接続メタデータが別サービスに一時的に記録される場合があります。' },
  'zh-CN': { 'local-only': n => `${n} 只在此浏览器内处理输入和文件，不会将其发送给外部服务，数据也不会离开当前页面。`, 'local-with-assets': () => '背景移除模型和 WASM 资源可能从 IMG.LY 服务器下载，但所选图像字节不会上传，只在浏览器内处理。', 'local-with-network-data': () => '当前汇率会向外部汇率服务请求，但令牌数、模型选择和计算值不会随请求发送，只留在浏览器内。', 'peer-to-peer': () => 'PeerJS 信令与 STUN 会尝试不经过 TURN 中继的直接 WebRTC 连接。消息发送给对方节点；无法建立直接路径时聊天会失败。为协调连接，房间连接元数据可能由独立服务临时记录。' },
  'zh-TW': { 'local-only': n => `${n} 只在此瀏覽器內處理輸入與檔案，不會傳送給外部服務，資料也不會離開目前頁面。`, 'local-with-assets': () => '背景移除模型與 WASM 資源可能從 IMG.LY 伺服器下載，但選取的圖片位元組不會上傳，只在瀏覽器內處理。', 'local-with-network-data': () => '目前匯率會向外部匯率服務請求，但權杖數、模型選擇與計算值不會隨請求傳送，只留在瀏覽器內。', 'peer-to-peer': () => 'PeerJS 訊號與 STUN 會嘗試不經 TURN 中繼的直接 WebRTC 連線。訊息傳給對方節點；無法建立直接路徑時聊天會失敗。為協調連線，房間連線中繼資料可能由獨立服務暫時記錄。' },
  es: { 'local-only': n => `${n} procesa las entradas y los archivos únicamente en este navegador y no los envía a servicios externos.`, 'local-with-assets': () => 'El modelo de eliminación de fondo y los recursos WASM pueden descargarse de IMG.LY, pero la imagen elegida no se sube y se procesa en el navegador.', 'local-with-network-data': () => 'El tipo de cambio actual se solicita a un servicio externo, pero los tokens, el modelo y los valores calculados no se envían y permanecen en el navegador.', 'peer-to-peer': () => 'La señalización PeerJS y STUN intentan una conexión WebRTC directa sin retransmisión TURN. Los mensajes van al otro par y el chat puede fallar si no existe una ruta directa. Un servicio independiente puede registrar temporalmente metadatos de conexión de la sala para coordinarla.' },
  pt: { 'local-only': n => `${n} processa entradas e arquivos somente neste navegador e não os envia a serviços externos.`, 'local-with-assets': () => 'O modelo de remoção de fundo e os recursos WASM podem ser baixados da IMG.LY, mas a imagem escolhida não é enviada e é processada no navegador.', 'local-with-network-data': () => 'A cotação de câmbio atual vem de um serviço externo, mas tokens, modelo e valores calculados não são enviados e permanecem no navegador.', 'peer-to-peer': () => 'A sinalização PeerJS e o STUN tentam uma conexão WebRTC direta sem relay TURN. As mensagens vão ao outro par e o chat pode falhar quando não há rota direta. Um serviço separado pode registrar temporariamente metadados de conexão da sala para coordená-la.' },
  de: { 'local-only': n => `${n} verarbeitet Eingaben und Dateien nur in diesem Browser und sendet sie nicht an externe Dienste.`, 'local-with-assets': () => 'Modell und WASM-Dateien zur Hintergrundentfernung können von IMG.LY geladen werden; das gewählte Bild wird nicht hochgeladen und im Browser verarbeitet.', 'local-with-network-data': () => 'Aktuelle Wechselkursdaten werden extern abgerufen; Tokenzahlen, Modellauswahl und Rechenwerte werden nicht übertragen und bleiben im Browser.', 'peer-to-peer': () => 'PeerJS-Signalisierung und STUN versuchen eine direkte WebRTC-Verbindung ohne TURN-Relay. Nachrichten gehen an den anderen Peer; ohne direkten Pfad kann der Chat scheitern. Ein separater Dienst kann Raum-Verbindungsmetadaten zur Koordination vorübergehend speichern.' },
  fr: { 'local-only': n => `${n} traite les saisies et fichiers uniquement dans ce navigateur et ne les transmet à aucun service externe.`, 'local-with-assets': () => 'Le modèle de détourage et les ressources WASM peuvent être téléchargés depuis IMG.LY, mais l’image choisie n’est pas envoyée et reste traitée dans le navigateur.', 'local-with-network-data': () => 'Le taux de change actuel provient d’un service externe, mais le nombre de jetons, le modèle et les valeurs calculées ne sont pas transmis et restent dans le navigateur.', 'peer-to-peer': () => 'La signalisation PeerJS et STUN tentent une connexion WebRTC directe sans relais TURN. Les messages vont à l’autre pair ; sans chemin direct, le chat peut échouer. Un service distinct peut enregistrer temporairement les métadonnées de connexion du salon pour coordonner la connexion.' },
  it: { 'local-only': n => `${n} elabora input e file soltanto in questo browser e non li invia a servizi esterni.`, 'local-with-assets': () => 'Il modello per rimuovere lo sfondo e le risorse WASM possono essere scaricati da IMG.LY, ma l’immagine scelta non viene caricata ed è elaborata nel browser.', 'local-with-network-data': () => 'Il tasso di cambio attuale viene richiesto a un servizio esterno, ma token, modello e valori calcolati non vengono inviati e restano nel browser.', 'peer-to-peer': () => 'La segnalazione PeerJS e STUN tentano una connessione WebRTC diretta senza relay TURN. I messaggi vanno all’altro peer; senza percorso diretto la chat può non connettersi. Un servizio separato può registrare temporaneamente i metadati di connessione della stanza per coordinarla.' },
  id: { 'local-only': n => `${n} memproses masukan dan file hanya di browser ini dan tidak mengirimkannya ke layanan eksternal.`, 'local-with-assets': () => 'Model penghapus latar dan aset WASM dapat diunduh dari IMG.LY, tetapi byte gambar yang dipilih tidak diunggah dan diproses di browser.', 'local-with-network-data': () => 'Kurs saat ini diminta dari layanan eksternal, tetapi jumlah token, pilihan model, dan nilai perhitungan tidak dikirim serta tetap di browser.', 'peer-to-peer': () => 'Sinyal PeerJS dan STUN mencoba koneksi WebRTC langsung tanpa relay TURN. Pesan dikirim ke peer tujuan; chat dapat gagal jika jalur langsung tidak tersedia. Layanan terpisah dapat mencatat sementara metadata koneksi ruang untuk mengoordinasikan koneksi.' },
  hi: { 'local-only': n => `${n} इनपुट और फ़ाइलों को केवल इस ब्राउज़र में प्रोसेस करता है और किसी बाहरी सेवा को नहीं भेजता।`, 'local-with-assets': () => 'बैकग्राउंड हटाने का मॉडल और WASM संसाधन IMG.LY से डाउनलोड हो सकते हैं, लेकिन चुनी गई इमेज अपलोड नहीं होती और ब्राउज़र में प्रोसेस होती है।', 'local-with-network-data': () => 'मौजूदा विनिमय दर बाहरी सेवा से ली जाती है, लेकिन टोकन संख्या, मॉडल चयन और गणना मान भेजे नहीं जाते तथा ब्राउज़र में रहते हैं।', 'peer-to-peer': () => 'PeerJS सिग्नलिंग और STUN बिना TURN रिले के सीधा WebRTC कनेक्शन आज़माते हैं। संदेश दूसरे peer को जाते हैं; सीधा रास्ता न मिलने पर चैट विफल हो सकती है। कनेक्शन समन्वय के लिए अलग सेवा रूम कनेक्शन मेटाडेटा को अस्थायी रूप से दर्ज कर सकती है।' },
};

export function createCompleteLocalizedContent(slug: string, privacyMode: ToolPrivacyMode): Localized<ToolContent> {
  const profile = profiles[slug];
  if (!profile) throw new Error(`Missing localized content profile for ${slug}`);

  return Object.fromEntries(supportedLanguages.map(lang => {
    const pack = packs[lang];
    const semanticPack = semanticPacks[lang];
    const localizedProfile = lang === 'en' ? null : localizedProfiles[lang][slug];
    if (lang !== 'en' && !localizedProfile) throw new Error(`Missing ${lang} profile for ${slug}`);
    const label = localizedProfile?.name ?? profile.label;
    const input = localizedProfile?.input ?? profile.input;
    const output = localizedProfile?.output ?? profile.output;
    const caveat = localizedProfile?.limitation ?? profile.caveat;
    const example = localizedProfile?.example ?? profile.example;
    const faq = pack.faq(label, output, caveat).map(item => ({
      question: normalizeLocalizedPunctuation(item.question),
      answer: normalizeLocalizedPunctuation(item.answer),
    }));
    return [lang, {
      status: 'complete',
      name: label,
      title: pack.title(label),
      description: normalizeLocalizedPunctuation(pack.description(label, input, output)),
      searchIntent: pack.intent(label),
      overview: normalizeLocalizedPunctuation(`${pack.overview(label, input, output)} ${semanticPack.overview(example)}`),
      steps: buildLocalizedWorkflow(slug, lang, { name: label, input, output }).map(normalizeLocalizedPunctuation),
      examples: [normalizeLocalizedPunctuation(pack.example(label, example))],
      limitations: [normalizeLocalizedPunctuation(pack.limitation(label, caveat))],
      privacy: normalizeLocalizedPunctuation(privacy[lang][privacyMode](label)),
      faq,
    } satisfies ToolContent];
  })) as Localized<ToolContent>;
}

export function createAdditionalLocalizedContent(
  slug: string,
  additionalProfiles: Record<Language, AdditionalToolProfile>,
  privacyMode: ToolPrivacyMode = 'local-only',
): Localized<ToolContent> {
  return Object.fromEntries(supportedLanguages.map(lang => {
    const pack = packs[lang];
    const semanticPack = semanticPacks[lang];
    const profile = additionalProfiles[lang];
    if (!profile) throw new Error(`Missing ${lang} additional profile for ${slug}`);
    const faq = pack.faq(profile.name, profile.output, profile.limitation).map(item => ({
      question: normalizeLocalizedPunctuation(item.question),
      answer: normalizeLocalizedPunctuation(item.answer),
    }));
    return [lang, {
      status: 'complete',
      name: profile.name,
      title: pack.title(profile.name),
      description: normalizeLocalizedPunctuation(pack.description(profile.name, profile.input, profile.output)),
      searchIntent: pack.intent(profile.name),
      overview: normalizeLocalizedPunctuation(`${pack.overview(profile.name, profile.input, profile.output)} ${semanticPack.overview(profile.example)}`),
      steps: buildLocalizedWorkflow(slug, lang, { name: profile.name, input: profile.input, output: profile.output }).map(normalizeLocalizedPunctuation),
      examples: [normalizeLocalizedPunctuation(pack.example(profile.name, profile.example))],
      limitations: [normalizeLocalizedPunctuation(pack.limitation(profile.name, profile.limitation))],
      privacy: normalizeLocalizedPunctuation(privacy[lang][privacyMode](profile.name)),
      faq,
    } satisfies ToolContent];
  })) as Localized<ToolContent>;
}

export function getEnglishProfilePhrases(slug: string): Pick<ToolProfile, 'label' | 'input' | 'output' | 'caveat'> {
  const profile = profiles[slug];
  if (profile) return { label: profile.label, input: profile.input, output: profile.output, caveat: profile.caveat };

  const additional = [...pdfTools, ...dataTextTools, ...mediaCalcTools, ...randomTools, ...dateTools]
    .find(tool => tool.slug === slug)?.profiles.en;
  if (!additional) throw new Error(`Missing localized content profile for ${slug}`);
  return {
    label: additional.name,
    input: additional.input,
    output: additional.output,
    caveat: additional.limitation,
  };
}
