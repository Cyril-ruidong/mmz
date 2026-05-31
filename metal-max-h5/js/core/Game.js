class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mobileControls = document.getElementById('mobile-controls');
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.loadingText = document.getElementById('loading-text');
        
        this.width = 320;
        this.height = 240;
        this.scale = 3;
        
        this.gameState = 'LOADING';
        this.lastTime = 0;
        this.deltaTime = 0;
        this.fps = 0;
        
        this.scenes = new Map();
        this.currentScene = null;
        
        this.inputManager = null;
        this.audioManager = null;
        
        this.loadedAssets = new Map();
        this.totalAssets = 0;
        this.loadedCount = 0;
    }

    async init() {
        this.updateLoadingProgress(0, '初始化游戏...');
        
        this.setupCanvas();
        this.setupInput();
        
        await this.loadAssets();
        
        this.updateLoadingProgress(80, '初始化系统...');
        await this.initSystems();
        
        this.updateLoadingProgress(90, '创建场景...');
        await this.initScenes();
        
        this.updateLoadingProgress(100, '准备完成!');
        await this.delay(500);
        
        this.hideLoadingScreen();
        this.showMobileControls();
        
        this.gameState = 'TITLE';
        this.currentScene = this.scenes.get('title');
        
        this.gameLoop(0);
    }

    setupCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width * this.scale}px`;
        this.canvas.style.height = `${this.height * this.scale}px`;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const gameAspect = this.width / this.height;
        const containerAspect = containerWidth / containerHeight;
        
        if (containerAspect > gameAspect) {
            this.scale = Math.floor(containerHeight / this.height);
        } else {
            this.scale = Math.floor(containerWidth / this.width);
        }
        
        this.scale = Math.max(1, Math.min(this.scale, 4));
        
        this.canvas.style.width = `${this.width * this.scale}px`;
        this.canvas.style.height = `${this.height * this.scale}px`;
    }

    setupInput() {
        this.inputManager = new InputManager(this.canvas);
    }

    async loadAssets() {
        this.totalAssets = 5;
        this.loadedCount = 0;
        
        this.updateLoadingProgress(
            (this.loadedCount / this.totalAssets) * 70,
            `加载资源 ${this.loadedCount}/${this.totalAssets}...`
        );
        
        await this.loadImage('tileset', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        this.loadedCount++;
        this.updateLoadingProgress((this.loadedCount / this.totalAssets) * 70, '加载瓦片资源...');
        
        await this.loadImage('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==');
        this.loadedCount++;
        this.updateLoadingProgress((this.loadedCount / this.totalAssets) * 70, '加载角色资源...');
        
        await this.loadImage('ui', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        this.loadedCount++;
        this.updateLoadingProgress((this.loadedCount / this.totalAssets) * 70, '加载UI资源...');
        
        await this.loadImage('npc', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        this.loadedCount++;
        this.updateLoadingProgress((this.loadedCount / this.totalAssets) * 70, '加载NPC资源...');
        
        await this.loadImage('enemy', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        this.loadedCount++;
    }

    loadImage(name, src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.loadedAssets.set(name, img);
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${name}`);
                resolve();
            };
            img.src = src;
        });
    }

    async initSystems() {
        this.audioManager = new AudioManager();
    }

    async initScenes() {
        const titleScene = new TitleScene(this);
        await titleScene.init();
        this.scenes.set('title', titleScene);
        
        const worldScene = new WorldScene(this);
        await worldScene.init();
        this.scenes.set('world', worldScene);
    }

    gameLoop(timestamp) {
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.fps = Math.round(1000 / this.deltaTime);
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    render() {
        this.ctx.fillStyle = '#1A252F';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.currentScene) {
            this.currentScene.render(this.ctx);
        }
        
        this.renderDebugInfo();
    }

    renderDebugInfo() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '10px Courier New';
        this.ctx.fillText(`FPS: ${this.fps}`, 5, 10);
        this.ctx.fillText(`State: ${this.gameState}`, 5, 20);
    }

    changeScene(sceneName) {
        if (this.scenes.has(sceneName)) {
            this.currentScene = this.scenes.get(sceneName);
            this.gameState = sceneName.toUpperCase();
        }
    }

    updateLoadingProgress(percent, text) {
        this.loadingProgress.style.width = `${percent}%`;
        this.loadingText.textContent = text;
    }

    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
    }

    showLoadingScreen() {
        this.loadingScreen.classList.remove('hidden');
    }

    showMobileControls() {
        if (this.isTouchDevice()) {
            this.mobileControls.classList.remove('hidden');
        } else {
            this.mobileControls.classList.add('hidden');
        }
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = new Map();
        this.joystick = { x: 0, y: 0, active: false };
        this.mouse = { x: 0, y: 0, down: false };
        this.touches = new Map();
        
        this.setupKeyboardListeners();
        this.setupMouseListeners();
        this.setupTouchListeners();
        this.setupJoystickListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.set(e.code, true);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
        });
    }

    setupMouseListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.updateMousePosition(e);
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.mouse.down) {
                this.updateMousePosition(e);
            }
        });
    }

    setupTouchListeners() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.set(touch.identifier, {
                    x: touch.clientX,
                    y: touch.clientY
                });
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                if (this.touches.has(touch.identifier)) {
                    this.touches.set(touch.identifier, {
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
    }

    setupJoystickListeners() {
        const joystickBase = document.getElementById('joystick-base');
        const joystickThumb = document.getElementById('joystick-thumb');
        const btnConfirm = document.getElementById('btn-confirm');
        const btnCancel = document.getElementById('btn-cancel');
        
        if (!joystickBase) return;
        
        let joystickTouch = null;
        const baseRect = { centerX: 0, centerY: 0, radius: 40 };
        
        joystickBase.parentElement.addEventListener('touchstart', (e) => {
            if (joystickTouch !== null) return;
            
            const touch = e.changedTouches[0];
            const rect = joystickBase.parentElement.getBoundingClientRect();
            baseRect.centerX = rect.left + rect.width / 2;
            baseRect.centerY = rect.top + rect.height / 2;
            
            joystickTouch = touch.identifier;
            joystickBase.classList.add('active');
            this.updateJoystick(touch.clientX, touch.clientY, baseRect, joystickThumb);
        });
        
        joystickBase.parentElement.addEventListener('touchmove', (e) => {
            if (joystickTouch === null) return;
            
            for (let touch of e.changedTouches) {
                if (touch.identifier === joystickTouch) {
                    this.updateJoystick(touch.clientX, touch.clientY, baseRect, joystickThumb);
                    break;
                }
            }
        });
        
        joystickBase.parentElement.addEventListener('touchend', (e) => {
            for (let touch of e.changedTouches) {
                if (touch.identifier === joystickTouch) {
                    joystickTouch = null;
                    joystickBase.classList.remove('active');
                    this.joystick.x = 0;
                    this.joystick.y = 0;
                    this.joystick.active = false;
                    joystickThumb.style.transform = 'translate(-50%, -50%)';
                    break;
                }
            }
        });
        
        btnConfirm.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.set('KeyJ', true);
        });
        
        btnConfirm.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.set('KeyJ', false);
        });
        
        btnCancel.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys.set('KeyK', true);
        });
        
        btnCancel.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys.set('KeyK', false);
        });
    }

    updateJoystick(touchX, touchY, baseRect, thumb) {
        const dx = touchX - baseRect.centerX;
        const dy = touchY - baseRect.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = baseRect.radius;
        
        let clampedX = dx;
        let clampedY = dy;
        
        if (distance > maxDistance) {
            clampedX = (dx / distance) * maxDistance;
            clampedY = (dy / distance) * maxDistance;
        }
        
        thumb.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
        
        this.joystick.x = clampedX / maxDistance;
        this.joystick.y = clampedY / maxDistance;
        this.joystick.active = true;
    }

    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    isKeyPressed(code) {
        return this.keys.get(code) === true;
    }

    getMovementVector() {
        let x = 0;
        let y = 0;
        
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) x -= 1;
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) x += 1;
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) y -= 1;
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) y += 1;
        
        if (this.joystick.active) {
            const deadzone = 0.2;
            if (Math.abs(this.joystick.x) > deadzone) x = this.joystick.x;
            if (Math.abs(this.joystick.y) > deadzone) y = this.joystick.y;
        }
        
        const length = Math.sqrt(x * x + y * y);
        if (length > 1) {
            x /= length;
            y /= length;
        }
        
        return { x, y };
    }
}

class AudioManager {
    constructor() {
        this.bgmVolume = 0.5;
        this.seVolume = 0.7;
        this.bgm = null;
        this.enabled = true;
    }

    playBGM(src) {
        if (!this.enabled) return;
        
        if (this.bgm) {
            this.bgm.pause();
        }
        
        this.bgm = new Audio(src);
        this.bgm.volume = this.bgmVolume;
        this.bgm.loop = true;
        this.bgm.play().catch(() => {});
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm = null;
        }
    }

    playSE(src) {
        if (!this.enabled) return;
        
        const se = new Audio(src);
        se.volume = this.seVolume;
        se.play().catch(() => {});
    }

    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.bgmVolume;
        }
    }

    setSEVolume(volume) {
        this.seVolume = Math.max(0, Math.min(1, volume));
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopBGM();
        }
        return this.enabled;
    }
}

class Scene {
    constructor(game) {
        this.game = game;
        this.initialized = false;
    }

    async init() {
        this.initialized = true;
    }

    update(deltaTime) {}

    render(ctx) {}
}

class TitleScene extends Scene {
    constructor(game) {
        super(game);
        this.selectedIndex = 0;
        this.menuItems = ['开始游戏', '继续游戏', '游戏设置'];
        this.blinkTimer = 0;
        this.showCursor = true;
        this.animationTimer = 0;
    }

    async init() {
        await super.init();
    }

    update(deltaTime) {
        this.blinkTimer += deltaTime;
        if (this.blinkTimer > 500) {
            this.blinkTimer = 0;
            this.showCursor = !this.showCursor;
        }
        
        this.animationTimer += deltaTime;
        
        const input = this.game.inputManager;
        
        if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('KeyW')) {
            if (!this.upPressed) {
                this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
                this.game.audioManager.playSE('');
            }
            this.upPressed = true;
        } else {
            this.upPressed = false;
        }
        
        if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('KeyS')) {
            if (!this.downPressed) {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
                this.game.audioManager.playSE('');
            }
            this.downPressed = true;
        } else {
            this.downPressed = false;
        }
        
        if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
            if (!this.confirmPressed) {
                this.selectMenu();
            }
            this.confirmPressed = true;
        } else {
            this.confirmPressed = false;
        }
    }

    selectMenu() {
        switch (this.selectedIndex) {
            case 0:
                this.game.changeScene('world');
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }

    render(ctx) {
        ctx.fillStyle = '#1A252F';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        this.renderBackground(ctx);
        
        this.renderTitle(ctx);
        
        this.renderMenu(ctx);
    }

    renderBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.game.height);
        gradient.addColorStop(0, '#1A252F');
        gradient.addColorStop(1, '#2C3E50');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < this.game.width; i += 16) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.game.height);
            ctx.stroke();
        }
        for (let i = 0; i < this.game.height; i += 16) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(this.game.width, i);
            ctx.stroke();
        }
    }

    renderTitle(ctx) {
        const wave = Math.sin(this.animationTimer / 500) * 2;
        
        ctx.save();
        ctx.shadowColor = '#F39C12';
        ctx.shadowBlur = 20 + wave * 2;
        
        ctx.fillStyle = '#F39C12';
        ctx.font = 'bold 28px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('重装机兵', this.game.width / 2, 60 + wave);
        
        ctx.restore();
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('METAL MAX - H5', this.game.width / 2, 80);
        
        ctx.fillStyle = '#34495E';
        ctx.fillRect(this.game.width / 2 - 60, 90, 120, 2);
    }

    renderMenu(ctx) {
        const startY = 120;
        const lineHeight = 20;
        
        for (let i = 0; i < this.menuItems.length; i++) {
            const y = startY + i * lineHeight;
            const isSelected = i === this.selectedIndex;
            
            if (isSelected) {
                ctx.fillStyle = '#2C3E50';
                ctx.fillRect(this.game.width / 2 - 50, y - 12, 100, 18);
                
                if (this.showCursor) {
                    ctx.fillStyle = '#F39C12';
                    ctx.fillText('▶', this.game.width / 2 - 40, y);
                }
            }
            
            ctx.fillStyle = isSelected ? '#ECF0F1' : '#7F8C8D';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(this.menuItems[i], this.game.width / 2, y);
        }
        
        ctx.fillStyle = '#34495E';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('方向键移动 | Enter确认', this.game.width / 2, this.game.height - 20);
    }
}

class WorldScene extends Scene {
    constructor(game) {
        super(game);
        this.tileSize = 16;
        this.mapWidth = 20;
        this.mapHeight = 15;
        
        this.camera = { x: 0, y: 0 };
        
        this.player = {
            x: 160,
            y: 120,
            width: 16,
            height: 16,
            speed: 60,
            direction: 'down',
            moving: false,
            frame: 0,
            frameTimer: 0
        };
        
        this.mapData = [];
        this.collisionData = [];
        this.npcs = [];
        
        this.dialogActive = false;
        this.currentDialog = null;
        this.dialogText = '';
        this.dialogIndex = 0;
        this.dialogComplete = false;
    }

    async init() {
        this.generateMap();
        await super.init();
    }

    generateMap() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.mapData[y] = [];
            this.collisionData[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                if (y === 0 || y === this.mapHeight - 1 || x === 0 || x === this.mapWidth - 1) {
                    this.mapData[y][x] = 1;
                    this.collisionData[y][x] = true;
                } else if (Math.random() < 0.1) {
                    this.mapData[y][x] = 2;
                    this.collisionData[y][x] = true;
                } else {
                    this.mapData[y][x] = 0;
                    this.collisionData[y][x] = false;
                }
            }
        }
        
        for (let y = 3; y < 8; y++) {
            for (let x = 3; x < 8; x++) {
                this.mapData[y][x] = 0;
                this.collisionData[y][x] = false;
            }
        }
        
        this.mapData[10][15] = 3;
        this.collisionData[10][15] = false;
        
        this.npcs = [
            {
                x: 5 * this.tileSize,
                y: 5 * this.tileSize,
                width: 16,
                height: 16,
                name: '村民',
                color: '#3498DB',
                dialog: ['欢迎来到重装机兵的世界！', '在这里你可以探索世界，', '与敌人战斗，成为最强的赏金猎人！']
            },
            {
                x: 12 * this.tileSize,
                y: 8 * this.tileSize,
                width: 16,
                height: 16,
                name: '商人',
                color: '#E74C3C',
                dialog: ['需要道具吗？', '这里有各种装备和药品出售！']
            }
        ];
    }

    update(deltaTime) {
        if (this.dialogActive) {
            this.updateDialog(deltaTime);
            return;
        }
        
        this.updatePlayer(deltaTime);
        this.updateCamera();
        this.checkNPCInteraction();
    }

    updatePlayer(deltaTime) {
        const input = this.game.inputManager;
        const movement = input.getMovementVector();
        
        if (movement.x !== 0 || movement.y !== 0) {
            this.player.moving = true;
            
            if (movement.x < 0) this.player.direction = 'left';
            else if (movement.x > 0) this.player.direction = 'right';
            else if (movement.y < 0) this.player.direction = 'up';
            else if (movement.y > 0) this.player.direction = 'down';
            
            const moveAmount = this.player.speed * (deltaTime / 1000);
            let newX = this.player.x + movement.x * moveAmount;
            let newY = this.player.y + movement.y * moveAmount;
            
            if (!this.checkCollision(newX, this.player.y)) {
                this.player.x = newX;
            }
            if (!this.checkCollision(this.player.x, newY)) {
                this.player.y = newY;
            }
            
            this.player.frameTimer += deltaTime;
            if (this.player.frameTimer > 200) {
                this.player.frameTimer = 0;
                this.player.frame = (this.player.frame + 1) % 4;
            }
        } else {
            this.player.moving = false;
            this.player.frame = 0;
        }
    }

    checkCollision(x, y) {
        const tileX1 = Math.floor(x / this.tileSize);
        const tileY1 = Math.floor(y / this.tileSize);
        const tileX2 = Math.floor((x + this.player.width - 1) / this.tileSize);
        const tileY2 = Math.floor((y + this.player.height - 1) / this.tileSize);
        
        for (let ty = tileY1; ty <= tileY2; ty++) {
            for (let tx = tileX1; tx <= tileX2; tx++) {
                if (ty < 0 || ty >= this.mapHeight || tx < 0 || tx >= this.mapWidth) {
                    return true;
                }
                if (this.collisionData[ty] && this.collisionData[ty][tx]) {
                    return true;
                }
            }
        }
        
        for (const npc of this.npcs) {
            if (this.checkOverlap(x, y, this.player.width, this.player.height,
                                   npc.x, npc.y, npc.width, npc.height)) {
                return true;
            }
        }
        
        return false;
    }

    checkOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }

    updateCamera() {
        this.camera.x = this.player.x - this.game.width / 2 + this.player.width / 2;
        this.camera.y = this.player.y - this.game.height / 2 + this.player.height / 2;
        
        this.camera.x = Math.max(0, Math.min(this.camera.x, 
            this.mapWidth * this.tileSize - this.game.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, 
            this.mapHeight * this.tileSize - this.game.height));
    }

    checkNPCInteraction() {
        const input = this.game.inputManager;
        
        if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
            if (!this.interactPressed) {
                const checkX = this.player.x;
                const checkY = this.player.y;
                
                switch (this.player.direction) {
                    case 'up': 
                        checkY -= this.tileSize;
                        break;
                    case 'down':
                        checkY += this.tileSize;
                        break;
                    case 'left':
                        checkX -= this.tileSize;
                        break;
                    case 'right':
                        checkX += this.tileSize;
                        break;
                }
                
                for (const npc of this.npcs) {
                    if (this.checkOverlap(checkX, checkY, this.player.width, this.player.height,
                                          npc.x, npc.y, npc.width, npc.height)) {
                        this.startDialog(npc);
                        break;
                    }
                }
            }
            this.interactPressed = true;
        } else {
            this.interactPressed = false;
        }
    }

    startDialog(npc) {
        this.dialogActive = true;
        this.currentDialog = npc.dialog;
        this.dialogText = '';
        this.dialogIndex = 0;
        this.dialogComplete = false;
    }

    updateDialog(deltaTime) {
        const input = this.game.inputManager;
        
        if (!this.dialogComplete) {
            this.dialogText = this.currentDialog[this.dialogIndex];
            this.dialogComplete = true;
        }
        
        if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ') || 
            input.isKeyPressed('Space') || input.isKeyPressed('KeyK')) {
            if (!this.dialogConfirmPressed) {
                this.dialogIndex++;
                if (this.dialogIndex >= this.currentDialog.length) {
                    this.dialogActive = false;
                    this.currentDialog = null;
                } else {
                    this.dialogComplete = false;
                }
            }
            this.dialogConfirmPressed = true;
        } else {
            this.dialogConfirmPressed = false;
        }
    }

    render(ctx) {
        ctx.fillStyle = '#1A252F';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        this.renderMap(ctx);
        this.renderNPCs(ctx);
        this.renderPlayer(ctx);
        this.renderUI(ctx);
        
        if (this.dialogActive) {
            this.renderDialog(ctx);
        }
    }

    renderMap(ctx) {
        const startX = Math.floor(this.camera.x / this.tileSize);
        const startY = Math.floor(this.camera.y / this.tileSize);
        const endX = startX + Math.ceil(this.game.width / this.tileSize) + 1;
        const endY = startY + Math.ceil(this.game.height / this.tileSize) + 1;
        
        for (let y = startY; y < endY && y < this.mapHeight; y++) {
            for (let x = startX; x < endX && x < this.mapWidth; x++) {
                if (y < 0 || x < 0) continue;
                
                const screenX = x * this.tileSize - this.camera.x;
                const screenY = y * this.tileSize - this.camera.y;
                const tile = this.mapData[y][x];
                
                switch (tile) {
                    case 0:
                        ctx.fillStyle = '#27AE60';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#2ECC71';
                        ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
                        ctx.fillRect(screenX + 10, screenY + 8, 3, 3);
                        break;
                    case 1:
                        ctx.fillStyle = '#5D6D7E';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#85929E';
                        ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
                        break;
                    case 2:
                        ctx.fillStyle = '#7F8C8D';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#566573';
                        ctx.fillRect(screenX + 4, screenY + 2, 8, 12);
                        break;
                    case 3:
                        ctx.fillStyle = '#F39C12';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#E67E22';
                        ctx.fillRect(screenX + 2, screenY + 2, 12, 12);
                        break;
                }
                
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }
    }

    renderNPCs(ctx) {
        for (const npc of this.npcs) {
            const screenX = npc.x - this.camera.x;
            const screenY = npc.y - this.camera.y;
            
            ctx.fillStyle = npc.color;
            ctx.fillRect(screenX, screenY, npc.width, npc.height);
            
            ctx.fillStyle = '#F1C40F';
            ctx.fillRect(screenX + 4, screenY + 4, 3, 3);
            ctx.fillRect(screenX + 9, screenY + 4, 3, 3);
            
            ctx.fillStyle = '#2C3E50';
            ctx.fillRect(screenX + 5, screenY + 10, 6, 3);
        }
    }

    renderPlayer(ctx) {
        const screenX = this.player.x - this.camera.x;
        const screenY = this.player.y - this.camera.y;
        
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(screenX, screenY, this.player.width, this.player.height);
        
        ctx.fillStyle = '#2980B9';
        ctx.fillRect(screenX + 2, screenY + 2, 12, 12);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX + 4, screenY + 4, 3, 3);
        ctx.fillRect(screenX + 9, screenY + 4, 3, 3);
        
        let indicatorX = screenX + 8;
        let indicatorY = screenY - 4;
        
        switch (this.player.direction) {
            case 'up':
                indicatorY = screenY - 4;
                break;
            case 'down':
                indicatorY = screenY + 16;
                break;
            case 'left':
                indicatorX = screenX - 4;
                indicatorY = screenY + 6;
                break;
            case 'right':
                indicatorX = screenX + 16;
                indicatorY = screenY + 6;
                break;
        }
        
        ctx.fillStyle = '#F39C12';
        ctx.beginPath();
        ctx.moveTo(indicatorX, indicatorY);
        ctx.lineTo(indicatorX - 3, indicatorY - 5);
        ctx.lineTo(indicatorX + 3, indicatorY - 5);
        ctx.closePath();
        ctx.fill();
    }

    renderUI(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, 24);
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText('HP: 100/100', 10, 16);
        
        ctx.fillStyle = '#F39C12';
        ctx.fillRect(80, 6, 50, 12);
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(80, 6, 50, 12);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#F39C12';
        ctx.fillText('G: 0', this.game.width - 10, 16);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.game.width - 60, 30, 50, 50);
        ctx.strokeStyle = '#34495E';
        ctx.strokeRect(this.game.width - 60, 30, 50, 50);
        
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '8px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('小地图', this.game.width - 35, 88);
    }

    renderDialog(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(10, this.game.height - 60, this.game.width - 20, 50);
        
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, this.game.height - 60, this.game.width - 20, 50);
        
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(15, this.game.height - 55, 60, 12);
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '10px Courier New';
        ctx.fillText('???', 20, this.game.height - 47);
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        
        const maxWidth = this.game.width - 40;
        const words = this.dialogText.split('');
        let line = '';
        let y = this.game.height - 35;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, 20, y);
                line = words[i];
                y += 16;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 20, y);
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText('▼ 按Enter继续', this.game.width - 20, this.game.height - 15);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init().catch(console.error);
});
