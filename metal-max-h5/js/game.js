// ==========================================
// 重装机兵 Metal Max - FC原版风格
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

        console.log('✅ Metal Max initialized!');
    }

    initGame() {
        this.gameState = 'TITLE'; // TITLE, INTRO, WORLD, DIALOG

        // 主角名字
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

        this.storyProgress = {
            metFather: false
        };

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
                name: '拉多家',
                width: 10,
                height: 8,
                tiles: [
                    ['W','W','W','W','W','W','W','W','W','W'],
                    ['W','F','F','F','F','F','F','F','F','W'],
                    ['W','F','F','F','F','F','F','F','F','W'],
                    ['W','F','F','F','F','F','F','F','F','W'],
                    ['W','F','F','W','W','W','F','F','F','W'],
                    ['W','F','F','W','S','W','F','F','F','W'],
                    ['W','F','F','F','F','F','F','F','F','W'],
                    ['W','W','W','W','D','W','W','W','W','W']
                ],
                npcs: [
                    { x: 7, y: 2, name: '姐姐', type: 'lady', dialog: ['弟弟，你又想', '去冒险了吗？'] },
                    { x: 2, y: 5, name: '父亲', type: 'uncle', dialog: ['你小子又来了！', '不许当赏金猎人！', '给我滚出去！'], event: 'KICK_OUT' }
                ],
                exits: [
                    { x: 4, y: 7, target: 'TOWN', tx: 11, ty: 9 }
                ]
            },
            'TOWN': {
                name: '拉多镇',
                width: 22,
                height: 14,
                tiles: this.createTownTiles(),
                npcs: [
                    { x: 11, y: 7, name: '年轻人', type: 'young', dialog: ['南边山洞有战', '车！不过有狗'] },
                    { x: 18, y: 5, name: '红狼', type: 'redwolf', dialog: ['...', '我是红狼。', '变强给我看！'] }
                ],
                exits: [
                    { x: 11, y: 13, target: 'WORLD', tx: 45, ty: 55 },
                    { x: 5, y: 8, target: 'HOME', tx: 4, ty: 6 }
                ]
            },
            'WORLD': {
                name: '世界地图',
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
                tiles[y][x] = Math.random() > 0.9 ? 'T' : 'G';
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
    // 渲染系统 - FC风格
    // ==========================================

    render() {
        if (!this.ctx) return;

        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        switch (this.gameState) {
            case 'TITLE': this.renderTitle(); break;
            case 'INTRO': this.renderIntro(); break;
            case 'WORLD': this.renderWorld(); break;
            case 'DIALOG': this.renderWorld(); this.renderDialog(); break;
        }
    }

    renderTitle() {
        // 顶部黑底
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, 120);

        // 标题 - 重装机兵 (红色)
        this.ctx.fillStyle = '#E04040';
        this.ctx.font = 'bold 28px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('重装机兵', this.width / 2, 60);

        // METAL MAX (白色)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Courier New';
        this.ctx.fillText('METAL MAX', this.width / 2, 90);

        // 绿色草地
        this.ctx.fillStyle = '#4A8A4A';
        this.ctx.fillRect(0, 120, this.width, 120);

        // 战车剪影 - 简单像素风格
        this.drawTank(40, 150);
        this.drawTank(180, 170);

        // 闪烁提示
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px Courier New';
            this.ctx.fillText('PUSH START', this.width / 2, 200);
        }
    }

    drawTank(x, y) {
        this.ctx.fillStyle = '#2A5A2A';
        this.ctx.fillRect(x, y, 45, 22);
        this.ctx.fillRect(x + 10, y - 8, 22, 12);
        this.ctx.fillRect(x + 40, y - 4, 20, 6);
    }

    renderIntro() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const texts = [
            { text: '传说中的大破坏...', y: 80 },
            { text: '文明毁灭之后...', y: 110 },
            { text: '怪物横行的世界...', y: 140 },
            { text: '赏金猎人的时代开始了！', y: 170 }
        ];

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Courier New';
        this.ctx.textAlign = 'center';

        for (let i = 0; i <= this.introStep && i < texts.length; i++) {
            this.ctx.fillText(texts[i].text, this.width / 2, texts[i].y);
        }

        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.fillStyle = '#E04040';
            this.ctx.fillText('按A键继续', this.width / 2, 210);
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
            case 'G': // Grass 草地
                this.ctx.fillStyle = '#4A8A4A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#3A7A3A';
                this.ctx.fillRect(x + 2, y + 2, 3, 3);
                break;
            case 'F': // Floor 地板
                this.ctx.fillStyle = '#9A8A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#8A7A5A';
                this.ctx.fillRect(x + 2, y + 2, 5, 5);
                break;
            case 'W': // Wall 墙壁
                this.ctx.fillStyle = '#5A5A6A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#6A6A7A';
                this.ctx.fillRect(x + 2, y + 2, 12, 4);
                break;
            case 'T': // Tree 树
                this.ctx.fillStyle = '#3A6A3A';
                this.ctx.fillRect(x, y, 16, 16);
                this.ctx.fillStyle = '#4A8A4A';
                this.ctx.fillRect(x + 4, y + 3, 8, 9);
                break;
            case 'D': // Door 门
                this.ctx.fillStyle = '#7A6040';
                this.ctx.fillRect(x, y, 16, 16);
                break;
            case 'S': // Stairs 楼梯
                this.ctx.fillStyle = '#8A7A6A';
                this.ctx.fillRect(x, y, 16, 16);
                break;
            default:
                this.ctx.fillStyle = '#000';
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

        // 身体
        this.ctx.fillStyle = colors.body;
        this.ctx.fillRect(x + 5, y + 8 + bob, 6, 7);

        // 头
        this.ctx.fillStyle = '#FFD0A0';
        this.ctx.fillRect(x + 5, y + 2 + bob, 6, 6);

        // 头发
        this.ctx.fillStyle = colors.hair;
        this.ctx.fillRect(x + 4, y + 1 + bob, 8, 3);

        // 眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x + 5, y + 3 + bob, 1, 1);
        this.ctx.fillRect(x + 9, y + 3 + bob, 1, 1);

        // 腿
        this.ctx.fillStyle = colors.pants;
        if (frame % 2 === 0) {
            this.ctx.fillRect(x + 5, y + 14 + bob, 2, 2);
            this.ctx.fillRect(x + 9, y + 14 + bob, 2, 2);
        } else {
            this.ctx.fillRect(x + 4, y + 15 + bob, 2, 2);
            this.ctx.fillRect(x + 10, y + 13 + bob, 2, 2);
        }

        // 红狼披风
        if (type === 'redwolf') {
            this.ctx.fillStyle = '#C02020';
            this.ctx.fillRect(x + 3, y + 7 + bob, 2, 6);
        }
    }

    getColors(type) {
        switch (type) {
            case 'hero':
                return { body: '#4080C0', pants: '#3060A0', hair: '#804020' };
            case 'young':
                return { body: '#40A040', pants: '#308030', hair: '#402020' };
            case 'redwolf':
                return { body: '#C02020', pants: '#A01010', hair: '#C04040' };
            case 'uncle':
                return { body: '#404080', pants: '#303060', hair: '#606060' };
            case 'lady':
                return { body: '#A040A0', pants: '#803080', hair: '#A06040' };
            default:
                return { body: '#606080', pants: '#505070', hair: '#404040' };
        }
    }

    renderUI() {
        // 状态栏
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, 48);

        // 边框
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.width, 48);

        // 分隔线
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(100, 4, 2, 40);

        // 左侧 - 名字和等级
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '10px Courier New';
        this.ctx.fillText(this.player.name, 8, 16);
        this.ctx.font = '9px Courier New';
        this.ctx.fillText(`Lv${this.player.level}`, 8, 30);

        // HP条
        this.ctx.fillText('HP', 8, 42);
        this.ctx.fillStyle = '#800000';
        this.ctx.fillRect(30, 34, 60, 10);
        this.ctx.fillStyle = '#40C040';
        const hpWidth = Math.floor(60 * (this.player.hp / this.player.maxHp));
        this.ctx.fillRect(30, 34, hpWidth, 10);
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(30, 34, 60, 10);

        // 右侧 - 金币和地图
        this.ctx.textAlign = 'right';
        this.ctx.font = '10px Courier New';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText(`G${this.player.gold}`, this.width - 8, 18);

        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '9px Courier New';
        this.ctx.fillText(this.mapData.name, this.width - 8, 42);
    }

    renderDialog() {
        // 对话框
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(4, this.height - 70, this.width - 8, 66);

        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(4, this.height - 70, this.width - 8, 66);

        // NPC名字
        if (this.dialogState.npc) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 11px Courier New';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(this.dialogState.npc.name, 12, this.height - 52);
        }

        // 对话内容
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '11px Courier New';

        if (this.dialogState.index < this.dialogState.lines.length) {
            const text = this.dialogState.lines[this.dialogState.index];
            this.ctx.fillText(text, 12, this.height - 30);
        }

        // 闪烁三角
        const blink = Math.floor(Date.now() / 300) % 2 === 0;
        if (blink) {
            this.ctx.textAlign = 'right';
            this.ctx.fillText('▼', this.width - 10, this.height - 10);
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
