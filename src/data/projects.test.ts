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
    expect(source).toContain('including RoomFit 3D');
  });
});
