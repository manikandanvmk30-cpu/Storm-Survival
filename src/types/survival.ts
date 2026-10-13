export type SurvivalPhase = 'warning' | 'storm' | 'aftermath' | 'victory' | 'defeat';

export interface SurvivalStats {
  health: number; // 0 - 100
  hunger: number; // 0 - 100
  water: number;  // 0 - 100
  energy: number; // 0 - 100
  shelterStrength: number; // 0 - 100
}

export interface SurvivalInventory {
  food: number;
  water: number;
  batteries: number;
  tools: number;
  wood: number;
  firstAid: number;
  beaconParts: {
    antenna: boolean;
    battery: boolean;
    flare: boolean;
  };
}

export type ResourceNodeType =
  | 'food'
  | 'water'
  | 'battery'
  | 'tools'
  | 'wood'
  | 'firstAid'
  | 'beacon_part';

export interface WorldResourceNode {
  id: string;
  name: string;
  type: ResourceNodeType;
  x: number;
  y: number;
  icon: string;
  available: boolean;
  partType?: 'antenna' | 'battery' | 'flare';
  description: string;
}

export interface FlyingDebrisItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  type: 'tile' | 'crate' | 'branch' | 'barrel';
}

export interface HomeAppliancesState {
  tv: {
    powered: boolean;
    channel: number; // 0: Cyclone Radar, 1: Emergency Alert, 2: Earth Nature, 3: Superhero News
    channelName: string;
  };
  fridge: {
    doorOpen: boolean;
    coldWaterCount: number;
    snacksCount: number;
    temperatureC: number;
  };
  lightSwitch: {
    turnedOn: boolean;
    brightness: number; // 0 to 100
  };
  fan: {
    turnedOn: boolean;
    speed: number; // 1, 2, 3
  };
  microwave: {
    isCooking: boolean;
    timeLeftSeconds: number;
  };
  radio: {
    turnedOn: boolean;
    station: string;
  };
  solarBattery: {
    chargePercent: number;
    isBackupActive: boolean;
  };
}

export interface IslandSurvivalScore {
  stormsSurvived: number;
  timeSurvivedSeconds: number;
  suppliesCollected: number;
  repairedPoints: number;
  evacuated: boolean;
}
