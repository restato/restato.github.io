'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function CoinFlipPage() {
  const { t } = useLanguage();
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);

    // Simulate coin flip after animation
    setTimeout(() => {
      const coinResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      setHistory([coinResult, ...history.slice(0, 9)]); // Keep last 10 results
      setIsFlipping(false);

      // Celebration effect
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      toast.success(`${t(`coinFlip.${coinResult}`)}!`);
    }, 2000);
  };

  const resetHistory = () => {
    setHistory([]);
    setResult(null);
  };

  const getStats = () => {
    const heads = history.filter(r => r === 'heads').length;
    const tails = history.filter(r => r === 'tails').length;
    return { heads, tails, total: history.length };
  };

  const stats = getStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← {t('common.back')}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🪙 {t('games.coinFlip')}
        </h1>
        <p className="text-gray-600">
          {t('gameDescriptions.coinFlip')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Coin */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex flex-col items-center">
              {/* Coin Animation */}
              <div className="relative w-48 h-48 mb-8">
                <motion.div
                  className="w-full h-full rounded-full border-8 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-6xl shadow-lg"
                  animate={isFlipping ? {
                    rotateY: [0, 1800],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{
                    duration: 2,
                    ease: "easeOut"
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!isFlipping && result && (
                      <motion.div
                        key={result}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-white font-bold"
                      >
                        {result === 'heads' ? '👑' : '💰'}
                      </motion.div>
                    )}
                    {isFlipping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-white font-bold"
                      >
                        ?
                      </motion.div>
                    )}
                    {!isFlipping && !result && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white font-bold"
                      >
                        🪙
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {result && !isFlipping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`text-2xl font-bold p-4 rounded-lg ${
                      result === 'heads' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {t(`coinFlip.${result}`)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flip Button */}
              <motion.button
                onClick={flipCoin}
                disabled={isFlipping}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFlipping ? t('coinFlip.flipping') : t('coinFlip.flip')}
              </motion.button>
            </div>
          </div>

          {/* Statistics */}
          {history.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Statistics</h3>
                <button
                  onClick={resetHistory}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {t('common.reset')}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.heads}</div>
                  <div className="text-sm text-blue-500">{t('coinFlip.heads')}</div>
                  <div className="text-xs text-gray-500">
                    {stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.tails}</div>
                  <div className="text-sm text-green-500">{t('coinFlip.tails')}</div>
                  <div className="text-xs text-gray-500">
                    {stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - History */}
        <div className="space-y-6">
          {history.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">{t('common.history')}</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {history.map((flip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        flip === 'heads' 
                          ? 'bg-blue-50 border-l-4 border-blue-400' 
                          : 'bg-green-50 border-l-4 border-green-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {flip === 'heads' ? '👑' : '💰'}
                        </span>
                        <span className="font-medium">
                          {t(`coinFlip.${flip}`)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        #{history.length - index}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Game Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">How to Play</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Click the &quot;Flip Coin&quot; button to start</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Watch the coin spin and wait for the result</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>See your flip history and statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Perfect for making decisions or settling disputes!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}