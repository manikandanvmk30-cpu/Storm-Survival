import React, { useRef, useEffect } from 'react';
import { RankTier, GradeLevel } from '../types/game';
import { soundManager } from '../services/audio';
import { Download, Printer, Award, X } from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  rank: RankTier;
  grade: GradeLevel;
  finalHealth: number;
  finalPower: number;
  finalOxygen: number;
  questionsSolved: number;
  decisionsSuccessful: number;
  completionDate?: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  rank,
  grade,
  finalHealth,
  finalPower,
  finalOxygen,
  questionsSolved,
  decisionsSuccessful,
  completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Cosmic Navy Background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, w, h);

    // Starfield particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 70; i++) {
      const sx = (i * 149) % w;
      const sy = (i * 239) % h;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // Outer Decorative Gold Border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(25, 25, w - 50, h - 50);

    // Inner Filigree
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, w - 76, h - 76);

    // Corner Ornaments
    const drawCorner = (cx: number, cy: number) => {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(42, 42);
    drawCorner(w - 42, 42);
    drawCorner(42, h - 42);
    drawCorner(w - 42, h - 42);

    // Organization Banner / Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STORM SURVIVAL · PLANETARY SCIENCE INITIATIVE', w / 2, 95);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px "JetBrains Mono", monospace';
    ctx.fillText('EDUCATIONAL ADVENTURE & EMERGENCY COMMAND BRIGADE', w / 2, 125);

    // Main Heading
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 44px "Outfit", sans-serif';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', w / 2, 190);

    // Subtitle
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px "Outfit", sans-serif';
    ctx.fillText('This official credential certifies that cadet officer', w / 2, 240);

    // Student Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px "Chakra Petch", sans-serif';
    ctx.fillText(studentName || 'Student Cadet', w / 2, 310);

    // Underline
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 280, 328);
    ctx.lineTo(w / 2 + 280, 328);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px "Outfit", sans-serif';
    ctx.fillText(
      `has successfully commanded and survived Storm Survival`,
      w / 2,
      375
    );
    ctx.fillText(
      `enduring all 5 escalating storm levels, attaining the distinguished rank of:`,
      w / 2,
      408
    );

    // Rank Badge
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.fillText(`★  ${rank.toUpperCase()} CADET OFFICER  ★`, w / 2, 465);

    // Performance Stats Matrix Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(140, 500, w - 280, 140, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('MISSION PERFORMANCE VERIFICATION LOG', w / 2, 530);

    const metrics = [
      { label: 'GRADE LEVEL', value: grade },
      { label: 'SOLVED CHALLENGES', value: `${questionsSolved} Modules` },
      { label: 'STRATEGIC DECISIONS', value: `${decisionsSuccessful} Commits` },
      { label: 'FINAL VITALS', value: `HP: ${Math.round(finalHealth)}% | PWR: ${Math.round(finalPower)}%` },
    ];

    metrics.forEach((m, idx) => {
      const colX = 220 + idx * 190;
      ctx.fillStyle = '#64748b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(m.label, colX, 570);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillText(m.value, colX, 600);
    });

    // Date & Signatures
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Outfit", sans-serif';
    ctx.fillText(`Conferred on: ${completionDate}`, 280, 720);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 740);
    ctx.lineTo(380, 740);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('DIRECTOR, BASE OPERATIONS', 280, 760);

    ctx.strokeStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(w - 380, 740);
    ctx.lineTo(w - 180, 740);
    ctx.stroke();
    ctx.fillText('CHIEF FLIGHT CONTROLLER', w - 280, 760);

    // Gold Stamp
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, 725, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(w / 2, 725, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 10px "Chakra Petch", sans-serif';
    ctx.fillText('OFFICIAL SEAL', w / 2, 720);
    ctx.fillText('STORM SURVIVAL', w / 2, 735);
  }, [
    studentName,
    rank,
    grade,
    finalHealth,
    finalPower,
    finalOxygen,
    questionsSolved,
    decisionsSuccessful,
    completionDate,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundManager.playDiamondChime();
    const link = document.createElement('a');
    link.download = `Storm_Survival_Certificate_${(studentName || 'Cadet').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    soundManager.playBeep(640, 0.05);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold font-display text-neutral-100">
              Storm Survival: Certificate of Achievement
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Preview */}
        <div className="w-full flex justify-center bg-neutral-950 p-3 rounded-xl border border-neutral-800 overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={1200}
            height={850}
            className="w-full max-w-[840px] h-auto shadow-2xl rounded-lg block"
          />
        </div>

        <div className="text-center text-xs text-neutral-400 font-mono-code">
          Official Storm Survival certification recognizing mathematics, science, language mastery, and resource triage.
        </div>
      </div>
    </div>
  );
};
