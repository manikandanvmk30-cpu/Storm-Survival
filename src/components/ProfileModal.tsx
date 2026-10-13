import React, { useState } from 'react';
import { GradeLevel, Difficulty } from '../types/game';
import { soundManager } from '../services/audio';
import { User, GraduationCap, Gauge, Play, X } from 'lucide-react';

interface ProfileModalProps {
  initialName: string;
  initialGrade: GradeLevel;
  initialDifficulty: Difficulty;
  onSaveProfile: (name: string, grade: GradeLevel, difficulty: Difficulty) => void;
  onClose?: () => void;
  isInitialSetup?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  initialName,
  initialGrade,
  initialDifficulty,
  onSaveProfile,
  onClose,
  isInitialSetup = false,
}) => {
  const [name, setName] = useState(initialName || 'Astronaut Cadet');
  const [grade, setGrade] = useState<GradeLevel>(initialGrade || 'Grade 7-8');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty || 'Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    onSaveProfile(name.trim() || 'Astronaut Cadet', grade, difficulty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Cadet Enrollment Form
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                {isInitialSetup ? 'Mission Mars: Mission Briefing' : 'Configure Cadet Profile'}
              </h2>
            </div>
          </div>

          {!isInitialSetup && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Student Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase tracking-wider">
              Student / Commander Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Manikandan, Priya, Alex"
              maxLength={32}
              required
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-neutral-100 text-sm outline-none transition font-sans"
            />
            <p className="text-[11px] text-neutral-400">
              This name will be embossed on your official Certificate of Achievement.
            </p>
          </div>

          {/* Grade Level Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Educational Grade Level:</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'] as GradeLevel[]).map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => {
                    soundManager.playBeep(480, 0.03);
                    setGrade(g);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition cursor-pointer text-center ${
                    grade === g
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/40'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400">
              Calibrates mathematical curriculum and language challenge difficulty.
            </p>
          </div>

          {/* Mission Challenge Difficulty */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-rose-400" />
              <span>Challenge Difficulty Tier:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'High'] as Difficulty[]).map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => {
                    soundManager.playBeep(520, 0.03);
                    setDifficulty(d);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition cursor-pointer text-center ${
                    difficulty === d
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold ring-1 ring-cyan-500/40'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Play className="w-4 h-4 fill-neutral-950" />
              <span>{isInitialSetup ? 'Enter Mars Base Habitat' : 'Save & Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
