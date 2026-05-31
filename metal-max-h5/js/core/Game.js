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
        
        this.playerData = null;
        this.currentMap = null;
        this.gameFlags = {};
        this.playTime = 0;
        
        this.inputManager = null;
        this.audioManager = null;
        this.saveManager = null;
        
        this.worldScene = null;
        this.battleSystem = null;
        this.menuSystem = null;
        this.shopSystem = null;
        this.hospitalSystem = null;
        this.repairSystem = null;
        
        this.gameLog = [];
    }

    async init() {
        this.updateLoadingProgress(0, '初始化游戏...');
        
        this.setupCanvas();
        this.setupInput();
        
        this.updateLoadingProgress(10, '加载资源配置...');
        await this.loadGameData();
        
        this.updateLoadingProgress(30, '初始化系统...');
        this.initSystems();
        
        this.updateLoadingProgress(50, '创建世界场景...');
        await this.initWorldScene();
        
        this.updateLoadingProgress(80, '检查存档...');
        await this.checkSaveData();
        
        this.updateLoadingProgress(100, '准备完成!');
        await this.delay(500);
        
        this.hideLoadingScreen();
        this.showMobileControls();
        
        this.gameState = 'TITLE';
        
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

    async loadGameData() {
        await this.delay(100);
    }

    initSystems() {
        this.audioManager = new AudioManager();
        this.saveManager = new SaveManager(this);
        this.battleSystem = new BattleSystem(this);
        this.menuSystem = new MenuSystem(this);
        this.shopSystem = new ShopSystem(this);
        this.hospitalSystem = new HospitalSystem(this);
        this.repairSystem = new RepairSystem(this);
    }

    async initWorldScene() {
        this.worldScene = new WorldScene(this);
        await this.worldScene.init();
    }

    async checkSaveData() {
        const saves = this.saveManager.getAllSaves();
        const hasSave = saves.some(s => s !== null);
        
        if (hasSave) {
            const latestSave = saves.find(s => s !== null);
            if (latestSave) {
                this.playerData = latestSave.player;
                this.currentMap = latestSave.currentMap;
                this.gameFlags = latestSave.gameFlags || {};
                this.playTime = latestSave.playTime || 0;
            }
        } else {
            this.createNewGame();
        }
    }

    createNewGame() {
        this.playerData = JSON.parse(JSON.stringify(GAME_DATA.INITIAL_PLAYER));
        this.currentMap = 'paradise';
        this.gameFlags = {};
        this.playTime = 0;
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
        if (this.gameState === 'TITLE') {
            this.updateTitle(deltaTime);
        } else if (this.gameState === 'WORLD') {
            this.updateWorld(deltaTime);
        } else if (this.gameState === 'BATTLE') {
            this.updateBattle(deltaTime);
        } else if (this.gameState === 'MENU') {
            this.updateMenu(deltaTime);
        } else if (this.gameState === 'SHOP') {
            this.updateShop(deltaTime);
        } else if (this.gameState === 'HOSPITAL') {
            this.updateHospital(deltaTime);
        } else if (this.gameState === 'REPAIR') {
            this.updateRepair(deltaTime);
        }
    }

    updateTitle(deltaTime) {
        this.worldScene.update(deltaTime);
        
        const input = this.inputManager;
        if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
            if (!this.titleConfirmPressed) {
                this.startGame();
            }
            this.titleConfirmPressed = true;
        } else {
            this.titleConfirmPressed = false;
        }
    }

    startGame() {
        if (!this.playerData) {
            this.createNewGame();
        }
        this.gameState = 'WORLD';
        this.worldScene.loadMap(this.currentMap || 'paradise');
    }

    updateWorld(deltaTime) {
        if (this.worldScene) {
            this.worldScene.update(deltaTime);
        }
        
        const input = this.inputManager;
        
        if (input.isKeyPressed('Escape') || input.isKeyPressed('KeyK')) {
            if (!this.menuKeyPressed) {
                this.openMenu();
            }
            this.menuKeyPressed = true;
        } else {
            this.menuKeyPressed = false;
        }
    }

    updateBattle(deltaTime) {
        if (this.battleSystem) {
            const input = this.inputManager;
            
            if (input.isKeyPressed('1')) this.battleSystem.handleInput('1');
            else if (input.isKeyPressed('2')) this.battleSystem.handleInput('2');
            else if (input.isKeyPressed('3')) this.battleSystem.handleInput('3');
            else if (input.isKeyPressed('4')) this.battleSystem.handleInput('4');
            else if (input.isKeyPressed('5')) this.battleSystem.handleInput('5');
            else if (input.isKeyPressed('6')) this.battleSystem.handleInput('6');
            else if (input.isKeyPressed('7')) this.battleSystem.handleInput('7');
            else if (input.isKeyPressed('8')) this.battleSystem.handleInput('8');
            else if (input.isKeyPressed('9')) this.battleSystem.handleInput('9');
            else if (input.isKeyPressed('0')) this.battleSystem.handleInput('0');
            else if (input.isKeyPressed('Tab')) this.battleSystem.handleInput('Tab');
            
            if (this.battleSystem.state === 'victory' || this.battleSystem.state === 'game_over') {
                if (!this.battleEndKeyPressed) {
                    if (this.inputManager.isKeyPressed('Enter') || this.inputManager.isKeyPressed('KeyJ')) {
                        this.endBattle();
                    }
                }
            }
        }
    }

    endBattle() {
        if (!this.battleEndKeyPressed) {
            this.gameState = 'WORLD';
            this.battleEndKeyPressed = true;
        } else {
            this.battleEndKeyPressed = false;
        }
    }

    openMenu() {
        if (!this.menuKeyPressed) {
            this.gameState = 'MENU';
            this.menuSystem.open();
        }
    }

    updateMenu(deltaTime) {
        if (this.menuSystem.state === 'open') {
            const input = this.inputManager;
            
            if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('KeyW')) {
                this.menuSystem.selectedIndex = (this.menuSystem.selectedIndex - 1 + this.menuSystem.menuItems.length) % this.menuSystem.menuItems.length;
            } else if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('KeyS')) {
                this.menuSystem.selectedIndex = (this.menuSystem.selectedIndex + 1) % this.menuSystem.menuItems.length;
            } else if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
                const itemId = this.menuSystem.menuItems[this.menuSystem.selectedIndex].id;
                this.menuSystem.selectMenuItem(itemId);
            } else if (input.isKeyPressed('Escape') || input.isKeyPressed('KeyK')) {
                this.menuSystem.handleInput('Escape');
                if (this.menuSystem.state === 'closed') {
                    this.gameState = 'WORLD';
                }
            }
            
            if (this.menuSystem.currentMenu !== 'main') {
                this.menuSystem.handleMenuInput(
                    input.isKeyPressed('1') ? '1' :
                    input.isKeyPressed('2') ? '2' :
                    input.isKeyPressed('3') ? '3' :
                    input.isKeyPressed('0') || input.isKeyPressed('Escape') || input.isKeyPressed('KeyK') ? '0' : null
                );
            }
        }
    }

    updateShop(deltaTime) {
        if (this.shopSystem.state === 'open') {
            const input = this.inputManager;
            
            if (input.isKeyPressed('ArrowUp') || input.isKeyPressed('KeyW')) {
                this.shopSystem.selectedIndex = (this.shopSystem.selectedIndex - 1 + Math.max(1, this.shopSystem.goods.length)) % Math.max(1, this.shopSystem.goods.length);
            } else if (input.isKeyPressed('ArrowDown') || input.isKeyPressed('KeyS')) {
                this.shopSystem.selectedIndex = (this.shopSystem.selectedIndex + 1) % Math.max(1, this.shopSystem.goods.length);
            } else if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
                this.shopSystem.handleInput('Enter');
            } else if (input.isKeyPressed('Tab') || input.isKeyPressed('KeyQ')) {
                this.shopSystem.handleInput('Tab');
            } else if (input.isKeyPressed('Escape') || input.isKeyPressed('KeyK')) {
                this.shopSystem.handleInput('Escape');
                if (this.shopSystem.state === 'closed') {
                    this.gameState = 'WORLD';
                }
            }
        }
    }

    updateHospital(deltaTime) {
        if (this.hospitalSystem.state === 'open') {
            const input = this.inputManager;
            
            if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
                this.hospitalSystem.handleInput('Enter');
            } else if (input.isKeyPressed('Escape') || input.isKeyPressed('KeyK')) {
                this.hospitalSystem.handleInput('Escape');
                if (this.hospitalSystem.state === 'closed') {
                    this.gameState = 'WORLD';
                }
            }
        }
    }

    updateRepair(deltaTime) {
        if (this.repairSystem.state === 'open') {
            const input = this.inputManager;
            
            if (input.isKeyPressed('Enter') || input.isKeyPressed('KeyJ')) {
                this.repairSystem.handleInput('Enter');
            } else if (input.isKeyPressed('Escape') || input.isKeyPressed('KeyK')) {
                this.repairSystem.handleInput('Escape');
                if (this.repairSystem.state === 'closed') {
                    this.gameState = 'WORLD';
                }
            }
        }
    }

    render() {
        this.ctx.fillStyle = '#1A252F';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.gameState === 'TITLE') {
            this.renderTitle();
        } else if (this.gameState === 'WORLD' || this.gameState === 'MENU' || this.gameState === 'SHOP' || this.gameState === 'HOSPITAL' || this.gameState === 'REPAIR') {
            this.renderWorld();
            if (this.gameState === 'MENU') {
                this.menuSystem.render(this.ctx);
            } else if (this.gameState === 'SHOP') {
                this.shopSystem.render(this.ctx);
            } else if (this.gameState === 'HOSPITAL') {
                this.hospitalSystem.render(this.ctx);
            } else if (this.gameState === 'REPAIR') {
                this.repairSystem.render(this.ctx);
            }
        } else if (this.gameState === 'BATTLE') {
            this.battleSystem.render(this.ctx);
        }
        
        this.renderDebugInfo();
    }

    renderTitle() {
        if (this.worldScene) {
            this.worldScene.render(this.ctx);
        }
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const titleY = 60;
        
        this.ctx.save();
        this.ctx.shadowColor = '#F39C12';
        this.ctx.shadowBlur = 20;
        this.ctx.fillStyle = '#F39C12';
        this.ctx.font = 'bold 32px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('重装机兵', this.width / 2, titleY);
        this.ctx.restore();
        
        this.ctx.fillStyle = '#ECF0F1';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText('METAL MAX', this.width / 2, titleY + 25);
        
        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(this.width / 2 - 70, titleY + 35, 140, 2);
        
        const menuY = titleY + 70;
        const menuItems = ['开始游戏', '继续游戏', '游戏设置'];
        
        menuItems.forEach((item, index) => {
            const isSelected = this.selectedTitleIndex === index;
            const itemY = menuY + index * 25;
            
            if (isSelected) {
                this.ctx.fillStyle = '#2C3E50';
                this.ctx.fillRect(this.width / 2 - 60, itemY - 10, 120, 20);
                this.ctx.fillStyle = '#F39C12';
                this.ctx.fillText('▶', this.width / 2 - 45, itemY + 5);
            }
            
            this.ctx.fillStyle = isSelected ? '#ECF0F1' : '#7F8C8D';
            this.ctx.font = '14px Courier New';
            this.ctx.fillText(item, this.width / 2, itemY + 5);
        });
        
        this.ctx.fillStyle = '#7F8C8D';
        this.ctx.font = '10px Courier New';
        this.ctx.fillText('↑↓选择  Enter确认', this.width / 2, this.height - 30);
    }

    renderWorld() {
        if (this.worldScene) {
            this.worldScene.render(this.ctx);
        }
    }

    renderDebugInfo() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.font = '8px Courier New';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS:${this.fps} State:${this.gameState}`, 3, 8);
    }

    changeScene(sceneName) {
        if (sceneName === 'world') {
            this.gameState = 'WORLD';
        } else if (sceneName === 'battle') {
            this.gameState = 'BATTLE';
        }
    }

    startBattle(enemyIds) {
        this.gameState = 'BATTLE';
        this.battleSystem.startBattle(enemyIds);
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
        this.mobileControls.classList.remove('hidden');
    }

    isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    addLog(message) {
        this.gameLog.push(message);
        if (this.gameLog.length > 50) {
            this.gameLog.shift();
        }
    }
}

class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = new Map();
        this.dpad = { up: false, down: false, left: false, right: false };
        this.mouse = { x: 0, y: 0, down: false };
        this.touches = new Map();
        
        this.setupKeyboardListeners();
        this.setupMouseListeners();
        this.setupTouchListeners();
        this.setupDPadListeners();
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
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                this.touches.delete(touch.identifier);
            }
        });
    }

    setupDPadListeners() {
        const btnUp = document.getElementById('dpad-up');
        const btnDown = document.getElementById('dpad-down');
        const btnLeft = document.getElementById('dpad-left');
        const btnRight = document.getElementById('dpad-right');
        const btnConfirm = document.getElementById('btn-confirm');
        const btnCancel = document.getElementById('btn-cancel');
        
        const buttons = [
            { btn: btnUp, key: 'ArrowUp', dir: 'up' },
            { btn: btnDown, key: 'ArrowDown', dir: 'down' },
            { btn: btnLeft, key: 'ArrowLeft', dir: 'left' },
            { btn: btnRight, key: 'ArrowRight', dir: 'right' },
        ];
        
        buttons.forEach(({ btn, key, dir }) => {
            if (!btn) return;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys.set(key, true);
                this.dpad[dir] = true;
                btn.classList.add('active');
            });
            
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys.set(key, true);
                this.dpad[dir] = true;
                btn.classList.add('active');
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys.set(key, false);
                this.dpad[dir] = false;
                btn.classList.remove('active');
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys.set(key, false);
                this.dpad[dir] = false;
                btn.classList.remove('active');
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.keys.set(key, false);
                this.dpad[dir] = false;
                btn.classList.remove('active');
            });
        });
        
        [
            { btn: btnConfirm, key: 'KeyJ' },
            { btn: btnCancel, key: 'KeyK' },
        ].forEach(({ btn, key }) => {
            if (!btn) return;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys.set(key, true);
                btn.classList.add('active');
            });
            
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.keys.set(key, true);
                btn.classList.add('active');
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys.set(key, false);
                btn.classList.remove('active');
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.keys.set(key, false);
                btn.classList.remove('active');
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.keys.set(key, false);
                btn.classList.remove('active');
            });
        });
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
        
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA') || this.dpad.left) x -= 1;
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD') || this.dpad.right) x += 1;
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW') || this.dpad.up) y -= 1;
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS') || this.dpad.down) y += 1;
        
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

class WorldScene {
    constructor(game) {
        this.game = game;
        this.tileSize = 16;
        this.mapWidth = 20;
        this.mapHeight = 15;
        this.camera = { x: 0, y: 0 };
        this.mapData = [];
        this.collisionData = [];
        this.npcs = [];
        this.currentMapId = 'paradise';
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
        this.dialogActive = false;
        this.currentDialog = null;
        this.dialogText = '';
        this.dialogIndex = 0;
        this.dialogComplete = false;
    }

    async init() {
        this.loadMap('paradise');
    }

    loadMap(mapId) {
        this.currentMapId = mapId;
        const mapConfig = GAME_DATA.MAPS[mapId];
        
        if (mapConfig) {
            this.mapWidth = mapConfig.width;
            this.mapHeight = mapConfig.height;
            this.npcs = mapConfig.npcs.map(npcId => {
                const npcData = GAME_DATA.NPCS[npcId];
                return { ...npcData };
            });
        } else {
            this.generateRandomMap();
        }
        
        this.generateMapTerrain();
    }

    generateRandomMap() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.mapData[y] = [];
            this.collisionData[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                if (y === 0 || y === this.mapHeight - 1 || x === 0 || x === this.mapWidth - 1) {
                    this.mapData[y][x] = GAME_DATA.TILES.WALL;
                    this.collisionData[y][x] = true;
                } else if (Math.random() < 0.15) {
                    this.mapData[y][x] = GAME_DATA.TILES.TREE;
                    this.collisionData[y][x] = true;
                } else if (Math.random() < 0.02) {
                    this.mapData[y][x] = GAME_DATA.TILES.WATER;
                    this.collisionData[y][x] = true;
                } else {
                    this.mapData[y][x] = GAME_DATA.TILES.GRASS;
                    this.collisionData[y][x] = false;
                }
            }
        }
    }

    generateMapTerrain() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.mapData[y] = [];
            this.collisionData[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                if (y === 0 || y === this.mapHeight - 1 || x === 0 || x === this.mapWidth - 1) {
                    this.mapData[y][x] = GAME_DATA.TILES.WALL;
                    this.collisionData[y][x] = true;
                } else if (Math.random() < 0.1) {
                    this.mapData[y][x] = GAME_DATA.TILES.TREE;
                    this.collisionData[y][x] = true;
                } else if (Math.random() < 0.02) {
                    this.mapData[y][x] = GAME_DATA.TILES.WATER;
                    this.collisionData[y][x] = true;
                } else {
                    this.mapData[y][x] = GAME_DATA.TILES.GRASS;
                    this.collisionData[y][x] = false;
                }
            }
        }
        
        if (this.currentMapId === 'paradise') {
            for (let y = 3; y < 10; y++) {
                for (let x = 3; x < 17; x++) {
                    this.mapData[y][x] = GAME_DATA.TILES.FLOOR;
                    this.collisionData[y][x] = false;
                }
            }
        }
    }

    update(deltaTime) {
        if (this.dialogActive) {
            this.updateDialog(deltaTime);
            return;
        }
        
        this.updatePlayer(deltaTime);
        this.updateCamera();
        this.checkNPCInteraction();
        this.checkRandomBattle();
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
                    case 'up': checkY -= this.tileSize; break;
                    case 'down': checkY += this.tileSize; break;
                    case 'left': checkX -= this.tileSize; break;
                    case 'right': checkX += this.tileSize; break;
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

    checkRandomBattle() {
        if (this.currentMapId === 'world' && Math.random() < 0.002) {
            const enemies = ['rat', 'worm', 'dog', 'soldier'];
            const enemyCount = Math.floor(Math.random() * 2) + 1;
            const battleEnemies = [];
            
            for (let i = 0; i < enemyCount; i++) {
                battleEnemies.push(enemies[Math.floor(Math.random() * enemies.length)]);
            }
            
            this.game.startBattle(battleEnemies);
        }
    }

    startDialog(npc) {
        this.dialogActive = true;
        this.currentDialog = npc.dialog;
        this.dialogText = '';
        this.dialogIndex = 0;
        this.dialogComplete = false;
        this.currentNPC = npc;
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
                    this.endDialog();
                } else {
                    this.dialogComplete = false;
                }
            }
            this.dialogConfirmPressed = true;
        } else {
            this.dialogConfirmPressed = false;
        }
    }

    endDialog() {
        this.dialogActive = false;
        this.currentDialog = null;
        
        if (this.currentNPC) {
            switch (this.currentNPC.type) {
                case 'shop':
                    this.game.gameState = 'SHOP';
                    this.game.shopSystem.open('general');
                    break;
                case 'hospital':
                    this.game.gameState = 'HOSPITAL';
                    this.game.hospitalSystem.open();
                    break;
                case 'repair':
                    this.game.gameState = 'REPAIR';
                    this.game.repairSystem.open();
                    break;
            }
        }
        
        this.currentNPC = null;
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
                    case GAME_DATA.TILES.GRASS:
                        ctx.fillStyle = '#27AE60';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#2ECC71';
                        ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
                        break;
                    case GAME_DATA.TILES.WALL:
                        ctx.fillStyle = '#5D6D7E';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#85929E';
                        ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
                        break;
                    case GAME_DATA.TILES.TREE:
                        ctx.fillStyle = '#27AE60';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#1E8449';
                        ctx.fillRect(screenX + 4, screenY + 2, 8, 12);
                        ctx.fillStyle = '#196F3D';
                        ctx.fillRect(screenX + 6, screenY, 4, 6);
                        break;
                    case GAME_DATA.TILES.WATER:
                        ctx.fillStyle = '#3498DB';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#5DADE2';
                        ctx.fillRect(screenX + 2, screenY + 4, 6, 2);
                        break;
                    case GAME_DATA.TILES.FLOOR:
                        ctx.fillStyle = '#BDC3C7';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#D5DBDB';
                        ctx.fillRect(screenX + 1, screenY + 1, 6, 6);
                        break;
                    default:
                        ctx.fillStyle = '#27AE60';
                        ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
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
            
            this.renderPixelCharacter(ctx, screenX, screenY, npc.color, false);
        }
    }

    renderPlayer(ctx) {
        const screenX = this.player.x - this.camera.x;
        const screenY = this.player.y - this.camera.y;
        
        this.renderPixelCharacter(ctx, screenX, screenY, '#3498DB', true, this.player.direction, this.player.frame);
        
        let indicatorX = screenX + 8;
        let indicatorY = screenY - 4;
        
        switch (this.player.direction) {
            case 'up': indicatorY = screenY - 4; break;
            case 'down': indicatorY = screenY + 16; break;
            case 'left': indicatorX = screenX - 4; indicatorY = screenY + 6; break;
            case 'right': indicatorX = screenX + 16; indicatorY = screenY + 6; break;
        }
        
        ctx.fillStyle = '#F39C12';
        ctx.beginPath();
        ctx.moveTo(indicatorX, indicatorY);
        ctx.lineTo(indicatorX - 3, indicatorY - 5);
        ctx.lineTo(indicatorX + 3, indicatorY - 5);
        ctx.closePath();
        ctx.fill();
    }

    renderPixelCharacter(ctx, x, y, mainColor, isPlayer, direction = 'down', frame = 0) {
        const bodyColor = mainColor;
        const darkColor = this.darkenColor(mainColor, 30);
        const skinColor = '#FFD5AA';
        const hairColor = isPlayer ? '#8B4513' : '#4A4A4A';
        
        const bob = frame % 2 === 0 ? 0 : -1;
        
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + 3, y + 8 + bob, 10, 6);
        ctx.fillRect(x + 4, y + 5 + bob, 8, 3);
        
        ctx.fillStyle = darkColor;
        ctx.fillRect(x + 3, y + 12 + bob, 10, 2);
        
        ctx.fillStyle = skinColor;
        ctx.fillRect(x + 4, y + 1 + bob, 8, 7);
        
        ctx.fillStyle = hairColor;
        ctx.fillRect(x + 3, y + bob, 10, 4);
        ctx.fillRect(x + 4, y - 1 + bob, 8, 2);
        
        ctx.fillStyle = '#000000';
        if (direction === 'left') {
            ctx.fillRect(x + 4, y + 3 + bob, 2, 2);
            ctx.fillRect(x + 7, y + 3 + bob, 2, 2);
        } else if (direction === 'right') {
            ctx.fillRect(x + 5, y + 3 + bob, 2, 2);
            ctx.fillRect(x + 8, y + 3 + bob, 2, 2);
        } else {
            ctx.fillRect(x + 5, y + 3 + bob, 2, 2);
            ctx.fillRect(x + 9, y + 3 + bob, 2, 2);
        }
        
        ctx.fillStyle = darkColor;
        if (frame % 2 === 0) {
            ctx.fillRect(x + 4, y + 14 + bob, 3, 2);
            ctx.fillRect(x + 9, y + 14 + bob, 3, 2);
        } else {
            ctx.fillRect(x + 4, y + 15 + bob, 3, 2);
            ctx.fillRect(x + 9, y + 13 + bob, 3, 2);
        }
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    renderUI(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.game.width, 24);
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        
        if (this.game.playerData) {
            ctx.fillText(`${this.game.playerData.name} Lv${this.game.playerData.level}`, 5, 10);
            ctx.fillText(`HP:${this.game.playerData.hp}/${this.game.playerData.maxHp}`, 5, 20);
            ctx.fillText(`G:${this.game.playerData.gold}`, 100, 10);
            
            ctx.fillStyle = '#333';
            ctx.fillRect(150, 4, 60, 8);
            ctx.fillStyle = '#E74C3C';
            ctx.fillRect(150, 4, 60 * (this.game.playerData.hp / this.game.playerData.maxHp), 8);
        }
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '8px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText(`[${GAME_DATA.MAPS[this.currentMapId]?.name || '未知'}]`, this.game.width - 5, 16);
    }

    renderDialog(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(10, this.game.height - 70, this.game.width - 20, 60);
        
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, this.game.height - 70, this.game.width - 20, 60);
        
        if (this.currentNPC) {
            ctx.fillStyle = this.currentNPC.color || '#3498DB';
            ctx.fillRect(15, this.game.height - 65, 80, 16);
            ctx.fillStyle = '#FFF';
            ctx.font = '10px Courier New';
            ctx.fillText(this.currentNPC.name, 20, this.game.height - 54);
        }
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        
        const maxWidth = this.game.width - 40;
        const words = this.dialogText.split('');
        let line = '';
        let y = this.game.height - 40;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, 20, y);
                line = words[i];
                y += 14;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 20, y);
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText('▼ Enter继续', this.game.width - 20, this.game.height - 18);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init().catch(console.error);
});
