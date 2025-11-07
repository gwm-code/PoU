// Auto-split from mistheart-modularv134.tsx
export const GAME_CONSTANTS = {
  TILE_SIZE: 16,
  CANVAS_WIDTH: 320,  // Changed from 256 to 320 (20 tiles)
  CANVAS_HEIGHT: 240, // Changed from 224 to 240 (15 tiles)
  
  // Scale options
  SCALE_OPTIONS: [1, 2, 3, 4], // 320x240, 640x480, 960x720, 1280x960
  DEFAULT_SCALE: 2,
  
  // World Map (4096x4096 tiles = massive world)
  WORLD_WIDTH: 4096,
  WORLD_HEIGHT: 4096,
  VIEWPORT_TILES_WIDTH: 20,  // 320px / 16 = 20 tiles visible
  VIEWPORT_TILES_HEIGHT: 15, // 240px / 16 = 15 tiles visible
  
  // Location Sizes (in tiles)
  TOWN_SIZE: 32,        // Towns are 32x32 tiles (512x512 pixels)
  DUNGEON_SIZE: 48,     // Dungeons are 48x48 tiles (768x768 pixels)
  SPIRE_SIZE: 64,       // Final Spire is 64x64 tiles (1024x1024 pixels)
  
  // World Structure (from design doc)
  NUM_BIOMES: 6,
  NUM_TOWNS: 12,
  NUM_DUNGEONS: 18,
  
  ATB_MAX: 100,
  ATB_BASE_SPEED: 1.0,
  ENCOUNTER_CHANCE: 0.005,
  ANIMATION_SPEED: 8,
  
  // XP System
  XP_PER_HIT: 5,
  XP_KILL_MULTIPLIER: 3,
  XP_TO_LEVEL: 100,
  
  // Gold System
  GOLD_PER_ENEMY_BASE: 10,
  GOLD_MULTIPLIER_RANGE: [0.8, 1.5],
  
  // Item Drop System
  ITEM_DROP_CHANCE: 0.3, // 30% chance to drop item
  
  // Save System
  SAVE_SLOT_KEY: 'mistheart_save_slot_',
  MAX_SAVE_SLOTS: 3,
  SAVE_VERSION: '1.0.1' // Increment when save structure changes
};


