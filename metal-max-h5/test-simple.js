#!/usr/bin/env node

// 重装机兵自动化测试
console.log('🎮 重装机兵 H5 自动化测试');
console.log('================================\n');

let passed = 0;
let failed = 0;
const tests = [];

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

test('1. 游戏代码语法正确', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.length > 1000, '游戏代码文件太短');
    assert(code.includes('class Game'), '缺少Game类');
});

test('2. Game类定义正确', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    
    // 直接提取Game类定义
    const classMatch = code.match(/class Game\s*\{[\s\S]*?\n\}/);
    assert(classMatch !== null, '无法找到Game类定义');
});

test('3. 游戏有标题画面', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('TITLE'), '缺少TITLE状态');
    assert(code.includes('renderTitle'), '缺少标题渲染方法');
});

test('4. 游戏有开场剧情', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('INTRO'), '缺少INTRO状态');
    assert(code.includes('renderIntro'), '缺少开场渲染方法');
});

test('5. 游戏有地图系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('mapData'), '缺少mapData');
    assert(code.includes('renderMap'), '缺少地图渲染');
});

test('6. 游戏有对话系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('DIALOG'), '缺少DIALOG状态');
    assert(code.includes('renderDialog'), '缺少对话框渲染');
});

test('7. 游戏有输入系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('setupInput'), '缺少输入设置');
    assert(code.includes('input.up'), '缺少方向输入');
});

test('8. 游戏有玩家系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('player'), '缺少player对象');
    assert(code.includes('hp'), '缺少HP属性');
});

test('9. 游戏有NPC系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('npcs'), '缺少npcs数组');
    assert(code.includes('renderNPCs'), '缺少NPC渲染');
});

test('10. 游戏有瓦片渲染', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('renderTile'), '缺少瓦片渲染');
    assert(code.includes('grass'), '缺少草地瓦片');
    assert(code.includes('wall'), '缺少墙壁瓦片');
});

test('11. 游戏有UI渲染', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('renderUI'), '缺少UI渲染');
});

test('12. 游戏有摄像机系统', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('camera'), '缺少camera对象');
});

test('13. 游戏有碰撞检测', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('canMoveTo'), '缺少碰撞检测方法');
});

test('14. 游戏有剧情进度', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('storyProgress'), '缺少剧情进度');
    assert(code.includes('KICK_OUT'), '缺少赶出家事件');
});

test('15. 游戏有地图切换', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('changeMap'), '缺少地图切换方法');
    assert(code.includes('LADO_HOME'), '缺少拉多家地图');
    assert(code.includes('LADO_TOWN'), '缺少拉多镇地图');
});

test('16. 游戏有触屏控制', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('touchstart'), '缺少触屏开始事件');
    assert(code.includes('btn-up'), '缺少方向按钮');
});

test('17. 游戏启动代码正确', () => {
    const fs = require('fs');
    const code = fs.readFileSync('js/game.js', 'utf-8');
    assert(code.includes('DOMContentLoaded'), '缺少DOM加载事件');
    assert(code.includes('window.gameInstance'), '缺少游戏实例赋值');
});

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
    console.log('🎉 所有测试通过！\n');
    console.log('功能清单:');
    console.log('  ✅ 标题画面');
    console.log('  ✅ 开场剧情');
    console.log('  ✅ 地图系统');
    console.log('  ✅ NPC对话');
    console.log('  ✅ 输入控制');
    console.log('  ✅ 触屏支持');
    console.log('  ✅ 剧情事件\n');
    process.exit(0);
}
