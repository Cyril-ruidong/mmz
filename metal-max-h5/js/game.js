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

        this.width = 256;
        this.height = 240;

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
                    ['W','F','F','F','F','F','F','F','F','W'],
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
                    tiles[y][x] = 'F';
                } else {
                    tiles[y][x] = 'G';
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
                tiles[y][x] = Math.random() > 0.92 ? 'T' : 'G';
            }
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
        return tile !== 'W' && tile !== 'T';
    }

    updateCamera() {
        const targetX = this.player.x * 16 - this.width / 2 + 8;
        const targetY = this.player.y * 16 - this.height / 2 + 8;
        this.camera.x = Math.max(0, Math.min(targetX, this.mapData.width * 16 - this.width));
        this.camera.y = Math.max(0, Math.min(targetY, this.mapData.height * 16 - this.height));
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
            const x = (i * 7) % this.width;
            const y = (i * 13) % 130;
            const size = (i % 3) + 1;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + (i % 7) * 0.1})`;
            this.ctx.fillRect(x, y, size, size);
        }

        // 主标题 - 霓虹渐变
        this.ctx.save();
        const title = '重装机兵';
        this.ctx.font = 'bold 32px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        // 发光效果
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillText(title, this.width / 2 + 2, 57);
        
        // 主文字
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ff8787';
        this.ctx.fillText(title, this.width / 2, 55);

        // 副标题 - 科技感
        const subtitle = 'METAL MAX';
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.shadowColor = '#74b9ff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#74b9ff';
        this.ctx.fillText(subtitle, this.width / 2 + 1, 86);
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#a0d2ff';
        this.ctx.fillText(subtitle, this.width / 2, 84);

        this.ctx.restore();

        // 装饰线条
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(30, 100);
        this.ctx.lineTo(this.width - 30, 100);
        this.ctx.stroke();

        // 底部草地 - 渐变色
        const grassGradient = this.ctx.createLinearGradient(0, 110, 0, this.height);
        grassGradient.addColorStop(0, '#2ecc71');
        grassGradient.addColorStop(0.3, '#27ae60');
        grassGradient.addColorStop(1, '#1e8449');
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 110, this.width, 130);

        // 装饰性坦克剪影 - 更精致
        this.drawCoolTank(50, 155);
        this.drawCoolTank(160, 175);

        // 闪烁提示 - 霓虹风格
        const blink = Math.floor(Date.now() / 400) % 2 === 0;
        if (blink) {
            this.ctx.save();
            this.ctx.shadowColor = '#fff';
            this.ctx.shadowBlur = 8;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('▶ PUSH START ◀', this.width / 2, 210);
            this.ctx.restore();
        }

        // 版本信息
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.font = '10px "Courier New"';
        this.ctx.fillText('Remake 2026', this.width / 2, 235);
    }

    drawCoolTank(x, y) {
        // 更精致的坦克
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x, y + 5, 40, 15);
        
        // 炮塔
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(x + 12, y, 16, 12);
        
        // 炮管
        this.ctx.fillStyle = '#5d6d7e';
        this.ctx.fillRect(x + 35, y + 3, 18, 5);
        
        // 轮子
        this.ctx.fillStyle = '#1a252f';
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(x + 5 + i * 9, y + 17, 6, 6);
        }
    }

    renderIntro() {
        // 深蓝色背景
        this.ctx.fillStyle = '#0a1628';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const texts = [
            { text: '传说中的大破坏...', y: 70 },
            { text: '文明毁灭之后...', y: 110 },
            { text: '怪物横行的世界...', y: 150 },
            { text: '猎人的时代，开始了！', y: 190 }
        ];

        // 逐个显示文字
        for (let i = 0; i <= this.introStep && i < texts.length; i++) {
            this.ctx.save();
            
            // 发光文字
            this.ctx.shadowColor = '#4ecdc4';
            this.ctx.shadowBlur = 10;
            this.ctx.font = '15px "Courier New", monospace';
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
            this.ctx.shadowBlur = 6;
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = '12px "Courier New"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('→ 按 A 键继续 ←', this.width / 2, 225);
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
        const startX = Math.floor(this.camera.x / 16);
        const startY = Math.floor(this.camera.y / 16);
        const endX = startX + Math.ceil(this.width / 16) + 1;
        const endY = startY + Math.ceil(this.height / 16) + 1;

        for (let y = startY; y < endY && y < this.mapData.height; y++) {
            for (let x = startX; x < endX && x < this.mapData.width; x++) {
                if (y < 0 || x < 0) continue;

                const screenX = x * 16 - this.camera.x;
                const screenY = y * 16 - this.camera.y;
                const tile = this.mapData.tiles[y]?.[x];

                this.renderTile(screenX, screenY, tile);
            }
        }
    }

    renderTile(x, y, tile) {
        switch (tile) {
            case 'G': // 草地
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(x + 2, y + 4, 2, 3);
                this.ctx.fillRect(x + 8, y + 1, 2, 3);
                this.ctx.fillRect(x + 13, y + 9, 2, 3);
                this.ctx.fillStyle = '#81ecec';
                this.ctx.fillRect(x + 5, y + 12, 2, 2);
                break;

            case 'F': // 地板
                this.ctx.fillStyle = '#ffeaa7';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.fillRect(x + 1, y + 1, 6, 6);
                this.ctx.fillRect(x + 9, y + 9, 6, 6);
                this.ctx.fillStyle = '#f39c12';
                this.ctx.fillRect(x + 3, y + 3, 3, 3);
                break;

            case 'W': // 墙壁
                this.ctx.fillStyle = '#636e72';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#b2bec3';
                this.ctx.fillRect(x + 1, y + 1, 14, 4);
                this.ctx.fillStyle = '#dfe6e9';
                this.ctx.fillRect(x + 2, y + 2, 12, 2);
                break;

            case 'T': // 树
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(x + 7, y + 10, 3, 6);
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(x + 3, y + 2, 10, 9);
                this.ctx.fillStyle = '#55efc4';
                this.ctx.fillRect(x + 5, y + 4, 6, 5);
                break;

            case 'D': // 门
                this.ctx.fillStyle = '#d63031';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#e17055';
                this.ctx.fillRect(x + 2, y + 1, 12, 14);
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.fillRect(x + 10, y + 7, 3, 3);
                break;

            case 'S': // 楼梯
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#0984e3';
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(x + 2 + i, y + 2 + i * 3, 12 - i * 2, 2);
                }
                break;

            case 'C': // 地毯装饰
                this.ctx.fillStyle = '#ffeaa7';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#fd79a8';
                this.ctx.fillRect(x + 3, y + 3, 10, 10);
                this.ctx.fillStyle = '#e84393';
                this.ctx.fillRect(x + 5, y + 5, 6, 6);
                break;

            default:
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(x, y, 16, 16);
        }
    }

    renderNPCs() {
        for (const npc of this.mapData.npcs) {
            const sx = npc.x * 16 - this.camera.x;
            const sy = npc.y * 16 - this.camera.y;
            this.renderCharacter(sx, sy, npc.type, 'down', 0);
        }
    }

    renderPlayer() {
        const sx = this.player.x * 16 - this.camera.x;
        const sy = this.player.y * 16 - this.camera.y;
        this.renderCharacter(sx, sy, 'hero', this.player.direction, this.player.walkFrame);
    }

    renderCharacter(x, y, type, dir, frame) {
        const colors = this.getColors(type);
        const bob = frame % 2 === 0 ? 0 : -1;

        // 角色阴影
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + 3, y + 15, 10, 4);

        // 身体
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 4, y + 7 + bob, 8, 8);
        
        // 衣服高光
        this.ctx.fillStyle = colors.highlight;
        this.ctx.fillRect(x + 5, y + 8 + bob, 3, 3);

        // 头
        this.ctx.fillStyle = '#ffb6c1';
        this.ctx.fillRect(x + 4, y + 1 + bob, 8, 7);
        
        // 面部高光
        this.ctx.fillStyle = '#ffe4e1';
        this.ctx.fillRect(x + 5, y + 2 + bob, 3, 3);

        // 头发
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 3, y + 0 + bob, 10, 4);
        this.ctx.fillRect(x + 3, y + 1 + bob, 3, 3);

        // 眼睛
        this.ctx.fillStyle = '#2d3436';
        if (dir === 'left') {
            this.ctx.fillRect(x + 5, y + 3 + bob, 2, 2);
            this.ctx.fillRect(x + 7, y + 3 + bob, 2, 2);
        } else if (dir === 'right') {
            this.ctx.fillRect(x + 6, y + 3 + bob, 2, 2);
            this.ctx.fillRect(x + 8, y + 3 + bob, 2, 2);
        } else {
            this.ctx.fillRect(x + 5, y + 3 + bob, 2, 2);
            this.ctx.fillRect(x + 9, y + 3 + bob, 2, 2);
        }

        // 眼睛高光
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(x + 5, y + 3 + bob, 1, 1);
        if (dir !== 'left') this.ctx.fillRect(x + 9, y + 3 + bob, 1, 1);

        // 腿
        this.ctx.fillStyle = colors.pants;
        if (frame % 2 === 0) {
            this.ctx.fillRect(x + 5, y + 14 + bob, 3, 3);
            this.ctx.fillRect(x + 8, y + 14 + bob, 3, 3);
        } else {
            this.ctx.fillRect(x + 4, y + 15 + bob, 3, 3);
            this.ctx.fillRect(x + 9, y + 13 + bob, 3, 3);
        }

        // 红狼披风
        if (type === 'redwolf') {
            this.ctx.fillStyle = '#ff4757';
            this.ctx.fillRect(x + 2, y + 6 + bob, 3, 8);
            this.ctx.fillStyle = '#ff6b81';
            this.ctx.fillRect(x + 3, y + 7 + bob, 2, 5);
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
        const uiGradient = this.ctx.createLinearGradient(0, 0, 0, 52);
        uiGradient.addColorStop(0, 'rgba(45, 52, 54, 0.95)');
        uiGradient.addColorStop(1, 'rgba(30, 30, 46, 0.95)');
        this.ctx.fillStyle = uiGradient;
        this.ctx.fillRect(0, 0, this.width, 52);

        // 精致边框
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(1, 1, this.width - 2, 50);

        // 分隔线
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(95, 5, 2, 44);

        // 左侧 - 角色信息
        this.ctx.textAlign = 'left';
        
        // 名字
        this.ctx.save();
        this.ctx.shadowColor = '#fff';
        this.ctx.shadowBlur = 4;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px "Courier New"';
        this.ctx.fillText(this.player.name, 10, 18);
        this.ctx.restore();

        // 等级
        this.ctx.fillStyle = '#ffeaa7';
        this.ctx.font = '10px "Courier New"';
        this.ctx.fillText(`Lv.${this.player.level}`, 10, 32);

        // HP条 - 更精致
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px "Courier New"';
        this.ctx.fillText('HP', 10, 46);
        
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(28, 38, 58, 10);
        
        const hpPercent = this.player.hp / this.player.maxHp;
        const hpColor = hpPercent > 0.6 ? '#00b894' : hpPercent > 0.3 ? '#fdcb6e' : '#e17055';
        this.ctx.fillStyle = hpColor;
        this.ctx.fillRect(30, 40, Math.floor(54 * hpPercent), 6);
        
        this.ctx.strokeStyle = '#dfe6e9';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(28, 38, 58, 10);

        // 右侧 - 金币和地图
        this.ctx.textAlign = 'right';
        
        // 金币
        this.ctx.save();
        this.ctx.shadowColor = '#ffd700';
        this.ctx.shadowBlur = 6;
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 12px "Courier New"';
        this.ctx.fillText(`G ${this.player.gold}`, this.width - 10, 20);
        this.ctx.restore();

        // 地图名称
        this.ctx.fillStyle = '#74b9ff';
        this.ctx.font = '10px "Courier New"';
        this.ctx.fillText(this.mapData.name, this.width - 10, 46);
    }

    renderDialog() {
        // 对话框背景 - 渐变
        const dialogGradient = this.ctx.createLinearGradient(0, this.height - 78, 0, this.height);
        dialogGradient.addColorStop(0, 'rgba(45, 52, 54, 0.98)');
        dialogGradient.addColorStop(1, 'rgba(30, 30, 46, 0.98)');
        this.ctx.fillStyle = dialogGradient;
        this.ctx.fillRect(5, this.height - 78, this.width - 10, 73);

        // 装饰边框
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(5, this.height - 78, this.width - 10, 73);
        
        this.ctx.strokeStyle = '#74b9ff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(8, this.height - 75, this.width - 16, 67);

        // NPC名字
        if (this.dialogState.npc) {
            this.ctx.save();
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 5;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 12px "Courier New"';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.dialogState.npc.name, 15, this.height - 58);
            this.ctx.restore();
        }

        // 分隔线
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(15, this.height - 52, this.width - 30, 1);

        // 对话内容
        this.ctx.fillStyle = '#dfe6e9';
        this.ctx.font = '13px "Courier New"';
        this.ctx.textAlign = 'left';

        if (this.dialogState.index < this.dialogState.lines.length) {
            const text = this.dialogState.lines[this.dialogState.index];
            this.ctx.fillText(text, 15, this.height - 32);
        }

        // 闪烁提示箭头 - 更精致
        const blink = Math.floor(Date.now() / 280) % 2 === 0;
        if (blink) {
            this.ctx.save();
            this.ctx.textAlign = 'right';
            this.ctx.shadowColor = '#ff6b6b';
            this.ctx.shadowBlur = 6;
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = '14px "Courier New"';
            this.ctx.fillText('▼', this.width - 15, this.height - 10);
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
