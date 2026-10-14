import React, { useState, useEffect } from 'react';
import { DailyMission } from '../types/game';
import {
  getTimeUntilMidnight,
  StoredDailyMissionsData,
  loadDailyMissionsFromStorage,
  saveDailyMissionsToStorage,
} from '../data/dailyMissions';
import { soundManager } from '../services/audio';
import {
  Calendar,
  Clock,
  Flame,
  Gift,
  CheckCircle2,
  Coins,
  Zap,
  Gem,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Compass,
} from 'lucide-react';

interface DailyMissionsCardProps {
  onClaimReward: (coins: number, xp: number, diamonds?: number) => void;
  onNavigateToGame: () => void;
  onNavigateToShelter: () => void;
}

export const DailyMissionsCard: React.FC<DailyMissionsCardProps> = ({
  onClaimReward,
  onNavigateToGame,
  onNavigateToShelter,
}) => {
  const [data, setData] = useState<StoredDailyMissionsData>(() => loadDailyMissionsFromStorage());
  const [timeLeft, setTimeLeft] = useState<{ formatted: string }>(() => getTimeUntilMidnight());
  const [rewardToast, setRewardToast] = useState<{ message: string; coins: number; xp: number } | null>(null);

  // Update countdown clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reload data from storage if external updates occurred
  useEffect(() => {
    const current = loadDailyMissionsFromStorage();
    setData(current);
  }, []);

  const completedCount = data.missions.filter(m => m.completed).length;
  const allMissionsFinished = data.missions.length > 0 && completedCount === data.missions.length;

  const handleClaimSingle = (mission: DailyMission) => {
    if (!mission.completed || mission.claimed) return;

    soundManager.playSuccess();

    const updatedMissions = data.missions.map(m =>
      m.id === mission.id ? { ...m, claimed: true } : m
    );

    const updatedData: StoredDailyMissionsData = {
      ...data,
      missions: updatedMissions,
    };

    setData(updatedData);
    saveDailyMissionsToStorage(updatedData);

    onClaimReward(mission.rewardCoins, mission.rewardXp);

    setRewardToast({
      message: `Claimed ${mission.title}!`,
      coins: mission.rewardCoins,
      xp: mission.rewardXp,
    });

    setTimeout(() => {
      setRewardToast(null);
    }, 3500);
  };

  const handleClaimSuperChest = () => {
    if (!allMissionsFinished || data.superChestClaimed) return;

    soundManager.playFanfare();

    const updatedData: StoredDailyMissionsData = {
      ...data,
      superChestClaimed: true,
    };

    setData(updatedData);
    saveDailyMissionsToStorage(updatedData);

    // Super chest bonus: 500 Coins, 500 XP, 1 Diamond
    onClaimReward(500, 500, 1);

    setRewardToast({
      message: '🌟 DAILY SUPER CHEST UNLOCKED!',
      coins: 500,
      xp: 500,
    });

    setTimeout(() => {
      setRewardToast(null);
    }, 4500);
  };

  // Quick practice / progress simulator for students testing missions
  const handleSimulateProgress = (missionId: string) => {
    soundManager.playBeep(580, 0.05);
    const updated = data.missions.map(m => {
      if (m.id === missionId && !m.completed) {
        const nextProgress = Math.min(m.target, m.progress + 1);
        return {
          ...m,
          progress: nextProgress,
          completed: nextProgress >= m.target,
        };
      }
      return m;
    });

    const updatedData = { ...data, missions: updated };
    setData(updatedData);
    saveDailyMissionsToStorage(updatedData);
  };

  return (
    <div className="relative w-full rounded-2xl bg-neutral-900 border border-neutral-800 p-4 sm:p-6 shadow-xl flex flex-col gap-5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Reward Toast Notification */}
      {rewardToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl animate-bounce">
          <Sparkles className="w-4 h-4 fill-neutral-950" />
          <span>{rewardToast.message}</span>
          <span className="bg-neutral-950/20 px-2 py-0.5 rounded text-xs font-mono-code font-black">
            +{rewardToast.coins} Coins · +{rewardToast.xp} XP
          </span>
        </div>
      )}

      {/* Header Row: Title, Countdown Timer, Streak */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-md">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide">
                DAILY MISSIONS DECK
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono-code font-bold uppercase tracking-wider">
                Rotating Tasks
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Complete daily rotation tasks to earn bonus coins & XP. Missions reset daily at midnight!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono-code font-bold">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span>{data.streakCount}-Day Streak</span>
          </div>

          {/* Reset Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-mono-code">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-neutral-400">Resets in:</span>
            <span className="font-bold text-amber-300">{timeLeft.formatted}</span>
          </div>
        </div>
      </div>

      {/* Super Chest Banner */}
      <div className={`relative z-10 p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition ${
        data.superChestClaimed
          ? 'bg-neutral-950/70 border-neutral-800 opacity-80'
          : allMissionsFinished
          ? 'bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-purple-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
          : 'bg-neutral-950/60 border-neutral-800/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl shrink-0 shadow">
            {data.superChestClaimed ? '📦' : allMissionsFinished ? '🎁' : '🔒'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-200">
                Daily Completion Super Chest
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                {completedCount} / {data.missions.length} Missions Done
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
              <span>Grand Daily Bounty:</span>
              <span className="text-yellow-400 font-mono-code font-bold">+500 Coins</span>
              <span>·</span>
              <span className="text-purple-400 font-mono-code font-bold">+500 XP</span>
              <span>·</span>
              <span className="text-cyan-400 font-mono-code font-bold">+1 Diamond</span>
            </p>
          </div>
        </div>

        <div>
          {data.superChestClaimed ? (
            <span className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-neutral-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Super Chest Claimed
            </span>
          ) : allMissionsFinished ? (
            <button
              onClick={handleClaimSuperChest}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 text-xs font-bold font-mono-code uppercase shadow-lg shadow-amber-500/30 animate-pulse transition cursor-pointer flex items-center gap-2"
            >
              <Gift className="w-4 h-4 fill-neutral-950" />
              <span>Claim Super Chest</span>
            </button>
          ) : (
            <div className="w-32 sm:w-40 flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-mono-code text-neutral-400">
                <span>Chest Progress</span>
                <span className="text-amber-400 font-bold">{Math.round((completedCount / data.missions.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                  style={{ width: `${(completedCount / data.missions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3 Rotating Mission Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {data.missions.map((mission, idx) => {
          const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

          const categoryColor =
            mission.category === 'quiz'
              ? 'text-cyan-400 bg-cyan-950/50 border-cyan-800/40'
              : mission.category === 'survival'
              ? 'text-amber-400 bg-amber-950/50 border-amber-800/40'
              : mission.category === 'building'
              ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40'
              : 'text-purple-400 bg-purple-950/50 border-purple-800/40';

          return (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3.5 transition ${
                mission.claimed
                  ? 'bg-neutral-950/80 border-neutral-800 opacity-75'
                  : mission.completed
                  ? 'bg-neutral-950 border-amber-500/50 shadow-md shadow-amber-500/5'
                  : 'bg-neutral-950/90 border-neutral-800/90 hover:border-neutral-700'
              }`}
            >
              <div className="flex flex-col gap-2">
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded border ${categoryColor}`}>
                    {mission.category}
                  </span>
                  <span className="text-[10px] font-mono-code text-neutral-500">
                    Task 0{idx + 1}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">{mission.icon}</span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-100 leading-snug">
                      {mission.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress and Rewards */}
              <div className="flex flex-col gap-2">
                {/* Progress bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-code">
                    <span className="text-neutral-400">Progress</span>
                    <span className={mission.completed ? 'text-emerald-400 font-bold' : 'text-neutral-300 font-bold'}>
                      {mission.progress} / {mission.target}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        mission.completed
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Reward pill */}
                <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-neutral-900 border border-neutral-800/80 text-[11px] font-mono-code">
                  <span className="text-neutral-400 text-[10px]">Reward:</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-yellow-400 font-bold">
                      <Coins className="w-3 h-3" />
                      +{mission.rewardCoins}
                    </span>
                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                      <Zap className="w-3 h-3" />
                      +{mission.rewardXp}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div>
                  {mission.claimed ? (
                    <div className="w-full py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Reward Claimed</span>
                    </div>
                  ) : mission.completed ? (
                    <button
                      onClick={() => handleClaimSingle(mission)}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-bold text-xs font-mono-code uppercase shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-neutral-950" />
                      <span>Claim Bonus</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (mission.category === 'building') {
                            onNavigateToShelter();
                          } else {
                            onNavigateToGame();
                          }
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Start Task</span>
                        <ArrowRight className="w-3 h-3 text-neutral-400" />
                      </button>

                      {/* Practice Drill progress button */}
                      <button
                        onClick={() => handleSimulateProgress(mission.id)}
                        className="py-1.5 px-2 rounded-lg bg-neutral-900 hover:bg-amber-500/20 hover:text-amber-300 text-neutral-400 text-[10px] font-mono-code border border-neutral-800 transition cursor-pointer"
                        title="Complete drill step"
                      >
                        + Drill
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
