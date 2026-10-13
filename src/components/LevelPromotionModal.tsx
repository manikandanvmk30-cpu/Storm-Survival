import React from 'react';
import { RankTier } from '../types/game';
import { getRankInfo } from '../data/ranks';
import {
  Award,
  Sparkles,
  Shield,
  Home,
  Wind,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trophy,
  ChevronRight,
  Flame,
} from 'lucide-react';

export interface UnlockedBadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface LevelPromotionModalProps {
  previousLevel: number;
  newLevel: number;
  homesBuilt: number;
  stormRescues: number;
  oldRank: RankTier;
  newRank: RankTier;
  badgesAwarded: UnlockedBadgeItem[];
  rewards: {
    xp: number;
    coins: number;
    diamonds: number;
  };
  heroName: string;
  heroPortrait: string;
  onContinueNextLevel: () => void;
  onViewAllBadges: () => void;
  onClose: () => void;
}

export const LevelPromotionModal: React.FC<LevelPromotionModalProps> = ({
  previousLevel,
  newLevel,
  homesBuilt,
  stormRescues,
  oldRank,
  newRank,
  badgesAwarded,
  rewards,
  heroName,
  heroPortrait,
  onContinueNextLevel,
  onViewAllBadges,
  onClose,
}) => {
  const rankInfo = getRankInfo(newRank);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      default:
        return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-neutral-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Glow Header Banner */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-emerald-500/30 border-2 border-amber-400/80 flex items-center justify-center shadow-xl shadow-amber-500/20 animate-bounce">
              <Trophy className="w-10 h-10 text-yellow-300 fill-yellow-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 text-2xl">{heroPortrait}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono-code font-bold tracking-wider uppercase mt-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            PROMOTION UNLOCKED!
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            PROMOTED TO LEVEL {newLevel}!
          </h2>
          <p className="text-xs text-neutral-300 max-w-md">
            Outstanding leadership by <strong className="text-amber-400">{heroName}</strong>! You satisfied the
            island criteria by constructing <strong className="text-emerald-400">{homesBuilt} Homes</strong> and
            achieving <strong className="text-cyan-400">{stormRescues} Storm Rescues</strong>!
          </p>
        </div>

        {/* Promotion Criteria Achievement Summary */}
        <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/90 border border-emerald-500/30">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">Goal 1: Homes Built</div>
              <div className="text-sm font-black text-emerald-400 font-mono-code flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {homesBuilt} / 5 Done!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/90 border border-cyan-500/30">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 uppercase font-bold">Goal 2: Storm Rescues</div>
              <div className="text-sm font-black text-cyan-400 font-mono-code flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                {stormRescues} / 2 Rescued!
              </div>
            </div>
          </div>
        </div>

        {/* RANK ADVANCEMENT CARD */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 via-amber-950/30 to-neutral-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shrink-0">
              🎖️
            </div>
            <div>
              <div className="text-[11px] text-amber-300 font-mono-code uppercase font-bold">
                RANK PROMOTED: {oldRank} → {newRank}
              </div>
              <div className="text-base font-bold text-white font-display">
                {rankInfo.title}
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {rankInfo.description}
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono-code font-bold shrink-0">
            Perk: {rankInfo.perk}
          </div>
        </div>

        {/* BADGES AWARDED SECTION */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 font-display flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              NEW BADGES EARNED ({badgesAwarded.length})
            </span>
            <button
              onClick={onViewAllBadges}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-mono-code transition cursor-pointer flex items-center gap-0.5"
            >
              All Badges <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {badgesAwarded.map(badge => (
              <div
                key={badge.id}
                className="p-3 rounded-xl bg-neutral-950/70 border border-amber-500/30 flex items-start gap-2.5"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 truncate">
                      {badge.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold">
                      NEW
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BONUS REWARDS STRIP */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-around text-xs font-mono-code">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span>✨</span>
            <span>+{rewards.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-400">
            <span>🪙</span>
            <span>+{rewards.coins} Coins</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span>💎</span>
            <span>+{rewards.diamonds} Diamonds</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span>🛠️</span>
            <span>Refilled Materials</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={onContinueNextLevel}
            className="w-full sm:flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>Launch Level {newLevel} Defense</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Stay on Island
          </button>
        </div>
      </div>
    </div>
  );
};
