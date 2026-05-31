class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mobileControls = document.getElementById('mobile-controls');
        
        this.width = 256;
        this.height = 240;
        this.scale = 3;
        
        this.gameState = 'TITLE';
        this.lastTime = 0;
        this.fps = 0;
        
        this.player = null;
        this.party = [];
        this.tanks = [];
        this.activeTank = 0;
        this.gold = 500;
        this.experience = 0;
        this.level = 1;
        
        this.currentMap = 'riolado';
        this.mapData = null;
        this.camera = { x: 0, y: 0 };
        
        this.input = {
            up: false, down: false, left: false, right: false,
            confirm: false, cancel: false
        };
        this.inputPressed = {
            up: false, down: false, left: false, right: false,
            confirm: false, cancel: false
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupInput();
        this.createPlayer();
        this.loadMap('riolado');
        window.gameInstance = this;
        
        this.gameLoop(0);
        this.showMobileControls();
    }
    
    setupCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width * this.scale}px`;
        this.canvas.style.height = `${this.height * this.scale}px`;
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        const buttons = {
            'btn-up': 'up',
            'btn-down': 'down',
            'btn-left': 'left',
            'btn-right': 'right',
            'btn-confirm': 'confirm',
            'btn-cancel': 'cancel'
        };
        
        Object.keys(buttons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.input[buttons[btnId]] = true;
                    btn.classList.add('active');
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.input[buttons[btnId]] = false;
                    btn.classList.remove('active');
                });
                btn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.input[buttons[btnId]] = true;
                    btn.classList.add('active');
                });
                btn.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.input[buttons[btnId]] = false;
                    btn.classList.remove('active');
                });
                btn.addEventListener('mouseleave', () => {
                    this.input[buttons[btnId]] = false;
                    btn.classList.remove('active');
                });
            }
        });
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp': case 'KeyW': this.input.up = true; break;
            case 'ArrowDown': case 'KeyS': this.input.down = true; break;
            case 'ArrowLeft': case 'KeyA': this.input.left = true; break;
            case 'ArrowRight': case 'KeyD': this.input.right = true; break;
            case 'KeyZ': case 'Enter': case 'Space': this.input.confirm = true; break;
            case 'KeyX': case 'Escape': this.input.cancel = true; break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp': case 'KeyW': this.input.up = false; break;
            case 'ArrowDown': case 'KeyS': this.input.down = false; break;
            case 'ArrowLeft': case 'KeyA': this.input.left = false; break;
            case 'ArrowRight': case 'KeyD': this.input.right = false; break;
            case 'KeyZ': case 'Enter': case 'Space': this.input.confirm = false; break;
            case 'KeyX': case 'Escape': this.input.cancel = false; break;
        }
    }
    
    createPlayer() {
        this.player = {
            x: 13 * 16,
            y: 14 * 16,
            direction: 'down',
            walking: false,
            walkFrame: 0,
            walkTimer: 0,
            hp: 100,
            maxHp: 100,
            mp: 30,
            maxMp: 30,
            attack: 10,
            defense: 5
        };
        
        this.party.push(this.player);
    }
    
    loadMap(mapName) {
        this.currentMap = mapName;
        
        if (mapName === 'riolado') {
            this.mapData = {
                width: 24,
                height: 15,
                tiles: [],
                npcs: [
                    { x: 14, y: 10, name: '村庄守卫', type: 'young_man', dialog: ['这里是拉多镇。', '欢迎来到这里！'] },
                    { x: 11, y: 5, name: '游荡青年', type: 'young_man', dialog: ['听说附近有战车呢。'] },
                    { x: 2, y: 11, name: '废铁大叔', type: 'uncle_dark_blue', dialog: ['我这里能修东西。'] },
                    { x: 19, y: 6, name: '看河女士', type: 'lady_dark_blue', dialog: ['这河边风景不错。'] },
                    { x: 5, y: 5, name: '酒吧门口的人', type: 'young_man', dialog: ['里面可以休息。'] }
                ]
            };
            
            for (let y = 0; y < this.mapData.height; y++) {
                this.mapData.tiles[y] = [];
                for (let x = 0; x < this.mapData.width; x++) {
                    if (y === 0 || y === this.mapData.height - 1 || x === 0 || x === this.mapData.width - 1) {
                        this.mapData.tiles[y][x] = 'wall';
                    } else if ((x >= 3 && x <= 20 && y >= 2 && y <= 12) && 
                             !(x >= 7 && x <= 10 && y >= 6 && y <= 8)) {
                        this.mapData.tiles[y][x] = 'floor';
                    } else {
                        this.mapData.tiles[y][x] = 'grass';
                    }
                }
            }
        }
    }
    
    showMobileControls() {
        this.mobileControls.classList.remove('hidden');
    }
    
    gameLoop(timestamp) {
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.fps = Math.round(1000 / delta);
        
        this.update(delta);
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(delta) {
        if (this.gameState === 'TITLE') {
            this.updateTitle(delta);
        } else if (this.gameState === 'WORLD') {
            this.updateWorld(delta);
        }
    }
    
    updateTitle(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.gameState = 'WORLD';
        }
        
        Object.keys(this.input).forEach(key => {
            this.inputPressed[key] = this.input[key];
        });
    }
    
    updateWorld(delta) {
        this.updatePlayer(delta);
        this.updateCamera();
        this.checkInteractions();
        
        Object.keys(this.input).forEach(key => {
            this.inputPressed[key] = this.input[key];
        });
    }
    
    updatePlayer(delta) {
        let dx = 0, dy = 0;
        
        if (this.input.up) dy = -1;
        if (this.input.down) dy = 1;
        if (this.input.left) dx = -1;
        if (this.input.right) dx = 1;
        
        if (dx !== 0) dy = 0;
        
        if (dx !== 0 || dy !== 0) {
            if (dx < 0) this.player.direction = 'left';
            if (dx > 0) this.player.direction = 'right';
            if (dy < 0) this.player.direction = 'up';
            if (dy > 0) this.player.direction = 'down';
            
            this.player.walking = true;
            this.player.walkTimer += delta;
            
            if (this.player.walkTimer > 150) {
                this.player.walkTimer = 0;
                this.player.walkFrame = (this.player.walkFrame + 1) % 4;
                
                const newX = this.player.x + dx * 16;
                const newY = this.player.y + dy * 16;
                
                if (this.canMoveTo(newX, newY)) {
                    this.player.x = newX;
                    this.player.y = newY;
                }
            }
        } else {
            this.player.walking = false;
            this.player.walkFrame = 0;
        }
    }
    
    canMoveTo(x, y) {
        const tileX = Math.floor(x / 16);
        const tileY = Math.floor(y / 16);
        
        if (tileX < 0 || tileX >= this.mapData.width || 
            tileY < 0 || tileY >= this.mapData.height) {
            return false;
        }
        
        const tile = this.mapData.tiles[tileY][tileX];
        return tile !== 'wall' && tile !== 'water';
    }
    
    updateCamera() {
        this.camera.x = this.player.x - this.width / 2 + 8;
        this.camera.y = this.player.y - this.height / 2 + 8;
        
        this.camera.x = Math.max(0, Math.min(this.camera.x, 
            this.mapData.width * 16 - this.width));
        this.camera.y = Math.max(0, Math.min(this.camera.y, 
            this.mapData.height * 16 - this.height));
    }
    
    checkInteractions() {
        if (this.input.confirm && !this.inputPressed.confirm) {
            let checkX = this.player.x;
            let checkY = this.player.y;
            
            switch (this.player.direction) {
                case 'up': checkY -= 16; break;
                case 'down': checkY += 16; break;
                case 'left': checkX -= 16; break;
                case 'right': checkX += 16; break;
            }
            
            for (const npc of this.mapData.npcs) {
                const npcX = npc.x * 16;
                const npcY = npc.y * 16;
                
                if (Math.abs(checkX - npcX) < 16 && Math.abs(checkY - npcY) < 16) {
                    this.startDialog(npc);
                    break;
                }
            }
        }
    }
    
    startDialog(npc) {
        this.gameState = 'DIALOG';
        this.dialogNPC = npc;
        this.dialogIndex = 0;
    }
    
    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.gameState === 'TITLE') {
            this.renderTitle();
        } else if (this.gameState === 'WORLD') {
            this.renderWorld();
        } else if (this.gameState === 'DIALOG') {
            this.renderWorld();
            this.renderDialog();
        }
    }
    
    renderTitle() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#E04040';
        this.ctx.font = 'bold 20px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('重装机兵', this.width / 2, 70);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText('METAL MAX', this.width / 2, 95);
        
        this.ctx.fillStyle = '#3A5A3A';
        this.ctx.fillRect(0, 130, this.width, 110);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '10px Courier New';
        this.ctx.fillText('PUSH START', this.width / 2, 190);
    }
    
    renderWorld() {
        this.renderMap();
        this.renderNPCs();
        this.renderPlayer();
        this.renderUI();
    }
    
    renderMap() {
        const startX = Math.floor(this.camera.x / 16);
        const startY = Math.floor(this.camera.y / 16);
        const endX = startX + Math.ceil(this.width / 16) + 1;
        const endY = startY + Math.ceil(this.height / 16) + 1;
        
        for (let y = startY; y < endY && y < this.mapData.height; y++) {
            for (let x = startX; x < endX && x < this.mapData.width; x++) {
                if (y < 0 || x < 0) continue;
                
                const screenX = x * 16 - this.camera.x;
                const screenY = y * 16 - this.camera.y;
                const tile = this.mapData.tiles[y][x];
                
                this.renderTile(screenX, screenY, tile);
            }
        }
    }
    
    renderTile(x, y, tile) {
        switch (tile) {
            case 'grass':
                this.ctx.fillStyle = '#3A7A3A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#2A5A2A';
                this.ctx.fillRect(x + 3, y + 3, 2, 2);
                this.ctx.fillRect(x + 10, y + 8, 2, 2);
                this.ctx.fillRect(x + 6, y + 12, 2, 2);
                break;
                
            case 'floor':
                this.ctx.fillStyle = '#9A8A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#8A7A5A';
                this.ctx.fillRect(x + 1, y + 1, 6, 6);
                this.ctx.fillRect(x + 9, y + 9, 6, 6);
                break;
                
            case 'wall':
                this.ctx.fillStyle = '#5A5A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#7A7A8A';
                this.ctx.fillRect(x + 1, y + 1, 6, 3);
                this.ctx.fillRect(x + 9, y + 1, 6, 3);
                this.ctx.fillRect(x + 1, y + 6, 14, 3);
                this.ctx.fillRect(x + 1, y + 11, 6, 3);
                this.ctx.fillRect(x + 9, y + 11, 6, 3);
                break;
                
            default:
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(x, y, 16, 16);
        }
    }
    
    renderNPCs() {
        for (const npc of this.mapData.npcs) {
            const screenX = npc.x * 16 - this.camera.x;
            const screenY = npc.y * 16 - this.camera.y;
            this.renderCharacter(screenX, screenY, npc.type, 'down', 0);
        }
    }
    
    renderPlayer() {
        const screenX = this.player.x - this.camera.x;
        const screenY = this.player.y - this.camera.y;
        this.renderCharacter(screenX, screenY, 'hero', this.player.direction, this.player.walkFrame);
    }
    
    renderCharacter(x, y, type, direction, frame) {
        const colors = this.getCharacterColors(type);
        
        const bob = (frame % 2 === 0) ? 0 : -1;
        
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 5, y + 9 + bob, 6, 6);
        
        this.ctx.fillStyle = colors.skin;
        this.ctx.fillRect(x + 5, y + 2 + bob, 6, 6);
        
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 4, y + 1 + bob, 8, 4);
        
        this.ctx.fillStyle = '#000';
        if (direction === 'left') {
            this.ctx.fillRect(x + 5, y + 4 + bob, 1, 1);
            this.ctx.fillRect(x + 7, y + 4 + bob, 1, 1);
        } else if (direction === 'right') {
            this.ctx.fillRect(x + 6, y + 4 + bob, 1, 1);
            this.ctx.fillRect(x + 8, y + 4 + bob, 1, 1);
        } else {
            this.ctx.fillRect(x + 5, y + 4 + bob, 1, 1);
            this.ctx.fillRect(x + 9, y + 4 + bob, 1, 1);
        }
        
        this.ctx.fillStyle = colors.bodyDark;
        if (frame % 2 === 0) {
            this.ctx.fillRect(x + 5, y + 14 + bob, 2, 2);
            this.ctx.fillRect(x + 9, y + 14 + bob, 2, 2);
        } else {
            this.ctx.fillRect(x + 5, y + 15 + bob, 2, 2);
            this.ctx.fillRect(x + 9, y + 13 + bob, 2, 2);
        }
    }
    
    getCharacterColors(type) {
        switch(type) {
            case 'hero':
                return {
                    body: '#4080C0',
                    bodyDark: '#3060A0',
                    skin: '#FFD0A0',
                    hair: '#804020'
                };
            case 'young_man':
                return {
                    body: '#40A040',
                    bodyDark: '#308030',
                    skin: '#FFD0A0',
                    hair: '#402020'
                };
            case 'uncle_dark_blue':
                return {
                    body: '#4040A0',
                    bodyDark: '#303080',
                    skin: '#FFD0A0',
                    hair: '#606060'
                };
            case 'lady_dark_blue':
                return {
                    body: '#A040A0',
                    bodyDark: '#803080',
                    skin: '#FFD0A0',
                    hair: '#806040'
                };
            default:
                return {
                    body: '#808080',
                    bodyDark: '#606060',
                    skin: '#FFD0A0',
                    hair: '#404040'
                };
        }
    }
    
    renderUI() {
        this.ctx.fillStyle = '#000';
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(0, 0, this.width, 32);
        this.ctx.globalAlpha = 1.0;
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '8px Courier New';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('レベル  1', 4, 10);
        this.ctx.fillText('HP', 4, 18);
        this.ctx.fillText('MP', 4, 26);
        
        this.ctx.fillStyle = '#E04040';
        this.ctx.fillRect(24, 15, 80, 6);
        this.ctx.fillStyle = '#40C040';
        this.ctx.fillRect(24, 15, 80 * (this.player.hp / this.player.maxHp), 6);
        
        this.ctx.fillStyle = '#4040E0';
        this.ctx.fillRect(24, 23, 80, 6);
        this.ctx.fillStyle = '#6060FF';
        this.ctx.fillRect(24, 23, 80 * (this.player.mp / this.player.maxMp), 6);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText('G', 110, 18);
        this.ctx.fillText(this.gold, 120, 26);
    }
    
    renderDialog() {
        this.ctx.fillStyle = '#000';
        this.ctx.globalAlpha = 0.9;
        this.ctx.fillRect(4, this.height - 56, this.width - 8, 52);
        this.ctx.globalAlpha = 1.0;
        
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(4, this.height - 56, this.width - 8, 52);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '10px Courier New';
        this.ctx.textAlign = 'left';
        
        const npc = this.dialogNPC;
        const lines = npc.dialog;
        
        if (this.dialogIndex < lines.length) {
            this.ctx.fillText(lines[this.dialogIndex], 10, this.height - 35);
        }
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '8px Courier New';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('▼', this.width - 10, this.height - 10);
        
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.dialogIndex++;
            if (this.dialogIndex >= npc.dialog.length) {
                this.gameState = 'WORLD';
                this.dialogNPC = null;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
