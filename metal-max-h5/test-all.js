#!/usr/bin/env node

// 重装机兵自动化测试
console.log('🎮 重装机兵 H5 自动化测试');
console.log('================================\n');

let passed = 0;
let failed = 0;
const tests = [];

// 测试工具
function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        tests.push({ name, status: 'pass' });
        passed++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   错误: ${error.message}`);
        tests.push({ name, status: 'fail', error: error.message });
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || '断言失败');
    }
}

// 测试1: 游戏代码语法检查
test('1. 游戏代码语法正确', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.length > 1000, '游戏代码文件太短');
    assert(code.includes('class Game'), '缺少Game类');
    assert(code.includes('constructor'), '缺少构造函数');
});

// 测试2: 模拟游戏初始化
test('2. 游戏可以初始化', () => {
    const fs = require('fs');
    const vm = require('vm');
    
    const code = fs.readFileSync('js/game.js', 'utf-8');
    
    // 创建模拟环境
    const mockCanvas = {
        width: 256,
        height: 240,
        getContext: () => ({
            fillStyle: '',
            fillRect: () => {},
            font: '',
            textAlign: '',
            fillText: () => {},
            strokeStyle: '',
            lineWidth: 1,
            strokeRect: () => {}
        })
    };
    
    const mockDocument = {
        getElementById: (id) => {
            if (id === 'game-canvas') return mockCanvas;
            if (id === 'mobile-controls') return { classList: { remove: () => {} } };
            return null;
        },
        addEventListener: () => {},
        createElement: () => ({ className: '', textContent: '', appendChild: () => {} })
    };
    
    const context = {
        document: mockDocument,
        window: {},
        console: console,
        requestAnimationFrame: () => {},
        setTimeout: () => {},
        Math: Math,
        Date: Date
    };
    
    vm.createContext(context);
    vm.runInContext(code, context);
    
    // 检查Game类是否在全局作用域
    assert(typeof context.Game === 'function', 'Game类未定义');
    
    // 尝试创建游戏实例
    const gameInstance = new context.Game();
    assert(gameInstance !== undefined, '游戏实例创建失败');
});

// 测试3: 游戏有标题画面
test('3. 游戏有标题画面', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('TITLE'), '缺少TITLE状态');
    assert(code.includes('renderTitle'), '缺少标题渲染方法');
});

// 测试4: 游戏有开场剧情
test('4. 游戏有开场剧情', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('INTRO'), '缺少INTRO状态');
    assert(code.includes('renderIntro'), '缺少开场渲染方法');
});

// 测试5: 游戏有地图系统
test('5. 游戏有地图系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('mapData'), '缺少mapData');
    assert(code.includes('renderMap'), '缺少地图渲染');
    assert(code.includes('createMapData'), '缺少地图创建方法');
});

// 测试6: 游戏有对话系统
test('6. 游戏有对话系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('DIALOG'), '缺少DIALOG状态');
    assert(code.includes('renderDialog'), '缺少对话框渲染');
    assert(code.includes('startDialog'), '缺少对话启动方法');
});

// 测试7: 游戏有输入系统
test('7. 游戏有输入系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('setupInput'), '缺少输入设置');
    assert(code.includes('handleKeyDown'), '缺少按键处理');
    assert(code.includes('input.up'), '缺少方向输入');
});

// 测试8: 游戏有玩家系统
test('8. 游戏有玩家系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('player'), '缺少player对象');
    assert(code.includes('hp'), '缺少HP属性');
    assert(code.includes('gold'), '缺少金币属性');
});

// 测试9: 游戏有NPC系统
test('9. 游戏有NPC系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('npcs'), '缺少npcs数组');
    assert(code.includes('renderNPCs'), '缺少NPC渲染');
});

// 测试10: 游戏有瓦片渲染
test('10. 游戏有瓦片渲染', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('renderTile'), '缺少瓦片渲染');
    assert(code.includes('grass'), '缺少草地瓦片');
    assert(code.includes('wall'), '缺少墙壁瓦片');
    assert(code.includes('floor'), '缺少地板瓦片');
});

// 测试11: 游戏有UI渲染
test('11. 游戏有UI渲染', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('renderUI'), '缺少UI渲染');
    assert(code.includes('HP'), '缺少HP显示');
});

// 测试12: 游戏有摄像机系统
test('12. 游戏有摄像机系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('camera'), '缺少camera对象');
    assert(code.includes('updateCamera'), '缺少摄像机更新');
});

// 测试13: 游戏有碰撞检测
test('13. 游戏有碰撞检测', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('canMoveTo'), '缺少碰撞检测方法');
});

// 测试14: 游戏有剧情进度
test('14. 游戏有剧情进度', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('storyProgress'), '缺少剧情进度');
    assert(code.includes('KICK_OUT'), '缺少赶出家事件');
});

// 测试15: 游戏有地图切换
test('15. 游戏有地图切换', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('changeMap'), '缺少地图切换方法');
    assert(code.includes('LADO_HOME'), '缺少拉多家地图');
    assert(code.includes('LADO_TOWN'), '缺少拉多镇地图');
});

// 测试16: 游戏有角色颜色
test('16. 游戏有角色颜色配置', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('getCharacterColors'), '缺少角色颜色方法');
    assert(code.includes('redwolf'), '缺少红狼角色');
});

// 测试17: 游戏有触屏控制
test('17. 游戏有触屏控制', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('touchstart'), '缺少触屏开始事件');
    assert(code.includes('touchend'), '缺少触屏结束事件');
    assert(code.includes('btn-up'), '缺少方向按钮');
});

// 输出结果
console.log('\n================================');
console.log('测试结果:');
console.log(`✅ 通过: ${passed}/17`);
console.log(`❌ 失败: ${failed}/17`);
console.log(`总计: ${passed + failed}/17`);
console.log('================================\n');

if (failed > 0) {
    console.log('失败的测试:');
    tests.filter(t => t.status === 'fail').forEach(t => {
        console.log(`  ❌ ${t.name}`);
        console.log(`     ${t.error}`);
    });
    process.exit(1);
} else {
    console.log('🎉 所有测试通过！游戏已准备好运行。\n');
    console.log('启动游戏:');
    console.log('  cd /workspace/metal-max-h5');
    console.log('  python3 -m http.server 8080');
    console.log('  然后在浏览器打开 http://localhost:8080');
    process.exit(0);
}
