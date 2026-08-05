import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

type RouterKind = 'one-click-publish' | 'restato-blog-writer';

type MarkdownSection = {
  heading: string;
  lines: string[];
};

const readSkill = (name: RouterKind) => readFileSync(
  join(process.cwd(), '.agents', 'skills', name, 'SKILL.md'),
  'utf8',
);

const parseMarkdown = (source: string) => {
  const allLines = source.split(/\r?\n/u);
  let bodyStart = 0;
  let malformedFrontmatter = false;
  let frontmatterLines: string[] = [];

  if (allLines[0]?.trim() === '---') {
    const frontmatterEnd = allLines.findIndex((line, index) => (
      index > 0 && line.trim() === '---'
    ));
    if (frontmatterEnd >= 0) {
      frontmatterLines = allLines.slice(1, frontmatterEnd);
      bodyStart = frontmatterEnd + 1;
    } else {
      malformedFrontmatter = true;
    }
  }

  const lines = allLines.slice(bodyStart);
  const headings: Array<{ level: number; text: string; line: number }> = [];
  let fenceMarker: string | undefined;

  lines.forEach((line, index) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/u)?.[1];
    if (fence) {
      fenceMarker = fenceMarker ? undefined : fence[0];
      return;
    }
    if (fenceMarker) return;

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/u);
    if (heading) {
      headings.push({
        level: heading[1].length,
        text: heading[2].trim(),
        line: index,
      });
    }
  });

  const sections: MarkdownSection[] = headings
    .filter(({ level }) => level === 2)
    .map((heading) => {
      const next = headings.find((candidate) => (
        candidate.line > heading.line && candidate.level <= 2
      ));
      return {
        heading: heading.text,
        lines: lines.slice(heading.line + 1, next?.line ?? lines.length),
      };
    });

  const title = headings.find(({ level }) => level === 1);
  const firstSection = headings.find(({ level }) => level === 2);
  const preamble = title
    ? lines.slice(title.line + 1, firstSection?.line ?? lines.length)
    : lines;

  return {
    lines,
    headings,
    sections,
    preamble,
    frontmatterLines,
    malformedFrontmatter,
  };
};

const sectionText = (section: MarkdownSection | undefined) => (
  section?.lines.join('\n').trim() ?? ''
);

const paragraphs = (section: MarkdownSection | undefined) => sectionText(section)
  .split(/\n\s*\n/u)
  .map((paragraph) => paragraph.replace(/\s*\n\s*/gu, ' ').trim())
  .filter(Boolean);

const normalizeSectionBody = (section: MarkdownSection | undefined) => sectionText(section)
  .split(/\r?\n/u)
  .map((line) => line.trim())
  .filter(Boolean)
  .join(' ')
  .replace(/\s+/gu, ' ');

const normalizeFrontmatter = (lines: readonly string[]) => lines
  .map(line => line.trim())
  .filter(Boolean)
  .join('\n');

const permittedFrontmatter: Record<RouterKind, string> = {
  'one-click-publish': '',
  'restato-blog-writer': [
    'name: restato-blog-writer',
    'description: Compatibility router for Restato technical blog publication',
    'version: 3.0.0',
  ].join('\n'),
};

const permittedSectionBodies: Record<RouterKind, Record<string, string>> = {
  'one-click-publish': {
    '트리거 예시': [
      '- "이 주제로 글 써서 올려"',
      '- "1, 3번 발행해"',
      '- "최근 커밋으로 개발일지 올려"',
      '- "기존 Claude Code 글 업데이트해"',
    ].join(' '),
    'Canonical workflow': [
      'This is a compatibility router. For every planning, research, writing, review, publication, or update request, load the globally installed `restato-content-partner` skill and follow it as the sole workflow. If that skill is unavailable, stop and report the blocker; do not revive local publishing instructions.',
      'Default publication is an English source plus a reviewed Korean alternate that share one `translationKey`. A user may explicitly request a single language only when the canonical workflow records the override.',
      'Public MDX is created only after the canonical private editorial handoff and safety gates pass. Do not copy private knowledge or credentials into public MDX.',
      'Never use a direct commit to `master` or another default branch; never use a direct push there either. The canonical workflow owns isolated worktrees, PR review, merge, deployment, and live-page verification.',
    ].join(' '),
    '완료 보고': [
      "Report the canonical workflow's publication evidence, not local-build success:",
      '- English/Korean URLs, or the recorded single-language override URL',
      '- PR/merge/deployment status',
      '- live verification result',
      '- any canonical blocker or incomplete verification',
    ].join(' '),
  },
  'restato-blog-writer': {
    'Canonical workflow': [
      'This compatibility router delegates every article plan, research task, draft, review, update, or publication request to the globally installed `restato-content-partner` skill. Load and follow that skill as the sole workflow. If it is unavailable, stop and report the blocker rather than recreating a local publishing process.',
      'Default publication is an English source plus a reviewed Korean alternate sharing one `translationKey`. A user may explicitly request a single language only when the canonical workflow records the override.',
      'Public MDX is created only after the canonical private editorial handoff and safety gates pass. Do not copy private knowledge or credentials into public MDX.',
      'Never use a direct commit to `master` or another default branch; never use a direct push there either. The canonical workflow owns isolated worktrees, PR review, merge, deployment, and live-page verification.',
    ].join(' '),
    'Completion reporting': [
      "Defer completion to the canonical workflow's publication evidence. Report:",
      '- English/Korean URLs, or the recorded single-language override URL',
      '- PR/merge/deployment status',
      '- live verification result',
      '- any canonical blocker or incomplete verification',
    ].join(' '),
  },
};

const injectCanonicalInstruction = (source: string, instruction: string) => source.replace(
  /\n## (완료 보고|Completion reporting)\n/u,
  `\n${instruction}\n\n## $1\n`,
);

const validateRouter = (source: string, kind: RouterKind): string[] => {
  const errors: string[] = [];
  const parsed = parseMarkdown(source);
  const expectedTitle = kind === 'one-click-publish'
    ? 'One Click Publish'
    : 'Restato Blog Writer';
  const expectedSections = kind === 'one-click-publish'
    ? ['트리거 예시', 'Canonical workflow', '완료 보고']
    : ['Canonical workflow', 'Completion reporting'];
  const actualSections = parsed.sections.map(({ heading }) => heading);

  if (
    parsed.malformedFrontmatter
    || normalizeFrontmatter(parsed.frontmatterLines) !== permittedFrontmatter[kind]
  ) {
    errors.push('router frontmatter differs from allowlist');
  }

  const titles = parsed.headings.filter(({ level }) => level === 1);
  if (titles.length !== 1 || titles[0]?.text !== expectedTitle) {
    errors.push('invalid top-level title');
  }
  if (parsed.headings.some(({ level }) => level > 2)) {
    errors.push('nested operational heading');
  }
  if (JSON.stringify(actualSections) !== JSON.stringify(expectedSections)) {
    const unexpected = actualSections.find((heading) => !expectedSections.includes(heading));
    errors.push(unexpected
      ? `unexpected section heading: ${unexpected}`
      : 'missing or reordered router section');
  }
  if (parsed.preamble.some((line) => line.trim())) {
    errors.push('content outside an allowed section');
  }
  for (const [heading, permittedBody] of Object.entries(permittedSectionBodies[kind])) {
    const section = parsed.sections.find((candidate) => candidate.heading === heading);
    if (normalizeSectionBody(section) !== permittedBody) {
      errors.push(heading === 'Canonical workflow'
        ? 'canonical workflow body differs from allowlist'
        : `${heading} body differs from allowlist`);
    }
  }

  const canonical = parsed.sections.find(({ heading }) => heading === 'Canonical workflow');
  const completion = parsed.sections.find(({ heading }) => (
    heading === '완료 보고' || heading === 'Completion reporting'
  ));
  const canonicalText = sectionText(canonical);
  const completionText = sectionText(completion);
  const requireText = (
    text: string,
    pattern: string | RegExp,
    message: string,
  ) => {
    const found = typeof pattern === 'string'
      ? text.includes(pattern)
      : pattern.test(text);
    if (!found) errors.push(message);
  };

  const negatedDelegation = /\b(?:do(?:es)? not|don't|doesn't|never|cannot|can't)\s+(?:delegate|route|load|follow|own)|\b(?:not|never)\s+(?:the\s+)?sole workflow\b/iu;
  const delegatingParagraphs = paragraphs(canonical).filter((paragraph) => (
    /(?:restato-content-partner|canonical workflow)/iu.test(paragraph)
    && /\b(?:delegates?|routes?|loads?|follows?|owns?)\b/iu.test(paragraph)
    && !negatedDelegation.test(paragraph)
  ));
  const delegatedScope = delegatingParagraphs.join(' ');
  requireText(delegatedScope, 'restato-content-partner', 'missing canonical delegation');
  requireText(delegatedScope, /sole workflow/i, 'missing sole-workflow delegation');

  const delegatedStages: Array<[string, RegExp]> = [
    ['planning', /\bplan(?:ning)?\b/iu],
    ['research', /\bresearch\b/iu],
    ['writing', /\b(?:writing|draft)\b/iu],
    ['review', /\breview\b/iu],
    ['PR', /\b(?:PR|pull request)\b/iu],
    ['merge', /\bmerge\b/iu],
    ['deploy', /\bdeploy(?:ment|ing|ed)?\b/iu],
    ['live verification', /\blive(?:-page)? verification\b|\bverify(?:ing|ied)? (?:the )?live\b/iu],
  ];
  for (const [stage, pattern] of delegatedStages) {
    if (!pattern.test(delegatedScope)) errors.push(`delegation missing: ${stage}`);
  }

  requireText(canonicalText, 'English source', 'missing English source default');
  requireText(canonicalText, 'Korean alternate', 'missing Korean alternate default');
  requireText(canonicalText, 'translationKey', 'missing shared translation key');
  requireText(canonicalText, /explicitly request(?:s|ed)? (?:a )?single language/i, 'missing explicit override');
  requireText(canonicalText, /records? the override/i, 'missing recorded override');
  requireText(canonicalText, /private editorial handoff/i, 'missing private handoff');
  requireText(canonicalText, /safety gates/i, 'missing safety gates');
  requireText(canonicalText, /public MDX.*only after/i, 'missing public MDX boundary');
  requireText(canonicalText, /never use a direct (?:commit|push) to `?(?:master|the default branch)/i, 'missing branch prohibition');

  requireText(completionText, /English\/Korean URLs/i, 'missing bilingual URLs');
  requireText(completionText, /PR\/merge\/deployment status/i, 'missing publication status');
  requireText(completionText, /live verification/i, 'missing live verification');
  if (/local-build time/i.test(completionText)) errors.push('local build completion claim');

  for (const section of parsed.sections) {
    const canContainNumberedExamples = section.heading === '트리거 예시'
      || section.heading === 'Completion reporting'
      || section.heading === '완료 보고';
    if (!canContainNumberedExamples && section.lines.some((line) => /^\s*\d+[.)]\s+/u.test(line))) {
      errors.push('numbered workflow outside trigger/completion');
    }
  }

  if (parsed.lines.some((line) => /^\s*(?:`{3,}|~{3,})/u.test(line))) {
    errors.push('frontmatter or schema example');
  }

  const fullSourceText = source;
  const forbiddenRules: Array<[string, RegExp]> = [
    ['frontmatter or schema example', /\b(?:frontmatter|content schema|MDX schema|MDX 형식|스키마 예시)\b/iu],
    ['public article file instruction', /src\/content\/blog/iu],
    ['forbidden Git command', /\bgit\s+(?:commit|push|checkout|switch|merge)\b/iu],
    ['independent research instruction', /\b(?:research|investigate)\s+(?:the\s+)?(?:official|primary|sources?|documentation|docs?)\b|직접\s*(?:조사|리서치)|(?:공식\s*)?(?:문서|자료|출처)(?:를|을)?\s*(?:조사|리서치)(?:합니다|한다|하세요|하고)?/iu],
    ['independent scoring instruction', /\b(?:run|use|invoke|calculate|record)\s+(?:the\s+)?(?:score|scoring|scorer)\b|(?:품질\s*)?점수(?:를|을)?\s*(?:계산|산정|기록|매기)/iu],
    ['independent planner or writer instruction', /\b(?:run|use|invoke)\s+(?:the\s+)?(?:planner|writer)\b|\bplanner\s*(?:→|->|then)\s*writer\b/iu],
    ['independent writing instruction', /\b(?:write|draft)\s+(?:the\s+|an?\s+)?(?:article|post|copy|draft)\b|(?:초안|글|본문)(?:을|를)?\s*(?:작성|씁니다|쓴다|작성합니다)/iu],
    ['memory or candidates update', /\b(?:update|write|record)\s+(?:the\s+)?(?:memory|candidates?|candidate records?)\b|\b(?:memory|candidates?|candidate records?).{0,24}\b(?:update|write|record)\b|(?:메모리|후보\s*(?:기록|목록)?).{0,16}(?:갱신|업데이트|기록)/iu],
    ['Korean-default voice', /한국어.{0,30}(?:존댓말|기본\s*(?:문체|으로)|기본값)|Korean.{0,24}(?:default voice|default prose|as the default)/iu],
    ['independent deploy step', /\bdeploy\s+(?:the\s+)?(?:site|article|post|content)\b|(?:사이트|글|콘텐츠)(?:을|를)?\s*(?:배포|발행)(?:합니다|한다|하세요|하고)/iu],
    ['independent pipeline', /\b(?:publishing|publication|deployment)\s+pipeline\b|(?:독립|로컬).{0,12}(?:파이프라인|배포\s*단계)/iu],
  ];
  for (const [message, pattern] of forbiddenRules) {
    if (pattern.test(fullSourceText)) errors.push(message);
  }

  const branchAction = /\b(?:commit|push|merge|checkout|switch)\b.{0,48}\b(?:main|master|default branch)\b|\b(?:main|master|default branch)\b.{0,48}\b(?:commit|push|merge|checkout|switch)\b|(?:커밋|푸시|병합|체크아웃).{0,32}기본\s*브랜치|기본\s*브랜치.{0,32}(?:커밋|푸시|병합|체크아웃)/iu;
  const negation = /\b(?:do not|don't|never|must not|cannot|can't|without|rather than|stop)\b|(?:하지\s*(?:않|말)|금지|중단)/iu;
  for (const paragraph of fullSourceText.split(/\n\s*\n/u)) {
    if (branchAction.test(paragraph) && !negation.test(paragraph)) {
      errors.push('direct default-branch action');
    }
  }

  if (kind === 'restato-blog-writer') {
    requireText(canonicalText, 'compatibility router', 'missing compatibility-router identity');
  }

  return [...new Set(errors)];
};

const routers = [
  ['one-click-publish', readSkill('one-click-publish')],
  ['restato-blog-writer', readSkill('restato-blog-writer')],
] as const;

const independentPipelineMutation = `${routers[0][1]}

## 조사 및 배포

1. 공식 문서를 직접 조사합니다.
2. 초안을 작성하고 품질 점수를 계산합니다.
3. \`git checkout main\` 후 변경을 커밋합니다.
4. 후보 기록과 memory를 갱신합니다.
5. 사이트를 배포하고 결과를 확인합니다.
`;

const unrelatedPhraseMutation = `# One Click Publish

## 트리거 예시

- "restato-content-partner sole workflow English source Korean alternate translationKey explicitly request a single language records the override private editorial handoff safety gates Public MDX is created only after approval Never use a direct commit to master English/Korean URLs PR/merge/deployment status live verification"

## Canonical workflow

This local router handles the publication itself.

## 완료 보고

- 완료
`;

const negatedDelegationMutation = routers[0][1]
  .replace(
    /This is a compatibility router[\s\S]+?publishing instructions\./u,
    'This compatibility router mentions restato-content-partner but does not delegate to it. It is not the sole workflow. Planning, research, writing, and review remain local.',
  )
  .replace(
    /The canonical workflow owns isolated worktrees,[\s\S]+?live-page verification\./u,
    'The canonical workflow does not own PR review, merge, deployment, or live-page verification.',
  );

const operationMutations: Array<[string, string]> = [
  ['independent research instruction', 'Research the official documentation before drafting.'],
  ['independent research instruction', '공식 문서를 직접 조사합니다.'],
  ['independent scoring instruction', 'Calculate the scoring result locally.'],
  ['independent planner or writer instruction', 'Run planner, then invoke writer.'],
  ['frontmatter or schema example', 'Add a frontmatter schema example here.'],
  ['public article file instruction', 'Write the result under src/content/blog.'],
  ['forbidden Git command', 'Run `git checkout main`, then `git push origin main`.'],
  ['direct default-branch action', 'Commit the article to the default branch.'],
  ['memory or candidates update', 'Update memory and candidate records.'],
  ['Korean-default voice', '한국어 존댓말을 기본 문체로 사용합니다.'],
  ['independent deploy step', 'Deploy the site after the local build.'],
];

const forbiddenFrontmatterMutation = `---
name: one-click-publish
description: Commit directly to master through an independent publishing pipeline.
version: 1.0.0
---
${routers[0][1]}`;

describe('publishing compatibility routers', () => {
  it('accepts both canonical publishing routers', () => {
    for (const [kind, source] of routers) {
      expect(validateRouter(source, kind), kind).toEqual([]);
    }
  });

  it('rejects a reintroduced independent publishing pipeline', () => {
    expect(validateRouter(independentPipelineMutation, 'one-click-publish')).toEqual(expect.arrayContaining([
      'unexpected section heading: 조사 및 배포',
      'numbered workflow outside trigger/completion',
      'forbidden Git command',
      'independent research instruction',
      'independent scoring instruction',
      'independent writing instruction',
      'memory or candidates update',
      'independent deploy step',
    ]));
  });

  it('does not accept required phrases placed in unrelated trigger text', () => {
    expect(validateRouter(unrelatedPhraseMutation, 'one-click-publish')).toEqual(expect.arrayContaining([
      'missing canonical delegation',
      'delegation missing: planning',
      'delegation missing: live verification',
      'missing bilingual URLs',
    ]));
  });

  it('does not treat negated ownership as canonical delegation', () => {
    expect(validateRouter(negatedDelegationMutation, 'one-click-publish')).toEqual(expect.arrayContaining([
      'missing canonical delegation',
      'delegation missing: planning',
      'delegation missing: live verification',
    ]));
  });

  it('rejects unlisted workflow prose even when it avoids known action terms', () => {
    const mutation = injectCanonicalInstruction(
      routers[0][1],
      'Gather sources, compose the post, assess quality, and release it to production.',
    );
    expect(validateRouter(mutation, 'one-click-publish')).toContain(
      'canonical workflow body differs from allowlist',
    );
  });

  it('ignores harmless prose reflow and repeated spaces', () => {
    const reflowed = routers[0][1]
      .replace(
        'This is a compatibility router. For every planning, research, writing, review,\npublication, or update request',
        'This is a compatibility router.   For every planning,\nresearch, writing, review, publication, or update request',
      )
      .replace(
        'Default publication is an English source plus a reviewed Korean alternate that\nshare one',
        'Default publication is an English source plus a reviewed\nKorean alternate that share one',
      );
    expect(validateRouter(reflowed, 'one-click-publish')).toEqual([]);
  });

  it('accepts exact approved metadata with harmless router-body reflow', () => {
    const reflowed = routers[1][1]
      .replace(
        'This compatibility router delegates every article plan, research task, draft,\nreview, update, or publication request',
        'This compatibility router delegates every article plan,\nresearch task, draft, review, update, or publication request',
      )
      .replace(
        'Default publication is an English source plus a reviewed Korean alternate\nsharing one',
        'Default publication is an English source plus a reviewed\nKorean alternate sharing one',
      );

    expect(validateRouter(reflowed, 'restato-blog-writer')).toEqual([]);
  });

  it('rejects forbidden direct-default and independent-workflow instructions in frontmatter', () => {
    expect(validateRouter(forbiddenFrontmatterMutation, 'one-click-publish')).toEqual(
      expect.arrayContaining([
        'router frontmatter differs from allowlist',
        'direct default-branch action',
        'independent pipeline',
      ]),
    );
  });

  it.each(operationMutations)('rejects %s', (expectedError, instruction) => {
    const mutation = injectCanonicalInstruction(routers[0][1], instruction);
    expect(validateRouter(mutation, 'one-click-publish')).toContain(expectedError);
  });
});
