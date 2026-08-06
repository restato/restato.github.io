export const additionalToolSlugs = new Set([
  'pdf-merge', 'pdf-split', 'pdf-rotate', 'images-to-pdf', 'pdf-to-images',
  'csv-json', 'text-cleaner', 'seo-generator',
  'modern-image-converter', 'exif-remover', 'favicon-generator', 'loan-calculator', 'audio-trimmer',
  'ladder-game',
]);

export const isAdditionalToolSlug = (slug: string): boolean => additionalToolSlugs.has(slug);
