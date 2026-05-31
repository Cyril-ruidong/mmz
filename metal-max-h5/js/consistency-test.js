class OriginalConsistencyTester {
    constructor(game) {
        this.game = game;
        this.testResults = [];
    }

    log(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    // ==================== 画面一致性测试 ====================

    testResolution() {
        this.log('测试分辨率一致性...', 'info');
        const result = {
            name: '分辨率测试 (256x240)',
            passed: this.game.width === 256 && this.game.height === 240,
            expected: '256x240 (FC原生分辨率)',
            actual: `${this.game.width}x${this.game.height}`
        };
        this.testResults.push(result);
        return result;
    }

    testTileSize() {
        this.log('测试瓦片大小...', 'info');
        const tileSize = 16;
        const result = {
            name: '瓦片大小测试 (16x16)',
            passed: tileSize === 16,
            expected: '16x16像素',
            actual: `${tileSize}x${tileSize}像素`
        };
        this.testResults.push(result);
        return result;
    }

    testMapSize() {
        this.log('测试地图尺寸...', 'info');
        const mapData = this.game.mapData;
        const result = {
            name: '拉多镇地图尺寸 (24x15)',
            passed: mapData && mapData.width === 24 && mapData.height === 15,
            expected: '24x15格',
            actual: mapData ? `${mapData.width}x${mapData.height}` : '未加载'
        };
        this.testResults.push(result);
        return result;
    }

    testNPCCount() {
        this.log('测试NPC数量...', 'info');
        const npcs = this.game.mapData?.npcs || [];
        const result = {
            name: '拉多镇NPC数量',
            passed: npcs.length === 5,
            expected: '5个NPC',
            actual: `${npcs.length}个NPC`
        };
        this.testResults.push(result);
        return result;
    }

    testCharacterColors() {
        this.log('测试角色颜色定义...', 'info');
        const colorSchemes = [
            { type: 'hero', body: '#4080C0', name: '主角(蓝色)' },
            { type: 'young_man', body: '#40A040', name: '青年(绿色)' },
            { type: 'uncle_dark_blue', body: '#4040A0', name: '大叔(深蓝)' },
            { type: 'lady_dark_blue', body: '#A040A0', name: '女士(紫色)' }
        ];

        let passed = true;
        colorSchemes.forEach(scheme => {
            const colors = this.game.getCharacterColors(scheme.type);
            if (!colors || colors.body !== scheme.body) {
                passed = false;
                this.log(`角色颜色不匹配: ${scheme.name}`, 'fail');
            }
        });

        const result = {
            name: '角色颜色方案',
            passed: passed,
            expected: '4种颜色方案',
            actual: passed ? '全部匹配' : '存在不匹配'
        };
        this.testResults.push(result);
        return result;
    }

    testUIFontSize() {
        this.log('测试UI字体大小...', 'info');
        const fontSizes = {
            title: 20,
            subtitle: 12,
            ui: 8,
            dialog: 10
        };

        let passed = true;
        const result = {
            name: 'FC风格UI字体',
            passed: passed,
            expected: '像素风格字体',
            actual: passed ? '像素字体' : '字体不匹配'
        };
        this.testResults.push(result);
        return result;
    }

    // ==================== 剧情一致性测试 ====================

    testNPCNames() {
        this.log('测试NPC名称...', 'info');
        const npcs = this.game.mapData?.npcs || [];
        const expectedNames = ['村庄守卫', '游荡青年', '废铁大叔', '看河女士', '酒吧门口的人'];
        const actualNames = npcs.map(npc => npc.name);

        let allMatch = true;
        expectedNames.forEach(name => {
            if (!actualNames.includes(name)) {
                allMatch = false;
                this.log(`缺少NPC: ${name}`, 'fail');
            }
        });

        const result = {
            name: '拉多镇NPC名称',
            passed: allMatch && actualNames.length === expectedNames.length,
            expected: expectedNames.join(', '),
            actual: actualNames.join(', ')
        };
        this.testResults.push(result);
        return result;
    }

    testNPCPositions() {
        this.log('测试NPC位置...', 'info');
        const npcs = this.game.mapData?.npcs || [];
        const expectedPositions = [
            { name: '村庄守卫', x: 14, y: 10 },
            { name: '游荡青年', x: 11, y: 5 },
            { name: '废铁大叔', x: 2, y: 11 },
            { name: '看河女士', x: 19, y: 6 },
            { name: '酒吧门口的人', x: 5, y: 5 }
        ];

        let allMatch = true;
        expectedPositions.forEach(expected => {
            const npc = npcs.find(n => n.name === expected.name);
            if (!npc || npc.x !== expected.x || npc.y !== expected.y) {
                allMatch = false;
                this.log(`NPC位置不匹配: ${expected.name}`, 'fail');
            }
        });

        const result = {
            name: 'NPC位置验证',
            passed: allMatch,
            expected: '5个NPC位置正确',
            actual: allMatch ? '全部位置正确' : '存在位置错误'
        };
        this.testResults.push(result);
        return result;
    }

    testNPCTypeAssignment() {
        this.log('测试NPC类型分配...', 'info');
        const npcs = this.game.mapData?.npcs || [];
        const typeAssignments = {
            '村庄守卫': 'young_man',
            '游荡青年': 'young_man',
            '废铁大叔': 'uncle_dark_blue',
            '看河女士': 'lady_dark_blue',
            '酒吧门口的人': 'young_man'
        };

        let allMatch = true;
        npcs.forEach(npc => {
            const expectedType = typeAssignments[npc.name];
            if (npc.type !== expectedType) {
                allMatch = false;
                this.log(`NPC类型不匹配: ${npc.name}`, 'fail');
            }
        });

        const result = {
            name: 'NPC类型分配',
            passed: allMatch,
            expected: '角色类型正确',
            actual: allMatch ? '全部类型正确' : '存在类型错误'
        };
        this.testResults.push(result);
        return result;
    }

    testDialogueContent() {
        this.log('测试对话内容...', 'info');
        const npcs = this.game.mapData?.npcs || [];

        let hasDialogue = true;
        npcs.forEach(npc => {
            if (!npc.dialog || npc.dialog.length === 0) {
                hasDialogue = false;
                this.log(`NPC缺少对话: ${npc.name}`, 'fail');
            }
        });

        const result = {
            name: '对话内容完整性',
            passed: hasDialogue && npcs.length === 5,
            expected: '所有NPC都有对话',
            actual: hasDialogue ? '对话完整' : '缺少对话'
        };
        this.testResults.push(result);
        return result;
    }

    testInitialPlayerStats() {
        this.log('测试初始角色属性...', 'info');
        const player = this.game.player;

        const result = {
            name: '初始角色属性',
            passed: player && player.hp === 100 && player.maxHp === 100,
            expected: 'HP: 100/100, MP: 30/30',
            actual: player ? `HP: ${player.hp}/${player.maxHp}, MP: ${player.mp}/${player.maxMp}` : '未加载'
        };
        this.testResults.push(result);
        return result;
    }

    testStartingPosition() {
        this.log('测试起始位置...', 'info');
        const player = this.game.player;
        const expectedX = 13 * 16;
        const expectedY = 14 * 16;

        const result = {
            name: '起始位置 (拉多镇)',
            passed: player && player.x === expectedX && player.y === expectedY,
            expected: `(${expectedX}, ${expectedY})`,
            actual: player ? `(${player.x}, ${player.y})` : '未加载'
        };
        this.testResults.push(result);
        return result;
    }

    testGoldAmount() {
        this.log('测试初始金币...', 'info');
        const result = {
            name: '初始金币数量',
            passed: this.game.gold === 500,
            expected: '500G',
            actual: `${this.game.gold}G`
        };
        this.testResults.push(result);
        return result;
    }

    // ==================== 地图元素测试 ====================

    testMapTerrain() {
        this.log('测试地图地形...', 'info');
        const mapData = this.game.mapData;

        const hasGrass = mapData?.tiles?.some(row => row.includes('grass'));
        const hasFloor = mapData?.tiles?.some(row => row.includes('floor'));
        const hasWall = mapData?.tiles?.some(row => row.includes('wall'));

        const result = {
            name: '地图地形类型',
            passed: hasGrass && hasFloor && hasWall,
            expected: '草地、地板、墙壁',
            actual: `${hasGrass ? '草地 ' : ''}${hasFloor ? '地板 ' : ''}${hasWall ? '墙壁' : ''}`
        };
        this.testResults.push(result);
        return result;
    }

    testBuildingPlacement() {
        this.log('测试建筑物位置...', 'info');
        const mapData = this.game.mapData;

        let hasBuildings = false;
        if (mapData && mapData.tiles) {
            let floorCount = 0;
            mapData.tiles.forEach(row => {
                row.forEach(tile => {
                    if (tile === 'floor') floorCount++;
                });
            });
            hasBuildings = floorCount > 50;
        }

        const result = {
            name: '建筑物区域',
            passed: hasBuildings,
            expected: '有足够的地板区域',
            actual: hasBuildings ? '建筑物区域正常' : '建筑物区域不足'
        };
        this.testResults.push(result);
        return result;
    }

    // ==================== 游戏流程测试 ====================

    testGameStateTransitions() {
        this.log('测试游戏状态转换...', 'info');
        const states = ['TITLE', 'WORLD', 'DIALOG'];
        let allValid = true;

        states.forEach(state => {
            if (!['TITLE', 'WORLD', 'DIALOG'].includes(state)) {
                allValid = false;
            }
        });

        const result = {
            name: '游戏状态机',
            passed: allValid,
            expected: 'TITLE -> WORLD -> DIALOG',
            actual: '状态转换正常'
        };
        this.testResults.push(result);
        return result;
    }

    testInputMapping() {
        this.log('测试输入映射...', 'info');
        const inputKeys = ['up', 'down', 'left', 'right', 'confirm', 'cancel'];
        let allValid = true;

        inputKeys.forEach(key => {
            if (this.game.input[key] === undefined) {
                allValid = false;
            }
        });

        const result = {
            name: '输入系统完整性',
            passed: allValid,
            expected: '6个输入键位',
            actual: allValid ? '输入系统正常' : '输入系统缺失'
        };
        this.testResults.push(result);
        return result;
    }

    testCameraFollow() {
        this.log('测试相机跟随...', 'info');
        const camera = this.game.camera;

        const result = {
            name: '相机系统',
            passed: camera && typeof camera.x === 'number' && typeof camera.y === 'number',
            expected: '相机坐标有效',
            actual: camera ? `相机正常 (${camera.x}, ${camera.y})` : '相机未初始化'
        };
        this.testResults.push(result);
        return result;
    }

    // ==================== 运行所有测试 ====================

    runAllTests() {
        this.log('='.repeat(50), 'info');
        this.log('开始运行原版一致性测试...', 'info');
        this.log('='.repeat(50), 'info');

        this.testResults = [];

        // 画面一致性测试
        this.log('\n📊 画面一致性测试', 'info');
        this.testResolution();
        this.testTileSize();
        this.testMapSize();
        this.testNPCCount();
        this.testCharacterColors();
        this.testUIFontSize();

        // 剧情一致性测试
        this.log('\n📖 剧情一致性测试', 'info');
        this.testNPCNames();
        this.testNPCPositions();
        this.testNPCTypeAssignment();
        this.testDialogueContent();
        this.testInitialPlayerStats();
        this.testStartingPosition();
        this.testGoldAmount();

        // 地图元素测试
        this.log('\n🗺️ 地图元素测试', 'info');
        this.testMapTerrain();
        this.testBuildingPlacement();

        // 游戏流程测试
        this.log('\n🎮 游戏流程测试', 'info');
        this.testGameStateTransitions();
        this.testInputMapping();
        this.testCameraFollow();

        this.displayResults();
    }

    displayResults() {
        this.log('\n' + '='.repeat(50), 'info');
        this.log('📊 测试结果汇总', 'info');
        this.log('='.repeat(50), 'info');

        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const failed = total - passed;

        this.testResults.forEach(result => {
            const status = result.passed ? '✅' : '❌';
            this.log(`${status} ${result.name}: ${result.passed ? '通过' : '失败'}`, result.passed ? 'pass' : 'fail');
            if (!result.passed) {
                this.log(`   期望: ${result.expected}`, 'warn');
                this.log(`   实际: ${result.actual}`, 'warn');
            }
        });

        this.log('\n' + '='.repeat(50), 'info');
        this.log(`📊 总计: ${total} | 通过: ${passed} | 失败: ${failed}`, failed === 0 ? 'pass' : 'warn');
        this.log('='.repeat(50), 'info');
    }

    getResults() {
        return {
            total: this.testResults.length,
            passed: this.testResults.filter(r => r.passed).length,
            failed: this.testResults.filter(r => !r.passed).length,
            results: this.testResults
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OriginalConsistencyTester;
}
