// Auto-split from mistheart-modularv134.tsx
export const SKILL_DATABASE = {
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


