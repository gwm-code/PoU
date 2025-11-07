// Auto-split from mistheart-modularv134.tsx
export class SaveSystem {
  static saveGame(state, slotNumber = 1) {
    try {
      const saveData = {
        version: GAME_CONSTANTS.SAVE_VERSION,
        timestamp: Date.now(),
        roster: state.roster,
        inventory: state.inventory,
        worldMap: {
          player: state.worldMap.player,
          currentBiome: state.worldMap.currentBiome,
          camera: state.worldMap.camera,
          locations: state.worldMap.locations,
        },
        playTime: state.playTime || 0,
        gameScale: state.gameScale || GAME_CONSTANTS.DEFAULT_SCALE,
        fullscreen: state.fullscreen || false
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
      
      // Migrate old save files
      this.migrateSave(saveData);
      
      console.log(`Game loaded from slot ${slotNumber}!`);
      return saveData;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }
  
  static migrateSave(saveData) {
    // Migrate old saves to new version
    if (!saveData.version || saveData.version < GAME_CONSTANTS.SAVE_VERSION) {
      console.log('Migrating old save file...');
      
      // Fix heroes without skills/traits
      saveData.roster.allHeroes.forEach(hero => {
        // Ensure arrays exist
        if (!hero.traits) hero.traits = [];
        if (!hero.skills) hero.skills = [];
        if (!hero.equipment) hero.equipment = { weapon: null, armor: null, accessory: null };
        
        // Retroactively unlock skills based on level
        EquipmentSystem.unlockSkills(hero);
        
        // Ensure stats are correct for level
        // (This ensures heroes have proper stats even if they leveled up in old version)
      });
      
      // Ensure inventory has item counts
      if (!saveData.inventory.items) {
        saveData.inventory.items = {
          healthPotion: 3,
          manaPotion: 2
        };
      }
      
      // Add missing fields
      if (!saveData.gameScale) {
        saveData.gameScale = GAME_CONSTANTS.DEFAULT_SCALE;
      }
      
      if (!saveData.fullscreen) {
        saveData.fullscreen = false;
      }
      
      saveData.version = GAME_CONSTANTS.SAVE_VERSION;
      console.log('Save migration complete!');
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


