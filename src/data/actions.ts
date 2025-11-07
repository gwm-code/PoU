// Auto-split from mistheart-modularv134.tsx
export const ACTION_DATABASE = {
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


