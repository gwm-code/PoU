// Auto-split from mistheart-modularv134.tsx
export class XPSystem {
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
      const newSkills = EquipmentSystem.unlockSkills(hero);
      
      // Generate 2 random trait options
      const traitOptions = this.generateTraitOptions(hero);
      
      levelUps.push({
        hero: hero,
        level: hero.level,
        gains: statGains,
        traitOptions: traitOptions,
        newSkills: newSkills // Include unlocked skills
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


