// Auto-split from mistheart-modularv134.tsx
export class GameStateManager {
  constructor() {
    this.state = this.createInitialState();
  }
  
  createInitialState() {
    return {
      scene: 'TITLE_SCREEN',
      
      // Party roster management
      roster: {
        allHeroes: HERO_DATA.map(h => ({
          ...h,
          atbMeter: 0,
          statuses: {},
          isDefending: false,
          // Ensure all arrays/objects exist
          traits: h.traits || [],
          skills: h.skills || [],
          equipment: h.equipment || { weapon: null, armor: null, accessory: null }
        })),
        activeParty: [0, 1, 2], // Indices of heroes in active party (Hero, Eyla, Greyor)
      },
      
      inventory: {
        gold: 0,
        items: {
          healthPotion: 3,
          manaPotion: 2
        },
        equipment: [] // Array of equipment IDs in storage
      },
      
      worldMap: {
        player: {
          x: 64 * GAME_CONSTANTS.TILE_SIZE,  // Start near first town
          y: 64 * GAME_CONSTANTS.TILE_SIZE,
          speed: 2, // Faster movement on large map
          animationFrame: 0,
          frameCounter: 0
        },
        currentBiome: 0, // Ironpeak Foothills
        camera: {
          x: 0,
          y: 0
        },
        map: null, // Will be generated
        locations: [] // Towns, dungeons, spire
      },
      combat: null,
      playTime: 0 // In seconds
    };
  }
  
  loadFromSave(saveData) {
    // Restore saved data
    this.state.roster = saveData.roster;
    this.state.inventory = saveData.inventory;
    this.state.worldMap.player = saveData.worldMap.player;
    this.state.worldMap.currentBiome = saveData.worldMap.currentBiome;
    this.state.worldMap.camera = saveData.worldMap.camera;
    this.state.worldMap.locations = saveData.worldMap.locations;
    this.state.playTime = saveData.playTime || 0;
    this.state.gameScale = saveData.gameScale || GAME_CONSTANTS.DEFAULT_SCALE;
    this.state.fullscreen = saveData.fullscreen || false;
    this.state.scene = 'WORLD_MAP';
    
    // Regenerate map (don't save/load the huge map array)
    this.initializeWorld();
  }
  
  newGame() {
    this.state = this.createInitialState();
    this.state.scene = 'WORLD_MAP';
  }
  
  generateWorld() {
    console.log('Generating 4096x4096 world... This may take a moment.');
    
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    const map = [];
    
    // Initialize with basic terrain using biomes
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        // Determine biome based on position (6 biomes arranged in rough zones)
        const biomeIndex = this.getBiomeAtPosition(x, y);
        const biome = Object.values(BIOMES)[biomeIndex];
        
        // Generate tile based on biome probabilities
        const tile = this.generateBiomeTile(biome);
        row.push(tile);
      }
      map.push(row);
      
      // Progress logging every 10%
      if (y % 410 === 0) {
        console.log(`World generation: ${Math.floor((y / height) * 100)}%`);
      }
    }
    
    console.log('World terrain generated! Placing locations...');
    
    // Generate locations (towns, dungeons, spire)
    const locations = this.generateLocations(map);
    
    console.log(`World complete! ${locations.length} locations placed.`);
    
    return { map, locations };
  }
  
  getBiomeAtPosition(x, y) {
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Divide map into 6 zones (2 rows x 3 columns)
    const zoneWidth = width / 3;
    const zoneHeight = height / 2;
    
    const col = Math.floor(x / zoneWidth);
    const row = Math.floor(y / zoneHeight);
    
    const biomeMap = [
      [0, 1, 2], // Top row: Ironpeak, Misty Valley, Dead Marshes
      [3, 4, 5]  // Bottom row: Barren Plains, Shadow Woods, Desolate Peaks
    ];
    
    return biomeMap[Math.min(row, 1)][Math.min(col, 2)];
  }
  
  generateBiomeTile(biome) {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [tileId, probability] of Object.entries(biome.tiles)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return parseInt(tileId);
      }
    }
    
    return 1; // Default to field
  }
  
  generateLocations(map) {
    const locations = [];
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Generate 12 towns (2 per biome)
    for (let i = 0; i < GAME_CONSTANTS.NUM_TOWNS; i++) {
      const biomeIndex = Math.floor(i / 2); // 2 towns per biome
      const location = this.placeLocation(map, 'town', biomeIndex, i);
      locations.push(location);
    }
    
    // Generate 18 dungeons (3 per biome)
    for (let i = 0; i < GAME_CONSTANTS.NUM_DUNGEONS; i++) {
      const biomeIndex = Math.floor(i / 3); // 3 dungeons per biome
      const location = this.placeLocation(map, 'dungeon', biomeIndex, i);
      locations.push(location);
    }
    
    // Generate final spire (center of last biome)
    const spire = {
      type: 'spire',
      name: 'Mistheart Spire',
      x: Math.floor(width * 5 / 6),
      y: Math.floor(height * 3 / 4),
      width: GAME_CONSTANTS.SPIRE_SIZE,
      height: GAME_CONSTANTS.SPIRE_SIZE,
      biome: 5
    };
    locations.push(spire);
    
    // Place location markers on map
    locations.forEach(loc => {
      const tileType = loc.type === 'town' ? 5 : loc.type === 'dungeon' ? 6 : 7;
      this.stampLocationOnMap(map, loc, tileType);
    });
    
    return locations;
  }
  
  placeLocation(map, type, biomeIndex, index) {
    const width = GAME_CONSTANTS.WORLD_WIDTH;
    const height = GAME_CONSTANTS.WORLD_HEIGHT;
    
    // Get biome zone bounds
    const zoneWidth = width / 3;
    const zoneHeight = height / 2;
    const col = biomeIndex % 3;
    const row = Math.floor(biomeIndex / 3);
    
    const zoneX = col * zoneWidth;
    const zoneY = row * zoneHeight;
    
    // Random position within biome zone (with padding)
    const padding = 100;
    const size = type === 'town' ? GAME_CONSTANTS.TOWN_SIZE : GAME_CONSTANTS.DUNGEON_SIZE;
    
    const x = zoneX + padding + Math.floor(Math.random() * (zoneWidth - padding * 2 - size));
    const y = zoneY + padding + Math.floor(Math.random() * (zoneHeight - padding * 2 - size));
    
    return {
      type,
      name: type === 'town' ? `Town ${index + 1}` : `Dungeon ${index + 1}`,
      x,
      y,
      width: size,
      height: size,
      biome: biomeIndex
    };
  }
  
  stampLocationOnMap(map, location, tileType) {
    for (let dy = 0; dy < location.height; dy++) {
      for (let dx = 0; dx < location.width; dx++) {
        const x = location.x + dx;
        const y = location.y + dy;
        
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
          map[y][x] = tileType;
        }
      }
    }
  }
  
  generateMap() {
    // Legacy small map - keeping for backward compatibility
    return [
      [3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [3,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1],
      [1,1,1,1,0,0,0,0,0,1,1,1,2,2,2,2],
      [1,1,1,0,0,0,0,0,0,0,1,1,2,2,2,2],
      [1,1,0,0,0,0,0,0,0,0,0,1,1,1,2,2],
      [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    ];
  }
  
  startBattle(roster) {
    // Get active party members
    const activeHeroes = roster.activeParty.map(index => {
      const hero = roster.allHeroes[index];
      return {
        ...hero,
        atbMeter: 0,
        statuses: {},
        isDefending: false,
        // Reset combat-specific modifiers
        strengthMod: 1,
        agilityMod: 1,
        atbSpeedMod: 1,
        damageReduction: 0,
        threat: 0,
        lifeStealPercent: 0,
        // Ensure skills are copied
        skills: [...(hero.skills || [])],
        traits: [...(hero.traits || [])]
      };
    });
    
    // Apply passive traits to all heroes
    activeHeroes.forEach(hero => {
      if (hero.traits && hero.traits.length > 0) {
        hero.traits.forEach(traitId => {
          const trait = TRAIT_DATABASE[traitId];
          if (trait && trait.onBattleStart) {
            if (trait.aoe) {
              trait.onBattleStart(hero, activeHeroes);
            } else {
              trait.onBattleStart(hero);
            }
          }
          
          // Apply passive effects
          if (trait && trait.lifeStealPercent) {
            hero.lifeStealPercent = trait.lifeStealPercent;
          }
        });
      }
    });
    
    console.log('Battle starting with heroes:', activeHeroes.map(h => ({ 
      name: h.name, 
      skills: h.skills, 
      traits: h.traits,
      str: h.strength,
      agi: h.agility
    })));
    
    this.state.combat = CombatSystem.initialize(activeHeroes, ENEMY_TEMPLATES);
    this.state.scene = 'BATTLE';
  }
  
  initializeWorld() {
    if (!this.state.worldMap.map) {
      const { map, locations } = this.generateWorld();
      this.state.worldMap.map = map;
      this.state.worldMap.locations = locations;
      
      // Center camera on player
      this.updateCamera();
    }
  }
  
  updateCamera() {
    const { player, camera } = this.state.worldMap;
    
    // Center camera on player
    camera.x = player.x - (GAME_CONSTANTS.CANVAS_WIDTH / 2);
    camera.y = player.y - (GAME_CONSTANTS.CANVAS_HEIGHT / 2);
    
    // Clamp camera to world bounds
    camera.x = Math.max(0, Math.min(camera.x, GAME_CONSTANTS.WORLD_WIDTH * GAME_CONSTANTS.TILE_SIZE - GAME_CONSTANTS.CANVAS_WIDTH));
    camera.y = Math.max(0, Math.min(camera.y, GAME_CONSTANTS.WORLD_HEIGHT * GAME_CONSTANTS.TILE_SIZE - GAME_CONSTANTS.CANVAS_HEIGHT));
  }
  
  endBattle(roster, inventory, goldEarned) {
    // Sync hero stats back to roster (HP/MP and XP/Level/Traits)
    if (this.state.combat) {
      this.state.combat.heroes.forEach((combatHero, i) => {
        const rosterIndex = roster.activeParty[i];
        const rosterHero = roster.allHeroes[rosterIndex];
        
        // Update HP/MP (keep them at combat values)
        rosterHero.hp = combatHero.hp;
        rosterHero.mp = combatHero.mp;
        
        // Update XP and Level
        rosterHero.xp = combatHero.xp;
        rosterHero.level = combatHero.level;
        rosterHero.xpToNext = combatHero.xpToNext;
        
        // Update traits
        rosterHero.traits = combatHero.traits || [];
        
        // Update stats from leveling
        rosterHero.maxHp = combatHero.maxHp;
        rosterHero.maxMp = combatHero.maxMp;
        rosterHero.strength = combatHero.strength;
        rosterHero.agility = combatHero.agility;
        rosterHero.endurance = combatHero.endurance;
      });
      
      // Award gold
      inventory.gold += goldEarned;
    }
    
    this.state.combat = null;
    this.state.scene = 'WORLD_MAP';
  }
  
  getState() {
    return this.state;
  }
}


