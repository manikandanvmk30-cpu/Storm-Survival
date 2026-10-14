import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { getHeroById } from '../data/characters';
import { getRankInfo } from '../data/ranks';
import { soundManager } from '../services/audio';
import {
  Play,
  LayoutDashboard,
  User,
  Award,
  LogOut,
  Home as HomeIcon,
  Hammer,
  Tv,
  Wind,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Coins,
  Gem,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileText,
  Radio,
} from 'lucide-react';

interface HomeScreenProps {
  player: PlayerProfile;
  currentLevel: number;
  onPlayGame: () => void;
  onPlaySurvivalMode: () => void;
  onOpenDashboard: () => void;
  onOpenProfile: () => void;
  onOpenCertifications: () => void;
  onOpenHomeBuilder: () => void;
  onLogout: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const HOME_STAGE_NAMES: Record<number, { name: string; icon: string; desc: string }> = {
  0: {
    name: 'Destroyed Ruins',
    icon: '🏚️',
    desc: 'Shelter leveled by severe cyclone winds. Gather wood, rope, and bricks to rebuild!',
  },
  1: {
    name: 'Reinforced Foundation',
    icon: '🪵',
    desc: 'Concrete footings and treated timber anchored to bedrock to withstand water surge.',
  },
  2: {
    name: 'Pillars & Braced Frame',
    icon: '🏗️',
    desc: 'Heavy vertical teak columns with cross-diagonal wind bracing and tie rods.',
  },
  3: {
    name: 'Walls & Storm Roof',
    icon: '🏠',
    desc: 'Solid brickwork masonry with bolted cyclone-resistant corrugated composite roofing.',
  },
  4: {
    name: 'Electrics & Solar Inverter',
    icon: '⚡',
    desc: '12V DC battery backup, pure sine-wave inverter, and LED lighting circuit wired.',
  },
  5: {
    name: 'Storm-Proof Coastal Sanctuary',
    icon: '🏰',
    desc: '100% storm-proof fortress equipped with TV, fridge, ceiling fan, microwave, and sofa!',
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  player,
  currentLevel,
  onPlayGame: _onPlayGame,
  onPlaySurvivalMode,
  onOpenDashboard,
  onOpenProfile,
  onOpenCertifications,
  onOpenHomeBuilder,
  onLogout,
  isMuted,
  onToggleMute,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const hero = getHeroById(player.selectedCharacterId);
  const rankInfo = getRankInfo(player.rank);
  const stageInfo = HOME_STAGE_NAMES[player.homeStructure.level] || HOME_STAGE_NAMES[0];
  const durabilityPct = Math.min(100, Math.max(0, (player.homeStructure.level / 5) * 100));

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-x-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* Background Animated Storm Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Top Navbar: Brand, Core Navigation Tabs, Audio, and Logout */}
      <header className="relative z-10 w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 py-3 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-lg shadow-amber-500/10">
            🌪️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-sm tracking-wider text-white">
                STORM SURVIVAL ACADEMY
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code text-[10px] font-bold">
                HOME
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              50-Level Tamil Nadu Disaster Science & Coastal Defense
            </p>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {/* Active Home Tab */}
          <button
            onClick={() => soundManager.playBeep(520, 0.04)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs shadow-md transition cursor-pointer font-display"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* My Dashboard Button */}
          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              onOpenDashboard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold transition cursor-pointer"
            title="Open My Dashboard (Stats, Objectives & Crew)"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>My Dashboard</span>
          </button>

          {/* My Profile Button */}
          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold transition cursor-pointer"
            title="Open My Profile (Cadet Info & Character)"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>My Profile</span>
          </button>

          {/* My Certifications Button */}
          <button
            onClick={() => {
              soundManager.playSuccess();
              onOpenCertifications();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 border border-neutral-800 text-xs font-semibold transition cursor-pointer"
            title="Open My Certifications (Official Certificate)"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Certifications</span>
          </button>
        </nav>

        {/* Right Action Icons: Audio Toggle & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              soundManager.playBeep(320, 0.04);
              setShowLogoutConfirm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-semibold transition cursor-pointer"
            title="Logout and switch Cadet Username"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Home Content */}
      <main className="relative z-10 w-full max-w-6xl my-4 flex flex-col gap-5">
        {/* Cadet Welcome Banner & Summary Chips */}
        <div className="w-full p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow-inner">
              {player.avatar.startsWith('data:') ? (
                <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span>{player.avatar || '👨‍🚀'}</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono-code text-amber-400 font-bold uppercase tracking-wider">
                  Active Cadet
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono-code font-bold border ${rankInfo.badgeColor}`}>
                  {player.rank}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code font-bold">
                  LEVEL {currentLevel} / 50
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
                Welcome, Cadet {player.name}!
              </h1>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                {player.grade} · Speciality: <span className="text-amber-400 font-medium">{player.speciality}</span> · Defender: <span className="text-emerald-400 font-medium">{hero.name}</span>
              </p>
            </div>
          </div>

          {/* Wallet Badges: Coins, Diamonds, XP */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-xs font-mono-code">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-300">{player.coins} Coins</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-xs font-mono-code">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-cyan-300">{player.diamonds} Diamonds</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-xs font-mono-code">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-purple-300">{player.xp} XP</span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN FEATURED SECTION:
            LEFT: NORMAL HOME WITH ALL NEEDED FEATURES
            RIGHT: SIMULATION LAUNCHER & 50-LEVEL ACADEMY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ========================================================
              LEFT COLUMN: NORMAL HOME WITH NEEDED FEATURES (7 COLS)
              ======================================================== */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/90 border-2 border-amber-500/40 backdrop-blur-xl shadow-2xl flex flex-col gap-4">
              {/* Home Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                    {stageInfo.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-code text-amber-400 font-bold uppercase tracking-wider">
                        COASTAL HOME WORKSHOP
                      </span>
                      <span className="px-2 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono-code text-[10px] font-bold">
                        Stage {player.homeStructure.level} of 5
                      </span>
                    </div>
                    <h2 className="text-lg font-black font-display text-white">
                      {stageInfo.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playBeep(640, 0.04);
                    onOpenHomeBuilder();
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Hammer className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Rebuild Home</span>
                </button>
              </div>

              {/* Home Description & Durability Bar */}
              <div className="flex flex-col gap-2">
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {stageInfo.desc}
                </p>

                <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Shelter Integrity & Weather-Proofing</span>
                    </span>
                    <span className="font-bold text-emerald-400">{durabilityPct}% Strong</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${durabilityPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Home Materials Stock */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase font-semibold flex items-center justify-between">
                  <span>Home Building Materials Stock:</span>
                  <span className="text-amber-400">Earned via Quiz & Island Scavenging</span>
                </span>
                <div className="grid grid-cols-5 gap-2">
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center">
                    <span className="text-lg">🪵</span>
                    <span className="text-[10px] text-neutral-400">Wood</span>
                    <strong className="text-xs font-mono-code text-amber-300 mt-0.5">
                      {player.homeMaterials.wood}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center">
                    <span className="text-lg">🪢</span>
                    <span className="text-[10px] text-neutral-400">Rope</span>
                    <strong className="text-xs font-mono-code text-yellow-300 mt-0.5">
                      {player.homeMaterials.rope}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center">
                    <span className="text-lg">💡</span>
                    <span className="text-[10px] text-neutral-400">Lights</span>
                    <strong className="text-xs font-mono-code text-yellow-300 mt-0.5">
                      {player.homeMaterials.lights}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center">
                    <span className="text-lg">⚡</span>
                    <span className="text-[10px] text-neutral-400">Electric</span>
                    <strong className="text-xs font-mono-code text-cyan-300 mt-0.5">
                      {player.homeMaterials.electronics}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center text-center">
                    <span className="text-lg">🧱</span>
                    <span className="text-[10px] text-neutral-400">Bricks</span>
                    <strong className="text-xs font-mono-code text-rose-300 mt-0.5">
                      {player.homeMaterials.bricks}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Living Room & Smart Home Appliances Preview */}
              <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
                <span className="text-[11px] font-mono-code text-sky-400 uppercase font-semibold flex items-center justify-between">
                  <span>Home Living Room & Smart Appliances:</span>
                  <span className="text-neutral-500 font-normal">Active in Simulation</span>
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">📺</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Smart TV</span>
                    <span className="text-[9px] text-sky-400 font-mono-code">Weather Radar</span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">🧊</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Fridge</span>
                    <span className="text-[9px] text-cyan-400 font-mono-code">Water & Snacks</span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">💡</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Wall Switch</span>
                    <span className="text-[9px] text-amber-400 font-mono-code">Lights Grid</span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">🌀</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Ceiling Fan</span>
                    <span className="text-[9px] text-emerald-400 font-mono-code">Cooling Air</span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">♨️</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Microwave</span>
                    <span className="text-[9px] text-rose-400 font-mono-code">Hot Meals</span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-sky-500/30 flex flex-col items-center text-center">
                    <span className="text-xl">🛋️</span>
                    <span className="text-[10px] font-bold text-neutral-200 mt-0.5">Comfy Sofa</span>
                    <span className="text-[9px] text-purple-400 font-mono-code">100% Energy</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================
              RIGHT COLUMN: DIRECT SIMULATION LAUNCH & SETTINGS (5 COLS)
              ======================================================== */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            {/* Primary Simulation Launcher Card */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-950 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/15 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="font-display font-black text-white text-base">
                      ISLAND STORM EXPEDITION
                    </h3>
                    <p className="text-[11px] text-amber-400 font-mono-code">
                      Real-Time 2D Coastal Survival Simulation
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-code text-[10px] font-bold uppercase">
                  READY
                </span>
              </div>

              {/* Simulation Highlights Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Cyclone Duration</span>
                    <strong className="text-neutral-100 font-bold">30 Seconds</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Total Mission Time</span>
                    <strong className="text-neutral-100 font-bold">5 Minutes</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Curriculum Quizzes</span>
                    <strong className="text-neutral-100 font-bold">7 Questions / Level</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Level Promotion</span>
                    <strong className="text-neutral-100 font-bold">5 Homes + 2 Rescues</strong>
                  </div>
                </div>
              </div>

              {/* Active Superhero Callout */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl shrink-0">
                  {hero.portrait}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{hero.name}</span>
                    <span className="text-emerald-400 font-mono-code text-[10px]">Ability [Q]</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {hero.abilityName}: {hero.abilityDescription}
                  </p>
                </div>
              </div>

              {/* Big Enter Simulation Button */}
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onPlaySurvivalMode();
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black rounded-2xl text-base flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xl shadow-amber-500/25 active:scale-98 tracking-wide font-display"
              >
                <Play className="w-5 h-5 fill-neutral-950" />
                <span>ENTER ISLAND SIMULATION</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              {/* Daily Missions Quick Peek */}
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onOpenDashboard();
                }}
                className="w-full p-3 rounded-2xl bg-neutral-950/80 hover:bg-neutral-900 border border-amber-500/30 hover:border-amber-400/60 text-left flex items-center justify-between gap-3 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-base shrink-0">
                    🎯
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300">
                        Daily Rotating Missions
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold">
                        BONUS
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400">
                      Earn bonus coins & XP on Dashboard with fresh daily tasks!
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition shrink-0" />
              </button>
            </div>
          </section>
        </div>

        {/* 4 CORE NAVIGATION ACTION CARDS (Dashboard, Profile, Certifications, Logout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card 1: My Dashboard */}
          <button
            onClick={() => {
              soundManager.playBeep(520, 0.04);
              onOpenDashboard();
            }}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-800 hover:border-cyan-500/50 text-left flex flex-col justify-between gap-3 transition cursor-pointer shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code text-cyan-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-300 transition">
                My Dashboard
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Track rotating Daily Missions, full 50-level academy map, resource health & power meters, and analytics.
              </p>
            </div>
          </button>

          {/* Card 2: My Profile */}
          <button
            onClick={() => {
              soundManager.playBeep(520, 0.04);
              onOpenProfile();
            }}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-800 hover:border-amber-500/50 text-left flex flex-col justify-between gap-3 transition cursor-pointer shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code text-amber-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-white text-base group-hover:text-amber-300 transition">
                My Profile
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Configure grade level (6–10), student speciality, superhero avatar, and inspect unlocked rank tiers.
              </p>
            </div>
          </button>

          {/* Card 3: My Certifications */}
          <button
            onClick={() => {
              soundManager.playSuccess();
              onOpenCertifications();
            }}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-neutral-800 hover:border-emerald-500/50 text-left flex flex-col justify-between gap-3 transition cursor-pointer shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code text-emerald-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                View <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-300 transition">
                My Certifications
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                View, download, and print your verified Tamil Nadu Disaster Preparedness & STEM Science Certificate.
              </p>
            </div>
          </button>

          {/* Card 4: Logout / Switch Cadet */}
          <button
            onClick={() => {
              soundManager.playBeep(320, 0.04);
              setShowLogoutConfirm(true);
            }}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/90 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-500/50 text-left flex flex-col justify-between gap-3 transition cursor-pointer shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code text-rose-400 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Exit <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-white text-base group-hover:text-rose-300 transition">
                Logout Session
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Save current progress and safely sign out to the login page to switch cadet username.
              </p>
            </div>
          </button>
        </div>

        {/* Secondary Info Bar: Quick Rules & Guidelines */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 font-mono-code">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Tamil Nadu Disaster Management & IMD Coastal Preparedness Simulation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>How to Play</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setShowRules(true)}
              className="text-neutral-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Rules & Curriculum</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between py-3 border-t border-neutral-900 text-xs text-neutral-500 font-mono-code gap-2">
        <span>STORM SURVIVAL ACADEMY · EDUCATIONAL SIMULATION v3.2</span>
        <span>GRADES 6–10 · TAMIL · ENGLISH · MATHS · SCIENCE · SOCIAL SCIENCE</span>
      </footer>

      {/* --- LOGOUT CONFIRMATION MODAL --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-2xl mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold font-display text-white text-lg">
                Logout & Switch Cadet?
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Your progress as <strong>{player.name}</strong> (Level {currentLevel}, {player.rank} rank, and home materials) is preserved in browser storage.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-rose-600/30"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HOW TO PLAY MODAL --- */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold font-display text-neutral-100 text-base">
                  How to Play Island Storm Survival
                </h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-neutral-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-amber-400 block mb-1">1. Island Scavenging & Quizzes:</strong>
                Move using WASD, Arrow Keys, or mouse clicking. Approach supply caches and answer curriculum questions (Tamil, English, Maths, Science, Social) to unlock supplies.
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-rose-400 block mb-1">2. 30-Second Cyclones:</strong>
                When the 30-second storm warning sounds, retreat inside your home shelter! Staying outside causes severe gale damage.
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-emerald-400 block mb-1">3. Level Promotion:</strong>
                Build 5 homes and successfully rescue from the storm 2 times to trigger instant level promotion, rank promotion, and 5 exclusive badges!
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-sky-400 block mb-1">4. Smart Home Living Room:</strong>
                Press [H] or interact with home appliances: watch cyclone radar on TV, drink cold water from the fridge, and rest on the sofa for 100% energy.
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* --- RULES & CURRICULUM MODAL --- */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold font-display text-neutral-100 text-base">
                  Rules & Curriculum Standards
                </h3>
              </div>
              <button
                onClick={() => setShowRules(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-neutral-300 leading-relaxed">
              <p>
                • <strong>7 Questions per Level:</strong> Each level features 7 distinct curriculum questions covering Tamil, English, Mathematics, Science, Social Science, Cyclone Safety, and Circuits/Tech.
              </p>
              <p>
                • <strong>Zero Repetitions:</strong> Questions from one level never repeat in the next level across all 50 levels.
              </p>
              <p>
                • <strong>5-Minute Playing Time:</strong> The total island expedition session runs for 5 minutes (300 seconds), providing ample time to salvage, wire appliances, and fortify shelters.
              </p>
              <p>
                • <strong>Academic Certification:</strong> Solving challenges earns verifiable completion certificates stamped with your student rank and score.
              </p>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
