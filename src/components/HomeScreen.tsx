import React, { useState } from 'react';
import { soundManager } from '../services/audio';
import {
  Play,
  HelpCircle,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Wind,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface HomeScreenProps {
  onPlayGame: () => void;
  onPlaySurvivalMode: () => void;
  onOpenProfile: () => void;
  onOpenLogin?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hasProfile: boolean;
  studentName?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayGame,
  onPlaySurvivalMode,
  onOpenProfile,
  onOpenLogin,
  isMuted,
  onToggleMute,
  hasProfile,
  studentName,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 overflow-hidden bg-neutral-950 text-neutral-100 select-none">
      {/* Background Animated Storm Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-radial from-amber-950/20 via-neutral-950/80 to-neutral-950" />
        {/* Animated wind lines */}
        <div className="absolute -top-10 left-0 w-[200%] h-full opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] animate-radar" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-2 border-b border-neutral-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            🌪️
          </div>
          <span className="font-display font-bold text-sm tracking-wider text-neutral-200">
            STORM SURVIVAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasProfile && (
            <button
              onClick={() => {
                soundManager.playBeep(520, 0.04);
                onOpenProfile();
              }}
              className="text-xs font-mono-code text-neutral-300 hover:text-amber-300 transition cursor-pointer px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800"
            >
              Commander: <span className="font-semibold text-amber-400">{studentName}</span>
            </button>
          )}

          {onOpenLogin && (
            <button
              onClick={() => {
                soundManager.playBeep(440, 0.04);
                onOpenLogin();
              }}
              className="text-xs font-mono-code text-amber-300 hover:text-amber-200 transition cursor-pointer px-2.5 py-1 rounded-md bg-neutral-900 border border-amber-500/30"
              title="Switch Student Cadet Username"
            >
              ⇄ Login
            </button>
          )}

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Hero Title & Primary Action */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto gap-5">
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-semibold uppercase tracking-wider">
          <Wind className="w-3.5 h-3.5 animate-pulse" />
          <span>Coastal Island Survival & Educational Defense</span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-neutral-100">
            ISLAND STORM <span className="text-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">SURVIVAL</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-sans leading-relaxed">
            Survive severe cyclonic storms in coastal Tamil Nadu with your chosen superhero! Explore the island, answer curriculum quizzes from 50 levels before collecting supplies, configure storm time from 1 to 5 minutes, and build a full home with TV, fridge, light switch, ceiling fan, and appliances.
          </p>
        </div>

        {/* Single Unified Game Launcher Card */}
        <div className="w-full max-w-xl pt-2">
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-amber-950/40 via-neutral-900/95 to-neutral-950 border-2 border-amber-500/50 hover:border-amber-400 transition shadow-2xl shadow-amber-500/10 flex flex-col justify-between text-left group">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                  🏝️
                </div>
                <div>
                  <h3 className="text-lg font-black font-display text-white group-hover:text-amber-400 transition">
                    ISLAND STORM & 50-LEVEL ACADEMY
                  </h3>
                  <span className="text-[11px] font-mono-code text-amber-400">
                    Single Unified Game · Spider-Man, Thor & Iron Man
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                ALL-IN-ONE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-4 text-xs text-neutral-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <span>⏱️</span>
                <span>Storm Time: <strong>1 to 5 Mins</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <span>📺</span>
                <span>Home: <strong>TV, Fridge & Lights</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <span>📚</span>
                <span>Quiz: <strong>50 Earth Levels</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <span>🔨</span>
                <span>Build: <strong>Stages 0 to 5 Home</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playSuccess();
                onPlaySurvivalMode();
              }}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xl shadow-amber-500/25 active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-neutral-950" />
              <span>START PLAY (DIRECT TO ISLAND STORM)</span>
            </button>
          </div>
        </div>

        {/* Secondary Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              setShowHowToPlay(true);
            }}
            className="px-3.5 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              setShowTerms(true);
            }}
            className="px-3.5 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Rules & Guide</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(480, 0.04);
              setShowSettings(true);
            }}
            className="px-3.5 py-2 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(320, 0.04);
              if (window.confirm('Exit Storm Survival? Your saved progress is stored locally in browser storage.')) {
                window.location.reload();
              }
            }}
            className="px-3.5 py-2 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-800/80 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl flex items-center justify-between py-3 border-t border-neutral-900 text-xs text-neutral-500 font-mono-code">
        <span>STORM SURVIVAL · EDUCATIONAL EDITION</span>
        <span>GRADES 6–10 · TAMIL · ENGLISH · MATHS · SCIENCE · SOCIAL</span>
      </footer>

      {/* --- MODAL 1: HOW TO PLAY --- */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold font-display text-neutral-100 text-base">How to Play</h3>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-neutral-300 leading-relaxed font-sans">
              <p>
                <strong className="text-amber-400">1. Movement & Stations:</strong> Use WASD, Arrow Keys, or click to move your hero. Walk up to the 3 Simple Stations (Easy, Medium, Hard) or click your Home in the center to rebuild it using earned rewards!
              </p>
              <p>
                <strong className="text-rose-400">2. Resource Survival:</strong> Manage 5 vital resources: Health, Power, Oxygen, Water, and Time. If Health drops to 0% or life support is depleted, the mission fails.
              </p>
              <p>
                <strong className="text-emerald-400">3. Educational Challenges:</strong> Answer grade-specific questions in Tamil, English, Mathematics, Science, and Social Science to restore station calibration and earn rewards.
              </p>
              <p>
                <strong className="text-cyan-400">4. Streak Rewards:</strong>
                <br />• 3 consecutive correct answers = <span className="text-emerald-300 font-bold">+15 Health restored</span>
                <br />• 5 consecutive correct answers = <span className="text-cyan-300 font-bold">+1 Diamond earned</span>
              </p>
              <p>
                <strong className="text-purple-400">5. Strategic Decisions & Teamwork:</strong> Commit strategic interventions to protect base equipment, triage emergencies with your crew, and survive through the final Storm Level 5!
              </p>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer mt-2"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TERMS AND CONDITIONS --- */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold font-display text-neutral-100 text-base">Terms & Conditions</h3>
              </div>
              <button
                onClick={() => setShowTerms(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-neutral-300 leading-relaxed font-sans">
              <p>
                <strong className="text-neutral-100">1. Educational Mission Purpose:</strong> Storm Survival is designed as a curriculum-aligned educational adventure game fostering problem solving, mathematical reasoning, scientific curiosity, language competence, and critical decision-making.
              </p>
              <p>
                <strong className="text-neutral-100">2. Local Storage & Privacy:</strong> All student profiles, save telemetry, badges, and certificates are saved locally on your device in browser JSON storage. No personal data is transmitted to external advertising networks.
              </p>
              <p>
                <strong className="text-neutral-100">3. Fair-Play Rules:</strong> Challenges are balanced without duplicate questions within an attempt. Diamonds may be used for guided hints, but student thought and reasoning guide the path to Earth Legend rank.
              </p>
            </div>

            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer mt-2"
            >
              Accept Terms
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 3: SETTINGS --- */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold font-display text-neutral-100 text-base">Game Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span>Sound & Audio Effects</span>
                <button
                  onClick={onToggleMute}
                  className={`px-3 py-1 rounded-lg font-mono-code font-bold transition cursor-pointer ${
                    isMuted
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isMuted ? 'Muted' : 'Enabled'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span>Visual Storm Vignette & Lightning</span>
                <span className="text-emerald-400 font-mono-code font-semibold">Active</span>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
