import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { auditContent } from '../audit-content.mjs';

const directories: string[] = [];
afterEach(async () => Promise.all(directories.splice(0).map(dir => rm(dir, { recursive: true, force: true }))));

async function fixture(files: Record<string, string>) {
  const dir = await mkdtemp(join(tmpdir(), 'audit-content-'));
  directories.push(dir);
  await Promise.all(Object.entries(files).map(async ([name, html]) => {
    const target = join(dir, name);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, html);
  }));
  return dir;
}

const page = (title: string, description: string, body: string, trust = true) => `<!doctype html><html><head>
  <title>${title}</title><meta name="description" content="${description}">
  ${trust ? '<meta name="author" content="Restato">' : ''}
  </head><body><main>${body}</main>${trust ? '<a href="mailto:team@example.com">Contact</a>' : ''}</body></html>`;

describe('indexable content audit', () => {
  it('detects duplicate metadata, thin content, missing trust links, and repeated paragraphs', async () => {
    const repeated = 'This intentionally repeated paragraph is long enough to reveal suspicious template duplication across separate indexable pages.';
    const dir = await fixture({
      'a/index.html': page('Duplicate title', 'Duplicate description used by two pages for testing.', `<p>${repeated}</p><p>${'Useful detail '.repeat(30)}</p>`),
      'b/index.html': page('Duplicate title', 'Duplicate description used by two pages for testing.', `<p>${repeated}</p><p>${'Different detail '.repeat(30)}</p>`),
      'thin/index.html': page('Thin page', 'A unique description for the deliberately thin fixture.', '<p>Too short.</p>', false),
    });

    const result = await auditContent(dir, { minimumTextLength: 180, repeatedParagraphMinimum: 80 });
    const codes = result.findings.map(finding => finding.code);
    expect(codes).toContain('duplicate-title');
    expect(codes).toContain('duplicate-description');
    expect(codes).toContain('thin-content');
    expect(codes).toContain('missing-author');
    expect(codes).toContain('missing-contact');
    expect(codes).toContain('repeated-paragraph');
  });

  it('ignores noindex and redirect pages', async () => {
    const dir = await fixture({
      'noindex/index.html': '<html><head><meta name="robots" content="noindex"><title>X</title></head><body>tiny</body></html>',
      'redirect/index.html': '<html><head><meta http-equiv="refresh" content="0;url=/target"><title>X</title></head><body>tiny</body></html>',
    });
    expect((await auditContent(dir)).findings).toEqual([]);
  });
});
