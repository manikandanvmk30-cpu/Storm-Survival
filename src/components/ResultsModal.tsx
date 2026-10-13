import React from 'react';
import { RankTier } from '../types/game';
import { soundManager } from '../services/audio';
import {
  Award,
  RotateCcw,
  LayoutDashboard,
  Coins,
  Gem,
  Zap,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface ResultsModalProps {
  isVictory: boolean;
  failureReason?: string;
  questionsSolved: number;
  totalQuestions: number;
  correctAnswers: number;
  objectivesCompleted: number;
  totalObjectives: number;
  decisionsSuccessful: number;
  totalDecisions: number;
  finalHealth: number;
  finalPower: number;
  finalOxygen: number;
  finalWater: number;
  timeRemainingSeconds: number;
  rewardXp: number;
  rewardCoins: number;
  rewardDiamonds: number;
  rank: RankTier;
  newBadgesUnlocked: string[];
  onViewBadges: () => void;
  onViewCertificate: () => void;
  onPlayAgain: () => void;
  onReturnToDashboard: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isVictory,
  failureReason,
  questionsSolved,
  totalQuestions,
  correctAnswers,
  objectivesCompleted,
  totalObjectives,
  decisionsSuccessful,
  totalDecisions,
  finalHealth,
  finalPower,
  finalOxygen,
  finalWater,
  timeRemainingSeconds,
  rewardXp,
  rewardCoins,
  rewardDiamonds,
  rank,
  newBadgesUnlocked,
  onViewBadges,
  onViewCertificate,
  onPlayAgain,
  onReturnToDashboard,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Banner */}
        <div className="text-center flex flex-col items-center gap-2 border-b border-neutral-800 pb-5">
          <div className="text-4xl mb-1">{isVictory ? '🌪️' : '⚠️'}</div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-wide text-neutral-100">
            {isVictory ? 'STORM SURVIVAL COMPLETE!' : 'MISSION EMERGENCY ABORT'}
          </h1>
          <p className="text-xs text-neutral-400 font-mono-code">
            {isVictory
              ? 'Coastal sanctuary and shelter have successfully weathered the severe cyclone.'
              : failureReason || 'Emergency structural thresholds collapsed before storm subsided.'}
          </p>
        </div>

        {/* Performance Metrics Breakdown Grid */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider font-semibold">
            Mission Debrief & Telemetry:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-code">
            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Questions Solved</span>
              <span className="text-sm font-bold text-emerald-400">
                {questionsSolved} / {totalQuestions}
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Correct Answers</span>
              <span className="text-sm font-bold text-cyan-400">
                {correctAnswers} / {questionsSolved}
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Objectives Completed</span>
              <span className="text-sm font-bold text-blue-400">
                {objectivesCompleted} / {totalObjectives}
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Decisions Successful</span>
              <span className="text-sm font-bold text-amber-400">
                {decisionsSuccessful} / {totalDecisions}
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Final Health</span>
              <span className="text-sm font-bold text-rose-400">{Math.round(finalHealth)}%</span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Final Power</span>
              <span className="text-sm font-bold text-yellow-400">{Math.round(finalPower)}%</span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Final Oxygen</span>
              <span className="text-sm font-bold text-cyan-300">{Math.round(finalOxygen)}%</span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Final Water</span>
              <span className="text-sm font-bold text-blue-300">{Math.round(finalWater)}%</span>
            </div>

            <div className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-col gap-1">
              <span className="text-neutral-400 text-[11px]">Time Remaining</span>
              <span className="text-sm font-bold text-amber-300">
                {formatTime(timeRemainingSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Mission Rewards Strip */}
        <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-3">
          <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider font-semibold">
            Rewards Earned:
          </span>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-[10px] text-neutral-400 font-mono-code">XP</div>
                <div className="text-sm font-bold font-mono-code text-purple-300">+{rewardXp}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <Coins className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-[10px] text-neutral-400 font-mono-code">COINS</div>
                <div className="text-sm font-bold font-mono-code text-yellow-300">+{rewardCoins}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900 border border-neutral-800">
              <Gem className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] text-neutral-400 font-mono-code">DIAMONDS</div>
                <div className="text-sm font-bold font-mono-code text-cyan-300">+{rewardDiamonds}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs font-mono-code">
            <span className="text-neutral-400">
              Current Rank: <span className="text-amber-400 font-bold uppercase">{rank}</span>
            </span>

            {newBadgesUnlocked.length > 0 ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Badge Unlocked: {newBadgesUnlocked[0]}
              </span>
            ) : (
              <span className="text-neutral-400">Badge: STORM SURVIVOR</span>
            )}
          </div>
        </div>

        {/* Buttons matching Section 18: View Results, View Badges, View Certificate, Play Again, Return to Dashboard */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-neutral-800">
          <button
            onClick={() => {
              soundManager.playBeep(520, 0.05);
              onViewBadges();
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>View Badges</span>
          </button>

          {isVictory && (
            <button
              onClick={() => {
                soundManager.playBeep(640, 0.05);
                onViewCertificate();
              }}
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>View Certificate</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playBeep(600, 0.05);
              onPlayAgain();
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBeep(480, 0.05);
              onReturnToDashboard();
            }}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
