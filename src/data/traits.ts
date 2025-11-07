// Auto-split from mistheart-modularv134.tsx
export const TRAIT_DATABASE = {
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


