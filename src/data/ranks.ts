import { RankTier } from '../types/game';

export interface RankInfo {
  tier: RankTier;
  minXp: number;
  maxXp: number;
  title: string;
  badgeColor: string;
  description: string;
  perk: string;
}

export const RANKS: RankInfo[] = [
  {
    tier: 'Bronze',
    minXp: 0,
    maxXp: 500,
    title: 'Cadet Surveyor',
    badgeColor: 'border-amber-700/60 text-amber-500 bg-amber-950/40',
    description: 'Fresh recruit to the coastal disaster response brigade.',
    perk: 'Access to basic shelter logs.',
  },
  {
    tier: 'Silver',
    minXp: 501,
    maxXp: 1200,
    title: 'Specialist Engineer',
    badgeColor: 'border-slate-400/60 text-slate-300 bg-slate-900/40',
    description: 'Proven capability in resource routing under storm pressure.',
    perk: '+10% extra coins earned on clean challenge solutions.',
  },
  {
    tier: 'Gold',
    minXp: 1201,
    maxXp: 2200,
    title: 'Senior Field Officer',
    badgeColor: 'border-yellow-500/60 text-yellow-400 bg-yellow-950/40',
    description: 'Expert handler of hazardous Tamil Nadu coastal storms.',
    perk: '+1 initial Diamond grant per mission restart.',
  },
  {
    tier: 'Platinum',
    minXp: 2201,
    maxXp: 3500,
    title: 'Station Chief',
    badgeColor: 'border-cyan-400/60 text-cyan-300 bg-cyan-950/40',
    description: 'Master tactician trusted with community survival.',
    perk: 'Reduced repair delay for critical power relays.',
  },
  {
    tier: 'Diamond',
    minXp: 3501,
    maxXp: 5000,
    title: 'Regional Director',
    badgeColor: 'border-indigo-400/60 text-indigo-300 bg-indigo-950/40',
    description: 'Renowned leader across Asian disaster defense networks.',
    perk: 'Free emergency tactical scan at storm level 4.',
  },
  {
    tier: 'Earth Legend',
    minXp: 5001,
    maxXp: Infinity,
    title: 'Earth Legend',
    badgeColor: 'border-emerald-500/70 text-emerald-300 bg-emerald-950/50 shadow-emerald-500/20 shadow-lg',
    description: 'Eternal pioneer who led coastal communities through 50 levels of cyclonic fury.',
    perk: 'Permanent Commander Certificate with Golden Seal.',
  },
];

export function calculateRank(xp: number): RankTier {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      return RANKS[i].tier;
    }
  }
  return 'Bronze';
}

export function getRankInfo(tier: RankTier): RankInfo {
  return RANKS.find(r => r.tier === tier) || RANKS[0];
}
