import type { Language } from '../data/tools/types';

export interface SharedToolUi {
  home: string;
  tools: string;
  catalogTitle: string;
  allCategories: string;
  copy: string;
  download: string;
  clear: string;
  input: string;
  output: string;
  loading: string;
  valid: string;
  invalid: string;
  success: string;
  error: string;
  usageGuide: string;
  limitations: string;
  privacy: string;
  faq: string;
  fallbackNotice: string;
  footer: string;
}

export const sharedToolUi: Record<Language, SharedToolUi> = {
  ko: { home: '홈', tools: '도구', catalogTitle: '무료 온라인 도구', allCategories: '전체', copy: '복사', download: '다운로드', clear: '지우기', input: '입력', output: '출력', loading: '처리 중…', valid: '유효함', invalid: '유효하지 않음', success: '완료', error: '오류', usageGuide: '사용 방법', limitations: '제한 사항', privacy: '개인정보 처리', faq: '자주 묻는 질문', fallbackNotice: '이 설명은 아직 요청한 언어로 완성되지 않아 영어로 표시됩니다.', footer: '브라우저에서 바로 사용하는 Restato 도구' },
  en: { home: 'Home', tools: 'Tools', catalogTitle: 'Free online tools', allCategories: 'All', copy: 'Copy', download: 'Download', clear: 'Clear', input: 'Input', output: 'Output', loading: 'Processing…', valid: 'Valid', invalid: 'Invalid', success: 'Complete', error: 'Error', usageGuide: 'How to use', limitations: 'Limitations', privacy: 'Privacy', faq: 'Frequently asked questions', fallbackNotice: 'This description is not complete in the requested language, so the English version is shown.', footer: 'Restato tools that run in your browser' },
  ja: { home: 'ホーム', tools: 'ツール', catalogTitle: '無料オンラインツール', allCategories: 'すべて', copy: 'コピー', download: 'ダウンロード', clear: 'クリア', input: '入力', output: '出力', loading: '処理中…', valid: '有効', invalid: '無効', success: '完了', error: 'エラー', usageGuide: '使い方', limitations: '制限事項', privacy: 'プライバシー', faq: 'よくある質問', fallbackNotice: 'この説明は指定した言語では未完成のため、英語版を表示しています。', footer: 'ブラウザですぐ使える Restato ツール' },
  'zh-CN': { home: '首页', tools: '工具', catalogTitle: '免费在线工具', allCategories: '全部', copy: '复制', download: '下载', clear: '清除', input: '输入', output: '输出', loading: '处理中…', valid: '有效', invalid: '无效', success: '已完成', error: '错误', usageGuide: '使用方法', limitations: '限制', privacy: '隐私', faq: '常见问题', fallbackNotice: '此说明尚未完成所请求语言的版本，因此显示英文版本。', footer: '可直接在浏览器中使用的 Restato 工具' },
  'zh-TW': { home: '首頁', tools: '工具', catalogTitle: '免費線上工具', allCategories: '全部', copy: '複製', download: '下載', clear: '清除', input: '輸入', output: '輸出', loading: '處理中…', valid: '有效', invalid: '無效', success: '已完成', error: '錯誤', usageGuide: '使用方法', limitations: '限制', privacy: '隱私', faq: '常見問題', fallbackNotice: '此說明尚未完成所要求語言的版本，因此顯示英文版本。', footer: '可直接在瀏覽器中使用的 Restato 工具' },
  es: { home: 'Inicio', tools: 'Herramientas', catalogTitle: 'Herramientas gratuitas en línea', allCategories: 'Todas', copy: 'Copiar', download: 'Descargar', clear: 'Borrar', input: 'Entrada', output: 'Resultado', loading: 'Procesando…', valid: 'Válido', invalid: 'No válido', success: 'Completado', error: 'Error', usageGuide: 'Cómo usar', limitations: 'Limitaciones', privacy: 'Privacidad', faq: 'Preguntas frecuentes', fallbackNotice: 'Esta descripción aún no está completa en el idioma solicitado; se muestra la versión en inglés.', footer: 'Herramientas Restato que funcionan en tu navegador' },
  pt: { home: 'Início', tools: 'Ferramentas', catalogTitle: 'Ferramentas online gratuitas', allCategories: 'Todas', copy: 'Copiar', download: 'Baixar', clear: 'Limpar', input: 'Entrada', output: 'Saída', loading: 'Processando…', valid: 'Válido', invalid: 'Inválido', success: 'Concluído', error: 'Erro', usageGuide: 'Como usar', limitations: 'Limitações', privacy: 'Privacidade', faq: 'Perguntas frequentes', fallbackNotice: 'Esta descrição ainda não está completa no idioma solicitado; a versão em inglês é exibida.', footer: 'Ferramentas Restato que funcionam no navegador' },
  de: { home: 'Start', tools: 'Werkzeuge', catalogTitle: 'Kostenlose Online-Werkzeuge', allCategories: 'Alle', copy: 'Kopieren', download: 'Herunterladen', clear: 'Leeren', input: 'Eingabe', output: 'Ausgabe', loading: 'Wird verarbeitet…', valid: 'Gültig', invalid: 'Ungültig', success: 'Abgeschlossen', error: 'Fehler', usageGuide: 'Anwendung', limitations: 'Einschränkungen', privacy: 'Datenschutz', faq: 'Häufige Fragen', fallbackNotice: 'Diese Beschreibung ist in der gewünschten Sprache noch nicht vollständig; die englische Version wird angezeigt.', footer: 'Restato-Werkzeuge direkt im Browser' },
  fr: { home: 'Accueil', tools: 'Outils', catalogTitle: 'Outils gratuits en ligne', allCategories: 'Tous', copy: 'Copier', download: 'Télécharger', clear: 'Effacer', input: 'Entrée', output: 'Résultat', loading: 'Traitement…', valid: 'Valide', invalid: 'Non valide', success: 'Terminé', error: 'Erreur', usageGuide: 'Mode d’emploi', limitations: 'Limites', privacy: 'Confidentialité', faq: 'Questions fréquentes', fallbackNotice: 'Cette description n’est pas encore complète dans la langue demandée ; la version anglaise est affichée.', footer: 'Outils Restato utilisables dans le navigateur' },
  it: { home: 'Home', tools: 'Strumenti', catalogTitle: 'Strumenti online gratuiti', allCategories: 'Tutti', copy: 'Copia', download: 'Scarica', clear: 'Cancella', input: 'Input', output: 'Risultato', loading: 'Elaborazione…', valid: 'Valido', invalid: 'Non valido', success: 'Completato', error: 'Errore', usageGuide: 'Come si usa', limitations: 'Limitazioni', privacy: 'Privacy', faq: 'Domande frequenti', fallbackNotice: 'Questa descrizione non è ancora completa nella lingua richiesta; viene mostrata la versione inglese.', footer: 'Strumenti Restato utilizzabili nel browser' },
  id: { home: 'Beranda', tools: 'Alat', catalogTitle: 'Alat online gratis', allCategories: 'Semua', copy: 'Salin', download: 'Unduh', clear: 'Hapus', input: 'Masukan', output: 'Keluaran', loading: 'Memproses…', valid: 'Valid', invalid: 'Tidak valid', success: 'Selesai', error: 'Kesalahan', usageGuide: 'Cara menggunakan', limitations: 'Batasan', privacy: 'Privasi', faq: 'Pertanyaan umum', fallbackNotice: 'Deskripsi ini belum lengkap dalam bahasa yang diminta; versi bahasa Inggris ditampilkan.', footer: 'Alat Restato yang berjalan di browser' },
  hi: { home: 'होम', tools: 'टूल', catalogTitle: 'मुफ़्त ऑनलाइन टूल', allCategories: 'सभी', copy: 'कॉपी करें', download: 'डाउनलोड', clear: 'साफ़ करें', input: 'इनपुट', output: 'आउटपुट', loading: 'प्रोसेस हो रहा है…', valid: 'मान्य', invalid: 'अमान्य', success: 'पूरा हुआ', error: 'त्रुटि', usageGuide: 'उपयोग का तरीका', limitations: 'सीमाएँ', privacy: 'गोपनीयता', faq: 'अक्सर पूछे जाने वाले प्रश्न', fallbackNotice: 'यह विवरण माँगी गई भाषा में अभी पूरा नहीं है, इसलिए अंग्रेज़ी संस्करण दिखाया गया है।', footer: 'ब्राउज़र में चलने वाले Restato टूल' },
};

export type ToolCategory = 'all' | 'generators' | 'converters' | 'text' | 'developer' | 'design' | 'image' | 'marketing' | 'productivity' | 'calculators' | 'random';

export const categoryTranslations: Record<Language, Record<ToolCategory, string>> = {
  ko: { all: '전체', generators: '생성기', converters: '변환기', text: '텍스트', developer: '개발자', design: '디자인', image: '이미지', marketing: '마케팅', productivity: '생산성', calculators: '계산기', random: '무작위' },
  en: { all: 'All', generators: 'Generators', converters: 'Converters', text: 'Text', developer: 'Developer', design: 'Design', image: 'Image', marketing: 'Marketing', productivity: 'Productivity', calculators: 'Calculators', random: 'Random' },
  ja: { all: 'すべて', generators: '生成', converters: '変換', text: 'テキスト', developer: '開発者', design: 'デザイン', image: '画像', marketing: 'マーケティング', productivity: '生産性', calculators: '計算', random: 'ランダム' },
  'zh-CN': { all: '全部', generators: '生成器', converters: '转换器', text: '文本', developer: '开发者', design: '设计', image: '图像', marketing: '营销', productivity: '效率', calculators: '计算器', random: '随机' },
  'zh-TW': { all: '全部', generators: '產生器', converters: '轉換器', text: '文字', developer: '開發者', design: '設計', image: '圖片', marketing: '行銷', productivity: '生產力', calculators: '計算器', random: '隨機' },
  es: { all: 'Todas', generators: 'Generadores', converters: 'Conversores', text: 'Texto', developer: 'Desarrollo', design: 'Diseño', image: 'Imagen', marketing: 'Marketing', productivity: 'Productividad', calculators: 'Calculadoras', random: 'Aleatorio' },
  pt: { all: 'Todas', generators: 'Geradores', converters: 'Conversores', text: 'Texto', developer: 'Desenvolvimento', design: 'Design', image: 'Imagem', marketing: 'Marketing', productivity: 'Produtividade', calculators: 'Calculadoras', random: 'Aleatório' },
  de: { all: 'Alle', generators: 'Generatoren', converters: 'Konverter', text: 'Text', developer: 'Entwicklung', design: 'Design', image: 'Bild', marketing: 'Marketing', productivity: 'Produktivität', calculators: 'Rechner', random: 'Zufall' },
  fr: { all: 'Tous', generators: 'Générateurs', converters: 'Convertisseurs', text: 'Texte', developer: 'Développement', design: 'Design', image: 'Image', marketing: 'Marketing', productivity: 'Productivité', calculators: 'Calculatrices', random: 'Aléatoire' },
  it: { all: 'Tutti', generators: 'Generatori', converters: 'Convertitori', text: 'Testo', developer: 'Sviluppo', design: 'Design', image: 'Immagine', marketing: 'Marketing', productivity: 'Produttività', calculators: 'Calcolatrici', random: 'Casuale' },
  id: { all: 'Semua', generators: 'Generator', converters: 'Konverter', text: 'Teks', developer: 'Pengembang', design: 'Desain', image: 'Gambar', marketing: 'Pemasaran', productivity: 'Produktivitas', calculators: 'Kalkulator', random: 'Acak' },
  hi: { all: 'सभी', generators: 'जनरेटर', converters: 'कन्वर्टर', text: 'टेक्स्ट', developer: 'डेवलपर', design: 'डिज़ाइन', image: 'इमेज', marketing: 'मार्केटिंग', productivity: 'उत्पादकता', calculators: 'कैलकुलेटर', random: 'रैंडम' },
};

export interface SiteChromeCopy {
  nav: { home: string; blog: string; articles: string; jobs: string; tools: string; games: string; projects: string };
  selectLanguage: string;
  darkMode: string;
  toggleMenu: string;
}

export const siteChrome: Record<Language, SiteChromeCopy> = {
  ko: { nav: { home: '홈', blog: '블로그', articles: '아티클', jobs: '채용', tools: '도구', games: '게임', projects: '프로젝트' }, selectLanguage: '언어 선택', darkMode: '다크 모드', toggleMenu: '메뉴 열기 또는 닫기' },
  en: { nav: { home: 'Home', blog: 'Blog', articles: 'Articles', jobs: 'Jobs', tools: 'Tools', games: 'Games', projects: 'Projects' }, selectLanguage: 'Select language', darkMode: 'Dark mode', toggleMenu: 'Open or close menu' },
  ja: { nav: { home: 'ホーム', blog: 'ブログ', articles: '記事', jobs: '採用', tools: 'ツール', games: 'ゲーム', projects: 'プロジェクト' }, selectLanguage: '言語を選択', darkMode: 'ダークモード', toggleMenu: 'メニューを開閉' },
  'zh-CN': { nav: { home: '首页', blog: '博客', articles: '文章', jobs: '职位', tools: '工具', games: '游戏', projects: '项目' }, selectLanguage: '选择语言', darkMode: '深色模式', toggleMenu: '打开或关闭菜单' },
  'zh-TW': { nav: { home: '首頁', blog: '部落格', articles: '文章', jobs: '職缺', tools: '工具', games: '遊戲', projects: '專案' }, selectLanguage: '選擇語言', darkMode: '深色模式', toggleMenu: '開啟或關閉選單' },
  es: { nav: { home: 'Inicio', blog: 'Blog', articles: 'Artículos', jobs: 'Empleo', tools: 'Herramientas', games: 'Juegos', projects: 'Proyectos' }, selectLanguage: 'Elegir idioma', darkMode: 'Modo oscuro', toggleMenu: 'Abrir o cerrar menú' },
  pt: { nav: { home: 'Início', blog: 'Blog', articles: 'Artigos', jobs: 'Vagas', tools: 'Ferramentas', games: 'Jogos', projects: 'Projetos' }, selectLanguage: 'Selecionar idioma', darkMode: 'Modo escuro', toggleMenu: 'Abrir ou fechar menu' },
  de: { nav: { home: 'Start', blog: 'Blog', articles: 'Artikel', jobs: 'Stellen', tools: 'Werkzeuge', games: 'Spiele', projects: 'Projekte' }, selectLanguage: 'Sprache auswählen', darkMode: 'Dunkler Modus', toggleMenu: 'Menü öffnen oder schließen' },
  fr: { nav: { home: 'Accueil', blog: 'Blog', articles: 'Articles', jobs: 'Emplois', tools: 'Outils', games: 'Jeux', projects: 'Projets' }, selectLanguage: 'Choisir la langue', darkMode: 'Mode sombre', toggleMenu: 'Ouvrir ou fermer le menu' },
  it: { nav: { home: 'Home', blog: 'Blog', articles: 'Articoli', jobs: 'Lavoro', tools: 'Strumenti', games: 'Giochi', projects: 'Progetti' }, selectLanguage: 'Seleziona lingua', darkMode: 'Modalità scura', toggleMenu: 'Apri o chiudi menu' },
  id: { nav: { home: 'Beranda', blog: 'Blog', articles: 'Artikel', jobs: 'Lowongan', tools: 'Alat', games: 'Gim', projects: 'Proyek' }, selectLanguage: 'Pilih bahasa', darkMode: 'Mode gelap', toggleMenu: 'Buka atau tutup menu' },
  hi: { nav: { home: 'होम', blog: 'ब्लॉग', articles: 'लेख', jobs: 'नौकरियाँ', tools: 'टूल', games: 'गेम', projects: 'प्रोजेक्ट' }, selectLanguage: 'भाषा चुनें', darkMode: 'डार्क मोड', toggleMenu: 'मेन्यू खोलें या बंद करें' },
};

export const catalogUi: Record<Language, { description: string; information: string; privacy: string; free: string; responsive: string; recent: string; search: string; noResults: string; tryAnother: string; count: (count: number) => string }> = {
  ko: { description: '계산, 개발, 텍스트, 이미지와 일상 업무에 바로 쓰는 무료 브라우저 도구입니다.', information: '도구 안내', privacy: '각 페이지에서 로컬 처리와 외부 네트워크 사용 여부를 정확히 알립니다.', free: '무료이며 회원가입이 필요 없습니다.', responsive: '모바일과 데스크톱에서 사용할 수 있습니다.', recent: '최근 사용', search: '도구 검색… (⌘K)', noResults: '검색 결과가 없습니다', tryAnother: '다른 검색어를 입력해 보세요', count: n => `도구 ${n}개` },
  en: { description: 'Free browser tools for calculations, development, text, images and everyday tasks.', information: 'Tool information', privacy: 'Each page accurately discloses local processing and external network use.', free: 'Free to use with no registration required.', responsive: 'Works on mobile and desktop.', recent: 'Recently used', search: 'Search tools… (⌘K)', noResults: 'No tools found', tryAnother: 'Try another search term', count: n => `${n} tools` },
  ja: { description: '計算、開発、テキスト、画像、日常作業にすぐ使える無料ブラウザツールです。', information: 'ツール情報', privacy: '各ページでローカル処理と外部ネットワーク利用の有無を正確に案内します。', free: '無料で、会員登録は不要です。', responsive: 'モバイルとデスクトップで利用できます。', recent: '最近使用したツール', search: 'ツールを検索… (⌘K)', noResults: 'ツールが見つかりません', tryAnother: '別の検索語をお試しください', count: n => `${n}個のツール` },
  'zh-CN': { description: '用于计算、开发、文本、图像和日常任务的免费浏览器工具。', information: '工具说明', privacy: '每个页面都会准确说明本地处理和外部网络使用情况。', free: '免费使用，无需注册。', responsive: '支持移动设备和桌面设备。', recent: '最近使用', search: '搜索工具… (⌘K)', noResults: '未找到工具', tryAnother: '请尝试其他搜索词', count: n => `${n} 个工具` },
  'zh-TW': { description: '適用於計算、開發、文字、圖片與日常工作的免費瀏覽器工具。', information: '工具說明', privacy: '每個頁面都會正確說明本機處理與外部網路使用情況。', free: '免費使用，不必註冊。', responsive: '支援行動裝置與桌面裝置。', recent: '最近使用', search: '搜尋工具… (⌘K)', noResults: '找不到工具', tryAnother: '請嘗試其他搜尋詞', count: n => `${n} 個工具` },
  es: { description: 'Herramientas gratuitas en el navegador para cálculos, desarrollo, texto, imágenes y tareas diarias.', information: 'Información de las herramientas', privacy: 'Cada página explica con precisión el procesamiento local y el uso de redes externas.', free: 'Uso gratuito y sin registro.', responsive: 'Funciona en móviles y ordenadores.', recent: 'Usadas recientemente', search: 'Buscar herramientas… (⌘K)', noResults: 'No se encontraron herramientas', tryAnother: 'Prueba otro término de búsqueda', count: n => `${n} herramientas` },
  pt: { description: 'Ferramentas gratuitas no navegador para cálculos, desenvolvimento, texto, imagens e tarefas diárias.', information: 'Informações das ferramentas', privacy: 'Cada página informa com precisão o processamento local e o uso de rede externa.', free: 'Uso gratuito e sem cadastro.', responsive: 'Funciona em celulares e computadores.', recent: 'Usadas recentemente', search: 'Buscar ferramentas… (⌘K)', noResults: 'Nenhuma ferramenta encontrada', tryAnother: 'Tente outro termo de busca', count: n => `${n} ferramentas` },
  de: { description: 'Kostenlose Browser-Werkzeuge für Berechnungen, Entwicklung, Text, Bilder und tägliche Aufgaben.', information: 'Werkzeuginformationen', privacy: 'Jede Seite erklärt lokale Verarbeitung und externe Netzwerknutzung genau.', free: 'Kostenlos und ohne Registrierung.', responsive: 'Funktioniert auf Mobilgeräten und Desktop-Rechnern.', recent: 'Zuletzt verwendet', search: 'Werkzeuge suchen… (⌘K)', noResults: 'Keine Werkzeuge gefunden', tryAnother: 'Versuchen Sie einen anderen Suchbegriff', count: n => `${n} Werkzeuge` },
  fr: { description: 'Outils gratuits dans le navigateur pour le calcul, le développement, le texte, les images et les tâches courantes.', information: 'Informations sur les outils', privacy: 'Chaque page indique précisément le traitement local et l’utilisation du réseau externe.', free: 'Gratuit et sans inscription.', responsive: 'Fonctionne sur mobile et ordinateur.', recent: 'Utilisés récemment', search: 'Rechercher un outil… (⌘K)', noResults: 'Aucun outil trouvé', tryAnother: 'Essayez un autre terme', count: n => `${n} outils` },
  it: { description: 'Strumenti gratuiti nel browser per calcoli, sviluppo, testo, immagini e attività quotidiane.', information: 'Informazioni sugli strumenti', privacy: 'Ogni pagina indica con precisione l’elaborazione locale e l’uso della rete esterna.', free: 'Gratis e senza registrazione.', responsive: 'Funziona su dispositivi mobili e computer.', recent: 'Usati di recente', search: 'Cerca strumenti… (⌘K)', noResults: 'Nessuno strumento trovato', tryAnother: 'Prova un altro termine', count: n => `${n} strumenti` },
  id: { description: 'Alat browser gratis untuk perhitungan, pengembangan, teks, gambar, dan tugas sehari-hari.', information: 'Informasi alat', privacy: 'Setiap halaman menjelaskan pemrosesan lokal dan penggunaan jaringan eksternal secara akurat.', free: 'Gratis tanpa perlu mendaftar.', responsive: 'Berfungsi di perangkat seluler dan komputer.', recent: 'Baru digunakan', search: 'Cari alat… (⌘K)', noResults: 'Alat tidak ditemukan', tryAnother: 'Coba kata pencarian lain', count: n => `${n} alat` },
  hi: { description: 'गणना, डेवलपमेंट, टेक्स्ट, इमेज और रोज़मर्रा के काम के लिए मुफ़्त ब्राउज़र टूल।', information: 'टूल की जानकारी', privacy: 'हर पेज स्थानीय प्रोसेसिंग और बाहरी नेटवर्क उपयोग की सही जानकारी देता है।', free: 'मुफ़्त उपयोग, पंजीकरण आवश्यक नहीं।', responsive: 'मोबाइल और डेस्कटॉप पर काम करता है।', recent: 'हाल में उपयोग किए गए', search: 'टूल खोजें… (⌘K)', noResults: 'कोई टूल नहीं मिला', tryAnother: 'कोई दूसरा खोज शब्द आज़माएँ', count: n => `${n} टूल` },
};

export const interactiveFallbackNotice: Record<Language, string> = {
  ko: '도구의 대화형 버튼과 입력 안내는 현재 영어로 표시될 수 있습니다.',
  en: 'Interactive buttons and input guidance are currently shown in English.',
  ja: 'ツールの操作ボタンと入力案内は現在英語で表示される場合があります。',
  'zh-CN': '工具的交互按钮和输入提示目前可能以英文显示。',
  'zh-TW': '工具的互動按鈕與輸入提示目前可能以英文顯示。',
  es: 'Los botones interactivos y las instrucciones de entrada pueden mostrarse actualmente en inglés.',
  pt: 'Os botões interativos e as instruções de entrada podem aparecer atualmente em inglês.',
  de: 'Interaktive Schaltflächen und Eingabehinweise können derzeit auf Englisch erscheinen.',
  fr: 'Les boutons interactifs et les indications de saisie peuvent actuellement apparaître en anglais.',
  it: 'I pulsanti interattivi e le indicazioni di input possono essere mostrati attualmente in inglese.',
  id: 'Tombol interaktif dan petunjuk masukan saat ini mungkin ditampilkan dalam bahasa Inggris.',
  hi: 'इंटरैक्टिव बटन और इनपुट निर्देश अभी अंग्रेज़ी में दिख सकते हैं।',
};

export const relatedToolsTitle: Record<Language, string> = {
  ko: '관련 도구', en: 'Related tools', ja: '関連ツール', 'zh-CN': '相关工具', 'zh-TW': '相關工具',
  es: 'Herramientas relacionadas', pt: 'Ferramentas relacionadas', de: 'Ähnliche Werkzeuge',
  fr: 'Outils associés', it: 'Strumenti correlati', id: 'Alat terkait', hi: 'संबंधित टूल',
};
