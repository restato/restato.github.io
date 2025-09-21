'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

interface RouletteEntry {
  id: string;
  name: string;
  weight: number;
  color: string;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

export default function RoulettePage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<RouletteEntry[]>([]);
  const [newEntryName, setNewEntryName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [winner, setWinner] = useState<RouletteEntry | null>(null);
  const [winners, setWinners] = useState<RouletteEntry[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addEntry = () => {
    if (!newEntryName.trim()) return;
    
    // Support format: "name*weight" or just "name"
    const parts = newEntryName.split('*');
    const name = parts[0].trim();
    const weight = parts[1] ? parseInt(parts[1].trim()) || 1 : 1;
    
    if (weight <= 0) {
      toast.error(t('roulette.invalidEntry'));
      return;
    }

    const newEntry: RouletteEntry = {
      id: Date.now().toString(),
      name,
      weight,
      color: colors[entries.length % colors.length],
    };

    setEntries([...entries, newEntry]);
    setNewEntryName('');
    toast.success(`${name} ${t('common.add')}ed!`);
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const drawRoulette = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || entries.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate total weight
    const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);

    // Draw segments
    let currentAngle = currentRotation * (Math.PI / 180);
    
    entries.forEach((entry) => {
      const sliceAngle = (entry.weight / totalWeight) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = entry.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const textAngle = currentAngle + sliceAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(entry.name, 0, 0);
      if (entry.weight > 1) {
        ctx.font = '12px Arial';
        ctx.fillText(`(×${entry.weight})`, 0, 15);
      }
      ctx.restore();

      currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 10);
    ctx.lineTo(centerX - 10, centerY - radius + 10);
    ctx.lineTo(centerX + 10, centerY - radius + 10);
    ctx.closePath();
    ctx.fillStyle = '#FF4757';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [entries, currentRotation]);

  const spinRoulette = () => {
    if (entries.length === 0) {
      toast.error(t('roulette.noEntries'));
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    // Random spin amount (3-8 full rotations + random angle)
    const spins = 3 + Math.random() * 5;
    const finalRotation = currentRotation + spins * 360 + Math.random() * 360;

    setCurrentRotation(finalRotation);

    // Calculate winner after spin
    setTimeout(() => {
      const normalizedAngle = (360 - (finalRotation % 360)) % 360;
      const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
      
      let currentAngle = 0;
      let selectedEntry: RouletteEntry | null = null;

      for (const entry of entries) {
        const sliceAngle = (entry.weight / totalWeight) * 360;
        if (normalizedAngle >= currentAngle && normalizedAngle < currentAngle + sliceAngle) {
          selectedEntry = entry;
          break;
        }
        currentAngle += sliceAngle;
      }

      if (selectedEntry) {
        setWinner(selectedEntry);
        setWinners([selectedEntry, ...winners]);
        
        // Celebration effects
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        toast.success(`🎉 ${t('common.winner')}: ${selectedEntry.name}!`);
      }

      setIsSpinning(false);
    }, 3000);
  };

  const resetRoulette = () => {
    setCurrentRotation(0);
    setWinner(null);
    setWinners([]);
  };

  useEffect(() => {
    drawRoulette();
  }, [entries, currentRotation, drawRoulette]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← {t('common.back')}
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎲 {t('games.roulette')}
          </h1>
          <p className="text-gray-600">
            {t('gameDescriptions.roulette')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Controls */}
        <div className="space-y-6">
          {/* Add Entry */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">{t('roulette.addEntry')}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newEntryName}
                onChange={(e) => setNewEntryName(e.target.value)}
                placeholder={t('roulette.enterName')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addEntry()}
              />
              <button
                onClick={addEntry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.add')}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Format: &quot;Name&quot; or &quot;Name*Weight&quot; (e.g., &quot;John*5&quot;)
            </p>
          </div>

          {/* Entries List */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              {t('common.entries')} ({entries.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <AnimatePresence>
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="font-medium">{entry.name}</span>
                      {entry.weight > 1 && (
                        <span className="text-sm text-gray-500">×{entry.weight}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex gap-4">
              <button
                onClick={spinRoulette}
                disabled={isSpinning || entries.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSpinning ? t('roulette.spinning') : t('roulette.spin')}
              </button>
              <button
                onClick={resetRoulette}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {t('common.reset')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Roulette */}
        <div className="space-y-6">
          {/* Roulette Wheel */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-center">
              <motion.canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border rounded-full"
                animate={{ rotate: currentRotation }}
                transition={{ 
                  duration: isSpinning ? 3 : 0.5, 
                  ease: isSpinning ? "easeOut" : "linear" 
                }}
              />
            </div>
          </div>

          {/* Winner Display */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white text-center shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">🎉 {t('roulette.winner')}!</h3>
                <p className="text-xl">{winner.name}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Previous Winners */}
          {winners.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">{t('roulette.previousWinners')}</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {winners.map((winner, index) => (
                  <div key={`${winner.id}-${index}`} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500">#{winners.length - index}</span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: winner.color }}
                    ></div>
                    <span>{winner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}