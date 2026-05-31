// 重装机兵 - Metal Max
// 完整游戏实现

class Game {
    constructor() {
        console.log('🎮 重装机兵 - 初始化开始...');
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        if (!this.canvas || !this.ctx) {
            console.error('❌ 无法获取Canvas元素');
            return;
        }
        
        // FC 原版分辨率
        this.width = 256;
        this.height = 240;
        
        // 游戏状态
        this.gameState = 'TITLE'; // TITLE, WORLD, DIALOG, MENU
        
        // 玩家
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
            level: 1,
            gold: 500
        };
        
        // 地图系统
        this.currentMap = 'riolado';
        this.mapData = this.createMapData();
        this.camera = { x: 0, y: 0 };
        
        // 输入系统
        this.input = {
            up: false,
            down: false,
            left: false,
            right: false,
            confirm: false,
            cancel: false
        };
        
        this.inputPressed = {
            up: false,
            down: false,
            left: false,
            right: false,
            confirm: false,
            cancel: false
        };
        
        // 对话系统
        this.dialogState = {
            active: false,
            npc: null,
            index: 0
        };
        
        // 性能监控
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        
        console.log('✅ 游戏初始化完成');
        
        this.init();
    }
    
    init() {
        this.setupInput();
        this.showMobileControls();
        this.gameLoop();
    }
    
    setupInput() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // 触摸/鼠标控制
        const buttonMap = {
            'btn-up': 'up',
            'btn-down': 'down',
            'btn-left': 'left',
            'btn-right': 'right',
            'btn-confirm': 'confirm',
            'btn-cancel': 'cancel'
        };
        
        Object.keys(buttonMap).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                // 触摸事件
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.input[buttonMap[btnId]] = true;
                    btn.classList.add('active');
                });
                
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.input[buttonMap[btnId]] = false;
                    btn.classList.remove('active');
                });
                
                // 鼠标事件
                btn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.input[buttonMap[btnId]] = true;
                    btn.classList.add('active');
                });
                
                btn.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.input[buttonMap[btnId]] = false;
                    btn.classList.remove('active');
                });
                
                btn.addEventListener('mouseleave', () => {
                    this.input[buttonMap[btnId]] = false;
                    btn.classList.remove('active');
                });
            }
        });
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.input.up = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.input.down = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.input.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = true;
                break;
            case 'KeyZ':
            case 'Enter':
            case 'Space':
                this.input.confirm = true;
                break;
            case 'KeyX':
            case 'Escape':
                this.input.cancel = true;
                break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.input.up = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.input.down = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.input.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.input.right = false;
                break;
            case 'KeyZ':
            case 'Enter':
            case 'Space':
                this.input.confirm = false;
                break;
            case 'KeyX':
            case 'Escape':
                this.input.cancel = false;
                break;
        }
    }
    
    showMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.remove('hidden');
        }
    }
    
    createMapData() {
        // 创建拉多镇地图
        const width = 24;
        const height = 15;
        const tiles = [];
        
        // 初始化地图
        for (let y = 0; y < height; y++) {
            tiles[y] = [];
            for (let x = 0; x < width; x++) {
                if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
                    tiles[y][x] = 'wall';
                } else if (x >= 3 && x <= 20 && y >= 2 && y <= 12 && 
                          !(x >= 7 && x <= 10 && y >= 6 && y <= 8)) {
                    tiles[y][x] = 'floor';
                } else {
                    tiles[y][x] = 'grass';
                }
            }
        }
        
        return {
            name: 'riolado',
            width: width,
            height: height,
            tiles: tiles,
            npcs: [
                { x: 14, y: 10, name: '村庄守卫', type: 'guard', dialog: ['这里是拉多镇。', '欢迎来到这里！'] },
                { x: 11, y: 5, name: '游荡青年', type: 'young', dialog: ['听说附近有战车呢。'] },
                { x: 2, y: 11, name: '废铁大叔', type: 'uncle', dialog: ['我这里能修东西。'] },
                { x: 19, y: 6, name: '看河女士', type: 'lady', dialog: ['这河边风景不错。'] },
                { x: 5, y: 5, name: '酒吧门口的人', type: 'young', dialog: ['里面可以休息。'] }
            ]
        };
    }
    
    gameLoop(timestamp = 0) {
        try {
            const delta = timestamp - this.lastTime;
            this.lastTime = timestamp;
            
            // 更新帧率
            this.frameCount++;
            if (this.frameCount >= 60) {
                this.fps = Math.round(1000 / delta) || 60;
                this.frameCount = 0;
            }
            
            this.update(delta);
            this.render();
            
        } catch (error) {
            console.error('❌ 游戏循环错误:', error);
        }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(delta) {
        switch(this.gameState) {
            case 'TITLE':
                this.updateTitle(delta);
                break;
            case 'WORLD':
                this.updateWorld(delta);
                break;
            case 'DIALOG':
                this.updateDialog(delta);
                break;
        }
        
        // 保存输入状态
        Object.keys(this.input).forEach(key => {
            this.inputPressed[key] = this.input[key];
        });
    }
    
    updateTitle(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.gameState = 'WORLD';
            console.log('🎮 进入游戏世界');
        }
    }
    
    updateWorld(delta) {
        this.updatePlayer(delta);
        this.updateCamera();
        this.checkInteractions();
    }
    
    updateDialog(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.dialogState.index++;
            if (this.dialogState.index >= this.dialogState.npc.dialog.length) {
                this.gameState = 'WORLD';
                this.dialogState.active = false;
                this.dialogState.npc = null;
                this.dialogState.index = 0;
            }
        }
    }
    
    updatePlayer(delta) {
        let dx = 0, dy = 0;
        
        if (this.input.up) dy = -1;
        if (this.input.down) dy = 1;
        if (this.input.left) dx = -1;
        if (this.input.right) dx = 1;
        
        // 限制只能向一个方向移动
        if (dx !== 0) dy = 0;
        
        if (dx !== 0 || dy !== 0) {
            // 设置方向
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
            
            switch(this.player.direction) {
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
        this.dialogState.active = true;
        this.dialogState.npc = npc;
        this.dialogState.index = 0;
    }
    
    render() {
        if (!this.ctx) return;
        
        try {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            switch(this.gameState) {
                case 'TITLE':
                    this.renderTitle();
                    break;
                case 'WORLD':
                    this.renderWorld();
                    break;
                case 'DIALOG':
                    this.renderWorld();
                    this.renderDialog();
                    break;
            }
        } catch (error) {
            console.error('❌ 渲染错误:', error);
        }
    }
    
    renderTitle() {
        // 黑底
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 标题 - 重装机兵 (红色)
        this.ctx.fillStyle = '#E04040';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('重装机兵', this.width / 2, 70);
        
        // 副标题 - METAL MAX (白色)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px "Courier New", monospace';
        this.ctx.fillText('METAL MAX', this.width / 2, 95);
        
        // 绿色地面
        this.ctx.fillStyle = '#3A7A3A';
        this.ctx.fillRect(0, 130, this.width, 110);
        
        // 提示文字 (闪烁效果)
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px "Courier New", monospace';
            this.ctx.fillText('PUSH START', this.width / 2, 190);
        }
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
        switch(tile) {
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
                this.ctx.fillStyle = '#000000';
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
        
        // 身体
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 5, y + 9 + bob, 6, 6);
        
        // 头部
        this.ctx.fillStyle = colors.skin;
        this.ctx.fillRect(x + 5, y + 2 + bob, 6, 6);
        
        // 头发
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 4, y + 1 + bob, 8, 4);
        
        // 眼睛
        this.ctx.fillStyle = '#000000';
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
        
        // 腿
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
            case 'young':
                return {
                    body: '#40A040',
                    bodyDark: '#308030',
                    skin: '#FFD0A0',
                    hair: '#402020'
                };
            case 'guard':
                return {
                    body: '#808080',
                    bodyDark: '#606060',
                    skin: '#FFD0A0',
                    hair: '#202020'
                };
            case 'uncle':
                return {
                    body: '#4040A0',
                    bodyDark: '#303080',
                    skin: '#FFD0A0',
                    hair: '#606060'
                };
            case 'lady':
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
        // 黑色半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, 32);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        
        // 等级
        this.ctx.fillText('Lv ' + this.player.level, 4, 10);
        
        // HP
        this.ctx.fillText('HP', 4, 18);
        this.ctx.fillStyle = '#E04040';
        this.ctx.fillRect(24, 15, 80, 6);
        this.ctx.fillStyle = '#40C040';
        const hpWidth = Math.floor(80 * (this.player.hp / this.player.maxHp));
        this.ctx.fillRect(24, 15, hpWidth, 6);
        
        // MP
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('MP', 4, 26);
        this.ctx.fillStyle = '#4040E0';
        this.ctx.fillRect(24, 23, 80, 6);
        this.ctx.fillStyle = '#6060FF';
        const mpWidth = Math.floor(80 * (this.player.mp / this.player.maxMp));
        this.ctx.fillRect(24, 23, mpWidth, 6);
        
        // 金币
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('G ' + this.player.gold, 110, 26);
    }
    
    renderDialog() {
        if (!this.dialogState.npc) return;
        
        // 对话框背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(4, this.height - 56, this.width - 8, 52);
        
        // 边框
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(4, this.height - 56, this.width - 8, 52);
        
        // 对话内容
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '10px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        
        if (this.dialogState.index < this.dialogState.npc.dialog.length) {
            this.ctx.fillText(this.dialogState.npc.dialog[this.dialogState.index], 10, this.height - 35);
        }
        
        // 继续提示三角
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px "Courier New", monospace';
        this.ctx.textAlign = 'right';
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillText('▼', this.width - 10, this.height - 10);
        }
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM已加载，启动游戏...');
    try {
        window.gameInstance = new Game();
    } catch (error) {
        console.error('💥 游戏启动失败:', error);
    }
});
