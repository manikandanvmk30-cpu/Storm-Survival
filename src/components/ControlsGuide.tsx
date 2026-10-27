import React, { useState, useEffect } from 'react';
import { Keyboard, Gamepad2, X, Maximize2 } from 'lucide-react';

interface ControlsGuideProps {
  isMobileMode: boolean;
  onClose: () => void;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({ isMobileMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-800/90 border-b border-neutral-700">
          <div className="flex items-center gap-2.5">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-neutral-100 text-sm tracking-wide">
              Game Controls & Claim Keys Guide (PC & Mobile)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[80vh] overflow-y-auto">
          {/* Joystick & Directional Movement */}
          <Section title="🕹️ Joystick & Direction Arrows">
            <Row icon="▲" action="Move Up" keys="Up Arrow / Drag Up / W" color="text-amber-400" />
            <Row icon="▼" action="Move Down" keys="Down Arrow / Drag Down / S" color="text-amber-400" />
            <Row icon="◀" action="Move Left" keys="Left Arrow / Drag Left / A" color="text-amber-400" />
            <Row icon="▶" action="Move Right" keys="Right Arrow / Drag Right / D" color="text-amber-400" />
            <Row icon="🎮" action="Toggle Joystick Mode" keys="J Key or Top Button" color="text-cyan-400" />
          </Section>

          {/* Action & Claim Keys */}
          <Section title="🎯 Claim Keys (○ □ △ ×)">
            <Row
              icon="○"
              action="CLAIM / Interact"
              keys="Circle / E / Enter"
              color="text-red-400 font-bold"
            />
            <Row
              icon="□"
              action="Repair / Option B"
              keys="Square / Q / R"
              color="text-amber-400"
            />
            <Row
              icon="△"
              action="Super Power / Option A"
              keys="Triangle / Space"
              color="text-emerald-400"
            />
            <Row
              icon="×"
              action="Cancel / Close / Option D"
              keys="Cross / Esc"
              color="text-sky-400"
            />
          </Section>

          {/* Display & Fullscreen */}
          <Section title="🖥️ Full Screen & Display">
            <Row
              icon="⛶"
              action="Full Screen (PC & Mobile)"
              keys="F11 or Fullscreen Button"
              color="text-amber-300"
            />
            <Row icon="🔕" action="Mute / Unmute Audio" keys="M Key / Top Icon" />
            <Row icon="📖" action="Controls Guide" keys="Tab Key / Slider" />
          </Section>

          {/* Quick Survival Hotbar */}
          <Section title="🎒 Survival Quick Items">
            <Row icon="🍗" action="Eat Food (+Health & Hunger)" keys="1 Key / Tap Slot" />
            <Row icon="💧" action="Drink Water (+Water)" keys="2 Key / Tap Slot" />
            <Row icon="🔋" action="Recharge Energy Battery" keys="3 Key / Tap Slot" />
            <Row icon="🩹" action="Use First Aid Medkit" keys="4 Key / Tap Slot" />
            <Row icon="🚗" action="Drive / Exit Beach Buggy" keys="F Key" />
          </Section>
        </div>

        <div className="px-6 py-3.5 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>🎮 Works seamlessly with Touch on Mobile and Mouse/Keyboard on PC</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 border-b border-neutral-800 pb-1 flex items-center gap-1.5">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  icon,
  action,
  keys,
  color = 'text-neutral-300',
}: {
  icon: string;
  action: string;
  keys: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs p-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
      <span className={`flex items-center gap-2 ${color}`}>
        <span className="font-bold text-sm w-5 text-center shrink-0">{icon}</span>
        <span className="text-neutral-200 font-medium">{action}</span>
      </span>
      <span className="font-mono text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-amber-300/90 border border-neutral-700/80 shrink-0 font-semibold">
        {keys}
      </span>
    </div>
  );
}

// Robust helper to check if the current device is genuinely a mobile phone or small mobile device
export function checkIsMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = (navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '').toLowerCase();
  // True mobile phone user agents
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isSmallScreen = window.innerWidth <= 768;
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0);

  // A device is mobile only if it has a mobile UA or has small mobile screen width with touch
  return isMobileUA || (isSmallScreen && hasTouch);
}

// Hook to detect mobile devices
export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState<boolean>(() => checkIsMobileDevice());

  useEffect(() => {
    const check = () => {
      setIsMobile(checkIsMobileDevice());
    };
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isMobile;
}
