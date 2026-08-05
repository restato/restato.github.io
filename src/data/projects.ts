export interface ProjectCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
  url?: string;
}

export const projects: ProjectCard[] = [
  {
    slug: 'neighborhood-change',
    title: '동네변화',
    description: 'Search official building permits, construction starts, completions, demolitions, and use changes around addresses in Seoul and Bundang.',
    icon: '🏗️',
    color: 'from-sky-500 to-emerald-500',
    badge: 'NEW',
  },
  {
    slug: 'barunhankki',
    title: '바른한끼',
    description: 'Search official restaurant hygiene grades and designation validity periods across Gyeonggi Province.',
    icon: '🛡️',
    color: 'from-green-500 to-emerald-500',
    badge: 'NEW',
    url: 'https://barunhankki.vercel.app',
  },
  {
    slug: 'arc-note',
    title: 'Arc Note',
    description: 'A mobile-first tarot reflection experience with optional ad-unlocked AI detail.',
    icon: '🔮',
    color: 'from-stone-700 to-amber-700',
    badge: 'NEW',
  },
  {
    slug: 'local-price-extractor',
    title: 'Local Price Extractor',
    description: "Extract product prices locally with Chrome's built-in AI—no shopping-page backend required.",
    icon: '🏷️',
    color: 'from-amber-500 to-orange-500',
    badge: 'EXPERIMENTAL',
  },
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
