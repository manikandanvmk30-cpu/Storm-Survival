import React, { useState, useEffect, useCallback } from 'react';
import {
  Resources,
  PlayerProfile,
  StormLevel,
  MissionStats,
  GameSaveData,
  InventoryItem,
  LevelQuestion,
  QuestionHistoryEntry,
  Difficulty,
  HomeMaterials,
} from './types/game';
import { soundManager } from './services/audio';
import { HEROES, getHeroById } from './data/characters';
import { getQuestionsForLevel } from './data/all50LevelsData';
import { trackDailyMissionProgress } from './data/dailyMissions';
import { INITIAL_BADGES } from './data/badges';
import { calculateRank } from './data/ranks';
import { INITIAL_CREW, TeamTask } from './data/team';

// Screens
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { DashboardScreen } from './components/DashboardScreen';

// In-Game 2D Simulation
import { MarsBaseCanvas, SIMPLE_STATIONS } from './components/MarsBaseCanvas';
import { HUD } from './components/HUD';

// Modals
import { ChallengeModal } from './components/ChallengeModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { HomeBuilderModal } from './components/HomeBuilderModal';
import { TeamworkModal } from './components/TeamworkModal';
import { ShopModal } from './components/ShopModal';
import { BadgesModal } from './components/BadgesModal';
import { CertificateModal } from './components/CertificateModal';
import { ResultsModal } from './components/ResultsModal';
import { QuestionHistoryModal } from './components/QuestionHistoryModal';
import { RewardsModal } from './components/RewardsModal';
import { PythonCodeModal } from './components/PythonCodeModal';
import { SaveManagerModal } from './components/SaveManagerModal';
import { HelpModal } from './components/HelpModal';
import { IslandSurvivalGame } from './components/IslandSurvivalGame';

import { ArrowLeft, Sparkles, Home as HomeIcon } from 'lucide-react';

const STORAGE_KEY = 'storm_survival_earth_v3';

type AppScreen = 'LOGIN' | 'HOME' | 'PROFILE' | 'DASHBOARD' | 'GAME' | 'ISLAND_SURVIVAL';

export default function App() {
  // User Request: "add a login page that contain only username and go to the simulation"
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('LOGIN');

  // --- Student Profile State with Home Materials ---
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    return {
      name: 'Manikandan',
      grade: 'Grade 7',
      difficulty: 'Easy',
      speciality: 'Mathematics',
      gender: 'Prefer not to say',
      avatar: '👨‍🚀',
      selectedCharacterId: 'hero_spiderman',
      xp: 150,
      coins: 200,
      diamonds: 3,
      rank: 'Bronze',
      badges: [],
      inventory: [
        {
          id: 'item_health_kit',
          name: 'Health Kit',
          description: 'Restores +25% Health (capped at 100%).',
          cost: 100,
          quantity: 1,
          healAmount: 25,
          iconName: 'HeartPulse',
        },
      ],
      homeMaterials: {
        wood: 12,
        rope: 6,
        lights: 3,
        electronics: 2,
        bricks: 8,
      },
      homeStructure: {
        level: 0, // 0 = Destroyed by cyclone, 1-5 = Rebuilt stages
        durability: 0,
      },
      consecutiveCorrect: 0,
      maxConsecutiveStreak: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      answeredQuestionIds: [],
      completedLevels: [],
    };
  });

  // 50 Levels Tracker
  const [currentLevel, setCurrentLevel] = useState<number>(1);

  // Gameplay Resources
  const [resources, setResources] = useState<Resources>({
    health: 100,
    power: 90,
    oxygen: 95,
    water: 85,
    timeSeconds: 600,
  });

  const [stormLevel, setStormLevel] = useState<StormLevel>(1);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [crew, setCrew] = useState(INITIAL_CREW);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [questionHistory, setQuestionHistory] = useState<QuestionHistoryEntry[]>([]);

  const [stats, setStats] = useState<MissionStats>({
    questionsAttempted: 0,
    questionsSolved: 0,
    objectivesCompleted: 0,
    decisionsMade: 0,
    decisionsSuccessful: 0,
    healthKitsUsed: 0,
    diamondsSpent: 0,
    elapsedSeconds: 0,
    materialsGathered: 0,
  });

  // Current Level Questions (7 questions: 3 Easy, 2 Medium, 2 Hard)
  const [levelQuestions, setLevelQuestions] = useState<LevelQuestion[]>(() => getQuestionsForLevel(1));
  const [activeQuestion, setActiveQuestion] = useState<LevelQuestion | null>(null);

  // Tracking per-level progress across the 3 Simple Stations (Easy, Medium, Hard)
  const [levelSolvedIds, setLevelSolvedIds] = useState<string[]>([]);

  // Hero Ability Cooldown & Active state
  const [heroAbilityCooldown, setHeroAbilityCooldown] = useState<number>(0);
  const [heroAbilityActiveTimer, setHeroAbilityActiveTimer] = useState<number>(0);

  // Game Status
  const [isMissionCompleted, setIsMissionCompleted] = useState<boolean>(false);
  const [isMissionFailed, setIsMissionFailed] = useState<boolean>(false);
  const [failureReason, setFailureReason] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedStationId, setSelectedStationId] = useState<'easy' | 'medium' | 'hard' | null>('easy');

  // Modals
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState<boolean>(false);
  const [showHomeBuilderModal, setShowHomeBuilderModal] = useState<boolean>(false);
  const [showTeamModal, setShowTeamModal] = useState<boolean>(false);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<boolean>(false);
  const [showQuestionHistoryModal, setShowQuestionHistoryModal] = useState<boolean>(false);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);
  const [showPythonCodeModal, setShowPythonCodeModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Last level completed rewards package for modal
  const [lastLevelMaterials, setLastLevelMaterials] = useState({
    wood: 6,
    rope: 4,
    lights: 2,
    electronics: 1,
    bricks: 4,
  });

  // Load Saved Game on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved) as GameSaveData;
        if (data && data.player && data.resources) {
          setPlayer(data.player);
          setResources(data.resources);
          setCurrentLevel(data.currentLevel || 1);
          setLevelQuestions(getQuestionsForLevel(data.currentLevel || 1));
          setStormLevel(data.stormLevel || 1);
          setQuestionHistory(data.questionHistory || []);
          setStats(data.stats || stats);
          setIsMissionCompleted(data.isMissionCompleted || false);
          setIsMissionFailed(data.isMissionFailed || false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Update Rank when XP changes
  useEffect(() => {
    const newRank = calculateRank(player.xp);
    if (newRank !== player.rank) {
      setPlayer(prev => ({ ...prev, rank: newRank }));
    }
  }, [player.xp, player.rank]);

  // Audio start ambient wind when in game
  useEffect(() => {
    if (currentScreen === 'GAME') {
      soundManager.startWind(stormLevel);
    } else {
      soundManager.stopWind();
    }
    return () => soundManager.stopWind();
  }, [currentScreen, stormLevel]);

  // Check Badges
  const checkBadges = useCallback(
    (currentStats: MissionStats, allDone: boolean) => {
      setBadges(prevBadges =>
        prevBadges.map(b => {
          let progress = b.progress;
          let unlocked = b.unlocked;

          if (b.id === 'badge_maths_master') {
            progress = currentStats.questionsSolved;
            if (progress >= b.maxProgress) unlocked = true;
          } else if (b.id === 'badge_critical_thinker') {
            progress = currentStats.decisionsSuccessful;
            if (progress >= b.maxProgress) unlocked = true;
          } else if (b.id === 'badge_team_player') {
            progress = completedTaskIds.length;
            if (progress >= 3) unlocked = true;
          } else if (b.id === 'badge_storm_survivor') {
            if (allDone) {
              progress = 1;
              unlocked = true;
            }
          } else if (b.id === 'badge_fast_solver') {
            if (allDone && resources.timeSeconds > 180) {
              progress = 1;
              unlocked = true;
            }
          } else if (b.id === 'badge_emergency_commander') {
            if (currentLevel >= 5 && currentStats.questionsSolved >= 15) {
              progress = 1;
              unlocked = true;
            }
          }

          return { ...b, progress, unlocked };
        })
      );
    },
    [completedTaskIds.length, currentLevel, resources.timeSeconds]
  );

  // --- Real-Time Game Loop Timer ---
  useEffect(() => {
    if (currentScreen !== 'GAME' || isMissionCompleted || isMissionFailed) return;

    const timer = setInterval(() => {
      setHeroAbilityCooldown(prev => Math.max(0, prev - 1));
      setHeroAbilityActiveTimer(prev => Math.max(0, prev - 1));

      setResources(prev => {
        const nextTime = Math.max(0, prev.timeSeconds - 1);

        let nextStormLevel: StormLevel = 1;
        if (nextTime < 120) nextStormLevel = 5;
        else if (nextTime < 240) nextStormLevel = 4;
        else if (nextTime < 360) nextStormLevel = 3;
        else if (nextTime < 480) nextStormLevel = 2;
        else nextStormLevel = 1;

        if (nextStormLevel !== stormLevel) {
          setStormLevel(nextStormLevel);
          soundManager.updateWindIntensity(nextStormLevel);
          if (nextStormLevel >= 3) {
            soundManager.playAlarm();
          }
        }

        const pwrDrain = 0.04 + nextStormLevel * 0.02;
        const o2Drain = 0.03 + nextStormLevel * 0.015;

        const nextPower = Math.max(0, prev.power - pwrDrain);
        const nextO2 = Math.max(0, prev.oxygen - o2Drain);
        let nextHealth = prev.health;

        if (nextO2 < 20) {
          nextHealth = Math.max(0, nextHealth - 0.25);
        }
        if (nextStormLevel === 5 && heroAbilityActiveTimer <= 0) {
          nextHealth = Math.max(0, nextHealth - 0.1);
        }

        // Defeat condition checks
        if (nextHealth <= 0) {
          setIsMissionFailed(true);
          setFailureReason('Commander health depleted under extreme cyclonic coastal weather.');
          setShowResultsModal(true);
          soundManager.playFailure();
        } else if (nextTime <= 0) {
          setIsMissionFailed(true);
          setFailureReason('Storm timer expired before coastal base objectives were secured.');
          setShowResultsModal(true);
          soundManager.playFailure();
        }

        return {
          ...prev,
          timeSeconds: nextTime,
          power: nextPower,
          oxygen: nextO2,
          health: nextHealth,
        };
      });

      setStats(prev => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, isMissionCompleted, isMissionFailed, stormLevel, currentLevel, checkBadges, stats, heroAbilityActiveTimer]);

  // --- Station Selection: Easy, Medium, or Hard ---
  const handleSelectStation = (stationId: 'easy' | 'medium' | 'hard') => {
    setSelectedStationId(stationId);

    // Pick an unanswered question matching this difficulty from the current level
    const targetDiff: Difficulty =
      stationId === 'easy' ? 'Easy' : stationId === 'medium' ? 'Medium' : 'Hard';

    const pool = levelQuestions.filter(
      q => q.difficulty === targetDiff && !levelSolvedIds.includes(q.id) && !player.answeredQuestionIds.includes(q.id)
    );

    if (pool.length > 0) {
      setActiveQuestion(pool[0]);
      setShowChallengeModal(true);
    } else {
      // If all questions in this difficulty are already solved for this level
      const anyInStation = levelQuestions.filter(q => q.difficulty === targetDiff && !levelSolvedIds.includes(q.id));
      if (anyInStation.length > 0) {
        setActiveQuestion(anyInStation[0]);
        setShowChallengeModal(true);
      } else {
        alert(`All ${targetDiff} questions for Level ${currentLevel} are already cleared! Visit the other stations.`);
      }
    }
  };

  // --- Solve Challenge & Record without repeating ---
  const handleSolveChallenge = (isCorrect: boolean, selectedOption: string) => {
    if (!activeQuestion) return;

    // Strict No-Repeat tracking
    const historyEntry: QuestionHistoryEntry = {
      questionId: activeQuestion.id,
      levelNumber: activeQuestion.levelNumber,
      questionText: activeQuestion.question,
      difficulty: activeQuestion.difficulty,
      selectedAnswer: selectedOption,
      correctAnswer: activeQuestion.options[activeQuestion.correctIndex],
      isCorrect,
      timestamp: new Date().toLocaleTimeString(),
    };

    setQuestionHistory(prev => [historyEntry, ...prev]);

    // Track answered question ID so it NEVER repeats
    setPlayer(prev => {
      const nextAnswered = prev.answeredQuestionIds.includes(activeQuestion.id)
        ? prev.answeredQuestionIds
        : [...prev.answeredQuestionIds, activeQuestion.id];

      let streak = prev.consecutiveCorrect;
      let coins = prev.coins;
      let diamonds = prev.diamonds;
      let xp = prev.xp;
      let totalCorrect = prev.totalCorrectAnswers;

      // Award materials on correct answers (wood, rope, etc.)
      const materials = { ...prev.homeMaterials };

      if (isCorrect) {
        streak += 1;
        coins += 10 * activeQuestion.points;
        xp += 30 * activeQuestion.points;
        totalCorrect += 1;

        // Material drop
        materials.wood += 2;
        materials.bricks += 1;
        if (activeQuestion.difficulty === 'Medium') {
          materials.rope += 2;
          materials.lights += 1;
        } else if (activeQuestion.difficulty === 'Hard') {
          materials.electronics += 2;
          materials.rope += 2;
        }

        if (streak === 3) {
          setResources(r => ({ ...r, health: Math.min(100, r.health + 15) }));
        }

        if (streak === 5) {
          diamonds += 1;
          streak = 0;
        }
      } else {
        streak = 0;
      }

      return {
        ...prev,
        coins,
        diamonds,
        xp,
        homeMaterials: materials,
        consecutiveCorrect: streak,
        maxConsecutiveStreak: Math.max(prev.maxConsecutiveStreak, streak),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrectAnswers: totalCorrect,
        answeredQuestionIds: nextAnswered,
      };
    });

    const newStats = {
      ...stats,
      questionsAttempted: stats.questionsAttempted + 1,
      questionsSolved: stats.questionsSolved + (isCorrect ? 1 : 0),
    };
    setStats(newStats);

    if (isCorrect) {
      const nextSolved = [...levelSolvedIds, activeQuestion.id];
      setLevelSolvedIds(nextSolved);

      trackDailyMissionProgress('questions_answered', 1);
      if (activeQuestion.subject === 'mathematics') {
        trackDailyMissionProgress('math_solved', 1);
      } else if (activeQuestion.subject === 'science') {
        trackDailyMissionProgress('science_solved', 1);
      }

      // Check if all 7 questions of this level are solved
      if (nextSolved.length >= 7) {
        handleTriggerLevelComplete();
      }
    } else {
      setResources(prev => ({ ...prev, health: Math.max(0, prev.health - 10) }));
    }

    checkBadges(newStats, false);
    setShowChallengeModal(false);
  };

  // --- Trigger "YOU ARE FINISHED LEVEL X" ---
  const handleTriggerLevelComplete = () => {
    soundManager.playSuccess();
    const earned = {
      wood: 8 + currentLevel,
      rope: 5 + Math.floor(currentLevel / 2),
      lights: 3 + Math.floor(currentLevel / 3),
      electronics: 2 + Math.floor(currentLevel / 4),
      bricks: 6 + currentLevel,
    };

    setLastLevelMaterials(earned);

    setPlayer(prev => ({
      ...prev,
      completedLevels: prev.completedLevels.includes(currentLevel)
        ? prev.completedLevels
        : [...prev.completedLevels, currentLevel],
      homeMaterials: {
        wood: prev.homeMaterials.wood + earned.wood,
        rope: prev.homeMaterials.rope + earned.rope,
        lights: prev.homeMaterials.lights + earned.lights,
        electronics: prev.homeMaterials.electronics + earned.electronics,
        bricks: prev.homeMaterials.bricks + earned.bricks,
      },
    }));

    setShowLevelCompleteModal(true);
  };

  // Proceed to Level X + 1
  const handleProceedToNextLevel = () => {
    const nextLvl = Math.min(50, currentLevel + 1);
    setCurrentLevel(nextLvl);
    setLevelQuestions(getQuestionsForLevel(nextLvl));
    setLevelSolvedIds([]);
    trackDailyMissionProgress('level_completed', 1);
    setResources(prev => ({
      ...prev,
      timeSeconds: 600,
      health: Math.min(100, prev.health + 20),
      power: Math.min(100, prev.power + 25),
    }));
    setShowLevelCompleteModal(false);
    handleSaveToLocal();
  };

  // --- Hero Special Ability Activation ---
  const handleActivateHeroAbility = () => {
    if (heroAbilityCooldown > 0) return;
    const hero = getHeroById(player.selectedCharacterId);

    soundManager.playDiamondChime();
    setHeroAbilityCooldown(hero.cooldownSeconds);
    setHeroAbilityActiveTimer(20);

    if (hero.id === 'hero_thunder') {
      setResources(prev => ({ ...prev, power: Math.min(100, prev.power + 20) }));
    } else if (hero.id === 'hero_iron') {
      setResources(prev => ({ ...prev, health: Math.min(100, prev.health + 15) }));
    } else if (hero.id === 'hero_mage') {
      setResources(prev => ({ ...prev, oxygen: Math.min(100, prev.oxygen + 15), timeSeconds: prev.timeSeconds + 30 }));
    }
  };

  // --- Home Reconstruction Upgrade ---
  const handleUpgradeHome = (newLevel: number, requiredMaterials: Partial<HomeMaterials>) => {
    setPlayer(prev => ({
      ...prev,
      homeStructure: {
        level: newLevel,
        durability: newLevel * 20,
      },
      homeMaterials: {
        wood: prev.homeMaterials.wood - (requiredMaterials.wood || 0),
        rope: prev.homeMaterials.rope - (requiredMaterials.rope || 0),
        lights: prev.homeMaterials.lights - (requiredMaterials.lights || 0),
        electronics: prev.homeMaterials.electronics - (requiredMaterials.electronics || 0),
        bricks: prev.homeMaterials.bricks - (requiredMaterials.bricks || 0),
      },
      xp: prev.xp + 100 * newLevel,
      coins: prev.coins + 50 * newLevel,
    }));
    trackDailyMissionProgress('shelter_rebuilt', 1);
    soundManager.playSuccess();
    handleSaveToLocal();
  };

  // --- Shop Purchases ---
  const handleBuyItem = (item: InventoryItem) => {
    if (player.coins < item.cost) {
      return { success: false, message: 'Not enough coins!' };
    }

    setPlayer(prev => {
      const existing = prev.inventory.find(i => i.id === item.id);
      let updatedInv: InventoryItem[];
      if (existing) {
        updatedInv = prev.inventory.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedInv = [...prev.inventory, { ...item, quantity: 1 }];
      }

      return {
        ...prev,
        coins: prev.coins - item.cost,
        diamonds: prev.diamonds + (item.diamondAmount || 0),
        inventory: updatedInv,
      };
    });

    return { success: true, message: `Requisitioned ${item.name}!` };
  };

  const handleUseItem = (itemId: string) => {
    const item = player.inventory.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) {
      return { success: false, message: 'Item not in inventory.' };
    }

    if (itemId === 'item_health_kit') {
      if (resources.health >= 100) {
        return { success: false, message: 'Health already at maximum (100%)!' };
      }
      setResources(prev => ({ ...prev, health: Math.min(100, prev.health + 25) }));
      setStats(prev => ({ ...prev, healthKitsUsed: prev.healthKitsUsed + 1 }));
    } else if (itemId === 'item_power_cell') {
      setResources(prev => ({ ...prev, power: Math.min(100, prev.power + 20) }));
    } else if (itemId === 'item_o2_canister') {
      setResources(prev => ({ ...prev, oxygen: Math.min(100, prev.oxygen + 20) }));
    }

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.map(i =>
        i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
      ),
    }));

    return { success: true, message: `Used ${item.name}!` };
  };

  const handleSpendDiamondHint = (): boolean => {
    if (player.diamonds <= 0) return false;
    setPlayer(prev => ({ ...prev, diamonds: prev.diamonds - 1 }));
    setStats(prev => ({ ...prev, diamondsSpent: prev.diamondsSpent + 1 }));
    return true;
  };

  // --- Save / Load Helpers ---
  const getSavePayload = (): GameSaveData => ({
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    player,
    resources,
    currentLevel,
    stormLevel,
    questionHistory,
    stats,
    isMissionCompleted,
    isMissionFailed,
  });

  const handleSaveToLocal = () => {
    const payload = getSavePayload();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const handleSaveAndExit = () => {
    handleSaveToLocal();
    soundManager.playSuccess();
    setCurrentScreen('HOME');
  };

  const activeHero = getHeroById(player.selectedCharacterId);

  // Station counts for Level Progress
  const levelProgress = {
    easyDone: levelSolvedIds.filter(id => levelQuestions.find(q => q.id === id && q.difficulty === 'Easy')).length,
    mediumDone: levelSolvedIds.filter(id => levelQuestions.find(q => q.id === id && q.difficulty === 'Medium')).length,
    hardDone: levelSolvedIds.filter(id => levelQuestions.find(q => q.id === id && q.difficulty === 'Hard')).length,
  };

  // ========================================================
  // SCREEN 0: LOGIN SCREEN (User Request: "Login -> Home")
  // ========================================================
  if (currentScreen === 'LOGIN') {
    return (
      <LoginScreen
        initialUsername={player.name}
        onLogin={(username, heroId) => {
          setPlayer(prev => ({
            ...prev,
            name: username,
            selectedCharacterId: heroId || prev.selectedCharacterId,
          }));
          try {
            localStorage.setItem('storm_survival_username', username);
          } catch {
            // ignore
          }
          // User Request: Login -> Home
          soundManager.playSuccess();
          setCurrentScreen('HOME');
        }}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundManager.toggleMute())}
      />
    );
  }

  // ========================================================
  // SCREEN 1: HOME SCREEN
  // User Request: "Login -> Home (home page contain Normal home with needed features,My dashboard and My profile, My certification s and Logout)"
  // ========================================================
  if (currentScreen === 'HOME') {
    return (
      <>
        <HomeScreen
          player={player}
          currentLevel={currentLevel}
          onPlayGame={() => setCurrentScreen('ISLAND_SURVIVAL')}
          onPlaySurvivalMode={() => setCurrentScreen('ISLAND_SURVIVAL')}
          onOpenDashboard={() => setCurrentScreen('DASHBOARD')}
          onOpenProfile={() => setCurrentScreen('PROFILE')}
          onOpenCertifications={() => setShowCertificateModal(true)}
          onOpenHomeBuilder={() => setShowHomeBuilderModal(true)}
          onLogout={() => {
            soundManager.playBeep(320, 0.05);
            setCurrentScreen('LOGIN');
          }}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundManager.toggleMute())}
        />

        {/* Certificate Modal on Home */}
        {showCertificateModal && (
          <CertificateModal
            studentName={player.name}
            rank={player.rank}
            grade={player.grade}
            finalHealth={resources.health}
            finalPower={resources.power}
            finalOxygen={resources.oxygen}
            questionsSolved={player.totalCorrectAnswers}
            decisionsSuccessful={stats.decisionsSuccessful}
            onClose={() => setShowCertificateModal(false)}
          />
        )}

        {/* Home Builder Modal on Home */}
        {showHomeBuilderModal && (
          <HomeBuilderModal
            materials={player.homeMaterials}
            structure={player.homeStructure}
            onUpgradeHome={handleUpgradeHome}
            onClose={() => setShowHomeBuilderModal(false)}
          />
        )}
      </>
    );
  }

  // ========================================================
  // SCREEN 2: PROFILE SCREEN
  // ========================================================
  if (currentScreen === 'PROFILE') {
    return (
      <ProfileScreen
        profile={player}
        onSaveProfile={updated => {
          setPlayer(prev => ({ ...prev, ...updated }));
          handleSaveToLocal();
        }}
        onBackToHome={() => setCurrentScreen('HOME')}
        onProceedToDashboard={() => setCurrentScreen('DASHBOARD')}
      />
    );
  }

  // ========================================================
  // SCREEN 3: DASHBOARD SCREEN
  // ========================================================
  if (currentScreen === 'DASHBOARD') {
    return (
      <>
        <DashboardScreen
          player={player}
          resources={resources}
          badges={badges}
          currentLevel={currentLevel}
          hasActiveMission={resources.timeSeconds > 0 && !isMissionCompleted && !isMissionFailed}
          onStartGame={() => setCurrentScreen('ISLAND_SURVIVAL')}
          onContinueGame={() => setCurrentScreen('ISLAND_SURVIVAL')}
          onOpenHomeBuilder={() => setShowHomeBuilderModal(true)}
          onOpenIslandSurvival={() => setCurrentScreen('ISLAND_SURVIVAL')}
          onOpenProfile={() => setCurrentScreen('PROFILE')}
          onOpenCertifications={() => setShowCertificateModal(true)}
          onOpenRank={() => setShowBadgesModal(true)}
          onOpenRewards={() => setShowRewardsModal(true)}
          onOpenBadges={() => setShowBadgesModal(true)}
          onOpenQuestionHistory={() => setShowQuestionHistoryModal(true)}
          onOpenSettings={() => setShowSaveModal(true)}
          onSaveAndExit={handleSaveAndExit}
          onBackToHome={() => setCurrentScreen('HOME')}
          onClaimDailyReward={(bonusCoins, bonusXp, bonusDiamonds) => {
            setPlayer(prev => {
              const updated = {
                ...prev,
                coins: prev.coins + bonusCoins,
                xp: prev.xp + bonusXp,
                diamonds: prev.diamonds + (bonusDiamonds || 0),
              };
              return updated;
            });
            handleSaveToLocal();
          }}
        />

        {/* Home Builder Modal */}
        {showHomeBuilderModal && (
          <HomeBuilderModal
            materials={player.homeMaterials}
            structure={player.homeStructure}
            onUpgradeHome={handleUpgradeHome}
            onClose={() => setShowHomeBuilderModal(false)}
          />
        )}

        {/* Certificate Modal */}
        {showCertificateModal && (
          <CertificateModal
            studentName={player.name}
            rank={player.rank}
            grade={player.grade}
            finalHealth={resources.health}
            finalPower={resources.power}
            finalOxygen={resources.oxygen}
            questionsSolved={player.totalCorrectAnswers}
            decisionsSuccessful={stats.decisionsSuccessful}
            onClose={() => setShowCertificateModal(false)}
          />
        )}

        {/* Badges Modal */}
        {showBadgesModal && (
          <BadgesModal
            badges={badges}
            xp={player.xp}
            currentRank={player.rank}
            onClose={() => setShowBadgesModal(false)}
          />
        )}

        {/* Rewards Modal */}
        {showRewardsModal && (
          <RewardsModal
            player={player}
            onClose={() => setShowRewardsModal(false)}
          />
        )}

        {/* Question History Modal */}
        {showQuestionHistoryModal && (
          <QuestionHistoryModal
            history={questionHistory}
            isBankExhausted={player.answeredQuestionIds.length >= 750}
            onClose={() => setShowQuestionHistoryModal(false)}
          />
        )}

        {/* Save / Settings Modal */}
        {showSaveModal && (
          <SaveManagerModal
            currentSaveData={getSavePayload()}
            onSaveToLocal={handleSaveToLocal}
            onLoadFromData={d => {
              setPlayer(d.player);
              setResources(d.resources);
              setCurrentLevel(d.currentLevel || 1);
              setLevelQuestions(getQuestionsForLevel(d.currentLevel || 1));
            }}
            onNewGame={() => {
              setCurrentLevel(1);
              setLevelQuestions(getQuestionsForLevel(1));
              setLevelSolvedIds([]);
              setCurrentScreen('GAME');
              setShowSaveModal(false);
            }}
            onClose={() => setShowSaveModal(false)}
          />
        )}
      </>
    );
  }

  // ========================================================
  // SCREEN 3.5: ISLAND STORM SURVIVAL SIMULATION (FEATURED)
  // ========================================================
  if (currentScreen === 'ISLAND_SURVIVAL') {
    return (
      <IslandSurvivalGame
        player={player}
        currentLevel={currentLevel}
        onUpdatePlayer={setPlayer}
        onUpdateLevel={setCurrentLevel}
        onRecordHistory={entry => setQuestionHistory(prev => [entry, ...prev])}
        onBackToMenu={() => setCurrentScreen('HOME')}
        onOpenAcademyMode={() => setCurrentScreen('DASHBOARD')}
        onSwitchUser={() => setCurrentScreen('LOGIN')}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundManager.toggleMute())}
      />
    );
  }

  // ========================================================
  // SCREEN 4: STORM SURVIVAL GAME SCREEN
  // ========================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start p-3 sm:p-5 select-none">
      <div className="w-full max-w-6xl flex flex-col gap-4">
        {/* Navigation & Hero Ability Toolbar */}
        <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                handleSaveToLocal();
                soundManager.playBeep(480, 0.04);
                setCurrentScreen('DASHBOARD');
              }}
              className="flex items-center gap-1.5 text-xs font-mono-code text-neutral-300 hover:text-amber-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <span className="text-neutral-600">|</span>

            {/* Rebuild Home Workshop Button */}
            <button
              onClick={() => {
                soundManager.playBeep(640, 0.04);
                setShowHomeBuilderModal(true);
              }}
              className="flex items-center gap-1.5 text-xs font-mono-code text-amber-300 hover:text-amber-200 transition cursor-pointer"
            >
              <HomeIcon className="w-4 h-4 text-amber-400" />
              <span>
                Rebuild Home (L{player.homeStructure.level})
              </span>
            </button>

            <span className="text-neutral-600">|</span>

            {/* Jump to Island Survival Mode */}
            <button
              onClick={() => {
                handleSaveToLocal();
                soundManager.playSuccess();
                setCurrentScreen('ISLAND_SURVIVAL');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-mono-code transition cursor-pointer"
            >
              <span>🏝️ Island Survival Mode</span>
            </button>
          </div>

          {/* Level Complete Force Trigger if 7 questions solved */}
          <div className="flex items-center gap-2">
            {levelSolvedIds.length >= 7 && (
              <button
                onClick={handleTriggerLevelComplete}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-bold transition cursor-pointer animate-pulse"
              >
                Finish Level {currentLevel} ({levelSolvedIds.length}/7 Q)
              </button>
            )}

            {/* Hero Ability Activation Button */}
            <button
              onClick={handleActivateHeroAbility}
              disabled={heroAbilityCooldown > 0}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                heroAbilityCooldown === 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md animate-pulse'
                  : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
              }`}
              title={`${activeHero.abilityName}: ${activeHero.abilityDescription}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {activeHero.abilityName} ({heroAbilityCooldown === 0 ? 'READY' : `${heroAbilityCooldown}s`})
              </span>
            </button>
          </div>
        </div>

        {/* HUD */}
        <HUD
          resources={resources}
          stormLevel={stormLevel}
          currentLevel={currentLevel}
          homeMaterials={player.homeMaterials}
          coins={player.coins}
          diamonds={player.diamonds}
          xp={player.xp}
          rank={player.rank}
          playerName={player.name}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(soundManager.toggleMute())}
          onOpenHomeBuilder={() => setShowHomeBuilderModal(true)}
          onOpenShop={() => setShowShopModal(true)}
          onOpenTeam={() => setShowTeamModal(true)}
          onOpenBadges={() => setShowBadgesModal(true)}
          onOpenPythonCode={() => setShowPythonCodeModal(true)}
          onOpenSave={() => setShowSaveModal(true)}
          onOpenHelp={() => setShowHelpModal(true)}
        />

        {/* Simplified 3 Stations Banner: Easy (10Q), Medium (3Q), Hard (2Q) */}
        <div className="grid grid-cols-3 gap-3">
          {SIMPLE_STATIONS.map(st => {
            const isSelected = selectedStationId === st.id;
            const done =
              st.id === 'easy'
                ? levelProgress.easyDone
                : st.id === 'medium'
                ? levelProgress.mediumDone
                : levelProgress.hardDone;

            return (
              <button
                key={st.id}
                onClick={() => handleSelectStation(st.id)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'bg-neutral-900 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-neutral-100">
                    {st.name} Station
                  </span>
                  <span className="text-xs font-mono-code text-amber-400 font-semibold">
                    {done} / {st.questionCount} Solved
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {st.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* 2D Simulation Canvas with Tamil Nadu coastal storm & Rebuilding Home */}
        <main className="w-full">
          <MarsBaseCanvas
            stormLevel={stormLevel}
            health={resources.health}
            power={resources.power}
            character={activeHero}
            homeStructure={player.homeStructure}
            activeAbilityTimer={heroAbilityActiveTimer}
            selectedStation={selectedStationId}
            onSelectStation={handleSelectStation}
            onOpenHomeBuilder={() => setShowHomeBuilderModal(true)}
            currentLevel={currentLevel}
            levelProgress={levelProgress}
          />
        </main>
      </div>

      {/* --- IN-GAME MODALS --- */}
      {/* Level Complete Modal ("YOU ARE FINISHED LEVEL X") */}
      {showLevelCompleteModal && (
        <LevelCompleteModal
          levelNumber={currentLevel}
          score={levelSolvedIds.length >= 7 ? 25 : Math.round((levelSolvedIds.length / 7) * 25)}
          maxScore={25}
          materialsEarned={lastLevelMaterials}
          onProceedToNextLevel={handleProceedToNextLevel}
          onOpenHomeBuilder={() => {
            setShowLevelCompleteModal(false);
            setShowHomeBuilderModal(true);
          }}
          onReturnToDashboard={() => {
            setShowLevelCompleteModal(false);
            setCurrentScreen('DASHBOARD');
          }}
        />
      )}

      {/* Home Builder Modal */}
      {showHomeBuilderModal && (
        <HomeBuilderModal
          materials={player.homeMaterials}
          structure={player.homeStructure}
          onUpgradeHome={handleUpgradeHome}
          onClose={() => setShowHomeBuilderModal(false)}
        />
      )}

      {/* Question Challenge Modal */}
      {showChallengeModal && activeQuestion && (
        <ChallengeModal
          question={activeQuestion}
          diamonds={player.diamonds}
          consecutiveStreak={player.consecutiveCorrect}
          onSolve={handleSolveChallenge}
          onSpendDiamondHint={handleSpendDiamondHint}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

      {/* Teamwork Modal */}
      {showTeamModal && (
        <TeamworkModal
          crew={crew}
          onAssignTask={(task, memberId) => {
            if (completedTaskIds.includes(task.id)) return;
            setCompletedTaskIds(prev => [...prev, task.id]);
            setResources(prev => ({
              ...prev,
              health: Math.min(100, prev.health + (task.resourceGain.health || 0)),
              power: Math.min(100, prev.power + (task.resourceGain.power || 0)),
            }));
            setPlayer(prev => ({
              ...prev,
              xp: prev.xp + task.rewardXp,
              coins: prev.coins + task.rewardCoins,
            }));
            soundManager.playSuccess();
          }}
          completedTaskIds={completedTaskIds}
          stormLevel={stormLevel}
          onClose={() => setShowTeamModal(false)}
        />
      )}

      {/* Shop Modal */}
      {showShopModal && (
        <ShopModal
          coins={player.coins}
          health={resources.health}
          inventory={player.inventory}
          onBuyItem={handleBuyItem}
          onUseItem={handleUseItem}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          badges={badges}
          xp={player.xp}
          currentRank={player.rank}
          onClose={() => setShowBadgesModal(false)}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          studentName={player.name}
          rank={player.rank}
          grade={player.grade}
          finalHealth={resources.health}
          finalPower={resources.power}
          finalOxygen={resources.oxygen}
          questionsSolved={player.totalCorrectAnswers}
          decisionsSuccessful={stats.decisionsSuccessful}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Final Results Screen Modal */}
      {showResultsModal && (
        <ResultsModal
          isVictory={isMissionCompleted}
          failureReason={failureReason}
          questionsSolved={stats.questionsSolved}
          totalQuestions={7}
          correctAnswers={player.totalCorrectAnswers}
          objectivesCompleted={stats.objectivesCompleted}
          totalObjectives={5}
          decisionsSuccessful={stats.decisionsSuccessful}
          totalDecisions={Math.max(stats.decisionsMade, 1)}
          finalHealth={resources.health}
          finalPower={resources.power}
          finalOxygen={resources.oxygen}
          finalWater={resources.water}
          timeRemainingSeconds={resources.timeSeconds}
          rewardXp={350 + stats.questionsSolved * 25}
          rewardCoins={180 + stats.questionsSolved * 10}
          rewardDiamonds={3}
          rank={player.rank}
          newBadgesUnlocked={[]}
          onViewBadges={() => {
            setShowResultsModal(false);
            setShowBadgesModal(true);
          }}
          onViewCertificate={() => {
            setShowResultsModal(false);
            setShowCertificateModal(true);
          }}
          onPlayAgain={() => {
            setShowResultsModal(false);
            setCurrentScreen('GAME');
          }}
          onReturnToDashboard={() => {
            setShowResultsModal(false);
            setCurrentScreen('DASHBOARD');
          }}
        />
      )}

      {showPythonCodeModal && (
        <PythonCodeModal onClose={() => setShowPythonCodeModal(false)} />
      )}

      {showSaveModal && (
        <SaveManagerModal
          currentSaveData={getSavePayload()}
          onSaveToLocal={handleSaveToLocal}
          onLoadFromData={d => {
            setPlayer(d.player);
            setResources(d.resources);
            setCurrentLevel(d.currentLevel || 1);
            setLevelQuestions(getQuestionsForLevel(d.currentLevel || 1));
          }}
          onNewGame={() => {
            setCurrentLevel(1);
            setLevelQuestions(getQuestionsForLevel(1));
            setLevelSolvedIds([]);
            setCurrentScreen('GAME');
            setShowSaveModal(false);
          }}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
    </div>
  );
}
