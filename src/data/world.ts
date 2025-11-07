// Auto-split from mistheart-modularv134.tsx
export const TILE_TYPES = {
  FOREST: { id: 0, color: '#38761D', walkable: true },
  FIELD: { id: 1, color: '#6AA84F', walkable: true },
  WATER: { id: 2, color: '#4A86E8', walkable: false },
  MOUNTAIN: { id: 3, color: '#A6A6A6', walkable: false },
  PATH: { id: 4, color: '#CC0000', walkable: true },
  TOWN: { id: 5, color: '#8B4513', walkable: true },
  DUNGEON: { id: 6, color: '#4A0E0E', walkable: true },
  SPIRE: { id: 7, color: '#9333EA', walkable: true }
};



export const BIOMES = {
  IRONPEAK_FOOTHILLS: {
    id: 0,
    name: 'Ironpeak Foothills',
    tiles: { 0: 0.4, 1: 0.3, 2: 0.1, 3: 0.2 }, // 40% forest, 30% field, 10% water, 20% mountain
    enemyTypes: ['undead', 'mistling']
  },
  MISTY_VALLEY: {
    id: 1,
    name: 'Misty Valley',
    tiles: { 0: 0.3, 1: 0.4, 2: 0.2, 3: 0.1 },
    enemyTypes: ['mistling', 'undead']
  },
  DEAD_MARSHES: {
    id: 2,
    name: 'Dead Marshes',
    tiles: { 0: 0.2, 1: 0.2, 2: 0.5, 3: 0.1 },
    enemyTypes: ['undead', 'mistling']
  },
  BARREN_PLAINS: {
    id: 3,
    name: 'Barren Plains',
    tiles: { 0: 0.1, 1: 0.7, 2: 0.05, 3: 0.15 },
    enemyTypes: ['undead', 'mistling']
  },
  SHADOW_WOODS: {
    id: 4,
    name: 'Shadow Woods',
    tiles: { 0: 0.7, 1: 0.1, 2: 0.1, 3: 0.1 },
    enemyTypes: ['mistling', 'undead']
  },
  DESOLATE_PEAKS: {
    id: 5,
    name: 'Desolate Peaks',
    tiles: { 0: 0.1, 1: 0.2, 2: 0.05, 3: 0.65 },
    enemyTypes: ['undead', 'mistling']
  }
};



export const STATUS_EFFECTS = {
  poisoned: {
    duration: 3,
    tickDamage: 8,
    color: '#9ACD32',
    symbol: 'PSN',
    onTick: (char) => {
      char.hp -= 8;
      return { type: 'damage', value: 8, message: 'poison damage' };
    }
  },
  hasted: {
    duration: 5,
    agilityMultiplier: 1.5,
    color: '#22D3EE',
    symbol: 'HST'
  },
  possessed: {
    duration: 2,
    color: '#FF00FF',
    symbol: 'POS'
  }
};


