// Auto-split from mistheart-modularv134.tsx
export class EquipmentSystem {
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
    const newSkills = [];
    
    available.forEach(skillId => {
      if (!hero.skills.includes(skillId)) {
        hero.skills.push(skillId);
        newSkills.push(skillId);
        console.log(`${hero.name} unlocked skill: ${SKILL_DATABASE[skillId].name}!`);
      }
    });
    
    return newSkills;
  }
}


