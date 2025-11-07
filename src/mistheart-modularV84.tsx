import React, { useState, useEffect, useRef } from 'react';

// =============================================================================
// MODULE 1: GAME DATA & CONSTANTS
// =============================================================================
// =============================================================================
// EQUIPMENT DATABASE
// =============================================================================
const EQUIPMENT_SLOTS = ['weapon', 'armor', 'accessory'];

const EQUIPMENT_DATABASE = {
  // Weapons
  ironSword: {
    id: 'ironSword',
    name: 'Iron Sword',
    slot: 'weapon',
    rarity: 'common',
    stats: { strength: 3, agility: 1 },
    price: 50,
    description: 'A basic iron blade'
  },
  steelSword: {
    id: 'steelSword',
    name: 'Steel Sword',
    slot: 'weapon',
    rarity: 'rare',
    stats: { strength: 6, agility: 2 },
    price: 150,
    description: 'Forged with quality steel'
  },
  flameBlade: {
    id: 'flameBlade',
    name: 'Flame Blade',
    slot: 'weapon',
    rarity: 'epic',
    stats: { strength: 10, agility: 3 },
    ability: 'fireball',
    price: 300,
    description: 'Burns with eternal fire'
  },
  staff: {
    id: 'staff',
    name: 'Mage Staff',
    slot: 'weapon',
    rarity: 'rare',
    stats: { strength: 2, mp: 10 },
    price: 120,
    description: 'Amplifies magical power'
  },
  dagger: {
    id: 'dagger',
    name: 'Shadow Dagger',
    slot: 'weapon',
    rarity: 'rare',
    stats: { strength: 4, agility: 5 },
    price: 130,
    description: 'Silent and deadly'
  },
  
  // Armor
  leatherArmor: {
    id: 'leatherArmor',
    name: 'Leather Armor',
    slot: 'armor',
    rarity: 'common',
    stats: { hp: 20, endurance: 2 },
    price: 40,
    description: 'Light protective gear'
  },
  chainmail: {
    id: 'chainmail',
    name: 'Chainmail',
    slot: 'armor',
    rarity: 'rare',
    stats: { hp: 40, endurance: 5 },
    price: 140,
    description: 'Interlocked metal rings'
  },
  plateArmor: {
    id: 'plateArmor',
    name: 'Plate Armor',
    slot: 'armor',
    rarity: 'epic',
    stats: { hp: 70, endurance: 10 },
    price: 280,
    description: 'Heavy steel plates'
  },
  robes: {
    id: 'robes',
    name: 'Mage Robes',
    slot: 'armor',
    rarity: 'rare',
    stats: { hp: 15, mp: 15 },
    price: 110,
    description: 'Enchanted cloth'
  },
  
  // Accessories
  powerRing: {
    id: 'powerRing',
    name: 'Power Ring',
    slot: 'accessory',
    rarity: 'rare',
    stats: { strength: 5 },
    price: 100,
    description: 'Increases physical might'
  },
  swiftBoots: {
    id: 'swiftBoots',
    name: 'Swift Boots',
    slot: 'accessory',
    rarity: 'rare',
    stats: { agility: 5 },
    price: 100,
    description: 'Grants incredible speed'
  },
  heartAmulet: {
    id: 'heartAmulet',
    name: 'Heart Amulet',
    slot: 'accessory',
    rarity: 'epic',
    stats: { hp: 50 },
    price: 200,
    description: 'Pulses with life energy'
  },
  manacrystal: {
    id: 'manacrystal',
    name: 'Mana Crystal',
    slot: 'accessory',
    rarity: 'epic',
    stats: { mp: 20 },
    price: 200,
    description: 'Pure crystallized mana'
  }
};

const RARITY_COLORS = {
  common: '#AAAAAA',
  rare: '#3B82F6',
  epic: '#9333EA',
  legendary: '#F59E0B',
  mythic: '#EF4444'
};

// =============================================================================
// ITEM DATABASE
// =============================================================================
const ITEM_DATABASE = {
  healthPotion: {
    id: 'healthPotion',
    name: 'Health Potion',
    type: 'consumable',
    effect: { heal: 50 },
    price: 30,
    description: 'Restores 50 HP',
    stackable: true
  },
  manaPotion: {
    id: 'manaPotion',
    name: 'Mana Potion',
    type: 'consumable',
    effect: { restoreMp: 30 },
    price: 25,
    description: 'Restores 30 MP',
    stackable: true
  },
  elixir: {
    id: 'elixir',
    name: 'Elixir',
    type: 'consumable',
    effect: { heal: 999, restoreMp: 999 },
    price: 200,
    description: 'Full HP/MP restore',
    stackable: true
  },
  antidote: {
    id: 'antidote',
    name: 'Antidote',
    type: 'consumable',
    effect: { cureStatus: 'poisoned' },
    price: 20,
    description: 'Cures poison',
    stackable: true
  }
};

// =============================================================================
// SKILL DATABASE (Class-Specific)
// =============================================================================
const SKILL_DATABASE = {
  // Warrior Skills
  powerStrike: {
    id: 'powerStrike',
    name: 'Power Strike',
    class: 'Warrior',
    unlockLevel: 3,
    manaCost: 8,
    targetType: 'enemy',
    description: 'Deal 2x damage',
    calculate: (caster) => ({ damage: Math.floor(caster.strength * 3) })
  },
  warcry: {
    id: 'warcry',
    name: 'War Cry',
    class: 'Warrior',
    unlockLevel: 5,
    manaCost: 10,
    targetType: 'self',
    description: '+50% STR for 3 turns',
    calculate: () => ({ buff: { stat: 'strength', multiplier: 1.5, duration: 3 } })
  },
  
  // Healer Skills
  groupHeal: {
    id: 'groupHeal',
    name: 'Group Heal',
    class: 'Healer',
    unlockLevel: 3,
    manaCost: 15,
    targetType: 'allAllies',
    description: 'Heal all allies 40 HP',
    calculate: () => ({ heal: 40 })
  },
  revive: {
    id: 'revive',
    name: 'Revive',
    class: 'Healer',
    unlockLevel: 7,
    manaCost: 25,
    targetType: 'ally',
    description: 'Revive fallen ally with 50% HP',
    calculate: (caster, target) => ({ revive: true, healPercent: 0.5 })
  },
  
  // Paladin Skills
  holyStrike: {
    id: 'holyStrike',
    name: 'Holy Strike',
    class: 'Paladin',
    unlockLevel: 3,
    manaCost: 6,
    targetType: 'enemy',
    description: 'Deal damage and heal self',
    calculate: (caster) => ({ damage: Math.floor(caster.strength * 2.5), healSelf: 20 })
  },
  divineShield: {
    id: 'divineShield',
    name: 'Divine Shield',
    class: 'Paladin',
    unlockLevel: 5,
    manaCost: 8,
    targetType: 'ally',
    description: 'Grant immunity for 2 turns',
    calculate: () => ({ buff: { invulnerable: true, duration: 2 } })
  },
  
  // Rogue Skills
  backstab: {
    id: 'backstab',
    name: 'Backstab',
    class: 'Rogue',
    unlockLevel: 3,
    manaCost: 10,
    targetType: 'enemy',
    description: '3x damage critical strike',
    calculate: (caster) => ({ damage: Math.floor(caster.strength * 4.5) })
  },
  smokeScreen: {
    id: 'smokeScreen',
    name: 'Smoke Screen',
    class: 'Rogue',
    unlockLevel: 5,
    manaCost: 12,
    targetType: 'self',
    description: 'Dodge all attacks for 2 turns',
    calculate: () => ({ buff: { evasion: 1.0, duration: 2 } })
  },
  
  // Mage Skills
  blizzard: {
    id: 'blizzard',
    name: 'Blizzard',
    class: 'Mage',
    unlockLevel: 3,
    manaCost: 18,
    targetType: 'allEnemies',
    description: 'Deal 35 damage to all enemies',
    calculate: () => ({ damage: 35 })
  },
  timeWarp: {
    id: 'timeWarp',
    name: 'Time Warp',
    class: 'Mage',
    unlockLevel: 6,
    manaCost: 20,
    targetType: 'ally',
    description: 'Grant instant ATB fill',
    calculate: () => ({ instantATB: true })
  },
  
  // Alchemist Skills
  toxicCloud: {
    id: 'toxicCloud',
    name: 'Toxic Cloud',
    class: 'Alchemist',
    unlockLevel: 3,
    manaCost: 12,
    targetType: 'allEnemies',
    description: 'Poison all enemies',
    calculate: () => ({ status: 'poisoned' })
  },
  alchemyBurst: {
    id: 'alchemyBurst',
    name: 'Alchemy Burst',
    class: 'Alchemist',
    unlockLevel: 5,
    manaCost: 15,
    targetType: 'enemy',
    description: 'Massive magic damage',
    calculate: () => ({ damage: 60 })
  },
  
  // Shapeshifter Skills
  beastForm: {
    id: 'beastForm',
    name: 'Beast Form',
    class: 'Shapeshifter',
    unlockLevel: 3,
    manaCost: 10,
    targetType: 'self',
    description: '+50% STR/AGI for 4 turns',
    calculate: () => ({ buff: { stat: 'strengthAgility', multiplier: 1.5, duration: 4 } })
  },
  savageBite: {
    id: 'savageBite',
    name: 'Savage Bite',
    class: 'Shapeshifter',
    unlockLevel: 5,
    manaCost: 12,
    targetType: 'enemy',
    description: 'Deal damage and steal 30% as HP',
    calculate: (caster) => ({ damage: Math.floor(caster.strength * 3), lifeSteal: 0.3 })
  },
  
  // Ranger Skills
  multiShot: {
    id: 'multiShot',
    name: 'Multi-Shot',
    class: 'Ranger',
    unlockLevel: 3,
    manaCost: 14,
    targetType: 'allEnemies',
    description: 'Hit all enemies for 25 damage',
    calculate: () => ({ damage: 25 })
  },
  huntersMark: {
    id: 'huntersMark',
    name: "Hunter's Mark",
    class: 'Ranger',
    unlockLevel: 5,
    manaCost: 8,
    targetType: 'enemy',
    description: 'Target takes 50% more damage',
    calculate: () => ({ debuff: { vulnerable: 1.5, duration: 3 } })
  }
};

const GAME_CONSTANTS = {
  TILE_SIZE: 16,
  CANVAS_WIDTH: 320,  // Changed from 256 to 320 (20 tiles)
  CANVAS_HEIGHT: 240, // Changed from 224 to 240 (15 tiles)
  
  // Scale options
  SCALE_OPTIONS: [1, 2, 3, 4], // 320x240, 640x480, 960x720, 1280x960
  DEFAULT_SCALE: 2,
  
  // World Map (4096x4096 tiles = massive world)
  WORLD_WIDTH: 4096,
  WORLD_HEIGHT: 4096,
  VIEWPORT_TILES_WIDTH: 20,  // 320px / 16 = 20 tiles visible
  VIEWPORT_TILES_HEIGHT: 15, // 240px / 16 = 15 tiles visible
  
  // Location Sizes (in tiles)
  TOWN_SIZE: 32,        // Towns are 32x32 tiles (512x512 pixels)
  DUNGEON_SIZE: 48,     // Dungeons are 48x48 tiles (768x768 pixels)
  SPIRE_SIZE: 64,       // Final Spire is 64x64 tiles (1024x1024 pixels)
  
  // World Structure (from design doc)
  NUM_BIOMES: 6,
  NUM_TOWNS: 12,
  NUM_DUNGEONS: 18,
  
  ATB_MAX: 100,
  ATB_BASE_SPEED: 1.0,
  ENCOUNTER_CHANCE: 0.005,
  ANIMATION_SPEED: 8,
  
  // XP System
  XP_PER_HIT: 5,
  XP_KILL_MULTIPLIER: 3,
  XP_TO_LEVEL: 100,
  
  // Gold System
  GOLD_PER_ENEMY_BASE: 10,
  GOLD_MULTIPLIER_RANGE: [0.8, 1.5],
  
  // Save System
  SAVE_SLOT_KEY: 'mistheart_save_slot_',
  MAX_SAVE_SLOTS: 3
};

// =============================================================================
// TRAIT DATABASE
// =============================================================================
const TRAIT_DATABASE = {
  // Offensive Traits (Passive)
  savage: {
    name: 'Savage',
    description: 'Start battle: +50% STR/AGI',
    passive: true,
    onBattleStart: (hero) => {
      hero.strength = Math.floor(hero.strength * 1.5);
      hero.agility = Math.floor(hero.agility * 1.5);
    }
  },
  berserker: {
    name: 'Berserker',
    description: '+50% damage when HP < 30%',
    passive: true
  },
  assassin: {
    name: 'Assassin',
    description: '30% chance to deal triple damage',
    passive: true,
    critChance: 0.3,
    critMultiplier: 3
  },
  
  // Defensive Traits (Passive)
  guardian: {
    name: 'Guardian',
    description: 'Take 25% less damage',
    passive: true,
    onBattleStart: (hero) => {
      hero.damageReduction = 0.25;
    }
  },
  regeneration: {
    name: 'Regeneration',
    description: 'Restore 5% HP per turn',
    passive: true,
    regenPercent: 0.05
  },
  ironWill: {
    name: 'Iron Will',
    description: 'Immune to status effects',
    passive: true,
    statusImmune: true
  },
  
  // Utility Traits (Passive)
  quickDraw: {
    name: 'Quick Draw',
    description: '+50% ATB charge speed',
    passive: true,
    onBattleStart: (hero) => {
      hero.atbSpeedMod = 1.5;
    }
  },
  manaFlow: {
    name: 'Mana Flow',
    description: 'Restore 3 MP per turn',
    passive: true,
    manaRegen: 3
  },
  lifeSteal: {
    name: 'Life Steal',
    description: 'Restore 25% of damage dealt as HP',
    passive: true,
    lifeStealPercent: 0.25
  },
  
  // Support Traits (Passive)
  inspire: {
    name: 'Inspire',
    description: 'All allies gain +20% ATB speed',
    passive: true,
    aoe: true,
    onBattleStart: (hero, allHeroes) => {
      allHeroes.forEach(h => {
        if (h.hp > 0) h.atbSpeedMod = (h.atbSpeedMod || 1) * 1.2;
      });
    }
  },
  lastStand: {
    name: 'Last Stand',
    description: 'Survive fatal damage with 1 HP (once)',
    passive: true,
    oneTimeUse: true
  }
};

const TILE_TYPES = {
  FOREST: { id: 0, color: '#38761D', walkable: true },
  FIELD: { id: 1, color: '#6AA84F', walkable: true },
  WATER: { id: 2, color: '#4A86E8', walkable: false },
  MOUNTAIN: { id: 3, color: '#A6A6A6', walkable: false },
  PATH: { id: 4, color: '#CC0000', walkable: true },
  TOWN: { id: 5, color: '#8B4513', walkable: true },
  DUNGEON: { id: 6, color: '#4A0E0E', walkable: true },
  SPIRE: { id: 7, color: '#9333EA', walkable: true }
};

// Biome definitions (each biome has different tile distributions)
const BIOMES = {
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

const STATUS_EFFECTS = {
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

const HERO_DATA = [
  { 
    id: 'hero', 
    name: 'Hero', 
    class: 'Warrior',
    hp: 100, maxHp: 100, 
    mp: 20, maxMp: 20, 
    agility: 10,
    strength: 15,
    endurance: 12,
    color: '#FFD700',
    description: 'Former slave, now free adventurer',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [], // Learned traits
    activeTraits: [] // Currently active traits (for duration-based ones)
  },
  { 
    id: 'eyla', 
    name: 'Eyla', 
    class: 'Healer',
    hp: 80, maxHp: 80, 
    mp: 30, maxMp: 30, 
    agility: 15,
    strength: 8,
    endurance: 10,
    color: '#00CED1',
    description: 'River Elf healer haunted by past failure',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: [],
    equipment: { weapon: null, armor: null, accessory: null },
    skills: []
  },
  { 
    id: 'greyor', 
    name: 'Greyor', 
    class: 'Paladin',
    hp: 120, maxHp: 120, 
    mp: 5, maxMp: 5, 
    agility: 5,
    strength: 20,
    endurance: 18,
    color: '#C0C0C0',
    description: 'Disgraced Paladin seeking redemption',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  },
  { 
    id: 'shawath', 
    name: 'Shawath', 
    class: 'Rogue',
    hp: 90, maxHp: 90, 
    mp: 15, maxMp: 15, 
    agility: 18,
    strength: 13,
    endurance: 8,
    color: '#8B4513',
    description: 'Cunning assassin motivated by gold',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  },
  { 
    id: 'fynrey', 
    name: 'Fynrey', 
    class: 'Mage',
    hp: 70, maxHp: 70, 
    mp: 40, maxMp: 40, 
    agility: 8,
    strength: 6,
    endurance: 7,
    color: '#9370DB',
    description: 'Ancient mage with forbidden knowledge',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  },
  { 
    id: 'gilla', 
    name: 'Gilla', 
    class: 'Alchemist',
    hp: 85, maxHp: 85, 
    mp: 25, maxMp: 25, 
    agility: 12,
    strength: 10,
    endurance: 11,
    color: '#2E8B57',
    description: 'Scientist studying the Mist plague',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  },
  { 
    id: 'zakarath', 
    name: 'Zakarath', 
    class: 'Shapeshifter',
    hp: 95, maxHp: 95, 
    mp: 20, maxMp: 20, 
    agility: 14,
    strength: 16,
    endurance: 13,
    color: '#FF6347',
    description: 'Exiled shapeshifter, bitter towards civilization',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  },
  { 
    id: 'kroge', 
    name: 'Kroge', 
    class: 'Ranger',
    hp: 105, maxHp: 105, 
    mp: 18, maxMp: 18, 
    agility: 16,
    strength: 17,
    endurance: 14,
    color: '#228B22',
    description: 'Fallen royal guard driven by revenge',
    level: 1,
    xp: 0,
    xpToNext: 100,
    traits: [],
    activeTraits: []
  }
];

const ENEMY_TEMPLATES = [
  {
    id: 'undead',
    name: 'Undead',
    hp: 50, maxHp: 50,
    agility: 7,
    strength: 12,
    color: '#FF0000',
    actions: ['slam', 'gravePoison'],
    goldDrop: 15
  },
  {
    id: 'mistling',
    name: 'Mistling',
    hp: 30, maxHp: 30,
    agility: 12,
    strength: 8,
    color: '#E879F9',
    actions: ['scratch', 'shadowBolt'],
    goldDrop: 10
  }
];

const ACTION_DATABASE = {
  // Physical Actions
  attack: {
    name: 'Attack',
    type: 'physical',
    targetType: 'enemy',
    manaCost: 0,
    calculate: (caster, target) => {
      const damage = Math.floor(caster.strength * 1.5);
      return { damage: target.isDefending ? Math.floor(damage / 2) : damage };
    }
  },
  slam: {
    name: 'Slam',
    type: 'physical',
    targetType: 'ally',
    manaCost: 0,
    calculate: (caster) => ({ damage: 15 })
  },
  scratch: {
    name: 'Scratch',
    type: 'physical',
    targetType: 'ally',
    manaCost: 0,
    calculate: (caster) => ({ damage: 10 })
  },
  
  // Magic Actions
  fireball: {
    name: 'Fireball',
    type: 'magic',
    targetType: 'enemy',
    manaCost: 5,
    calculate: (caster) => ({ damage: 25 })
  },
  shadowBolt: {
    name: 'Shadow Bolt',
    type: 'magic',
    targetType: 'ally',
    manaCost: 0,
    calculate: (caster) => ({ damage: 30 })
  },
  heal: {
    name: 'Heal',
    type: 'magic',
    targetType: 'ally',
    manaCost: 4,
    calculate: (caster) => ({ heal: 30 })
  },
  
  // Status Actions
  poisonVial: {
    name: 'Poison Vial',
    type: 'item',
    targetType: 'enemy',
    manaCost: 0,
    calculate: () => ({ status: 'poisoned' })
  },
  hastePotion: {
    name: 'Haste Potion',
    type: 'item',
    targetType: 'ally',
    manaCost: 0,
    calculate: () => ({ status: 'hasted' })
  },
  darkPotion: {
    name: 'Dark Potion',
    type: 'item',
    targetType: 'ally',
    manaCost: 0,
    calculate: () => ({ status: 'possessed' })
  },
  gravePoison: {
    name: 'Grave Poison',
    type: 'status',
    targetType: 'ally',
    manaCost: 0,
    calculate: () => ({ status: 'poisoned' })
  },
  
  // Defensive Actions
  defend: {
    name: 'Defend',
    type: 'defensive',
    targetType: 'self',
    manaCost: 0,
    calculate: () => ({ defend: true })
  },
  
  // Consumable Items
  healthPotion: {
    name: 'Health Potion',
    type: 'item',
    targetType: 'ally',
    manaCost: 0,
    consumable: true,
    calculate: () => ({ heal: 50 })
  },
  manaPotion: {
    name: 'Mana Potion',
    type: 'item',
    targetType: 'ally',
    manaCost: 0,
    consumable: true,
    calculate: () => ({ restoreMp: 30 })
  }
};

const MENU_OPTIONS = {
  main: ['Attack', 'Skills', 'Magic', 'Item', 'Defend'],
  magic: ['fireball', 'heal'],
  item: ['healthPotion', 'manaPotion', 'poisonVial', 'hastePotion', 'darkPotion']
};

// =============================================================================
// MODULE 2: SAVE/LOAD SYSTEM
// =============================================================================
class SaveSystem {
  static saveGame(state, slotNumber = 1) {
    try {
      const saveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        roster: state.roster,
        inventory: state.inventory,
        worldMap: {
          player: state.worldMap.player,
          currentBiome: state.worldMap.currentBiome,
          camera: state.worldMap.camera,
          locations: state.worldMap.locations,
          // Don't save the full map, regenerate on load
        },
        playTime: state.playTime || 0
      };
      
      const saveKey = GAME_CONSTANTS.SAVE_SLOT_KEY + slotNumber;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      console.log(`Game saved to slot ${slotNumber}!`);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }
  
  static loadGame(slotNumber = 1) {
    try {
      const saveKey = GAME_CONSTANTS.SAVE_SLOT_KEY + slotNumber;
      const saveDataStr = localStorage.getItem(saveKey);
      
      if (!saveDataStr) {
        console.log(`No save data found in slot ${slotNumber}`);
        return null;
      }
      
      const saveData = JSON.parse(saveDataStr);
      console.log(`Game loaded from slot ${slotNumber}!`);
      return saveData;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }
  
  static getSaveSlotInfo(slotNumber) {
    try {
      const saveKey = GAME_CONSTANTS.SAVE_SLOT_KEY + slotNumber;
      const saveDataStr = localStorage.getItem(saveKey);
      
      if (!saveDataStr) {
        return null;
      }
      
      const saveData = JSON.parse(saveDataStr);
      
      // Get party info
      const activeParty = saveData.roster.activeParty.map(index => {
        const hero = saveData.roster.allHeroes[index];
        return {
          name: hero.name,
          level: hero.level,
          class: hero.class
        };
      });
      
      return {
        exists: true,
        timestamp: saveData.timestamp,
        gold: saveData.inventory.gold,
        activeParty: activeParty,
        playTime: saveData.playTime || 0,
        location: saveData.worldMap.currentBiome
      };
    } catch (error) {
      return null;
    }
  }
  
  static deleteSave(slotNumber) {
    try {
      const saveKey = GAME_CONSTANTS.SAVE_SLOT_KEY + slotNumber;
      localStorage.removeItem(saveKey);
      console.log(`Save slot ${slotNumber} deleted.`);
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }
  
  static getAllSaveSlots() {
    const slots = [];
    for (let i = 1; i <= GAME_CONSTANTS.MAX_SAVE_SLOTS; i++) {
      slots.push(this.getSaveSlotInfo(i));
    }
    return slots;
  }
}

// =============================================================================
// MODULE 3: GAME STATE MANAGER
// =============================================================================
class GameStateManager {
  constructor() {
    this.state = this.createInitialState();
  }
  
  createInitialState() {
    return {
      scene: 'TITLE_SCREEN',
      
      // Party roster management
      roster: {
        allHeroes: HERO_DATA.map(h => ({
          ...h,
          atbMeter: 0,
          statuses: {},
          isDefending: false,
          // Ensure all arrays/objects exist
          traits: h.traits || [],
          skills: h.skills || [],
          equipment: h.equipment || { weapon: null, armor: null, accessory: null }
        })),
        activeParty: [0, 1, 2], // Indices of heroes in active party (Hero, Eyla, Greyor)
      },
      
      inventory: {
        gold: 0,
        items: {
          healthPotion: 3,
          manaPotion: 2
        },
        equipment: [] // Array of equipment IDs in storage
      },
      
      worldMap: {
        player: {
          x: 64 * GAME_CONSTANTS.TILE_SIZE,  // Start near first town
          y: 64 * GAME_CONSTANTS.TILE_SIZE,
          speed: 2, // Faster movement on large map
          animationFrame: 0,
          frameCounter: 0
        },
        currentBiome: 0, // Ironpeak Foothills
        camera: {
          x: 0,
          y: 0
        },
        map: null, // Will be generated
        locations: [] // Towns, dungeons, spire
      },
      combat: null,
      playTime: 0 // In seconds
    };
  }
  
  loadFromSave(saveData) {
    // Restore saved data
    this.state.roster = saveData.roster;
    this.state.inventory = saveData.inventory;
    this.state.worldMap.player = saveData.worldMap.player;
    this.state.worldMap.currentBiome = saveData.worldMap.currentBiome;
    this.state.worldMap.camera = saveData.worldMap.camera;
    this.state.worldMap.locations = saveData.worldMap.locations;
    this.state.playTime = saveData.playTime || 0;
    this.state.scene = 'WORLD_MAP';
    
    // Regenerate map (don't save/load the huge map array)
    this.initializeWorld();
  }
  
  newGame() {
    this.state = this.createInitialState();
    this.state.scene = 'WORLD_MAP';
  }
  
  generateWorld() {
    console.log('Generating 4096x4096 world... This may take a moment.');
    
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    const map = [];
    
    // Initialize with basic terrain using biomes
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        // Determine biome based on position (6 biomes arranged in rough zones)
        const biomeIndex = this.getBiomeAtPosition(x, y);
        const biome = Object.values(BIOMES)[biomeIndex];
        
        // Generate tile based on biome probabilities
        const tile = this.generateBiomeTile(biome);
        row.push(tile);
      }
      map.push(row);
      
      // Progress logging every 10%
      if (y % 410 === 0) {
        console.log(`World generation: ${Math.floor((y / height) * 100)}%`);
      }
    }
    
    console.log('World terrain generated! Placing locations...');
    
    // Generate locations (towns, dungeons, spire)
    const locations = this.generateLocations(map);
    
    console.log(`World complete! ${locations.length} locations placed.`);
    
    return { map, locations };
  }
  
  getBiomeAtPosition(x, y) {
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Divide map into 6 zones (2 rows x 3 columns)
    const zoneWidth = width / 3;
    const zoneHeight = height / 2;
    
    const col = Math.floor(x / zoneWidth);
    const row = Math.floor(y / zoneHeight);
    
    const biomeMap = [
      [0, 1, 2], // Top row: Ironpeak, Misty Valley, Dead Marshes
      [3, 4, 5]  // Bottom row: Barren Plains, Shadow Woods, Desolate Peaks
    ];
    
    return biomeMap[Math.min(row, 1)][Math.min(col, 2)];
  }
  
  generateBiomeTile(biome) {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [tileId, probability] of Object.entries(biome.tiles)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return parseInt(tileId);
      }
    }
    
    return 1; // Default to field
  }
  
  generateLocations(map) {
    const locations = [];
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Generate 12 towns (2 per biome)
    for (let i = 0; i < GAME_CONSTANTS.NUM_TOWNS; i++) {
      const biomeIndex = Math.floor(i / 2); // 2 towns per biome
      const location = this.placeLocation(map, 'town', biomeIndex, i);
      locations.push(location);
    }
    
    // Generate 18 dungeons (3 per biome)
    for (let i = 0; i < GAME_CONSTANTS.NUM_DUNGEONS; i++) {
      const biomeIndex = Math.floor(i / 3); // 3 dungeons per biome
      const location = this.placeLocation(map, 'dungeon', biomeIndex, i);
      locations.push(location);
    }
    
    // Generate final spire (center of last biome)
    const spire = {
      type: 'spire',
      name: 'Mistheart Spire',
      x: Math.floor(width * 5 / 6),
      y: Math.floor(height * 3 / 4),
      width: GAME_CONSTANTS.SPIRE_SIZE,
      height: GAME_CONSTANTS.SPIRE_SIZE,
      biome: 5
    };
    locations.push(spire);
    
    // Place location markers on map
    locations.forEach(loc => {
      const tileType = loc.type === 'town' ? 5 : loc.type === 'dungeon' ? 6 : 7;
      this.stampLocationOnMap(map, loc, tileType);
    });
    
    return locations;
  }
  
  placeLocation(map, type, biomeIndex, index) {
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Get biome zone bounds
    const zoneWidth = width / 3;
    const zoneHeight = height / 2;
    const col = biomeIndex % 3;
    const row = Math.floor(biomeIndex / 3);
    
    const zoneX = col * zoneWidth;
    const zoneY = row * zoneHeight;
    
    // Random position within biome zone (with padding)
    const padding = 100;
    const size = type === 'town' ? GAME_CONSTANTS.TOWN_SIZE : GAME_CONSTANTS.DUNGEON_SIZE;
    
    const x = zoneX + padding + Math.floor(Math.random() * (zoneWidth - padding * 2 - size));
    const y = zoneY + padding + Math.floor(Math.random() * (zoneHeight - padding * 2 - size));
    
    return {
      type,
      name: type === 'town' ? `Town ${index + 1}` : `Dungeon ${index + 1}`,
      x,
      y,
      width: size,
      height: size,
      biome: biomeIndex
    };
  }
  
  stampLocationOnMap(map, location, tileType) {
    for (let dy = 0; dy < location.height; dy++) {
      for (let dx = 0; dx < location.width; dx++) {
        const x = location.x + dx;
        const y = location.y + dy;
        
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
          map[y][x] = tileType;
        }
      }
    }
  }
  
  generateMap() {
    // Legacy small map - keeping for backward compatibility
    return [
      [3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [3,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1],
      [1,1,1,1,0,0,0,0,0,1,1,1,2,2,2,2],
      [1,1,1,0,0,0,0,0,0,0,1,1,2,2,2,2],
      [1,1,0,0,0,0,0,0,0,0,0,1,1,1,2,2],
      [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    ];
  }
  
  startBattle(roster) {
    // Get active party members
    const activeHeroes = roster.activeParty.map(index => {
      const hero = roster.allHeroes[index];
      return {
        ...hero,
        atbMeter: 0,
        statuses: {},
        isDefending: false,
        // Reset combat-specific modifiers
        strengthMod: 1,
        agilityMod: 1,
        atbSpeedMod: 1,
        damageReduction: 0,
        threat: 0,
        lifeStealPercent: 0,
        // Ensure skills are copied
        skills: [...(hero.skills || [])],
        traits: [...(hero.traits || [])]
      };
    });
    
    // Apply passive traits to all heroes
    activeHeroes.forEach(hero => {
      if (hero.traits && hero.traits.length > 0) {
        hero.traits.forEach(traitId => {
          const trait = TRAIT_DATABASE[traitId];
          if (trait && trait.onBattleStart) {
            if (trait.aoe) {
              trait.onBattleStart(hero, activeHeroes);
            } else {
              trait.onBattleStart(hero);
            }
          }
          
          // Apply passive effects
          if (trait && trait.lifeStealPercent) {
            hero.lifeStealPercent = trait.lifeStealPercent;
          }
        });
      }
    });
    
    console.log('Battle starting with heroes:', activeHeroes.map(h => ({ 
      name: h.name, 
      skills: h.skills, 
      traits: h.traits,
      str: h.strength,
      agi: h.agility
    })));
    
    this.state.combat = CombatSystem.initialize(activeHeroes, ENEMY_TEMPLATES);
    this.state.scene = 'BATTLE';
  }
  
  initializeWorld() {
    if (!this.state.worldMap.map) {
      const { map, locations } = this.generateWorld();
      this.state.worldMap.map = map;
      this.state.worldMap.locations = locations;
      
      // Center camera on player
      this.updateCamera();
    }
  }
  
  updateCamera() {
    const { player, camera } = this.state.worldMap;
    
    // Center camera on player
    camera.x = player.x - (GAME_CONSTANTS.CANVAS_WIDTH / 2);
    camera.y = player.y - (GAME_CONSTANTS.CANVAS_HEIGHT / 2);
    
    // Clamp camera to world bounds
    camera.x = Math.max(0, Math.min(camera.x, GAME_CONSTANTS.WORLD_WIDTH * GAME_CONSTANTS.TILE_SIZE - GAME_CONSTANTS.CANVAS_WIDTH));
    camera.y = Math.max(0, Math.min(camera.y, GAME_CONSTANTS.WORLD_HEIGHT * GAME_CONSTANTS.TILE_SIZE - GAME_CONSTANTS.CANVAS_HEIGHT));
  }
  
  endBattle(roster, inventory, goldEarned) {
    // Sync hero stats back to roster (HP/MP and XP/Level/Traits)
    if (this.state.combat) {
      this.state.combat.heroes.forEach((combatHero, i) => {
        const rosterIndex = roster.activeParty[i];
        const rosterHero = roster.allHeroes[rosterIndex];
        
        // Update HP/MP (keep them at combat values)
        rosterHero.hp = combatHero.hp;
        rosterHero.mp = combatHero.mp;
        
        // Update XP and Level
        rosterHero.xp = combatHero.xp;
        rosterHero.level = combatHero.level;
        rosterHero.xpToNext = combatHero.xpToNext;
        
        // Update traits
        rosterHero.traits = combatHero.traits || [];
        
        // Update stats from leveling
        rosterHero.maxHp = combatHero.maxHp;
        rosterHero.maxMp = combatHero.maxMp;
        rosterHero.strength = combatHero.strength;
        rosterHero.agility = combatHero.agility;
        rosterHero.endurance = combatHero.endurance;
      });
      
      // Award gold
      inventory.gold += goldEarned;
    }
    
    this.state.combat = null;
    this.state.scene = 'WORLD_MAP';
  }
  
  getState() {
    return this.state;
  }
}

// =============================================================================
// MODULE 3: EQUIPMENT SYSTEM
// =============================================================================
class EquipmentSystem {
  static calculateStats(hero) {
    // Base stats
    const stats = {
      hp: hero.maxHp,
      mp: hero.maxMp,
      strength: hero.strength,
      agility: hero.agility,
      endurance: hero.endurance
    };
    
    // Add equipment bonuses
    EQUIPMENT_SLOTS.forEach(slot => {
      const equipId = hero.equipment[slot];
      if (equipId) {
        const equip = EQUIPMENT_DATABASE[equipId];
        if (equip && equip.stats) {
          Object.keys(equip.stats).forEach(stat => {
            stats[stat] = (stats[stat] || 0) + equip.stats[stat];
          });
        }
      }
    });
    
    return stats;
  }
  
  static applyEquipmentStats(hero) {
    const stats = this.calculateStats(hero);
    
    // Update hero stats with equipment bonuses
    const oldMaxHp = hero.maxHp;
    const oldMaxMp = hero.maxMp;
    
    hero.maxHp = stats.hp;
    hero.maxMp = stats.mp;
    hero.strength = stats.strength;
    hero.agility = stats.agility;
    hero.endurance = stats.endurance;
    
    // Adjust current HP/MP proportionally
    const hpRatio = hero.hp / oldMaxHp;
    const mpRatio = hero.mp / oldMaxMp;
    hero.hp = Math.min(hero.maxHp, Math.floor(hero.maxHp * hpRatio));
    hero.mp = Math.min(hero.maxMp, Math.floor(hero.maxMp * mpRatio));
  }
  
  static equipItem(hero, equipmentId) {
    const equipment = EQUIPMENT_DATABASE[equipmentId];
    if (!equipment) return false;
    
    const slot = equipment.slot;
    
    // Unequip current item in slot
    const oldEquip = hero.equipment[slot];
    hero.equipment[slot] = equipmentId;
    
    // Recalculate stats
    this.applyEquipmentStats(hero);
    
    return oldEquip; // Return old equipment ID (goes back to inventory)
  }
  
  static unequipSlot(hero, slot) {
    const equipId = hero.equipment[slot];
    hero.equipment[slot] = null;
    this.applyEquipmentStats(hero);
    return equipId;
  }
  
  static getAvailableSkills(hero) {
    // Get all skills for this class that are unlocked by level
    return Object.values(SKILL_DATABASE).filter(skill => 
      skill.class === hero.class && hero.level >= skill.unlockLevel
    ).map(skill => skill.id);
  }
  
  static unlockSkills(hero) {
    const available = this.getAvailableSkills(hero);
    available.forEach(skillId => {
      if (!hero.skills.includes(skillId)) {
        hero.skills.push(skillId);
        console.log(`${hero.name} unlocked skill: ${SKILL_DATABASE[skillId].name}!`);
      }
    });
  }
}

// =============================================================================
// MODULE 4: XP AND LEVELING SYSTEM
// =============================================================================
class XPSystem {
  static awardXP(hero, xpAmount) {
    hero.xp += xpAmount;
    
    const levelUps = [];
    
    // Check for level up (can level up multiple times if enough XP)
    while (hero.xp >= hero.xpToNext) {
      hero.xp -= hero.xpToNext;
      hero.level++;
      
      // Stat increases per level
      const statGains = this.calculateStatGains(hero);
      hero.maxHp += statGains.hp;
      hero.maxMp += statGains.mp;
      hero.strength += statGains.strength;
      hero.agility += statGains.agility;
      hero.endurance += statGains.endurance;
      
      // Heal on level up
      hero.hp = hero.maxHp;
      hero.mp = hero.maxMp;
      
      // Calculate next level requirement (scales with level)
      hero.xpToNext = Math.floor(GAME_CONSTANTS.XP_TO_LEVEL * Math.pow(1.2, hero.level - 1));
      
      // Unlock new skills based on level
      EquipmentSystem.unlockSkills(hero);
      
      // Generate 2 random trait options
      const traitOptions = this.generateTraitOptions(hero);
      
      levelUps.push({
        hero: hero,
        level: hero.level,
        gains: statGains,
        traitOptions: traitOptions
      });
    }
    
    return levelUps;
  }
  
  static generateTraitOptions(hero) {
    const allTraitIds = Object.keys(TRAIT_DATABASE);
    
    // Ensure hero has traits array
    if (!hero.traits) {
      hero.traits = [];
    }
    
    const availableTraits = allTraitIds.filter(id => !hero.traits.includes(id));
    
    // If no traits available, return empty array
    if (availableTraits.length === 0) {
      return [];
    }
    
    // Shuffle and pick 2 (or fewer if not enough available)
    const shuffled = availableTraits.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(2, availableTraits.length));
  }
  
  static learnTrait(hero, traitId) {
    if (!hero.traits) hero.traits = [];
    if (!hero.traits.includes(traitId)) {
      hero.traits.push(traitId);
    }
  }
  
  static calculateStatGains(hero) {
    // Class-based stat growth
    const growthPatterns = {
      'Warrior': { hp: 8, mp: 2, strength: 2, agility: 1, endurance: 2 },
      'Healer': { hp: 5, mp: 5, strength: 1, agility: 2, endurance: 1 },
      'Paladin': { hp: 10, mp: 1, strength: 2, agility: 0, endurance: 3 },
      'Rogue': { hp: 6, mp: 2, strength: 2, agility: 3, endurance: 1 },
      'Mage': { hp: 4, mp: 6, strength: 1, agility: 1, endurance: 1 },
      'Alchemist': { hp: 6, mp: 4, strength: 1, agility: 2, endurance: 2 },
      'Shapeshifter': { hp: 7, mp: 3, strength: 3, agility: 2, endurance: 2 },
      'Ranger': { hp: 7, mp: 2, strength: 3, agility: 2, endurance: 2 }
    };
    
    return growthPatterns[hero.class] || { hp: 5, mp: 2, strength: 1, agility: 1, endurance: 1 };
  }
}

// =============================================================================
// MODULE 5: ATB SYSTEM (Agility-Based Turn Order)
// =============================================================================
class ATBSystem {
  static chargeATB(characters, deltaTime = 1) {
    const readyCharacters = [];
    
    characters.forEach(char => {
      if (char.hp <= 0) {
        char.atbMeter = 0;
        return;
      }
      
      // Calculate agility modifier from status effects
      const agilityMultiplier = char.statuses.hasted 
        ? STATUS_EFFECTS.hasted.agilityMultiplier 
        : 1.0;
      
      // ATB charges based on (Agility × Status Multipliers × Base Speed)
      const chargeRate = char.agility * agilityMultiplier * GAME_CONSTANTS.ATB_BASE_SPEED;
      char.atbMeter += chargeRate * deltaTime;
      
      // Cap at max and mark as ready
      if (char.atbMeter >= GAME_CONSTANTS.ATB_MAX) {
        char.atbMeter = GAME_CONSTANTS.ATB_MAX;
        readyCharacters.push(char);
      }
    });
    
    return readyCharacters;
  }
  
  static getNextReadyCharacter(heroes, enemies) {
    const allCharacters = [
      ...heroes.map((h, i) => ({ char: h, type: 'hero', index: i })),
      ...enemies.map((e, i) => ({ char: e, type: 'enemy', index: i }))
    ];
    
    // Find character with full ATB meter
    // If multiple are ready, prioritize by highest agility (fastest acts first)
    const ready = allCharacters
      .filter(c => c.char.hp > 0 && c.char.atbMeter >= GAME_CONSTANTS.ATB_MAX)
      .sort((a, b) => b.char.agility - a.char.agility);
    
    return ready.length > 0 ? ready[0] : null;
  }
  
  static resetATB(character) {
    character.atbMeter = 0;
  }
}

// =============================================================================
// MODULE 6: COMBAT SYSTEM
// =============================================================================
class CombatSystem {
  static initialize(heroTemplates, enemyTemplates) {
    return {
      phase: 'CHARGING',
      activeCharacter: null,
      
      heroes: heroTemplates.map(h => ({
        ...h,
        atbMeter: 0,
        statuses: {},
        isDefending: false
      })),
      
      enemies: enemyTemplates.map(e => ({
        ...e,
        hp: e.maxHp,
        atbMeter: Math.random() * GAME_CONSTANTS.ATB_MAX * 0.3, // Stagger start
        statuses: {},
        isDefending: false
      })),
      
      actionQueue: [],
      floatingTexts: [],
      levelUpNotifications: [], // Store level up messages
      traitSelection: null, // {heroIndex, traitOptions: [id1, id2]}
      goldEarned: 0, // Track gold from this battle
      
      ui: {
        menuState: 'closed', // 'main', 'magic', 'item', 'targeting'
        mainCursor: 0,
        subCursor: 0,
        targetCursor: 0,
        selectedAction: null,
        targetType: null
      }
    };
  }
  
  static update(combat) {
    // Update floating texts
    combat.floatingTexts = combat.floatingTexts
      .map(t => ({ ...t, y: t.y - 0.5, duration: t.duration - 1 }))
      .filter(t => t.duration > 0);
    
    // Update level up notifications
    combat.levelUpNotifications = combat.levelUpNotifications
      .map(n => ({ ...n, duration: n.duration - 1 }))
      .filter(n => n.duration > 0);
    
    // Check win/loss
    const livingHeroes = combat.heroes.filter(h => h.hp > 0);
    const livingEnemies = combat.enemies.filter(e => e.hp > 0);
    
    if (livingEnemies.length === 0) return { battleEnd: 'win', goldEarned: combat.goldEarned };
    if (livingHeroes.length === 0) return { battleEnd: 'lose', goldEarned: 0 };
    
    switch (combat.phase) {
      case 'CHARGING':
        return this.updateChargingPhase(combat);
      case 'HERO_INPUT':
        return { phase: 'HERO_INPUT' }; // Input handled separately
      case 'ENEMY_TURN':
        return this.updateEnemyTurn(combat);
      case 'EXECUTING':
        return this.updateExecution(combat);
      default:
        return {};
    }
  }
  
  static updateChargingPhase(combat) {
    // Charge all ATB meters
    const allCharacters = [...combat.heroes, ...combat.enemies];
    ATBSystem.chargeATB(allCharacters);
    
    // Check for ready character
    const ready = ATBSystem.getNextReadyCharacter(combat.heroes, combat.enemies);
    
    if (ready) {
      combat.activeCharacter = ready;
      
      // Check for possession (hero only)
      if (ready.type === 'hero' && ready.char.statuses.possessed) {
        return this.handlePossessedHero(combat, ready);
      }
      
      combat.phase = ready.type === 'hero' ? 'HERO_INPUT' : 'ENEMY_TURN';
      
      if (combat.phase === 'HERO_INPUT') {
        combat.ui.menuState = 'main';
        combat.ui.mainCursor = 0;
      }
    }
    
    return {};
  }
  
  static handlePossessedHero(combat, ready) {
    const hero = ready.char;
    const livingAllies = combat.heroes.filter(h => h.hp > 0 && h !== hero);
    
    if (livingAllies.length > 0) {
      const target = livingAllies[Math.floor(Math.random() * livingAllies.length)];
      const targetIndex = combat.heroes.indexOf(target);
      
      combat.actionQueue.push({
        caster: hero,
        casterIndex: ready.index,
        casterType: 'hero',
        action: 'attack',
        targetIndex,
        targetType: 'ally'
      });
      
      this.addFloatingText(combat, 'POSSESSED!', 'hero', ready.index, '#FF00FF');
    }
    
    ATBSystem.resetATB(hero);
    combat.activeCharacter = null;
    combat.phase = 'EXECUTING';
    
    return {};
  }
  
  static updateEnemyTurn(combat) {
    const enemy = combat.activeCharacter.char;
    const enemyIndex = combat.activeCharacter.index;
    
    // Find weakest hero
    const livingHeroes = combat.heroes.filter(h => h.hp > 0);
    if (livingHeroes.length === 0) return {};
    
    const weakest = livingHeroes.reduce((weak, hero) => {
      const ratio = hero.hp / hero.maxHp;
      const weakRatio = weak.hp / weak.maxHp;
      return ratio < weakRatio ? hero : weak;
    });
    
    const targetIndex = combat.heroes.indexOf(weakest);
    
    // Choose best action
    const template = ENEMY_TEMPLATES.find(t => t.id === enemy.id);
    const bestAction = this.chooseBestEnemyAction(template.actions, enemy, weakest);
    
    combat.actionQueue.push({
      caster: enemy,
      casterIndex: enemyIndex,
      casterType: 'enemy',
      action: bestAction,
      targetIndex,
      targetType: 'ally'
    });
    
    ATBSystem.resetATB(enemy);
    combat.activeCharacter = null;
    combat.phase = 'EXECUTING';
    
    return {};
  }
  
  static chooseBestEnemyAction(actions, enemy, target) {
    let bestAction = actions[0];
    let bestValue = -Infinity;
    
    actions.forEach(actionId => {
      const actionDef = ACTION_DATABASE[actionId];
      if (!actionDef) return;
      
      const result = actionDef.calculate(enemy, target);
      let value = 0;
      
      if (result.damage) value = result.damage;
      else if (result.status === 'poisoned' && !target.statuses.poisoned) {
        value = STATUS_EFFECTS.poisoned.tickDamage * STATUS_EFFECTS.poisoned.duration;
      }
      
      if (value > bestValue) {
        bestValue = value;
        bestAction = actionId;
      }
    });
    
    return bestAction;
  }
  
  static updateExecution(combat) {
    if (combat.actionQueue.length === 0) {
      // All actions executed, tick statuses
      [...combat.heroes, ...combat.enemies].forEach((char, i) => {
        const type = i < combat.heroes.length ? 'hero' : 'enemy';
        const index = type === 'hero' ? i : i - combat.heroes.length;
        this.tickStatuses(combat, char, type, index);
      });
      
      combat.phase = 'CHARGING';
      return {};
    }
    
    // Execute next action
    const actionData = combat.actionQueue.shift();
    this.executeAction(combat, actionData);
    
    return {};
  }
  
  static executeAction(combat, actionData) {
    const { caster, casterIndex, casterType, action, targetIndex, targetType } = actionData;
    
    // Check if it's a skill
    let actionDef = ACTION_DATABASE[action] || SKILL_DATABASE[action];
    
    if (!actionDef) return;
    
    const targetList = targetType === 'ally' ? combat.heroes : combat.enemies;
    const target = targetList[targetIndex];
    
    if (!target || target.hp <= 0) return;
    
    // Check mana cost
    if (actionDef.manaCost > 0) {
      if (caster.mp < actionDef.manaCost) {
        this.addFloatingText(combat, 'NO MP', casterType, casterIndex, '#808080');
        return;
      }
      caster.mp -= actionDef.manaCost;
    }
    
    // Consume item if it's consumable
    if (actionDef.consumable && casterType === 'hero') {
      // Note: Inventory consumption would happen here
      // For now, we'll allow unlimited use in battle
    }
    
    // Calculate effect
    const result = actionDef.calculate(caster, target);
    const targetWasAlive = target.hp > 0;
    
    // Apply effect
    if (result.damage !== undefined) {
      // Apply damage reduction from traits
      let finalDamage = result.damage;
      if (target.damageReduction) {
        finalDamage = Math.floor(finalDamage * (1 - target.damageReduction));
      }
      
      target.hp -= finalDamage;
      target.hp = Math.max(0, target.hp);
      this.addFloatingText(combat, finalDamage, targetType, targetIndex, '#FF0000');
      
      // Life steal trait or skill
      const lifeStealPercent = result.lifeSteal || caster.lifeStealPercent;
      if (lifeStealPercent && casterType === 'hero') {
        const healAmount = Math.floor(finalDamage * lifeStealPercent);
        caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
        this.addFloatingText(combat, `+${healAmount}`, casterType, casterIndex, '#32CD32');
      }
      
      // Heal self from skill
      if (result.healSelf) {
        caster.hp = Math.min(caster.maxHp, caster.hp + result.healSelf);
        this.addFloatingText(combat, `+${result.healSelf}`, casterType, casterIndex, '#32CD32');
      }
      
      // AWARD XP AND GOLD FOR HITTING (only heroes gain XP)
      if (casterType === 'hero' && targetType === 'enemy' && finalDamage > 0) {
        const xpGained = GAME_CONSTANTS.XP_PER_HIT;
        const isKillingBlow = targetWasAlive && target.hp === 0;
        const finalXP = isKillingBlow ? xpGained * GAME_CONSTANTS.XP_KILL_MULTIPLIER : xpGained;
        
        // Award gold on kill
        if (isKillingBlow && target.goldDrop) {
          const goldMultiplier = GAME_CONSTANTS.GOLD_MULTIPLIER_RANGE[0] + 
            Math.random() * (GAME_CONSTANTS.GOLD_MULTIPLIER_RANGE[1] - GAME_CONSTANTS.GOLD_MULTIPLIER_RANGE[0]);
          const goldAmount = Math.floor(target.goldDrop * goldMultiplier);
          combat.goldEarned += goldAmount;
          this.addFloatingText(combat, `+${goldAmount}G`, targetType, targetIndex, '#FFD700');
        }
        
        // Award XP and check for level up
        const levelUps = XPSystem.awardXP(caster, finalXP);
        
        // Show XP gain
        this.addFloatingText(combat, `+${finalXP}XP`, casterType, casterIndex, '#FFD700');
        
        // Handle level ups with trait selection
        levelUps.forEach(levelUp => {
          combat.levelUpNotifications.push({
            heroName: levelUp.hero.name,
            level: levelUp.level,
            duration: 180 // 3 seconds
          });
          
          // If there are trait options, pause for selection
          if (levelUp.traitOptions && levelUp.traitOptions.length >= 2) {
            combat.traitSelection = {
              heroIndex: casterIndex,
              hero: caster,
              traitOptions: levelUp.traitOptions,
              cursor: 0
            };
            combat.phase = 'TRAIT_SELECTION';
          } else if (levelUp.traitOptions && levelUp.traitOptions.length === 1) {
            // Auto-select if only one option
            XPSystem.learnTrait(caster, levelUp.traitOptions[0]);
            console.log(`${caster.name} auto-learned ${TRAIT_DATABASE[levelUp.traitOptions[0]].name} (only option)`);
          }
          
          console.log(`🎉 ${levelUp.hero.name} reached level ${levelUp.level}!`);
        });
      }
    }
    
    if (result.heal !== undefined) {
      target.hp += result.heal;
      target.hp = Math.min(target.maxHp, target.hp);
      this.addFloatingText(combat, result.heal, targetType, targetIndex, '#32CD32');
    }
    
    if (result.restoreMp !== undefined) {
      target.mp += result.restoreMp;
      target.mp = Math.min(target.maxMp, target.mp);
      this.addFloatingText(combat, `+${result.restoreMp}MP`, targetType, targetIndex, '#3B82F6');
    }
    
    if (result.status) {
      if (!target.statuses[result.status]) {
        const statusDef = STATUS_EFFECTS[result.status];
        target.statuses[result.status] = { duration: statusDef.duration };
        this.addFloatingText(combat, statusDef.symbol, targetType, targetIndex, statusDef.color);
      } else {
        this.addFloatingText(combat, 'Resist', targetType, targetIndex, '#AAAAAA');
      }
    }
    
    if (result.defend) {
      caster.isDefending = true;
      this.addFloatingText(combat, 'DEFEND', casterType, casterIndex, '#FFFFFF');
    }
    
    // Clear defending status on targets that got hit
    if (result.damage && target.isDefending) {
      target.isDefending = false;
    }
  }
  
  static tickStatuses(combat, char, type, index) {
    if (char.hp <= 0) return;
    
    Object.keys(char.statuses).forEach(statusName => {
      const statusDef = STATUS_EFFECTS[statusName];
      const statusData = char.statuses[statusName];
      
      // Apply tick effect
      if (statusDef.onTick) {
        const result = statusDef.onTick(char);
        if (result) {
          char.hp = Math.max(0, char.hp);
          this.addFloatingText(combat, result.value, type, index, statusDef.color);
        }
      }
      
      // Decay duration
      statusData.duration--;
      if (statusData.duration <= 0) {
        delete char.statuses[statusName];
        this.addFloatingText(combat, statusDef.symbol + ' OUT', type, index, '#FFFFFF');
      }
    });
  }
  
  static addFloatingText(combat, text, targetType, targetIndex, color) {
    const isHero = targetType === 'hero' || targetType === 'ally';
    const x = isHero ? GAME_CONSTANTS.TILE_SIZE * 4 : GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.TILE_SIZE * 3;
    const baseY = isHero 
      ? GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.TILE_SIZE * 7 - (targetIndex * GAME_CONSTANTS.TILE_SIZE * 2.5)
      : (GAME_CONSTANTS.CANVAS_HEIGHT / 2 - GAME_CONSTANTS.TILE_SIZE * 4) + (targetIndex * GAME_CONSTANTS.TILE_SIZE * 2);
    
    combat.floatingTexts.push({
      text: String(text),
      x: x + GAME_CONSTANTS.TILE_SIZE / 2,
      y: baseY - 5,
      duration: 60,
      color
    });
  }
  
  static queueHeroAction(combat, actionId, targetIndex) {
    const hero = combat.activeCharacter.char;
    const heroIndex = combat.activeCharacter.index;
    const actionDef = ACTION_DATABASE[actionId];
    
    combat.actionQueue.push({
      caster: hero,
      casterIndex: heroIndex,
      casterType: 'hero',
      action: actionId,
      targetIndex,
      targetType: actionDef.targetType === 'enemy' ? 'enemy' : 'ally'
    });
    
    ATBSystem.resetATB(hero);
    combat.activeCharacter = null;
    combat.phase = 'EXECUTING';
    combat.ui.menuState = 'closed';
  }
}

// =============================================================================
// MODULE 5: INPUT MANAGER
// =============================================================================
class InputManager {
  constructor() {
    this.keys = {};
    this.pressed = {};
    this.setupListeners();
  }
  
  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (!this.keys[key] || key === 'escape') {
        this.pressed[key] = true;
      }
      this.keys[key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }
  
  isPressed(key) {
    if (this.pressed[key]) {
      this.pressed[key] = false;
      return true;
    }
    return false;
  }
  
  isDown(key) {
    return this.keys[key] === true;
  }
  
  clearPressed() {
    this.pressed = {};
  }
}

// =============================================================================
// MODULE 7: TITLE SCREEN CONTROLLER
// =============================================================================
class TitleScreenController {
  static handleInput(state, input) {
    if (!state.titleScreen) {
      state.titleScreen = {
        mode: 'main', // 'main', 'load', 'newgame'
        cursor: 0
      };
    }
    
    const { titleScreen } = state;
    
    if (titleScreen.mode === 'main') {
      const options = ['New Game', 'Load Game', 'Continue'];
      
      if (input.isPressed('arrowup') || input.isPressed('w')) {
        titleScreen.cursor = Math.max(0, titleScreen.cursor - 1);
      } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
        titleScreen.cursor = Math.min(options.length - 1, titleScreen.cursor + 1);
      } else if (input.isPressed('enter')) {
        if (titleScreen.cursor === 0) {
          // New Game
          titleScreen.mode = 'newgame';
          titleScreen.cursor = 0;
        } else if (titleScreen.cursor === 1) {
          // Load Game
          titleScreen.mode = 'load';
          titleScreen.cursor = 0;
        } else if (titleScreen.cursor === 2) {
          // Continue (load slot 1)
          return { action: 'continue' };
        }
      }
    } else if (titleScreen.mode === 'load') {
      if (input.isPressed('arrowup') || input.isPressed('w')) {
        titleScreen.cursor = Math.max(0, titleScreen.cursor - 1);
      } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
        titleScreen.cursor = Math.min(GAME_CONSTANTS.MAX_SAVE_SLOTS - 1, titleScreen.cursor + 1);
      } else if (input.isPressed('enter')) {
        return { action: 'load', slot: titleScreen.cursor + 1 };
      } else if (input.isPressed('escape')) {
        titleScreen.mode = 'main';
        titleScreen.cursor = 0;
      }
    } else if (titleScreen.mode === 'newgame') {
      if (input.isPressed('arrowup') || input.isPressed('w')) {
        titleScreen.cursor = Math.max(0, titleScreen.cursor - 1);
      } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
        titleScreen.cursor = Math.min(GAME_CONSTANTS.MAX_SAVE_SLOTS - 1, titleScreen.cursor + 1);
      } else if (input.isPressed('enter')) {
        return { action: 'newgame', slot: titleScreen.cursor + 1 };
      } else if (input.isPressed('escape')) {
        titleScreen.mode = 'main';
        titleScreen.cursor = 0;
      }
    }
    
    return {};
  }
}

// =============================================================================
// MODULE 8: WORLD MAP CONTROLLER
// =============================================================================
class WorldMapController {
  static update(state, input, gameStateManager) {
    const { player, map, camera } = state.worldMap;
    
    // Settings menu (ESC key)
    if (input.isPressed('escape')) {
      state.scene = 'SETTINGS';
      if (!state.settings) {
        state.settings = {
          cursor: 0,
          scale: state.gameScale || GAME_CONSTANTS.DEFAULT_SCALE
        };
      }
      return {};
    }
    
    // Quick save (F5 key)
    if (input.isPressed('f5')) {
      const saved = SaveSystem.saveGame(state, 1);
      if (saved) {
        state.saveMessage = {
          text: 'Quick Saved!',
          duration: 120
        };
      }
      return {};
    }
    
    // Inventory toggle
    if (input.isPressed('i')) {
      state.scene = 'INVENTORY';
      state.inventoryMenu = {
        cursor: 0,
        category: 'items' // 'items', 'equipment'
      };
      return {};
    }
    
    // Party menu toggle
    if (input.isPressed('p')) {
      state.scene = 'PARTY_MENU';
      state.partyMenu = {
        cursor: 0,
        mode: 'view', // 'view' or 'detail'
        detailCategory: null, // 'stats', 'equipment', 'spells', 'skills'
        detailCursor: 0
      };
      return {};
    }
    
    let moved = false;
    let newX = player.x;
    let newY = player.y;
    
    if (input.isDown('arrowup') || input.isDown('w')) { newY -= player.speed; moved = true; }
    if (input.isDown('arrowdown') || input.isDown('s')) { newY += player.speed; moved = true; }
    if (input.isDown('arrowleft') || input.isDown('a')) { newX -= player.speed; moved = true; }
    if (input.isDown('arrowright') || input.isDown('d')) { newX += player.speed; moved = true; }
    
    if (moved) {
      const worldPixelWidth = GAME_CONSTANTS.WORLD_WIDTH * GAME_CONSTANTS.TILE_SIZE;
      const worldPixelHeight = GAME_CONSTANTS.WORLD_HEIGHT * GAME_CONSTANTS.TILE_SIZE;
      
      // Validate movement
      if (this.isValidMove(newX, player.y, map)) player.x = newX;
      if (this.isValidMove(player.x, newY, map)) player.y = newY;
      
      // Clamp to world bounds
      player.x = Math.max(0, Math.min(worldPixelWidth - GAME_CONSTANTS.TILE_SIZE, player.x));
      player.y = Math.max(0, Math.min(worldPixelHeight - GAME_CONSTANTS.TILE_SIZE, player.y));
      
      // Update camera
      gameStateManager.updateCamera();
      
      // Animation
      player.frameCounter++;
      if (player.frameCounter >= GAME_CONSTANTS.ANIMATION_SPEED) {
        player.animationFrame = (player.animationFrame + 1) % 3;
        player.frameCounter = 0;
      }
      
      // Check for location entry (town/dungeon/spire)
      const location = this.checkLocationEntry(state);
      if (location) {
        return { enterLocation: location };
      }
      
      // Random encounter check (only on walkable terrain, not in locations)
      const currentTile = this.getTileAtPosition(player.x, player.y, map);
      if (currentTile !== 5 && currentTile !== 6 && currentTile !== 7) { // Not town/dungeon/spire
        if (Math.random() < GAME_CONSTANTS.ENCOUNTER_CHANCE) {
          return { encounter: true };
        }
      }
    } else {
      player.animationFrame = 0;
      player.frameCounter = 0;
    }
    
    // Update save message timer
    if (state.saveMessage) {
      state.saveMessage.duration--;
      if (state.saveMessage.duration <= 0) {
        state.saveMessage = null;
      }
    }
    
    return {};
  }
  
  static getTileAtPosition(px, py, map) {
    const col = Math.floor(px / GAME_CONSTANTS.TILE_SIZE);
    const row = Math.floor(py / GAME_CONSTANTS.TILE_SIZE);
    
    if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
      return -1;
    }
    
    return map[row][col];
  }
  
  static isValidMove(x, y, map) {
    const tileId = this.getTileAtPosition(x, y, map);
    if (tileId === -1) return false;
    
    const tileType = Object.values(TILE_TYPES).find(t => t.id === tileId);
    return tileType && tileType.walkable;
  }
  
  static checkLocationEntry(state) {
    const { player } = state.worldMap;
    const { locations } = state.worldMap;
    
    // Check if player is inside any location bounds
    const playerTileX = Math.floor(player.x / GAME_CONSTANTS.TILE_SIZE);
    const playerTileY = Math.floor(player.y / GAME_CONSTANTS.TILE_SIZE);
    
    for (const loc of locations) {
      if (playerTileX >= loc.x && playerTileX < loc.x + loc.width &&
          playerTileY >= loc.y && playerTileY < loc.y + loc.height) {
        return loc;
      }
    }
    
    return null;
  }
}

// =============================================================================
// MODULE 9: PARTY MENU CONTROLLER
// =============================================================================
class PartyMenuController {
  static handleInput(state, input) {
    const { partyMenu, roster } = state;
    
    if (input.isPressed('escape') || input.isPressed('p')) {
      if (partyMenu.mode === 'detail') {
        partyMenu.mode = 'view';
        partyMenu.detailCategory = null;
      } else {
        state.scene = 'WORLD_MAP';
      }
      return;
    }
    
    if (partyMenu.mode === 'view') {
      // Navigate through all heroes
      if (input.isPressed('arrowup') || input.isPressed('w')) {
        partyMenu.cursor = Math.max(0, partyMenu.cursor - 1);
      } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
        partyMenu.cursor = Math.min(roster.allHeroes.length - 1, partyMenu.cursor + 1);
      } else if (input.isPressed('arrowright') || input.isPressed('d')) {
        // Toggle hero in/out of active party
        const heroIndex = partyMenu.cursor;
        const isInParty = roster.activeParty.includes(heroIndex);
        
        if (isInParty) {
          // Remove from party (if more than 1 hero)
          if (roster.activeParty.length > 1) {
            roster.activeParty = roster.activeParty.filter(i => i !== heroIndex);
          }
        } else {
          // Add to party (if less than 3)
          if (roster.activeParty.length < 3) {
            roster.activeParty.push(heroIndex);
          }
        }
      } else if (input.isPressed('enter')) {
        // Open detail view
        partyMenu.mode = 'detail';
        partyMenu.detailCategory = 'stats';
        partyMenu.detailCursor = 0;
      }
    } else if (partyMenu.mode === 'detail') {
      const categories = ['stats', 'equipment', 'spells', 'skills'];
      
      if (input.isPressed('arrowleft') || input.isPressed('a')) {
        const currentIndex = categories.indexOf(partyMenu.detailCategory);
        partyMenu.detailCategory = categories[Math.max(0, currentIndex - 1)];
      } else if (input.isPressed('arrowright') || input.isPressed('d')) {
        const currentIndex = categories.indexOf(partyMenu.detailCategory);
        partyMenu.detailCategory = categories[Math.min(categories.length - 1, currentIndex + 1)];
      }
    }
  }
}

// =============================================================================
// MODULE 10: SETTINGS MENU CONTROLLER
// =============================================================================
class SettingsMenuController {
  static handleInput(state, input, onScaleChange) {
    const { settings } = state;
    
    if (input.isPressed('escape')) {
      state.scene = 'WORLD_MAP';
      return;
    }
    
    const options = ['Scale', 'Save Game', 'Return to Title', 'Resume'];
    
    if (input.isPressed('arrowup') || input.isPressed('w')) {
      settings.cursor = Math.max(0, settings.cursor - 1);
    } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
      settings.cursor = Math.min(options.length - 1, settings.cursor + 1);
    } else if (input.isPressed('arrowleft') || input.isPressed('a')) {
      if (settings.cursor === 0) { // Scale option
        const currentIndex = GAME_CONSTANTS.SCALE_OPTIONS.indexOf(settings.scale);
        const newIndex = Math.max(0, currentIndex - 1);
        settings.scale = GAME_CONSTANTS.SCALE_OPTIONS[newIndex];
        state.gameScale = settings.scale;
        if (onScaleChange) onScaleChange(settings.scale);
      }
    } else if (input.isPressed('arrowright') || input.isPressed('d')) {
      if (settings.cursor === 0) { // Scale option
        const currentIndex = GAME_CONSTANTS.SCALE_OPTIONS.indexOf(settings.scale);
        const newIndex = Math.min(GAME_CONSTANTS.SCALE_OPTIONS.length - 1, currentIndex + 1);
        settings.scale = GAME_CONSTANTS.SCALE_OPTIONS[newIndex];
        state.gameScale = settings.scale;
        if (onScaleChange) onScaleChange(settings.scale);
      }
    } else if (input.isPressed('enter')) {
      if (settings.cursor === 1) {
        // Save Game
        const saved = SaveSystem.saveGame(state, 1);
        if (saved) {
          state.saveMessage = { text: 'Game Saved!', duration: 120 };
        }
      } else if (settings.cursor === 2) {
        // Return to Title
        state.scene = 'TITLE_SCREEN';
      } else if (settings.cursor === 3) {
        // Resume
        state.scene = 'WORLD_MAP';
      }
    }
  }
}

// =============================================================================
// MODULE 11: INVENTORY CONTROLLER
// =============================================================================
class InventoryController {
  static handleInput(state, input) {
    const { inventoryMenu } = state;
    
    if (input.isPressed('escape') || input.isPressed('i')) {
      state.scene = 'WORLD_MAP';
      return;
    }
    
    if (input.isPressed('arrowleft') || input.isPressed('a')) {
      inventoryMenu.category = 'items';
    } else if (input.isPressed('arrowright') || input.isPressed('d')) {
      inventoryMenu.category = 'equipment';
    }
    
    // Navigate items
    const itemList = inventoryMenu.category === 'items' 
      ? Object.keys(state.inventory.items)
      : state.inventory.equipment;
    
    if (input.isPressed('arrowup') || input.isPressed('w')) {
      inventoryMenu.cursor = Math.max(0, inventoryMenu.cursor - 1);
    } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
      inventoryMenu.cursor = Math.min(Math.max(0, itemList.length - 1), inventoryMenu.cursor + 1);
    }
  }
}

// =============================================================================
// MODULE 12: BATTLE INPUT CONTROLLER
// =============================================================================
class BattleInputController {
  static handleInput(combat, input) {
    if (combat.phase === 'TRAIT_SELECTION') {
      return this.handleTraitSelection(combat, input);
    }
    
    if (combat.phase !== 'HERO_INPUT') return;
    
    const { ui } = combat;
    
    switch (ui.menuState) {
      case 'main':
        return this.handleMainMenu(combat, input);
      case 'skills':
      case 'magic':
      case 'item':
        return this.handleSubMenu(combat, input);
      case 'targeting':
        return this.handleTargeting(combat, input);
    }
  }
  
  static handleTraitSelection(combat, input) {
    const selection = combat.traitSelection;
    
    // Safety check
    if (!selection || !selection.traitOptions || selection.traitOptions.length === 0) {
      console.error('Invalid trait selection state!');
      combat.traitSelection = null;
      combat.phase = combat.actionQueue.length > 0 ? 'EXECUTING' : 'CHARGING';
      return;
    }
    
    if (input.isPressed('arrowleft') || input.isPressed('a')) {
      selection.cursor = Math.max(0, selection.cursor - 1);
    } else if (input.isPressed('arrowright') || input.isPressed('d')) {
      selection.cursor = Math.min(selection.traitOptions.length - 1, selection.cursor + 1);
    } else if (input.isPressed('enter')) {
      const chosenTraitId = selection.traitOptions[selection.cursor];
      
      if (!chosenTraitId || !TRAIT_DATABASE[chosenTraitId]) {
        console.error(`Invalid trait selected: ${chosenTraitId}`);
        combat.traitSelection = null;
        combat.phase = combat.actionQueue.length > 0 ? 'EXECUTING' : 'CHARGING';
        return;
      }
      
      XPSystem.learnTrait(selection.hero, chosenTraitId);
      
      console.log(`${selection.hero.name} learned ${TRAIT_DATABASE[chosenTraitId].name}!`);
      
      // Clear selection and resume combat
      combat.traitSelection = null;
      combat.phase = combat.actionQueue.length > 0 ? 'EXECUTING' : 'CHARGING';
    }
  }
  
  static handleMainMenu(combat, input) {
    const { ui } = combat;
    const options = MENU_OPTIONS.main;
    
    if (input.isPressed('arrowup') || input.isPressed('w')) {
      ui.mainCursor = Math.max(0, ui.mainCursor - 1);
    } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
      ui.mainCursor = Math.min(options.length - 1, ui.mainCursor + 1);
    } else if (input.isPressed('enter')) {
      const selected = options[ui.mainCursor];
      
      if (selected === 'Magic') {
        ui.menuState = 'magic';
        ui.subCursor = 0;
      } else if (selected === 'Item') {
        ui.menuState = 'item';
        ui.subCursor = 0;
      } else if (selected === 'Attack') {
        ui.selectedAction = 'attack';
        ui.targetType = 'enemy';
        ui.menuState = 'targeting';
        ui.targetCursor = 0;
      } else if (selected === 'Defend') {
        const heroIndex = combat.activeCharacter.index;
        CombatSystem.queueHeroAction(combat, 'defend', heroIndex);
      }
    }
  }
  
  static handleSubMenu(combat, input) {
    const { ui } = combat;
    const options = ui.menuState === 'magic' ? MENU_OPTIONS.magic : MENU_OPTIONS.item;
    
    if (input.isPressed('arrowup') || input.isPressed('w')) {
      ui.subCursor = Math.max(0, ui.subCursor - 1);
    } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
      ui.subCursor = Math.min(options.length - 1, ui.subCursor + 1);
    } else if (input.isPressed('escape')) {
      ui.menuState = 'main';
    } else if (input.isPressed('enter')) {
      const actionId = options[ui.subCursor];
      const actionDef = ACTION_DATABASE[actionId];
      
      ui.selectedAction = actionId;
      ui.targetType = actionDef.targetType;
      ui.menuState = 'targeting';
      ui.targetCursor = 0;
    }
  }
  
  static handleTargeting(combat, input) {
    const { ui } = combat;
    const targetList = ui.targetType === 'enemy' 
      ? combat.enemies.filter(e => e.hp > 0)
      : combat.heroes.filter(h => h.hp > 0);
    
    if (input.isPressed('arrowup') || input.isPressed('w')) {
      ui.targetCursor = Math.max(0, ui.targetCursor - 1);
    } else if (input.isPressed('arrowdown') || input.isPressed('s')) {
      ui.targetCursor = Math.min(targetList.length - 1, ui.targetCursor + 1);
    } else if (input.isPressed('escape')) {
      ui.menuState = ui.selectedAction === 'attack' ? 'main' : 
                     (ui.subMenuActions && ui.subMenuActions[0] && SKILL_DATABASE[ui.subMenuActions[0]]) ? 'skills' :
                     (ui.subMenuActions && ui.subMenuActions[0] && ACTION_DATABASE[ui.subMenuActions[0]]?.type === 'item') ? 'item' : 'magic';
    } else if (input.isPressed('enter')) {
      const targetChar = targetList[ui.targetCursor];
      const fullList = ui.targetType === 'enemy' ? combat.enemies : combat.heroes;
      const targetIndex = fullList.indexOf(targetChar);
      
      CombatSystem.queueHeroAction(combat, ui.selectedAction, targetIndex);
    }
  }
}

// =============================================================================
// MODULE 13: RENDERER
// =============================================================================
class Renderer {
  static drawTitleScreen(ctx, state) {
    const { titleScreen } = state;
    
    if (!titleScreen) return;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = '#9333EA';
    ctx.font = '24px monospace';
    ctx.fillText('MISTHEART SPIRE', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 130, 50);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    ctx.fillText('A Dark Fantasy RPG', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 75, 70);
    
    if (titleScreen.mode === 'main') {
      const options = ['New Game', 'Load Game', 'Continue'];
      const startY = 120;
      
      options.forEach((option, i) => {
        const y = startY + (i * 20);
        
        if (i === titleScreen.cursor) {
          ctx.fillStyle = '#FACC15';
          ctx.fillText('>', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 60, y);
        }
        
        ctx.fillStyle = i === titleScreen.cursor ? '#FACC15' : '#FFFFFF';
        ctx.fillText(option, GAME_CONSTANTS.CANVAS_WIDTH / 2 - 50, y);
      });
      
      // Instructions
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '8px monospace';
      ctx.fillText('Arrow Keys: Navigate | Enter: Select', 20, GAME_CONSTANTS.CANVAS_HEIGHT - 20);
    } else if (titleScreen.mode === 'load' || titleScreen.mode === 'newgame') {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px monospace';
      const title = titleScreen.mode === 'load' ? 'Load Game' : 'Select Save Slot';
      ctx.fillText(title, GAME_CONSTANTS.CANVAS_WIDTH / 2 - 50, 80);
      
      const saveSlots = SaveSystem.getAllSaveSlots();
      const startY = 100;
      
      saveSlots.forEach((slot, i) => {
        const y = startY + (i * 30);
        
        if (i === titleScreen.cursor) {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
          ctx.fillRect(20, y - 12, GAME_CONSTANTS.CANVAS_WIDTH - 40, 28);
        }
        
        ctx.fillStyle = i === titleScreen.cursor ? '#FACC15' : '#FFFFFF';
        ctx.font = '10px monospace';
        
        if (slot) {
          const date = new Date(slot.timestamp);
          const timeStr = date.toLocaleString();
          
          ctx.fillText(`Slot ${i + 1}:`, 25, y);
          ctx.font = '8px monospace';
          ctx.fillStyle = '#AAAAAA';
          ctx.fillText(`Gold: ${slot.gold} | ${slot.activeParty.map(p => p.name).join(', ')}`, 25, y + 10);
          ctx.fillText(timeStr, 25, y + 18);
        } else {
          ctx.fillText(`Slot ${i + 1}: [Empty]`, 25, y);
        }
      });
      
      // Instructions
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '8px monospace';
      ctx.fillText('Arrow Keys: Navigate | Enter: Select | Esc: Back', 20, GAME_CONSTANTS.CANVAS_HEIGHT - 20);
    }
  }
  
  static drawSettings(ctx, state) {
    const { settings } = state;
    
    // Semi-transparent background
    ctx.fillStyle = 'rgba(26, 26, 46, 0.95)';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px monospace';
    ctx.fillText('SETTINGS', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 40, 30);
    
    const options = ['Scale', 'Save Game', 'Return to Title', 'Resume'];
    const startY = 70;
    
    options.forEach((option, i) => {
      const y = startY + (i * 30);
      const isCursor = i === settings.cursor;
      
      if (isCursor) {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
        ctx.fillRect(30, y - 15, GAME_CONSTANTS.CANVAS_WIDTH - 60, 25);
      }
      
      ctx.fillStyle = isCursor ? '#FACC15' : '#FFFFFF';
      ctx.font = '12px monospace';
      
      if (option === 'Scale') {
        const resolution = `${GAME_CONSTANTS.CANVAS_WIDTH * settings.scale}x${GAME_CONSTANTS.CANVAS_HEIGHT * settings.scale}`;
        ctx.fillText(`${option}: < ${resolution} >`, 40, y);
      } else {
        ctx.fillText(option, 40, y);
      }
    });
    
    // Instructions
    ctx.fillStyle = '#AAAAAA';
    ctx.font = '10px monospace';
    ctx.fillText('Arrow Keys: Navigate | Enter: Select | Esc: Resume', 30, GAME_CONSTANTS.CANVAS_HEIGHT - 20);
    ctx.fillText('F5: Quick Save', 30, GAME_CONSTANTS.CANVAS_HEIGHT - 35);
  }
  
  static drawPartyMenu(ctx, state) {
    const { roster, partyMenu } = state;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    if (partyMenu.mode === 'view') {
      // Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px monospace';
      ctx.fillText('PARTY ROSTER', 10, 15);
      ctx.font = '8px monospace';
      ctx.fillText('Enter: Details | Right: Toggle Party | P: Close', 10, 25);
      
      // Draw all heroes
      roster.allHeroes.forEach((hero, i) => {
        const y = 35 + (i * 25);
        const isActive = roster.activeParty.includes(i);
        const isCursor = partyMenu.cursor === i;
        
        // Selection box
        if (isCursor) {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
          ctx.fillRect(5, y - 12, GAME_CONSTANTS.CANVAS_WIDTH - 10, 23);
        }
        
        // Hero color indicator
        ctx.fillStyle = hero.color;
        ctx.fillRect(8, y - 8, 8, 8);
        
        // Name and class
        ctx.fillStyle = isActive ? '#FACC15' : '#FFFFFF';
        ctx.font = '8px monospace';
        ctx.fillText(`${hero.name} - ${hero.class} Lv.${hero.level}`, 20, y);
        
        // Status badge
        if (isActive) {
          ctx.fillStyle = '#10B981';
          ctx.fillText('[ACTIVE]', 120, y);
        }
        
        // Stats
        ctx.fillStyle = '#AAAAAA';
        ctx.font = '7px monospace';
        ctx.fillText(`HP:${Math.floor(hero.hp)}/${hero.maxHp} MP:${Math.floor(hero.mp)}/${hero.maxMp}`, 20, y + 8);
        ctx.fillText(`AGI:${hero.agility} STR:${hero.strength}`, 150, y + 8);
        
        // XP bar
        ctx.fillStyle = '#333333';
        ctx.fillRect(20, y + 12, 80, 3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(20, y + 12, 80 * (hero.xp / hero.xpToNext), 3);
        ctx.fillStyle = '#AAAAAA';
        ctx.fillText(`XP: ${hero.xp}/${hero.xpToNext}`, 105, y + 14);
      });
      
      // Instructions
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px monospace';
      const instructionY = GAME_CONSTANTS.CANVAS_HEIGHT - 15;
      ctx.fillText(`Active party: ${roster.activeParty.length}/3`, 10, instructionY);
    } else if (partyMenu.mode === 'detail') {
      this.drawHeroDetail(ctx, state);
    }
  }
  
  static drawHeroDetail(ctx, state) {
    const { roster, partyMenu } = state;
    const hero = roster.allHeroes[partyMenu.cursor];
    
    if (!hero) return; // Safety check
    
    const categories = ['stats', 'equipment', 'spells', 'skills'];
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // Header
    ctx.fillStyle = hero.color;
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    ctx.fillText(`${hero.name} - ${hero.class} Lv.${hero.level}`, 10, 18);
    
    // Category tabs
    categories.forEach((cat, i) => {
      const x = 10 + (i * 60);
      const isSelected = cat === partyMenu.detailCategory;
      
      ctx.fillStyle = isSelected ? '#7969a5' : '#333333';
      ctx.fillRect(x, 35, 55, 20);
      ctx.strokeStyle = isSelected ? '#FACC15' : '#666666';
      ctx.strokeRect(x, 35, 55, 20);
      
      ctx.fillStyle = isSelected ? '#FACC15' : '#AAAAAA';
      ctx.font = '8px monospace';
      ctx.fillText(cat.toUpperCase(), x + 5, 48);
    });
    
    // Content area
    const contentY = 60;
    ctx.font = '8px monospace';
    
    if (partyMenu.detailCategory === 'stats') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`HP: ${Math.floor(hero.hp)} / ${hero.maxHp}`, 10, contentY + 10);
      ctx.fillText(`MP: ${Math.floor(hero.mp)} / ${hero.maxMp}`, 10, contentY + 20);
      ctx.fillText(`Strength: ${hero.strength}`, 10, contentY + 35);
      ctx.fillText(`Agility: ${hero.agility}`, 10, contentY + 45);
      ctx.fillText(`Endurance: ${hero.endurance}`, 10, contentY + 55);
      ctx.fillText(`XP: ${hero.xp} / ${hero.xpToNext}`, 10, contentY + 70);
      
      // Traits
      ctx.fillText('Traits:', 10, contentY + 85);
      if (hero.traits && hero.traits.length > 0) {
        hero.traits.forEach((traitId, i) => {
          const trait = TRAIT_DATABASE[traitId];
          if (trait) {
            ctx.fillStyle = '#9333EA';
            ctx.fillText(`• ${trait.name}`, 15, contentY + 95 + (i * 10));
          }
        });
      } else {
        ctx.fillStyle = '#666666';
        ctx.fillText('None learned', 15, contentY + 95);
      }
    } else if (partyMenu.detailCategory === 'equipment') {
      ctx.fillStyle = '#FFFFFF';
      
      // Ensure equipment object exists
      if (!hero.equipment) {
        hero.equipment = { weapon: null, armor: null, accessory: null };
      }
      
      EQUIPMENT_SLOTS.forEach((slot, i) => {
        const equipId = hero.equipment[slot];
        const y = contentY + 10 + (i * 25);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${slot.toUpperCase()}:`, 10, y);
        
        if (equipId && EQUIPMENT_DATABASE[equipId]) {
          const equip = EQUIPMENT_DATABASE[equipId];
          ctx.fillStyle = RARITY_COLORS[equip.rarity] || '#FFFFFF';
          ctx.fillText(equip.name, 15, y + 10);
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '7px monospace';
          if (equip.stats) {
            const statsStr = Object.entries(equip.stats).map(([k, v]) => `${k}+${v}`).join(' ');
            ctx.fillText(statsStr, 15, y + 18);
          }
          ctx.font = '8px monospace';
        } else {
          ctx.fillStyle = '#666666';
          ctx.fillText('[Empty]', 15, y + 10);
        }
      });
    } else if (partyMenu.detailCategory === 'spells') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Magic Spells:', 10, contentY + 10);
      
      const spells = MENU_OPTIONS.magic;
      spells.forEach((spellId, i) => {
        const spell = ACTION_DATABASE[spellId];
        if (spell) {
          ctx.fillStyle = '#3B82F6';
          ctx.fillText(`• ${spell.name} (${spell.manaCost}MP)`, 15, contentY + 20 + (i * 10));
        }
      });
    } else if (partyMenu.detailCategory === 'skills') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Class Skills:', 10, contentY + 10);
      
      if (hero.skills && hero.skills.length > 0) {
        hero.skills.forEach((skillId, i) => {
          const skill = SKILL_DATABASE[skillId];
          if (skill) {
            ctx.fillStyle = '#10B981';
            ctx.fillText(`• ${skill.name} (${skill.manaCost}MP)`, 15, contentY + 20 + (i * 10));
            ctx.fillStyle = '#AAAAAA';
            ctx.font = '7px monospace';
            ctx.fillText(skill.description, 20, contentY + 28 + (i * 10));
            ctx.font = '8px monospace';
          }
        });
      } else {
        ctx.fillStyle = '#666666';
        ctx.fillText('No skills unlocked yet', 15, contentY + 20);
        ctx.fillText('Level up to unlock class skills!', 15, contentY + 30);
      }
    }
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px monospace';
    ctx.fillText('Arrow Keys: Switch Tab | Esc: Back', 10, GAME_CONSTANTS.CANVAS_HEIGHT - 10);
  }
  
  static drawInventory(ctx, state) {
    const { inventory, inventoryMenu } = state;
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px monospace';
    ctx.fillText('INVENTORY', 10, 15);
    ctx.font = '8px monospace';
    ctx.fillText('I: Close | Left/Right: Switch Category', 10, 25);
    
    // Category tabs
    const categories = ['items', 'equipment'];
    categories.forEach((cat, i) => {
      const x = 10 + (i * 120);
      const isSelected = cat === inventoryMenu.category;
      
      ctx.fillStyle = isSelected ? '#7969a5' : '#333333';
      ctx.fillRect(x, 35, 115, 20);
      ctx.strokeStyle = isSelected ? '#FACC15' : '#666666';
      ctx.strokeRect(x, 35, 115, 20);
      
      ctx.fillStyle = isSelected ? '#FACC15' : '#AAAAAA';
      ctx.font = '8px monospace';
      ctx.fillText(cat.toUpperCase(), x + 5, 48);
    });
    
    // Content
    const contentY = 65;
    
    if (inventoryMenu.category === 'items') {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px monospace';
      
      const items = Object.entries(inventory.items);
      if (items.length === 0) {
        ctx.fillStyle = '#666666';
        ctx.fillText('No items', 10, contentY + 10);
      } else {
        items.forEach(([itemId, count], i) => {
          const item = ITEM_DATABASE[itemId];
          const y = contentY + (i * 25);
          const isCursor = i === inventoryMenu.cursor;
          
          if (isCursor) {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
            ctx.fillRect(5, y - 5, GAME_CONSTANTS.CANVAS_WIDTH - 10, 23);
          }
          
          ctx.fillStyle = isCursor ? '#FACC15' : '#FFFFFF';
          ctx.fillText(`${item.name} x${count}`, 10, y + 5);
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '7px monospace';
          ctx.fillText(item.description, 10, y + 13);
          ctx.font = '8px monospace';
        });
      }
    } else if (inventoryMenu.category === 'equipment') {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px monospace';
      
      if (inventory.equipment.length === 0) {
        ctx.fillStyle = '#666666';
        ctx.fillText('No equipment in storage', 10, contentY + 10);
      } else {
        inventory.equipment.forEach((equipId, i) => {
          const equip = EQUIPMENT_DATABASE[equipId];
          const y = contentY + (i * 30);
          const isCursor = i === inventoryMenu.cursor;
          
          if (isCursor) {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
            ctx.fillRect(5, y - 5, GAME_CONSTANTS.CANVAS_WIDTH - 10, 28);
          }
          
          ctx.fillStyle = isCursor ? '#FACC15' : RARITY_COLORS[equip.rarity];
          ctx.fillText(equip.name, 10, y + 5);
          ctx.fillStyle = '#AAAAAA';
          ctx.font = '7px monospace';
          ctx.fillText(equip.description, 10, y + 13);
          const statsStr = Object.entries(equip.stats).map(([k, v]) => `${k}+${v}`).join(', ');
          ctx.fillText(statsStr, 10, y + 21);
          ctx.font = '8px monospace';
        });
      }
    }
    
    // Gold display
    ctx.fillStyle = '#FFD700';
    ctx.font = '10px monospace';
    ctx.fillText(`Gold: ${inventory.gold}`, 10, GAME_CONSTANTS.CANVAS_HEIGHT - 10);
  }
  
  static drawWorldMap(ctx, state) {
    const { map, player, camera, currentBiome, locations } = state.worldMap;
    
    if (!map) return;
    
    // Calculate visible tile range based on camera position
    const startCol = Math.floor(camera.x / GAME_CONSTANTS.TILE_SIZE);
    const startRow = Math.floor(camera.y / GAME_CONSTANTS.TILE_SIZE);
    const endCol = Math.min(startCol + GAME_CONSTANTS.VIEWPORT_TILES_WIDTH + 1, map[0].length);
    const endRow = Math.min(startRow + GAME_CONSTANTS.VIEWPORT_TILES_HEIGHT + 1, map.length);
    
    // Draw visible tiles
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const tileId = map[row][col];
        const x = (col * GAME_CONSTANTS.TILE_SIZE) - camera.x;
        const y = (row * GAME_CONSTANTS.TILE_SIZE) - camera.y;
        
        const tileType = Object.values(TILE_TYPES).find(t => t.id === tileId);
        
        if (tileType) {
          ctx.fillStyle = tileType.color;
          ctx.fillRect(x, y, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
          
          // Add simple texture for variety
          if (tileId === 0) { // Forest
            ctx.fillStyle = '#224B00';
            ctx.fillRect(x + 2, y + 2, 4, 4);
          } else if (tileId === 2) { // Water
            ctx.fillStyle = '#5A96F8';
            ctx.fillRect(x, y + 4, GAME_CONSTANTS.TILE_SIZE, 1);
            ctx.fillRect(x, y + 12, GAME_CONSTANTS.TILE_SIZE, 1);
          } else if (tileId === 5) { // Town
            ctx.fillStyle = '#D2691E';
            ctx.fillRect(x + 4, y + 4, 8, 8);
          } else if (tileId === 6) { // Dungeon
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(x + 4, y + 4, 8, 8);
          } else if (tileId === 7) { // Spire
            ctx.fillStyle = '#C084FC';
            ctx.fillRect(x + 6, y + 2, 4, 12);
          }
        }
      }
    }
    
    // Draw player (always centered in viewport)
    const playerScreenX = player.x - camera.x;
    const playerScreenY = player.y - camera.y;
    this.drawPlayer(ctx, playerScreenX, playerScreenY, player.animationFrame);
    
    // Draw UI
    const biome = Object.values(BIOMES)[currentBiome];
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    ctx.fillText(biome.name, 5, GAME_CONSTANTS.CANVAS_HEIGHT - 5);
    ctx.font = '8px monospace';
    ctx.fillText('Press P for Party Menu', 5, GAME_CONSTANTS.CANVAS_HEIGHT - 15);
    
    // Gold display
    ctx.fillStyle = '#FFD700';
    ctx.font = '10px monospace';
    const goldText = `${state.inventory.gold}G`;
    ctx.fillText(goldText, GAME_CONSTANTS.CANVAS_WIDTH - ctx.measureText(goldText).width - 5, GAME_CONSTANTS.CANVAS_HEIGHT - 5);
    
    // Save message
    if (state.saveMessage) {
      const alpha = Math.min(1, state.saveMessage.duration / 60);
      ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.font = '12px monospace';
      const text = state.saveMessage.text;
      const textWidth = ctx.measureText(text).width;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(text, (GAME_CONSTANTS.CANVAS_WIDTH - textWidth) / 2, 40);
      ctx.fillText(text, (GAME_CONSTANTS.CANVAS_WIDTH - textWidth) / 2, 40);
    }
    
    // Minimap (optional - show player position in world)
    this.drawMinimap(ctx, state);
  }
  
  static drawMinimap(ctx, state) {
    const { player } = state.worldMap;
    const minimapSize = 40;
    const minimapX = GAME_CONSTANTS.CANVAS_WIDTH - minimapSize - 5;
    const minimapY = 5;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
    ctx.strokeStyle = '#7969a5';
    ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // Player dot
    const playerMinimapX = minimapX + (player.x / (GAME_CONSTANTS.WORLD_WIDTH * GAME_CONSTANTS.TILE_SIZE)) * minimapSize;
    const playerMinimapY = minimapY + (player.y / (GAME_CONSTANTS.WORLD_HEIGHT * GAME_CONSTANTS.TILE_SIZE)) * minimapSize;
    
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(playerMinimapX - 1, playerMinimapY - 1, 2, 2);
  }
  
  static drawPlayer(ctx, x, y, frame) {
    const mainColor = '#FFD700';
    const darkColor = '#CCAA00';
    const skinColor = '#FECF80';
    
    // Body
    ctx.fillStyle = mainColor;
    ctx.fillRect(x + 2, y + 4, 12, 12);
    
    // Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(x + 4, y, 8, 8);
    ctx.fillStyle = darkColor;
    ctx.fillRect(x + 4, y, 8, 2);
    
    // Legs (animated)
    ctx.fillStyle = darkColor;
    if (frame === 0) {
      ctx.fillRect(x + 4, y + 14, 3, 2);
      ctx.fillRect(x + 9, y + 14, 3, 2);
    } else if (frame === 1) {
      ctx.fillRect(x + 2, y + 14, 4, 2);
      ctx.fillRect(x + 10, y + 14, 3, 2);
    } else if (frame === 2) {
      ctx.fillRect(x + 3, y + 14, 3, 2);
      ctx.fillRect(x + 9, y + 14, 4, 2);
    }
  }
  
  static drawBattle(ctx, combat) {
    // Background
    ctx.fillStyle = '#211e2f';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // TRAIT SELECTION OVERLAY
    if (combat.traitSelection) {
      this.drawTraitSelection(ctx, combat.traitSelection);
      return; // Don't draw rest of battle while selecting trait
    }
    
    // Draw enemies
    combat.enemies.forEach((enemy, i) => {
      const x = GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.TILE_SIZE * 3;
      const y = (GAME_CONSTANTS.CANVAS_HEIGHT / 2 - GAME_CONSTANTS.TILE_SIZE * 4) + (i * GAME_CONSTANTS.TILE_SIZE * 2);
      
      let color = enemy.hp <= 0 ? '#555555' : enemy.color;
      if (combat.activeCharacter?.type === 'enemy' && i === combat.activeCharacter.index) {
        color = '#DC2626';
      }
      
      // Enemy sprite
      ctx.fillStyle = color;
      ctx.fillRect(x, y, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
      
      // HP bar
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, y - 8, GAME_CONSTANTS.TILE_SIZE, 3);
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(x, y - 8, GAME_CONSTANTS.TILE_SIZE * (enemy.hp / enemy.maxHp), 3);
      
      // ATB bar
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, y - 4, GAME_CONSTANTS.TILE_SIZE, 3);
      ctx.fillStyle = '#A78BFA';
      ctx.fillRect(x, y - 4, GAME_CONSTANTS.TILE_SIZE * (enemy.atbMeter / GAME_CONSTANTS.ATB_MAX), 3);
      
      // Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '8px monospace';
      ctx.fillText(enemy.name, x, y - 10);
      
      // Targeting cursor
      if (combat.ui.menuState === 'targeting' && combat.ui.targetType === 'enemy') {
        const livingEnemies = combat.enemies.filter(e => e.hp > 0);
        const targetIndex = livingEnemies.indexOf(enemy);
        if (targetIndex === combat.ui.targetCursor) {
          ctx.strokeStyle = '#22D3EE';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 2, y - 2, GAME_CONSTANTS.TILE_SIZE + 4, GAME_CONSTANTS.TILE_SIZE + 4);
        }
      }
    });
    
    // Draw heroes
    combat.heroes.forEach((hero, i) => {
      const x = GAME_CONSTANTS.TILE_SIZE * 4;
      const y = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.TILE_SIZE * 7 - (i * GAME_CONSTANTS.TILE_SIZE * 2.5);
      
      let color = hero.hp <= 0 ? '#555555' : hero.color;
      if (combat.activeCharacter?.type === 'hero' && i === combat.activeCharacter.index) {
        color = '#FACC15';
      }
      
      // Hero sprite
      ctx.fillStyle = color;
      ctx.fillRect(x, y, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(x, y, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
      
      // Status effects
      let statusY = 0;
      Object.keys(hero.statuses).forEach(statusName => {
        const def = STATUS_EFFECTS[statusName];
        ctx.fillStyle = def.color;
        ctx.fillText(def.symbol, x - 18, y + GAME_CONSTANTS.TILE_SIZE/2 + statusY);
        statusY += 8;
      });
      
      // Targeting cursor
      if (combat.ui.menuState === 'targeting' && combat.ui.targetType === 'ally') {
        const livingHeroes = combat.heroes.filter(h => h.hp > 0);
        const targetIndex = livingHeroes.indexOf(hero);
        if (targetIndex === combat.ui.targetCursor) {
          ctx.strokeStyle = '#22D3EE';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 2, y - 2, GAME_CONSTANTS.TILE_SIZE + 4, GAME_CONSTANTS.TILE_SIZE + 4);
        }
      }
    });
    
    // Draw floating texts
    combat.floatingTexts.forEach(text => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.font = '8px monospace';
      ctx.strokeText(text.text, text.x, text.y);
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
    });
    
    // Draw level up notifications
    combat.levelUpNotifications.forEach((notif, i) => {
      const y = 30 + (i * 15);
      const alpha = Math.min(1, notif.duration / 60); // Fade out in last second
      
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.font = '10px monospace';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      const text = `🎉 ${notif.heroName} -> Level ${notif.level}!`;
      ctx.strokeText(text, GAME_CONSTANTS.CANVAS_WIDTH / 2 - 60, y);
      ctx.fillText(text, GAME_CONSTANTS.CANVAS_WIDTH / 2 - 60, y);
    });
    
    // Draw UI panel
    const uiY = GAME_CONSTANTS.CANVAS_HEIGHT - 55;
    ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
    ctx.fillRect(0, uiY, GAME_CONSTANTS.CANVAS_WIDTH, 55);
    ctx.strokeStyle = '#7969a5';
    ctx.strokeRect(0, uiY, GAME_CONSTANTS.CANVAS_WIDTH, 55);
    
    // Hero stats
    combat.heroes.forEach((h, i) => {
      const x = 5;
      const y = uiY + (i * 10) + 5;
      
      ctx.fillStyle = combat.activeCharacter?.type === 'hero' && combat.activeCharacter.index === i ? '#FACC15' : '#FFFFFF';
      ctx.font = '8px monospace';
      ctx.fillText(h.name, x, y + 6);
      
      // HP bar
      ctx.fillStyle = '#333333';
      ctx.fillRect(x + 50, y + 2, 60, 3);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(x + 50, y + 2, 60 * (h.hp / h.maxHp), 3);
      
      // MP bar
      ctx.fillStyle = '#333333';
      ctx.fillRect(x + 50, y + 7, 60, 3);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(x + 50, y + 7, 60 * (h.mp / h.maxMp), 3);
      
      // ATB bar
      ctx.fillStyle = '#333333';
      ctx.fillRect(x + 130, y + 5, 60, 3);
      ctx.fillStyle = '#A78BFA';
      ctx.fillRect(x + 130, y + 5, 60 * (h.atbMeter / GAME_CONSTANTS.ATB_MAX), 3);
      
      // Text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`HP: ${h.hp}/${h.maxHp}`, x + 195, y + 6);
    });
    
    // Phase text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    const phaseText = combat.phase === 'HERO_INPUT' ? 'Select Action' :
                      combat.phase === 'EXECUTING' ? `Executing... (${combat.actionQueue.length} actions)` :
                      combat.phase === 'TRAIT_SELECTION' ? 'Choose Trait!' :
                      'Charging ATB...';
    ctx.fillText(phaseText, 10, uiY - 5);
    
    // Gold display
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`Gold: +${combat.goldEarned}`, GAME_CONSTANTS.CANVAS_WIDTH - 70, uiY - 5);
    
    // Draw menus
    if (combat.ui.menuState === 'main') {
      this.drawMenu(ctx, combat, MENU_OPTIONS.main, combat.ui.mainCursor, 0);
    } else if (combat.ui.menuState === 'skills') {
      this.drawMenu(ctx, combat, MENU_OPTIONS.main, combat.ui.mainCursor, 0);
      this.drawSubMenu(ctx, combat, combat.ui.subMenuActions, combat.ui.subCursor, 75, 'skills');
    } else if (combat.ui.menuState === 'magic') {
      this.drawMenu(ctx, combat, MENU_OPTIONS.main, combat.ui.mainCursor, 0);
      this.drawSubMenu(ctx, combat, MENU_OPTIONS.magic, combat.ui.subCursor, 75, 'magic');
    } else if (combat.ui.menuState === 'item') {
      this.drawMenu(ctx, combat, MENU_OPTIONS.main, combat.ui.mainCursor, 0);
      this.drawSubMenu(ctx, combat, MENU_OPTIONS.item, combat.ui.subCursor, 75, 'item');
    }
  }
  
  static drawMenu(ctx, combat, options, cursor, offsetX) {
    if (!combat.activeCharacter || combat.activeCharacter.type !== 'hero') return;
    
    const heroIndex = combat.activeCharacter.index;
    const x = GAME_CONSTANTS.TILE_SIZE * 4 + GAME_CONSTANTS.TILE_SIZE + offsetX + 10;
    const y = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.TILE_SIZE * 7 - (heroIndex * GAME_CONSTANTS.TILE_SIZE * 2.5) - 5;
    const width = 60;
    const height = options.length * 10 + 10;
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#7969a5';
    ctx.strokeRect(x, y, width, height);
    
    ctx.font = '8px monospace';
    options.forEach((option, i) => {
      const optionY = y + 10 + (i * 10);
      
      if (i === cursor) {
        ctx.fillStyle = '#FACC15';
        ctx.fillText('>', x + 3, optionY);
      }
      
      ctx.fillStyle = i === cursor ? '#FACC15' : '#FFFFFF';
      ctx.fillText(option, x + 10, optionY);
    });
  }
  
  static drawSubMenu(ctx, combat, actionIds, cursor, offsetX, menuType) {
    if (!combat.activeCharacter || combat.activeCharacter.type !== 'hero') return;
    
    const heroIndex = combat.activeCharacter.index;
    const x = GAME_CONSTANTS.TILE_SIZE * 4 + GAME_CONSTANTS.TILE_SIZE + offsetX + 10;
    const y = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.TILE_SIZE * 7 - (heroIndex * GAME_CONSTANTS.TILE_SIZE * 2.5) - 5;
    const width = menuType === 'skills' ? 100 : 85;
    const height = actionIds.length * 10 + 10;
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.9)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#7969a5';
    ctx.strokeRect(x, y, width, height);
    
    ctx.font = '8px monospace';
    actionIds.forEach((actionId, i) => {
      const actionDef = ACTION_DATABASE[actionId] || SKILL_DATABASE[actionId];
      const optionY = y + 10 + (i * 10);
      
      if (i === cursor) {
        ctx.fillStyle = '#FACC15';
        ctx.fillText('>', x + 3, optionY);
      }
      
      ctx.fillStyle = i === cursor ? '#FACC15' : '#FFFFFF';
      let displayText = actionDef.name;
      if (actionDef.manaCost > 0) {
        displayText += ` (${actionDef.manaCost}MP)`;
      }
      ctx.fillText(displayText, x + 10, optionY);
    });
  }
  
  static drawTraitSelection(ctx, selection) {
    const { traitOptions, cursor, hero } = selection;
    
    // Safety check - should never happen but prevents freeze
    if (!traitOptions || traitOptions.length === 0) {
      console.error('Trait selection with no options!');
      return;
    }
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = '12px monospace';
    ctx.fillText(`${hero.name} Level Up!`, GAME_CONSTANTS.CANVAS_WIDTH / 2 - 50, 40);
    ctx.font = '10px monospace';
    ctx.fillText('Choose a Trait:', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 40, 55);
    
    // Trait option boxes
    traitOptions.forEach((traitId, i) => {
      const trait = TRAIT_DATABASE[traitId];
      
      if (!trait) {
        console.error(`Trait ${traitId} not found in database!`);
        return;
      }
      
      const x = 20 + (i * 115);
      const y = 70;
      const isSelected = i === cursor;
      
      // Box
      ctx.fillStyle = isSelected ? 'rgba(250, 204, 21, 0.3)' : 'rgba(26, 26, 46, 0.9)';
      ctx.fillRect(x, y, 110, 80);
      ctx.strokeStyle = isSelected ? '#FACC15' : '#7969a5';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, 110, 80);
      
      // Trait name
      ctx.fillStyle = isSelected ? '#FACC15' : '#FFFFFF';
      ctx.font = '9px monospace';
      ctx.fillText(trait.name, x + 5, y + 15);
      
      // Description (word wrap)
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '7px monospace';
      const words = trait.description.split(' ');
      let line = '';
      let lineY = y + 30;
      words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > 100) {
          ctx.fillText(line, x + 5, lineY);
          line = word + ' ';
          lineY += 10;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, x + 5, lineY);
    });
    
    // Instructions
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px monospace';
    ctx.fillText('Arrow Keys: Select | Enter: Confirm', GAME_CONSTANTS.CANVAS_WIDTH / 2 - 80, 170);
  }
}

// =============================================================================
// REACT COMPONENT
// =============================================================================
export default function MistheartSpire() {
  const canvasRef = useRef(null);
  const [gameState] = useState(() => new GameStateManager());
  const [input] = useState(() => new InputManager());
  const [worldGenerated, setWorldGenerated] = useState(false);
  const [playTimeInterval, setPlayTimeInterval] = useState(null);
  const [scale, setScale] = useState(GAME_CONSTANTS.DEFAULT_SCALE);
  
  useEffect(() => {
    const state = gameState.getState();
    
    // Initialize scale from saved state
    if (state.gameScale) {
      setScale(state.gameScale);
    }
    
    // Start play time tracker when not on title screen
    if (state.scene !== 'TITLE_SCREEN' && !playTimeInterval) {
      const interval = setInterval(() => {
        gameState.getState().playTime += 1;
      }, 1000);
      setPlayTimeInterval(interval);
    }
    
    return () => {
      if (playTimeInterval) {
        clearInterval(playTimeInterval);
      }
    };
  }, [worldGenerated, playTimeInterval, gameState]);
  
  const handleScaleChange = (newScale) => {
    setScale(newScale);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function gameLoop() {
      try {
        const state = gameState.getState();
        
        // Update
        if (state.scene === 'TITLE_SCREEN') {
          const result = TitleScreenController.handleInput(state, input);
          
          if (result.action === 'newgame') {
            gameState.newGame();
            if (!worldGenerated) {
              setTimeout(() => {
                gameState.initializeWorld();
                setWorldGenerated(true);
              }, 100);
            }
          } else if (result.action === 'load') {
            const saveData = SaveSystem.loadGame(result.slot);
            if (saveData) {
              gameState.loadFromSave(saveData);
              if (!worldGenerated) {
                setTimeout(() => {
                  gameState.initializeWorld();
                  setWorldGenerated(true);
                }, 100);
              }
            }
          } else if (result.action === 'continue') {
            const saveData = SaveSystem.loadGame(1);
            if (saveData) {
              gameState.loadFromSave(saveData);
              if (!worldGenerated) {
                setTimeout(() => {
                  gameState.initializeWorld();
                  setWorldGenerated(true);
                }, 100);
              }
            } else {
              // No save, start new game
              gameState.newGame();
              if (!worldGenerated) {
                setTimeout(() => {
                  gameState.initializeWorld();
                  setWorldGenerated(true);
                }, 100);
              }
            }
          }
        } else if (state.scene === 'WORLD_MAP') {
          const result = WorldMapController.update(state, input, gameState);
          if (result.encounter) {
            gameState.startBattle(state.roster);
          }
          if (result.enterLocation) {
            console.log(`Entering ${result.enterLocation.name}`);
            // TODO: Handle town/dungeon entry
          }
        } else if (state.scene === 'PARTY_MENU') {
          PartyMenuController.handleInput(state, input);
        } else if (state.scene === 'INVENTORY') {
          InventoryController.handleInput(state, input);
        } else if (state.scene === 'SETTINGS') {
          SettingsMenuController.handleInput(state, input, handleScaleChange);
        } else if (state.scene === 'BATTLE' && state.combat) {
          BattleInputController.handleInput(state.combat, input);
          const result = CombatSystem.update(state.combat);
          
          if (result.battleEnd) {
            gameState.endBattle(state.roster, state.inventory, result.goldEarned || 0);
          }
        }
        
        input.clearPressed();
        
        // Render
        ctx.clearRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT);
        
        if (state.scene === 'TITLE_SCREEN') {
          Renderer.drawTitleScreen(ctx, state);
        } else if (state.scene === 'WORLD_MAP') {
          Renderer.drawWorldMap(ctx, state);
        } else if (state.scene === 'PARTY_MENU') {
          Renderer.drawPartyMenu(ctx, state);
        } else if (state.scene === 'INVENTORY') {
          Renderer.drawInventory(ctx, state);
        } else if (state.scene === 'SETTINGS') {
          Renderer.drawSettings(ctx, state);
        } else if (state.scene === 'BATTLE' && state.combat) {
          Renderer.drawBattle(ctx, state.combat);
        }
        
        animationId = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Game loop error:', error);
        console.error('Current state:', gameState.getState().scene);
        console.error('Combat state:', gameState.getState().combat);
        // Don't stop the game loop, try to recover
        animationId = requestAnimationFrame(gameLoop);
      }
    }
    
    gameLoop();
    
    return () => cancelAnimationFrame(animationId);
  }, [gameState, input, worldGenerated, scale]);
  
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONSTANTS.CANVAS_WIDTH}
          height={GAME_CONSTANTS.CANVAS_HEIGHT}
          className="border-4 border-purple-700 shadow-lg shadow-purple-500/50"
          style={{ 
            imageRendering: 'pixelated',
            width: `${GAME_CONSTANTS.CANVAS_WIDTH * scale}px`,
            height: `${GAME_CONSTANTS.CANVAS_HEIGHT * scale}px`
          }}
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
          WASD: Move | Enter: Select | Esc: Menu | F5: Quick Save | P: Party | I: Inventory
        </div>
      </div>
    </div>
  );
}