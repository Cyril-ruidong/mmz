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
            <button class="dpad-btn up" data-key="up">▲</button>
            <button class="dpad-btn left" data-key="left">◀</button>
            <button class="dpad-btn center"></button>
            <button class="dpad-btn right" data-key="right">▶</button>
            <button class="dpad-btn down" data-key="down">▼</button>
          </div>
        </div>
        
        <div class="center-section">
          <div class="select-start-row">
            <div class="btn-group">
              <button class="mini-btn" data-key="select">SELECT</button>
            </div>
            <div class="btn-group">
              <button class="mini-btn" data-key="start">START</button>
            </div>
          </div>
        </div>
        
        <div class="ab-section">
          <div class="ab-btns">
            <button class="ab-btn b-btn" data-key="b">B</button>
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
        this.keys[key] = true;
        btn.classList.add('pressed');
        this.triggerCallback();
      };
      
      const handleEnd = (e) => {
        e.preventDefault();
        this.keys[key] = false;
        btn.classList.remove('pressed');
        this.triggerCallback();
      };
      
      btn.addEventListener('mousedown', handleStart);
      btn.addEventListener('mouseup', handleEnd);
      btn.addEventListener('mouseleave', handleEnd);
      btn.addEventListener('touchstart', handleStart);
      btn.addEventListener('touchend', handleEnd);
    });
  }

  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.up = true;
          break;
        case 's':
        case 'arrowdown':
          this.keys.down = true;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = true;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = true;
          break;
        case 'z':
        case 'j':
          this.keys.a = true;
          break;
        case 'x':
        case 'k':
          this.keys.b = true;
          break;
        case 'shift':
        case 'c':
          this.keys.select = true;
          break;
        case 'enter':
        case ' ':
        case 'v':
          this.keys.start = true;
          break;
      }
      this.triggerCallback();
    });
    
    document.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          this.keys.up = false;
          break;
        case 's':
        case 'arrowdown':
          this.keys.down = false;
          break;
        case 'a':
        case 'arrowleft':
          this.keys.left = false;
          break;
        case 'd':
        case 'arrowright':
          this.keys.right = false;
          break;
        case 'z':
        case 'j':
          this.keys.a = false;
          break;
        case 'x':
        case 'k':
          this.keys.b = false;
          break;
        case 'shift':
        case 'c':
          this.keys.select = false;
          break;
        case 'enter':
        case ' ':
        case 'v':
          this.keys.start = false;
          break;
      }
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
