import React, { useState } from 'react';
import { soundManager } from '../services/audio';
import { HEROES } from '../data/characters';
import {
  User,
  ArrowRight,
  Shield,
  Zap,
  Home,
  Tv,
  Wind,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface LoginScreenProps {
  initialUsername?: string;
  onLogin: (username: string, selectedHeroId?: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialUsername = '',
  onLogin,
  isMuted,
  onToggleMute,
}) => {
  const [username, setUsername] = useState<string>(initialUsername || 'Manikandan');
  const [selectedHeroId, setSelectedHeroId] = useState<string>('hero_spiderman');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const quickPresets = [
    'Manikandan',
    'Tony Stark',
    'Thor Odinson',
    'Peter Parker',
    'Cyber Cadet',
    'Storm Guardian',
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your username to enter the simulation!');
      soundManager.playFailure();
      return;
    }
    if (trimmed.length < 2) {
      setErrorMessage('Username must be at least 2 characters long.');
      soundManager.playFailure();
      return;
    }
    setErrorMessage('');
    soundManager.playSuccess();
    onLogin(trimmed, selectedHeroId);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-neutral-950 text-neutral-100 select-none overflow-x-hidden">
      {/* Background Ambience & Storm Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-3 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-lg shadow-amber-500/10">
            🌪️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-sm tracking-wider text-white">
                STORM SURVIVAL ACADEMY
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code text-[10px] font-bold">
                SIMULATION v3.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              50-Level Tamil Nadu Disaster Science & Superhero Expedition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Login Hero Content */}
      <main className="relative z-10 w-full max-w-4xl my-auto py-8 flex flex-col items-center gap-8">
        {/* Title & Badge */}
        <div className="text-center flex flex-col items-center gap-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono-code font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span>STUDENT SIMULATION ACCESS PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Enter the Island <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400">Storm Survival</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
            Scavenge supply caches, wire and operate home appliances, brave 30-second category-5 cyclones, and advance through 50 academy levels!
          </p>
        </div>

        {/* The Login Card: Username Only Form */}
        <div className="w-full max-w-md bg-neutral-900/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 backdrop-blur-xl flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username-input" className="text-xs font-bold text-neutral-200 font-display flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  CADET / STUDENT USERNAME
                </span>
                <span className="text-[10px] text-amber-400 font-mono-code">Required</span>
              </label>

              <div className="relative">
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={e => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter your name (e.g. Manikandan)"
                  autoFocus
                  maxLength={24}
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 text-neutral-100 text-sm font-semibold placeholder:text-neutral-500 transition-all outline-none"
                />
                {username.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUsername('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs px-2 py-1 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400 font-medium mt-0.5">
                  ⚠️ {errorMessage}
                </p>
              )}
            </div>

            {/* Quick-Pick Handles / Presets for Students */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 font-mono-code uppercase font-semibold">
                Quick Choose Handle:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setUsername(preset);
                      setErrorMessage('');
                      soundManager.playBeep(440, 0.04);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono-code transition cursor-pointer ${
                      username === preset
                        ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                        : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit & Enter Button */}
            <button
              type="submit"
              className="w-full mt-2 py-4 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black rounded-2xl text-base transition-all cursor-pointer shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 tracking-wide font-display"
            >
              <span>Enter Island Simulation</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </form>

          {/* Guarantee / Student Assurance */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-around text-[11px] font-mono-code text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant Play
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Compass className="w-3.5 h-3.5" /> Live 2D Physics
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-3.5 h-3.5" /> 50 Levels
            </span>
          </div>
        </div>

        {/* Feature Highlights Grid to Attract Students */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl text-left">
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-base">
              🌪️
            </div>
            <h4 className="font-bold text-xs text-white font-display">30-Second Storms</h4>
            <p className="text-[11px] text-neutral-400 leading-tight">
              Gale winds, flying debris, and lightning. Seek shelter in your reinforced home!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
              <Home className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white font-display">Rebuild & Appliances</h4>
            <p className="text-[11px] text-neutral-400 leading-tight">
              Interactive Smart TV, Fridge snacks, Wall Light Switch, Ceiling Fan, and Microwave!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-base">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white font-display">Superhero Powers</h4>
            <p className="text-[11px] text-neutral-400 leading-tight">
              Play as Spider-Man, Thor, Iron Man, Captain America, or Black Panther with [Q] abilities.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
              <Trophy className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-white font-display">Level Promotion</h4>
            <p className="text-[11px] text-neutral-400 leading-tight">
              Build 5 homes and rescue 2 times to rank up, unlock custom badges, and conquer 50 levels!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl text-center py-2 text-xs font-mono-code text-neutral-500 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>🎓 Tamil Nadu Disaster Preparedness & STEM Science Curriculum</span>
        <span>Secure Local Session · No Password Required</span>
      </footer>
    </div>
  );
};
