import React from 'react';
import { PlayerProfile, Resources, Badge } from '../types/game';
import { getHeroById } from '../data/characters';
import { getRankInfo } from '../data/ranks';
import { soundManager } from '../services/audio';
import {
  Play,
  RotateCcw,
  User,
  Award,
  Crown,
  Gift,
  ShieldCheck,
  History,
  Settings as SettingsIcon,
  LogOut,
  Coins,
  Gem,
  Zap,
  Home,
  Hammer,
} from 'lucide-react';

interface DashboardScreenProps {
  player: PlayerProfile;
  resources: Resources;
  badges: Badge[];
  currentLevel: number;
  hasActiveMission: boolean;
  onStartGame: () => void;
  onContinueGame: () => void;
  onOpenHomeBuilder: () => void;
  onOpenIslandSurvival?: () => void;
  onOpenProfile: () => void;
  onOpenCertifications: () => void;
  onOpenRank: () => void;
  onOpenRewards: () => void;
  onOpenBadges: () => void;
  onOpenQuestionHistory: () => void;
  onOpenSettings: () => void;
  onSaveAndExit: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  player,
  resources,
  badges,
  currentLevel,
  hasActiveMission,
  onStartGame,
  onContinueGame,
  onOpenHomeBuilder,
  onOpenIslandSurvival,
  onOpenProfile,
  onOpenCertifications,
  onOpenRank,
  onOpenRewards,
  onOpenBadges,
  onOpenQuestionHistory,
  onOpenSettings,
  onSaveAndExit,
}) => {
  const hero = getHeroById(player.selectedCharacterId);
  const rankInfo = getRankInfo(player.rank);

  const accuracy =
    player.totalQuestionsAnswered > 0
      ? Math.round((player.totalCorrectAnswers / player.totalQuestionsAnswered) * 100)
      : 100;

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-3xl shadow overflow-hidden">
              {player.avatar.startsWith('data:') ? (
                <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{player.avatar}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display text-neutral-100">{player.name}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-mono-code font-bold border ${rankInfo.badgeColor}`}>
                  {player.rank}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono-code font-bold">
                  LEVEL {currentLevel} / 50
                </span>
              </div>
              <div className="text-xs text-neutral-400 font-mono-code mt-0.5">
                {player.grade} · Speciality: <span className="text-amber-400">{player.speciality}</span> · TAMIL NADU (INDIA)
              </div>
            </div>
          </div>

          {/* Quick Wallet Info */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs font-mono-code">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-300">{player.coins} Coins</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs font-mono-code">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-cyan-300">{player.diamonds} Diamonds</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl text-xs font-mono-code">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-purple-300">{player.xp} XP</span>
            </div>
          </div>
        </header>

        {/* Home Shelter Status & Rebuild Callout Banner */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow">
              {player.homeStructure.level === 0 ? '🏚️' : '🏡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-amber-400 font-bold uppercase">
                  COASTAL HOME RECONSTRUCTION
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono-code">
                  Stage {player.homeStructure.level}/5 Rebuilt
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                {player.homeStructure.level === 0
                  ? 'Home Destroyed by Storm — Rebuild with Rewards!'
                  : `Coastal Haven — Durability: ${player.homeStructure.level * 20}%`}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed font-mono-code">
                Materials: 🪵 Wood: {player.homeMaterials.wood} | 🪢 Rope: {player.homeMaterials.rope} | 💡 Lights: {player.homeMaterials.lights} | 🔌 Electric: {player.homeMaterials.electronics} | 🧱 Bricks: {player.homeMaterials.bricks}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playBeep(640, 0.05);
              onOpenHomeBuilder();
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-2 shadow-md"
          >
            <Hammer className="w-4 h-4" />
            <span>Rebuild My Home</span>
          </button>
        </div>

        {/* Selected Hero Showcase Banner */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow">
              {hero.portrait}
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">{hero.heroTitle} ({hero.name})</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Special Ability: <strong className="text-neutral-200">{hero.abilityName}</strong> — {hero.abilityDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              onOpenProfile();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition cursor-pointer shrink-0"
          >
            Switch Hero
          </button>
        </div>

        {/* Progress Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-1">
            <div className="text-[11px] font-mono-code text-neutral-400 uppercase">50-Level Progress</div>
            <div className="text-base font-bold font-mono-code text-amber-400">
              Level {currentLevel} of 50
            </div>
            <div className="text-[10px] text-neutral-500">
              {player.completedLevels.length} Levels Finished
            </div>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-1">
            <div className="text-[11px] font-mono-code text-neutral-400 uppercase">Questions Solved</div>
            <div className="text-base font-bold font-mono-code text-cyan-400">
              {player.totalCorrectAnswers} / {player.totalQuestionsAnswered}
            </div>
            <div className="text-[10px] text-neutral-500">Accuracy: {accuracy}%</div>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-1">
            <div className="text-[11px] font-mono-code text-neutral-400 uppercase">Consecutive Streak</div>
            <div className="text-base font-bold font-mono-code text-emerald-400">
              {player.consecutiveCorrect} <span className="text-xs font-normal text-neutral-400">(Max: {player.maxConsecutiveStreak})</span>
            </div>
            <div className="text-[10px] text-neutral-500">3 streak = +15 HP, 5 = 1 💎</div>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-1">
            <div className="text-[11px] font-mono-code text-neutral-400 uppercase">Station Tiers</div>
            <div className="text-base font-bold font-mono-code text-rose-400">
              Easy · Medium · Hard
            </div>
            <div className="text-[10px] text-neutral-500">10Q Easy · 3Q Med · 2Q Hard</div>
          </div>
        </div>

        {/* Featured Island Storm Survival Banner */}
        {onOpenIslandSurvival && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-neutral-900 to-neutral-900 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                🏝️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-display text-neutral-100">
                    ISLAND STORM SURVIVAL MODE
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-black uppercase">
                    SIMULATION
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Survive approaching cyclonic storms on an open island map! Manage Health, Hunger, Water, Energy & Shelter strength.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playSuccess();
                onOpenIslandSurvival();
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 shrink-0"
            >
              <Play className="w-4 h-4 fill-neutral-950" />
              <span>LAUNCH SURVIVAL SIMULATION</span>
            </button>
          </div>
        )}

        {/* 10 Dashboard Action Buttons Grid */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider font-semibold">
            Command Operations Deck:
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* 1. Start Game */}
            <button
              onClick={() => {
                soundManager.playSuccess();
                onStartGame();
              }}
              className="p-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Play className="w-6 h-6 fill-neutral-950" />
              <span className="font-bold text-xs">Play Level {currentLevel}</span>
            </button>

            {/* 2. Continue Game */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onContinueGame();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <RotateCcw className="w-6 h-6 text-cyan-400" />
              <span className="font-semibold text-xs">Continue Mission</span>
            </button>

            {/* 3. My Profile */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenProfile();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <User className="w-6 h-6 text-purple-400" />
              <span className="font-semibold text-xs">My Profile</span>
            </button>

            {/* 4. My Certifications */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenCertifications();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <Award className="w-6 h-6 text-amber-400" />
              <span className="font-semibold text-xs">My Certifications</span>
            </button>

            {/* 5. My Rank */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenRank();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="font-semibold text-xs">My Rank</span>
            </button>

            {/* 6. My Rewards */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenRewards();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <Gift className="w-6 h-6 text-rose-400" />
              <span className="font-semibold text-xs">My Rewards</span>
            </button>

            {/* 7. My Badges */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenBadges();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span className="font-semibold text-xs">My Badges ({unlockedBadgesCount}/6)</span>
            </button>

            {/* 8. Question History */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenQuestionHistory();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <History className="w-6 h-6 text-indigo-400" />
              <span className="font-semibold text-xs">Question History</span>
            </button>

            {/* 9. Settings */}
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenSettings();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer hover:border-neutral-700"
            >
              <SettingsIcon className="w-6 h-6 text-slate-400" />
              <span className="font-semibold text-xs">Settings</span>
            </button>

            {/* 10. Save and Exit */}
            <button
              onClick={() => {
                soundManager.playBeep(440, 0.04);
                onSaveAndExit();
              }}
              className="p-4 rounded-xl bg-neutral-900 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 border border-neutral-800 hover:border-rose-800 flex flex-col items-center justify-center gap-2 text-center transition cursor-pointer"
            >
              <LogOut className="w-6 h-6 text-rose-400" />
              <span className="font-semibold text-xs">Save and Exit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
