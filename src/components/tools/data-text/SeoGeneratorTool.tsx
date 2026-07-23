import { useState } from 'react';
import { generateSeoBundle, type SchemaType, type SeoBundle } from '../../../lib/data-text/seo';
import { actionsClass, buttonClass, copyText, downloadText, errorClass, fieldClass, panelClass, privacyClass, secondaryButtonClass } from './ui';

const emptyBundle: SeoBundle = { metaTags: '', robotsTxt: '', jsonLd: '' };

export default function SeoGeneratorTool() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaType>('WebPage');
  const [allowIndex, setAllowIndex] = useState(true);
  const [allowFollow, setAllowFollow] = useState(true);
  const [bundle, setBundle] = useState<SeoBundle>(emptyBundle);
  const [error, setError] = useState('');

  const generate = () => {
    try {
      setBundle(generateSeoBundle({ title, description, canonicalUrl, siteName, imageUrl, sitemapUrl, schemaType, allowIndex, allowFollow }));
      setError('');
    } catch (generationError) {
      setBundle(emptyBundle);
      setError((generationError as Error).message);
    }
  };

  return (
    <section className={panelClass} aria-labelledby="seo-title">
      <h2 id="seo-title" className="text-xl font-semibold">SEO meta, robots.txt, and Schema generator</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1"><span className="font-medium">Page title</span><input aria-label="Page title" className={fieldClass} maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} /><small aria-hidden="true">{title.length}/60</small></label>
        <label className="space-y-1"><span className="font-medium">Canonical URL</span><input className={fieldClass} type="url" placeholder="https://example.com/page" value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} /></label>
      </div>
      <label className="block space-y-1"><span className="font-medium">Meta description</span><textarea aria-label="Meta description" className={fieldClass} maxLength={160} value={description} onChange={(event) => setDescription(event.target.value)} /><small aria-hidden="true">{description.length}/160</small></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1"><span className="font-medium">Site name (optional)</span><input className={fieldClass} value={siteName} onChange={(event) => setSiteName(event.target.value)} /></label>
        <label className="space-y-1"><span className="font-medium">Social image URL (optional)</span><input className={fieldClass} type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} /></label>
        <label className="space-y-1"><span className="font-medium">Sitemap URL (optional)</span><input className={fieldClass} type="url" value={sitemapUrl} onChange={(event) => setSitemapUrl(event.target.value)} /></label>
        <label className="space-y-1"><span className="font-medium">Schema type</span><select className={fieldClass} value={schemaType} onChange={(event) => setSchemaType(event.target.value as SchemaType)}>{['WebPage', 'Article', 'Product', 'Organization'].map((type) => <option key={type}>{type}</option>)}</select></label>
      </div>
      <fieldset className="flex gap-4"><legend className="mb-2 font-medium">Crawler directives</legend><label className="flex items-center gap-2"><input type="checkbox" checked={allowIndex} onChange={(event) => setAllowIndex(event.target.checked)} />Allow indexing</label><label className="flex items-center gap-2"><input type="checkbox" checked={allowFollow} onChange={(event) => setAllowFollow(event.target.checked)} />Allow link following</label></fieldset>
      <button type="button" className={buttonClass} onClick={generate}>Generate SEO files</button>
      {error && <p role="alert" className={errorClass}>{error}</p>}
      <Output label="Meta tags output" value={bundle.metaTags} filename="meta-tags.html" />
      <Output label="Robots.txt output" value={bundle.robotsTxt} filename="robots.txt" />
      <Output label="Schema JSON-LD output" value={bundle.jsonLd} filename="schema.json" />
      <p className={privacyClass}>Generated files are a starting point. Validate them against your site and search-engine requirements.</p>
    </section>
  );
}

function Output({ label, value, filename }: { label: string; value: string; filename: string }) {
  return (
    <div className="space-y-2">
      <label className="block space-y-1"><span className="font-medium">{label}</span><textarea className={`${fieldClass} min-h-36 font-mono text-sm`} value={value} readOnly /></label>
      <div className={actionsClass}>
        <button type="button" className={secondaryButtonClass} onClick={() => copyText(value)} disabled={!value}>Copy {label.replace(' output', '')}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => downloadText(value, filename)} disabled={!value}>Download {filename}</button>
      </div>
    </div>
  );
}
