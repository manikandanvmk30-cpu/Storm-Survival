import React, { useState } from 'react';
import { PYTHON_CODE_FILES, PythonFile } from '../data/pythonCodePackage';
import { soundManager } from '../services/audio';
import { Code, Download, Copy, Check, FileCode, X, Terminal } from 'lucide-react';

interface PythonCodeModalProps {
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<PythonFile>(PYTHON_CODE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    soundManager.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    soundManager.playDiamondChime();
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    soundManager.playDiamondChime();
    // Download each file
    PYTHON_CODE_FILES.forEach((f, idx) => {
      setTimeout(() => {
        const blob = new Blob([f.code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = f.filename;
        link.click();
        URL.revokeObjectURL(url);
      }, idx * 150);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-wider font-semibold">
                  Python & Pygame Edition
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono-code">
                  v1.0.0 Runnable
                </span>
              </div>
              <h2 className="text-base font-bold font-display text-neutral-100">
                Complete Python Source Code Package & Architecture
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Download all Python game files"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Scripts</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: file sidebar + code viewer */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
          {/* File list sidebar */}
          <div className="w-full md:w-56 flex flex-col gap-1.5 overflow-y-auto pr-1 shrink-0">
            <span className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider font-semibold mb-1">
              Project Modules:
            </span>
            {PYTHON_CODE_FILES.map(file => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => {
                    soundManager.playBeep(520, 0.03);
                    setSelectedFile(file);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono-code text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800 text-emerald-300 border border-neutral-700 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950/60'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{file.filename}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
            {/* Viewer subheader */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs">
              <div>
                <span className="font-mono-code text-neutral-200 font-bold">
                  {selectedFile.filename}
                </span>
                <span className="text-neutral-500 font-mono-code ml-2 text-[11px]">
                  — {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-mono-code transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-mono-code transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Code Pre Box */}
            <div className="flex-1 overflow-auto p-4 font-mono-code text-xs text-neutral-300 leading-relaxed bg-neutral-950">
              <pre>
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs font-mono-code text-neutral-400">
          <div>Run instructions: pip install pygame && python main.py</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition cursor-pointer"
          >
            Back to Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
