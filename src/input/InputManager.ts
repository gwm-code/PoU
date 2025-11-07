// Auto-split from mistheart-modularv134.tsx
export class InputManager {
  constructor() {
    this.keys = {};
    this.pressed = {};
    this.setupListeners();
  }
  
  setupListeners() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (!this.keys[key] || key === 'escape') {
        this.pressed[key] = true;
      }
      this.keys[key] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }
  
  isPressed(key) {
    if (this.pressed[key]) {
      this.pressed[key] = false;
      return true;
    }
    return false;
  }
  
  isDown(key) {
    return this.keys[key] === true;
  }
  
  clearPressed() {
    this.pressed = {};
  }
}


