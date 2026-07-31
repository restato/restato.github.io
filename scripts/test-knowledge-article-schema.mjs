import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const fixturePath = new URL(
  '../src/content/blog/knowledge-schema-contract-test.mdx',
  import.meta.url,
);
const outputPath = new URL(
  '../dist/blog/knowledge-schema-contract-test/index.html',
  import.meta.url,
);

const fixture = `---
title: Knowledge schema contract test
description: Temporary fixture for the published knowledge contract.
date: 2026-07-20
tags:
  - knowledge
draft: false
knowledgeId: solutions/contract.md
verifiedAt: 2026-07-20
updated: 2026-07-21
---

This fixture is removed after the contract test.
`;

let fixtureCreated = false;

try {
  await writeFile(fixturePath, fixture, { flag: 'wx' });
  fixtureCreated = true;
  await execFileAsync('npm', ['run', 'build:astro'], {
    cwd: new URL('..', import.meta.url),
  });

  const html = await readFile(outputPath, 'utf8');
  assert.match(html, /data-knowledge-id="solutions\/contract\.md"/);
  assert.match(html, />\s*Verified July 20, 2026(?:\s|<)/);
} finally {
  if (fixtureCreated) {
    await rm(fixturePath, { force: true });
  }
}
