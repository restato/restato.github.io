import type { Language, ToolDefinition } from '../data/tools/types';

export interface LandingContent {
  title: string;
  description: string;
  heading: string;
  intro: string;
  clusters: string;
  allTools: string;
  fallbackNotice: string;
  localPrivacy: string;
}

export const landingContent = {
  ko: {
    title: '무료 온라인 도구 허브 | Restato',
    description: '계산, 개발, 텍스트, 이미지 작업을 브라우저에서 빠르게 처리하는 무료 온라인 도구를 목적별로 찾아보세요.',
    heading: '필요한 작업을 바로 해결하세요',
    intro: '설치나 회원가입 없이 사용할 수 있는 실용적인 웹 도구를 한곳에 모았습니다.',
    clusters: '작업별 도구',
    allTools: '전체 도구 보기',
    fallbackNotice: '이 도구의 설명은 아직 이 언어로 준비되지 않아 영어로 표시됩니다.',
    localPrivacy: '대부분의 입력과 파일은 브라우저 안에서 처리됩니다.',
  },
  en: {
    title: 'Free Online Tool Hub | Restato',
    description: 'Find free browser-based tools for calculations, development, text, images, design, and everyday productivity.',
    heading: 'Get the job done right away',
    intro: 'A practical collection of web tools you can use without installing software or creating an account.',
    clusters: 'Tools by task',
    allTools: 'Browse all tools',
    fallbackNotice: 'This tool description is not yet available in your language, so it is shown in English.',
    localPrivacy: 'Most inputs and files are processed inside your browser.',
  },
  ja: {
    title: '無料オンラインツールハブ | Restato',
    description: '計算、開発、テキスト、画像、デザインなどの作業に役立つ無料ブラウザツールを目的別に探せます。',
    heading: '必要な作業をすぐに解決',
    intro: 'インストールや会員登録なしで使える実用的なウェブツールをまとめました。',
    clusters: '作業別ツール',
    allTools: 'すべてのツールを見る',
    fallbackNotice: 'このツールの説明はまだ日本語に対応していないため、英語で表示されます。',
    localPrivacy: 'ほとんどの入力とファイルはブラウザ内で処理されます。',
  },
  'zh-CN': {
    title: '免费在线工具中心 | Restato',
    description: '按用途查找适用于计算、开发、文本、图像、设计和日常效率的免费浏览器工具。',
    heading: '立即完成手头的任务',
    intro: '无需安装软件或注册账号，即可使用这一系列实用的网页工具。',
    clusters: '按任务浏览工具',
    allTools: '查看全部工具',
    fallbackNotice: '此工具的说明尚未提供简体中文版本，因此目前以英文显示。',
    localPrivacy: '大多数输入内容和文件都只在您的浏览器中处理。',
  },
  'zh-TW': {
    title: '免費線上工具中心 | Restato',
    description: '依用途尋找適合計算、開發、文字、圖片、設計與日常效率的免費瀏覽器工具。',
    heading: '立即完成手邊的工作',
    intro: '無需安裝軟體或註冊帳號，即可使用這一系列實用的網頁工具。',
    clusters: '依工作瀏覽工具',
    allTools: '查看全部工具',
    fallbackNotice: '此工具的說明尚未提供繁體中文版本，因此目前以英文顯示。',
    localPrivacy: '大多數輸入內容與檔案都只在您的瀏覽器中處理。',
  },
  es: {
    title: 'Centro de herramientas online gratis | Restato',
    description: 'Encuentra herramientas gratuitas en el navegador para cálculos, desarrollo, texto, imágenes, diseño y productividad diaria.',
    heading: 'Resuelve tu tarea ahora mismo',
    intro: 'Una colección práctica de herramientas web sin instalaciones ni necesidad de crear una cuenta.',
    clusters: 'Herramientas por tarea',
    allTools: 'Ver todas las herramientas',
    fallbackNotice: 'La descripción de esta herramienta aún no está disponible en español y se muestra en inglés.',
    localPrivacy: 'La mayoría de los datos y archivos se procesan dentro de tu navegador.',
  },
  pt: {
    title: 'Central de ferramentas online grátis | Restato',
    description: 'Encontre ferramentas gratuitas no navegador para cálculos, desenvolvimento, texto, imagens, design e produtividade diária.',
    heading: 'Resolva sua tarefa agora',
    intro: 'Uma coleção prática de ferramentas web sem instalação de programas nem criação de conta.',
    clusters: 'Ferramentas por tarefa',
    allTools: 'Ver todas as ferramentas',
    fallbackNotice: 'A descrição desta ferramenta ainda não está disponível em português e aparece em inglês.',
    localPrivacy: 'A maioria dos dados e arquivos é processada dentro do seu navegador.',
  },
  de: {
    title: 'Kostenlose Online-Tools | Restato',
    description: 'Finde kostenlose Browser-Tools für Berechnungen, Entwicklung, Texte, Bilder, Design und tägliche Produktivität.',
    heading: 'Erledige deine Aufgabe sofort',
    intro: 'Eine praktische Sammlung von Web-Tools ohne Installation und ohne Benutzerkonto.',
    clusters: 'Tools nach Aufgabe',
    allTools: 'Alle Tools ansehen',
    fallbackNotice: 'Die Beschreibung dieses Tools ist noch nicht auf Deutsch verfügbar und wird auf Englisch angezeigt.',
    localPrivacy: 'Die meisten Eingaben und Dateien werden direkt in deinem Browser verarbeitet.',
  },
  fr: {
    title: 'Centre d’outils gratuits en ligne | Restato',
    description: 'Trouvez des outils gratuits dans le navigateur pour le calcul, le développement, le texte, les images, le design et la productivité.',
    heading: 'Réalisez votre tâche immédiatement',
    intro: 'Une collection pratique d’outils web sans installation de logiciel ni création de compte.',
    clusters: 'Outils par tâche',
    allTools: 'Voir tous les outils',
    fallbackNotice: 'La description de cet outil n’est pas encore disponible en français et s’affiche en anglais.',
    localPrivacy: 'La plupart des saisies et fichiers sont traités directement dans votre navigateur.',
  },
  it: {
    title: 'Raccolta di strumenti online gratuiti | Restato',
    description: 'Trova strumenti gratuiti nel browser per calcoli, sviluppo, testo, immagini, design e produttività quotidiana.',
    heading: 'Completa subito il tuo lavoro',
    intro: 'Una raccolta pratica di strumenti web senza installazione di software e senza registrazione.',
    clusters: 'Strumenti per attività',
    allTools: 'Vedi tutti gli strumenti',
    fallbackNotice: 'La descrizione di questo strumento non è ancora disponibile in italiano e viene mostrata in inglese.',
    localPrivacy: 'La maggior parte dei dati e dei file viene elaborata direttamente nel browser.',
  },
  id: {
    title: 'Pusat alat online gratis | Restato',
    description: 'Temukan alat gratis berbasis browser untuk perhitungan, pengembangan, teks, gambar, desain, dan produktivitas sehari-hari.',
    heading: 'Selesaikan pekerjaan sekarang juga',
    intro: 'Kumpulan alat web praktis yang dapat digunakan tanpa instalasi atau membuat akun.',
    clusters: 'Alat berdasarkan tugas',
    allTools: 'Lihat semua alat',
    fallbackNotice: 'Deskripsi alat ini belum tersedia dalam bahasa Indonesia sehingga ditampilkan dalam bahasa Inggris.',
    localPrivacy: 'Sebagian besar input dan file diproses langsung di dalam browser Anda.',
  },
  hi: {
    title: 'मुफ़्त ऑनलाइन टूल केंद्र | Restato',
    description: 'गणना, डेवलपमेंट, टेक्स्ट, इमेज, डिज़ाइन और रोज़मर्रा की उत्पादकता के लिए मुफ़्त ब्राउज़र टूल खोजें।',
    heading: 'अपना काम तुरंत पूरा करें',
    intro: 'बिना सॉफ़्टवेयर इंस्टॉल किए या खाता बनाए उपयोग किए जा सकने वाले व्यावहारिक वेब टूल।',
    clusters: 'काम के अनुसार टूल',
    allTools: 'सभी टूल देखें',
    fallbackNotice: 'इस टूल का विवरण अभी हिन्दी में उपलब्ध नहीं है, इसलिए इसे अंग्रेज़ी में दिखाया गया है।',
    localPrivacy: 'अधिकांश इनपुट और फ़ाइलें आपके ब्राउज़र में ही प्रोसेस होती हैं।',
  },
} satisfies Record<Language, LandingContent>;

const incompleteContentNotices: Partial<Record<Language, string>> = {
  ko: '이 도구는 현재 일부 안내만 한국어로 제공되며 전체 콘텐츠 번역이 진행 중입니다.',
  en: 'This tool currently provides partial guidance while the complete content is being prepared.',
  ja: 'このツールは現在、一部の案内のみ日本語で提供しており、完全な翻訳を準備中です。',
};

export function getToolFallbackNotice(tool: ToolDefinition, lang: Language): string | null {
  const localizedContent = tool.content[lang];
  const renderedContent = localizedContent ?? tool.content.en ?? tool.content.ko;
  if (!renderedContent || renderedContent.status === 'complete') return null;

  return localizedContent
    ? incompleteContentNotices[lang] ?? incompleteContentNotices.en!
    : landingContent[lang].fallbackNotice;
}
