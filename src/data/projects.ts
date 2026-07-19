export interface ProjectCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

export const projects: ProjectCard[] = [
  {
    slug: 'roomfit-3d',
    title: 'RoomFit 3D',
    description: 'Plan furniture layouts in a dimension-accurate 3D room with magnetic snapping and fit checks.',
    icon: '🛋️',
    color: 'from-cyan-500 to-indigo-500',
    badge: 'NEW',
  },
  {
    slug: 'pastedock',
    title: 'PasteDock',
    description: 'Menu bar clipboard manager for macOS',
    icon: '📋',
    color: 'from-emerald-500 to-teal-500',
    badge: 'NEW',
  },
  {
    slug: 'jobworld-kids',
    title: 'JobWorld Kids Planner',
    description: 'Schedule planner for the Korea JobWorld Kids Experience Center',
    icon: '🎪',
    color: 'from-blue-500 to-cyan-500',
    badge: 'NEW',
  },
  {
    slug: 'quick-issue',
    title: 'Quick Issue',
    description: 'Mobile-first PWA for creating GitHub issues in seconds',
    icon: '⚡',
    color: 'from-indigo-500 to-sky-500',
    badge: 'NEW',
  },
  {
    slug: 'games',
    title: 'Game Center',
    description: 'Collection of free online mini games',
    icon: '🎮',
    color: 'from-purple-500 to-pink-500',
  },
];
