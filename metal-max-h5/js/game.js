// ==========================================
// 重装机兵 - Metal Max 完整游戏实现
// ==========================================

class Game {
    constructor() {
        console.log('🎮 重装机兵 - 初始化开始...');
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        if (!this.canvas || !this.ctx) {
            console.error('❌ 无法获取Canvas元素');
            return;
        }
        
        // FC原版分辨率 256x240
        this.width = 256;
        this.height = 240;
        
        // 游戏初始化
        this.initGame();
        
        // 设置输入
        this.setupInput();
        
        // 显示控制
        this.showMobileControls();
        
        // 开始游戏循环
        this.gameLoop();
        
        console.log('✅ 游戏初始化完成');
    }
    
    initGame() {
        // ==================== 游戏状态 ====================
        this.gameState = 'TITLE'; // TITLE, INTRO, WORLD, BATTLE, DIALOG, MENU
        
        // ==================== 玩家数据 ====================
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
        
        // ==================== 队伍成员 ====================
        this.party = [this.player];
        this.partyNames = ['主角'];
        
        // ==================== 战车系统 ====================
        this.tanks = [];
        this.activeTank = -1; // -1表示没有战车
        
        // ==================== 剧情进度 ====================
        this.storyProgress = {
            metFather: false,
            gotFirstTank: false,
            metMechanic: false,
            metSoldier: false,
            defeatedWaterMonster: false
        };
        
        // ==================== 地图系统 ====================
        this.currentMap = 'LADO_HOME';
        this.mapData = this.createMapData(this.currentMap);
        this.camera = { x: 0, y: 0 };
        
        // ==================== 对话系统 ====================
        this.dialogState = {
            active: false,
            npc: null,
            index: 0,
            lines: [],
            callback: null
        };
        
        // ==================== 输入系统 ====================
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
        
        // ==================== 动画定时器 ====================
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
    }
    
    // ==========================================
    // 地图数据创建
    // ==========================================
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
                    { x: 7, y: 2, name: '姐姐', type: 'lady', dialog: [
                        '弟弟，你又想出去冒险？',
                        '爸爸会生气的！',
                        '还是先和爸爸谈谈吧。'
                    ]},
                    { x: 2, y: 5, name: '爸爸', type: 'uncle', dialog: [
                        '你小子又来了！',
                        '我说过多少遍！',
                        '不许去当什么赏金猎人！',
                        '给我滚出去！！'
                    ], event: 'KICK_OUT'}
                ],
                exits: [
                    { x: 4, y: 7, target: 'LADO_TOWN', tx: 12, ty: 10 }
                ]
            },
            'LADO_TOWN': {
                name: '拉多镇',
                width: 24,
                height: 15,
                tiles: this.createTownTiles(),
                npcs: [
                    { x: 14, y: 10, name: '守卫', type: 'guard', dialog: [
                        '这里是拉多镇。',
                        '南边的山洞里有怪物出没。',
                        '小心点！'
                    ]},
                    { x: 11, y: 5, name: '年轻人', type: 'young', dialog: [
                        '听说南边的山洞里有一辆战车！',
                        '不过有战狗守着...'
                    ]},
                    { x: 19, y: 6, name: '红狼', type: 'redwolf', dialog: [
                        '...',
                        '我是红狼。',
                        '你也想成为赏金猎人吗？',
                        '那就变强给我看看吧！'
                    ]}
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
                tiles: this.createWorldTiles(),
                npcs: [],
                exits: [
                    { x: 50, y: 60, target: 'LADO_TOWN', tx: 12, ty: 13 }
                ]
            }
        };
        
        return maps[mapName] || maps['LADO_HOME'];
    }
    
    createTownTiles() {
        const tiles = [];
        for (let y = 0; y < 15; y++) {
            tiles[y] = [];
            for (let x = 0; x < 24; x++) {
                if (y === 0 || y === 14 || x === 0 || x === 23) {
                    tiles[y][x] = 'wall';
                } else if (y >= 2 && y <= 12 && x >= 3 && x <= 20) {
                    tiles[y][x] = 'floor';
                } else {
                    tiles[y][x] = 'grass';
                }
            }
        }
        return tiles;
    }
    
    createWorldTiles() {
        const tiles = [];
        for (let y = 0; y < 80; y++) {
            tiles[y] = [];
            for (let x = 0; x < 100; x++) {
                if (Math.random() > 0.85) {
                    tiles[y][x] = 'tree';
                } else {
                    tiles[y][x] = 'grass';
                }
            }
        }
        return tiles;
    }
    
    // ==========================================
    // 输入系统
    // ==========================================
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
    
    // ==========================================
    // 游戏循环
    // ==========================================
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
            case 'INTRO':
                this.updateIntro(delta);
                break;
            case 'WORLD':
                this.updateWorld(delta);
                break;
            case 'DIALOG':
                this.updateDialog(delta);
                break;
            case 'MENU':
                this.updateMenu(delta);
                break;
        }
        
        // 保存输入状态
        Object.keys(this.input).forEach(key => {
            this.inputPressed[key] = this.input[key];
        });
    }
    
    // ==========================================
    // 标题画面
    // ==========================================
    updateTitle(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.gameState = 'INTRO';
            this.introStep = 0;
            this.introTimer = 0;
        }
    }
    
    renderTitle() {
        // 黑底
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 标题
        this.ctx.fillStyle = '#E04040';
        this.ctx.font = 'bold 24px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('重装机兵', this.width / 2, 80);
        
        // 副标题
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px "Courier New", monospace';
        this.ctx.fillText('METAL MAX', this.width / 2, 105);
        
        // 绿色地面
        this.ctx.fillStyle = '#3A7A3A';
        this.ctx.fillRect(0, 130, this.width, 110);
        
        // 闪烁提示
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px "Courier New", monospace';
            this.ctx.fillText('PUSH START', this.width / 2, 190);
        }
    }
    
    // ==========================================
    // 开场剧情
    // ==========================================
    updateIntro(delta) {
        this.introTimer += delta;
        
        if (this.input.confirm && !this.inputPressed.confirm) {
            if (this.introStep < 4) {
                this.introStep++;
                this.introTimer = 0;
            } else {
                this.gameState = 'WORLD';
            }
        }
    }
    
    renderIntro() {
        // 背景
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const introTexts = [
            { text: '传说中的大破坏...', y: 80 },
            { text: '文明毁灭之后...', y: 100 },
            { text: '怪物横行的世界...', y: 120 },
            { text: '赏金猎人的时代开始了！', y: 140 }
        ];
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        for (let i = 0; i <= this.introStep && i < introTexts.length; i++) {
            this.ctx.fillText(introTexts[i].text, this.width / 2, introTexts[i].y);
        }
        
        // 提示
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillText('按 A 键继续', this.width / 2, 200);
        }
    }
    
    // ==========================================
    // 世界地图
    // ==========================================
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
        if (x < 0 || x >= this.mapData.width || 
            y < 0 || y >= this.mapData.height) {
            return false;
        }
        
        const tile = this.mapData.tiles[Math.floor(y)][Math.floor(x)];
        return tile !== 'wall' && tile !== 'water' && tile !== 'tree';
    }
    
    updateCamera() {
        const targetX = this.player.x * 16 - this.width / 2 + 8;
        const targetY = this.player.y * 16 - this.height / 2 + 8;
        
        this.camera.x = Math.max(0, Math.min(targetX, this.mapData.width * 16 - this.width));
        this.camera.y = Math.max(0, Math.min(targetY, this.mapData.height * 16 - this.height));
    }
    
    checkInteractions() {
        if (this.input.confirm && !this.inputPressed.confirm) {
            let checkX = this.player.x;
            let checkY = this.player.y;
            
            switch(this.player.direction) {
                case 'up': checkY -= 1; break;
                case 'down': checkY += 1; break;
                case 'left': checkX -= 1; break;
                case 'right': checkX += 1; break;
            }
            
            // 检查NPC
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
    
    // ==========================================
    // 对话系统
    // ==========================================
    startDialog(npc) {
        this.gameState = 'DIALOG';
        this.dialogState.active = true;
        this.dialogState.npc = npc;
        this.dialogState.lines = [...npc.dialog];
        this.dialogState.index = 0;
        
        if (npc.event === 'KICK_OUT' && !this.storyProgress.metFather) {
            this.dialogState.callback = () => {
                this.storyProgress.metFather = true;
                // 被爸爸赶出家后，切换到镇子地图
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
                
                if (this.dialogState.callback) {
                    this.dialogState.callback();
                    this.dialogState.callback = null;
                }
            }
        }
    }
    
    renderDialog() {
        // 对话框背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(4, this.height - 64, this.width - 8, 60);
        
        // 边框
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(4, this.height - 64, this.width - 8, 60);
        
        // 对话内容
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '10px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        
        if (this.dialogState.index < this.dialogState.lines.length) {
            const line = this.dialogState.lines[this.dialogState.index];
            this.ctx.fillText(line, 12, this.height - 40);
        }
        
        // 继续提示三角
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px "Courier New", monospace';
        this.ctx.textAlign = 'right';
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillText('▼', this.width - 12, this.height - 12);
        }
    }
    
    // ==========================================
    // 渲染系统
    // ==========================================
    render() {
        if (!this.ctx) return;
        
        try {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            switch(this.gameState) {
                case 'TITLE':
                    this.renderTitle();
                    break;
                case 'INTRO':
                    this.renderIntro();
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
    
    renderTile(x, y, tile) {
        switch(tile) {
            case 'grass':
                this.ctx.fillStyle = '#3A7A3A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#2A5A2A';
                this.ctx.fillRect(x + 3, y + 3, 2, 2);
                break;
                
            case 'floor':
                this.ctx.fillStyle = '#9A8A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#8A7A5A';
                this.ctx.fillRect(x + 1, y + 1, 6, 6);
                break;
                
            case 'wall':
                this.ctx.fillStyle = '#5A5A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#7A7A8A';
                this.ctx.fillRect(x + 1, y + 1, 14, 4);
                break;
                
            case 'tree':
                this.ctx.fillStyle = '#2A6A2A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#4A9A4A';
                this.ctx.fillRect(x + 4, y + 2, 8, 10);
                break;
                
            case 'door':
                this.ctx.fillStyle = '#6A5A4A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#4A3A2A';
                this.ctx.fillRect(x + 3, y + 2, 10, 12);
                break;
                
            case 'stair':
                this.ctx.fillStyle = '#8A7A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#6A5A4A';
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(x + 2, y + 2 + i * 3, 12 - i * 2, 2);
                }
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
        const screenX = this.player.x * 16 - this.camera.x;
        const screenY = this.player.y * 16 - this.camera.y;
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
        this.ctx.fillRect(x + 5, y + 4 + bob, 1, 1);
        this.ctx.fillRect(x + 9, y + 4 + bob, 1, 1);
        
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
                return { body: '#4080C0', bodyDark: '#3060A0', skin: '#FFD0A0', hair: '#804020' };
            case 'young':
                return { body: '#40A040', bodyDark: '#308030', skin: '#FFD0A0', hair: '#402020' };
            case 'guard':
                return { body: '#808080', bodyDark: '#606060', skin: '#FFD0A0', hair: '#202020' };
            case 'uncle':
                return { body: '#4040A0', bodyDark: '#303080', skin: '#FFD0A0', hair: '#606060' };
            case 'lady':
                return { body: '#A040A0', bodyDark: '#803080', skin: '#FFD0A0', hair: '#A06040' };
            case 'redwolf':
                return { body: '#C02020', bodyDark: '#A01010', skin: '#FFD0A0', hair: '#C04040' };
            default:
                return { body: '#808080', bodyDark: '#606060', skin: '#FFD0A0', hair: '#404040' };
        }
    }
    
    renderUI() {
        // 状态窗口
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, 40);
        
        // 边框
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.width, 40);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px "Courier New", monospace';
        this.ctx.textAlign = 'left';
        
        // 角色名和等级
        this.ctx.fillText(`${this.player.name} Lv${this.player.level}`, 8, 12);
        
        // HP
        this.ctx.fillText('HP', 8, 22);
        this.ctx.fillStyle = '#E04040';
        this.ctx.fillRect(28, 17, 60, 6);
        this.ctx.fillStyle = '#40E040';
        const hpWidth = Math.floor(60 * (this.player.hp / this.player.maxHp));
        this.ctx.fillRect(28, 17, hpWidth, 6);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`${this.player.hp}/${this.player.maxHp}`, 92, 22);
        
        // 金币
        this.ctx.fillText('G', 8, 32);
        this.ctx.fillText(this.player.gold.toString(), 28, 32);
        
        // 地图名
        this.ctx.textAlign = 'right';
        this.ctx.fillText(this.mapData.name, this.width - 8, 12);
    }
}

// ==========================================
// 启动游戏
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM已加载，启动游戏...');
    try {
        window.gameInstance = new Game();
    } catch (error) {
        console.error('💥 游戏启动失败:', error);
    }
});