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
    container.innerHTML = '\n\
      <div class=\"controller-body\">\n\
        <div class=\"dpad-section\">\n\
          <div class=\"dpad\">\n\
            <button class=\"dpad-btn up\" data-key=\"up\"></button>\n\
            <button class=\"dpad-btn left\" data-key=\"left\"></button>\n\
            <button class=\"dpad-btn center\"></button>\n\
            <button class=\"dpad-btn right\" data-key=\"right\"></button>\n\
            <button class=\"dpad-btn down\" data-key=\"down\"></button>\n\
          </div>\n\
        </div>\n\
        \n\
        <div class=\"center-section\">\n\
          <div class=\"select-start-row\">\n\
            <div class=\"btn-group\">\n\
              <button class=\"mini-btn\" data-key=\"select\">SELECT</button>\n\
              <span class=\"btn-label\">SELECT</span>\n\
            </div>\n\
            <div class=\"btn-group\">\n\
              <button class=\"mini-btn\" data-key=\"start\">START</button>\n\
              <span class=\"btn-label\">START</span>\n\
            </div>\n\
          </div>\n\
        </div>\n\
        \n\
        <div class=\"ab-section\">\n\
          <div class=\"ab-btns\">\n\
            <button class=\"ab-btn b-btn\" data-key=\"b\">B</button>\n\
            <div class=\"ab-spacer\"></div>\n\
            <button class=\"ab-btn a-btn\" data-key=\"a\">A</button>\n\
          </div>\n\
        </div>\n\
      </div>\n\
    ';
    document.body.appendChild(container);
    this.setupControllerEvents(container);
  }

  setupControllerEvents(container) {
    const buttons = container.querySelectorAll('button[data-key]');
    buttons.forEach(btn => {
      const key = btn.dataset.key;
      
      const setKeyState = (isPressed) => {
        this.keys[key] = isPressed;
        btn.classList.toggle('pressed', isPressed);
        this.triggerCallback();
      };
      
      const handleStart = (e) => {
        e.preventDefault();
        setKeyState(true);
      };
      
      const handleEnd = (e) => {
        e.preventDefault();
        setKeyState(false);
      };
      
      btn.addEventListener('mousedown', handleStart);
      btn.addEventListener('mouseup', handleEnd);
      btn.addEventListener('mouseleave', handleEnd);
      btn.addEventListener('touchstart', handleStart);
      btn.addEventListener('touchend', handleEnd);
      btn.addEventListener('touchcancel', handleEnd);
    });
  }

  setupKeyboardEvents() {
    const keyMap = {
      'w': 'up',
      'ArrowUp': 'up',
      's': 'down',
      'ArrowDown': 'down',
      'a': 'left',
      'ArrowLeft': 'left',
      'd': 'right',
      'ArrowRight': 'right',
      'z': 'a',
      'j': 'a',
      'x': 'b',
      'k': 'b',
      'Shift': 'select',
      'c': 'select',
      'Enter': 'start',
      ' ': 'start',
      'v': 'start'
    };

    const handleKey = (e, isPressed) => {
      const mappedKey = keyMap[e.key];
      if (mappedKey) {
        e.preventDefault();
        this.keys[mappedKey] = isPressed;
        this.triggerCallback();
      }
    };

    document.addEventListener('keydown', (e) => handleKey(e, true));
    document.addEventListener('keyup', (e) => handleKey(e, false));
    
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
