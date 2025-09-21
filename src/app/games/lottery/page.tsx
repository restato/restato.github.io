'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

interface LotteryResult {
  numbers: number[];
  timestamp: Date;
  preset: string;
}

const lotteryPresets = {
  'korea-lotto': { count: 6, max: 45, name: 'Korea Lotto 6/45' },
  'powerball': { count: 5, max: 69, name: 'US Powerball (5/69)' },
  'mega-millions': { count: 5, max: 70, name: 'US Mega Millions (5/70)' },
  'euromillions': { count: 5, max: 50, name: 'EuroMillions (5/50)' },
  'uk-lotto': { count: 6, max: 59, name: 'UK Lotto 6/59' },
  'custom': { count: 6, max: 49, name: 'Custom' }
};

export default function LotteryPage() {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof lotteryPresets>('korea-lotto');
  const [customCount, setCustomCount] = useState(6);
  const [customMax, setCustomMax] = useState(49);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentNumbers, setCurrentNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<LotteryResult[]>([]);

  const getCurrentSettings = () => {
    if (selectedPreset === 'custom') {
      return { count: customCount, max: customMax, name: 'Custom' };
    }
    return lotteryPresets[selectedPreset];
  };

  const generateNumbers = () => {
    const settings = getCurrentSettings();
    
    if (settings.count > settings.max) {
      toast.error('Number count cannot be greater than maximum number!');
      return;
    }

    setIsGenerating(true);
    setCurrentNumbers([]);

    // Animate number generation
    const animationInterval = setInterval(() => {
      const randomNumbers = Array.from(
        { length: settings.count }, 
        () => Math.floor(Math.random() * settings.max) + 1
      ).sort((a, b) => a - b);
      setCurrentNumbers(randomNumbers);
    }, 100);

    // Final generation after animation
    setTimeout(() => {
      clearInterval(animationInterval);
      
      const numbers: number[] = [];
      while (numbers.length < settings.count) {
        const num = Math.floor(Math.random() * settings.max) + 1;
        if (!numbers.includes(num)) {
          numbers.push(num);
        }
      }
      numbers.sort((a, b) => a - b);
      
      setCurrentNumbers(numbers);
      setIsGenerating(false);
      
      const result: LotteryResult = {
        numbers,
        timestamp: new Date(),
        preset: settings.name
      };
      
      setHistory([result, ...history.slice(0, 9)]); // Keep last 10 results
      
      // Celebration effect
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      toast.success(`${t('lottery.yourNumbers')}: ${numbers.join(', ')}`);
    }, 2000);
  };

  const resetHistory = () => {
    setHistory([]);
    setCurrentNumbers([]);
  };

  const copyNumbers = (numbers: number[]) => {
    navigator.clipboard.writeText(numbers.join(', '));
    toast.success('Numbers copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← {t('common.back')}
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎫 {t('games.lottery')}
        </h1>
        <p className="text-gray-600">
          {t('gameDescriptions.lottery')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Settings and Generation */}
        <div className="space-y-6">
          {/* Lottery Type Selection */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Lottery Type</h3>
            <div className="space-y-3">
              {Object.entries(lotteryPresets).map(([key, preset]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="preset"
                    value={key}
                    checked={selectedPreset === key}
                    onChange={(e) => setSelectedPreset(e.target.value as keyof typeof lotteryPresets)}
                    className="text-blue-600 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                  <span className="text-gray-700">{preset.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Settings */}
          {selectedPreset === 'custom' && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Custom Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('lottery.numbersCount')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={customCount}
                    onChange={(e) => setCustomCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('lottery.maxNumber')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={customMax}
                    onChange={(e) => setCustomMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Current Settings Display */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Current Settings</h4>
              <p className="text-gray-600">
                Generate <span className="font-bold">{getCurrentSettings().count}</span> numbers 
                from 1 to <span className="font-bold">{getCurrentSettings().max}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {getCurrentSettings().name}
              </p>
            </div>
          </div>

          {/* Generated Numbers Display */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">{t('lottery.yourNumbers')}</h3>
            
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <AnimatePresence>
                {currentNumbers.map((number, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                      isGenerating 
                        ? 'bg-gray-400 animate-pulse' 
                        : 'bg-gradient-to-br from-green-500 to-blue-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {number}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {currentNumbers.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  Click &quot;Generate Numbers&quot; to start!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={generateNumbers}
                disabled={isGenerating}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? 'Generating...' : t('lottery.generateNumbers')}
              </motion.button>
              
              {currentNumbers.length > 0 && !isGenerating && (
                <button
                  onClick={() => copyNumbers(currentNumbers)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - History and Info */}
        <div className="space-y-6">
          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('common.history')}</h3>
                <button
                  onClick={resetHistory}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {t('common.reset')}
                </button>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {history.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyNumbers(result.numbers)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          #{history.length - index} • {result.preset}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {result.numbers.map((number, numIndex) => (
                          <span
                            key={numIndex}
                            className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 text-white text-sm font-bold rounded-full"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-2">
                        Click to copy numbers
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Lottery Information */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Popular Lotteries</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="border-l-4 border-blue-400 pl-3">
                <div className="font-medium">Korea Lotto 6/45</div>
                <div className="text-gray-600">Pick 6 numbers from 1-45</div>
              </div>
              <div className="border-l-4 border-red-400 pl-3">
                <div className="font-medium">US Powerball</div>
                <div className="text-gray-600">5 numbers (1-69) + Powerball (1-26)</div>
              </div>
              <div className="border-l-4 border-green-400 pl-3">
                <div className="font-medium">EuroMillions</div>
                <div className="text-gray-600">5 numbers (1-50) + 2 Lucky Stars (1-12)</div>
              </div>
              <div className="border-l-4 border-purple-400 pl-3">
                <div className="font-medium">UK National Lottery</div>
                <div className="text-gray-600">Pick 6 numbers from 1-59</div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Disclaimer</h4>
            <p className="text-sm text-yellow-700">
              This is a random number generator for entertainment purposes only. 
              These numbers have the same chance of winning as any other combination. 
              Please gamble responsibly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}