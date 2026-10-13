import React, { useState } from 'react';
import { Difficulty, GradeLevel } from '../types/game';
import { soundManager } from '../services/audio';
import { Play, Gauge, Shield, AlertTriangle, Sparkles, X } from 'lucide-react';

interface DifficultyModalProps {
  grade: GradeLevel;
  initialDifficulty: Difficulty;
  onConfirmDifficulty: (diff: Difficulty) => void;
  onClose: () => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  grade,
  initialDifficulty,
  onConfirmDifficulty,
  onClose,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialDifficulty);

  const difficulties: {
    id: Difficulty;
    title: string;
    questionCount: number;
    distribution: string;
    description: string;
    badgeColor: string;
  }[] = [
    {
      id: 'Easy',
      title: 'Easy Mode',
      questionCount: 10,
      distribution: '2 Tamil · 2 English · 2 Mathematics · 2 Science · 2 Social Science',
      description: 'Comprehensive curriculum exploration across all five academic categories with standard storm pacing.',
      badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    },
    {
      id: 'Medium',
      title: 'Medium Mode',
      questionCount: 3,
      distribution: '1 Tamil · 1 English · 1 Social Science',
      description: 'Accelerated tactical emergency focus covering language synthesis and social science reasoning.',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    },
    {
      id: 'Hard',
      title: 'Hard Mode',
      questionCount: 2,
      distribution: '1 Mathematics · 1 Science (Physics/Chemistry/Bio)',
      description: 'High-stakes scientific and algebraic calculations under rapid storm escalation and heavy wind stress.',
      badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
    },
  ];

  const handleStart = () => {
    soundManager.playSuccess();
    onConfirmDifficulty(selectedDifficulty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Pre-Mission Calibration
              </div>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Select Mission Difficulty Tier
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grade Banner */}
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs font-mono-code">
          <span className="text-neutral-400">Enrolled Student Grade:</span>
          <span className="font-bold text-amber-400">{grade} Curriculum</span>
        </div>

        {/* 3 Difficulty Cards */}
        <div className="flex flex-col gap-3">
          {difficulties.map(d => {
            const isSelected = selectedDifficulty === d.id;

            return (
              <div
                key={d.id}
                onClick={() => {
                  soundManager.playBeep(480, 0.03);
                  setSelectedDifficulty(d.id);
                }}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-neutral-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-neutral-950/60 hover:bg-neutral-800/40 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-100">{d.title}</span>
                    <span className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border ${d.badgeColor}`}>
                      Exactly {d.questionCount} Questions
                    </span>
                  </div>

                  {isSelected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <div className="text-xs text-neutral-300 font-mono-code">
                  Distribution: <span className="text-amber-300">{d.distribution}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-normal">{d.description}</p>
              </div>
            );
          })}
        </div>

        {/* Launch button */}
        <button
          onClick={handleStart}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
        >
          <Play className="w-4 h-4 fill-neutral-950" />
          <span>Launch Storm Survival Mission ({selectedDifficulty})</span>
        </button>
      </div>
    </div>
  );
};
