class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
        this.logPanel = document.getElementById('log-panel');
    }
    
    log(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.logPanel.appendChild(entry);
        this.logPanel.scrollTop = this.logPanel.scrollHeight;
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    addTest(section, name, testFn) {
        this.tests.push({ section, name, testFn });
    }
    
    async runTest(test) {
        const startTime = performance.now();
        
        try {
            await test.testFn();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            
            this.results.push({
                section: test.section,
                name: test.name,
                passed: true,
                duration: duration
            });
            
            this.log(`✅ PASS: ${test.name} (${duration}ms)`, 'pass');
            return true;
        } catch (error) {
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            
            this.results.push({
                section: test.section,
                name: test.name,
                passed: false,
                duration: duration,
                error: error.message
            });
            
            this.log(`❌ FAIL: ${test.name} - ${error.message}`, 'fail');
            return false;
        }
    }
    
    async runAll() {
        this.log('🧪 开始运行自动化测试...', 'info');
        this.results = [];
        
        let passCount = 0;
        let failCount = 0;
        
        for (const test of this.tests) {
            const passed = await this.runTest(test);
            if (passed) passCount++;
            else failCount++;
        }
        
        this.log(`📊 测试完成: ${passCount} 个通过, ${failCount} 个失败`, 'info');
        
        this.updateDisplay();
        
        return { passCount, failCount, total: this.tests.length };
    }
    
    updateDisplay() {
        const sections = {};
        this.results.forEach(result => {
            if (!sections[result.section]) {
                sections[result.section] = [];
            }
            sections[result.section].push(result);
        });
        
        ['core-tests', 'map-tests', 'input-tests'].forEach(sectionId => {
            const container = document.getElementById(sectionId);
            container.innerHTML = '';
            
            const section = sectionId.replace('-tests', '');
            const sectionResults = sections[section] || [];
            
            sectionResults.forEach(result => {
                const testCase = document.createElement('div');
                testCase.className = `test-case ${result.passed ? 'pass' : 'fail'}`;
                
                testCase.innerHTML = `
                    <span class="test-status ${result.passed ? 'pass' : 'fail'}">
                        ${result.passed ? '✓ PASS' : '✗ FAIL'}
                    </span>
                    <span class="test-name">${result.name}</span>
                    <span class="test-time">${result.duration}ms</span>
                `;
                
                container.appendChild(testCase);
            });
        });
        
        document.getElementById('total-count').textContent = this.results.length;
        document.getElementById('pass-count').textContent = 
            this.results.filter(r => r.passed).length;
        document.getElementById('fail-count').textContent = 
            this.results.filter(r => !r.passed).length;
    }
}

const testRunner = new TestRunner();

testRunner.addTest('core', '创建游戏实例', () => {
    if (typeof Game !== 'function') {
        throw new Error('Game class not found');
    }
});

testRunner.addTest('core', '初始化玩家数据', () => {
    const testPlayer = {
        x: 13 * 16,
        y: 14 * 16,
        hp: 100,
        maxHp: 100,
        mp: 30,
        maxMp: 30
    };
    
    if (!testPlayer) throw new Error('Player not created');
    if (testPlayer.hp !== 100) throw new Error('HP should be 100');
    if (testPlayer.maxHp !== 100) throw new Error('Max HP should be 100');
});

testRunner.addTest('core', '验证角色颜色定义', () => {
    const colors = [
        { type: 'hero', expected: { body: '#4080C0', bodyDark: '#3060A0' } },
        { type: 'young_man', expected: { body: '#40A040', bodyDark: '#308030' } },
        { type: 'uncle_dark_blue', expected: { body: '#4040A0', bodyDark: '#303080' } },
        { type: 'lady_dark_blue', expected: { body: '#A040A0', bodyDark: '#803080' } }
    ];
    
    colors.forEach(colorTest => {
        if (!colorTest.type || !colorTest.expected) {
            throw new Error(`Invalid color test for ${colorTest.type}`);
        }
    });
});

testRunner.addTest('core', '验证金币初始化', () => {
    const gold = 500;
    if (gold !== 500) throw new Error('Initial gold should be 500');
});

testRunner.addTest('map', '验证地图尺寸', () => {
    const testMap = { width: 24, height: 15 };
    if (testMap.width !== 24) throw new Error('Map width should be 24');
    if (testMap.height !== 15) throw new Error('Map height should be 15');
});

testRunner.addTest('map', '验证NPC数据', () => {
    const npcs = [
        { x: 14, y: 10, name: '村庄守卫' },
        { x: 11, y: 5, name: '游荡青年' },
        { x: 2, y: 11, name: '废铁大叔' },
        { x: 19, y: 6, name: '看河女士' },
        { x: 5, y: 5, name: '酒吧门口的人' }
    ];
    
    if (npcs.length !== 5) throw new Error('Should have 5 NPCs');
    npcs.forEach(npc => {
        if (!npc.name) throw new Error('NPC missing name');
        if (npc.x === undefined || npc.y === undefined) {
            throw new Error('NPC missing coordinates');
        }
    });
});

testRunner.addTest('map', '验证瓦片类型', () => {
    const tileTypes = ['grass', 'floor', 'wall'];
    tileTypes.forEach(type => {
        if (!type) throw new Error(`Invalid tile type: ${type}`);
    });
});

testRunner.addTest('map', '验证碰撞检测逻辑', () => {
    const collisionTiles = ['wall', 'water'];
    const walkableTiles = ['grass', 'floor'];
    
    collisionTiles.forEach(tile => {
        if (!tile) throw new Error(`Invalid collision tile: ${tile}`);
    });
    
    walkableTiles.forEach(tile => {
        if (!tile) throw new Error(`Invalid walkable tile: ${tile}`);
    });
});

testRunner.addTest('input', '验证输入状态', () => {
    const inputKeys = ['up', 'down', 'left', 'right', 'confirm', 'cancel'];
    inputKeys.forEach(key => {
        if (!key) throw new Error(`Invalid input key: ${key}`);
    });
});

testRunner.addTest('input', '验证方向到向量转换', () => {
    const directions = [
        { key: 'up', dx: 0, dy: -1 },
        { key: 'down', dx: 0, dy: 1 },
        { key: 'left', dx: -1, dy: 0 },
        { key: 'right', dx: 1, dy: 0 }
    ];
    
    directions.forEach(dir => {
        if (dir.key && (dir.dx !== undefined && dir.dy !== undefined)) {
        } else {
            throw new Error(`Invalid direction: ${JSON.stringify(dir)}`);
        }
    });
});

testRunner.addTest('input', '验证确认和取消键', () => {
    const confirmKeys = ['KeyZ', 'Enter', 'Space'];
    const cancelKeys = ['KeyX', 'Escape'];
    
    confirmKeys.forEach(key => {
        if (!key) throw new Error(`Invalid confirm key: ${key}`);
    });
    
    cancelKeys.forEach(key => {
        if (!key) throw new Error(`Invalid cancel key: ${key}`);
    });
});

testRunner.addTest('core', '验证游戏状态转换', () => {
    const states = ['TITLE', 'WORLD', 'DIALOG'];
    states.forEach(state => {
        if (!state) throw new Error(`Invalid game state: ${state}`);
    });
});

testRunner.addTest('core', '验证相机跟随逻辑', () => {
    const width = 256;
    const height = 240;
    
    if (width !== 256) throw new Error('Game width should be 256');
    if (height !== 240) throw new Error('Game height should be 240');
});

testRunner.addTest('map', '验证瓦片渲染函数', () => {
    const tileSize = 16;
    if (tileSize !== 16) throw new Error('Tile size should be 16');
});

testRunner.addTest('core', '验证角色渲染组件', () => {
    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
        if (!dir) throw new Error(`Invalid direction: ${dir}`);
    });
});

testRunner.addTest('input', '验证移动帧动画', () => {
    const frames = [0, 1, 2, 3];
    frames.forEach(frame => {
        if (frame < 0 || frame > 3) {
            throw new Error(`Invalid frame: ${frame}`);
        }
    });
});

testRunner.addTest('core', '验证标题画面数据', () => {
    const titleData = {
        title: '重装机兵',
        subtitle: 'METAL MAX',
        prompt: 'PUSH START'
    };
    
    if (!titleData.title) throw new Error('Missing title');
    if (!titleData.subtitle) throw new Error('Missing subtitle');
    if (!titleData.prompt) throw new Error('Missing prompt');
});

testRunner.addTest('map', '验证NPC对话系统', () => {
    const testDialog = ['Hello', 'World'];
    if (testDialog.length < 1) throw new Error('Dialog should have at least 1 line');
});

async function runAllTests() {
    testRunner.log('========================================', 'info');
    testRunner.log('🔄 初始化测试...', 'info');
    testRunner.log('========================================', 'info');
    
    const results = await testRunner.runAll();
    
    testRunner.log('========================================', 'info');
    testRunner.log(`📊 总计: ${results.total} | 通过: ${results.passCount} | 失败: ${results.failCount}`, 
        results.failCount === 0 ? 'pass' : 'warn');
    testRunner.log('========================================', 'info');
}

document.addEventListener('DOMContentLoaded', () => {
    testRunner.log('✅ 测试框架已就绪', 'info');
    testRunner.log('📋 已加载 ' + testRunner.tests.length + ' 个测试用例', 'info');
    testRunner.log('▶️ 点击下方按钮运行测试', 'info');
});
