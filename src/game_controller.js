class GameController {
  constructor() {
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      a: false,
      b: false,
      select: false,
      start: false
    };
    this.callback = null;
    this.createControllerUI();
    this.setupKeyboardEvents();
  }

  createControllerUI() {
    const container = document.createElement('div');
    container.id = 'fc-controller';
    container.innerHTML = `
      <div class="controller-body">
        <div class="dpad-section">
          <div class="dpad">
            <button class="dpad-btn up" data-key="up"></button>
            <button class="dpad-btn left" data-key="left"></button>
            <button class="dpad-btn center"></button>
            <button class="dpad-btn right" data-key="right"></button>
            <button class="dpad-btn down" data-key="down"></button>
          </div>
        </div>
        
        <div class="center-section">
          <div class="select-start-row">
            <div class="btn-group">
              <button class="mini-btn" data-key="select">SELECT</button>
              <span class="btn-label">SELECT</span>
            </div>
            <div class="btn-group">
              <button class="mini-btn" data-key="start">START</button>
              <span class="btn-label">START</span>
            </div>
          </div>
        </div>
        
        <div class="ab-section">
          <div class="ab-btns">
            <button class="ab-btn b-btn" data-key="b">B</button>
            <div class="ab-spacer"></div>
            <button class="ab-btn a-btn" data-key="a">A</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    this.setupControllerEvents(container);
  }

  setupControllerEvents(container) {
    const buttons = container.querySelectorAll('button[data-key]');
    buttons.forEach(btn => {
      const key = btn.dataset.key;
      
      const handleStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.keys[key] = true;
        btn.classList.add('pressed');
        this.triggerCallback();
      };
      
      const handleEnd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.keys[key] = false;
        btn.classList.remove('pressed');
        this.triggerCallback();
      };
      
      btn.addEventListener('mousedown', handleStart, { passive: false });
      btn.addEventListener('mouseup', handleEnd, { passive: false });
      btn.addEventListener('mouseleave', handleEnd, { passive: false });
      btn.addEventListener('touchstart', handleStart, { passive: false });
      btn.addEventListener('touchend', handleEnd, { passive: false });
      btn.addEventListener('touchcancel', handleEnd, { passive: false });
      btn.addEventListener('blur', handleEnd, { passive: false });
    });
    
    document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: false });
  }

  setupKeyboardEvents() {
    const keyMap = {
      'w': 'up',
      'arrowup': 'up',
      's': 'down',
      'arrowdown': 'down',
      'a': 'left',
      'arrowleft': 'left',
      'd': 'right',
      'arrowright': 'right',
      'z': 'a',
      'j': 'a',
      'x': 'b',
      'k': 'b',
      'shift': 'select',
      'c': 'select',
      'enter': 'start',
      ' ': 'start',
      'v': 'start'
    };

    const handleKey = (e, isPressed) => {
      const key = e.key.toLowerCase();
      const mappedKey = keyMap[key];
      if (mappedKey) {
        e.preventDefault();
        this.keys[mappedKey] = isPressed;
        this.triggerCallback();
      }
    };

    document.addEventListener('keydown', (e) => handleKey(e, true), { passive: false });
    document.addEventListener('keyup', (e) => handleKey(e, false), { passive: false });
    window.addEventListener('blur', () => {
      Object.keys(this.keys).forEach(key => {
        this.keys[key] = false;
      });
      this.triggerCallback();
    });
  }

  onInput(callback) {
    this.callback = callback;
  }

  triggerCallback() {
    if (this.callback) {
      this.callback(this.keys);
    }
  }

  getKeys() {
    return { ...this.keys };
  }
}

const gameController = new GameController();
export default gameController;
