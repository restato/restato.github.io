import { useState } from 'react';
import { generateSeoBundle, type SchemaType, type SeoBundle } from '../../../lib/data-text/seo';
import { copyText, downloadText } from './ui';
import { ToolActions } from '../ui/ToolActions';
import { ToolField } from '../ui/ToolField';
import { ToolPanel } from '../ui/ToolPanel';
import { ToolResult } from '../ui/ToolResult';

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
    <ToolPanel aria-labelledby="seo-title">
      <h2 id="seo-title" className="text-xl font-semibold">SEO meta, robots.txt, and Schema generator</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id="seo-title-input" label="Page title" hint={`${title.length}/60`}><input maxLength={60} value={title} onChange={(event) => setTitle(event.target.value)} /></ToolField>
        <ToolField id="seo-canonical" label="Canonical URL"><input type="url" placeholder="https://example.com/page" value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} /></ToolField>
      </div>
      <ToolField id="seo-description" label="Meta description" hint={`${description.length}/160`}><textarea maxLength={160} value={description} onChange={(event) => setDescription(event.target.value)} /></ToolField>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolField id="seo-site-name" label="Site name (optional)"><input value={siteName} onChange={(event) => setSiteName(event.target.value)} /></ToolField>
        <ToolField id="seo-image-url" label="Social image URL (optional)"><input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} /></ToolField>
        <ToolField id="seo-sitemap-url" label="Sitemap URL (optional)"><input type="url" value={sitemapUrl} onChange={(event) => setSitemapUrl(event.target.value)} /></ToolField>
        <ToolField id="seo-schema-type" label="Schema type"><select value={schemaType} onChange={(event) => setSchemaType(event.target.value as SchemaType)}>{['WebPage', 'Article', 'Product', 'Organization'].map((type) => <option key={type}>{type}</option>)}</select></ToolField>
      </div>
      <fieldset className="flex gap-4"><legend className="mb-2 font-medium">Crawler directives</legend><ToolField id="seo-allow-index" label="Allow indexing"><input type="checkbox" checked={allowIndex} onChange={(event) => setAllowIndex(event.target.checked)} /></ToolField><ToolField id="seo-allow-follow" label="Allow link following"><input type="checkbox" checked={allowFollow} onChange={(event) => setAllowFollow(event.target.checked)} /></ToolField></fieldset>
      <ToolActions primary={<button type="button" onClick={generate}>Generate SEO files</button>} />
      {error && <ToolResult status="error">{error}</ToolResult>}
      <Output label="Meta tags output" value={bundle.metaTags} filename="meta-tags.html" />
      <Output label="Robots.txt output" value={bundle.robotsTxt} filename="robots.txt" />
      <Output label="Schema JSON-LD output" value={bundle.jsonLd} filename="schema.json" />
    </ToolPanel>
  );
}

function Output({ label, value, filename }: { label: string; value: string; filename: string }) {
  return (
    <div className="space-y-2">
      <ToolField id={`seo-${filename}-output`} label={label}><textarea className="min-h-36 font-mono text-sm" value={value} readOnly /></ToolField>
      <ToolActions
        primary={<button type="button" onClick={() => copyText(value)} disabled={!value}>Copy {label.replace(' output', '')}</button>}
        secondary={<button type="button" onClick={() => downloadText(value, filename)} disabled={!value}>Download {filename}</button>}
      />
    </div>
  );
}
