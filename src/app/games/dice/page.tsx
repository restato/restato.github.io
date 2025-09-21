'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

interface DiceResult {
  dice: number[];
  total: number;
  timestamp: Date;
}

const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function DicePage() {
  const { t } = useLanguage();
  const [numberOfDice, setNumberOfDice] = useState(2);
  const [sidesPerDie, setSidesPerDie] = useState(6);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number[]>([]);
  const [history, setHistory] = useState<DiceResult[]>([]);

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      const randomDice = Array.from({ length: numberOfDice }, () => 
        Math.floor(Math.random() * sidesPerDie) + 1
      );
      setCurrentRoll(randomDice);
    }, 100);

    // Stop after 1.5 seconds and set final result
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      const finalRoll = Array.from({ length: numberOfDice }, () => 
        Math.floor(Math.random() * sidesPerDie) + 1
      );
      const total = finalRoll.reduce((sum, die) => sum + die, 0);
      
      setCurrentRoll(finalRoll);
      setIsRolling(false);
      
      const result: DiceResult = {
        dice: finalRoll,
        total,
        timestamp: new Date()
      };
      
      setHistory([result, ...history.slice(0, 9)]); // Keep last 10 results
      
      // Celebration effect for max roll
      if (total === numberOfDice * sidesPerDie) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('🎉 Maximum roll!');
      } else {
        toast.success(`${t('dice.total')}: ${total}`);
      }
    }, 1500);
  };

  const resetHistory = () => {
    setHistory([]);
    setCurrentRoll([]);
  };

  const getDieEmoji = (value: number) => {
    if (sidesPerDie === 6 && value >= 1 && value <= 6) {
      return diceEmojis[value - 1];
    }
    return value.toString();
  };

  const getStats = () => {
    if (history.length === 0) return null;
    
    const totals = history.map(r => r.total);
    const average = totals.reduce((sum, total) => sum + total, 0) / totals.length;
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    
    return { average: average.toFixed(1), max, min, rolls: history.length };
  };

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← {t('common.back')}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ⚀ {t('games.dice')}
        </h1>
        <p className="text-gray-600">
          {t('gameDescriptions.dice')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Dice Controls */}
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dice.numberOfDice')}
                </label>
                <select
                  value={numberOfDice}
                  onChange={(e) => setNumberOfDice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRolling}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dice.sidesPerDie')}
                </label>
                <select
                  value={sidesPerDie}
                  onChange={(e) => setSidesPerDie(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRolling}
                >
                  <option value={4}>4 (Tetrahedron)</option>
                  <option value={6}>6 (Standard)</option>
                  <option value={8}>8 (Octahedron)</option>
                  <option value={10}>10 (Pentagonal)</option>
                  <option value={12}>12 (Dodecahedron)</option>
                  <option value={20}>20 (Icosahedron)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dice Display */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <AnimatePresence>
                {currentRoll.map((die, index) => (
                  <motion.div
                    key={index}
                    className={`w-16 h-16 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg ${
                      isRolling ? 'border-blue-400' : 'border-gray-300'
                    }`}
                    animate={isRolling ? {
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{
                      duration: 0.1,
                      repeat: isRolling ? Infinity : 0
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {sidesPerDie === 6 ? getDieEmoji(die) : die}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {currentRoll.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  Click &quot;Roll Dice&quot; to start!
                </div>
              )}
            </div>

            {/* Total Display */}
            {currentRoll.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                  <span className="text-sm text-gray-600">{t('dice.total')}: </span>
                  <span className="text-3xl font-bold text-purple-600">
                    {currentRoll.reduce((sum, die) => sum + die, 0)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Roll Button */}
            <motion.button
              onClick={rollDice}
              disabled={isRolling}
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRolling ? 'Rolling...' : t('dice.rollDice')}
            </motion.button>
          </div>

          {/* Statistics */}
          {stats && (
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.average}</div>
                  <div className="text-sm text-blue-500">Average</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">{stats.rolls}</div>
                  <div className="text-sm text-green-500">Rolls</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-600">{stats.max}</div>
                  <div className="text-sm text-yellow-500">Highest</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600">{stats.min}</div>
                  <div className="text-sm text-red-500">Lowest</div>
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
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {history.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-purple-600">
                          Roll #{history.length - index}
                        </span>
                        <span className="text-2xl font-bold text-gray-800">
                          {result.total}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {result.dice.map((die, dieIndex) => (
                          <span
                            key={dieIndex}
                            className="inline-flex items-center justify-center w-8 h-8 bg-white border rounded text-sm font-medium"
                          >
                            {sidesPerDie === 6 ? getDieEmoji(die) : die}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {result.timestamp.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Game Information */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Dice Types</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>D4 (4-sided):</span>
                <span>1-4</span>
              </div>
              <div className="flex justify-between">
                <span>D6 (6-sided):</span>
                <span>1-6 (Standard)</span>
              </div>
              <div className="flex justify-between">
                <span>D8 (8-sided):</span>
                <span>1-8</span>
              </div>
              <div className="flex justify-between">
                <span>D10 (10-sided):</span>
                <span>1-10</span>
              </div>
              <div className="flex justify-between">
                <span>D12 (12-sided):</span>
                <span>1-12</span>
              </div>
              <div className="flex justify-between">
                <span>D20 (20-sided):</span>
                <span>1-20 (D&D favorite!)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}