import React from 'react';
import { QuestionHistoryEntry } from '../types/game';
import { History, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

interface QuestionHistoryModalProps {
  history: QuestionHistoryEntry[];
  isBankExhausted: boolean;
  onClose: () => void;
}

export const QuestionHistoryModal: React.FC<QuestionHistoryModalProps> = ({
  history,
  isBankExhausted,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-indigo-400 uppercase tracking-wider font-semibold">
                Educational Record Log
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Question History & No-Repeat Verification
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bank Exhaustion Warning (if applicable) */}
        {isBankExhausted && (
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Question Bank Exhausted:</strong> You have solved all unseen questions in this category! Previous questions are now being recycled for extra review.
            </span>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-0">
          {history.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs border border-dashed border-neutral-800 rounded-xl">
              No questions answered yet. Start a mission to solve Tamil, English, Mathematics, Science, and Social Science challenges!
            </div>
          ) : (
            history.map((entry, idx) => (
              <div
                key={`${entry.questionId}-${idx}`}
                className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 uppercase font-semibold">
                      {(entry.subject || entry.difficulty || 'QUESTION').replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono-code">
                      {entry.levelNumber ? `Level ${entry.levelNumber}` : (entry.grade || '')} · ID: {entry.questionId}
                    </span>
                  </div>

                  {entry.isCorrect ? (
                    <span className="text-xs font-mono-code text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-xs font-mono-code text-rose-400 flex items-center gap-1 font-semibold">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-neutral-200">{entry.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-code pt-1 border-t border-neutral-900">
                  <div className="text-neutral-400">
                    Your Answer:{' '}
                    <span className={entry.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300'}>
                      {entry.selectedAnswer}
                    </span>
                  </div>
                  {!entry.isCorrect && (
                    <div className="text-emerald-400">
                      Correct Answer: <span className="font-bold">{entry.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs font-mono-code text-neutral-400">
          <span>Total Answered: {history.length} Questions</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition cursor-pointer"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
