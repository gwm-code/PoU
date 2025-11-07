// Auto-split from mistheart-modularv134.tsx
export const ITEM_DATABASE = {
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


