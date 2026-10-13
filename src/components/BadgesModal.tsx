import React from 'react';
import { Badge, RankTier } from '../types/game';
import { RANKS, getRankInfo } from '../data/ranks';
import {
  Award,
  Calculator,
  Brain,
  Users,
  Wind,
  Zap,
  ShieldAlert,
  Languages,
  ShieldCheck,
  CheckCircle,
  Home,
  Shield,
} from 'lucide-react';

interface BadgesModalProps {
  badges: Badge[];
  xp: number;
  currentRank: RankTier;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  badges,
  xp,
  currentRank,
  onClose,
}) => {
  const rankInfo = getRankInfo(currentRank);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-400" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-cyan-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'Home':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-purple-400 uppercase tracking-wider font-semibold">
                Service Records & Honors
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Mission Mars: Achievements & Rank Progression
              </h2>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-neutral-400 font-mono-code">TOTAL CAREER XP</div>
            <div className="text-base font-bold font-mono-code text-purple-300">{xp} XP</div>
          </div>
        </div>

        {/* Current Rank Banner */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`px-3 py-1.5 rounded-lg border font-display font-bold text-sm ${rankInfo.badgeColor}`}>
              {currentRank}
            </div>
            <div>
              <div className="font-semibold text-sm text-neutral-200">{rankInfo.title}</div>
              <div className="text-xs text-neutral-400">{rankInfo.description}</div>
            </div>
          </div>

          <div className="text-xs font-mono-code text-amber-300/90 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
            Perk: {rankInfo.perk}
          </div>
        </div>

        {/* Rank Progression Track */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
            Planetary Officer Rank Progression:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {RANKS.map(r => {
              const isAchieved = xp >= r.minXp;
              const isCurrent = r.tier === currentRank;

              return (
                <div
                  key={r.tier}
                  className={`p-2.5 rounded-lg border text-center flex flex-col items-center gap-1 ${
                    isCurrent
                      ? 'bg-neutral-800 border-amber-500 ring-1 ring-amber-500/40'
                      : isAchieved
                      ? 'bg-neutral-950 border-neutral-800 opacity-90'
                      : 'bg-neutral-950/40 border-neutral-900 opacity-40'
                  }`}
                >
                  <span className="text-[10px] font-mono-code font-bold text-neutral-300">
                    {r.tier}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono-code">
                    {r.minXp} XP
                  </span>
                  {isAchieved && (
                    <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
            Mission Badges ({badges.filter(b => b.unlocked).length} / {badges.length} Unlocked):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map(badge => {
              const pct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 transition ${
                    badge.unlocked
                      ? 'bg-neutral-950/80 border-purple-500/40'
                      : 'bg-neutral-950/40 border-neutral-800/80 opacity-70'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${
                      badge.unlocked
                        ? 'bg-purple-950/50 border-purple-500/40 shadow-sm'
                        : 'bg-neutral-900 border-neutral-800'
                    }`}
                  >
                    {getBadgeIcon(badge.icon)}
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-neutral-100">{badge.title}</h4>
                      {badge.unlocked ? (
                        <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                          UNLOCKED
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-code text-neutral-500">
                          {badge.progress} / {badge.maxProgress}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 leading-normal">{badge.description}</p>

                    {/* Progress bar */}
                    {!badge.unlocked && (
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Close Honors
          </button>
        </div>
      </div>
    </div>
  );
};
