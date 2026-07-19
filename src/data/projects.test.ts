import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { projects } from './projects';

describe('project catalog', () => {
  it('publishes the approved RoomFit gallery card without its private repository', () => {
    const roomfit = projects.find((project) => project.slug === 'roomfit-3d');

    expect(roomfit).toMatchObject({
      title: 'RoomFit 3D',
      description: 'Plan furniture layouts in a dimension-accurate 3D room with magnetic snapping and fit checks.',
      icon: '🛋️',
      badge: 'NEW',
      color: 'from-cyan-500 to-indigo-500',
    });
    expect(JSON.stringify(roomfit)).not.toContain('github.com/restato/roomfit-3d');
  });

  it('renders the English project catalog with current RoomFit metadata', () => {
    const source = readFileSync(join(process.cwd(), 'src/pages/projects/index.astro'), 'utf8');

    expect(source).toContain('lang="en"');
    expect(source).toContain('lockLanguage={true}');
    expect(source).toContain('RoomFit 3D');
  });

  it('publishes Local Price Extractor as an experimental public project', () => {
    const extractor = projects.find((project) => project.slug === 'local-price-extractor');

    expect(extractor).toMatchObject({
      title: 'Local Price Extractor',
      description: "Extract product prices locally with Chrome's built-in AI—no shopping-page backend required.",
      icon: '🏷️',
      badge: 'EXPERIMENTAL',
      color: 'from-amber-500 to-orange-500',
    });
  });

  it('includes Local Price Extractor in the project catalog metadata', () => {
    const source = readFileSync(join(process.cwd(), 'src/pages/projects/index.astro'), 'utf8');

    expect(source).toContain('including Local Price Extractor');
  });

  it('documents the Local Price Extractor install flow and experimental boundary', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/pages/projects/local-price-extractor.astro'),
      'utf8',
    );

    expect(source).toContain('Experimental Prototype');
    expect(source).toContain('2 accepted');
    expect(source).toContain('0 rejected');
    expect(source).toContain('chrome://extensions');
    expect(source).toContain('현재 페이지 분석');
    expect(source).toContain('Korean extraction is experimental');
    expect(source).toContain('https://github.com/restato/local-price-extractor');
    expect(source).toContain("'@type': 'SoftwareApplication'");
    expect(source).not.toContain('Open Live App');
  });
});
