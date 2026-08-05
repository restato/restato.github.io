import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSkill = (name: string) => readFileSync(
  join(process.cwd(), '.agents', 'skills', name, 'SKILL.md'),
  'utf8',
);

const oneClick = readSkill('one-click-publish');
const writer = readSkill('restato-blog-writer');
const routers = [
  ['one-click-publish', oneClick],
  ['restato-blog-writer', writer],
] as const;

describe('publishing compatibility routers', () => {
  it('delegates both skills to restato-content-partner as the sole workflow', () => {
    for (const [name, source] of routers) {
      expect(source, name).toContain('restato-content-partner');
      expect(source, name).toMatch(/sole workflow/i);
    }
  });

  it('keeps bilingual publishing as the default with a recorded explicit override', () => {
    for (const [name, source] of routers) {
      expect(source, name).toContain('English source');
      expect(source, name).toContain('Korean alternate');
      expect(source, name).toContain('translationKey');
      expect(source, name).toMatch(/explicitly request(?:s|ed)? (?:a )?single language/i);
      expect(source, name).toMatch(/records? the override/i);
    }
  });

  it('defers private handoff and safety gates to the canonical workflow', () => {
    for (const [name, source] of routers) {
      expect(source, name).toMatch(/private editorial handoff/i);
      expect(source, name).toMatch(/safety gates/i);
      expect(source, name).toMatch(/public MDX.*only after/i);
    }
  });

  it('does not retain the independent pipeline or direct-default-branch publishing', () => {
    for (const [name, source] of routers) {
      expect(source, name).not.toMatch(/기본 브랜치에 커밋|commit directly|git push origin master/i);
      expect(source, name).toMatch(/never use a direct (?:commit|push) to `?(?:master|the default branch)/i);
      expect(source, name).not.toMatch(/src\/content\/config\.ts|src\/content\/blog|MDX 형식|scoring-engine|gap-finder|planner|seo-reviewer|contentCandidates\.json|published\.md|ideas\.md/i);
    }
  });

  it('keeps restato-blog-writer as a compatibility router rather than Korean-default prose guidance', () => {
    expect(writer).toContain('compatibility router');
    expect(writer).not.toContain('한국어 존댓말을 기본');
  });

  it('reports completion only from the canonical publication evidence', () => {
    for (const [name, source] of routers) {
      expect(source, name).toMatch(/English\/Korean URLs/i);
      expect(source, name).toMatch(/PR\/merge\/deployment status/i);
      expect(source, name).toMatch(/live verification/i);
      expect(source, name).not.toMatch(/local-build time/i);
    }
  });
});
