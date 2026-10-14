import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  SurvivalStats,
  SurvivalInventory,
  SurvivalPhase,
  WorldResourceNode,
  FlyingDebrisItem,
  HomeAppliancesState,
} from '../types/survival';
import {
  PlayerProfile,
  LevelQuestion,
  QuestionHistoryEntry,
  HomeMaterials,
  RankTier,
} from '../types/game';
import { HEROES, getHeroById } from '../data/characters';
import { getQuestionsForLevel } from '../data/all50LevelsData';
import { trackDailyMissionProgress } from '../data/dailyMissions';
import { soundManager } from '../services/audio';
import { HomeBuilderModal } from './HomeBuilderModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { HomeAppliancesModal } from './HomeAppliancesModal';
import { LevelPromotionModal, UnlockedBadgeItem } from './LevelPromotionModal';
import {
  Heart,
  Droplet,
  Zap,
  Home as HomeIcon,
  Wind,
  Shield,
  Radio,
  Clock,
  Compass,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Gem,
  Hammer,
  Tv,
  Refrigerator,
  Lightbulb,
  Fan,
  Coffee,
  Sliders,
  User,
} from 'lucide-react';

interface IslandSurvivalGameProps {
  player: PlayerProfile;
  currentLevel: number;
  onUpdatePlayer: React.Dispatch<React.SetStateAction<PlayerProfile>>;
  onUpdateLevel: (level: number) => void;
  onRecordHistory?: (entry: QuestionHistoryEntry) => void;
  onBackToMenu: () => void;
  onOpenAcademyMode: () => void;
  onSwitchUser?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Initial starter resources on island
const INITIAL_WORLD_NODES: WorldResourceNode[] = [
  // Bodega / Food area
  {
    id: 'food_bodega_1',
    name: 'Bodega Canned Rations',
    type: 'food',
    x: 180,
    y: 160,
    icon: '🥫',
    available: true,
    description: 'Tinned stew and energy biscuits from the village store.',
  },
  {
    id: 'food_bodega_2',
    name: 'Bottled Water Pack',
    type: 'water',
    x: 230,
    y: 180,
    icon: '💧',
    available: true,
    description: 'Clean sealed drinking water bottles.',
  },
  {
    id: 'food_beach_coconuts',
    name: 'Fresh Beach Coconuts',
    type: 'food',
    x: 80,
    y: 320,
    icon: '🥥',
    available: true,
    description: 'Fallen sweet coconuts providing food and hydration.',
  },

  // Workshop / Hardware Area
  {
    id: 'wood_workshop_1',
    name: 'Lumber & Timber Planks',
    type: 'wood',
    x: 720,
    y: 150,
    icon: '🪵',
    available: true,
    description: 'Heavy weather-resistant teak planks for boarding shelter.',
  },
  {
    id: 'tools_workshop_1',
    name: 'Heavy Duty Toolset',
    type: 'tools',
    x: 780,
    y: 170,
    icon: '🔨',
    available: true,
    description: 'Claw hammer, steel nails, and bracing brackets.',
  },
  {
    id: 'battery_workshop_1',
    name: 'Emergency Lead Battery',
    type: 'battery',
    x: 730,
    y: 200,
    icon: '🔋',
    available: true,
    description: 'Deep-cycle 12V battery pack.',
  },
  {
    id: 'firstaid_clinic',
    name: 'First Aid Medical Kit',
    type: 'firstAid',
    x: 340,
    y: 120,
    icon: '🩹',
    available: true,
    description: 'Sterile bandages, antiseptic, and burn ointment.',
  },

  // Lighthouse / Radio Station
  {
    id: 'beacon_antenna',
    name: 'High-Gain Signal Antenna',
    type: 'beacon_part',
    partType: 'antenna',
    x: 160,
    y: 570,
    icon: '📡',
    available: true,
    description: 'VHF Emergency Broadcast antenna component for coastal rescue.',
  },
  {
    id: 'beacon_battery',
    name: 'Radio Power Module',
    type: 'beacon_part',
    partType: 'battery',
    x: 220,
    y: 600,
    icon: '⚡',
    available: true,
    description: 'Military-grade high-output transmitter battery.',
  },
  {
    id: 'water_well',
    name: 'Freshwater Rain Tank',
    type: 'water',
    x: 330,
    y: 500,
    icon: '🚰',
    available: true,
    description: 'Filtered rainwater reserve.',
  },

  // Evacuation Pier Area
  {
    id: 'beacon_flare',
    name: 'Maritime Rescue Flare Kit',
    type: 'beacon_part',
    partType: 'flare',
    x: 820,
    y: 480,
    icon: '🚨',
    available: true,
    description: 'High-intensity red parachute distress flares.',
  },
  {
    id: 'beach_driftwood',
    name: 'Coastal Driftwood Log',
    type: 'wood',
    x: 620,
    y: 650,
    icon: '🪵',
    available: true,
    description: 'Sturdy shore timber suitable for shelter reinforcement.',
  },
];

// Shelter Bounding Box on the Island (spacious for appliances)
const SHELTER_ZONE = {
  x: 410,
  y: 310,
  w: 195,
  h: 155,
};

// Interactive Appliance Stations inside Home Shelter
export const APPLIANCE_STATIONS = [
  { id: 'tv', name: 'Smart Television', icon: '📺', x: 445, y: 350, prompt: 'Watch TV (Weather & Alert News)' },
  { id: 'switch', name: 'Wall Light Switch', icon: '💡', x: 508, y: 332, prompt: 'Flip Light Switch (Toggle Ceiling Lights)' },
  { id: 'fridge', name: 'Refrigerator', icon: '🧊', x: 575, y: 350, prompt: 'Open Fridge (Cold Water & Snacks)' },
  { id: 'fan', name: 'Ceiling Fan', icon: '🌀', x: 508, y: 382, prompt: 'Toggle Ceiling Fan (Cooling Breeze)' },
  { id: 'sofa', name: 'Living Room Sofa', icon: '🛋️', x: 445, y: 415, prompt: 'Rest on Sofa (Recover 100% Energy)' },
  { id: 'microwave', name: 'Microwave Stove', icon: '♨️', x: 575, y: 415, prompt: 'Cook Fresh Meal (+40 Hunger, +20 Health)' },
];

export const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Evacuation Pier Bounding Box
const EVAC_ZONE = {
  x: 760,
  y: 520,
  w: 160,
  h: 140,
};

// Buggy Vehicle initial position
const VEHICLE_ZONE = {
  x: 660,
  y: 280,
  w: 48,
  h: 36,
};

export const IslandSurvivalGame: React.FC<IslandSurvivalGameProps> = ({
  player,
  currentLevel,
  onUpdatePlayer,
  onUpdateLevel,
  onRecordHistory,
  onBackToMenu,
  onOpenAcademyMode,
  onSwitchUser,
  isMuted,
  onToggleMute,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Superhero selection (Spider-Man, Thor, Iron Man, Captain America, Black Panther)
  const [selectedHeroId, setSelectedHeroId] = useState<string>(() => {
    return player.selectedCharacterId && player.selectedCharacterId.startsWith('hero_')
      ? player.selectedCharacterId
      : 'hero_spiderman';
  });

  const activeHero = getHeroById(selectedHeroId);

  // Superhero Ability Cooldown & Active Timer
  const [heroAbilityCooldown, setHeroAbilityCooldown] = useState<number>(0);
  const [heroAbilityActiveTimer, setHeroAbilityActiveTimer] = useState<number>(0);

  // Survival Stats (5 Systems)
  const [stats, setStats] = useState<SurvivalStats>({
    health: 100,
    hunger: 100,
    water: 100,
    energy: 100,
    shelterStrength: 65 + (player.homeStructure.level * 7),
  });

  // Survival Backpack Inventory
  const [inventory, setInventory] = useState<SurvivalInventory>({
    food: 2,
    water: 2,
    batteries: 1,
    tools: 1,
    wood: 3,
    firstAid: 1,
    beaconParts: {
      antenna: false,
      battery: false,
      flare: false,
    },
  });

  // Progression & Phases
  const [phase, setPhase] = useState<SurvivalPhase>('warning');
  const [stormNumber, setStormNumber] = useState<number>(1);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(30); // 30s warning
  const [totalSecondsSurvived, setTotalSecondsSurvived] = useState<number>(0);
  const [suppliesGatheredCount, setSuppliesGatheredCount] = useState<number>(0);

  // Status flags
  const [isInsideShelter, setIsInsideShelter] = useState<boolean>(false);
  const [isDrivingBuggy, setIsDrivingBuggy] = useState<boolean>(false);
  const [buggyFixed, setBuggyFixed] = useState<boolean>(false);
  const [evacuationCalled, setEvacuationCalled] = useState<boolean>(false);
  const [evacTimer, setEvacTimer] = useState<number>(0);
  const [recentLog, setRecentLog] = useState<string>(
    `⚠️ STORM WARNING: 30s until landfall! ${activeHero.name} must scavenge supplies and reinforce the home!`
  );
  const [nearNode, setNearNode] = useState<WorldResourceNode | null>(null);

  // Interactive Nodes on Map
  const [nodes, setNodes] = useState<WorldResourceNode[]>(INITIAL_WORLD_NODES);

  // --- QUIZ & 50-LEVEL ACADEMY INTEGRATION ---
  // When interacting with a cache, player MUST answer a quiz question before collecting rewards!
  const [pendingQuizNode, setPendingQuizNode] = useState<WorldResourceNode | null>(null);
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<LevelQuestion | null>(null);
  const [quizSelectedIndex, setQuizSelectedIndex] = useState<number | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);
  const [quizRevealedHint, setQuizRevealedHint] = useState<boolean>(false);

  // Level Progression Tracker
  const [levelSolvedCount, setLevelSolvedCount] = useState<number>(0);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState<boolean>(false);
  const [showHomeBuilderModal, setShowHomeBuilderModal] = useState<boolean>(false);
  const [showHeroSelectorModal, setShowHeroSelectorModal] = useState<boolean>(false);
  const [showAppliancesModal, setShowAppliancesModal] = useState<boolean>(false);

  // User Request: "change storm time into 30 second"
  const [stormDurationSeconds, setStormDurationSeconds] = useState<number>(30); // 30 seconds default!

  // User Request: "and also change the playing time to 5 minutes"
  const [playingTimeSecondsLeft, setPlayingTimeSecondsLeft] = useState<number>(300); // 5 minutes = 300 seconds

  // User Request: "if i build 5 home and rescue from storm 2 times .promote to next level add that few badges and rank ."
  const [homesBuiltCount, setHomesBuiltCount] = useState<number>(() => Math.max(1, player.homeStructure.level));
  const [rescuedFromStormCount, setRescuedFromStormCount] = useState<number>(0);
  const [showPromotionModal, setShowPromotionModal] = useState<boolean>(false);
  const [promotionBadgesEarned, setPromotionBadgesEarned] = useState<UnlockedBadgeItem[]>([]);
  const [promotedOldRank, setPromotedOldRank] = useState<RankTier>(player.rank);
  const [promotedNewRank, setPromotedNewRank] = useState<RankTier>(player.rank);
  const [promotionHandledForLevel, setPromotionHandledForLevel] = useState<number | null>(null);

  // Home with TV, Fridge, Switch & Light, Fan, Microwave, Sofa (User Request)
  const [appliances, setAppliances] = useState<HomeAppliancesState>({
    tv: {
      powered: true,
      channel: 0,
      channelName: '🛰️ Cyclone Radar & Satellite Weather',
    },
    fridge: {
      doorOpen: false,
      coldWaterCount: 5,
      snacksCount: 4,
      temperatureC: 3.5,
    },
    lightSwitch: {
      turnedOn: true,
      brightness: 85,
    },
    fan: {
      turnedOn: true,
      speed: 2,
    },
    microwave: {
      isCooking: false,
      timeLeftSeconds: 0,
    },
    radio: {
      turnedOn: true,
      station: 'VHF Emergency Broadcast',
    },
    solarBattery: {
      chargePercent: 100,
      isBackupActive: true,
    },
  });
  const [nearApplianceId, setNearApplianceId] = useState<string | null>(null);

  // Last earned level materials
  const [lastEarnedMaterials, setLastEarnedMaterials] = useState<HomeMaterials>({
    wood: 6,
    rope: 4,
    lights: 2,
    electronics: 1,
    bricks: 4,
  });

  // Player Physics & Control
  const playerRef = useRef({
    x: 480,
    y: 470,
    vx: 0,
    vy: 0,
    facing: 'down' as 'up' | 'down' | 'left' | 'right',
    isSprinting: false,
    speed: 4.0,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const debrisRef = useRef<FlyingDebrisItem[]>([]);
  const rainRef = useRef<Array<{ x: number; y: number; speed: number; len: number; opacity: number }>>([]);
  const lightningFlashRef = useRef<number>(0);

  // Initialize rain particles
  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 160; i++) {
      drops.push({
        x: Math.random() * 1000,
        y: Math.random() * 640,
        speed: 8 + Math.random() * 8,
        len: 12 + Math.random() * 16,
        opacity: 0.2 + Math.random() * 0.5,
      });
    }
    rainRef.current = drops;
  }, []);

  // Update shelter strength if home structure level upgrades
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      shelterStrength: Math.min(100, Math.max(prev.shelterStrength, 50 + player.homeStructure.level * 10)),
    }));
  }, [player.homeStructure.level]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === 'Shift') {
        playerRef.current.isSprinting = true;
      }

      // Quick-use items
      if (e.key === '1') handleEatFood();
      if (e.key === '2') handleDrinkWater();
      if (e.key === '3') handleUseBattery();
      if (e.key === '4') handleUseFirstAid();
      if (e.key === '5' || e.key.toLowerCase() === 'r') handleReinforceShelter();
      if (e.key.toLowerCase() === 'e' || e.key === ' ') handleInteract();
      if (e.key.toLowerCase() === 'f') handleToggleVehicle();
      if (e.key.toLowerCase() === 'q') handleActivateHeroAbility();
      if (e.key.toLowerCase() === 'h') setShowAppliancesModal(true);
      if (e.key.toLowerCase() === 'c') setShowHeroSelectorModal(true);
      if (e.key.toLowerCase() === 'b') setShowHomeBuilderModal(true);
      if (e.key.toLowerCase() === 't') {
        soundManager.playTvChime();
        setAppliances(prev => ({
          ...prev,
          tv: { ...prev.tv, powered: !prev.tv.powered },
        }));
      }
      if (e.key.toLowerCase() === 'l') {
        soundManager.playSwitchClick();
        setAppliances(prev => ({
          ...prev,
          lightSwitch: { ...prev.lightSwitch, turnedOn: !prev.lightSwitch.turnedOn },
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') {
        playerRef.current.isSprinting = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearNode, nearApplianceId, inventory, isInsideShelter, buggyFixed, isDrivingBuggy, heroAbilityCooldown, appliances]);

  // Audio start & sync
  useEffect(() => {
    if (phase === 'storm') {
      soundManager.startWind(Math.min(5, 2 + stormNumber));
    } else {
      soundManager.startWind(1);
    }
    return () => soundManager.stopWind();
  }, [phase, stormNumber]);

  // Rank Progression Hierarchy
  const getNextRankTier = (currentRank: RankTier): RankTier => {
    const tiers: RankTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Earth Legend'];
    const idx = tiers.indexOf(currentRank);
    if (idx < 0 || idx >= tiers.length - 1) return 'Earth Legend';
    return tiers[idx + 1];
  };

  // Promotion Trigger: "if i build 5 home and rescue from storm 2 times .promote to next level add that few badges and rank"
  const checkAndTriggerPromotion = useCallback(
    (currentHomes: number, currentRescues: number) => {
      if (currentHomes >= 5 && currentRescues >= 2 && promotionHandledForLevel !== currentLevel) {
        setPromotionHandledForLevel(currentLevel);
        const nextLevel = Math.min(50, currentLevel + 1);
        const oldR = player.rank;
        const newR = getNextRankTier(oldR);

        const badgesToAward: UnlockedBadgeItem[] = [
          {
            id: 'badge_master_architect',
            title: 'Master Architect',
            description: 'Constructed 5 storm-proof homes across the island to protect coastal survivors.',
            icon: 'Home',
          },
          {
            id: 'badge_storm_rescuer',
            title: 'Storm Rescuer',
            description: 'Successfully rescued and endured through 2 extreme 30-second category-5 cyclones.',
            icon: 'Shield',
          },
          {
            id: 'badge_gale_conqueror',
            title: '30s Gale Conqueror',
            description: 'Withstood severe 30-second storm gale winds while safely sheltered inside.',
            icon: 'Wind',
          },
          {
            id: 'badge_grid_engineer',
            title: 'Power Grid Engineer',
            description: 'Wired and operated smart home appliances: TV, Fridge, Switch & Lights.',
            icon: 'Zap',
          },
          {
            id: 'badge_island_legend',
            title: 'Island Vanguard Legend',
            description: `Promoted to Level ${nextLevel} Academy by building 5 homes and achieving 2 storm rescues!`,
            icon: 'Award',
          },
        ];

        setPromotedOldRank(oldR);
        setPromotedNewRank(newR);
        setPromotionBadgesEarned(badgesToAward);
        setShowPromotionModal(true);
        soundManager.playLevelUp();

        onUpdatePlayer(prev => {
          const updatedBadges = [...prev.badges];
          badgesToAward.forEach(b => {
            if (!updatedBadges.includes(b.id)) {
              updatedBadges.push(b.id);
            }
          });

          return {
            ...prev,
            rank: newR,
            badges: updatedBadges,
            xp: prev.xp + 600,
            coins: prev.coins + 350,
            diamonds: prev.diamonds + 5,
            completedLevels: prev.completedLevels.includes(currentLevel)
              ? prev.completedLevels
              : [...prev.completedLevels, currentLevel],
            homeMaterials: {
              wood: prev.homeMaterials.wood + 12,
              rope: prev.homeMaterials.rope + 8,
              lights: prev.homeMaterials.lights + 5,
              electronics: prev.homeMaterials.electronics + 4,
              bricks: prev.homeMaterials.bricks + 10,
            },
          };
        });

        setRecentLog(`🌟 PROMOTED TO LEVEL ${nextLevel}! Promoted to ${newR} rank! 5 Badges awarded!`);
      }
    },
    [currentLevel, player.rank, promotionHandledForLevel, onUpdatePlayer]
  );

  // Real-time Game Loop: Timer, Metabolism, Cooldowns, Phases
  useEffect(() => {
    if (phase === 'victory' || phase === 'defeat') return;

    const timer = setInterval(() => {
      setTotalSecondsSurvived(s => s + 1);

      // Decrement overall 5-minute playing time (User Request: "change the playing time to 5 minutes")
      setPlayingTimeSecondsLeft(prevSec => {
        if (prevSec <= 1) {
          setRecentLog('🏆 5-MINUTE PLAYING TIME COMPLETED! Island expedition successfully survived!');
          soundManager.playSuccess();
          return 0;
        }
        return prevSec - 1;
      });

      // Hero Ability Cooldowns
      setHeroAbilityCooldown(c => Math.max(0, c - 1));
      setHeroAbilityActiveTimer(t => Math.max(0, t - 1));

      // Random lightning during storm phase
      if (phase === 'storm' && Math.random() < 0.18) {
        lightningFlashRef.current = 1.0;
        soundManager.playThunder();
      }

      // Decrement phase timer
      setPhaseSecondsLeft(prevSec => {
        if (prevSec <= 1) {
          // Phase shift!
          if (phase === 'warning') {
            setPhase('storm');
            setRecentLog(`🌪️ STORM #${stormNumber} HAS MADE LANDFALL! 30-Second gale winds active! Seek home shelter!`);
            soundManager.playAlarm();
            soundManager.playThunder();
            return stormDurationSeconds; // User Request: 30 seconds default!
          } else if (phase === 'storm') {
            setPhase('aftermath');
            soundManager.playSuccess();
            respawnAftermathSupplies();
            trackDailyMissionProgress('storm_survived', 1);

            // Track Storm Rescue: "if i build 5 home and rescue from storm 2 times .promote to next level"
            setRescuedFromStormCount(prevRescues => {
              const nextRescues = prevRescues + 1;
              setRecentLog(`🛡️ RESCUED FROM STORM #${nextRescues}! Safe inside home! (${nextRescues}/2 Rescues & ${homesBuiltCount}/5 Homes)`);
              checkAndTriggerPromotion(homesBuiltCount, nextRescues);
              return nextRescues;
            });

            return 40; // 40 seconds calm window to salvage before next storm
          } else if (phase === 'aftermath') {
            setStormNumber(sn => sn + 1);
            setPhase('warning');
            setRecentLog(`⚠️ STORM #${stormNumber + 1} APPROACHING! Shore up home shelter!`);
            soundManager.playAlarm();
            return 30; // 30s warning
          }
        }
        return prevSec - 1;
      });

      // Evacuation Chopper countdown
      if (evacuationCalled && evacTimer > 0) {
        setEvacTimer(t => {
          if (t <= 1) {
            setPhase('victory');
            soundManager.playHelicopter();
            soundManager.playSuccess();
            return 0;
          }
          return t - 1;
        });
      }

      // Live Survival Stat Metabolism
      setStats(prev => {
        let { health, hunger, water, energy, shelterStrength } = prev;

        // Hunger & Water drain over time
        hunger = Math.max(0, hunger - 0.35);
        water = Math.max(0, water - 0.5);

        // Energy dynamics
        if (isInsideShelter) {
          energy = Math.min(100, energy + 2.5); // Rest inside
        } else if (playerRef.current.isSprinting) {
          // Black Panther zero-energy sprint perk
          const isPantherPerk = activeHero.id === 'hero_panther' && heroAbilityActiveTimer > 0;
          if (!isPantherPerk) {
            energy = Math.max(0, energy - 1.5);
          }
        } else {
          energy = Math.max(0, energy - 0.2);
        }

        // Storm Environmental Exposure
        if (phase === 'storm') {
          if (isInsideShelter) {
            // Home absorbs storm damage
            const erosionRate = Math.max(0.15, (0.35 * stormNumber) - (player.homeStructure.level * 0.05));
            shelterStrength = Math.max(0, shelterStrength - erosionRate);
            if (shelterStrength <= 0) {
              // Roof breached!
              health = Math.max(0, health - 0.7);
            }
          } else {
            // Outside in storm!
            const isShieldProtected =
              (activeHero.id === 'hero_captain' && heroAbilityActiveTimer > 0) ||
              (activeHero.id === 'hero_spiderman' && heroAbilityActiveTimer > 0);

            if (!isShieldProtected) {
              const stormDamage = 1.1 * stormNumber;
              health = Math.max(0, health - stormDamage);
              energy = Math.max(0, energy - 0.8);
            }
          }
        }

        // Starvation & Dehydration penalties
        if (hunger <= 0) health = Math.max(0, health - 0.75);
        if (water <= 0) health = Math.max(0, health - 1.1);

        // Check Defeat
        if (health <= 0) {
          setPhase('defeat');
          soundManager.playFailure();
        }

        return { health, hunger, water, energy, shelterStrength };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    phase,
    stormNumber,
    isInsideShelter,
    evacuationCalled,
    evacTimer,
    activeHero.id,
    heroAbilityActiveTimer,
    player.homeStructure.level,
  ]);

  // Respawn new supplies on beach/town during aftermath
  const respawnAftermathSupplies = () => {
    setNodes(prev => [
      ...prev,
      {
        id: `salvage_beach_${Date.now()}_1`,
        name: 'Washed-up Cargo Crate',
        type: 'food',
        x: 100 + Math.random() * 200,
        y: 650 + Math.random() * 50,
        icon: '📦',
        available: true,
        description: 'Sealed crate washed up by the storm surge containing fresh food.',
      },
      {
        id: `salvage_timber_${Date.now()}_2`,
        name: 'Storm-Felled Teak Log',
        type: 'wood',
        x: 480 + Math.random() * 240,
        y: 180 + Math.random() * 80,
        icon: '🪵',
        available: true,
        description: 'Fresh heavy wood to repair damaged shelter sections.',
      },
      {
        id: `salvage_water_${Date.now()}_3`,
        name: 'Clean Purified Water Jug',
        type: 'water',
        x: 680 + Math.random() * 120,
        y: 420 + Math.random() * 60,
        icon: '💧',
        available: true,
        description: 'Clean drinking water salvaged from coastal storage.',
      },
    ]);
  };

  // --- SUPERHERO SPECIAL ABILITY TRIGGER ---
  const handleActivateHeroAbility = () => {
    if (heroAbilityCooldown > 0) return;

    soundManager.playDiamondChime();
    setHeroAbilityCooldown(activeHero.cooldownSeconds);
    setHeroAbilityActiveTimer(15);

    if (activeHero.id === 'hero_spiderman') {
      soundManager.playSuccess();
      setRecentLog('🕸️ SPIDER-MAN ACTIVATED WEB-ZIP DASH! Dodging storm debris with Spider-Sense!');
    } else if (activeHero.id === 'hero_thor') {
      soundManager.playThunder();
      debrisRef.current = []; // Destroy all flying debris with lightning!
      setRecentLog('⚡ THOR SUMMONED MJOLNIR LIGHTNING! Vaporized all flying debris in the storm!');
    } else if (activeHero.id === 'hero_ironman') {
      soundManager.playSuccess();
      setStats(s => ({
        ...s,
        shelterStrength: Math.min(100, s.shelterStrength + 25),
        energy: Math.min(100, s.energy + 25),
      }));
      setRecentLog('🦾 IRON MAN ARC REACTOR PULSE! Restored +25% Shelter Integrity and +25% Energy!');
    } else if (activeHero.id === 'hero_captain') {
      soundManager.playSuccess();
      setRecentLog('🛡️ CAPTAIN AMERICA RAISED VIBRANIUM SHIELD! Complete immunity to storm debris!');
    } else if (activeHero.id === 'hero_panther') {
      soundManager.playSuccess();
      setStats(s => ({ ...s, health: Math.min(100, s.health + 25) }));
      setRecentLog('🐆 BLACK PANTHER KINETIC ABSORPTION! Converted gale wind energy into speed and health!');
    }
  };

  // Main 60FPS Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Update Player Movement
      const p = playerRef.current;
      const abilitySpeedMult =
        heroAbilityActiveTimer > 0 &&
        (activeHero.id === 'hero_spiderman' || activeHero.id === 'hero_panther')
          ? 2.2
          : 1.0;
      const speedMult = isDrivingBuggy
        ? 2.3
        : p.isSprinting && stats.energy > 5
        ? 1.6 * abilitySpeedMult
        : 1.0 * abilitySpeedMult;
      const currentSpeed = p.speed * speedMult;

      let dx = 0;
      let dy = 0;
      const k = keysRef.current;

      if (k['w'] || k['arrowup']) {
        dy -= 1;
        p.facing = 'up';
      }
      if (k['s'] || k['arrowdown']) {
        dy += 1;
        p.facing = 'down';
      }
      if (k['a'] || k['arrowleft']) {
        dx -= 1;
        p.facing = 'left';
      }
      if (k['d'] || k['arrowright']) {
        dx += 1;
        p.facing = 'right';
      }

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const isMoving = dx !== 0 || dy !== 0;
      p.x = Math.max(40, Math.min(960, p.x + dx * currentSpeed));
      p.y = Math.max(50, Math.min(710, p.y + dy * currentSpeed));

      // Check if inside shelter
      const inside =
        p.x >= SHELTER_ZONE.x &&
        p.x <= SHELTER_ZONE.x + SHELTER_ZONE.w &&
        p.y >= SHELTER_ZONE.y &&
        p.y <= SHELTER_ZONE.y + SHELTER_ZONE.h;
      setIsInsideShelter(inside);

      // Check proximity to appliances if inside shelter
      let foundAppliance: string | null = null;
      if (inside) {
        for (const st of APPLIANCE_STATIONS) {
          const dist = Math.hypot(p.x - st.x, p.y - st.y);
          if (dist < 40) {
            foundAppliance = st.id;
            break;
          }
        }
      }
      setNearApplianceId(foundAppliance);

      // Check proximity to interactive nodes
      let foundNode: WorldResourceNode | null = null;
      for (const node of nodes) {
        if (!node.available) continue;
        const dist = Math.hypot(p.x - node.x, p.y - node.y);
        if (dist < 42) {
          foundNode = node;
          break;
        }
      }
      setNearNode(foundNode);

      // 2. Update Flying Debris during storm
      if (phase === 'storm') {
        if (Math.random() < 0.08 * stormNumber && debrisRef.current.length < 22) {
          const types: ('tile' | 'crate' | 'branch' | 'barrel')[] = ['tile', 'crate', 'branch', 'barrel'];
          debrisRef.current.push({
            id: `debris_${Date.now()}_${Math.random()}`,
            x: -20,
            y: 50 + Math.random() * 620,
            vx: 7 + Math.random() * 8 + stormNumber * 2,
            vy: (Math.random() - 0.3) * 3,
            size: 14 + Math.random() * 16,
            rotation: 0,
            rotSpeed: 0.08 + Math.random() * 0.15,
            type: types[Math.floor(Math.random() * types.length)],
          });
        }

        // Move debris & check collision with player
        debrisRef.current.forEach(deb => {
          deb.x += deb.vx;
          deb.y += deb.vy;
          deb.rotation += deb.rotSpeed;

          // Check hit with player (only if outside shelter and not in vehicle)
          if (!inside && !isDrivingBuggy) {
            const dist = Math.hypot(p.x - deb.x, p.y - deb.y);
            if (dist < deb.size + 15) {
              deb.x = 2000; // remove

              // Shield deflection check
              const isInvulnerable =
                (activeHero.id === 'hero_captain' && heroAbilityActiveTimer > 0) ||
                (activeHero.id === 'hero_spiderman' && heroAbilityActiveTimer > 0);

              if (isInvulnerable) {
                soundManager.playDiamondChime();
                setRecentLog(`🛡️ ${activeHero.name} deflected flying debris effortlessly!`);
              } else {
                soundManager.playDebrisHit();
                setStats(s => ({ ...s, health: Math.max(0, s.health - 12) }));
                setRecentLog('💥 STRUCK BY FLYING DEBRIS! -12 Health! Seek shelter or use hero ability!');
              }
            }
          }
        });
        debrisRef.current = debrisRef.current.filter(d => d.x < 1100);
      } else {
        debrisRef.current = [];
      }

      // Update Rain
      rainRef.current.forEach(r => {
        r.y += r.speed * (phase === 'storm' ? 1.6 : 0.8);
        r.x += phase === 'storm' ? 6 : 2;
        if (r.y > 640) {
          r.y = -10;
          r.x = Math.random() * 1000;
        }
      });

      // --- 3. CANVAS DRAWING ---
      ctx.clearRect(0, 0, 1000, 640);

      // (a) Ocean Water Background
      const oceanGrad = ctx.createLinearGradient(0, 0, 1000, 640);
      oceanGrad.addColorStop(0, '#0c4a6e');
      oceanGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1000, 640);

      // Ocean animated foam ripples
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const waveX = ((Date.now() / 40 + i * 140) % 1100) - 50;
        ctx.beginPath();
        ctx.arc(waveX, 50 + i * 80, 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      // (b) Sandy Shoreline
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(50, 40, 900, 560, 40);
      ctx.fill();

      // (c) Inland Grass Turf
      const grassGrad = ctx.createLinearGradient(100, 80, 880, 520);
      grassGrad.addColorStop(0, '#15803d');
      grassGrad.addColorStop(1, '#166534');
      ctx.fillStyle = grassGrad;
      ctx.beginPath();
      ctx.roundRect(100, 80, 800, 480, 30);
      ctx.fill();

      // (d) Cobblestone Paths
      ctx.fillStyle = '#64748b';
      ctx.fillRect(100, 300, 800, 28);
      ctx.fillRect(490, 100, 32, 440);
      ctx.fillRect(200, 180, 32, 220);

      // (e) Decor Palm Trees
      const trees = [
        { x: 90, y: 120 },
        { x: 120, y: 440 },
        { x: 380, y: 110 },
        { x: 620, y: 110 },
        { x: 880, y: 140 },
        { x: 880, y: 380 },
        { x: 380, y: 530 },
      ];
      trees.forEach(t => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x, t.y, 10, 24);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(t.x + 5, t.y - 4, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(t.x + 5, t.y - 8, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      // (f) Island Buildings
      // 1. General Bodega Store (Top Left)
      ctx.fillStyle = '#334155';
      ctx.fillRect(140, 110, 140, 95);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(135, 105, 150, 16);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🏪 VILLAGE STORE', 155, 140);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(160, 160, 30, 45);
      ctx.fillRect(215, 160, 45, 25);

      // 2. Hardware Workshop & Lumber Shed (Top Right)
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(680, 110, 150, 95);
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(675, 105, 160, 16);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🔨 HARDWARE SHED', 695, 140);
      ctx.fillStyle = '#71717a';
      ctx.fillRect(730, 160, 40, 45);

      // 3. Coastal Lighthouse & Radio Mast (Bottom Left)
      ctx.fillStyle = '#475569';
      ctx.fillRect(130, 510, 110, 80);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(185, 510);
      ctx.lineTo(185, 430);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(185, 430, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('📡 RADIO MAST', 145, 545);

      // 4. Evacuation Pier & Helipad (Bottom Right)
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(EVAC_ZONE.x, EVAC_ZONE.y, EVAC_ZONE.w, EVAC_ZONE.h);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.strokeRect(EVAC_ZONE.x + 20, EVAC_ZONE.y + 15, 120, 105);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('H', EVAC_ZONE.x + 68, EVAC_ZONE.y + 80);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('RESCUE DOCK', EVAC_ZONE.x + 42, EVAC_ZONE.y + 110);

      // 5. THE HOME SHELTER (Visual upgrades + Interactive Appliances)
      const shelter = SHELTER_ZONE;
      const homeLvl = player.homeStructure.level;

      // Base Foundation & Living Room Floor
      ctx.fillStyle = homeLvl >= 1 ? '#334155' : '#78350f';
      ctx.fillRect(shelter.x, shelter.y, shelter.w, shelter.h);

      // Living Room Ambient Lighting from Light Switch & Ceiling Chandelier
      if (appliances.lightSwitch.turnedOn) {
        const glow = ctx.createRadialGradient(
          shelter.x + shelter.w / 2,
          shelter.y + shelter.h / 2,
          15,
          shelter.x + shelter.w / 2,
          shelter.y + shelter.h / 2,
          110
        );
        const bright = (appliances.lightSwitch.brightness / 100) * 0.42;
        glow.addColorStop(0, `rgba(254, 240, 138, ${bright})`);
        glow.addColorStop(1, 'rgba(245, 158, 11, 0.08)');
        ctx.fillStyle = glow;
        ctx.fillRect(shelter.x + 6, shelter.y + 20, shelter.w - 12, shelter.h - 26);
      } else {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
        ctx.fillRect(shelter.x + 6, shelter.y + 20, shelter.w - 12, shelter.h - 26);
      }

      // Walls & Frame
      if (homeLvl >= 2) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(shelter.x + 4, shelter.y + 4, shelter.w - 8, shelter.h - 8);
      }

      // Roof: Clay tile / Reinforced Solar Roof
      ctx.fillStyle =
        homeLvl >= 4 ? '#0284c7' : homeLvl >= 3 ? '#b45309' : homeLvl >= 1 ? '#92400e' : '#57534e';
      ctx.beginPath();
      ctx.moveTo(shelter.x - 10, shelter.y + 20);
      ctx.lineTo(shelter.x + shelter.w / 2, shelter.y - 20);
      ctx.lineTo(shelter.x + shelter.w + 10, shelter.y + 20);
      ctx.closePath();
      ctx.fill();

      // Solar Panels on Roof if Level 4+
      if (homeLvl >= 4) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(shelter.x + 25, shelter.y - 10, 38, 18);
        ctx.fillRect(shelter.x + shelter.w - 65, shelter.y - 10, 38, 18);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(shelter.x + 25, shelter.y - 10, 38, 18);
        ctx.strokeRect(shelter.x + shelter.w - 65, shelter.y - 10, 38, 18);
      }

      // Shelter Doorway
      ctx.fillStyle = homeLvl >= 3 ? '#b45309' : '#fbbf24';
      ctx.fillRect(shelter.x + shelter.w / 2 - 18, shelter.y + shelter.h - 28, 36, 28);

      // Windows with warm glow
      ctx.fillStyle = inside ? (appliances.lightSwitch.turnedOn ? '#fef08a' : '#64748b') : homeLvl >= 4 ? '#38bdf8' : '#f59e0b';
      ctx.fillRect(shelter.x + 14, shelter.y + 26, 22, 20);
      ctx.fillRect(shelter.x + shelter.w - 36, shelter.y + 26, 22, 20);

      // --- DRAW INTERIOR APPLIANCES ON CANVAS ---

      // 1. SMART TV (Top Left of Shelter)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(432, 338, 32, 22);
      ctx.fillStyle = appliances.tv.powered ? '#0284c7' : '#1e293b';
      ctx.fillRect(434, 340, 28, 16);
      if (appliances.tv.powered) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(436, 343, 14, 4);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(436, 349, 22, 2);
      }
      ctx.fillStyle = appliances.tv.powered ? '#38bdf8' : '#94a3b8';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('📺 TV', 438, 334);

      // 2. WALL LIGHT SWITCH (Top Center Wall)
      ctx.fillStyle = '#475569';
      ctx.fillRect(502, 324, 14, 18);
      ctx.fillStyle = appliances.lightSwitch.turnedOn ? '#f59e0b' : '#334155';
      ctx.fillRect(504, appliances.lightSwitch.turnedOn ? 326 : 332, 10, 8);
      ctx.fillStyle = appliances.lightSwitch.turnedOn ? '#fef08a' : '#94a3b8';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('💡 SWITCH', 488, 320);

      // 3. REFRIGERATOR (Top Right of Shelter)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(562, 336, 26, 36);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(562, 350, 26, 2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(564, 340, 3, 7);
      ctx.fillRect(564, 354, 3, 10);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('🧊 FRIDGE', 554, 332);

      // 4. CEILING FAN (Center Hub)
      const fanX = 508;
      const fanY = 382;
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(fanX, fanY, 4, 0, Math.PI * 2);
      ctx.fill();
      const bladeAngle = appliances.fan.turnedOn
        ? (Date.now() / (180 / (appliances.fan.speed || 1))) % (Math.PI * 2)
        : 0;
      for (let b = 0; b < 3; b++) {
        const ang = bladeAngle + (b * Math.PI * 2) / 3;
        ctx.strokeStyle = appliances.fan.turnedOn ? '#2dd4bf' : '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fanX, fanY);
        ctx.lineTo(fanX + Math.cos(ang) * 15, fanY + Math.sin(ang) * 15);
        ctx.stroke();
      }
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('🌀 FAN', 496, 400);

      // 5. LIVING ROOM SOFA (Bottom Left)
      ctx.fillStyle = '#be123c';
      ctx.fillRect(432, 406, 34, 20);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(434, 408, 30, 7);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('🛋️ SOFA', 434, 435);

      // 6. MICROWAVE & COOKTOP (Bottom Right)
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(562, 406, 26, 20);
      ctx.fillStyle = appliances.microwave.isCooking ? '#f97316' : '#18181b';
      ctx.fillRect(564, 409, 15, 12);
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('♨️ STOVE', 556, 436);

      // Highlight near appliance if superhero is close
      if (inside && nearApplianceId) {
        const targetSt = APPLIANCE_STATIONS.find(s => s.id === nearApplianceId);
        if (targetSt) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(targetSt.x, targetSt.y, 22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`[E] ${targetSt.name}`, targetSt.x - 28, targetSt.y - 24);
        }
      }

      // Home Label & Level
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`🏠 HOME (STAGE ${homeLvl}/5)`, shelter.x + 14, shelter.y + 20);

      // Floating Strength Bar above shelter
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(shelter.x + 10, shelter.y - 32, shelter.w - 20, 10);
      const strRatio = stats.shelterStrength / 100;
      ctx.fillStyle = strRatio > 0.5 ? '#22c55e' : strRatio > 0.25 ? '#eab308' : '#ef4444';
      ctx.fillRect(shelter.x + 10, shelter.y - 32, (shelter.w - 20) * strRatio, 10);

      // 6. Coastal Beach Buggy Vehicle
      if (!isDrivingBuggy) {
        ctx.fillStyle = buggyFixed ? '#10b981' : '#eab308';
        ctx.fillRect(VEHICLE_ZONE.x, VEHICLE_ZONE.y, VEHICLE_ZONE.w, VEHICLE_ZONE.h);
        ctx.fillStyle = '#18181b';
        ctx.fillRect(VEHICLE_ZONE.x - 4, VEHICLE_ZONE.y - 2, 8, 10);
        ctx.fillRect(VEHICLE_ZONE.x + VEHICLE_ZONE.w - 4, VEHICLE_ZONE.y - 2, 8, 10);
        ctx.fillRect(VEHICLE_ZONE.x - 4, VEHICLE_ZONE.y + VEHICLE_ZONE.h - 8, 8, 10);
        ctx.fillRect(VEHICLE_ZONE.x + VEHICLE_ZONE.w - 4, VEHICLE_ZONE.y + VEHICLE_ZONE.h - 8, 8, 10);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(buggyFixed ? '🚗 BUGGY' : '⚠️ BUGGY', VEHICLE_ZONE.x + 4, VEHICLE_ZONE.y + 22);
      }

      // 7. Interactive Resource Nodes (with Academic Quiz Badge)
      nodes.forEach(node => {
        if (!node.available) return;

        // Pulsing glow aura
        const pulse = 16 + Math.sin(Date.now() / 200) * 3;
        ctx.fillStyle = 'rgba(234, 179, 8, 0.35)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Icon
        ctx.font = '18px serif';
        ctx.fillText(node.icon, node.x - 9, node.y + 6);

        // Name tag with "QUIZ" badge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(node.x - 34, node.y - 26, 68, 15);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`❓ ${node.name.slice(0, 8)}`, node.x, node.y - 15);
        ctx.textAlign = 'start';
      });

      // 8. Flying Debris in Storm
      if (phase === 'storm') {
        debrisRef.current.forEach(deb => {
          ctx.save();
          ctx.translate(deb.x, deb.y);
          ctx.rotate(deb.rotation);
          if (deb.type === 'tile') {
            ctx.fillStyle = '#ea580c';
            ctx.fillRect(-deb.size / 2, -deb.size / 2, deb.size, deb.size);
          } else if (deb.type === 'crate') {
            ctx.fillStyle = '#b45309';
            ctx.strokeRect(-deb.size / 2, -deb.size / 2, deb.size, deb.size);
            ctx.fillRect(-deb.size / 2, -deb.size / 2, deb.size, deb.size);
          } else if (deb.type === 'branch') {
            ctx.fillStyle = '#15803d';
            ctx.fillRect(-deb.size, -3, deb.size * 2, 6);
          } else {
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(0, 0, deb.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      }

      // 9. Rain Streaks
      ctx.strokeStyle = phase === 'storm' ? 'rgba(200, 225, 255, 0.7)' : 'rgba(200, 225, 255, 0.35)';
      ctx.lineWidth = phase === 'storm' ? 2 : 1;
      ctx.beginPath();
      rainRef.current.forEach(r => {
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x + (phase === 'storm' ? 6 : 2), r.y + r.len);
      });
      ctx.stroke();

      // 10. SUPERHERO PLAYER CHARACTER (SPIDER-MAN, THOR, IRON MAN, CAPTAIN AMERICA, BLACK PANTHER)
      ctx.save();
      ctx.translate(p.x, p.y);

      if (isDrivingBuggy) {
        // Render Buggy around hero
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-24, -18, 48, 36);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-20, -12, 40, 24);
        ctx.font = '16px serif';
        ctx.fillText(activeHero.portrait, -8, 6);
      } else {
        // Draw the selected Marvel superhero sprite!
        drawSuperhero(
          ctx,
          activeHero.id,
          p.facing,
          isMoving,
          p.isSprinting,
          heroAbilityActiveTimer > 0
        );

        // Flashlight beam ahead of superhero during storm
        if (phase === 'storm') {
          ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const angle =
            p.facing === 'up'
              ? -Math.PI / 2
              : p.facing === 'down'
              ? Math.PI / 2
              : p.facing === 'left'
              ? Math.PI
              : 0;
          ctx.arc(0, 0, 95, angle - 0.45, angle + 0.45);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();

      // 11. Fog of War / Dark Vignette during Storm
      if (phase === 'storm') {
        const darkGrad = ctx.createRadialGradient(p.x, p.y, 45, p.x, p.y, 380);
        darkGrad.addColorStop(0, 'rgba(15, 23, 42, 0.15)');
        darkGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.7)');
        darkGrad.addColorStop(1, 'rgba(2, 6, 23, 0.94)');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, 0, 1000, 640);
      }

      // 12. Lightning Flash Screen
      if (lightningFlashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlashRef.current * 0.75})`;
        ctx.fillRect(0, 0, 1000, 640);
        lightningFlashRef.current = Math.max(0, lightningFlashRef.current - 0.08);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    phase,
    stormNumber,
    nodes,
    isDrivingBuggy,
    buggyFixed,
    stats.shelterStrength,
    stats.energy,
    activeHero.id,
    heroAbilityActiveTimer,
    player.homeStructure.level,
  ]);

  // --- PROCEDURAL SUPERHERO CANVAS DRAWING FUNCTION ---
  function drawSuperhero(
    ctx: CanvasRenderingContext2D,
    heroId: string,
    facing: 'up' | 'down' | 'left' | 'right',
    isMoving: boolean,
    isSprinting: boolean,
    abilityActive: boolean
  ) {
    // Drop Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (heroId === 'hero_spiderman' || heroId.includes('spider')) {
      // 🕷️ SPIDER-MAN
      // Webbing trail particles when sprinting
      if (isSprinting || abilityActive) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(-24, (Math.random() - 0.5) * 12);
        ctx.stroke();
      }

      // Legs: Dark Navy Blue with Red boots
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-8, 6, 6, 12);
      ctx.fillRect(2, 6, 6, 12);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-8, 14, 6, 5);
      ctx.fillRect(2, 14, 6, 5);

      // Torso: Red center with navy blue flanks
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-11, -8, 22, 15);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-6, -8, 12, 15);

      // Spider emblem on chest
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-5, -4); ctx.lineTo(5, 0);
      ctx.moveTo(-5, 0); ctx.lineTo(5, -4);
      ctx.stroke();

      // Head: Crimson Red with Web-mask
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -14, 9, 0, Math.PI * 2);
      ctx.fill();

      // Spider-Man angled White Eyes with black border
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.2;

      // Left eye
      ctx.beginPath();
      ctx.moveTo(-6, -17);
      ctx.lineTo(-2, -14);
      ctx.lineTo(-6, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right eye
      ctx.beginPath();
      ctx.moveTo(6, -17);
      ctx.lineTo(2, -14);
      ctx.lineTo(6, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

    } else if (heroId === 'hero_thor' || heroId.includes('thunder')) {
      // ⚡ THOR
      // Flowing Red Cape
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      const windPush = facing === 'left' ? 10 : -10;
      ctx.moveTo(-9, -6);
      ctx.lineTo(9, -6);
      ctx.lineTo(windPush + Math.sin(Date.now() / 150) * 4, 18);
      ctx.lineTo(windPush - 8, 16);
      ctx.closePath();
      ctx.fill();

      // Legs: Dark Navy with gold knee guards
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-8, 6, 6, 12);
      ctx.fillRect(2, 6, 6, 12);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-7, 10, 4, 4);
      ctx.fillRect(3, 10, 4, 4);

      // Torso: Silver armor with Norse disks
      ctx.fillStyle = '#475569';
      ctx.fillRect(-11, -8, 22, 15);
      ctx.fillStyle = '#cbd5e1';
      [-4, 4].forEach(x => {
        [-4, 2].forEach(y => {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Golden Belt
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-9, 5, 18, 2.5);

      // Head with Winged Silver Helmet & Blond Hair
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-9, -16, 18, 8);
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -13, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Silver Helmet
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(0, -16, 7.5, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-7, -16); ctx.lineTo(-13, -21); ctx.lineTo(-7, -18);
      ctx.moveTo(7, -16); ctx.lineTo(13, -21); ctx.lineTo(7, -18);
      ctx.fill();

      // Mjolnir Hammer in Hand
      ctx.save();
      ctx.translate(12, 0);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-1.5, -2, 3, 10);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-5, -7, 10, 7);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(-5, -7, 10, 7);

      if (abilityActive || Math.random() < 0.25) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo((Math.random() - 0.5) * 12, -14);
        ctx.stroke();
      }
      ctx.restore();

    } else if (heroId === 'hero_ironman' || heroId.includes('iron')) {
      // 🦾 IRON MAN
      if (isMoving || abilityActive) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(-5, 19, 3, 0, Math.PI * 2);
        ctx.arc(5, 19, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-5, 22, 2, 0, Math.PI * 2);
        ctx.arc(5, 22, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Legs: Crimson & Gold
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(-8, 6, 6, 12);
      ctx.fillRect(2, 6, 6, 12);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-8, 8, 6, 5);
      ctx.fillRect(2, 8, 6, 5);

      // Torso: Crimson Armor with Gold accents
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(-11, -8, 22, 15);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-10, -8, 3, 12);
      ctx.fillRect(7, -8, 3, 12);

      // Glowing Arc Reactor in chest center!
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -1, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -1, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Helmet: Crimson with Gold faceplate
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(0, -14, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-5, -17, 10, 8);

      // Glowing Visor Eye Slits
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-4, -15, 3, 1.5);
      ctx.fillRect(1, -15, 3, 1.5);

    } else if (heroId === 'hero_captain') {
      // 🛡️ CAPTAIN AMERICA
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-8, 6, 6, 12);
      ctx.fillRect(2, 6, 6, 12);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-8, 13, 6, 5);
      ctx.fillRect(2, 13, 6, 5);

      // Torso: Navy Blue with red & white abdominal stripes
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(-11, -8, 22, 15);
      [-6, -2, 2].forEach(x => {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x, 1, 2, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 2, 1, 2, 6);
      });

      // White Star on chest
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -4, 3, 0, Math.PI * 2);
      ctx.fill();

      // Head: Blue cowl with 'A'
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(0, -14, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-4, -13, 8, 5);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('A', 0, -15);
      ctx.textAlign = 'start';

      // Vibranium Shield on Left Arm
      ctx.save();
      ctx.translate(-13, 0);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else {
      // 🐆 BLACK PANTHER
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8, 6, 6, 12);
      ctx.fillRect(2, 6, 6, 12);
      ctx.fillRect(-11, -8, 22, 15);

      // Kinetic Purple energy lines
      ctx.strokeStyle = abilityActive ? '#c084fc' : '#9333ea';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-9, -6); ctx.lineTo(-4, 0); ctx.lineTo(-9, 5);
      ctx.moveTo(9, -6); ctx.lineTo(4, 0); ctx.lineTo(9, 5);
      ctx.stroke();

      // Silver Claw Necklace
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -6, 5, 0, Math.PI);
      ctx.stroke();

      // Head: Black cowl with cat ears
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -14, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, -18); ctx.lineTo(-9, -24); ctx.lineTo(-3, -20);
      ctx.moveTo(6, -18); ctx.lineTo(9, -24); ctx.lineTo(3, -20);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-5, -15, 3, 1.5);
      ctx.fillRect(2, -15, 3, 1.5);
    }
  }

  // --- ACTIONS ---

  // Eat Food
  const handleEatFood = () => {
    if (inventory.food <= 0) return;
    setInventory(inv => ({ ...inv, food: inv.food - 1 }));
    setStats(s => ({
      ...s,
      hunger: Math.min(100, s.hunger + 30),
      health: Math.min(100, s.health + 5),
    }));
    soundManager.playBiteEat();
    setRecentLog('🍗 Consumed food rations (+30 Hunger, +5 Health)');
  };

  // Drink Water
  const handleDrinkWater = () => {
    if (inventory.water <= 0) return;
    setInventory(inv => ({ ...inv, water: inv.water - 1 }));
    setStats(s => ({
      ...s,
      water: Math.min(100, s.water + 35),
      energy: Math.min(100, s.energy + 8),
    }));
    soundManager.playDrink();
    setRecentLog('💧 Drank clean water (+35 Water, +8 Energy)');
  };

  // Use Battery
  const handleUseBattery = () => {
    if (inventory.batteries <= 0) return;
    setInventory(inv => ({ ...inv, batteries: inv.batteries - 1 }));
    setStats(s => ({
      ...s,
      energy: Math.min(100, s.energy + 40),
    }));
    soundManager.playBeep(880, 0.1);
    setRecentLog('🔋 Recharged emergency flashlight & equipment (+40 Energy)');
  };

  // Use First Aid
  const handleUseFirstAid = () => {
    if (inventory.firstAid <= 0) return;
    setInventory(inv => ({ ...inv, firstAid: inv.firstAid - 1 }));
    setStats(s => ({
      ...s,
      health: Math.min(100, s.health + 35),
    }));
    soundManager.playSuccess();
    setRecentLog('🩹 Applied First Aid Kit (+35 Health)');
  };

  // Reinforce Shelter
  const handleReinforceShelter = () => {
    if (!isInsideShelter) {
      setRecentLog('⚠️ You must be inside the Home Shelter to reinforce it!');
      return;
    }
    if (inventory.wood <= 0) {
      setRecentLog('⚠️ Need Wood Planks (🪵) to reinforce shelter walls!');
      return;
    }
    const toolsBonus = inventory.tools > 0 ? 25 : 15;
    setInventory(inv => ({ ...inv, wood: inv.wood - 1 }));
    setStats(s => ({
      ...s,
      shelterStrength: Math.min(100, s.shelterStrength + toolsBonus),
      energy: Math.max(0, s.energy - 6),
    }));
    soundManager.playHammerRepair();
    setRecentLog(`🔨 Reinforced shelter with wood & hammer (+${toolsBonus}% Shelter Strength)`);
  };

  // --- INTERACTION & QUIZ MODAL TRIGGER ---
  // "the character must attend the quiz before collect rewards"
  const handleInteract = () => {
    const p = playerRef.current;

    // 0. Check Home Appliance interaction if inside shelter
    if (isInsideShelter && nearApplianceId) {
      if (nearApplianceId === 'tv') {
        soundManager.playTvChime();
        setAppliances(prev => {
          const nextChan = (prev.tv.channel + 1) % 4;
          const chanNames = [
            '🛰️ Cyclone Radar & Weather',
            '📢 Disaster Management Alert',
            '🌍 National Geographic Earth',
            '🦸 Marvel Superhero News',
          ];
          setRecentLog(`📺 Smart TV: Channel ${nextChan + 1} (${chanNames[nextChan]}) streaming!`);
          return {
            ...prev,
            tv: { ...prev.tv, powered: true, channel: nextChan, channelName: chanNames[nextChan] },
          };
        });
        return;
      }
      if (nearApplianceId === 'switch') {
        soundManager.playSwitchClick();
        setAppliances(prev => {
          const nextState = !prev.lightSwitch.turnedOn;
          setRecentLog(nextState ? '💡 Wall Switch flipped ON: Ceiling lights lit!' : '🌑 Wall Switch flipped OFF: Lights dimmed.');
          return {
            ...prev,
            lightSwitch: { ...prev.lightSwitch, turnedOn: nextState },
          };
        });
        return;
      }
      if (nearApplianceId === 'fridge') {
        soundManager.playFridgeDoor();
        if (appliances.fridge.coldWaterCount > 0 && stats.water < 90) {
          soundManager.playDrink();
          setAppliances(prev => ({
            ...prev,
            fridge: { ...prev.fridge, coldWaterCount: prev.fridge.coldWaterCount - 1 },
          }));
          setStats(s => ({ ...s, water: Math.min(100, s.water + 30) }));
          setRecentLog('💧 Drank chilled water from fridge: +30% Water!');
        } else if (appliances.fridge.snacksCount > 0 && stats.hunger < 90) {
          soundManager.playEat();
          setAppliances(prev => ({
            ...prev,
            fridge: { ...prev.fridge, snacksCount: prev.fridge.snacksCount - 1 },
          }));
          setStats(s => ({ ...s, hunger: Math.min(100, s.hunger + 30), energy: Math.min(100, s.energy + 10) }));
          setRecentLog('🥪 Ate cold snack from fridge: +30% Hunger, +10% Energy!');
        } else {
          setShowAppliancesModal(true);
        }
        return;
      }
      if (nearApplianceId === 'fan') {
        soundManager.playSwitchClick();
        setAppliances(prev => {
          const nextSpd = prev.fan.turnedOn ? ((prev.fan.speed % 3) + 1) : 1;
          const nextOn = prev.fan.speed === 3 ? !prev.fan.turnedOn : true;
          setRecentLog(nextOn ? `🌀 Ceiling fan speed set to Speed ${nextSpd}!` : '🌀 Ceiling fan turned off.');
          return {
            ...prev,
            fan: { ...prev.fan, turnedOn: nextOn, speed: nextSpd },
          };
        });
        return;
      }
      if (nearApplianceId === 'sofa') {
        soundManager.playSuccess();
        setStats(s => ({ ...s, energy: 100, health: Math.min(100, s.health + 10) }));
        setRecentLog('🛋️ Rested on living room sofa: Energy fully restored to 100%!');
        return;
      }
      if (nearApplianceId === 'microwave') {
        soundManager.playSwitchClick();
        soundManager.playMicrowaveDing();
        setStats(s => ({ ...s, hunger: Math.min(100, s.hunger + 40), health: Math.min(100, s.health + 20) }));
        setRecentLog('♨️ Heated fresh hot dinner in microwave: +40 Hunger, +20 Health!');
        return;
      }
    }

    // 1. Check Evacuation Point interaction
    const inEvac =
      p.x >= EVAC_ZONE.x &&
      p.x <= EVAC_ZONE.x + EVAC_ZONE.w &&
      p.y >= EVAC_ZONE.y &&
      p.y <= EVAC_ZONE.y + EVAC_ZONE.h;

    if (inEvac) {
      const { antenna, battery, flare } = inventory.beaconParts;
      if (antenna && battery && flare) {
        if (!evacuationCalled) {
          setEvacuationCalled(true);
          setEvacTimer(20);
          soundManager.playAlarm();
          soundManager.playHelicopter();
          setRecentLog('🚨 DISTRESS BEACON ACTIVATED! Rescue Helicopter inbound in 20 seconds! Hold out at the dock!');
        }
        return;
      } else {
        setRecentLog(
          `📡 Rescue Pier Beacon requires 3 parts: [${antenna ? '✅' : '❌'} Antenna] [${
            battery ? '✅' : '❌'
          } Battery] [${flare ? '✅' : '❌'} Flare Gun]. Answer cache quizzes to find them!`
        );
        return;
      }
    }

    // 2. Check Node collection: PROMPT QUIZ BEFORE REWARDS!
    if (nearNode && nearNode.available) {
      // Pick a curriculum question from the current 50 levels!
      const levelQuestions = getQuestionsForLevel(currentLevel);
      // Pick an unanswered question for this attempt
      const unanswered = levelQuestions.filter(q => !player.answeredQuestionIds.includes(q.id));
      const chosenQuestion = unanswered.length > 0 ? unanswered[0] : levelQuestions[0];

      setPendingQuizNode(nearNode);
      setActiveQuizQuestion(chosenQuestion);
      setQuizSelectedIndex(null);
      setQuizIsAnswered(false);
      setQuizIsCorrect(false);
      setQuizRevealedHint(false);
      soundManager.playBeep(640, 0.06);
    }
  };

  // Submit Answer to Cache Quiz
  const handleQuizSubmit = () => {
    if (quizSelectedIndex === null || !activeQuizQuestion || quizIsAnswered) return;

    const isCorrect = quizSelectedIndex === activeQuizQuestion.correctIndex;
    setQuizIsAnswered(true);
    setQuizIsCorrect(isCorrect);

    if (isCorrect) {
      soundManager.playSuccess();

      // Record answer history
      if (onRecordHistory) {
        onRecordHistory({
          questionId: activeQuizQuestion.id,
          levelNumber: currentLevel,
          questionText: activeQuizQuestion.question,
          difficulty: activeQuizQuestion.difficulty,
          subject: activeQuizQuestion.subject,
          selectedAnswer: activeQuizQuestion.options[quizSelectedIndex],
          correctAnswer: activeQuizQuestion.options[activeQuizQuestion.correctIndex],
          isCorrect: true,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Add to answered questions so no repeat!
      onUpdatePlayer(prev => ({
        ...prev,
        xp: prev.xp + 45,
        coins: prev.coins + 30,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
        consecutiveCorrect: prev.consecutiveCorrect + 1,
        maxConsecutiveStreak: Math.max(prev.maxConsecutiveStreak, prev.consecutiveCorrect + 1),
        answeredQuestionIds: prev.answeredQuestionIds.includes(activeQuizQuestion.id)
          ? prev.answeredQuestionIds
          : [...prev.answeredQuestionIds, activeQuizQuestion.id],
      }));
    } else {
      soundManager.playFailure();
      onUpdatePlayer(prev => ({
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        consecutiveCorrect: 0,
      }));
    }
  };

  // Claim Rewards after Quiz Solved
  const handleClaimQuizReward = () => {
    if (!pendingQuizNode || !quizIsCorrect) {
      setPendingQuizNode(null);
      setActiveQuizQuestion(null);
      return;
    }

    const node = pendingQuizNode;

    // 1. Mark node as collected
    setNodes(prev => prev.map(n => (n.id === node.id ? { ...n, available: false } : n)));
    setSuppliesGatheredCount(c => c + 1);

    // 2. Grant Survival Supplies
    if (node.type === 'food') {
      setInventory(inv => ({ ...inv, food: inv.food + 2 }));
    } else if (node.type === 'water') {
      setInventory(inv => ({ ...inv, water: inv.water + 2 }));
    } else if (node.type === 'wood') {
      setInventory(inv => ({ ...inv, wood: inv.wood + 3 }));
    } else if (node.type === 'tools') {
      setInventory(inv => ({ ...inv, tools: inv.tools + 1 }));
    } else if (node.type === 'battery') {
      setInventory(inv => ({ ...inv, batteries: inv.batteries + 2 }));
    } else if (node.type === 'firstAid') {
      setInventory(inv => ({ ...inv, firstAid: inv.firstAid + 1 }));
    } else if (node.type === 'beacon_part') {
      const pt = node.partType!;
      setInventory(inv => ({
        ...inv,
        beaconParts: { ...inv.beaconParts, [pt]: true },
      }));
    }

    // 3. Grant Home Building Materials (Wood, Rope, Lights, Electronics, Bricks)
    onUpdatePlayer(prev => ({
      ...prev,
      homeMaterials: {
        wood: prev.homeMaterials.wood + 2,
        rope: prev.homeMaterials.rope + 1,
        lights: prev.homeMaterials.lights + 1,
        electronics: prev.homeMaterials.electronics + 1,
        bricks: prev.homeMaterials.bricks + 2,
      },
    }));

    setRecentLog(
      `🎉 QUIZ CLEARED! Collected ${node.name} + Home Materials (Wood, Rope, Electronics)!`
    );

    // Track Daily Missions
    trackDailyMissionProgress('questions_answered', 1);
    if (activeQuizQuestion?.subject === 'mathematics') {
      trackDailyMissionProgress('math_solved', 1);
    } else if (activeQuizQuestion?.subject === 'science') {
      trackDailyMissionProgress('science_solved', 1);
    }
    trackDailyMissionProgress('supplies_gathered', 1);

    // 4. Check Level Completion (all 7 curriculum questions cleared advances to next level!)
    const nextSolved = levelSolvedCount + 1;
    setLevelSolvedCount(nextSolved);

    setPendingQuizNode(null);
    setActiveQuizQuestion(null);

    if (nextSolved >= 7) {
      trackDailyMissionProgress('level_completed', 1);
      // Trigger Level Finished Modal!
      setLastEarnedMaterials({
        wood: 10,
        rope: 6,
        lights: 4,
        electronics: 2,
        bricks: 8,
      });
      setShowLevelCompleteModal(true);
      soundManager.playSuccess();
    }
  };

  // Spend Diamond for Hint
  const handleSpendDiamondHint = () => {
    if (quizRevealedHint) return;
    if (player.diamonds < 1) {
      soundManager.playFailure();
      return;
    }
    onUpdatePlayer(prev => ({ ...prev, diamonds: Math.max(0, prev.diamonds - 1) }));
    soundManager.playDiamondChime();
    setQuizRevealedHint(true);
  };

  // Toggle Driving Buggy Vehicle
  const handleToggleVehicle = () => {
    const p = playerRef.current;
    if (isDrivingBuggy) {
      setIsDrivingBuggy(false);
      soundManager.playBeep(340, 0.08);
      setRecentLog(`🚶 ${activeHero.name} exited Beach Buggy.`);
      return;
    }

    const dist = Math.hypot(p.x - VEHICLE_ZONE.x, p.y - VEHICLE_ZONE.y);
    if (dist < 60) {
      if (!buggyFixed) {
        if (inventory.batteries >= 1 && inventory.tools >= 1) {
          setInventory(inv => ({ ...inv, batteries: inv.batteries - 1 }));
          setBuggyFixed(true);
          setIsDrivingBuggy(true);
          soundManager.playSuccess();
          setRecentLog(`🚗 REPAIRED BEACH BUGGY! ${activeHero.name} speed boosted by 2.3x!`);
        } else {
          setRecentLog('⚠️ Buggy requires 1 Battery (🔋) and 1 Toolset (🔨) to start engine!');
        }
      } else {
        setIsDrivingBuggy(true);
        soundManager.playBeep(620, 0.08);
        setRecentLog(`🚗 ${activeHero.name} entered Beach Buggy!`);
      }
    }
  };

  // Proceed to Next Level after Level Complete
  const handleProceedToNextLevel = () => {
    setShowLevelCompleteModal(false);
    setLevelSolvedCount(0);
    const nextLvl = Math.min(50, currentLevel + 1);
    onUpdateLevel(nextLvl);
    onUpdatePlayer(prev => ({
      ...prev,
      completedLevels: prev.completedLevels.includes(currentLevel)
        ? prev.completedLevels
        : [...prev.completedLevels, currentLevel],
      homeMaterials: {
        wood: prev.homeMaterials.wood + lastEarnedMaterials.wood,
        rope: prev.homeMaterials.rope + lastEarnedMaterials.rope,
        lights: prev.homeMaterials.lights + lastEarnedMaterials.lights,
        electronics: prev.homeMaterials.electronics + lastEarnedMaterials.electronics,
        bricks: prev.homeMaterials.bricks + lastEarnedMaterials.bricks,
      },
    }));
    // Respawn / refresh supply nodes for the new level!
    setNodes(INITIAL_WORLD_NODES.map(n => ({ ...n, available: true })));
    setRecentLog(`🚀 LEVEL ${nextLvl} UNLOCKED! New curriculum questions ready in supply caches!`);
    soundManager.playSuccess();
  };

  // Reset Game
  const handleRestart = () => {
    setStats({
      health: 100,
      hunger: 100,
      water: 100,
      energy: 100,
      shelterStrength: 65 + player.homeStructure.level * 8,
    });
    setInventory({
      food: 2,
      water: 2,
      batteries: 1,
      tools: 1,
      wood: 3,
      firstAid: 1,
      beaconParts: { antenna: false, battery: false, flare: false },
    });
    setPhase('warning');
    setStormNumber(1);
    setPhaseSecondsLeft(30);
    setPlayingTimeSecondsLeft(300);
    setTotalSecondsSurvived(0);
    setSuppliesGatheredCount(0);
    setIsDrivingBuggy(false);
    setBuggyFixed(false);
    setEvacuationCalled(false);
    setEvacTimer(0);
    setNodes(INITIAL_WORLD_NODES);
    playerRef.current.x = 480;
    playerRef.current.y = 470;
    setRecentLog(`⚠️ STORM WARNING: 30s until landfall! ${activeHero.name} ready for defense!`);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-neutral-950 text-neutral-100 select-none overflow-x-hidden">
      {/* Top Header & Status Bar */}
      <header className="w-full bg-neutral-900/95 border-b border-neutral-800 px-4 py-2 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
          >
            ← Menu
          </button>

          {/* Student Cadet Username Badge & Switch User */}
          {onSwitchUser && (
            <button
              onClick={onSwitchUser}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono-code transition cursor-pointer"
              title="Click to Switch Student User / Logout to Login Page"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold truncate max-w-[85px] sm:max-w-[120px]">
                {player.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono-code">⇄</span>
            </button>
          )}

          {/* Active Superhero Badge & Switcher */}
          <button
            onClick={() => setShowHeroSelectorModal(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition cursor-pointer"
            title="Click to Switch Superhero"
          >
            <span className="text-xl">{activeHero.portrait}</span>
            <div className="text-left">
              <div className="text-xs font-bold font-display text-amber-400 leading-none">
                {activeHero.name}
              </div>
              <span className="text-[10px] text-neutral-400 font-mono-code">
                [C] Switch Hero
              </span>
            </div>
          </button>

          {/* 50-Level Academy Tracker */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-code">
            <Award className="w-3.5 h-3.5" />
            <span>
              Level <strong className="text-white">{currentLevel}</strong> / 50 · ({levelSolvedCount}/7 Questions)
            </span>
          </div>

          {/* Rebuild Home Workshop Button */}
          <button
            onClick={() => setShowHomeBuilderModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono-code transition cursor-pointer"
          >
            <HomeIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Rebuild Home (L{player.homeStructure.level}) [B]</span>
          </button>

          {/* Home Appliances Button: TV, Fridge, Switch, Light, Fan, Microwave */}
          <button
            onClick={() => setShowAppliancesModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-mono-code transition cursor-pointer shadow-sm"
            title="Open Home Living Room & Smart Appliances"
          >
            <Tv className="w-3.5 h-3.5 text-sky-400" />
            <span>Home Appliances [H]</span>
          </button>
        </div>

        {/* Phase Timer Banner & Controls */}
        {/* Phase Timer Banner & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* User Request: 5 Minutes Playing Time */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-950/80 border border-cyan-500/30 text-xs font-mono-code text-cyan-300"
            title="Total Island Playing Time (5 Minutes)"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Play Time: <strong className="text-white font-bold">{formatTime(playingTimeSecondsLeft)}</strong>/05:00</span>
          </div>

          {/* User Request: Level Promotion Quest Tracker (Build 5 homes & rescue from storm 2 times) */}
          <button
            onClick={() => setShowHomeBuilderModal(true)}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-amber-500/40 text-xs font-mono-code transition cursor-pointer"
            title="Level Promotion: Build 5 Homes & Rescue 2 Times"
          >
            <span className="text-amber-400 font-bold">🏆 Promo Quest:</span>
            <span className={homesBuiltCount >= 5 ? 'text-emerald-400 font-bold' : 'text-neutral-300'}>
              🏡 {homesBuiltCount}/5 {homesBuiltCount >= 5 ? '✅' : ''}
            </span>
            <span className="text-neutral-600">·</span>
            <span className={rescuedFromStormCount >= 2 ? 'text-emerald-400 font-bold' : 'text-neutral-300'}>
              🛡️ {rescuedFromStormCount}/2 {rescuedFromStormCount >= 2 ? '✅' : ''}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              {player.rank}
            </span>
          </button>

          {/* User Request: Storm Time into 30 Seconds */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs font-mono-code">
            <span className="text-neutral-400 text-[10px] uppercase font-bold mr-0.5">Storm:</span>
            {[30, 45, 60, 90, 120].map(sec => (
              <button
                key={sec}
                onClick={() => {
                  setStormDurationSeconds(sec);
                  soundManager.playBeep(440 + (sec / 10) * 20, 0.05);
                  if (phase === 'storm') {
                    setPhaseSecondsLeft(sec);
                  }
                  setRecentLog(`⏱️ Storm duration set to ${sec} seconds!`);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  stormDurationSeconds === sec
                    ? 'bg-rose-500 text-white shadow-sm font-black ring-1 ring-rose-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={`Set Storm duration to ${sec}s`}
              >
                {sec}s
              </button>
            ))}
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-xl border font-mono-code text-xs font-bold ${
              phase === 'storm'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                : phase === 'warning'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>
              {phase === 'warning' && `Storm in ${phaseSecondsLeft}s`}
              {phase === 'storm' && `🌪️ Cyclone: ${phaseSecondsLeft}s left`}
              {phase === 'aftermath' && `Calm window: ${phaseSecondsLeft}s`}
              {phase === 'victory' && 'RESCUED!'}
              {phase === 'defeat' && 'FALLEN'}
            </span>
          </div>

          {evacuationCalled && evacTimer > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono-code text-xs animate-bounce">
              <Radio className="w-3.5 h-3.5" />
              <span>Chopper: {evacTimer}s</span>
            </div>
          )}

          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* 5 SURVIVAL STAT METERS */}
      <div className="w-full bg-neutral-900/95 border-b border-neutral-800 px-4 py-2 grid grid-cols-2 sm:grid-cols-5 gap-2 z-10 text-xs">
        {/* ❤️ Health */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> Health
            </span>
            <span className="font-mono-code font-bold text-rose-300">{Math.round(stats.health)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.health)}%` }}
            />
          </div>
        </div>

        {/* 🍗 Hunger */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-400 font-bold">🍗 Hunger</span>
            <span className="font-mono-code font-bold text-amber-300">{Math.round(stats.hunger)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.hunger)}%` }}
            />
          </div>
        </div>

        {/* 💧 Water */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-cyan-400 font-bold">
              <Droplet className="w-3.5 h-3.5 fill-cyan-500" /> Water
            </span>
            <span className="font-mono-code font-bold text-cyan-300">{Math.round(stats.water)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.water)}%` }}
            />
          </div>
        </div>

        {/* 🔋 Energy */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-yellow-400 font-bold">
              <Zap className="w-3.5 h-3.5 fill-yellow-500" /> Energy
            </span>
            <span className="font-mono-code font-bold text-yellow-300">{Math.round(stats.energy)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-yellow-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.energy)}%` }}
            />
          </div>
        </div>

        {/* 🏠 Shelter strength */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Shield className="w-3.5 h-3.5 fill-emerald-500" /> Shelter Integrity
            </span>
            <span className="font-mono-code font-bold text-emerald-300">
              {Math.round(stats.shelterStrength)}%
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.shelterStrength)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas & Game Viewport */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-neutral-950">
        <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-black">
          <canvas
            ref={canvasRef}
            width={1000}
            height={640}
            className="w-full h-auto block select-none cursor-crosshair"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const scaleX = 1000 / rect.width;
              const scaleY = 640 / rect.height;
              const targetX = (e.clientX - rect.left) * scaleX;
              const targetY = (e.clientY - rect.top) * scaleY;
              playerRef.current.x = Math.max(40, Math.min(960, targetX));
              playerRef.current.y = Math.max(50, Math.min(710, targetY));
            }}
          />

          {/* Location & Shelter indicator */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md flex items-center gap-2 ${
                isInsideShelter
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : phase === 'storm'
                  ? 'bg-rose-950/90 border-rose-500/70 text-rose-300 animate-pulse'
                  : 'bg-neutral-900/80 border-neutral-700 text-neutral-300'
              }`}
            >
              {isInsideShelter ? (
                <>
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>🛡️ INSIDE SAFE REINFORCED HOME (Protected from gales & flying debris)</span>
                </>
              ) : phase === 'storm' ? (
                <>
                  <Wind className="w-4 h-4 text-rose-400" />
                  <span>⚠️ EXTREME STORM EXPOSURE! Use {activeHero.name}&apos;s ability [Q] or get inside!</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>
                    {activeHero.name} Exploring Island · Approach supply caches & solve quiz to collect!
                  </span>
                </>
              )}
            </div>

            {/* Prompt when near appliance inside shelter */}
            {isInsideShelter && nearApplianceId && (
              <div className="px-3.5 py-2 rounded-xl bg-sky-500 text-neutral-950 font-black text-xs flex items-center gap-2.5 shadow-xl animate-bounce pointer-events-auto">
                <span className="text-base">{APPLIANCE_STATIONS.find(a => a.id === nearApplianceId)?.icon}</span>
                <span>
                  Press [E] or Click: {APPLIANCE_STATIONS.find(a => a.id === nearApplianceId)?.prompt}
                </span>
                <button
                  onClick={handleInteract}
                  className="px-2.5 py-1 bg-neutral-950 text-sky-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-900"
                >
                  Interact
                </button>
                <button
                  onClick={() => setShowAppliancesModal(true)}
                  className="px-2 py-1 bg-sky-950 text-sky-200 border border-sky-400/40 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-sky-900"
                >
                  All Appliances [H]
                </button>
              </div>
            )}

            {/* Prompt when near interactive cache */}
            {nearNode && nearNode.available && (
              <div className="px-3.5 py-2 rounded-xl bg-amber-500 text-neutral-950 font-black text-xs flex items-center gap-2.5 shadow-xl animate-bounce pointer-events-auto">
                <span className="text-base">{nearNode.icon}</span>
                <span>
                  Press [E] or Click: Attend Quiz to Unlock {nearNode.name}!
                </span>
                <button
                  onClick={handleInteract}
                  className="px-2.5 py-1 bg-neutral-950 text-amber-400 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-900"
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>

          {/* Superhero Ability Indicator Overlay */}
          <div className="absolute bottom-10 left-3 pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleActivateHeroAbility}
              disabled={heroAbilityCooldown > 0}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold backdrop-blur-md transition cursor-pointer shadow-lg active:scale-95 ${
                heroAbilityCooldown === 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 border-amber-300 shadow-amber-500/20 animate-pulse'
                  : 'bg-neutral-900/85 text-neutral-400 border-neutral-800'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>
                [Q] {activeHero.abilityName}{' '}
                {heroAbilityCooldown > 0 ? `(${heroAbilityCooldown}s)` : 'READY!'}
              </span>
            </button>
          </div>

          {/* Evacuation Beacon Parts & 7 Questions Overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md flex items-center gap-2 text-neutral-300">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rescue Parts:</span>
              <span className={inventory.beaconParts.antenna ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>
                📡 Antenna
              </span>
              <span className={inventory.beaconParts.battery ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>
                ⚡ Battery
              </span>
              <span className={inventory.beaconParts.flare ? 'text-emerald-400 font-bold' : 'text-neutral-600'}>
                🚨 Flare
              </span>
            </div>

            {/* 7 Curriculum Questions Tracker for Level */}
            <div className="px-3 py-1.5 rounded-xl bg-neutral-900/85 border border-amber-500/30 backdrop-blur-md flex items-center justify-between gap-2 text-neutral-200">
              <span className="font-bold text-amber-300">Level {currentLevel} Questions:</span>
              <span className="font-mono-code font-bold text-white">
                {levelSolvedCount} / 7
              </span>
              <div className="w-16 bg-neutral-800 h-2 rounded-full overflow-hidden border border-neutral-700">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (levelSolvedCount / 7) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Log Banner at Bottom */}
          <div className="absolute bottom-2 left-3 right-3 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-neutral-800 backdrop-blur-md text-xs font-mono-code text-neutral-300 flex items-center gap-2">
              <span className="text-amber-400 font-bold">ℹ️ LOG:</span>
              <span className="truncate">{recentLog}</span>
            </div>
          </div>
        </div>

        {/* Quick-Access Hotbar & Inventory Bar */}
        <div className="w-full max-w-5xl mt-3 flex flex-wrap items-center justify-between gap-2">
          {/* Quick Item Slots */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Slot 1: Food */}
            <button
              onClick={handleEatFood}
              disabled={inventory.food <= 0}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 flex items-center gap-2 text-xs font-semibold cursor-pointer transition active:scale-95"
              title="Press [1] to Eat"
            >
              <span className="text-base">🍗</span>
              <div className="text-left">
                <div className="text-neutral-200">Eat Food</div>
                <div className="text-[10px] text-amber-400 font-mono-code">x{inventory.food} [1]</div>
              </div>
            </button>

            {/* Slot 2: Water */}
            <button
              onClick={handleDrinkWater}
              disabled={inventory.water <= 0}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 flex items-center gap-2 text-xs font-semibold cursor-pointer transition active:scale-95"
              title="Press [2] to Drink"
            >
              <span className="text-base">💧</span>
              <div className="text-left">
                <div className="text-neutral-200">Drink Water</div>
                <div className="text-[10px] text-cyan-400 font-mono-code">x{inventory.water} [2]</div>
              </div>
            </button>

            {/* Slot 3: Battery */}
            <button
              onClick={handleUseBattery}
              disabled={inventory.batteries <= 0}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 flex items-center gap-2 text-xs font-semibold cursor-pointer transition active:scale-95"
              title="Press [3] to Recharge"
            >
              <span className="text-base">🔋</span>
              <div className="text-left">
                <div className="text-neutral-200">Battery</div>
                <div className="text-[10px] text-yellow-400 font-mono-code">x{inventory.batteries} [3]</div>
              </div>
            </button>

            {/* Slot 4: First Aid */}
            <button
              onClick={handleUseFirstAid}
              disabled={inventory.firstAid <= 0}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 border border-neutral-800 flex items-center gap-2 text-xs font-semibold cursor-pointer transition active:scale-95"
              title="Press [4] to Heal"
            >
              <span className="text-base">🩹</span>
              <div className="text-left">
                <div className="text-neutral-200">First Aid</div>
                <div className="text-[10px] text-rose-400 font-mono-code">x{inventory.firstAid} [4]</div>
              </div>
            </button>

            {/* Slot 5: Reinforce Shelter */}
            <button
              onClick={handleReinforceShelter}
              disabled={inventory.wood <= 0 || !isInsideShelter}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition active:scale-95 ${
                isInsideShelter
                  ? 'bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-50 cursor-not-allowed'
              }`}
              title="Press [5] or [R] inside shelter"
            >
              <span className="text-base">🔨</span>
              <div className="text-left">
                <div>Reinforce</div>
                <div className="text-[10px] text-emerald-400 font-mono-code">
                  {inventory.wood} Wood [5/R]
                </div>
              </div>
            </button>

            {/* Rebuild Home Workshop Button */}
            <button
              onClick={() => setShowHomeBuilderModal(true)}
              className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-300 flex items-center gap-2 text-xs font-semibold cursor-pointer transition"
            >
              <HomeIcon className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div>Rebuild Home</div>
                <div className="text-[10px] text-neutral-400 font-mono-code">Stage {player.homeStructure.level}/5 [B]</div>
              </div>
            </button>

            {/* Buggy Vehicle Action */}
            <button
              onClick={handleToggleVehicle}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition ${
                isDrivingBuggy
                  ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
              }`}
            >
              <span className="text-base">🚗</span>
              <div className="text-left">
                <div>{isDrivingBuggy ? 'Exit Buggy' : 'Drive Buggy'}</div>
                <div className="text-[10px] opacity-75 font-mono-code">[F] Key</div>
              </div>
            </button>
          </div>

          {/* Action Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleInteract}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg active:scale-95"
            >
              <span>[E] ATTEND CACHE QUIZ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          QUIZ MODAL BEFORE COLLECTING REWARDS (MERGED FEATURE)
          ======================================================== */}
      {pendingQuizNode && activeQuizQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-4">
            {/* Header: Superhero + Cache Clearance */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                  {activeHero.portrait}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-display text-neutral-100">
                      {activeHero.name} · Supply Cache Clearance
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono-code uppercase">
                      Level {currentLevel}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Unlocking: <strong className="text-amber-400">{pendingQuizNode.name}</strong> ({pendingQuizNode.description})
                  </p>
                </div>
              </div>

              {/* Subject Tag */}
              <div className="px-3 py-1 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono-code text-neutral-300 capitalize">
                {activeQuizQuestion.subjectLabel || activeQuizQuestion.subject}
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80">
              <div className="text-[11px] font-mono-code text-neutral-400 uppercase tracking-wider mb-1">
                Question {activeQuizQuestion.questionNumber} of 15 (Difficulty: {activeQuizQuestion.difficulty})
              </div>
              <p className="text-sm sm:text-base font-semibold text-neutral-100 leading-relaxed">
                {activeQuizQuestion.question}
              </p>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeQuizQuestion.options.map((opt, idx) => {
                const isSelected = quizSelectedIndex === idx;
                const isCorrectOption = idx === activeQuizQuestion.correctIndex;
                let btnStyle =
                  'bg-neutral-950/80 hover:bg-neutral-800 text-neutral-200 border-neutral-800';

                if (quizIsAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-200';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!quizIsAnswered) {
                        setQuizSelectedIndex(idx);
                        soundManager.playBeep(520 + idx * 40, 0.05);
                      }
                    }}
                    disabled={quizIsAnswered}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${btnStyle}`}
                  >
                    <span>
                      <strong className="mr-2 text-neutral-400">
                        {String.fromCharCode(65 + idx)}.
                      </strong>
                      {opt}
                    </span>
                    {quizIsAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
                    )}
                    {quizIsAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Diamond Hint Reveal */}
            {activeQuizQuestion.hint && (
              <div className="flex items-center justify-between pt-1">
                {quizRevealedHint ? (
                  <div className="text-xs text-amber-300 font-mono-code bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 w-full">
                    💡 <strong>Hint:</strong> {activeQuizQuestion.hint}
                  </div>
                ) : (
                  <button
                    onClick={handleSpendDiamondHint}
                    disabled={player.diamonds < 1 || quizIsAnswered}
                    className="text-xs text-neutral-400 hover:text-cyan-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Gem className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Reveal Hint (-1 Diamond) · Available: {player.diamonds} 💎</span>
                  </button>
                )}
              </div>
            )}

            {/* Explanation when answered */}
            {quizIsAnswered && (
              <div
                className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                  quizIsCorrect
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                }`}
              >
                <strong>{quizIsCorrect ? '✅ Correct Answer!' : '❌ Incorrect:'}</strong>{' '}
                {activeQuizQuestion.explanation || 'Great effort! Master curriculum fundamentals to survive.'}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setPendingQuizNode(null);
                  setActiveQuizQuestion(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>

              {!quizIsAnswered ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizSelectedIndex === null}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Confirm Answer
                </button>
              ) : (
                <button
                  onClick={handleClaimQuizReward}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-lg ${
                    quizIsCorrect
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20 animate-pulse'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {quizIsCorrect ? 'Claim Rewards & Collect Cache' : 'Try Another Cache'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          LEVEL FINISHED MODAL (Exact User Request: "YOU ARE FINISHED LEVEL X")
          ======================================================== */}
      {showLevelCompleteModal && (
        <LevelCompleteModal
          levelNumber={currentLevel}
          score={25}
          maxScore={25}
          materialsEarned={lastEarnedMaterials}
          onProceedToNextLevel={handleProceedToNextLevel}
          onOpenHomeBuilder={() => {
            setShowLevelCompleteModal(false);
            setShowHomeBuilderModal(true);
          }}
          onReturnToDashboard={onOpenAcademyMode}
        />
      )}

      {/* ========================================================
          HOME BUILDER WORKSHOP MODAL
          ======================================================== */}
      {showHomeBuilderModal && (
        <HomeBuilderModal
          materials={player.homeMaterials}
          structure={player.homeStructure}
          homesBuiltCount={homesBuiltCount}
          onUpgradeHome={(newLevel, req) => {
            onUpdatePlayer(prev => ({
              ...prev,
              homeStructure: {
                level: newLevel,
                durability: 100,
              },
              homeMaterials: {
                wood: prev.homeMaterials.wood - (req.wood || 0),
                rope: prev.homeMaterials.rope - (req.rope || 0),
                lights: prev.homeMaterials.lights - (req.lights || 0),
                electronics: prev.homeMaterials.electronics - (req.electronics || 0),
                bricks: prev.homeMaterials.bricks - (req.bricks || 0),
              },
            }));
            setStats(s => ({ ...s, shelterStrength: Math.min(100, s.shelterStrength + 30) }));
            soundManager.playSuccess();
            setRecentLog(`🏠 HOME UPGRADED TO STAGE ${newLevel}/5! Shelter Integrity +30%!`);

            // Increment homes built count and check promotion condition
            setHomesBuiltCount(prevHomes => {
              const nextHomes = prevHomes + 1;
              checkAndTriggerPromotion(nextHomes, rescuedFromStormCount);
              return nextHomes;
            });
          }}
          onConstructAdditionalHome={() => {
            onUpdatePlayer(prev => ({
              ...prev,
              homeMaterials: {
                ...prev.homeMaterials,
                wood: Math.max(0, prev.homeMaterials.wood - 4),
                bricks: Math.max(0, prev.homeMaterials.bricks - 3),
              },
            }));
            soundManager.playSuccess();
            setStats(s => ({ ...s, shelterStrength: 100 }));
            setRecentLog(`🏡 CONSTRUCTED ADDITIONAL COASTAL OUTPOST! Shelter network expanded!`);

            setHomesBuiltCount(prevHomes => {
              const nextHomes = prevHomes + 1;
              checkAndTriggerPromotion(nextHomes, rescuedFromStormCount);
              return nextHomes;
            });
          }}
          onClose={() => setShowHomeBuilderModal(false)}
        />
      )}

      {/* ========================================================
          HOME LIVING ROOM & APPLIANCES MODAL (TV, Fridge, Switch, Light, Fan, Microwave, Sofa)
          ======================================================== */}
      {showAppliancesModal && (
        <HomeAppliancesModal
          appliances={appliances}
          stats={stats}
          homeStructure={player.homeStructure}
          materials={player.homeMaterials}
          isInsideShelter={isInsideShelter}
          onUpdateAppliances={setAppliances}
          onUpdateStats={setStats}
          onOpenRebuildModal={() => {
            setShowAppliancesModal(false);
            setShowHomeBuilderModal(true);
          }}
          onClose={() => setShowAppliancesModal(false)}
        />
      )}

      {/* ========================================================
          SUPERHERO SELECTOR MODAL (Spider-Man, Thor, Iron Man, etc.)
          ======================================================== */}
      {showHeroSelectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🦸‍♂️</span>
                <div>
                  <h2 className="text-lg font-black font-display text-neutral-100">
                    SELECT YOUR SUPERHERO DEFENDER
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Control your hero on the island map with unique graphics and special storm abilities!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHeroSelectorModal(false)}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
              {HEROES.filter(h =>
                ['hero_spiderman', 'hero_thor', 'hero_ironman', 'hero_captain', 'hero_panther'].includes(
                  h.id
                )
              ).map(hero => {
                const isSelected = hero.id === selectedHeroId;
                return (
                  <button
                    key={hero.id}
                    onClick={() => {
                      setSelectedHeroId(hero.id);
                      onUpdatePlayer(prev => ({ ...prev, selectedCharacterId: hero.id }));
                      soundManager.playSuccess();
                      setShowHeroSelectorModal(false);
                      setRecentLog(`🦸 Active hero switched to ${hero.name}!`);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-neutral-950 hover:bg-neutral-800/80 border-neutral-800'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-3xl shrink-0">
                      {hero.portrait}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-neutral-100">{hero.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-black text-[10px]">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-amber-400 font-mono-code mt-0.5">
                        {hero.heroTitle}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {hero.bio}
                      </p>
                      <div className="mt-2 text-[10px] text-emerald-400 font-mono-code">
                        ⚡ {hero.abilityName}: {hero.abilityDescription}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {phase === 'victory' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-emerald-500/50 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
              🚁
            </div>
            <div>
              <h2 className="text-2xl font-black font-display text-emerald-400">
                CYCLONE SURVIVED & EVACUATED!
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {activeHero.name} successfully solved supply challenges, weathered the cyclonic storm, and reached safety!
              </p>
            </div>

            <div className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-neutral-900">
                <span className="text-neutral-400">Storms Weathered:</span>
                <p className="text-lg font-bold text-emerald-400">{stormNumber}</p>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900">
                <span className="text-neutral-400">Time Survived:</span>
                <p className="text-lg font-bold text-amber-400">{totalSecondsSurvived}s</p>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900">
                <span className="text-neutral-400">Level Reached:</span>
                <p className="text-lg font-bold text-cyan-400">{currentLevel} / 50</p>
              </div>
              <div className="p-2 rounded-xl bg-neutral-900">
                <span className="text-neutral-400">Home Rebuilt:</span>
                <p className="text-lg font-bold text-yellow-400">Stage {player.homeStructure.level}/5</p>
              </div>
            </div>

            <div className="flex gap-2.5 w-full pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
              <button
                onClick={onOpenAcademyMode}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEFEAT MODAL */}
      {phase === 'defeat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-neutral-900 border border-rose-500/50 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl">
              🌪️
            </div>
            <div>
              <h2 className="text-2xl font-black font-display text-rose-400">
                STORM OVERWHELMED
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Your health depleted in the storm. Remember to stay inside your home shelter during the storm, solve quizzes to unlock food and water, and use {activeHero.name}&apos;s ability [Q]!
              </p>
            </div>

            <div className="w-full p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-left text-neutral-300 space-y-1">
              <p className="text-amber-400 font-bold">💡 Survival Tips:</p>
              <p>• When the storm countdown reaches 0, retreat inside your home shelter!</p>
              <p>• Answer supply cache quizzes to earn wood and repair shelter integrity.</p>
              <p>• Press [Q] to activate {activeHero.name}&apos;s special storm ability!</p>
            </div>

            <div className="flex gap-2.5 w-full pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={onBackToMenu}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          LEVEL PROMOTION & RANK CEREMONY MODAL
          User Request: "if i build 5 home and rescue from storm 2 times .promote to next level add that few badges and rank ."
          ======================================================== */}
      {showPromotionModal && (
        <LevelPromotionModal
          previousLevel={currentLevel}
          newLevel={Math.min(50, currentLevel + 1)}
          homesBuilt={homesBuiltCount}
          stormRescues={rescuedFromStormCount}
          oldRank={promotedOldRank}
          newRank={promotedNewRank}
          badgesAwarded={promotionBadgesEarned}
          rewards={{
            xp: 600,
            coins: 350,
            diamonds: 5,
          }}
          heroName={activeHero.name}
          heroPortrait={activeHero.portrait}
          onContinueNextLevel={() => {
            setShowPromotionModal(false);
            const nextLvl = Math.min(50, currentLevel + 1);
            onUpdateLevel(nextLvl);
            setLevelSolvedCount(0);
            setNodes(INITIAL_WORLD_NODES.map(n => ({ ...n, available: true })));
            soundManager.playSuccess();
            setRecentLog(`🚀 LAUNCHED LEVEL ${nextLvl} ISLAND EXPEDITION! New curriculum ready!`);
          }}
          onViewAllBadges={onOpenAcademyMode}
          onClose={() => setShowPromotionModal(false)}
        />
      )}
    </div>
  );
};
