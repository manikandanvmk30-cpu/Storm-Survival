import React, { useCallback, useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenButtonProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'floating' | 'compact' | 'prominent';
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      document.documentElement.classList.contains('simulated-fullscreen')
    );
  });

  useEffect(() => {
    const onChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };
      const active = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement ||
        document.documentElement.classList.contains('simulated-fullscreen')
      );
      setIsFullscreen(active);
    };

    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    document.addEventListener('mozfullscreenchange', onChange);
    document.addEventListener('MSFullscreenChange', onChange);

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
      document.removeEventListener('mozfullscreenchange', onChange);
      document.removeEventListener('MSFullscreenChange', onChange);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      } else {
        // Fallback for iOS Safari which does not support requestFullscreen on documentElement
        document.documentElement.classList.add('simulated-fullscreen');
        setIsFullscreen(true);
      }
    } catch {
      // Fallback if browser blocks or restricts requestFullscreen
      document.documentElement.classList.add('simulated-fullscreen');
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      document.documentElement.classList.remove('simulated-fullscreen');
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        webkitFullscreenElement?: Element | null;
        mozFullScreenElement?: Element | null;
        msFullscreenElement?: Element | null;
      };

      if (doc.exitFullscreen && doc.fullscreenElement) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen && doc.webkitFullscreenElement) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen && doc.mozFullScreenElement) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen && doc.msFullscreenElement) {
        await doc.msExitFullscreen();
      } else if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch {
      document.documentElement.classList.remove('simulated-fullscreen');
      setIsFullscreen(false);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // F11 keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleFullscreen]);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  className = '',
  showLabel = true,
  variant = 'default',
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit Full Screen [F11]' : 'Enter Full Screen [F11]'}
        aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md shadow-2xl transition-all cursor-pointer font-bold text-xs select-none active:scale-95 ${
          isFullscreen
            ? 'bg-amber-500/90 hover:bg-amber-400 text-neutral-950 border border-amber-300 shadow-amber-500/30'
            : 'bg-neutral-900/90 hover:bg-neutral-800 text-amber-400 border border-amber-500/50 shadow-black/60'
        } ${className}`}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 shrink-0" />
        ) : (
          <Maximize2 className="w-4 h-4 shrink-0 animate-pulse" />
        )}
        {showLabel && (
          <span className="font-mono tracking-tight">
            {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'prominent') {
    return (
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit Full Screen (F11)' : 'Enter Full Screen (F11)'}
        aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
          isFullscreen
            ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-amber-500/20'
            : 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
        } ${className}`}
      >
        {isFullscreen ? (
          <Minimize2 className="w-3.5 h-3.5" />
        ) : (
          <Maximize2 className="w-3.5 h-3.5" />
        )}
        {showLabel && (
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit Full Screen (F11)' : 'Enter Full Screen (F11)'}
      aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-mono text-xs font-semibold select-none active:scale-95 ${
        isFullscreen
          ? 'bg-amber-500/25 border-amber-500/60 text-amber-300 hover:bg-amber-500/35 shadow-sm'
          : 'bg-neutral-800/90 border-neutral-700/70 text-neutral-300 hover:bg-neutral-700 hover:text-white'
      } ${className}`}
    >
      {isFullscreen ? (
        <Minimize2 className="w-3.5 h-3.5" />
      ) : (
        <Maximize2 className="w-3.5 h-3.5" />
      )}
      {showLabel && (
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      )}
    </button>
  );
};
