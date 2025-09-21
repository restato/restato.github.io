'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';

const games = [
  {
    id: 'roulette',
    icon: '🎲',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    id: 'bingo',
    icon: '🎯',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'lottery',
    icon: '🎫',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'coinFlip',
    icon: '🪙',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'dice',
    icon: '⚀',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: 'cards',
    icon: '🃏',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'namePicker',
    icon: '📝',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'numberRange',
    icon: '🔢',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'rockPaperScissors',
    icon: '✂️',
    gradient: 'from-gray-500 to-slate-500',
  },
  {
    id: 'teamDivider',
    icon: '👥',
    gradient: 'from-orange-500 to-red-500',
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/games/${game.id}`}>
              <div className={`bg-gradient-to-br ${game.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {game.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {t(`games.${game.id}`)}
                </h3>
                <p className="text-sm opacity-90">
                  {t(`gameDescriptions.${game.id}`)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
            <p className="text-gray-600">Available in 8 languages for global use</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
            <p className="text-gray-600">Works perfectly on all devices</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Fair & Random</h3>
            <p className="text-gray-600">Truly random results every time</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}