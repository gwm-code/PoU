// Auto-split from mistheart-modularv134.tsx
export class ATBSystem {
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


