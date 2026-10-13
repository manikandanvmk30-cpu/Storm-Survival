import React from 'react';
import {
  HelpCircle,
  Wind,
  Heart,
  Zap,
  Gem,
  Coins,
  Users,
  Award,
  BookOpen,
  X,
} from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono-code text-amber-400 uppercase tracking-wider font-semibold">
                Operational Doctrine
              </span>
              <h2 className="text-lg font-bold font-display text-neutral-100">
                Storm Survival: Field Survival & Home Rebuilding Guide
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

        {/* Content sections */}
        <div className="flex flex-col gap-4 text-xs text-neutral-300 leading-relaxed">
          {/* Mission Scope & Home Destruction */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-1.5">
            <h3 className="font-bold text-amber-300 font-display text-sm">
              1. The Mission: Survive the Cyclone & Rebuild Your Home
            </h3>
            <p>
              A severe Bay of Bengal cyclonic storm has struck coastal Tamil Nadu, destroying homes and infrastructure!
              As Commander, your home has been damaged. You must answer questions across 50 progressive levels (Earth → Asia → India → Tamil Nadu) to earn construction materials (Wood, Rope, Lights, Electronics, Bricks) and rebuild your home into a fortified storm-proof sanctuary!
            </p>
          </div>

          {/* Storm & Visibility */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold font-display text-sm">
              <Wind className="w-4 h-4" />
              <span>2. 5 Dynamic Cyclone Levels & Reduced Visibility</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400">
              <li><strong className="text-neutral-200">Level 1 (Depression):</strong> 45 km/h wind, 95% visibility. Coastal rain.</li>
              <li><strong className="text-neutral-200">Level 2 (Deep Depression):</strong> 75 km/h wind, 75% visibility. Tree branches swaying.</li>
              <li><strong className="text-neutral-200">Level 3 (Cyclonic Storm):</strong> 115 km/h wind, 50% visibility. Power line disruptions.</li>
              <li><strong className="text-neutral-200">Level 4 (Severe Cyclone):</strong> 165 km/h wind, 25% visibility. Torrential rain, lightning.</li>
              <li><strong className="text-neutral-200">Level 5 (Super Cyclone):</strong> 220+ km/h wind, 10% visibility. Extreme gale triage required.</li>
            </ul>
          </div>

          {/* Resources & Health */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-display text-sm">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>3. Dynamic Health & Rebuilding Material Drops</span>
            </div>
            <p>
              Start with <strong className="text-neutral-200">100% Health</strong>. Incorrect answers reduce health (-10%).
              Health Kits cost <strong className="text-yellow-300">100 coins</strong> in the shop and restore <strong className="text-rose-300">+25% Health</strong> (capped at 100%).
              Every correct answer grants <strong className="text-amber-300">Wood, Rope, Lights, Electronics, and Bricks</strong> to reconstruct your destroyed home.
            </p>
          </div>

          {/* 3 Simplified Stations */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-display text-sm">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span>4. 3 Simple Stations: Easy, Medium, and Hard</span>
            </div>
            <p>
              Each level contains 15 curated questions across 3 stations:
              <strong className="text-emerald-400"> Easy (10 Questions, 1 pt each)</strong>,
              <strong className="text-amber-400"> Medium (3 Questions, 2 pts each)</strong>, and
              <strong className="text-purple-400"> Hard (2 Questions, 3 pts each)</strong>.
              Questions are never repeated. Spend <strong className="text-cyan-300">1 Diamond</strong> for helpful guided hints.
            </p>
          </div>

          {/* Educational Focus */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-display text-sm">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>5. Curated Curriculum: Earth → Asia → India → Tamil Nadu</span>
            </div>
            <p>
              Covers Mathematics, Science, Tamil (இலக்கணம், இலக்கியம், திருக்குறள்), English (Grammar, Vocabulary), and Social Science focusing specifically on Earth geography, Asian history, Indian independence, and Tamil Nadu culture and heritage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <span className="text-[11px] font-mono-code text-neutral-400">
            Coastal Storm Emergency & Home Rebuilding Protocol
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Understood, Commander
          </button>
        </div>
      </div>
    </div>
  );
};
