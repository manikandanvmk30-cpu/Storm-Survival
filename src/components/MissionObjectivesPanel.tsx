import React from 'react';
import { StageObjective } from '../types/game';
import { soundManager } from '../services/audio';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Terminal,
} from 'lucide-react';

interface MissionObjectivesPanelProps {
  currentStage: number;
  objectives: StageObjective[];
  onTriggerObjectiveAction: (obj: StageObjective) => void;
  onOpenDecision: () => void;
  onOpenChallenge: () => void;
  canTriggerDecision: boolean;
}

export const MissionObjectivesPanel: React.FC<MissionObjectivesPanelProps> = ({
  currentStage,
  objectives,
  onTriggerObjectiveAction,
  onOpenDecision,
  onOpenChallenge,
  canTriggerDecision,
}) => {
  const currentObjective = objectives.find(o => o.stage === currentStage);

  const stageTitles = [
    'Stage 1: Storm Warning',
    'Stage 2: Protect the Base',
    'Stage 3: Save the Power',
    'Stage 4: Rescue the Rover',
    'Stage 5: Emergency Commander',
  ];

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 backdrop-blur-md flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="font-display font-bold text-sm tracking-wide text-neutral-100">
            {stageTitles[currentStage - 1] || `Stage ${currentStage}`}
          </span>
        </div>
        <span className="text-xs font-mono-code text-neutral-400">
          MISSION STAGE {currentStage} / 5
        </span>
      </div>

      {/* Active Objective card */}
      {currentObjective ? (
        <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <h4 className="font-semibold text-xs text-neutral-200">
                  {currentObjective.title}
                </h4>
              </div>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {currentObjective.description}
              </p>
            </div>

            <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700 shrink-0">
              TARGET: {(currentObjective.targetStationId || currentObjective.targetRoomId || 'STATION').toUpperCase()}
            </span>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-900">
            {canTriggerDecision && (
              <button
                onClick={() => {
                  soundManager.playBeep(620, 0.05);
                  onOpenDecision();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Execute Strategic Decision</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playBeep(560, 0.05);
                onOpenChallenge();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs transition cursor-pointer border border-neutral-700"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Calibrate Diagnostic Challenge</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-neutral-950 rounded-lg text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>All stage directives secured! Hold base until storm eye clears.</span>
        </div>
      )}

      {/* Mini Stage Step Dots */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {[1, 2, 3, 4, 5].map(st => {
          const isDone = st < currentStage;
          const isCur = st === currentStage;
          return (
            <div
              key={st}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                isDone
                  ? 'bg-emerald-500'
                  : isCur
                  ? 'bg-amber-400 ring-2 ring-amber-400/40'
                  : 'bg-neutral-800'
              }`}
              title={`Stage ${st}`}
            />
          );
        })}
      </div>
    </div>
  );
};
