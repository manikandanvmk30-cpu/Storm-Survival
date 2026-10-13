import React, { useState } from 'react';
import { PlayerProfile, GradeLevel, SpecialitySubject, Gender } from '../types/game';
import { HEROES, getHeroById } from '../data/characters';
import { soundManager } from '../services/audio';
import {
  User,
  GraduationCap,
  BookOpen,
  Sparkles,
  Save,
  ArrowLeft,
  Upload,
  Check,
  Shield,
} from 'lucide-react';

interface ProfileScreenProps {
  profile: PlayerProfile;
  onSaveProfile: (updated: Partial<PlayerProfile>) => void;
  onBackToHome: () => void;
  onProceedToDashboard: () => void;
  isFirstTimeCreation?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onSaveProfile,
  onBackToHome,
  onProceedToDashboard,
  isFirstTimeCreation = false,
}) => {
  const [name, setName] = useState(profile.name || 'Cadet');
  const [grade, setGrade] = useState<GradeLevel>(profile.grade || 'Grade 7');
  const [speciality, setSpeciality] = useState<SpecialitySubject>(profile.speciality || 'Mathematics');
  const [gender, setGender] = useState<Gender>(profile.gender || 'Prefer not to say');
  const [selectedCharacterId, setSelectedCharacterId] = useState(profile.selectedCharacterId || 'hero_thunder');
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar || '👨‍🚀');
  const [isEditing, setIsEditing] = useState<boolean>(isFirstTimeCreation);
  const [saveToast, setSaveToast] = useState(false);

  const selectedHero = getHeroById(selectedCharacterId);

  const AVATAR_PRESETS = ['👨‍🚀', '👩‍🚀', '⚡', '🛡️', '💠', '🕸️', '👤', '🐾', '🏹', '🔮'];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size exceeds 2MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = evt => {
      if (typeof evt.target?.result === 'string') {
        setAvatarPreview(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    onSaveProfile({
      name: name.trim() || 'Cadet',
      grade,
      speciality,
      gender,
      selectedCharacterId,
      avatar: avatarPreview,
    });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);

    if (isFirstTimeCreation) {
      onProceedToDashboard();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 sm:p-6 bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <button
            onClick={() => {
              soundManager.playBeep(440, 0.04);
              onBackToHome();
            }}
            className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
              Rank: {profile.rank}
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b border-neutral-800 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar circle */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-neutral-950 border-2 border-amber-500/60 flex items-center justify-center text-4xl shadow-inner overflow-hidden">
                  {avatarPreview.startsWith('data:') ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatarPreview}</span>
                  )}
                </div>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold font-display text-neutral-100">{name}</h2>
                <div className="text-xs font-mono-code text-neutral-400 mt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span>{grade}</span>
                  <span>·</span>
                  <span className="text-amber-400">{speciality} Speciality</span>
                  <span>·</span>
                  <span className="text-neutral-500">{gender}</span>
                </div>
                <div className="text-xs text-neutral-300 mt-2 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span className="text-amber-400">Chosen Hero:</span>
                  <span className="font-semibold text-neutral-100">{selectedHero.heroTitle}</span>
                  <span className="text-neutral-500">({selectedHero.name})</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-neutral-200 text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playBeep(520, 0.04);
                  onProceedToDashboard();
                }}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {saveToast && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Student profile successfully updated and saved locally!</span>
            </div>
          )}

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase">
                    Student Full Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={32}
                    required
                    className="px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-sm text-neutral-100 outline-none"
                    placeholder="Enter student name"
                  />
                </div>

                {/* Grade Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Grade Level:</span>
                  </label>
                  <select
                    value={grade}
                    onChange={e => setGrade(e.target.value as GradeLevel)}
                    className="px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-sm text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>

                {/* Speciality Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Speciality Subject:</span>
                  </label>
                  <select
                    value={speciality}
                    onChange={e => setSpeciality(e.target.value as SpecialitySubject)}
                    className="px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-sm text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science (Physics, Chem, Bio)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="English">English</option>
                    <option value="Social Science">Social Science (History, Econ)</option>
                  </select>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase">
                    Gender Identity:
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as Gender)}
                    className="px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-amber-500 rounded-xl text-sm text-neutral-100 outline-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Avatar Preset Selector & Custom Upload */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase">
                  Choose Avatar or Upload Profile Picture:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_PRESETS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setAvatarPreview(icon)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition cursor-pointer ${
                        avatarPreview === icon
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}

                  <label className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 flex items-center gap-1.5 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Selected Anime Hero Selection */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs font-mono-code text-neutral-300 font-semibold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Your Anime Superhero:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HEROES.map(hero => {
                    const isSelected = hero.id === selectedCharacterId;
                    return (
                      <div
                        key={hero.id}
                        onClick={() => {
                          soundManager.playBeep(480, 0.03);
                          setSelectedCharacterId(hero.id);
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                            : 'bg-neutral-950/60 hover:bg-neutral-800/40 border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{hero.portrait}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className="font-bold text-xs text-neutral-200 mt-1">{hero.heroTitle}</span>
                        <span className="text-[10px] text-neutral-400">{hero.name}</span>
                        <span className="text-[9px] font-mono-code text-amber-400/90 truncate">
                          {hero.abilityName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Telemetry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
