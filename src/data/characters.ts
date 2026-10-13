import { HeroCharacter } from '../types/game';

export const HEROES: HeroCharacter[] = [
  {
    id: 'hero_spiderman',
    name: 'Spider-Man',
    heroTitle: 'Friendly Neighborhood Hero',
    themeColor: 'rose',
    accentColor: '#ef4444',
    portrait: '🕷️',
    bio: 'Peter Parker swings through howling cyclonic winds, shooting high-tensile web-lines to anchor loose shelter structures and rescue stranded supplies with Spider-Sense.',
    abilityName: 'Web-Zip & Spidey Sense',
    abilityDescription: 'Dashes rapidly across the island, avoids flying debris, and reveals hidden supply caches for 15s.',
    cooldownSeconds: 30,
  },
  {
    id: 'hero_thor',
    name: 'Thor',
    heroTitle: 'God of Thunder',
    themeColor: 'cyan',
    accentColor: '#38bdf8',
    portrait: '⚡',
    bio: 'Wielding Mjolnir, the Asgardian Prince commands atmospheric lightning to neutralize violent wind vortexes and charge emergency power generators.',
    abilityName: 'Mjolnir Lightning Call',
    abilityDescription: 'Strikes down with divine lightning, destroying all flying debris in the storm and granting 10s immunity.',
    cooldownSeconds: 40,
  },
  {
    id: 'hero_ironman',
    name: 'Iron Man',
    heroTitle: 'Armored Avenger',
    themeColor: 'amber',
    accentColor: '#f59e0b',
    portrait: '🦾',
    bio: 'Genius inventor Tony Stark in his Mark LXXXV Nanotech Armor. Deploys repulsor forcefields, micro-thrusters, and structural arc-welders to shield the shelter.',
    abilityName: 'Arc Reactor Repulsor',
    abilityDescription: 'Deploys a repulsor forcefield that repairs shelter integrity by +25% and repels storm gales.',
    cooldownSeconds: 35,
  },
  {
    id: 'hero_captain',
    name: 'Captain America',
    heroTitle: 'The First Avenger',
    themeColor: 'blue',
    accentColor: '#3b82f6',
    portrait: '🛡️',
    bio: 'Steve Rogers leads coastal emergency relief. His indestructible Vibranium shield deflects torrential rain and crashing debris with unmatched courage.',
    abilityName: 'Vibranium Shield Guard',
    abilityDescription: 'Raises shield to block all flying debris and environmental damage for 18 seconds.',
    cooldownSeconds: 35,
  },
  {
    id: 'hero_panther',
    name: 'Black Panther',
    heroTitle: 'King of Wakanda',
    themeColor: 'purple',
    accentColor: '#a855f7',
    portrait: '🐆',
    bio: 'King T\'Challa wears a Vibranium weave habit that absorbs kinetic shockwaves from hurricane-force gales, converting storm energy into superhuman agility.',
    abilityName: 'Kinetic Absorption',
    abilityDescription: 'Absorbs storm wind friction to sprint at 2.5x speed with zero energy drain for 20s.',
    cooldownSeconds: 35,
  },
  // Legacy aliases for save file compatibility
  {
    id: 'hero_thunder',
    name: 'Thor (Thunder God)',
    heroTitle: 'God of Thunder',
    themeColor: 'cyan',
    accentColor: '#38bdf8',
    portrait: '⚡',
    bio: 'Thor Odinson wielding Mjolnir against the raging cyclone.',
    abilityName: 'Mjolnir Lightning Call',
    abilityDescription: 'Neutralizes storm winds and clears flying debris.',
    cooldownSeconds: 40,
  },
  {
    id: 'hero_iron',
    name: 'Iron Man (Mark Armor)',
    heroTitle: 'Armored Avenger',
    themeColor: 'amber',
    accentColor: '#f59e0b',
    portrait: '🦾',
    bio: 'Tony Stark in reinforced emergency armor.',
    abilityName: 'Arc Reactor Repulsor',
    abilityDescription: 'Reinforces shelter integrity with nanotech.',
    cooldownSeconds: 35,
  },
  {
    id: 'hero_web',
    name: 'Spider-Man (Web Slinger)',
    heroTitle: 'Friendly Neighborhood Hero',
    themeColor: 'rose',
    accentColor: '#ef4444',
    portrait: '🕷️',
    bio: 'Spider-Man swinging through the storm.',
    abilityName: 'Web-Zip & Spidey Sense',
    abilityDescription: 'Dashes rapidly across the island.',
    cooldownSeconds: 30,
  },
];

export function getHeroById(id: string): HeroCharacter {
  const found = HEROES.find(h => h.id === id);
  if (found) return found;
  // Fallbacks if ID was older
  if (id.includes('thunder') || id.includes('volt')) return HEROES[1]; // Thor
  if (id.includes('iron')) return HEROES[2]; // Iron Man
  if (id.includes('web') || id.includes('spiderman')) return HEROES[0]; // Spider-Man
  return HEROES[0];
}
