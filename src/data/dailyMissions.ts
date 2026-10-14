import { DailyMission, QuestionSubject } from '../types/game';

export interface DailyMissionTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'survival' | 'building' | 'gathering';
  target: number;
  rewardCoins: number;
  rewardXp: number;
  trackingKey: 'questions_answered' | 'math_solved' | 'science_solved' | 'storm_survived' | 'shelter_rebuilt' | 'supplies_gathered' | 'accuracy_streak' | 'level_completed';
}

export const DAILY_MISSION_TEMPLATES: DailyMissionTemplate[] = [
  {
    id: 'dm_cyclone_survivor',
    title: 'Cyclone Survivor',
    description: 'Survive a 30-second storm in the Island Survival Simulation.',
    icon: '🌪️',
    category: 'survival',
    target: 1,
    rewardCoins: 250,
    rewardXp: 300,
    trackingKey: 'storm_survived',
  },
  {
    id: 'dm_maths_sentinel',
    title: 'Maths Vanguard',
    description: 'Answer 2 Mathematics challenge questions correctly.',
    icon: '📐',
    category: 'quiz',
    target: 2,
    rewardCoins: 200,
    rewardXp: 250,
    trackingKey: 'math_solved',
  },
  {
    id: 'dm_science_innovator',
    title: 'Science & Circuit Spark',
    description: 'Solve 2 Science or Electrical Circuit questions.',
    icon: '⚡',
    category: 'quiz',
    target: 2,
    rewardCoins: 200,
    rewardXp: 250,
    trackingKey: 'science_solved',
  },
  {
    id: 'dm_coastal_architect',
    title: 'Shelter Architect',
    description: 'Construct or upgrade 1 stage of your coastal sanctuary.',
    icon: '🏠',
    category: 'building',
    target: 1,
    rewardCoins: 300,
    rewardXp: 400,
    trackingKey: 'shelter_rebuilt',
  },
  {
    id: 'dm_island_scavenger',
    title: 'Island Supply Scavenger',
    description: 'Gather 3 supply crates or coconuts on the island map.',
    icon: '🪵',
    category: 'gathering',
    target: 3,
    rewardCoins: 180,
    rewardXp: 220,
    trackingKey: 'supplies_gathered',
  },
  {
    id: 'dm_quiz_master',
    title: 'Knowledge Defender',
    description: 'Answer any 4 level curriculum questions correctly.',
    icon: '🎯',
    category: 'quiz',
    target: 4,
    rewardCoins: 250,
    rewardXp: 350,
    trackingKey: 'questions_answered',
  },
  {
    id: 'dm_rapid_thinker',
    title: 'Streak Cadet',
    description: 'Achieve a consecutive correct answer streak of 3.',
    icon: '🔥',
    category: 'quiz',
    target: 3,
    rewardCoins: 220,
    rewardXp: 300,
    trackingKey: 'accuracy_streak',
  },
  {
    id: 'dm_level_conqueror',
    title: 'Island Navigator',
    description: 'Complete 1 full level (answer 7 checkpoint questions).',
    icon: '🏆',
    category: 'survival',
    target: 1,
    rewardCoins: 350,
    rewardXp: 450,
    trackingKey: 'level_completed',
  },
];

const STORAGE_KEY_DAILY = 'storm_survival_daily_missions_v1';

export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return { hours, minutes, seconds, formatted };
}

/**
 * Deterministically pick 3 rotating daily missions based on today's date
 */
export function getRotatingMissionsForDate(dateKey: string): DailyMission[] {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) & 0xffffffff;
  }
  hash = Math.abs(hash);

  const pool = [...DAILY_MISSION_TEMPLATES];
  const selected: DailyMission[] = [];

  for (let i = 0; i < 3; i++) {
    const idx = (hash + i * 3) % pool.length;
    const template = pool[idx];
    pool.splice(idx, 1);

    selected.push({
      id: `${template.id}_${dateKey}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      category: template.category,
      target: template.target,
      progress: 0,
      rewardCoins: template.rewardCoins,
      rewardXp: template.rewardXp,
      completed: false,
      claimed: false,
    });
  }

  return selected;
}

export interface StoredDailyMissionsData {
  dateKey: string;
  missions: DailyMission[];
  superChestClaimed: boolean;
  streakCount: number;
}

export function loadDailyMissionsFromStorage(): StoredDailyMissionsData {
  const todayKey = getTodayDateKey();
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DAILY);
    if (saved) {
      const parsed: StoredDailyMissionsData = JSON.parse(saved);
      if (parsed && parsed.dateKey === todayKey && Array.isArray(parsed.missions) && parsed.missions.length >= 3) {
        return parsed;
      }
      // If date changed, increment streak if at least one mission was completed yesterday
      let newStreak = parsed?.streakCount || 1;
      const yesterdayCompleted = parsed?.missions?.some(m => m.completed) || false;
      if (yesterdayCompleted) {
        newStreak = (parsed?.streakCount || 1) + 1;
      } else {
        newStreak = 1;
      }

      const freshMissions = getRotatingMissionsForDate(todayKey);
      const freshData: StoredDailyMissionsData = {
        dateKey: todayKey,
        missions: freshMissions,
        superChestClaimed: false,
        streakCount: newStreak,
      };
      saveDailyMissionsToStorage(freshData);
      return freshData;
    }
  } catch {
    // ignore
  }

  const fresh = {
    dateKey: todayKey,
    missions: getRotatingMissionsForDate(todayKey),
    superChestClaimed: false,
    streakCount: 1,
  };
  saveDailyMissionsToStorage(fresh);
  return fresh;
}

export function saveDailyMissionsToStorage(data: StoredDailyMissionsData): void {
  try {
    localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function trackDailyMissionProgress(
  key: DailyMissionTemplate['trackingKey'],
  amount: number = 1
): void {
  try {
    const data = loadDailyMissionsFromStorage();
    let changed = false;

    const updatedMissions = data.missions.map(mission => {
      const template = DAILY_MISSION_TEMPLATES.find(t => mission.id.startsWith(t.id));
      if (template && template.trackingKey === key && !mission.completed) {
        const nextProgress = Math.min(mission.target, mission.progress + amount);
        const isDone = nextProgress >= mission.target;
        changed = true;
        return {
          ...mission,
          progress: nextProgress,
          completed: isDone,
        };
      }
      return mission;
    });

    if (changed) {
      const updatedData = { ...data, missions: updatedMissions };
      saveDailyMissionsToStorage(updatedData);
    }
  } catch {
    // ignore
  }
}
