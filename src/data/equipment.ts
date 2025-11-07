// Auto-split from mistheart-modularv134.tsx
export const EQUIPMENT_DATABASE = {
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



export const RARITY_COLORS = {
  common: '#AAAAAA',
  rare: '#3B82F6',
  epic: '#9333EA',
  legendary: '#F59E0B',
  mythic: '#EF4444'
};


