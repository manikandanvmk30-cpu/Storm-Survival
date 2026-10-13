import React, { useRef, useEffect } from 'react';
import { HomeMaterials, HomeStructure } from '../types/game';
import { soundManager } from '../services/audio';
import {
  Home,
  Hammer,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  X,
  Zap,
} from 'lucide-react';

interface HomeBuilderModalProps {
  materials: HomeMaterials;
  structure: HomeStructure;
  homesBuiltCount?: number;
  onUpgradeHome: (newLevel: number, requiredMaterials: Partial<HomeMaterials>) => void;
  onConstructAdditionalHome?: () => void;
  onClose: () => void;
}

interface UpgradeStage {
  level: number;
  title: string;
  description: string;
  requirements: {
    wood: number;
    rope: number;
    lights: number;
    electronics: number;
    bricks: number;
  };
  bonusPerk: string;
}

export const UPGRADE_STAGES: UpgradeStage[] = [
  {
    level: 1,
    title: 'Reinforced Stone Foundation',
    description: 'Clear storm debris and anchor deep granite footings against flood water.',
    requirements: { wood: 5, rope: 2, lights: 0, electronics: 0, bricks: 6 },
    bonusPerk: '+10% Base Health Buffer during storm alerts',
  },
  {
    level: 2,
    title: 'Solid Timber Pillars & Framing',
    description: 'Erect interlocking hardwood frames lashed with high-tensile safety ropes.',
    requirements: { wood: 10, rope: 6, lights: 0, electronics: 0, bricks: 4 },
    bonusPerk: '+15% Wind Resistance against Category-3 gusts',
  },
  {
    level: 3,
    title: 'Weatherproof Walls & Clay Roof',
    description: 'Install insulated ceramic tiles and storm-resistant window shutters.',
    requirements: { wood: 12, rope: 8, lights: 2, electronics: 0, bricks: 8 },
    bonusPerk: 'Shelters all water supplies from storm contamination',
  },
  {
    level: 4,
    title: 'Solar Inverter & Emergency Lighting',
    description: 'Wire backup LED lighting circuits and rooftop battery inverter relays.',
    requirements: { wood: 8, rope: 4, lights: 6, electronics: 5, bricks: 4 },
    bonusPerk: '+20% Power Grid efficiency in storm blackouts',
  },
  {
    level: 5,
    title: 'Coastal Storm-Proof Sanctuary',
    description: 'The ultimate fortified Tamil Nadu coastal haven. Impervious to severe cyclone gales!',
    requirements: { wood: 15, rope: 10, lights: 8, electronics: 8, bricks: 12 },
    bonusPerk: 'Permanent immunity to home storm destruction & +100 Coins per level',
  },
];

export const HomeBuilderModal: React.FC<HomeBuilderModalProps> = ({
  materials,
  structure,
  homesBuiltCount = 1,
  onUpgradeHome,
  onConstructAdditionalHome,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nextStage = UPGRADE_STAGES.find(s => s.level === structure.level + 1);

  // Check if player has enough materials for next upgrade
  const canAffordNext = nextStage
    ? materials.wood >= nextStage.requirements.wood &&
      materials.rope >= nextStage.requirements.rope &&
      materials.lights >= nextStage.requirements.lights &&
      materials.electronics >= nextStage.requirements.electronics &&
      materials.bricks >= nextStage.requirements.bricks
    : false;

  // Render 2D Home graphic on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Sky & Coastal Horizon
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.7, '#1e293b');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ground Grass / Coastal Sand
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, h - 80, w, 80);

    ctx.fillStyle = '#166534';
    ctx.fillRect(0, h - 70, w, 10);

    const houseX = w / 2 - 140;
    const houseY = h - 230;
    const houseW = 280;
    const houseH = 150;

    if (structure.level === 0) {
      // DESTROYED HOME (Debris, broken planks, storm aftermath)
      ctx.fillStyle = '#78350f';
      // Fallen beams
      ctx.save();
      ctx.translate(houseX + 40, houseY + 80);
      ctx.rotate(0.35);
      ctx.fillRect(0, 0, 160, 18);
      ctx.restore();

      ctx.save();
      ctx.translate(houseX + 110, houseY + 70);
      ctx.rotate(-0.4);
      ctx.fillRect(0, 0, 150, 16);
      ctx.restore();

      // Broken bricks
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(houseX + 30, houseY + 115, 25, 14);
      ctx.fillRect(houseX + 80, houseY + 120, 28, 14);
      ctx.fillRect(houseX + 170, houseY + 110, 26, 14);
      ctx.fillRect(houseX + 220, houseY + 122, 24, 14);

      // Warning hazard smoke
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(houseX + 140, houseY + 90, 70, 0, Math.PI * 2);
      ctx.fill();

      // Signpost: "Destroyed by Cyclone"
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ HOME DESTROYED BY CYCLONE', w / 2, houseY + 50);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px "Outfit", sans-serif';
      ctx.fillText('Solve questions to gather materials and rebuild your home!', w / 2, houseY + 72);
    } else {
      // LEVEL 1: FOUNDATION
      ctx.fillStyle = '#475569';
      ctx.fillRect(houseX, houseY + 120, houseW, 30);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(houseX, houseY + 120, houseW, 30);

      // Brick pattern
      ctx.fillStyle = '#991b1b';
      for (let bx = houseX + 5; bx < houseX + houseW - 10; bx += 28) {
        ctx.fillRect(bx, houseY + 125, 24, 20);
      }

      // LEVEL 2: PILLARS & FRAME
      if (structure.level >= 2) {
        ctx.fillStyle = '#b45309'; // Sturdy teakwood pillars
        ctx.fillRect(houseX + 10, houseY + 20, 22, 100);
        ctx.fillRect(houseX + houseW - 32, houseY + 20, 22, 100);
        ctx.fillRect(houseX + 130, houseY + 20, 20, 100);

        // Cross beam
        ctx.fillRect(houseX + 5, houseY + 15, houseW - 10, 16);
      }

      // LEVEL 3: WALLS & ROOF
      if (structure.level >= 3) {
        // Walls
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(houseX + 32, houseY + 31, 98, 89);
        ctx.fillRect(houseX + 150, houseY + 31, 98, 89);

        // Windows
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(houseX + 50, houseY + 45, 36, 36);
        ctx.fillRect(houseX + 195, houseY + 45, 36, 36);
        ctx.strokeStyle = '#0f172a';
        ctx.strokeRect(houseX + 50, houseY + 45, 36, 36);
        ctx.strokeRect(houseX + 195, houseY + 45, 36, 36);

        // Door
        ctx.fillStyle = '#78350f';
        ctx.fillRect(houseX + 120, houseY + 55, 40, 65);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(houseX + 152, houseY + 88, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Clay tile gable roof
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(houseX - 15, houseY + 15);
        ctx.lineTo(w / 2, houseY - 55);
        ctx.lineTo(houseX + houseW + 15, houseY + 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // LEVEL 4: ELECTRICAL & LIGHTS
      if (structure.level >= 4) {
        // Glowing warm light from windows
        ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
        ctx.fillRect(houseX + 50, houseY + 45, 36, 36);
        ctx.fillRect(houseX + 195, houseY + 45, 36, 36);

        // Rooftop solar panel
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(w / 2 - 45, houseY - 45, 90, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w / 2 - 45, houseY - 45, 90, 24);

        // Porch Lantern
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(houseX + 112, houseY + 52, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // LEVEL 5: STORM SANCTUARY
      if (structure.level >= 5) {
        // Forcefield dome / steel shutters
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w / 2, houseY + 45, 175, Math.PI, 0);
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🛡️ FORTIFIED STORM SANCTUARY', w / 2, houseY - 70);
      }
    }
  }, [structure.level]);

  const handleBuild = () => {
    if (!nextStage || !canAffordNext) return;
    soundManager.playSuccess();
    onUpgradeHome(nextStage.level, nextStage.requirements);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Home Reconstruction Workshop
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Rebuild Your Coastal Shelter
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

        {/* Level Promotion Quest Tracker (User Request: "if i build 5 home and rescue from storm 2 times .promote to next level") */}
        <div className="p-3 bg-gradient-to-r from-amber-950/60 via-neutral-900 to-emerald-950/60 rounded-xl border border-amber-500/40 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-bold text-amber-300">Level Promotion Requirement:</div>
              <div className="text-[11px] text-neutral-300">Build 5 Homes & Survive 2 Storms to advance to next level!</div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-amber-500/50 text-amber-400 font-mono-code font-bold text-xs shrink-0">
            🏡 Homes Built: {homesBuiltCount} / 5 {homesBuiltCount >= 5 ? '✅' : ''}
          </div>
        </div>

        {/* Narrative Theory Callout */}
        <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">The Story of Your Home: </strong>
            When violent storms hit coastal Tamil Nadu, the gale damages and destroys unprotected homes.
            By answering challenges and conquering levels, you earn construction materials (Wood, Rope, Lights, Electronics, and Bricks) to restore and fortify your personal sanctuary!
          </div>
        </div>

        {/* 2D Visual Preview Canvas */}
        <div className="w-full flex justify-center bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={640}
            height={260}
            className="w-full h-auto block select-none"
          />
        </div>

        {/* Materials Inventory Bar */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono-code text-neutral-400 uppercase font-semibold">
            Collected Construction Materials:
          </span>
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono-code">
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-lg">🪵</span>
              <span className="text-neutral-400 text-[10px]">Wood</span>
              <span className="text-amber-400 font-bold text-sm">{materials.wood}</span>
            </div>

            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-lg">🪢</span>
              <span className="text-neutral-400 text-[10px]">Rope</span>
              <span className="text-yellow-400 font-bold text-sm">{materials.rope}</span>
            </div>

            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-lg">💡</span>
              <span className="text-neutral-400 text-[10px]">Lights</span>
              <span className="text-cyan-400 font-bold text-sm">{materials.lights}</span>
            </div>

            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-lg">🔌</span>
              <span className="text-neutral-400 text-[10px]">Electronics</span>
              <span className="text-purple-400 font-bold text-sm">{materials.electronics}</span>
            </div>

            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-0.5">
              <span className="text-lg">🧱</span>
              <span className="text-neutral-400 text-[10px]">Bricks</span>
              <span className="text-rose-400 font-bold text-sm">{materials.bricks}</span>
            </div>
          </div>
        </div>

        {/* Current State & Next Upgrade */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-neutral-400 uppercase">Current Shelter Status:</span>
              <span className="text-xs font-bold font-mono-code text-amber-400">
                {structure.level === 0 ? 'Destroyed Ruins' : `Stage ${structure.level} of 5 Completed`}
              </span>
            </div>
            <span className="text-xs font-mono-code text-emerald-400">
              Durability: {structure.level * 20}%
            </span>
          </div>

          {nextStage ? (
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-neutral-100 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-amber-400" />
                  <span>Next Upgrade: {nextStage.title}</span>
                </h4>
                <span className="text-[10px] font-mono-code text-cyan-300">
                  {nextStage.bonusPerk}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{nextStage.description}</p>

              {/* Requirements row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800 text-[11px] font-mono-code">
                <span className="text-neutral-400">Requires:</span>
                <span className={materials.wood >= nextStage.requirements.wood ? 'text-emerald-400' : 'text-rose-400'}>
                  🪵 {materials.wood}/{nextStage.requirements.wood} Wood
                </span>
                <span className={materials.rope >= nextStage.requirements.rope ? 'text-emerald-400' : 'text-rose-400'}>
                  🪢 {materials.rope}/{nextStage.requirements.rope} Rope
                </span>
                {nextStage.requirements.bricks > 0 && (
                  <span className={materials.bricks >= nextStage.requirements.bricks ? 'text-emerald-400' : 'text-rose-400'}>
                    🧱 {materials.bricks}/{nextStage.requirements.bricks} Bricks
                  </span>
                )}
                {nextStage.requirements.lights > 0 && (
                  <span className={materials.lights >= nextStage.requirements.lights ? 'text-emerald-400' : 'text-rose-400'}>
                    💡 {materials.lights}/{nextStage.requirements.lights} Lights
                  </span>
                )}
                {nextStage.requirements.electronics > 0 && (
                  <span className={materials.electronics >= nextStage.requirements.electronics ? 'text-emerald-400' : 'text-rose-400'}>
                    🔌 {materials.electronics}/{nextStage.requirements.electronics} Electronics
                  </span>
                )}
              </div>

              <button
                onClick={handleBuild}
                disabled={!canAffordNext}
                className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer mt-1 ${
                  canAffordNext
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <Hammer className="w-4 h-4" />
                <span>{canAffordNext ? `Construct ${nextStage.title}` : 'Gather More Materials from Levels'}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Home 100% Rebuilt!</strong> Your shelter is now a coastal storm-proof sanctuary capable of withstanding the fiercest Tamil Nadu cyclones!
              </span>
            </div>
          )}

          {/* Option to construct additional coastal homes / outposts across the island */}
          {structure.level >= 5 && onConstructAdditionalHome && (
            <div className="p-3.5 bg-neutral-900 rounded-xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-amber-400" />
                  Construct Additional Coastal Outpost Home
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Expand survivor shelters across the island! Adds +1 to your Homes Built count (Currently: {homesBuiltCount}/5).
                </p>
                <div className="text-[10px] font-mono-code text-neutral-300 mt-1">
                  Requires: <span className={materials.wood >= 4 ? 'text-emerald-400' : 'text-rose-400'}>🪵 {materials.wood}/4 Wood</span> · <span className={materials.bricks >= 3 ? 'text-emerald-400' : 'text-rose-400'}>🧱 {materials.bricks}/3 Bricks</span>
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onConstructAdditionalHome();
                }}
                disabled={materials.wood < 4 || materials.bricks < 3}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span>Build Outpost (+1 Home)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs font-mono-code text-neutral-400">
          <span>Earn materials on every finished level</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-lg transition cursor-pointer"
          >
            Close Workshop
          </button>
        </div>
      </div>
    </div>
  );
};
