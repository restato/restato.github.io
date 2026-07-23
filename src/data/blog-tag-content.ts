import type { Language } from './tools/types';
import { supportedLanguages } from './tools/locales';

export interface BlogTagContent {
  metaDescription: string;
  summary: string;
  introductionTitle: string;
  introduction: string;
  tagsLabel: string;
  allLabel: string;
  noPostsTitle: string;
  noPostsDescription: string;
}

type BlogTagContentFactory = (tag: string, count: number) => BlogTagContent;

export interface BlogTagLanguagePost {
  slug?: string;
  data: {
    lang?: Language;
    title: string;
    description: string;
    date: Date;
  };
}

export const blogTagContentByLanguage: Record<Language, BlogTagContentFactory> = {
  ko: (tag, count) => ({
    metaDescription: `Restato 블로그에서 "${tag}" 태그로 분류된 글 ${count}개와 관련 개발 기록, 실용적인 가이드를 살펴보세요.`,
    summary: `"${tag}" 태그 글 ${count}개`,
    introductionTitle: '이 모음에서 살펴볼 내용',
    introduction: `"${tag}" 주제를 다룬 Restato의 글을 한곳에 모았습니다. 각 글의 핵심 문제, 구현 과정, 검증 결과와 배운 점을 비교하며 필요한 실무 가이드와 이어지는 관련 주제를 함께 살펴보세요.`,
    tagsLabel: '태그',
    allLabel: '전체',
    noPostsTitle: '아직 글이 없습니다',
    noPostsDescription: `"${tag}" 태그로 분류된 글이 게시되면 이 페이지에서 바로 확인할 수 있습니다.`,
  }),
  en: (tag, count) => ({
    metaDescription: `Explore ${count} Restato blog post${count === 1 ? '' : 's'} tagged with "${tag}", including development notes, tested approaches, and practical guidance.`,
    summary: `${count} post${count === 1 ? '' : 's'} tagged with "${tag}"`,
    introductionTitle: 'What this collection covers',
    introduction: `This collection brings Restato posts about "${tag}" together in one place. Compare the problems, implementation choices, verification results, and lessons in each article, then continue to related practical guidance.`,
    tagsLabel: 'Tags',
    allLabel: 'All',
    noPostsTitle: 'No posts found',
    noPostsDescription: `New articles tagged with "${tag}" will appear on this page when they are published.`,
  }),
  ja: (tag, count) => ({
    metaDescription: `Restatoブログの「${tag}」タグの記事${count}件をまとめ、開発記録、検証した手法、実装の詳細、学んだこと、実務に役立つガイドを紹介します。`,
    summary: `「${tag}」タグの記事 ${count}件`,
    introductionTitle: 'このコレクションの内容',
    introduction: `「${tag}」を扱うRestatoの記事を一か所にまとめました。それぞれの記事で取り上げた課題、実装上の選択、検証結果、得られた知見を比較しながら、関連する実践的なガイドへ進めます。`,
    tagsLabel: 'タグ',
    allLabel: 'すべて',
    noPostsTitle: '記事はまだありません',
    noPostsDescription: `「${tag}」タグの記事が公開されると、このページに表示されます。`,
  }),
  'zh-CN': (tag, count) => ({
    metaDescription: `浏览 Restato 博客中标记为“${tag}”的 ${count} 篇文章，了解开发记录、经过验证的方法、实施细节、经验总结与相关实用指南。`,
    summary: `“${tag}”标签下的文章：${count} 篇`,
    introductionTitle: '本专题收录的内容',
    introduction: `这里集中整理了 Restato 关于“${tag}”的文章。你可以比较每篇文章面对的问题、实现选择、验证结果与经验总结，并继续阅读相关的实用指南，把分散的信息串联成更完整的理解。`,
    tagsLabel: '标签',
    allLabel: '全部',
    noPostsTitle: '暂时没有文章',
    noPostsDescription: `标记为“${tag}”的新文章发布后，会显示在这个页面中。`,
  }),
  'zh-TW': (tag, count) => ({
    metaDescription: `瀏覽 Restato 部落格中標記為「${tag}」的 ${count} 篇文章，了解開發紀錄、經過驗證的方法、實作細節、經驗整理與相關實用指南。`,
    summary: `「${tag}」標籤下的文章：${count} 篇`,
    introductionTitle: '本專題收錄的內容',
    introduction: `這裡集中整理了 Restato 關於「${tag}」的文章。你可以比較每篇文章面對的問題、實作選擇、驗證結果與經驗整理，並繼續閱讀相關的實用指南，把分散的資訊串連成更完整的理解。`,
    tagsLabel: '標籤',
    allLabel: '全部',
    noPostsTitle: '目前沒有文章',
    noPostsDescription: `標記為「${tag}」的新文章發布後，會顯示在這個頁面。`,
  }),
  es: (tag, count) => ({
    metaDescription: `Explora ${count} artículo${count === 1 ? '' : 's'} del blog de Restato con la etiqueta «${tag}», con notas de desarrollo, métodos verificados y guías prácticas.`,
    summary: `${count} artículo${count === 1 ? '' : 's'} con la etiqueta «${tag}»`,
    introductionTitle: 'Qué reúne esta colección',
    introduction: `Esta colección reúne en un solo lugar los artículos de Restato sobre «${tag}». Compara los problemas tratados, las decisiones de implementación, los resultados de verificación y las lecciones de cada texto, y continúa con guías prácticas relacionadas.`,
    tagsLabel: 'Etiquetas',
    allLabel: 'Todas',
    noPostsTitle: 'Todavía no hay artículos',
    noPostsDescription: `Los nuevos artículos con la etiqueta «${tag}» aparecerán aquí cuando se publiquen.`,
  }),
  pt: (tag, count) => ({
    metaDescription: `Explore ${count} artigo${count === 1 ? '' : 's'} do blog Restato com a etiqueta “${tag}”, incluindo notas de desenvolvimento, métodos verificados e guias práticos.`,
    summary: `${count} artigo${count === 1 ? '' : 's'} com a etiqueta “${tag}”`,
    introductionTitle: 'O que esta coleção reúne',
    introduction: `Esta coleção reúne os artigos do Restato sobre “${tag}” num só lugar. Compare os problemas abordados, as decisões de implementação, os resultados de verificação e as aprendizagens de cada texto e avance para guias práticos relacionados.`,
    tagsLabel: 'Etiquetas',
    allLabel: 'Todas',
    noPostsTitle: 'Ainda não há artigos',
    noPostsDescription: `Novos artigos com a etiqueta “${tag}” serão apresentados aqui quando forem publicados.`,
  }),
  de: (tag, count) => ({
    metaDescription: `Entdecke ${count} Restato-Blogbeitrag${count === 1 ? '' : 'e'} zum Tag „${tag}“ mit Entwicklungsnotizen, geprüften Ansätzen und praktischen Leitfäden.`,
    summary: `${count} Beitrag${count === 1 ? '' : 'e'} mit dem Tag „${tag}“`,
    introductionTitle: 'Was diese Sammlung abdeckt',
    introduction: `Diese Sammlung bündelt Restato-Beiträge zum Thema „${tag}“. Vergleiche die behandelten Probleme, Implementierungsentscheidungen, Prüfergebnisse und Erkenntnisse der einzelnen Artikel und lies anschließend passende praktische Leitfäden weiter.`,
    tagsLabel: 'Tags',
    allLabel: 'Alle',
    noPostsTitle: 'Noch keine Beiträge',
    noPostsDescription: `Neue Beiträge mit dem Tag „${tag}“ erscheinen nach ihrer Veröffentlichung auf dieser Seite.`,
  }),
  fr: (tag, count) => ({
    metaDescription: `Découvrez ${count} article${count === 1 ? '' : 's'} du blog Restato associé${count === 1 ? '' : 's'} au tag « ${tag} », avec des notes de développement, des méthodes vérifiées et des guides pratiques.`,
    summary: `${count} article${count === 1 ? '' : 's'} avec le tag « ${tag} »`,
    introductionTitle: 'Ce que rassemble cette sélection',
    introduction: `Cette sélection réunit les articles de Restato consacrés à « ${tag} ». Comparez les problèmes abordés, les choix d’implémentation, les résultats de vérification et les enseignements de chaque article, puis poursuivez avec des guides pratiques associés.`,
    tagsLabel: 'Tags',
    allLabel: 'Tous',
    noPostsTitle: 'Aucun article pour le moment',
    noPostsDescription: `Les nouveaux articles associés au tag « ${tag} » apparaîtront ici après leur publication.`,
  }),
  it: (tag, count) => ({
    metaDescription: `Esplora ${count} articol${count === 1 ? 'o' : 'i'} del blog Restato con il tag “${tag}”, tra note di sviluppo, metodi verificati e guide pratiche.`,
    summary: `${count} articol${count === 1 ? 'o' : 'i'} con il tag “${tag}”`,
    introductionTitle: 'Cosa raccoglie questa selezione',
    introduction: `Questa selezione riunisce gli articoli di Restato dedicati a “${tag}”. Confronta i problemi affrontati, le scelte di implementazione, i risultati delle verifiche e gli insegnamenti di ogni articolo, quindi prosegui con le guide pratiche correlate.`,
    tagsLabel: 'Tag',
    allLabel: 'Tutti',
    noPostsTitle: 'Non ci sono ancora articoli',
    noPostsDescription: `I nuovi articoli con il tag “${tag}” compariranno qui dopo la pubblicazione.`,
  }),
  id: (tag, count) => ({
    metaDescription: `Jelajahi ${count} artikel blog Restato bertag “${tag}”, lengkap dengan catatan pengembangan, pendekatan teruji, hasil pemeriksaan, dan panduan praktis.`,
    summary: `${count} artikel dengan tag “${tag}”`,
    introductionTitle: 'Isi kumpulan ini',
    introduction: `Kumpulan ini menyatukan artikel Restato tentang “${tag}” dalam satu halaman. Bandingkan masalah yang dibahas, pilihan implementasi, hasil verifikasi, dan pelajaran dari setiap tulisan, lalu lanjutkan ke panduan praktis yang berkaitan.`,
    tagsLabel: 'Tag',
    allLabel: 'Semua',
    noPostsTitle: 'Belum ada artikel',
    noPostsDescription: `Artikel baru dengan tag “${tag}” akan muncul di halaman ini setelah diterbitkan.`,
  }),
  hi: (tag, count) => ({
    metaDescription: `Restato ब्लॉग पर “${tag}” टैग वाले ${count} लेख पढ़ें, जिनमें विकास नोट्स, जाँचे गए तरीके, सत्यापन परिणाम और व्यावहारिक मार्गदर्शिकाएँ शामिल हैं।`,
    summary: `“${tag}” टैग वाले लेख: ${count}`,
    introductionTitle: 'इस संग्रह में क्या शामिल है',
    introduction: `यह संग्रह “${tag}” विषय पर Restato के लेखों को एक जगह लाता है। हर लेख की समस्या, कार्यान्वयन के विकल्प, सत्यापन परिणाम और सीखे गए पाठों की तुलना करें, फिर उनसे जुड़ी व्यावहारिक मार्गदर्शिकाओं को आगे पढ़ें।`,
    tagsLabel: 'टैग',
    allLabel: 'सभी',
    noPostsTitle: 'अभी कोई लेख नहीं है',
    noPostsDescription: `“${tag}” टैग वाले नए लेख प्रकाशित होने पर इस पेज पर दिखाई देंगे।`,
  }),
};

export function getBlogTagContent(language: Language, tag: string, count: number): BlogTagContent {
  return blogTagContentByLanguage[language](tag, count);
}

export function inferBlogTagLanguage(tag: string): Language {
  if (/\p{Script=Hangul}/u.test(tag)) return 'ko';
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(tag)) return 'ja';
  if (/\p{Script=Devanagari}/u.test(tag)) return 'hi';
  if (/[\u3100-\u312f]/u.test(tag)) return 'zh-TW';
  if (/\p{Script=Han}/u.test(tag)) return 'zh-CN';
  return 'en';
}

function inferArticleMetadataLanguage(post: BlogTagLanguagePost): Language {
  if (post.data.lang && supportedLanguages.includes(post.data.lang)) {
    return post.data.lang;
  }

  const metadata = `${post.data.title} ${post.data.description}`;
  if (/\p{Script=Hangul}/u.test(metadata)) return 'ko';
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(metadata)) return 'ja';
  if (/\p{Script=Devanagari}/u.test(metadata)) return 'hi';
  if (/[\u3100-\u312f]|[體臺灣與為這個學習網頁開發實際]/u.test(metadata)) return 'zh-TW';
  if (/\p{Script=Han}/u.test(metadata)) return 'zh-CN';
  return 'en';
}

/**
 * A tag page represents the articles assigned to it, so article metadata is
 * authoritative. Plurality wins; ties use the newest article represented by
 * each language and finally the registry order. The tag label itself is only
 * consulted for the defensive no-post state.
 */
export function selectBlogTagLanguage(
  tag: string,
  posts: readonly BlogTagLanguagePost[],
): Language {
  if (posts.length === 0) return inferBlogTagLanguage(tag);

  const languageStats = new Map<Language, { count: number; newest: number }>();
  for (const post of posts) {
    const language = inferArticleMetadataLanguage(post);
    const timestamp = post.data.date.valueOf();
    const newest = Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
    const current = languageStats.get(language);
    languageStats.set(language, {
      count: (current?.count ?? 0) + 1,
      newest: Math.max(current?.newest ?? Number.NEGATIVE_INFINITY, newest),
    });
  }

  return [...languageStats.entries()]
    .sort(([leftLanguage, left], [rightLanguage, right]) => (
      right.count - left.count
      || right.newest - left.newest
      || supportedLanguages.indexOf(leftLanguage) - supportedLanguages.indexOf(rightLanguage)
    ))[0][0];
}
