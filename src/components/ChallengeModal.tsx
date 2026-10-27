import React, { useState } from 'react';
import { LevelQuestion } from '../types/game';
import { soundManager } from '../services/audio';
import { getAIHint } from '../services/api';
import { CheckCircle2, XCircle, Gem, HelpCircle, ArrowRight, Award, Flame, Loader2 } from 'lucide-react';

interface ChallengeModalProps {
  question: LevelQuestion;
  diamonds: number;
  consecutiveStreak: number;
  onSolve: (isCorrect: boolean, selectedOption: string) => void;
  onSpendDiamondHint: () => boolean;
  onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  question,
  diamonds,
  consecutiveStreak,
  onSolve,
  onSpendDiamondHint,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [revealedHint, setRevealedHint] = useState<boolean>(false);
  const [hintText, setHintText] = useState<string>('');
  const [hintSource, setHintSource] = useState<string>('');
  const [isLoadingHint, setIsLoadingHint] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    soundManager.playBeep(520 + index * 40, 0.05);
  };

  const handleSpendHint = async () => {
    if (revealedHint || isLoadingHint) return;
    if (diamonds < 1) {
      soundManager.playFailure();
      return;
    }
    const spent = onSpendDiamondHint();
    if (spent) {
      soundManager.playDiamondChime();
      setRevealedHint(true);
      setIsLoadingHint(true);
      try {
        const res = await getAIHint({
          question: question.question,
          options: question.options,
          subject: question.subject,
          difficulty: question.difficulty,
        });
        setHintText(res.hint);
        setHintSource(res.source);
      } catch {
        setHintText(question.hint || 'Think carefully about the core concept and eliminate wrong answers first!');
        setHintSource('static');
      } finally {
        setIsLoadingHint(false);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedIndex === null || isAnswered) return;
    const correct = selectedIndex === question.correctIndex;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playSuccess();
    } else {
      soundManager.playFailure();
    }
  };

  const handleContinue = () => {
    const chosenOption = selectedIndex !== null ? question.options[selectedIndex] : '';
    onSolve(isCorrect, chosenOption);
  };

  const getDifficultyBadge = () => {
    if (question.difficulty === 'Easy') {
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
    } else if (question.difficulty === 'Medium') {
      return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    } else {
      return 'text-rose-400 bg-rose-950/40 border-rose-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-mono-code px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${getDifficultyBadge()}`}
              >
                LEVEL {question.levelNumber} · {question.difficulty} ({question.points} {question.points === 1 ? 'pt' : 'pts'})
              </span>
              <span className="text-xs text-neutral-400 font-mono-code">
                Q{question.questionNumber} of 15 · {question.subjectLabel}
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-neutral-100">
              Storm Survival Challenge
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak count pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-mono-code font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Streak: {consecutiveStreak}</span>
            </div>

            {/* Diamond Hint */}
            <button
              onClick={handleSpendHint}
              disabled={diamonds < 1 && !revealedHint}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
                revealedHint
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : diamonds > 0
                  ? 'bg-neutral-800 hover:bg-neutral-700 border-cyan-500/30 text-cyan-400'
                  : 'bg-neutral-800/40 border-neutral-700/40 text-neutral-500 cursor-not-allowed'
              }`}
              title="Spend 1 diamond for a guided reasoning hint"
            >
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span>{revealedHint ? 'Hint Active' : 'Hint (1 💎)'}</span>
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-sm font-semibold text-neutral-100 leading-relaxed font-sans">
          {question.question}
        </div>

        {/* Hint Box (if revealed) */}
        {revealedHint && (
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-xl flex items-start gap-2.5 text-xs text-cyan-200 animate-in fade-in">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-cyan-300">AI Storm Hint</span>
                {hintSource === 'gemini' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">✨ Gemini AI</span>
                )}
              </div>
              {isLoadingHint ? (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Storm AI is thinking...</span>
                </div>
              ) : (
                <span>{hintText || question.hint || 'Review the core concept and eliminate clearly wrong answers first!'}</span>
              )}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isOptionCorrect = idx === question.correctIndex;

            let optionStyle =
              'bg-neutral-950/60 hover:bg-neutral-800/60 border-neutral-800 text-neutral-200';

            if (isSelected && !isAnswered) {
              optionStyle = 'bg-amber-500/10 border-amber-500 text-amber-200 ring-1 ring-amber-500';
            } else if (isAnswered) {
              if (isOptionCorrect) {
                optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-semibold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-200 line-through opacity-80';
              } else {
                optionStyle = 'bg-neutral-950/30 border-neutral-900 text-neutral-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-mono-code font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isOptionCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-answer explanation */}
        {isAnswered && (
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Correct! (+{question.points} Points & Home Materials Gathered!)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Incorrect (-10% Health). Streak reset to 0.</span>
                </>
              )}
            </div>
            <p className="text-neutral-300 font-sans">{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          {!isAnswered ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedIndex === null}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
                  selectedIndex !== null
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </>
          ) : (
            <button
              onClick={handleContinue}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Continue Level {question.levelNumber}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
