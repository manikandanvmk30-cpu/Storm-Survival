import React, { useRef, useEffect, useCallback, useState } from 'react';

export interface JoystickState {
  dx: number; // -1 to 1
  dy: number; // -1 to 1
  active: boolean;
}

interface VirtualJoystickProps {
  onMove: (state: JoystickState) => void;
  size?: number;
  className?: string;
  opacity?: number;
  activeDirections?: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

type Direction = 'up' | 'down' | 'left' | 'right';

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
  onMove,
  size = 148,
  className = '',
  opacity = 0.9,
  activeDirections = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const activeArrowRef = useRef<Direction | null>(null);
  const arrowIntervalRef = useRef<number | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [pressedArrow, setPressedArrow] = useState<Direction | null>(null);

  const radius = size / 2;
  const stickRadius = size * 0.22;
  const maxDist = radius - stickRadius - 6;

  const getCenter = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { cx: 0, cy: 0 };
    const rect = el.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  }, []);

  const computeJoystick = useCallback(
    (clientX: number, clientY: number) => {
      const { cx, cy } = getCenter();
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
      }
      setStickPos({ x: dx, y: dy });
      const normDx = maxDist > 0 ? dx / maxDist : 0;
      const normDy = maxDist > 0 ? dy / maxDist : 0;
      onMove({ dx: normDx, dy: normDy, active: true });
    },
    [getCenter, maxDist, onMove]
  );

  const resetStick = useCallback(() => {
    setIsActive(false);
    setStickPos({ x: 0, y: 0 });
    touchIdRef.current = null;
    isMouseDownRef.current = false;
    onMove({ dx: 0, dy: 0, active: false });
  }, [onMove]);

  // Handle D-Pad Arrow Press (Click or Touch)
  const handleArrowPress = useCallback(
    (dir: Direction) => {
      setPressedArrow(dir);
      activeArrowRef.current = dir;

      let dx = 0;
      let dy = 0;
      if (dir === 'up') dy = -1;
      if (dir === 'down') dy = 1;
      if (dir === 'left') dx = -1;
      if (dir === 'right') dx = 1;

      // Animate stick knob toward the direction
      setStickPos({ x: dx * (maxDist * 0.8), y: dy * (maxDist * 0.8) });
      setIsActive(true);
      onMove({ dx, dy, active: true });

      if (arrowIntervalRef.current) clearInterval(arrowIntervalRef.current);
      arrowIntervalRef.current = window.setInterval(() => {
        if (activeArrowRef.current === dir) {
          onMove({ dx, dy, active: true });
        }
      }, 50);
    },
    [maxDist, onMove]
  );

  const handleArrowRelease = useCallback(() => {
    setPressedArrow(null);
    activeArrowRef.current = null;
    if (arrowIntervalRef.current) {
      clearInterval(arrowIntervalRef.current);
      arrowIntervalRef.current = null;
    }
    resetStick();
  }, [resetStick]);

  // Touch Event Handlers
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // If user tapped directly on an arrow button, let the arrow handler take precedence
      const target = e.target as HTMLElement;
      if (target?.closest('[data-arrow-btn]')) return;

      e.preventDefault();
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      setIsActive(true);
      computeJoystick(touch.clientX, touch.clientY);
    },
    [computeJoystick]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          computeJoystick(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [computeJoystick]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          resetStick();
          break;
        }
      }
    },
    [resetStick]
  );

  // Mouse Event Handlers (For PC Joystick Mode)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest('[data-arrow-btn]')) return;

      e.preventDefault();
      isMouseDownRef.current = true;
      setIsActive(true);
      computeJoystick(e.clientX, e.clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isMouseDownRef.current) return;
        computeJoystick(moveEvent.clientX, moveEvent.clientY);
      };

      const handleMouseUp = () => {
        isMouseDownRef.current = false;
        resetStick();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [computeJoystick, resetStick]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
      if (arrowIntervalRef.current) clearInterval(arrowIntervalRef.current);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Visual state from either internal arrow press, external keyboard press, or joystick offset
  const isUp = pressedArrow === 'up' || activeDirections.up || stickPos.y < -maxDist * 0.35;
  const isDown = pressedArrow === 'down' || activeDirections.down || stickPos.y > maxDist * 0.35;
  const isLeft = pressedArrow === 'left' || activeDirections.left || stickPos.x < -maxDist * 0.35;
  const isRight = pressedArrow === 'right' || activeDirections.right || stickPos.x > maxDist * 0.35;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`relative select-none touch-none ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      {/* Outer base circular ring with aerospace metallic border */}
      <div
        className="absolute inset-0 rounded-full border-2 border-amber-500/30 bg-neutral-950/85 backdrop-blur-md shadow-2xl"
        style={{
          boxShadow:
            '0 0 28px rgba(0,0,0,0.85), inset 0 0 20px rgba(245,158,11,0.08), 0 0 8px rgba(245,158,11,0.2)',
        }}
      />

      {/* Crosshair guide lines */}
      <svg className="absolute inset-0 pointer-events-none" width={size} height={size}>
        <line
          x1="50%"
          y1="8%"
          x2="50%"
          y2="92%"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
        <line
          x1="8%"
          y1="50%"
          x2="92%"
          y2="50%"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
          strokeDasharray="2 3"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius * 0.55}
          fill="none"
          stroke="rgba(245,158,11,0.12)"
          strokeWidth="1"
        />
      </svg>

      {/* 4 Interactive D-Pad Arrow Buttons: Up, Down, Left, Right */}
      {/* UP ARROW */}
      <button
        type="button"
        data-arrow-btn="up"
        onMouseDown={e => {
          e.stopPropagation();
          handleArrowPress('up');
        }}
        onMouseUp={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        onMouseLeave={handleArrowRelease}
        onTouchStart={e => {
          e.stopPropagation();
          handleArrowPress('up');
        }}
        onTouchEnd={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        className={`absolute top-1 left-1/2 -translate-x-1/2 w-9 h-8 rounded-t-xl rounded-b-md flex flex-col items-center justify-center transition-all cursor-pointer z-20 ${
          isUp
            ? 'bg-amber-400 text-neutral-950 scale-110 shadow-lg shadow-amber-400/60 ring-2 ring-amber-300'
            : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/80 border border-neutral-700/60'
        }`}
        title="Move Up [W / ↑]"
        aria-label="Move Up"
      >
        <span className="text-xs font-black leading-none">▲</span>
        <span className="text-[7px] font-mono leading-none opacity-70">W/↑</span>
      </button>

      {/* DOWN ARROW */}
      <button
        type="button"
        data-arrow-btn="down"
        onMouseDown={e => {
          e.stopPropagation();
          handleArrowPress('down');
        }}
        onMouseUp={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        onMouseLeave={handleArrowRelease}
        onTouchStart={e => {
          e.stopPropagation();
          handleArrowPress('down');
        }}
        onTouchEnd={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-9 h-8 rounded-b-xl rounded-t-md flex flex-col items-center justify-center transition-all cursor-pointer z-20 ${
          isDown
            ? 'bg-amber-400 text-neutral-950 scale-110 shadow-lg shadow-amber-400/60 ring-2 ring-amber-300'
            : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/80 border border-neutral-700/60'
        }`}
        title="Move Down [S / ↓]"
        aria-label="Move Down"
      >
        <span className="text-[7px] font-mono leading-none opacity-70">S/↓</span>
        <span className="text-xs font-black leading-none">▼</span>
      </button>

      {/* LEFT ARROW */}
      <button
        type="button"
        data-arrow-btn="left"
        onMouseDown={e => {
          e.stopPropagation();
          handleArrowPress('left');
        }}
        onMouseUp={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        onMouseLeave={handleArrowRelease}
        onTouchStart={e => {
          e.stopPropagation();
          handleArrowPress('left');
        }}
        onTouchEnd={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        className={`absolute left-1 top-1/2 -translate-y-1/2 w-8 h-9 rounded-l-xl rounded-r-md flex flex-col items-center justify-center transition-all cursor-pointer z-20 ${
          isLeft
            ? 'bg-amber-400 text-neutral-950 scale-110 shadow-lg shadow-amber-400/60 ring-2 ring-amber-300'
            : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/80 border border-neutral-700/60'
        }`}
        title="Move Left [A / ←]"
        aria-label="Move Left"
      >
        <span className="text-xs font-black leading-none">◀</span>
        <span className="text-[7px] font-mono leading-none opacity-70">A/←</span>
      </button>

      {/* RIGHT ARROW */}
      <button
        type="button"
        data-arrow-btn="right"
        onMouseDown={e => {
          e.stopPropagation();
          handleArrowPress('right');
        }}
        onMouseUp={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        onMouseLeave={handleArrowRelease}
        onTouchStart={e => {
          e.stopPropagation();
          handleArrowPress('right');
        }}
        onTouchEnd={e => {
          e.stopPropagation();
          handleArrowRelease();
        }}
        className={`absolute right-1 top-1/2 -translate-y-1/2 w-8 h-9 rounded-r-xl rounded-l-md flex flex-col items-center justify-center transition-all cursor-pointer z-20 ${
          isRight
            ? 'bg-amber-400 text-neutral-950 scale-110 shadow-lg shadow-amber-400/60 ring-2 ring-amber-300'
            : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/80 border border-neutral-700/60'
        }`}
        title="Move Right [D / →]"
        aria-label="Move Right"
      >
        <span className="text-xs font-black leading-none">▶</span>
        <span className="text-[7px] font-mono leading-none opacity-70">D/→</span>
      </button>

      {/* Center Analog Stick Knob (Drag with touch or mouse) */}
      <div
        className="absolute rounded-full border-2 transition-none cursor-grab active:cursor-grabbing z-30 flex items-center justify-center pointer-events-none"
        style={{
          width: stickRadius * 2,
          height: stickRadius * 2,
          left: radius - stickRadius + stickPos.x,
          top: radius - stickRadius + stickPos.y,
          boxShadow: isActive
            ? '0 0 20px rgba(245,158,11,0.9), 0 0 35px rgba(245,158,11,0.5), inset 0 2px 4px rgba(255,255,255,0.4)'
            : '0 4px 12px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.2)',
          background: isActive
            ? 'radial-gradient(circle at 35% 35%, rgba(251,191,36,1) 0%, rgba(217,119,6,0.95) 70%, rgba(180,83,9,1) 100%)'
            : 'radial-gradient(circle at 35% 35%, rgba(68,68,68,1) 0%, rgba(32,32,32,0.95) 70%, rgba(18,18,18,1) 100%)',
          borderColor: isActive ? 'rgba(254,240,138,0.95)' : 'rgba(163,163,163,0.6)',
        }}
      >
        {/* Thumb grip rings */}
        <div
          className={`w-3 h-3 rounded-full border ${
            isActive ? 'border-neutral-950/60 bg-amber-200/40' : 'border-white/20 bg-white/5'
          }`}
        />
      </div>
    </div>
  );
};
