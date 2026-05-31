// ==========================================
// 重装机兵 - 现代像素艺术版
// ==========================================

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

        if (!this.canvas || !this.ctx) {
            console.error('❌ Canvas not found!');
            return;
        }

        this.width = 1024;
        this.height = 960;

        this.initGame();
        this.setupInput();
        this.showMobileControls();
        this.gameLoop();

        console.log('✅ Modern Pixel Art Metal Max initialized!');
    }

    initGame() {
        this.gameState = 'TITLE';

        this.player = {
            name: '主角',
            x: 5,
            y: 6,
            direction: 'down',
            walking: false,
            walkFrame: 0,
            walkTimer: 0,
            hp: 100,
            maxHp: 100,
            gold: 50,
            level: 1
        };

        this.party = [this.player];
        this.storyProgress = { metFather: false };
        this.currentMap = 'HOME';
        this.mapData = this.createMapData('HOME');
        this.camera = { x: 0, y: 0 };

        this.dialogState = {
            active: false,
            npc: null,
            index: 0,
            lines: [],
            callback: null
        };

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

        this.lastTime = 0;
    }

    createMapData(mapName) {
        const maps = {
            'HOME': {
                name: '温馨的家',
                width: 10,
                height: 8,
                tiles: [
                    ['W','W','W','W','W','W','W','W','W','W'],
                    ['W','C','F','F','F','F','F','F','C','W'],
                    ['W','F','F','F','F','F','F','F','F','W'],
                    ['W','F','F','R','F','F','F','F','F','W'],
                    ['W','F','F','W','W','W','F','F','F','W'],
                    ['W','F','F','W','S','W','F','F','F','W'],
                    ['W','C','F','F','F','F','F','F','C','W'],
                    ['W','W','W','W','D','W','W','W','W','W']
                ],
                npcs: [
                    { x: 7, y: 2, name: '姐姐', type: 'lady', dialog: ['又想出去冒险啦？', '先和爸爸打个招呼吧～'] },
                    { x: 2, y: 5, name: '父亲', type: 'uncle', dialog: ['你这孩子！', '整天想着当什么猎人！', '太让我生气了！'], event: 'KICK_OUT' }
                ],
                exits: [
                    { x: 4, y: 7, target: 'TOWN', tx: 11, ty: 9 }
                ]
            },
            'TOWN': {
                name: '宁静小镇',
                width: 22,
                height: 14,
                tiles: this.createTownTiles(),
                npcs: [
                    { x: 11, y: 7, name: '冒险者', type: 'young', dialog: ['听说南边山洞有战车！', '就是有狗守着...'] },
                    { x: 18, y: 5, name: '红狼', type: 'redwolf', dialog: ['...', '我是红狼。', '你也想成为猎人吗？', '加油吧，小子。'] }
                ],
                exits: [
                    { x: 11, y: 13, target: 'WORLD', tx: 45, ty: 55 },
                    { x: 5, y: 8, target: 'HOME', tx: 4, ty: 6 }
                ]
            },
            'WORLD': {
                name: '广阔世界',
                width: 100,
                height: 80,
                tiles: this.createWorldTiles(),
                npcs: [],
                exits: [
                    { x: 45, y: 55, target: 'TOWN', tx: 11, ty: 12 }
                ]
            }
        };

        return maps[mapName] || maps['HOME'];
    }

    createTownTiles() {
        const tiles = [];
        for (let y = 0; y < 14; y++) {
            tiles[y] = [];
            for (let x = 0; x < 22; x++) {
                if (y === 0 || y === 13 || x === 0 || x === 21) {
                    tiles[y][x] = 'W';
                } else if (y >= 2 && y <= 11 && x >= 3 && x <= 18) {
                    tiles[y][x] = 'P';
                } else {
                    tiles[y][x] = 'G';
                }
            }
        }
        tiles[0][1] = 'R';
        tiles[0][20] = 'R';
        tiles[13][1] = 'R';
        tiles[13][20] = 'R';
        tiles[5][8] = 'B';
        tiles[6][14] = 'B';
        tiles[3][15] = 'B';
        return tiles;
    }

    createWorldTiles() {
        const tiles = [];
        for (let y = 0; y < 80; y++) {
            tiles[y] = [];
            for (let x = 0; x < 100; x++) {
                const rand = Math.random();
                if (rand > 0.92) {
                    tiles[y][x] = 'T';
                } else if (rand > 0.85) {
                    tiles[y][x] = 'R';
                } else if (rand > 0.78) {
                    tiles[y][x] = 'W1';
                } else {
                    tiles[y][x] = 'G';
                }
            }
        }
        for (let i = 40; i < 50; i++) {
            tiles[55][i] = 'P';
        }
        for (let i = 50; i < 60; i++) {
            tiles[50 + (i - 50)] = tiles[50 + (i - 50)] || [];
            tiles[50 + (i - 50)][55] = 'P';
        }
        return tiles;
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': this.input.up = true; break;
                case 'ArrowDown': case 'KeyS': this.input.down = true; break;
                case 'ArrowLeft': case 'KeyA': this.input.left = true; break;
                case 'ArrowRight': case 'KeyD': this.input.right = true; break;
                case 'KeyZ': case 'Enter': case 'Space': this.input.confirm = true; break;
                case 'KeyX': case 'Escape': this.input.cancel = true; break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'ArrowUp': case 'KeyW': this.input.up = false; break;
                case 'ArrowDown': case 'KeyS': this.input.down = false; break;
                case 'ArrowLeft': case 'KeyA': this.input.left = false; break;
                case 'ArrowRight': case 'KeyD': this.input.right = false; break;
                case 'KeyZ': case 'Enter': case 'Space': this.input.confirm = false; break;
                case 'KeyX': case 'Escape': this.input.cancel = false; break;
            }
        });

        const buttonMap = {
            'btn-up': 'up', 'btn-down': 'down', 'btn-left': 'left',
            'btn-right': 'right', 'btn-confirm': 'confirm', 'btn-cancel': 'cancel'
        };

        Object.keys(buttonMap).forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('touchstart', (e) => { e.preventDefault(); this.input[buttonMap[id]] = true; btn.classList.add('active'); });
                btn.addEventListener('touchend', (e) => { e.preventDefault(); this.input[buttonMap[id]] = false; btn.classList.remove('active'); });
                btn.addEventListener('mousedown', (e) => { e.preventDefault(); this.input[buttonMap[id]] = true; btn.classList.add('active'); });
                btn.addEventListener('mouseup', (e) => { e.preventDefault(); this.input[buttonMap[id]] = false; btn.classList.remove('active'); });
            }
        });
    }

    showMobileControls() {
        const controls = document.getElementById('mobile-controls');
        if (controls) controls.classList.remove('hidden');
    }

    gameLoop(timestamp = 0) {
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        try {
            this.update(delta);
            this.render();
        } catch (error) {
            console.error('Game loop error:', error);
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(delta) {
        switch (this.gameState) {
            case 'TITLE': this.updateTitle(delta); break;
            case 'INTRO': this.updateIntro(delta); break;
            case 'WORLD': this.updateWorld(delta); break;
            case 'DIALOG': this.updateDialog(delta); break;
        }

        Object.keys(this.input).forEach(k => { this.inputPressed[k] = this.input[k]; });
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
        if (x < 0 || x >= this.mapData.width || y < 0 || y >= this.mapData.height) {
            return false;
        }
        const tile = this.mapData.tiles[y]?.[x];
        const blockedTiles = ['W', 'T', 'W1'];
        return !blockedTiles.includes(tile);
    }

    updateCamera() {
        const targetX = this.player.x * 64 - this.width / 2 + 32;
        const targetY = this.player.y * 64 - this.height / 2 + 32;
        this.camera.x = Math.max(0, Math.min(targetX, this.mapData.width * 64 - this.width));
        this.camera.y = Math.max(0, Math.min(targetY, this.mapData.height * 64 - this.height));
    }

    checkInteractions() {
        if (this.input.confirm && !this.inputPressed.confirm) {
            let cx = this.player.x, cy = this.player.y;
            switch (this.player.direction) {
                case 'up': cy -= 1; break;
                case 'down': cy += 1; break;
                case 'left': cx -= 1; break;
                case 'right': cx += 1; break;
            }

            for (const npc of this.mapData.npcs) {
                if (Math.abs(cx - npc.x) < 1 && Math.abs(cy - npc.y) < 1) {
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

    changeMap(mapName, tx, ty) {
        this.currentMap = mapName;
        this.mapData = this.createMapData(mapName);
        this.player.x = tx;
        this.player.y = ty;
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
                this.changeMap('TOWN', 11, 9);
            };
        }
    }

    updateDialog(delta) {
        if (this.input.confirm && !this.inputPressed.confirm) {
            this.dialogState.index++;
            if (this.dialogState.index >= this.dialogState.lines.length) {
                this.gameState = 'WORLD';
                this.dialogState.active = false;
                if (this.dialogState.callback) this.dialogState.callback();
            }
        }
    }

    // ==========================================
    // 现代像素艺术渲染系统
    // ==========================================

    render() {
        if (!this.ctx) return;

        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        switch (this.gameState) {
            case 'TITLE': this.renderTitle(); break;
            case 'INTRO': this.renderIntro(); break;
            case 'WORLD': this.renderWorld(); break;
            case 'DIALOG': this.renderWorld(); this.renderDialog(); break;
        }
    }

    renderTitle() {
        // 渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 星星装饰
        for (let i = 0; i < 30; i++) {
            const x = (i * 28) % this.width;
            const y = (i * 52) % 520;
            const size = (i % 3) + 4;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 7) * 0.1})`;
            this.ctx.fillRect(x, y, size, size);
        }

        // 主标题 - 霓虹渐变
        this.ctx.save();
        const title = '重装机兵';
        this.ctx.font = 'bold 128px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        // 发光效果
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 60;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillText(title, this.width / 2 + 8, 228);
        
        // 主文字
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ff8787';
        this.ctx.fillText(title, this.width / 2, 220);

        // 副标题 - 科技感
        const subtitle = 'METAL MAX';
        this.ctx.font = '64px "Courier New", monospace';
        this.ctx.shadowColor = '#74b9ff';
        this.ctx.shadowBlur = 40;
        this.ctx.fillStyle = '#74b9ff';
        this.ctx.fillText(subtitle, this.width / 2 + 4, 344);
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#a0d2ff';
        this.ctx.fillText(subtitle, this.width / 2, 336);

        this.ctx.restore();

        // 装饰线条
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(120, 400);
        this.ctx.lineTo(this.width - 120, 400);
        this.ctx.stroke();

        // 底部草地 - 渐变色
        const grassGradient = this.ctx.createLinearGradient(0, 440, 0, this.height);
        grassGradient.addColorStop(0, '#2ecc71');
        grassGradient.addColorStop(0.3, '#27ae60');
        grassGradient.addColorStop(1, '#1e8449');
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 440, this.width, 520);

        // 装饰性坦克剪影 - 更精致
        this.drawCoolTank(200, 620);
        this.drawCoolTank(640, 700);

        // 闪烁提示 - 霓虹风格
        const blink = Math.floor(Date.now() / 400) % 2 === 0;
        if (blink) {
            this.ctx.save();
            this.ctx.shadowColor = '#fff';
            this.ctx.shadowBlur = 32;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 56px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('▶ PUSH START ◀', this.width / 2, 840);
            this.ctx.restore();
        }

        // 版本信息
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.font = '40px "Courier New"';
        this.ctx.fillText('Remake 2026', this.width / 2, 940);
    }

    drawCoolTank(x, y) {
        // 更精致的坦克
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x, y + 20, 160, 60);
        
        // 炮塔
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(x + 48, y, 64, 48);
        
        // 炮管
        this.ctx.fillStyle = '#5d6d7e';
        this.ctx.fillRect(x + 140, y + 12, 72, 20);
        
        // 轮子
        this.ctx.fillStyle = '#1a252f';
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(x + 20 + i * 36, y + 68, 24, 24);
        }
    }

    renderIntro() {
        // 深蓝色背景
        this.ctx.fillStyle = '#0a1628';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const texts = [
            { text: '传说中的大破坏...', y: 280 },
            { text: '文明毁灭之后...', y: 440 },
            { text: '怪物横行的世界...', y: 600 },
            { text: '猎人的时代，开始了！', y: 760 }
        ];

        // 逐个显示文字
        for (let i = 0; i <= this.introStep && i < texts.length; i++) {
            this.ctx.save();
            
            // 发光文字
            this.ctx.shadowColor = '#4ecdc4';
            this.ctx.shadowBlur = 40;
            this.ctx.font = '60px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#4ecdc4';
            this.ctx.fillText(texts[i].text, this.width / 2, texts[i].y);
            
            this.ctx.restore();
        }

        // 闪烁提示
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.save();
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.shadowBlur = 24;
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = '48px "Courier New"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('→ 按 A 键继续 ←', this.width / 2, 900);
            this.ctx.restore();
        }
    }

    renderWorld() {
        this.renderMap();
        this.renderNPCs();
        this.renderPlayer();
        this.renderUI();
    }

    renderMap() {
        const startX = Math.floor(this.camera.x / 64);
        const startY = Math.floor(this.camera.y / 64);
        const endX = startX + Math.ceil(this.width / 64) + 1;
        const endY = startY + Math.ceil(this.height / 64) + 1;

        for (let y = startY; y < endY && y < this.mapData.height; y++) {
            for (let x = startX; x < endX && x < this.mapData.width; x++) {
                if (y < 0 || x < 0) continue;

                const screenX = x * 64 - this.camera.x;
                const screenY = y * 64 - this.camera.y;
                const tile = this.mapData.tiles[y]?.[x];

                this.renderTile(screenX, screenY, tile);
            }
        }
    }

    renderTile(x, y, tile) {
        switch (tile) {
            case 'G': // 草地
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(x + 8, y + 16, 8, 12);
                this.ctx.fillRect(x + 32, y + 4, 8, 12);
                this.ctx.fillRect(x + 52, y + 36, 8, 12);
                this.ctx.fillStyle = '#81ecec';
                this.ctx.fillRect(x + 20, y + 48, 8, 8);
                this.ctx.fillStyle = '#00cec9';
                this.ctx.fillRect(x + 40, y + 20, 6, 8);
                break;

            case 'F': // 地板
                this.ctx.fillStyle = '#ffeaa7';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.fillRect(x + 4, y + 4, 24, 24);
                this.ctx.fillRect(x + 36, y + 36, 24, 24);
                this.ctx.fillStyle = '#f39c12';
                this.ctx.fillRect(x + 12, y + 12, 12, 12);
                this.ctx.fillRect(x + 44, y + 44, 12, 12);
                break;

            case 'W': // 墙壁
                this.ctx.fillStyle = '#636e72';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#b2bec3';
                this.ctx.fillRect(x + 4, y + 4, 56, 16);
                this.ctx.fillStyle = '#dfe6e9';
                this.ctx.fillRect(x + 8, y + 8, 48, 8);
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(x + 20, y + 36, 24, 4);
                break;

            case 'T': // 树
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(x + 28, y + 40, 12, 24);
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(x + 12, y + 8, 40, 36);
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x + 20, y + 16, 24, 20);
                this.ctx.fillStyle = '#00cec9';
                this.ctx.fillRect(x + 24, y + 12, 16, 12);
                break;

            case 'D': // 门
                this.ctx.fillStyle = '#d63031';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#e17055';
                this.ctx.fillRect(x + 8, y + 4, 48, 56);
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.fillRect(x + 40, y + 28, 12, 12);
                this.ctx.fillStyle = '#fab1a0';
                this.ctx.fillRect(x + 12, y + 8, 20, 40);
                break;

            case 'S': // 楼梯
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#0984e3';
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(x + 8 + i * 4, y + 8 + i * 12, 48 - i * 8, 8);
                }
                break;

            case 'C': // 地毯
                this.ctx.fillStyle = '#ffeaa7';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#fd79a8';
                this.ctx.fillRect(x + 12, y + 12, 40, 40);
                this.ctx.fillStyle = '#e84393';
                this.ctx.fillRect(x + 20, y + 20, 24, 24);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(x + 28, y + 28, 8, 8);
                break;

            case 'W1': // 水
                this.ctx.fillStyle = '#0984e3';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(x + 8, y + 8, 16, 8);
                this.ctx.fillRect(x + 36, y + 28, 16, 8);
                this.ctx.fillRect(x + 12, y + 48, 16, 8);
                break;

            case 'P': // 石板路
                this.ctx.fillStyle = '#b2bec3';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#636e72';
                this.ctx.fillRect(x + 4, y + 4, 26, 26);
                this.ctx.fillRect(x + 34, y + 34, 26, 26);
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.fillRect(x + 8, y + 8, 18, 18);
                break;

            case 'R': // 岩石
                this.ctx.fillStyle = '#636e72';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#b2bec3';
                this.ctx.fillRect(x + 8, y + 12, 48, 40);
                this.ctx.fillStyle = '#dfe6e9';
                this.ctx.fillRect(x + 16, y + 20, 32, 24);
                break;

            case 'B': // 建筑
                this.ctx.fillStyle = '#e17055';
                this.ctx.fillRect(x, y, 64, 64);
                this.ctx.fillStyle = '#fab1a0';
                this.ctx.fillRect(x + 4, y + 4, 56, 48);
                this.ctx.fillStyle = '#0984e3';
                this.ctx.fillRect(x + 12, y + 20, 16, 20);
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.fillRect(x + 40, y + 28, 8, 8);
                break;

            default:
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(x, y, 64, 64);
        }
    }

    renderNPCs() {
        for (const npc of this.mapData.npcs) {
            const sx = npc.x * 64 - this.camera.x;
            const sy = npc.y * 64 - this.camera.y;
            this.renderCharacter(sx, sy, npc.type, 'down', 0);
        }
    }

    renderPlayer() {
        const sx = this.player.x * 64 - this.camera.x;
        const sy = this.player.y * 64 - this.camera.y;
        this.renderCharacter(sx, sy, 'hero', this.player.direction, this.player.walkFrame);
    }

    renderCharacter(x, y, type, dir, frame) {
        const colors = this.getColors(type);
        const bob = frame % 2 === 0 ? 0 : -4;

        // 角色阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 12, y + 60, 40, 16);

        // 身体
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 16, y + 28 + bob, 32, 32);
        
        // 衣服高光
        this.ctx.fillStyle = colors.highlight;
        this.ctx.fillRect(x + 20, y + 32 + bob, 12, 12);

        // 头
        this.ctx.fillStyle = '#ffb6c1';
        this.ctx.fillRect(x + 16, y + 4 + bob, 32, 28);
        
        // 面部高光
        this.ctx.fillStyle = '#ffe4e1';
        this.ctx.fillRect(x + 20, y + 8 + bob, 12, 12);

        // 头发
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 12, y + 0 + bob, 40, 16);
        this.ctx.fillRect(x + 12, y + 4 + bob, 12, 12);

        // 眼睛
        this.ctx.fillStyle = '#2d3436';
        if (dir === 'left') {
            this.ctx.fillRect(x + 20, y + 12 + bob, 8, 8);
            this.ctx.fillRect(x + 28, y + 12 + bob, 8, 8);
        } else if (dir === 'right') {
            this.ctx.fillRect(x + 24, y + 12 + bob, 8, 8);
            this.ctx.fillRect(x + 32, y + 12 + bob, 8, 8);
        } else {
            this.ctx.fillRect(x + 20, y + 12 + bob, 8, 8);
            this.ctx.fillRect(x + 36, y + 12 + bob, 8, 8);
        }

        // 眼睛高光
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x + 20, y + 12 + bob, 4, 4);
        if (dir !== 'left') this.ctx.fillRect(x + 36, y + 12 + bob, 4, 4);

        // 腿
        this.ctx.fillStyle = colors.pants;
        if (frame % 2 === 0) {
            this.ctx.fillRect(x + 20, y + 56 + bob, 12, 12);
            this.ctx.fillRect(x + 32, y + 56 + bob, 12, 12);
        } else {
            this.ctx.fillRect(x + 16, y + 60 + bob, 12, 12);
            this.ctx.fillRect(x + 36, y + 52 + bob, 12, 12);
        }

        // 红狼披风
        if (type === 'redwolf') {
            this.ctx.fillStyle = '#ff4757';
            this.ctx.fillRect(x + 8, y + 24 + bob, 12, 32);
            this.ctx.fillStyle = '#ff6b81';
            this.ctx.fillRect(x + 12, y + 28 + bob, 8, 20);
        }
    }

    getColors(type) {
        switch (type) {
            case 'hero':
                return { 
                    body: '#3498db', 
                    highlight: '#74b9ff',
                    pants: '#2980b9', 
                    hair: '#8b4513' 
                };
            case 'young':
                return { 
                    body: '#2ecc71', 
                    highlight: '#55efc4',
                    pants: '#27ae60', 
                    hair: '#6c3483' 
                };
            case 'redwolf':
                return { 
                    body: '#e74c3c', 
                    highlight: '#ff6b6b',
                    pants: '#c0392b', 
                    hair: '#ff4757' 
                };
            case 'uncle':
                return { 
                    body: '#9b59b6', 
                    highlight: '#d4a5ff',
                    pants: '#8e44ad', 
                    hair: '#95a5a6' 
                };
            case 'lady':
                return { 
                    body: '#e91e63', 
                    highlight: '#ff6b9d',
                    pants: '#c2185b', 
                    hair: '#f39c12' 
                };
            default:
                return { 
                    body: '#95a5a6', 
                    highlight: '#bdc3c7',
                    pants: '#7f8c8d', 
                    hair: '#5d6d7e' 
                };
        }
    }

    renderUI() {
        // 渐变状态栏
        const uiGradient = this.ctx.createLinearGradient(0, 0, 0, 208);
        uiGradient.addColorStop(0, 'rgba(45, 52, 54, 0.95)');
        uiGradient.addColorStop(1, 'rgba(30, 30, 46, 0.95)');
        this.ctx.fillStyle = uiGradient;
        this.ctx.fillRect(0, 0, this.width, 208);

        // 精致边框
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 8;
        this.ctx.strokeRect(4, 4, this.width - 8, 200);

        // 分隔线
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(380, 20, 8, 176);

        // 左侧 - 角色信息
        this.ctx.textAlign = 'left';
        
        // 名字
        this.ctx.save();
        this.ctx.shadowColor = '#fff';
        this.ctx.shadowBlur = 16;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 44px "Courier New"';
        this.ctx.fillText(this.player.name, 40, 72);
        this.ctx.restore();

        // 等级
        this.ctx.fillStyle = '#ffeaa7';
        this.ctx.font = 'bold 40px "Courier New"';
        this.ctx.fillText(`Lv.${this.player.level}`, 40, 128);

        // HP条 - 更精致
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 40px "Courier New"';
        this.ctx.fillText('HP', 40, 184);
        
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(112, 152, 232, 40);
        
        const hpPercent = this.player.hp / this.player.maxHp;
        const hpColor = hpPercent > 0.6 ? '#00b894' : hpPercent > 0.3 ? '#fdcb6e' : '#e17055';
        this.ctx.fillStyle = hpColor;
        this.ctx.fillRect(120, 160, Math.floor(216 * hpPercent), 24);
        
        this.ctx.strokeStyle = '#dfe6e9';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(112, 152, 232, 40);

        // 右侧 - 金币和地图
        this.ctx.textAlign = 'right';
        
        // 金币
        this.ctx.save();
        this.ctx.shadowColor = '#ffd700';
        this.ctx.shadowBlur = 24;
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 48px "Courier New"';
        this.ctx.fillText(`G ${this.player.gold}`, this.width - 40, 80);
        this.ctx.restore();

        // 地图名称
        this.ctx.fillStyle = '#74b9ff';
        this.ctx.font = 'bold 40px "Courier New"';
        this.ctx.fillText(this.mapData.name, this.width - 40, 184);
    }

    renderDialog() {
        // 对话框背景 - 渐变
        const dialogGradient = this.ctx.createLinearGradient(0, this.height - 312, 0, this.height);
        dialogGradient.addColorStop(0, 'rgba(45, 52, 54, 0.98)');
        dialogGradient.addColorStop(1, 'rgba(30, 30, 46, 0.98)');
        this.ctx.fillStyle = dialogGradient;
        this.ctx.fillRect(20, this.height - 312, this.width - 40, 292);

        // 装饰边框
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 12;
        this.ctx.strokeRect(20, this.height - 312, this.width - 40, 292);
        
        this.ctx.strokeStyle = '#74b9ff';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(32, this.height - 300, this.width - 64, 268);

        // NPC名字
        if (this.dialogState.npc) {
            this.ctx.save();
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 20;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 48px "Courier New"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.dialogState.npc.name, 60, this.height - 232);
            this.ctx.restore();
        }

        // 分隔线
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(60, this.height - 208, this.width - 120, 4);

        // 对话内容
        this.ctx.fillStyle = '#dfe6e9';
        this.ctx.font = '52px "Courier New"';
        this.ctx.textAlign = 'left';

        if (this.dialogState.index < this.dialogState.lines.length) {
            const text = this.dialogState.lines[this.dialogState.index];
            this.ctx.fillText(text, 60, this.height - 128);
        }

        // 闪烁提示箭头 - 更精致
        const blink = Math.floor(Date.now() / 280) % 2 === 0;
        if (blink) {
            this.ctx.save();
            this.ctx.textAlign = 'right';
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.shadowBlur = 24;
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = '56px "Courier New"';
            this.ctx.fillText('▼', this.width - 60, this.height - 40);
            this.ctx.restore();
        }
    }
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.gameInstance = new Game();
    } catch (e) {
        console.error('Error starting game:', e);
    }
});
