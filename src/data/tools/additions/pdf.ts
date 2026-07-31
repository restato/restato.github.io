import type { AdditionalToolProfile } from '../localizedContent';
import type { Language } from '../types';
import type { AdditionalToolSpec } from './types';

const profiles: Record<Language, AdditionalToolProfile[]> = {
  ko: [
    { name: 'PDF 병합', input: '두 개 이상의 PDF 파일', output: '페이지 순서대로 합쳐진 PDF 파일', example: '계약서.pdf + 부록.pdf → merged.pdf', limitation: '암호로 잠긴 PDF는 먼저 잠금을 해제해야 합니다.' },
    { name: 'PDF 페이지 추출', input: 'PDF 파일과 추출할 페이지 번호 또는 범위', output: '선택한 페이지만 담긴 PDF 파일', example: '1-3, 5 → 네 페이지짜리 PDF', limitation: '존재하지 않는 페이지 번호는 추출할 수 없습니다.' },
    { name: 'PDF 페이지 회전', input: 'PDF 파일, 페이지 번호, 회전 각도', output: '선택한 페이지가 회전된 PDF 파일', example: '2페이지를 시계 방향 90도로 회전', limitation: '회전은 90도 단위로 적용됩니다.' },
    { name: '이미지를 PDF로 변환', input: '순서대로 배치할 PNG 또는 JPEG 이미지', output: '이미지마다 한 페이지를 만든 PDF 파일', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: '매우 큰 이미지는 브라우저 메모리를 많이 사용할 수 있습니다.' },
    { name: 'PDF를 이미지로 변환', input: 'PDF 파일과 PNG 또는 JPEG 출력 형식', output: 'PDF 각 페이지의 고해상도 이미지', example: '3페이지 PDF → page-1.png부터 page-3.png', limitation: '복잡하거나 긴 PDF는 렌더링에 시간이 걸릴 수 있습니다.' },
  ],
  en: [
    { name: 'PDF Merge', input: 'two or more PDF files', output: 'one PDF with pages in file order', example: 'contract.pdf + appendix.pdf → merged.pdf', limitation: 'Password-protected PDFs must be unlocked first.' },
    { name: 'PDF Page Extractor', input: 'a PDF and page numbers or ranges', output: 'a PDF containing only the selected pages', example: '1-3, 5 → a four-page PDF', limitation: 'Page numbers outside the document cannot be extracted.' },
    { name: 'PDF Page Rotator', input: 'a PDF, page numbers and a rotation angle', output: 'a PDF with selected pages rotated', example: 'rotate page 2 clockwise by 90 degrees', limitation: 'Rotation is applied in 90-degree increments.' },
    { name: 'Images to PDF', input: 'ordered PNG or JPEG images', output: 'a PDF with one page per image', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Very large images can consume substantial browser memory.' },
    { name: 'PDF to Images', input: 'a PDF and PNG or JPEG output format', output: 'a high-resolution image for every PDF page', example: '3-page PDF → page-1.png through page-3.png', limitation: 'Long or complex PDFs can take time to render.' },
  ],
  ja: [
    { name: 'PDF結合', input: '2つ以上のPDFファイル', output: 'ファイル順にページをまとめたPDF', example: '契約書.pdf + 付録.pdf → merged.pdf', limitation: 'パスワード保護PDFは先に解除する必要があります。' },
    { name: 'PDFページ抽出', input: 'PDFと抽出するページ番号または範囲', output: '選択したページだけを含むPDF', example: '1-3, 5 → 4ページのPDF', limitation: '文書に存在しないページは抽出できません。' },
    { name: 'PDFページ回転', input: 'PDF、ページ番号、回転角度', output: '選択ページを回転したPDF', example: '2ページ目を時計回りに90度回転', limitation: '回転は90度単位で適用されます。' },
    { name: '画像をPDFに変換', input: '順番に並べたPNGまたはJPEG画像', output: '画像ごとに1ページのPDF', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: '非常に大きな画像はブラウザのメモリを多く使用します。' },
    { name: 'PDFを画像に変換', input: 'PDFとPNGまたはJPEG出力形式', output: 'PDF各ページの高解像度画像', example: '3ページPDF → page-1.png～page-3.png', limitation: '長い、または複雑なPDFは描画に時間がかかります。' },
  ],
  'zh-CN': [
    { name: 'PDF 合并', input: '两个或更多 PDF 文件', output: '按文件顺序合并页面的 PDF', example: '合同.pdf + 附件.pdf → merged.pdf', limitation: '受密码保护的 PDF 需要先解锁。' },
    { name: 'PDF 页面提取', input: 'PDF 文件和要提取的页码或范围', output: '仅包含所选页面的 PDF', example: '1-3, 5 → 四页 PDF', limitation: '无法提取文档范围之外的页码。' },
    { name: 'PDF 页面旋转', input: 'PDF、页码和旋转角度', output: '所选页面已旋转的 PDF', example: '将第 2 页顺时针旋转 90 度', limitation: '旋转以 90 度为单位应用。' },
    { name: '图片转 PDF', input: '按顺序排列的 PNG 或 JPEG 图片', output: '每张图片一页的 PDF', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: '超大图片可能占用大量浏览器内存。' },
    { name: 'PDF 转图片', input: 'PDF 文件及 PNG 或 JPEG 输出格式', output: 'PDF 每一页的高清图片', example: '三页 PDF → page-1.png 到 page-3.png', limitation: '较长或复杂的 PDF 可能需要较长渲染时间。' },
  ],
  'zh-TW': [
    { name: 'PDF 合併', input: '兩個或更多 PDF 檔案', output: '依檔案順序合併頁面的 PDF', example: '合約.pdf + 附件.pdf → merged.pdf', limitation: '受密碼保護的 PDF 必須先解鎖。' },
    { name: 'PDF 頁面擷取', input: 'PDF 檔案和要擷取的頁碼或範圍', output: '只包含所選頁面的 PDF', example: '1-3, 5 → 四頁 PDF', limitation: '無法擷取文件範圍以外的頁碼。' },
    { name: 'PDF 頁面旋轉', input: 'PDF、頁碼和旋轉角度', output: '所選頁面已旋轉的 PDF', example: '將第 2 頁順時針旋轉 90 度', limitation: '旋轉以 90 度為單位套用。' },
    { name: '圖片轉 PDF', input: '依序排列的 PNG 或 JPEG 圖片', output: '每張圖片各一頁的 PDF', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: '超大圖片可能占用大量瀏覽器記憶體。' },
    { name: 'PDF 轉圖片', input: 'PDF 檔案及 PNG 或 JPEG 輸出格式', output: 'PDF 每一頁的高解析度圖片', example: '三頁 PDF → page-1.png 到 page-3.png', limitation: '較長或複雜的 PDF 可能需要較久的轉譯時間。' },
  ],
  es: [
    { name: 'Unir PDF', input: 'dos o más archivos PDF', output: 'un PDF con las páginas en el orden elegido', example: 'contrato.pdf + anexo.pdf → merged.pdf', limitation: 'Los PDF protegidos con contraseña deben desbloquearse primero.' },
    { name: 'Extraer páginas PDF', input: 'un PDF y números o rangos de páginas', output: 'un PDF que contiene solo las páginas elegidas', example: '1-3, 5 → un PDF de cuatro páginas', limitation: 'No se pueden extraer páginas fuera del documento.' },
    { name: 'Girar páginas PDF', input: 'un PDF, números de página y ángulo', output: 'un PDF con las páginas elegidas giradas', example: 'girar la página 2 noventa grados a la derecha', limitation: 'El giro se aplica en incrementos de 90 grados.' },
    { name: 'Imágenes a PDF', input: 'imágenes PNG o JPEG ordenadas', output: 'un PDF con una página por imagen', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Las imágenes muy grandes pueden consumir mucha memoria.' },
    { name: 'PDF a imágenes', input: 'un PDF y formato de salida PNG o JPEG', output: 'una imagen de alta resolución por cada página', example: 'PDF de 3 páginas → page-1.png a page-3.png', limitation: 'Los PDF largos o complejos pueden tardar en renderizarse.' },
  ],
  pt: [
    { name: 'Juntar PDF', input: 'dois ou mais arquivos PDF', output: 'um PDF com páginas na ordem dos arquivos', example: 'contrato.pdf + anexo.pdf → merged.pdf', limitation: 'PDFs protegidos por senha precisam ser desbloqueados antes.' },
    { name: 'Extrair páginas do PDF', input: 'um PDF e números ou intervalos de páginas', output: 'um PDF apenas com as páginas selecionadas', example: '1-3, 5 → um PDF de quatro páginas', limitation: 'Não é possível extrair páginas fora do documento.' },
    { name: 'Girar páginas do PDF', input: 'um PDF, números das páginas e ângulo', output: 'um PDF com as páginas selecionadas giradas', example: 'girar a página 2 em 90 graus à direita', limitation: 'A rotação é aplicada em incrementos de 90 graus.' },
    { name: 'Imagens para PDF', input: 'imagens PNG ou JPEG ordenadas', output: 'um PDF com uma página para cada imagem', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Imagens muito grandes podem consumir muita memória.' },
    { name: 'PDF para imagens', input: 'um PDF e formato de saída PNG ou JPEG', output: 'uma imagem em alta resolução para cada página', example: 'PDF de 3 páginas → page-1.png até page-3.png', limitation: 'PDFs longos ou complexos podem demorar para renderizar.' },
  ],
  de: [
    { name: 'PDF zusammenfügen', input: 'zwei oder mehr PDF-Dateien', output: 'eine PDF mit Seiten in Dateireihenfolge', example: 'vertrag.pdf + anhang.pdf → merged.pdf', limitation: 'Passwortgeschützte PDFs müssen zuerst entsperrt werden.' },
    { name: 'PDF-Seiten extrahieren', input: 'eine PDF und Seitenzahlen oder Bereiche', output: 'eine PDF nur mit den ausgewählten Seiten', example: '1-3, 5 → eine vierseitige PDF', limitation: 'Seiten außerhalb des Dokuments können nicht extrahiert werden.' },
    { name: 'PDF-Seiten drehen', input: 'eine PDF, Seitenzahlen und Drehwinkel', output: 'eine PDF mit gedrehten ausgewählten Seiten', example: 'Seite 2 um 90 Grad im Uhrzeigersinn drehen', limitation: 'Die Drehung erfolgt in 90-Grad-Schritten.' },
    { name: 'Bilder in PDF', input: 'geordnete PNG- oder JPEG-Bilder', output: 'eine PDF mit einer Seite pro Bild', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Sehr große Bilder können viel Browserspeicher belegen.' },
    { name: 'PDF in Bilder', input: 'eine PDF und PNG- oder JPEG-Ausgabeformat', output: 'ein hochauflösendes Bild für jede PDF-Seite', example: '3-seitige PDF → page-1.png bis page-3.png', limitation: 'Lange oder komplexe PDFs können beim Rendern Zeit benötigen.' },
  ],
  fr: [
    { name: 'Fusionner des PDF', input: 'deux fichiers PDF ou plus', output: 'un PDF avec les pages dans l’ordre des fichiers', example: 'contrat.pdf + annexe.pdf → merged.pdf', limitation: 'Les PDF protégés par mot de passe doivent être déverrouillés.' },
    { name: 'Extraire des pages PDF', input: 'un PDF et des numéros ou plages de pages', output: 'un PDF contenant uniquement les pages choisies', example: '1-3, 5 → un PDF de quatre pages', limitation: 'Les pages hors du document ne peuvent pas être extraites.' },
    { name: 'Faire pivoter un PDF', input: 'un PDF, des numéros de page et un angle', output: 'un PDF dont les pages choisies sont pivotées', example: 'tourner la page 2 de 90 degrés à droite', limitation: 'La rotation se fait par incréments de 90 degrés.' },
    { name: 'Images vers PDF', input: 'des images PNG ou JPEG ordonnées', output: 'un PDF avec une page par image', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Les très grandes images peuvent utiliser beaucoup de mémoire.' },
    { name: 'PDF vers images', input: 'un PDF et un format PNG ou JPEG', output: 'une image haute résolution pour chaque page', example: 'PDF de 3 pages → page-1.png à page-3.png', limitation: 'Les PDF longs ou complexes peuvent être lents à afficher.' },
  ],
  it: [
    { name: 'Unire PDF', input: 'due o più file PDF', output: 'un PDF con le pagine nell’ordine dei file', example: 'contratto.pdf + allegato.pdf → merged.pdf', limitation: 'I PDF protetti da password devono essere prima sbloccati.' },
    { name: 'Estrarre pagine PDF', input: 'un PDF e numeri o intervalli di pagine', output: 'un PDF con soltanto le pagine selezionate', example: '1-3, 5 → un PDF di quattro pagine', limitation: 'Non è possibile estrarre pagine esterne al documento.' },
    { name: 'Ruotare pagine PDF', input: 'un PDF, numeri di pagina e angolo', output: 'un PDF con le pagine selezionate ruotate', example: 'ruotare pagina 2 di 90 gradi in senso orario', limitation: 'La rotazione viene applicata a incrementi di 90 gradi.' },
    { name: 'Immagini in PDF', input: 'immagini PNG o JPEG ordinate', output: 'un PDF con una pagina per immagine', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Immagini molto grandi possono usare molta memoria.' },
    { name: 'PDF in immagini', input: 'un PDF e formato PNG o JPEG', output: 'un’immagine ad alta risoluzione per ogni pagina', example: 'PDF di 3 pagine → page-1.png fino a page-3.png', limitation: 'PDF lunghi o complessi possono richiedere tempo.' },
  ],
  id: [
    { name: 'Gabungkan PDF', input: 'dua atau lebih berkas PDF', output: 'satu PDF dengan halaman sesuai urutan berkas', example: 'kontrak.pdf + lampiran.pdf → merged.pdf', limitation: 'PDF berpassword harus dibuka kuncinya terlebih dahulu.' },
    { name: 'Ekstrak halaman PDF', input: 'PDF serta nomor atau rentang halaman', output: 'PDF yang hanya berisi halaman pilihan', example: '1-3, 5 → PDF empat halaman', limitation: 'Halaman di luar dokumen tidak dapat diekstrak.' },
    { name: 'Putar halaman PDF', input: 'PDF, nomor halaman, dan sudut putar', output: 'PDF dengan halaman pilihan yang diputar', example: 'putar halaman 2 searah jarum jam 90 derajat', limitation: 'Rotasi diterapkan dalam kelipatan 90 derajat.' },
    { name: 'Gambar ke PDF', input: 'gambar PNG atau JPEG yang telah diurutkan', output: 'PDF dengan satu halaman untuk setiap gambar', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'Gambar sangat besar dapat memakai banyak memori browser.' },
    { name: 'PDF ke gambar', input: 'PDF dan format keluaran PNG atau JPEG', output: 'gambar beresolusi tinggi untuk setiap halaman', example: 'PDF 3 halaman → page-1.png hingga page-3.png', limitation: 'PDF panjang atau rumit dapat memerlukan waktu untuk dirender.' },
  ],
  hi: [
    { name: 'PDF मर्ज करें', input: 'दो या अधिक PDF फ़ाइलें', output: 'फ़ाइल क्रम में पृष्ठों वाली एक PDF', example: 'contract.pdf + appendix.pdf → merged.pdf', limitation: 'पासवर्ड-सुरक्षित PDF को पहले अनलॉक करना होगा।' },
    { name: 'PDF पृष्ठ निकालें', input: 'एक PDF और पृष्ठ संख्या या दायरे', output: 'केवल चुने हुए पृष्ठों वाली PDF', example: '1-3, 5 → चार पृष्ठों की PDF', limitation: 'दस्तावेज़ के बाहर के पृष्ठ निकाले नहीं जा सकते।' },
    { name: 'PDF पृष्ठ घुमाएँ', input: 'एक PDF, पृष्ठ संख्या और घुमाव कोण', output: 'चुने हुए पृष्ठ घुमाई गई PDF', example: 'पृष्ठ 2 को दाएँ 90 डिग्री घुमाएँ', limitation: 'घुमाव 90 डिग्री के चरणों में लागू होता है।' },
    { name: 'चित्रों को PDF बनाएँ', input: 'क्रम में रखे PNG या JPEG चित्र', output: 'हर चित्र के लिए एक पृष्ठ वाली PDF', example: 'scan-1.jpg + scan-2.jpg → images.pdf', limitation: 'बहुत बड़े चित्र अधिक ब्राउज़र मेमोरी ले सकते हैं।' },
    { name: 'PDF को चित्र बनाएँ', input: 'एक PDF और PNG या JPEG आउटपुट', output: 'हर PDF पृष्ठ की उच्च-रिज़ॉल्यूशन छवि', example: '3-पृष्ठ PDF → page-1.png से page-3.png', limitation: 'लंबी या जटिल PDF को रेंडर होने में समय लग सकता है।' },
  ],
};

const definitions = [
  { slug: 'pdf-merge', icon: '📚', component: 'PdfMergeTool', related: ['pdf-split', 'pdf-rotate'] },
  { slug: 'pdf-split', icon: '✂️', component: 'PdfSplitTool', related: ['pdf-merge', 'pdf-rotate'] },
  { slug: 'pdf-rotate', icon: '🔄', component: 'PdfRotateTool', related: ['pdf-merge', 'pdf-split'] },
  { slug: 'images-to-pdf', icon: '🖼️', component: 'ImagesToPdfTool', related: ['pdf-to-images', 'image-converter'] },
  { slug: 'pdf-to-images', icon: '📸', component: 'PdfToImagesTool', related: ['images-to-pdf', 'image-converter'] },
] as const;

export const additionalTools: AdditionalToolSpec[] = definitions.map((definition, index) => ({
  ...definition,
  related: [...definition.related],
  category: 'pdf',
  profiles: Object.fromEntries(
    (Object.entries(profiles) as Array<[Language, AdditionalToolProfile[]]>).map(([language, values]) => [language, values[index]!]),
  ) as Record<Language, AdditionalToolProfile>,
}));
