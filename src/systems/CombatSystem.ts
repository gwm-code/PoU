// Auto-split from mistheart-modularv134.tsx
export class CombatSystem {
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
      skillUnlockNotifications: [], // Store skill unlock messages
      itemDropNotifications: [], // Store item drop messages
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
    
    // Update skill unlock notifications
    combat.skillUnlockNotifications = combat.skillUnlockNotifications
      .map(n => ({ ...n, duration: n.duration - 1 }))
      .filter(n => n.duration > 0);
    
    // Update item drop notifications
    combat.itemDropNotifications = combat.itemDropNotifications
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
      // Note: Will be tracked in inventory properly now
      // Decrement item count (handled after battle in endBattle)
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
          
          // Check for item drops
          if (target.itemDrops && Math.random() < GAME_CONSTANTS.ITEM_DROP_CHANCE) {
            target.itemDrops.forEach(drop => {
              if (Math.random() < drop.chance) {
                const item = ITEM_DATABASE[drop.itemId];
                if (item) {
                  combat.itemDropNotifications.push({
                    itemName: item.name,
                    duration: 180
                  });
                  console.log(`${target.name} dropped ${item.name}!`);
                }
              }
            });
          }
        }
        
        // Award XP and check for level up
        const levelUps = XPSystem.awardXP(caster, finalXP);
        
        // Show XP gain
        this.addFloatingText(combat, `+${finalXP}XP`, casterType, casterIndex, '#FFD700');
        
        // Handle level ups with trait selection and skill unlocks
        levelUps.forEach(levelUp => {
          combat.levelUpNotifications.push({
            heroName: levelUp.hero.name,
            level: levelUp.level,
            duration: 180 // 3 seconds
          });
          
          // Show skill unlock notifications
          if (levelUp.newSkills && levelUp.newSkills.length > 0) {
            levelUp.newSkills.forEach(skillId => {
              const skill = SKILL_DATABASE[skillId];
              combat.skillUnlockNotifications.push({
                heroName: levelUp.hero.name,
                skillName: skill.name,
                description: skill.description,
                duration: 240 // 4 seconds
              });
            });
          }
          
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


