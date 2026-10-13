export type GradeLevel = 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type StormLevel = 1 | 2 | 3 | 4 | 5;

export type SpecialitySubject = 'Mathematics' | 'Science' | 'Tamil' | 'English' | 'Social Science';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface HeroCharacter {
  id: string;
  name: string;
  heroTitle: string;
  themeColor: string;
  accentColor: string;
  portrait: string;
  bio: string;
  abilityName: string;
  abilityDescription: string;
  cooldownSeconds: number;
}

export interface HomeMaterials {
  wood: number;
  rope: number;
  lights: number;
  electronics: number;
  bricks: number;
}

export interface HomeStructure {
  level: number; // 0 = Destroyed by Storm, 1 = Foundation, 2 = Pillars & Frame, 3 = Walls & Roof, 4 = Electrics & Lights, 5 = Storm-Proof Sanctuary
  durability: number; // 0 - 100%
}

export interface PlayerProfile {
  name: string;
  grade: GradeLevel;
  difficulty: Difficulty;
  speciality: SpecialitySubject;
  gender: Gender;
  avatar: string;
  selectedCharacterId: string;
  xp: number;
  coins: number;
  diamonds: number;
  rank: RankTier;
  badges: string[];
  inventory: InventoryItem[];
  homeMaterials: HomeMaterials;
  homeStructure: HomeStructure;
  consecutiveCorrect: number;
  maxConsecutiveStreak: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  answeredQuestionIds: string[];
  completedLevels: number[]; // e.g. [1, 2, ...]
}

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Earth Legend';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  quantity: number;
  healAmount?: number;
  powerAmount?: number;
  oxygenAmount?: number;
  diamondAmount?: number;
  iconName: string;
}

export type QuestionSubject = 'tamil' | 'english' | 'mathematics' | 'science' | 'social_science';

export interface LevelQuestion {
  id: string;
  levelNumber: number; // 1 to 50
  difficulty: Difficulty; // Easy, Medium, Hard
  questionNumber: number; // 1 to 15
  subject: QuestionSubject;
  subjectLabel: string;
  question: string;
  options: string[];
  correctIndex: number; // 0, 1, 2, 3
  points: number; // 1 for Easy, 2 for Medium, 3 for Hard
  hint?: string;
  explanation?: string;
}

export interface QuestionHistoryEntry {
  questionId: string;
  levelNumber: number;
  questionText: string;
  difficulty: Difficulty;
  subject?: QuestionSubject;
  grade?: GradeLevel;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuestionItem {
  id: string;
  subject: QuestionSubject;
  subjectLabel: string;
  category: string;
  grade: GradeLevel;
  difficulty: Difficulty;
  scenario: string;
  question: string;
  tamilScript?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  rewardXp: number;
  rewardCoins: number;
}

export type Challenge = QuestionItem;

export interface DecisionChoice {
  id: string;
  title: string;
  description: string;
  resourceImpacts: {
    health?: number;
    power?: number;
    oxygen?: number;
    water?: number;
    time?: number;
  };
  consequenceText: string;
  hint: string;
  followUpObjective: string;
  successScore: number;
}

export interface DecisionScenario {
  id: string;
  stageNumber: number;
  stageName: string;
  stormLevel: StormLevel;
  title: string;
  situation: string;
  contextAlert: string;
  choices: DecisionChoice[];
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  currentTask: string | null;
  status: 'idle' | 'working' | 'ready' | 'critical';
  assignedStationId: string | null;
  assignedRoomId?: string | null;
  dialogue: string;
}

export interface StageObjective {
  id: string;
  stage: number;
  title: string;
  description: string;
  isCompleted: boolean;
  targetStationId?: string;
  targetRoomId?: string;
  requiredAction: 'decision' | 'challenge' | 'team_assign' | 'interact';
}

export interface SimpleStation {
  id: 'easy' | 'medium' | 'hard';
  name: string; // 'Easy', 'Medium', 'Hard'
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  difficulty: Difficulty;
  questionCount: number;
  pointsPerQuestion: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CertificateData {
  id: string;
  studentName: string;
  grade: GradeLevel;
  achievementTitle: string;
  rank: RankTier;
  date: string;
  performanceSummary: string;
  scoreAccuracy: number;
}

export interface Resources {
  health: number; // 0 - 100
  power: number;  // 0 - 100
  oxygen: number; // 0 - 100 (air filter quality)
  water: number;  // 0 - 100
  timeSeconds: number; // e.g. 600
}

export interface MissionStats {
  questionsAttempted: number;
  questionsSolved: number;
  objectivesCompleted: number;
  decisionsMade: number;
  decisionsSuccessful: number;
  healthKitsUsed: number;
  diamondsSpent: number;
  elapsedSeconds: number;
  materialsGathered: number;
}

export interface GameSaveData {
  version: string;
  timestamp: string;
  player: PlayerProfile;
  resources: Resources;
  currentLevel: number; // 1 to 50
  currentStage?: number;
  stormLevel: StormLevel;
  currentStormLevel?: StormLevel;
  questionHistory: QuestionHistoryEntry[];
  stats: MissionStats;
  isMissionCompleted: boolean;
  isMissionFailed: boolean;
}
