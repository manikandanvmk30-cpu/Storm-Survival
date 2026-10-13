import { CrewMember } from '../types/game';

export const INITIAL_CREW: CrewMember[] = [
  {
    id: 'crew_priya',
    name: 'Dr. Priya Sharma',
    role: 'Chief Biologist & Life Support',
    specialty: 'Oxygen scrubbers, hydroponics recycling, and crew vitals.',
    avatar: '👩‍🔬',
    currentTask: null,
    status: 'ready',
    assignedStationId: 'easy',
    assignedRoomId: 'easy',
    dialogue:
      '"Commander, the emergency oxygen scrubbers and medical kits are ready. I can stabilize the shelter air filtration filters if you give me authorization!"',
  },
  {
    id: 'crew_marcus',
    name: 'Eng. Marcus Chen',
    role: 'Lead Systems Engineer',
    specialty: 'Power core, solar grid conduits, and emergency bus triaging.',
    avatar: '👨‍🔧',
    currentTask: null,
    status: 'ready',
    assignedStationId: 'medium',
    assignedRoomId: 'medium',
    dialogue:
      '"The main coastal substation transformer is vibrating under gale gusts. I need 2 minutes to re-route circuit breakers to our auxiliary battery bank!"',
  },
  {
    id: 'crew_kaviya',
    name: 'Specialist Kaviya Sundaram',
    role: 'All-Terrain Vehicle Pilot & Communications Officer',
    specialty: 'Coastal rescue vehicle telemetry, satellite uplink, Tamil Nadu emergency network.',
    avatar: '👩‍💻',
    currentTask: null,
    status: 'ready',
    assignedStationId: 'hard',
    assignedRoomId: 'hard',
    dialogue:
      '"தகவல் இணைப்பு தயாராக உள்ளது! The satellite relay from IMD Chennai has transmitted cyclone eye coordinates. I can lock the rescue vehicle before 180 km/h gusts hit!"',
  },
  {
    id: 'crew_liam',
    name: 'Dr. Liam Vance',
    role: 'Meteorologist & Atmospheric Physicist',
    specialty: 'Cyclone trajectory modeling, barometric pressure tracking, and structural stress forecasting.',
    avatar: '👨‍🔬',
    currentTask: null,
    status: 'ready',
    assignedStationId: 'medium',
    assignedRoomId: 'medium',
    dialogue:
      '"The barometric micro-drop across the Bay of Bengal is severe. The cyclonic wall will make landfall near our coastal home in minutes. Recommend hardening shelter seals!"',
  },
];

export interface TeamTask {
  id: string;
  title: string;
  category: 'oxygen' | 'power' | 'water' | 'equipment' | 'navigation';
  description: string;
  recommendedMemberId: string;
  durationSeconds: number;
  resourceGain: {
    health?: number;
    power?: number;
    oxygen?: number;
    water?: number;
  };
  rewardCoins: number;
  rewardXp: number;
}

export const TEAM_EMERGENCY_TASKS: TeamTask[] = [
  {
    id: 'task_scrubber_seal',
    title: 'Reinforce O2 Molecular Sieves',
    category: 'oxygen',
    description: 'Purge dust from zeolite molecular sieve beds to restore 100% breathable air flow.',
    recommendedMemberId: 'crew_priya',
    durationSeconds: 20,
    resourceGain: { oxygen: +20, health: +5 },
    rewardCoins: 40,
    rewardXp: 60,
  },
  {
    id: 'task_capacitor_isolate',
    title: 'Isolate Arcing Capacitor Bank #3',
    category: 'power',
    description: 'Switch the main high-voltage feed to solid-state emergency capacitors.',
    recommendedMemberId: 'crew_marcus',
    durationSeconds: 25,
    resourceGain: { power: +22 },
    rewardCoins: 50,
    rewardXp: 70,
  },
  {
    id: 'task_rover_rtg_shunt',
    title: 'Shunt Rescue Vehicle Auxiliary Battery to Shelter',
    category: 'equipment',
    description: 'Couple the rescue vehicle\'s heavy battery bank directly to shelter life support.',
    recommendedMemberId: 'crew_kaviya',
    durationSeconds: 30,
    resourceGain: { power: +15, health: +10 },
    rewardCoins: 45,
    rewardXp: 65,
  },
  {
    id: 'task_hydro_cooling',
    title: 'Secure Freshwater Cistern & Filtration Loop',
    category: 'water',
    description: 'Prevent stormwater backwash contamination by sealing reverse osmosis valves.',
    recommendedMemberId: 'crew_priya',
    durationSeconds: 20,
    resourceGain: { water: +20, power: -5 },
    rewardCoins: 35,
    rewardXp: 50,
  },
  {
    id: 'task_atmospheric_radar',
    title: 'Harmonize Coastal Doppler Radar with Weather Satellites',
    category: 'navigation',
    description: 'Align Doppler sensors with Indian INSAT-3D weather satellite to track cyclone eye passage.',
    recommendedMemberId: 'crew_liam',
    durationSeconds: 20,
    resourceGain: { power: -5, health: +5 },
    rewardCoins: 40,
    rewardXp: 55,
  },
];
