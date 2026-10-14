import React, { useRef, useEffect, useCallback } from 'react';
import { SimpleStation, StormLevel, HeroCharacter, HomeStructure } from '../types/game';
import { soundManager } from '../services/audio';

interface StormFieldCanvasProps {
  stormLevel: StormLevel;
  health: number;
  power: number;
  character: HeroCharacter;
  homeStructure: HomeStructure;
  activeAbilityTimer: number;
  onSelectStation: (stationId: 'easy' | 'medium' | 'hard') => void;
  selectedStation: string | null;
  onOpenHomeBuilder: () => void;
  currentLevel: number;
  levelProgress: { easyDone: number; mediumDone: number; hardDone: number };
}

// Exactly the 3 simplified stations requested by the user: Easy, Medium, Hard
export const SIMPLE_STATIONS: SimpleStation[] = [
  {
    id: 'easy',
    name: 'Easy',
    description: '3 Questions (Tamil, English, Maths) · 1 pt each',
    x: 80,
    y: 190,
    width: 220,
    height: 160,
    color: '#064e3b',
    difficulty: 'Easy',
    questionCount: 3,
    pointsPerQuestion: 1,
  },
  {
    id: 'medium',
    name: 'Medium',
    description: '2 Questions (Science, Social Science) · 2 pts each',
    x: 340,
    y: 60,
    width: 220,
    height: 150,
    color: '#451a03',
    difficulty: 'Medium',
    questionCount: 2,
    pointsPerQuestion: 2,
  },
  {
    id: 'hard',
    name: 'Hard',
    description: '2 Questions (Cyclone Safety, Circuits & Tech) · 3 pts each',
    x: 600,
    y: 190,
    width: 220,
    height: 160,
    color: '#3b0764',
    difficulty: 'Hard',
    questionCount: 2,
    pointsPerQuestion: 3,
  },
];

export const MarsBaseCanvas: React.FC<StormFieldCanvasProps> = ({
  stormLevel,
  power,
  character,
  homeStructure,
  activeAbilityTimer,
  onSelectStation,
  selectedStation,
  onOpenHomeBuilder,
  currentLevel,
  levelProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playerRef = useRef({
    x: 450,
    y: 420,
    targetX: 450,
    targetY: 420,
    isMoving: false,
    speed: 4.5,
  });

  const particlesRef = useRef<
    Array<{ x: number; y: number; speed: number; length: number; opacity: number; size: number }>
  >([]);

  // Initialize rain / cyclone wind particles
  useEffect(() => {
    const particles = [];
    const count = 90 + stormLevel * 50;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 900,
        y: Math.random() * 600,
        speed: 4 + Math.random() * 6 + stormLevel * 3,
        length: 12 + Math.random() * 18 + stormLevel * 5,
        opacity: 0.3 + Math.random() * 0.6,
        size: 1.5 + Math.random() * 2.5,
      });
    }
    particlesRef.current = particles;
  }, [stormLevel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const p = playerRef.current;
      const speedMult = activeAbilityTimer > 0 && character.id === 'hero_web' ? 1.8 : 1.0;
      const step = 32 * speedMult;
      let handled = false;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        p.targetY = Math.max(60, p.y - step);
        handled = true;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        p.targetY = Math.min(540, p.y + step);
        handled = true;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        p.targetX = Math.max(70, p.x - step);
        handled = true;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        p.targetX = Math.min(830, p.x + step);
        handled = true;
      } else if (e.key === ' ' || e.key === 'Enter') {
        // Nearest station or home
        if (Math.hypot(p.x - 450, p.y - 420) < 90) {
          soundManager.playBeep(640, 0.06);
          onOpenHomeBuilder();
          handled = true;
        } else {
          for (const st of SIMPLE_STATIONS) {
            const cx = st.x + st.width / 2;
            const cy = st.y + st.height / 2;
            if (Math.hypot(p.x - cx, p.y - cy) < 140) {
              soundManager.playBeep(880, 0.08);
              onSelectStation(st.id);
              handled = true;
              break;
            }
          }
        }
      }

      if (handled) {
        soundManager.playBeep(320, 0.03, 'triangle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectStation, onOpenHomeBuilder, activeAbilityTimer, character]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Click home in center-bottom
      if (Math.hypot(clickX - 450, clickY - 420) < 80) {
        playerRef.current.targetX = 450;
        playerRef.current.targetY = 420;
        soundManager.playBeep(640, 0.05);
        onOpenHomeBuilder();
        return;
      }

      // Check click inside Easy, Medium, or Hard station
      for (const st of SIMPLE_STATIONS) {
        if (
          clickX >= st.x &&
          clickX <= st.x + st.width &&
          clickY >= st.y &&
          clickY <= st.y + st.height
        ) {
          playerRef.current.targetX = st.x + st.width / 2;
          playerRef.current.targetY = st.y + st.height / 2;
          soundManager.playBeep(700, 0.05);
          onSelectStation(st.id);
          return;
        }
      }

      playerRef.current.targetX = Math.max(70, Math.min(830, clickX));
      playerRef.current.targetY = Math.max(60, Math.min(540, clickY));
      soundManager.playBeep(440, 0.04);
    },
    [onSelectStation, onOpenHomeBuilder]
  );

  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Terrain: Coastal Earth (Tamil Nadu coast)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grass & sand pathways
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, height - 120, width, 120);

      // Pathways connecting Home to Easy, Medium, Hard
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';

      ctx.beginPath();
      // Home to Easy
      ctx.moveTo(450, 420);
      ctx.lineTo(190, 270);
      // Home to Medium
      ctx.moveTo(450, 420);
      ctx.lineTo(450, 135);
      // Home to Hard
      ctx.moveTo(450, 420);
      ctx.lineTo(710, 270);
      ctx.stroke();

      // Inner pathway highlights
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 10;
      ctx.stroke();

      // 2. Render Exactly the 3 Simple Stations: Easy, Medium, Hard
      SIMPLE_STATIONS.forEach(st => {
        const isSelected = selectedStation === st.id;

        // Outer Hull
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = isSelected ? '#f59e0b' : '#475569';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.beginPath();
        ctx.roundRect(st.x, st.y, st.width, st.height, 16);
        ctx.fill();
        ctx.stroke();

        // Inner Tile
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.roundRect(st.x + 6, st.y + 6, st.width - 12, st.height - 12, 12);
        ctx.fill();

        // Header Title
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px "Chakra Petch", sans-serif';
        ctx.fillText(`${st.name.toUpperCase()} ZONE`, st.x + 18, st.y + 32);

        // Subtitle badge
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const doneCount =
          st.id === 'easy'
            ? levelProgress.easyDone
            : st.id === 'medium'
            ? levelProgress.mediumDone
            : levelProgress.hardDone;
        ctx.fillText(
          `${doneCount}/${st.questionCount} Questions Solved (${st.pointsPerQuestion} pt each)`,
          st.x + 18,
          st.y + 54
        );

        // Station Icon
        const cx = st.x + st.width / 2;
        const cy = st.y + st.height / 2 + 25;

        if (st.id === 'easy') {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(cx, cy, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('10Q', cx - 14, cy + 6);
        } else if (st.id === 'medium') {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx, cy, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('3Q', cx - 11, cy + 6);
        } else {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(cx, cy, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('2Q', cx - 11, cy + 6);
        }

        // Completion indicator
        const isFinished = doneCount >= st.questionCount;
        if (isFinished) {
          ctx.fillStyle = '#22c55e';
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillText('✓ CLEARED', cx - 28, st.y + st.height - 12);
        }
      });

      // 3. Render Center Home Building Area
      const hx = 450;
      const hy = 420;

      // Home circle pad
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx, hy, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Home Graphic based on homeStructure.level (0 = Destroyed, 1-5 = Rebuilt)
      if (homeStructure.level === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.font = '28px sans-serif';
        ctx.fillText('🏚️', hx - 14, hy + 8);

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DESTROYED HOME', hx, hy + 30);
        ctx.fillText('[CLICK TO REBUILD]', hx, hy + 42);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '28px sans-serif';
        ctx.fillText(homeStructure.level >= 4 ? '🏡' : '🏠', hx - 14, hy + 8);

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`MY HOME (L${homeStructure.level})`, hx, hy + 30);
      }
      ctx.textAlign = 'left';

      // 4. Update Player Movement
      const player = playerRef.current;
      const speedMult = activeAbilityTimer > 0 && character.id === 'hero_web' ? 1.6 : 1.0;
      const dx = player.targetX - player.x;
      const dy = player.targetY - player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        player.x += (dx / dist) * Math.min(dist, player.speed * speedMult);
        player.y += (dy / dist) * Math.min(dist, player.speed * speedMult);
        player.isMoving = true;
      } else {
        player.x = player.targetX;
        player.y = player.targetY;
        player.isMoving = false;
      }

      const px = player.x;
      const py = player.y;

      // Hero active ability aura
      if (activeAbilityTimer > 0) {
        ctx.strokeStyle = character.accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Hero Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(px, py + 16, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hero Body
      ctx.fillStyle = character.accentColor;
      ctx.beginPath();
      ctx.arc(px, py - 4, 13, 0, Math.PI * 2);
      ctx.fill();

      // Face
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py - 4, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(px - 3, py - 4, 2, 0, Math.PI * 2);
      ctx.arc(px + 3, py - 4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Character Name & Superhero Portrait
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Chakra Petch", sans-serif';
      ctx.fillText(`${character.portrait} ${character.name.toUpperCase()}`, px - 42, py - 22);

      // Proximity Action Prompt
      for (const st of SIMPLE_STATIONS) {
        const cx = st.x + st.width / 2;
        const cy = st.y + st.height / 2;
        if (Math.hypot(px - cx, py - cy) < 130) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(px - 65, py + 22, 130, 22, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText(`[SPACE] ${st.name.toUpperCase()}`, px - 55, py + 36);
          break;
        }
      }

      // 5. Dynamic Coastal Earth Storm Simulation (Wind & Rain)
      const particles = particlesRef.current;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)'; // Coastal rain & wind streaks
      ctx.lineWidth = 1.5;

      particles.forEach(p => {
        p.x += p.speed;
        p.y += (Math.random() - 0.45) * 1.5;
        if (p.x > width + 30) {
          p.x = -30;
          p.y = Math.random() * height;
        }
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y + p.length * 0.12);
        ctx.stroke();
      });

      // Fog darkness by storm level
      const fogAlphas = [0.06, 0.16, 0.32, 0.50, 0.72];
      const fogAlpha = fogAlphas[stormLevel - 1] || 0.15;
      ctx.fillStyle = `rgba(15, 23, 42, ${fogAlpha})`;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [stormLevel, power, character, homeStructure, activeAbilityTimer, selectedStation, levelProgress]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-crosshair block select-none"
        title="Click to move hero or enter Easy, Medium, Hard zones"
      />
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/60 text-xs font-mono-code text-neutral-300 pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>LOCATION: TAMIL NADU COAST (INDIA)</span>
        <span className="text-neutral-500">|</span>
        <span>LEVEL: {currentLevel} / 50</span>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/60 text-xs font-mono-code text-neutral-400 pointer-events-none">
        <span>STORM INTENSITY: LEVEL {stormLevel}</span>
      </div>
    </div>
  );
};
