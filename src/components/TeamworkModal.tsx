import React, { useState } from 'react';
import { CrewMember } from '../types/game';
import { INITIAL_CREW, TEAM_EMERGENCY_TASKS, TeamTask } from '../data/team';
import { soundManager } from '../services/audio';
import { Users, CheckCircle2, Clock, Sparkles, Shield, Radio } from 'lucide-react';

interface TeamworkModalProps {
  crew: CrewMember[];
  onAssignTask: (task: TeamTask, memberId: string) => void;
  completedTaskIds: string[];
  stormLevel: number;
  onClose: () => void;
}

export const TeamworkModal: React.FC<TeamworkModalProps> = ({
  crew = INITIAL_CREW,
  onAssignTask,
  completedTaskIds,
  stormLevel,
  onClose,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(crew[0]?.id || 'crew_priya');
  const [activeTab, setActiveTab] = useState<'roster' | 'dispatch'>('dispatch');

  const selectedMember = crew.find(m => m.id === selectedMemberId) || crew[0];

  const handleDispatch = (task: TeamTask) => {
    soundManager.playSuccess();
    onAssignTask(task, selectedMember.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-blue-400 uppercase tracking-wider">
                  Emergency Commander Protocol
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono-code">
                  Storm Level {stormLevel} Active
                </span>
              </div>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Mars Base Crew Triage & Delegation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('dispatch')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'dispatch'
                    ? 'bg-neutral-800 text-blue-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Emergency Tasks
              </button>
              <button
                onClick={() => setActiveTab('roster')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-neutral-800 text-blue-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Crew Roster & Radio
              </button>
            </div>
          </div>
        </div>

        {/* Crew selector strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {crew.map(member => {
            const isSelected = member.id === selectedMemberId;
            return (
              <div
                key={member.id}
                onClick={() => {
                  soundManager.playBeep(600, 0.04);
                  setSelectedMemberId(member.id);
                }}
                className={`p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500 ring-1 ring-blue-500/50'
                    : 'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{member.avatar}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      member.status === 'working' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                </div>
                <div className="font-semibold text-xs text-neutral-200 truncate">{member.name}</div>
                <div className="text-[10px] text-neutral-400 font-mono-code truncate">
                  {member.role}
                </div>
              </div>
            );
          })}
        </div>

        {activeTab === 'dispatch' ? (
          /* Task Delegation View */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
                Assign Emergency Station Directive to{' '}
                <span className="text-blue-300 font-semibold">{selectedMember.name}</span>
              </span>
              <span className="text-xs font-mono-code text-neutral-500">
                Completed: {completedTaskIds.length}/{TEAM_EMERGENCY_TASKS.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TEAM_EMERGENCY_TASKS.map(task => {
                const isCompleted = completedTaskIds.includes(task.id);
                const isSpecialistMatch = task.recommendedMemberId === selectedMember.id;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      isCompleted
                        ? 'bg-neutral-950/40 border-neutral-900 opacity-60'
                        : isSpecialistMatch
                        ? 'bg-neutral-950/80 border-blue-500/50 hover:border-blue-400'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono-code text-blue-400 uppercase font-semibold">
                          {task.category}
                        </span>
                        {isSpecialistMatch && !isCompleted && (
                          <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Specialist Match
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Completed
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-neutral-100">{task.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-900">
                      {/* Gains preview */}
                      <div className="flex items-center gap-2 text-[10px] font-mono-code text-neutral-300">
                        {task.resourceGain.oxygen && (
                          <span className="text-cyan-300">+{task.resourceGain.oxygen}% O2</span>
                        )}
                        {task.resourceGain.power && (
                          <span className="text-amber-300">+{task.resourceGain.power}% PWR</span>
                        )}
                        {task.resourceGain.water && (
                          <span className="text-blue-300">+{task.resourceGain.water}% H2O</span>
                        )}
                        {task.resourceGain.health && (
                          <span className="text-rose-300">+{task.resourceGain.health}% HP</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDispatch(task)}
                        disabled={isCompleted}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                          isCompleted
                            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{isCompleted ? 'Resolved' : 'Dispatch'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Crew Radio Dialogue View */
          <div className="flex flex-col gap-4 bg-neutral-950 p-5 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedMember.avatar}</span>
              <div>
                <h3 className="font-bold text-base text-neutral-100">{selectedMember.name}</h3>
                <p className="text-xs text-blue-400 font-mono-code">{selectedMember.role}</p>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800/80 flex items-start gap-3">
              <Radio className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-neutral-200 leading-relaxed font-sans">
                <span className="font-mono-code text-blue-300 block mb-1">
                  SECURE COMMS TRANSCRIPTION:
                </span>
                {selectedMember.dialogue}
              </div>
            </div>

            <div className="text-xs text-neutral-400 leading-normal">
              <span className="font-semibold text-neutral-300">Core Expertise: </span>
              {selectedMember.specialty}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Coordinated teamwork enhances storm survival probability by +45%</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Return to Bridge
          </button>
        </div>
      </div>
    </div>
  );
};
