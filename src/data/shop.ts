import { InventoryItem } from '../types/game';

export const SHOP_CATALOG: InventoryItem[] = [
  {
    id: 'item_health_kit',
    name: 'Emergency Med-Kit',
    description: 'Medical nano-gel and oxygen injector. Restores +25% Health (cannot exceed 100%).',
    cost: 100,
    quantity: 0,
    healAmount: 25,
    iconName: 'HeartPulse',
  },
  {
    id: 'item_power_cell',
    name: 'Auxiliary Power Cell',
    description: 'High-density graphene battery pack. Restores +20% Base Power.',
    cost: 120,
    quantity: 0,
    powerAmount: 20,
    iconName: 'BatteryCharging',
  },
  {
    id: 'item_o2_canister',
    name: 'Pressurized O2 Canister',
    description: 'Compressed liquid oxygen flask. Restores +20% Base Oxygen life-support reserves.',
    cost: 110,
    quantity: 0,
    oxygenAmount: 20,
    iconName: 'Wind',
  },
  {
    id: 'item_diamond_pack',
    name: 'Mission Intel Uplink (Diamonds)',
    description: 'Orbital compute credit grant. Instantly awards +2 Tactical Diamonds for hints.',
    cost: 200,
    quantity: 0,
    diamondAmount: 2,
    iconName: 'Diamond',
  },
];
