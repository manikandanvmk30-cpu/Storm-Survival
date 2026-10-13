import React, { useState } from 'react';
import { DecisionScenario, DecisionChoice } from '../types/game';
import { soundManager } from '../services/audio';
import { AlertTriangle, Gem, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DecisionModalProps {
  scenario: DecisionScenario;
  diamonds: number;
  onSelectChoice: (choice: DecisionChoice) => void;
  onSpendDiamondHint: () => boolean; // returns true if had diamond and spent
  onClose: () => void;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  scenario,
  diamonds,
  onSelectChoice,
  onSpendDiamondHint,
  onClose,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [revealedHint, setRevealedHint] = useState<string | null>(null);
  const [resolvedConsequence, setResolvedConsequence] = useState<{
    choice: DecisionChoice;
    text: string;
  } | null>(null);

  const selectedChoice = scenario.choices.find(c => c.id === selectedChoiceId);

  const handleRevealHint = () => {
    if (revealedHint) return;
    if (diamonds < 1) {
      soundManager.playFailure();
      return;
    }
    const success = onSpendDiamondHint();
    if (success) {
      soundManager.playDiamondChime();
      // Provide a synthesized tactical hint for the scenario
      setRevealedHint(
        selectedChoice
          ? selectedChoice.hint
          : 'Tactical analysis suggests evaluating which resource currently has the thinnest safety margin before committing power reserves.'
      );
    }
  };

  const handleConfirmDecision = () => {
    if (!selectedChoice) return;
    soundManager.playSuccess();
    setResolvedConsequence({
      choice: selectedChoice,
      text: selectedChoice.consequenceText,
    });
  };

  const handleProceedAfterConsequence = () => {
    if (!resolvedConsequence) return;
    onSelectChoice(resolvedConsequence.choice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider">
                {scenario.stageName} · Level {scenario.stormLevel}
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">{scenario.title}</h2>
            </div>
          </div>

          {/* Diamonds hint button */}
          <button
            onClick={handleRevealHint}
            disabled={diamonds < 1 && !revealedHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
              revealedHint
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : diamonds > 0
                ? 'bg-neutral-800 hover:bg-neutral-700 border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60'
                : 'bg-neutral-800/40 border-neutral-700/40 text-neutral-500 cursor-not-allowed'
            }`}
            title="Spend 1 diamond for a tactical intelligence hint"
          >
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span>{revealedHint ? 'Hint Active' : `Get Hint (1 💎)`}</span>
          </button>
        </div>

        {/* If consequence resolved, show consequence card */}
        {resolvedConsequence ? (
          <div className="flex flex-col gap-5 py-2">
            <div className="bg-neutral-950 border border-neutral-700/80 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Decision Executed: {resolvedConsequence.choice.title}</span>
              </div>

              {/* Consequence Explanation */}
              <div className="p-4 bg-neutral-900/90 rounded-lg border border-neutral-800 text-sm leading-relaxed text-neutral-200">
                <p className="font-semibold text-amber-300 mb-1">Operational Consequence:</p>
                {resolvedConsequence.text}
              </div>

              {/* Resource Impact Summary */}
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(resolvedConsequence.choice.resourceImpacts).map(([res, val]) => {
                  const numVal = Number(val);
                  if (val === undefined || numVal === 0) return null;
                  const isPos = numVal > 0;
                  return (
                    <span
                      key={res}
                      className={`text-xs px-2.5 py-1 rounded font-mono-code font-bold border ${
                        isPos
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {res.toUpperCase()}: {isPos ? `+${numVal}` : numVal}
                      {res === 'time' ? 's' : '%'}
                    </span>
                  );
                })}
              </div>

              {/* Follow-up objective */}
              <div className="flex items-start gap-2 text-xs font-mono-code text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-200">Follow-up Directive: </span>
                  {resolvedConsequence.choice.followUpObjective}
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedAfterConsequence}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Adapt Strategy & Continue Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Situation description */}
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-2">
              <div className="text-xs font-mono-code text-amber-400 font-semibold">
                SITUATION BRIEFING
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed">{scenario.situation}</p>
              <div className="text-xs text-neutral-400 font-mono-code pt-1 border-t border-neutral-900">
                {scenario.contextAlert}
              </div>
            </div>

            {/* Revealed Hint Box */}
            {revealedHint && (
              <div className="bg-cyan-950/30 border border-cyan-500/40 rounded-xl p-3.5 flex items-start gap-3">
                <Gem className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-200">
                  <span className="font-bold text-cyan-300">Tactical Hint: </span>
                  {revealedHint}
                </div>
              </div>
            )}

            {/* Choices list */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono-code text-neutral-400 uppercase tracking-wider">
                Select Strategic Intervention (3 Options):
              </span>

              {scenario.choices.map((choice, index) => {
                const isSelected = selectedChoiceId === choice.id;
                const letter = String.fromCharCode(65 + index); // A, B, C

                return (
                  <div
                    key={choice.id}
                    onClick={() => {
                      soundManager.playBeep(480 + index * 40, 0.04);
                      setSelectedChoiceId(choice.id);
                    }}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-neutral-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-neutral-950/60 hover:bg-neutral-800/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-mono-code ${
                            isSelected
                              ? 'bg-amber-500 text-neutral-950'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {letter}
                        </span>
                        <h3 className="font-semibold text-sm text-neutral-100">{choice.title}</h3>
                      </div>

                      {/* Preview of estimated resource delta */}
                      <div className="flex items-center gap-1.5">
                        {choice.resourceImpacts.power !== undefined && (
                          <span
                            className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                              choice.resourceImpacts.power >= 0
                                ? 'text-emerald-400 bg-emerald-950/40'
                                : 'text-amber-400 bg-amber-950/40'
                            }`}
                          >
                            PWR {choice.resourceImpacts.power > 0 ? '+' : ''}
                            {choice.resourceImpacts.power}%
                          </span>
                        )}
                        {choice.resourceImpacts.oxygen !== undefined && (
                          <span
                            className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded ${
                              choice.resourceImpacts.oxygen >= 0
                                ? 'text-cyan-400 bg-cyan-950/40'
                                : 'text-rose-400 bg-rose-950/40'
                            }`}
                          >
                            O2 {choice.resourceImpacts.oxygen > 0 ? '+' : ''}
                            {choice.resourceImpacts.oxygen}%
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 leading-normal pl-8">
                      {choice.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200 text-xs font-medium cursor-pointer"
              >
                Inspect Base First
              </button>

              <button
                onClick={handleConfirmDecision}
                disabled={!selectedChoiceId}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition cursor-pointer ${
                  selectedChoiceId
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>Commit Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
