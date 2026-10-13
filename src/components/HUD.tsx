import React from 'react';
import { Resources, StormLevel, RankTier, HomeMaterials } from '../types/game';
import { soundManager } from '../services/audio';
import {
  Heart,
  Zap,
  Wind,
  Droplets,
  Clock,
  Coins,
  Gem,
  Award,
  Volume2,
  VolumeX,
  Home,
  Store,
  Users,
  Code,
  Save,
  HelpCircle,
} from 'lucide-react';

interface HUDProps {
  resources: Resources;
  stormLevel: StormLevel;
  currentLevel: number;
  homeMaterials: HomeMaterials;
  coins: number;
  diamonds: number;
  xp: number;
  rank: RankTier;
  playerName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHomeBuilder: () => void;
  onOpenShop: () => void;
  onOpenTeam: () => void;
  onOpenBadges: () => void;
  onOpenPythonCode: () => void;
  onOpenSave: () => void;
  onOpenHelp: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  resources,
  stormLevel,
  currentLevel,
  homeMaterials,
  coins,
  diamonds,
  xp,
  rank,
  playerName,
  isMuted,
  onToggleMute,
  onOpenHomeBuilder,
  onOpenShop,
  onOpenTeam,
  onOpenBadges,
  onOpenPythonCode,
  onOpenSave,
  onOpenHelp,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const stormLevelNames = [
    'Level 1: Tropical Gale Advisory',
    'Level 2: Severe Squall Alert',
    'Level 3: Cyclonic Storm Warning',
    'Level 4: Very Severe Cyclone',
    'Level 5: Super Cyclonic Landfall',
  ];

  const stormColors = [
    'text-amber-400 border-amber-500/40 bg-amber-950/20',
    'text-orange-400 border-orange-500/40 bg-orange-950/20',
    'text-rose-400 border-rose-500/40 bg-rose-950/20',
    'text-red-500 border-red-500/50 bg-red-950/30',
    'text-purple-400 border-purple-500/60 bg-purple-950/40 animate-pulse',
  ];

  return (
    <header className="w-full flex flex-col gap-3">
      {/* Top Bar: Commander info, Level progress, Storm countdown alert, and Quick Action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-2.5 backdrop-blur-md">
        {/* Commander badge & rank */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-display text-lg text-amber-400">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-sm tracking-wide text-neutral-100">
                {playerName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-mono-code font-medium border border-neutral-700">
                {rank}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono-code font-bold border border-emerald-500/30">
                LEVEL {currentLevel} / 50
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-mono-code">
              XP: <span className="text-neutral-200 font-semibold">{xp}</span> · STORM SURVIVAL (TAMIL NADU)
            </div>
          </div>
        </div>

        {/* Storm Status & Countdown */}
        <div className="flex items-center gap-4 bg-neutral-950/80 border border-neutral-800 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <div className="text-[10px] tracking-wider text-neutral-400 font-mono-code uppercase">
                Storm Window
              </div>
              <div className="text-base font-bold font-mono-code text-amber-400">
                {formatTime(resources.timeSeconds)}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-neutral-800" />

          <div>
            <div className="text-[10px] tracking-wider text-neutral-400 font-mono-code uppercase">
              Storm Intensity
            </div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded border ${stormColors[stormLevel - 1]}`}>
              {stormLevelNames[stormLevel - 1]}
            </div>
          </div>
        </div>

        {/* Currency & Home Materials Summary */}
        <div className="flex items-center gap-2">
          {/* Home Builder Quick Button */}
          <button
            onClick={() => {
              soundManager.playBeep(640, 0.05);
              onOpenHomeBuilder();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition cursor-pointer"
            title="Open Home Reconstruction Workshop"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Rebuild Home</span>
            <span className="text-[10px] font-mono-code bg-amber-950 px-1 rounded">
              🪵{homeMaterials.wood} 🪢{homeMaterials.rope}
            </span>
          </button>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs font-mono-code">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-semibold text-yellow-300">{coins}</span>
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs font-mono-code">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-cyan-300">{diamonds}</span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => {
              soundManager.playBeep(520, 0.05);
              onOpenShop();
            }}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Open Supplies Shop (Health Kits)"
          >
            <Store className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(580, 0.05);
              onOpenTeam();
            }}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Team & Crew Triage"
          >
            <Users className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(640, 0.05);
              onOpenBadges();
            }}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition cursor-pointer"
            title="View Achievements & Badges"
          >
            <Award className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(480, 0.05);
              onOpenPythonCode();
            }}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Python / Pygame Source Code & Documentation"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(420, 0.05);
              onOpenSave();
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition cursor-pointer"
            title="Save / Export Game Progress"
          >
            <Save className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(420, 0.05);
              onOpenHelp();
            }}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition cursor-pointer"
            title="Survival Guide & Rules"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleMute}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Resource Gauges: Health, Power, Oxygen, Water */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Health */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>Commander Health</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-rose-300">
              {Math.round(resources.health)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                resources.health > 50
                  ? 'bg-rose-500'
                  : resources.health > 25
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-600 animate-ping'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, resources.health))}%` }}
            />
          </div>
        </div>

        {/* Power */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Electricity & Power</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-amber-300">
              {Math.round(resources.power)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, resources.power))}%` }}
            />
          </div>
        </div>

        {/* Oxygen / Air Filter */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-cyan-300">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clean Air & Oxygen</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-cyan-300">
              {Math.round(resources.oxygen)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, resources.oxygen))}%` }}
            />
          </div>
        </div>

        {/* Water */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 backdrop-blur-md">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-300">
              <Droplets className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              <span>Clean Water Reserve</span>
            </div>
            <span className="text-xs font-mono-code font-bold text-blue-300">
              {Math.round(resources.water)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, resources.water))}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
