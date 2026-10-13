import React, { useState } from 'react';
import { GameSaveData } from '../types/game';
import { soundManager } from '../services/audio';
import { Save, Download, Upload, RotateCcw, Check, AlertCircle, X } from 'lucide-react';

interface SaveManagerModalProps {
  currentSaveData: GameSaveData;
  onSaveToLocal: () => void;
  onLoadFromData: (data: GameSaveData) => void;
  onNewGame: () => void;
  onClose: () => void;
}

export const SaveManagerModal: React.FC<SaveManagerModalProps> = ({
  currentSaveData,
  onSaveToLocal,
  onLoadFromData,
  onNewGame,
  onClose,
}) => {
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleManualSave = () => {
    onSaveToLocal();
    soundManager.playSuccess();
    setMsg({ text: 'Mission state saved successfully to local telemetry bank!', isError: false });
  };

  const handleExportJson = () => {
    soundManager.playDiamondChime();
    const jsonStr = JSON.stringify(currentSaveData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mission_Mars_Save_${currentSaveData.player.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMsg({ text: 'JSON Save File downloaded to your computer!', isError: false });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target?.result as string) as GameSaveData;
        if (!parsed.player || !parsed.resources) {
          throw new Error('Corrupt or incompatible save format.');
        }
        onLoadFromData(parsed);
        soundManager.playSuccess();
        setMsg({ text: `Save loaded! Welcome back Commander ${parsed.player.name}.`, isError: false });
      } catch {
        soundManager.playFailure();
        setMsg({ text: 'Failed to import save. Incompatible JSON file.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmNewGame = () => {
    if (window.confirm('Start a fresh Mars defense mission? Current unsaved mission telemetry will reset.')) {
      onNewGame();
      soundManager.playSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Mission Telemetry Storage
              </span>
              <h2 className="text-base font-bold font-display text-neutral-100">
                Save, Load & JSON Data Manager
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

        {/* Message notification */}
        {msg && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
              msg.isError
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {msg.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Current State Summary */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono-code flex flex-col gap-2">
          <div className="text-neutral-400 uppercase font-semibold">Active Save State:</div>
          <div className="flex justify-between text-neutral-300">
            <span>Commander:</span>
            <span className="font-bold text-amber-400">{currentSaveData.player.name}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Stage / Storm:</span>
            <span>Stage {currentSaveData.currentStage} · Level {currentSaveData.currentStormLevel}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>XP / Rank:</span>
            <span>{currentSaveData.player.xp} XP ({currentSaveData.player.rank})</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Resources:</span>
            <span>
              HP: {Math.round(currentSaveData.resources.health)}% | PWR: {Math.round(currentSaveData.resources.power)}%
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5">
          {/* Quick Save */}
          <button
            onClick={handleManualSave}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Progress (Browser Storage)</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-neutral-700"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Mission Save (.json file)</span>
          </button>

          {/* Import JSON */}
          <label className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-neutral-700">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Load / Import Mission Save (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {/* New Game */}
          <button
            onClick={handleConfirmNewGame}
            className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Fresh New Mission</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
