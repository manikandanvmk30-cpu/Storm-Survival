import React, { useState, useCallback } from 'react';

export type ActionButtonId = 'circle' | 'square' | 'triangle' | 'cross';

export interface ActionButtonConfig {
  id: ActionButtonId;
  symbol: string;
  label: string;
  color: string;
  glowColor: string;
  keyHint: string;
}

export const ACTION_BUTTONS: ActionButtonConfig[] = [
  {
    id: 'triangle',
    symbol: '△',
    label: 'Hero Power',
    color: 'rgb(74,222,128)', // Emerald Green
    glowColor: 'rgba(74,222,128,0.7)',
    keyHint: 'Space',
  },
  {
    id: 'square',
    symbol: '□',
    label: 'Repair / Tool',
    color: 'rgb(251,191,36)', // Amber Yellow
    glowColor: 'rgba(251,191,36,0.7)',
    keyHint: 'Q / R',
  },
  {
    id: 'circle',
    symbol: '○',
    label: 'Claim / Interact',
    color: 'rgb(248,113,113)', // Coral Red
    glowColor: 'rgba(248,113,113,0.7)',
    keyHint: 'E / Enter',
  },
  {
    id: 'cross',
    symbol: '×',
    label: 'Cancel / Close',
    color: 'rgb(96,165,250)', // Ocean Sky Blue
    glowColor: 'rgba(96,165,250,0.7)',
    keyHint: 'Esc',
  },
];

interface ActionButtonsProps {
  onAction: (action: ActionButtonId) => void;
  disabledDuringQuestion?: boolean;
  questionActive?: boolean;
  questionAnswered?: boolean;
  canClaimReward?: boolean;
  nearInteractive?: boolean;
  interactivePrompt?: string;
  activeKeys?: {
    space?: boolean;
    q?: boolean;
    e?: boolean;
    esc?: boolean;
  };
  size?: number;
  opacity?: number;
  className?: string;
}

// Diamond layout positions: top=triangle, left=square, right=circle, bottom=cross
const DIAMOND_POSITIONS: Record<ActionButtonId, { top: string; left: string }> = {
  triangle: { top: '0%', left: '50%' },
  square: { top: '50%', left: '0%' },
  circle: { top: '50%', left: '100%' },
  cross: { top: '100%', left: '50%' },
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAction,
  disabledDuringQuestion = false,
  questionActive = false,
  questionAnswered = false,
  canClaimReward = false,
  nearInteractive = false,
  interactivePrompt,
  activeKeys = {},
  size = 54,
  opacity = 0.92,
  className = '',
}) => {
  const [pressed, setPressed] = useState<ActionButtonId | null>(null);
  const [lastPress, setLastPress] = useState<number>(0);

  const containerSize = size * 3.3;

  const handlePress = useCallback(
    (id: ActionButtonId, e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastPress < 120) return;
      setLastPress(now);

      setPressed(id);
      onAction(id);
      setTimeout(() => setPressed(null), 180);
    },
    [lastPress, onAction]
  );

  return (
    <div
      className={`relative select-none touch-none ${className}`}
      style={{ width: containerSize, height: containerSize, opacity }}
    >
      {/* Background linking geometric lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={containerSize}
        height={containerSize}
      >
        <circle
          cx="50%"
          cy="50%"
          r={containerSize * 0.38}
          fill="rgba(15,15,15,0.4)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
        />
        <line
          x1="50%"
          y1="14%"
          x2="50%"
          y2="86%"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <line
          x1="14%"
          y1="50%"
          x2="86%"
          y2="50%"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Claim / Action Buttons (△, □, ○, ×) */}
      {ACTION_BUTTONS.map(btn => {
        const pos = DIAMOND_POSITIONS[btn.id];

        // Check if keyboard key is active on PC
        const isKeyboardActive =
          (btn.id === 'triangle' && activeKeys.space) ||
          (btn.id === 'square' && activeKeys.q) ||
          (btn.id === 'circle' && activeKeys.e) ||
          (btn.id === 'cross' && activeKeys.esc);

        const isPressed = pressed === btn.id || isKeyboardActive;

        // Contextual labeling and highlighting
        let dynamicLabel = btn.label;
        let isSpecialHighlight = false;

        if (questionActive && !questionAnswered) {
          if (btn.id === 'triangle') dynamicLabel = 'Option A [△]';
          if (btn.id === 'square') dynamicLabel = 'Option B [□]';
          if (btn.id === 'circle') dynamicLabel = 'Option C [○]';
          if (btn.id === 'cross') dynamicLabel = 'Option D [×]';
        } else if (questionAnswered && canClaimReward) {
          if (btn.id === 'circle') {
            dynamicLabel = 'CLAIM [○]';
            isSpecialHighlight = true;
          }
          if (btn.id === 'cross') dynamicLabel = 'Close [×]';
        } else if (nearInteractive && btn.id === 'circle') {
          dynamicLabel = interactivePrompt || 'CLAIM / QUIZ [○]';
          isSpecialHighlight = true;
        }

        return (
          <button
            key={btn.id}
            type="button"
            onTouchStart={e => handlePress(btn.id, e)}
            onMouseDown={e => handlePress(btn.id, e)}
            aria-label={dynamicLabel}
            title={`${dynamicLabel} [${btn.keyHint}]`}
            className={`absolute flex flex-col items-center justify-center rounded-full border-2 font-bold cursor-pointer transition-all duration-150 active:scale-90 ${
              isSpecialHighlight ? 'animate-bounce ring-2 ring-emerald-400' : ''
            }`}
            style={{
              width: size,
              height: size,
              top: pos.top,
              left: pos.left,
              transform: `translate(-50%, -50%) scale(${isPressed ? 0.88 : 1})`,
              background: isPressed
                ? `radial-gradient(circle, ${btn.color} 0%, ${btn.glowColor} 100%)`
                : isSpecialHighlight
                ? `radial-gradient(circle, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.4) 100%)`
                : `radial-gradient(circle, rgba(28,25,23,0.95) 0%, rgba(10,10,10,0.95) 100%)`,
              borderColor: isPressed
                ? '#ffffff'
                : isSpecialHighlight
                ? '#34d399'
                : `${btn.color}aa`,
              boxShadow: isPressed
                ? `0 0 24px ${btn.glowColor}, 0 0 45px ${btn.glowColor}`
                : isSpecialHighlight
                ? `0 0 20px rgba(52,211,153,0.8), 0 0 35px rgba(52,211,153,0.4)`
                : `0 4px 14px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2)`,
              color: isPressed ? '#000000' : isSpecialHighlight ? '#ffffff' : btn.color,
              zIndex: 15,
            }}
          >
            {/* Symbol: △, □, ○, × */}
            <span
              className="leading-none select-none"
              style={{ fontSize: size * 0.44, fontWeight: 900 }}
            >
              {btn.symbol}
            </span>

            {/* PC key hint tag inside the button */}
            <span
              className="font-mono text-[8px] leading-none opacity-80 mt-0.5"
              style={{ color: isPressed ? '#000000' : 'rgba(255,255,255,0.7)' }}
            >
              {btn.keyHint.split(' ')[0]}
            </span>

            {/* Floating text label */}
            <span
              className={`absolute font-mono font-bold whitespace-nowrap pointer-events-none transition-all px-1.5 py-0.5 rounded shadow-sm ${
                isSpecialHighlight
                  ? 'bg-emerald-500 text-neutral-950 text-[10px] font-black'
                  : 'text-neutral-200 bg-neutral-900/90 border border-neutral-800 text-[9px]'
              }`}
              style={{
                top: btn.id === 'cross' ? '108%' : btn.id === 'triangle' ? '-50%' : '106%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {dynamicLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
};
