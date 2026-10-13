import React from 'react';
import { soundManager } from '../services/audio';
import { Award, ArrowRight, Home, Sparkles, CheckCircle2 } from 'lucide-react';

interface LevelCompleteModalProps {
  levelNumber: number; // current completed level X
  score: number;
  maxScore: number;
  materialsEarned: {
    wood: number;
    rope: number;
    lights: number;
    electronics: number;
    bricks: number;
  };
  onProceedToNextLevel: () => void;
  onOpenHomeBuilder: () => void;
  onReturnToDashboard: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  score,
  maxScore = 25,
  materialsEarned,
  onProceedToNextLevel,
  onOpenHomeBuilder,
  onReturnToDashboard,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-5">
        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20">
          🎉
        </div>

        {/* The Exact User-Requested Header: "You are finished Level X" */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono-code text-amber-400 uppercase tracking-widest font-bold">
            STAGE CLEARED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-100 tracking-wide">
            YOU ARE FINISHED LEVEL {levelNumber}
          </h1>
          <p className="text-xs text-neutral-400 font-mono-code mt-0.5">
            Level {levelNumber} challenges completed successfully!
          </p>
        </div>

        {/* Score & Points */}
        <div className="w-full p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono-code">
          <span className="text-neutral-400">Level Score:</span>
          <span className="text-sm font-bold text-emerald-400">
            {score} / {maxScore} Points (100% Passed)
          </span>
        </div>

        {/* Home Reconstruction Materials Rewarded */}
        <div className="w-full p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-neutral-300 font-semibold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Shelter Construction Materials Rewarded:</span>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono-code">
            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col">
              <span className="text-base">🪵</span>
              <span className="text-[10px] text-neutral-400">Wood</span>
              <span className="text-amber-400 font-bold">+{materialsEarned.wood}</span>
            </div>

            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col">
              <span className="text-base">🪢</span>
              <span className="text-[10px] text-neutral-400">Rope</span>
              <span className="text-yellow-400 font-bold">+{materialsEarned.rope}</span>
            </div>

            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col">
              <span className="text-base">💡</span>
              <span className="text-[10px] text-neutral-400">Lights</span>
              <span className="text-cyan-400 font-bold">+{materialsEarned.lights}</span>
            </div>

            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col">
              <span className="text-base">🔌</span>
              <span className="text-[10px] text-neutral-400">Electric</span>
              <span className="text-purple-400 font-bold">+{materialsEarned.electronics}</span>
            </div>

            <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col">
              <span className="text-base">🧱</span>
              <span className="text-[10px] text-neutral-400">Bricks</span>
              <span className="text-rose-400 font-bold">+{materialsEarned.bricks}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          {levelNumber < 50 ? (
            <button
              onClick={() => {
                soundManager.playSuccess();
                onProceedToNextLevel();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <span>Proceed to Level {levelNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold">
              🏆 ALL 50 LEVELS ACCOMPLISHED! EARTH LEGEND CONFERRED!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenHomeBuilder();
              }}
              className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Rebuild My Home</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBeep(480, 0.04);
                onReturnToDashboard();
              }}
              className="py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
