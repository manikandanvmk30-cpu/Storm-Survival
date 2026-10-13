import React from 'react';
import { PlayerProfile } from '../types/game';
import { Gift, Sparkles, HeartPulse, Gem, Coins, Zap, Flame, X } from 'lucide-react';

interface RewardsModalProps {
  player: PlayerProfile;
  onClose: () => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({ player, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-rose-400 uppercase tracking-wider font-semibold">
                Honor & Streak Vault
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                My Rewards & Milestones
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

        {/* Streak Highlight Card */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono-code text-neutral-400">ACTIVE CONSECUTIVE STREAK</div>
              <div className="text-xl font-bold font-mono-code text-orange-400">
                {player.consecutiveCorrect} Questions
              </div>
            </div>
          </div>

          <div className="text-right text-xs font-mono-code text-neutral-400">
            <div>All-Time Best:</div>
            <div className="text-neutral-200 font-bold text-sm">{player.maxConsecutiveStreak} Streak</div>
          </div>
        </div>

        {/* Streak Rules & Status */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono-code text-neutral-400 uppercase font-semibold">
            Consecutive Streak Milestones:
          </h3>

          {/* 3-streak rule */}
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-800 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-200">3 Consecutive Correct Answers</span>
                <span className="text-[10px] font-mono-code text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  +15 Health Restored
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Restores +15 Health (capped at 100%) and triggers emergency triage adrenaline boost.
              </p>
            </div>
          </div>

          {/* 5-streak rule */}
          <div className="p-3.5 bg-neutral-950/80 border border-neutral-800 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-950/50 text-cyan-400 border border-cyan-800 shrink-0">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-neutral-200">5 Consecutive Correct Answers</span>
                <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  +1 Diamond Awarded
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Awards +1 Diamond to spend on tactical intelligence hints during critical decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Currency Totals */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
            <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 font-mono-code">TOTAL XP</div>
            <div className="text-sm font-bold font-mono-code text-purple-300">{player.xp}</div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
            <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 font-mono-code">TOTAL COINS</div>
            <div className="text-sm font-bold font-mono-code text-yellow-300">{player.coins}</div>
          </div>

          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
            <Gem className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-[10px] text-neutral-400 font-mono-code">DIAMONDS</div>
            <div className="text-sm font-bold font-mono-code text-cyan-300">{player.diamonds}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
