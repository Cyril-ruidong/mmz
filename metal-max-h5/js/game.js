// ==========================================
// 重装机兵 - Metal Max 像素艺术版
// 完整游戏实现
// ==========================================

class Game {
    constructor() {
        console.log('🎮 重装机兵 - 像素艺术版初始化...');
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        if (!this.canvas || !this.ctx) {
            console.error('❌ 无法获取Canvas元素');
            return;
        }
        
        // FC原版分辨率
        this.width = 256;
        this.height = 240;
        
        this.initGame();
        this.setupInput();
        this.showMobileControls();
        this.gameLoop();
        
        console.log('✅ 游戏初始化完成');
    }
    
    initGame() {
        this.gameState = 'TITLE';
        
        this.player = {
            name: 'HHH',
            x: 4,
            y: 6,
            direction: 'down',
            walking: false,
            walkFrame: 0,
            walkTimer: 0,
            hp: 100,
            maxHp: 100,
            mp: 30,
            maxMp: 30,
            level: 1,
            exp: 0,
            gold: 50,
            attack: 15,
            defense: 5
        };
        
        this.party = [this.player];
        this.partyNames = ['主角'];
        this.tanks = [];
        this.activeTank = -1;
        this.storyProgress = { metFather: false };
        
        this.currentMap = 'LADO_HOME';
        this.mapData = this.createMapData(this.currentMap);
        this.camera = { x: 0, y: 0 };
        
        this.dialogState = {
            active: false,
            npc: null,
            index: 0,
            lines: [],
            callback: null
        };
        
        this.input = { up: false, down: false, left: false, right: false, confirm: false, cancel: false };
        this.inputPressed = { up: false, down: false, left: false, right: false, confirm: false, cancel: false };
        
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
    }
    
    createTownTiles() {
        const tiles = [];
        for (let y = 0; y < 15; y++) {
            tiles[y] = [];
            for (let x = 0; x < 24; x++) {
                if (y === 0 || y === 14 || x === 0 || x === 23) tiles[y][x] = 'wall';
                else if (y >= 2 && y <= 12 && x >= 3 && x <= 20) tiles[y][x] = 'floor';
                else tiles[y][x] = 'grass';
            }
        }
        return tiles;
    }
    
    createWorldTiles() {
        const tiles = [];
        for (let y = 0; y < 80; y++) {
            tiles[y] = [];
            for (let x = 0; x < 100; x++) {
                tiles[y][x] = Math.random() > 0.85 ? 'tree' : 'grass';
            }
        }
        return tiles;
    }
    
    createMapData(mapName) {
        const maps = {
            'LADO_HOME': {
                name: '拉多 - 家',
                width: 10,
                height: 8,
                tiles: [
                    ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
                    ['wall','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
                    ['wall','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
                    ['wall','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
                    ['wall','floor','floor','wall','wall','wall','floor','floor','floor','wall'],
                    ['wall','floor','floor','wall','stair','wall','floor','floor','floor','wall'],
                    ['wall','floor','floor','floor','floor','floor','floor','floor','floor','wall'],
                    ['wall','wall','wall','wall','door','wall','wall','wall','wall','wall']
                ],
                npcs: [
                    { x: 7, y: 2, name: '姐姐', type: 'lady', dialog: ['弟弟，你又想出去冒险？','爸爸会生气的！','还是先和爸爸谈谈吧。']},
                    { x: 2, y: 5, name: '爸爸', type: 'uncle', dialog: ['你小子又来了！','我说过多少遍！','不许去当什么赏金猎人！','给我滚出去！！'], event: 'KICK_OUT'}
                ],
                exits: [{ x: 4, y: 7, target: 'LADO_TOWN', tx: 12, ty: 10 }]
            },
            'LADO_TOWN': {
                name: '拉多镇',
                width: 24,
                height: 15,
                tiles: null,
                npcs: [
                    { x: 14, y: 10, name: '守卫', type: 'guard', dialog: ['这里是拉多镇。','南边的山洞里有怪物出没。','小心点！']},
                    { x: 11, y: 5, name: '年轻人', type: 'young', dialog: ['听说南边的山洞里有一辆战车！','不过有战狗守着...']},
                    { x: 19, y: 6, name: '红狼', type: 'redwolf', dialog: ['...','我是红狼。','你也想成为赏金猎人吗？','那就变强给我看看吧！']}
                ],
                exits: [
                    { x: 12, y: 14, target: 'WORLD_MAP', tx: 50, ty: 60 },
                    { x: 5, y: 8, target: 'LADO_HOME', tx: 4, ty: 6 }
                ]
            },
            'WORLD_MAP': {
                name: '世界地图',
                width: 100,
                height: 80,
                tiles: null,
                npcs: [],
                exits: [{ x: 50, y: 60, target: 'LADO_TOWN', tx: 12, ty: 13 }]
            }
        };
        
        const map = maps[mapName] || maps['LADO_HOME'];
        if (mapName === 'LADO_TOWN' && !map.tiles) map.tiles = this.createTownTiles();
        else if (mapName === 'WORLD_MAP' && !map.tiles) map.tiles = this.createWorldTiles();
        
        return map;
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        const buttonMap = {
            'btn-up': 'up', 'btn-down': 'down', 'btn-left': 'left',
            'btn-right': 'right', 'btn-confirm': 'confirm', 'btn-cancel': 'cancel'
        };
        
        Object.keys(buttonMap).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.input[buttonMap[btnId]] = true;
                    btn.classList.add('active');
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.input[buttonMap[btnId]] = false;
                    btn.classList.remove('active');
                });
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
    
    showMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.classList.remove('hidden');
    }
    
    gameLoop(timestamp = 0) {
        try {
            const delta = timestamp - this.lastTime;
            this.lastTime = timestamp;
            this.frameCount++;
            if (this.frameCount >= 60) { this.fps = Math.round(1000 / delta) || 60; this.frameCount = 0; }
            
            this.update(delta);
            this.render();
        } catch (error) { console.error('❌ 游戏循环错误:', error); }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(delta) {
        switch(this.gameState) {
            case 'TITLE': this.updateTitle(delta); break;
            case 'INTRO': this.updateIntro(delta); break;
            case 'WORLD': this.updateWorld(delta); break;
            case 'DIALOG': this.updateDialog(delta); break;
        }
        
        Object.keys(this.input).forEach(key => { this.inputPressed[key] = this.input[key]; });
    }
    
    updateTitle(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.gameState = 'INTRO';
            this.introStep = 0;
        }
    }
    
    updateIntro(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            if (this.introStep < 4) this.introStep++;
            else this.gameState = 'WORLD';
        }
    }
    
    updateWorld(delta) {
        this.updatePlayer(delta);
        this.updateCamera();
        this.checkInteractions();
        this.checkExits();
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
                
                const newX = this.player.x + dx;
                const newY = this.player.y + dy;
                
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
        if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) return false;
        const tile = this.mapData.tiles[Math.floor(y)][Math.floor(x)];
        return tile !== 'wall' && tile !== 'tree';
    }
    
    updateCamera() {
        const targetX = this.player.x * 16 - this.width / 2 + 8;
        const targetY = this.player.y * 16 - this.height / 2 + 8;
        this.camera.x = Math.max(0, Math.min(targetX, this.mapData.width * 16 - this.width));
        this.camera.y = Math.max(0, Math.min(targetY, this.mapData.height * 16 - this.height));
    }
    
    checkInteractions() {
        if (this.input.confirm && !this.inputPressed.confirm) {
            let checkX = this.player.x, checkY = this.player.y;
            switch(this.player.direction) {
                case 'up': checkY -= 1; break;
                case 'down': checkY += 1; break;
                case 'left': checkX -= 1; break;
                case 'right': checkX += 1; break;
            }
            
            for (const npc of this.mapData.npcs) {
                if (Math.abs(checkX - npc.x) < 1 && Math.abs(checkY - npc.y) < 1) {
                    this.startDialog(npc);
                    break;
                }
            }
        }
    }
    
    checkExits() {
        for (const exit of this.mapData.exits || []) {
            if (Math.abs(this.player.x - exit.x) < 1 && Math.abs(this.player.y - exit.y) < 1) {
                this.changeMap(exit.target, exit.tx, exit.ty);
                break;
            }
        }
    }
    
    changeMap(mapName, startX, startY) {
        this.currentMap = mapName;
        this.mapData = this.createMapData(mapName);
        this.player.x = startX;
        this.player.y = startY;
    }
    
    startDialog(npc) {
        this.gameState = 'DIALOG';
        this.dialogState.active = true;
        this.dialogState.npc = npc;
        this.dialogState.lines = [...npc.dialog];
        this.dialogState.index = 0;
        
        if (npc.event === 'KICK_OUT' && !this.storyProgress.metFather) {
            this.dialogState.callback = () => {
                this.storyProgress.metFather = true;
                this.changeMap('LADO_TOWN', 12, 10);
            };
        }
    }
    
    updateDialog(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.dialogState.index++;
            if (this.dialogState.index >= this.dialogState.lines.length) {
                this.gameState = 'WORLD';
                this.dialogState.active = false;
                if (this.dialogState.callback) { this.dialogState.callback(); this.dialogState.callback = null; }
            }
        }
    }
    
    render() {
        if (!this.ctx) return;
        try {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            switch(this.gameState) {
                case 'TITLE': this.renderTitle(); break;
                case 'INTRO': this.renderIntro(); break;
                case 'WORLD': this.renderWorld(); break;
                case 'DIALOG': this.renderWorld(); this.renderDialog(); break;
            }
        } catch (error) { console.error('❌ 渲染错误:', error); }
    }
    
    // ==========================================
    // 标题画面 - 经典像素艺术风格
    // ==========================================
    renderTitle() {
        // 黑色背景
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 绘制像素艺术标题
        this.drawPixelTitle();
        
        // 绿色地面
        this.ctx.fillStyle = '#3A7A3A';
        this.ctx.fillRect(0, 130, this.width, 110);
        
        // 绘制装饰性战车剪影
        this.drawTankSilhouette(50, 150);
        this.drawTankSilhouette(180, 170);
        
        // 闪烁提示
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 12px "Courier New"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PUSH START', this.width / 2, 200);
        }
        
        // 版本信息
        this.ctx.fillStyle = '#808080';
        this.ctx.font = '8px "Courier New"';
        this.ctx.fillText('METAL MAX 2026', this.width / 2, 230);
    }
    
    drawPixelTitle() {
        // 主标题"重装机兵" - 大号像素字体
        const title1 = '重装机兵';
        this.ctx.fillStyle = '#E04040';
        this.ctx.font = 'bold 32px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title1, this.width / 2, 70);
        
        // 副标题 - 带阴影效果
        const title2 = 'METAL MAX';
        this.ctx.fillStyle = '#404040';
        this.ctx.font = '16px "Courier New"';
        this.ctx.fillText(title2, this.width / 2 + 2, 98);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(title2, this.width / 2, 96);
        
        // 装饰性像素线条
        this.ctx.fillStyle = '#E04040';
        for (let i = 0; i < 10; i++) {
            this.ctx.fillRect(20 + i * 22, 110, 18, 2);
        }
    }
    
    drawTankSilhouette(x, y) {
        // 简单的战车剪影
        this.ctx.fillStyle = '#2A5A2A';
        this.ctx.fillRect(x, y, 40, 20);
        this.ctx.fillRect(x + 10, y - 8, 20, 10);
        this.ctx.fillRect(x + 35, y - 4, 15, 6);
    }
    
    // ==========================================
    // 开场剧情
    // ==========================================
    renderIntro() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const introTexts = [
            { text: '传说中的大破坏...', y: 80 },
            { text: '文明毁灭之后...', y: 110 },
            { text: '怪物横行的世界...', y: 140 },
            { text: '赏金猎人的时代开始了！', y: 170 }
        ];
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px "Courier New"';
        this.ctx.textAlign = 'center';
        
        for (let i = 0; i <= this.introStep && i < introTexts.length; i++) {
            this.ctx.fillText(introTexts[i].text, this.width / 2, introTexts[i].y);
        }
        
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#E04040';
            this.ctx.font = '12px "Courier New"';
            this.ctx.fillText('按 A 键继续', this.width / 2, 210);
        }
    }
    
    // ==========================================
    // 世界地图渲染
    // ==========================================
    renderWorld() {
        this.renderMap();
        this.renderNPCs();
        this.renderPlayer();
        this.renderUI();
    }
    
    renderMap() {
        const startTileX = Math.floor(this.camera.x / 16);
        const startTileY = Math.floor(this.camera.y / 16);
        const endTileX = startTileX + Math.ceil(this.width / 16) + 1;
        const endTileY = startTileY + Math.ceil(this.height / 16) + 1;
        
        for (let y = startTileY; y < endTileY && y < this.mapData.height; y++) {
            for (let x = startTileX; x < endTileX && x < this.mapData.width; x++) {
                if (y < 0 || x < 0) continue;
                
                const screenX = x * 16 - this.camera.x;
                const screenY = y * 16 - this.camera.y;
                const tile = this.mapData.tiles[y]?.[x] || 'grass';
                
                this.renderTile(screenX, screenY, tile);
            }
        }
    }
    
    // ==========================================
    // 改进的瓦片渲染 - 像素艺术风格
    // ==========================================
    renderTile(x, y, tile) {
        switch(tile) {
            case 'grass':
                // 草地 - 多层绿色渐变
                this.ctx.fillStyle = '#4A8A4A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#3A7A3A';
                this.ctx.fillRect(x + 1, y + 1, 14, 14);
                // 添加草地细节
                this.ctx.fillStyle = '#5A9A5A';
                this.ctx.fillRect(x + 3, y + 3, 2, 3);
                this.ctx.fillRect(x + 10, y + 7, 2, 3);
                this.ctx.fillRect(x + 6, y + 12, 2, 3);
                break;
                
            case 'floor':
                // 地板 - 温暖的棕色
                this.ctx.fillStyle = '#A09070';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#908060';
                this.ctx.fillRect(x + 1, y + 1, 7, 7);
                this.ctx.fillRect(x + 9, y + 9, 7, 7);
                // 添加地板纹理
                this.ctx.fillStyle = '#B0A080';
                this.ctx.fillRect(x + 3, y + 3, 3, 3);
                this.ctx.fillRect(x + 11, y + 11, 3, 3);
                break;
                
            case 'wall':
                // 墙壁 - 石头质感
                this.ctx.fillStyle = '#606070';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#707080';
                this.ctx.fillRect(x + 1, y + 1, 6, 4);
                this.ctx.fillRect(x + 9, y + 1, 6, 4);
                this.ctx.fillStyle = '#505060';
                this.ctx.fillRect(x + 1, y + 7, 14, 3);
                this.ctx.fillRect(x + 1, y + 12, 6, 3);
                this.ctx.fillRect(x + 9, y + 12, 6, 3);
                break;
                
            case 'tree':
                // 树木 - 像素艺术风格
                this.ctx.fillStyle = '#3A6A3A';
                this.ctx.fillRect(x, y, 16, 16);
                // 树干
                this.ctx.fillStyle = '#6A5040';
                this.ctx.fillRect(x + 6, y + 10, 4, 6);
                // 树冠
                this.ctx.fillStyle = '#2A5A2A';
                this.ctx.fillRect(x + 4, y + 2, 8, 8);
                this.ctx.fillStyle = '#4A8A4A';
                this.ctx.fillRect(x + 5, y + 3, 6, 6);
                break;
                
            case 'door':
                // 门 - 木质纹理
                this.ctx.fillStyle = '#7A6040';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#6A5030';
                this.ctx.fillRect(x + 2, y + 1, 12, 14);
                // 门把手
                this.ctx.fillStyle = '#C0A060';
                this.ctx.fillRect(x + 10, y + 8, 2, 2);
                break;
                
            case 'stair':
                // 楼梯 - 阶梯效果
                this.ctx.fillStyle = '#8A7060';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#7A6050';
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(x + 2 + i, y + 2 + i * 3, 12 - i * 2, 2);
                }
                break;
                
            default:
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(x, y, 16, 16);
        }
    }
    
    // ==========================================
    // 角色渲染 - 改进的像素艺术
    // ==========================================
    renderNPCs() {
        for (const npc of this.mapData.npcs) {
            const screenX = npc.x * 16 - this.camera.x;
            const screenY = npc.y * 16 - this.camera.y;
            this.renderCharacter(screenX, screenY, npc.type, 'down', 0);
        }
    }
    
    renderPlayer() {
        const screenX = this.player.x * 16 - this.camera.x;
        const screenY = this.player.y * 16 - this.camera.y;
        this.renderCharacter(screenX, screenY, 'hero', this.player.direction, this.player.walkFrame);
    }
    
    renderCharacter(x, y, type, direction, frame) {
        const colors = this.getCharacterColors(type);
        const bob = (frame % 2 === 0) ? 0 : -1;
        
        // 绘制角色阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 3, y + 15, 10, 3);
        
        // 绘制腿部
        this.ctx.fillStyle = colors.legs;
        if (frame % 2 === 0) {
            this.ctx.fillRect(x + 5, y + 13 + bob, 2, 3);
            this.ctx.fillRect(x + 9, y + 13 + bob, 2, 3);
        } else {
            this.ctx.fillRect(x + 4, y + 14 + bob, 2, 3);
            this.ctx.fillRect(x + 10, y + 12 + bob, 2, 3);
        }
        
        // 绘制身体
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 4, y + 7 + bob, 8, 7);
        
        // 添加衣服细节
        this.ctx.fillStyle = colors.bodyDark;
        this.ctx.fillRect(x + 5, y + 8 + bob, 6, 1);
        
        // 绘制头部
        this.ctx.fillStyle = colors.skin;
        this.ctx.fillRect(x + 5, y + 1 + bob, 6, 6);
        
        // 绘制头发
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 4, y + 0 + bob, 8, 3);
        this.ctx.fillRect(x + 4, y + 1 + bob, 2, 2); // 侧面头发
        
        // 绘制眼睛
        this.ctx.fillStyle = '#000000';
        if (direction === 'left') {
            this.ctx.fillRect(x + 5, y + 3 + bob, 1, 2);
            this.ctx.fillRect(x + 7, y + 3 + bob, 1, 2);
        } else if (direction === 'right') {
            this.ctx.fillRect(x + 6, y + 3 + bob, 1, 2);
            this.ctx.fillRect(x + 8, y + 3 + bob, 1, 2);
        } else {
            this.ctx.fillRect(x + 5, y + 3 + bob, 1, 2);
            this.ctx.fillRect(x + 9, y + 3 + bob, 1, 2);
        }
        
        // 特殊角色效果
        if (type === 'redwolf') {
            // 红狼的红色披风效果
            this.ctx.fillStyle = '#C02020';
            this.ctx.fillRect(x + 3, y + 6 + bob, 2, 6);
        }
    }
    
    getCharacterColors(type) {
        switch(type) {
            case 'hero':
                return {
                    body: '#4080C0',     // 蓝色衣服
                    bodyDark: '#3060A0', // 深蓝
                    legs: '#304060',     // 深色裤子
                    skin: '#FFD0A0',     // 肤色
                    hair: '#804020'      // 棕色头发
                };
            case 'young':
                return {
                    body: '#40A040',     // 绿色衣服
                    bodyDark: '#308030',
                    legs: '#205020',
                    skin: '#FFD0A0',
                    hair: '#402020'
                };
            case 'guard':
                return {
                    body: '#606070',     // 灰色制服
                    bodyDark: '#505060',
                    legs: '#404050',
                    skin: '#FFD0A0',
                    hair: '#202020'
                };
            case 'uncle':
                return {
                    body: '#404080',     // 深蓝色衣服
                    bodyDark: '#303060',
                    legs: '#303050',
                    skin: '#FFD0A0',
                    hair: '#606060'
                };
            case 'lady':
                return {
                    body: '#A040A0',     // 紫色衣服
                    bodyDark: '#803080',
                    legs: '#603060',
                    skin: '#FFD0A0',
                    hair: '#A06040'
                };
            case 'redwolf':
                return {
                    body: '#C02020',     // 红色衣服
                    bodyDark: '#A01010',
                    legs: '#802020',
                    skin: '#FFD0A0',
                    hair: '#C04040'
                };
            default:
                return {
                    body: '#808080',
                    bodyDark: '#606060',
                    legs: '#505050',
                    skin: '#FFD0A0',
                    hair: '#404040'
                };
        }
    }
    
    // ==========================================
    // UI渲染 - 清晰的像素风格
    // ==========================================
    renderUI() {
        // 状态窗口 - 半透明黑色
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.width, 44);
        
        // 白色边框
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.width, 44);
        
        // 分隔线
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(100, 4, 2, 36);
        
        // 左侧 - 角色信息
        this.ctx.textAlign = 'left';
        this.ctx.font = 'bold 10px "Courier New"';
        this.ctx.fillText(`${this.player.name}`, 8, 14);
        this.ctx.font = '8px "Courier New"';
        this.ctx.fillText(`Lv${this.player.level}`, 8, 24);
        
        // HP条
        this.ctx.fillText('HP', 8, 36);
        this.ctx.fillStyle = '#800000';
        this.ctx.fillRect(24, 28, 60, 8);
        this.ctx.fillStyle = '#40A040';
        const hpWidth = Math.floor(60 * (this.player.hp / this.player.maxHp));
        this.ctx.fillRect(24, 28, hpWidth, 8);
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(24, 28, 60, 8);
        
        // 右侧 - 金币和地图
        this.ctx.textAlign = 'right';
        this.ctx.font = '10px "Courier New"';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`G ${this.player.gold}`, this.width - 8, 14);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px "Courier New"';
        this.ctx.fillText(this.mapData.name, this.width - 8, 36);
    }
    
    renderDialog() {
        // 对话框背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        this.ctx.fillRect(4, this.height - 68, this.width - 8, 64);
        
        // 白色粗边框
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(4, this.height - 68, this.width - 8, 64);
        
        // NPC名字
        if (this.dialogState.npc) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 10px "Courier New"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.dialogState.npc.name, 12, this.height - 54);
        }
        
        // 对话内容
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '11px "Courier New"';
        this.ctx.textAlign = 'left';
        
        if (this.dialogState.index < this.dialogState.lines.length) {
            const line = this.dialogState.lines[this.dialogState.index];
            // 分两行显示
            const line1 = line.substring(0, 20);
            const line2 = line.substring(20);
            this.ctx.fillText(line1, 12, this.height - 36);
            if (line2) this.ctx.fillText(line2, 12, this.height - 22);
        }
        
        // 继续提示 - 闪烁三角形
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px "Courier New"';
            this.ctx.textAlign = 'right';
            this.ctx.fillText('▼', this.width - 12, this.height - 10);
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