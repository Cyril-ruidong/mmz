const GAME_DATA = {
    VERSION: '1.0',
    
    TILES: {
        GRASS: 0,
        WALL: 1,
        TREE: 2,
        DOOR: 3,
        WATER: 4,
        FLOOR: 5,
        SHOP: 6,
        HOSPITAL: 7,
        WARHOUSE: 8
    },
    
    MAPS: {
        'paradise': {
            id: 'paradise',
            name: '帕特港',
            width: 50,
            height: 50,
            tiles: [],
            npcs: ['nurse', 'mechanic', 'seller'],
            warps: {
                'down': { mapId: 'world', x: 25, y: 45 }
            }
        },
        'world': {
            id: 'world',
            name: '世界地图',
            width: 100,
            height: 100,
            tiles: [],
            npcs: [],
            warps: {
                'up': { mapId: 'paradise', x: 25, y: 5 }
            },
            enemies: ['rat', 'worm', 'dog', 'soldier']
        }
    },
    
    NPCS: {
        'nurse': {
            id: 'nurse',
            name: '护士',
            x: 5, y: 5,
            color: '#E91E63',
            type: 'hospital',
            dialog: [
                '欢迎来到医院！',
                '我们可以治疗您的伤病。',
                '治疗费用：每HP 10G'
            ],
            dialogOptions: ['治疗', '离开']
        },
        'mechanic': {
            id: 'mechanic',
            name: '机械师',
            x: 10, y: 8,
            color: '#607D8B',
            type: 'repair',
            dialog: [
                '我是机械师！',
                '我可以修理您的战车。',
                '修理费用：每HP 5G'
            ],
            dialogOptions: ['修理', '离开']
        },
        'seller': {
            id: 'seller',
            name: '道具商',
            x: 8, y: 12,
            color: '#9C27B0',
            type: 'shop',
            dialog: [
                '欢迎光临！',
                '看看我这里的道具吧！'
            ]
        },
        'captain': {
            id: 'captain',
            name: '赏金猎人队长',
            x: 15, y: 10,
            color: '#FF5722',
            type: 'quest',
            dialog: [
                '我是赏金猎人队长！',
                '有一个通缉犯逃到了北方森林。',
                '击败通缉犯可以获得5000G赏金！',
                '你愿意接受这个任务吗？'
            ],
            dialogOptions: ['接受任务', '下次再说'],
            quest: 'bounty_01'
        }
    },
    
    ENEMIES: {
        'rat': {
            id: 'rat',
            name: '变异鼠',
            hp: 15,
            attack: 5,
            defense: 2,
            speed: 8,
            exp: 5,
            gold: 10,
            skills: ['attack'],
            drops: ['potion']
        },
        'worm': {
            id: 'worm',
            name: '沙虫',
            hp: 25,
            attack: 8,
            defense: 3,
            speed: 5,
            exp: 10,
            gold: 20,
            skills: ['attack', 'poison'],
            drops: []
        },
        'dog': {
            id: 'dog',
            name: '机械狗',
            hp: 40,
            attack: 12,
            defense: 5,
            speed: 12,
            exp: 20,
            gold: 35,
            skills: ['attack', 'bite'],
            drops: ['metal']
        },
        'soldier': {
            id: 'soldier',
            name: '赏金猎人',
            hp: 80,
            attack: 20,
            defense: 10,
            speed: 10,
            exp: 50,
            gold: 100,
            skills: ['attack', 'heavy_blow'],
            drops: ['iron_sword']
        },
        'bounty_01': {
            id: 'bounty_01',
            name: '通缉犯-红狼',
            hp: 500,
            attack: 45,
            defense: 20,
            speed: 15,
            exp: 500,
            gold: 5000,
            skills: ['attack', 'heavy_blow', 'fire'],
            drops: ['red_wolf_gun'],
            boss: true
        }
    },
    
    ITEMS: {
        'potion': {
            id: 'potion',
            name: '药水',
            type: 'consumable',
            description: '恢复30点HP',
            effect: { hp: 30 },
            price: 30,
            sellPrice: 15
        },
        'super_potion': {
            id: 'super_potion',
            name: '超级药水',
            type: 'consumable',
            description: '恢复100点HP',
            effect: { hp: 100 },
            price: 100,
            sellPrice: 50
        },
        'metal': {
            id: 'metal',
            name: '金属碎片',
            type: 'material',
            description: '可用于修复战车',
            price: 20,
            sellPrice: 10
        },
        'iron_sword': {
            id: 'iron_sword',
            name: '铁剑',
            type: 'weapon',
            slot: 'weapon',
            attack: 15,
            description: '普通的铁制长剑',
            price: 200,
            sellPrice: 100
        },
        'steel_armor': {
            id: 'steel_armor',
            name: '钢甲',
            type: 'armor',
            slot: 'armor',
            defense: 20,
            description: '坚固的钢制护甲',
            price: 500,
            sellPrice: 250
        },
        'red_wolf_gun': {
            id: 'red_wolf_gun',
            name: '红狼枪',
            type: 'weapon',
            slot: 'weapon',
            attack: 80,
            description: '传说中的红狼使用的武器',
            price: 0,
            sellPrice: 0,
            unique: true
        }
    },
    
    TANKS: {
        'starting_tank': {
            id: 'starting_tank',
            name: '初级战车',
            type: '轻型坦克',
            hp: 200,
            maxHp: 200,
            attack: 30,
            defense: 15,
            speed: 8,
            capacity: 3,
            slots: {
                weapon: null,
                armor: null,
                engine: null,
                radar: null
            },
            price: 0,
            available: true
        },
        'r_tank': {
            id: 'r_tank',
            name: 'R战车',
            type: '中型坦克',
            hp: 500,
            maxHp: 500,
            attack: 60,
            defense: 40,
            speed: 10,
            capacity: 5,
            slots: {
                weapon: null,
                armor: null,
                engine: null,
                radar: null
            },
            price: 5000,
            available: true
        },
        's_tank': {
            id: 's_tank',
            name: 'S战车',
            type: '重型坦克',
            hp: 1000,
            maxHp: 1000,
            attack: 120,
            defense: 80,
            speed: 5,
            capacity: 6,
            slots: {
                weapon: null,
                armor: null,
                engine: null,
                radar: null
            },
            price: 20000,
            available: true
        }
    },
    
    TANK_PARTS: {
        'cannon_s': {
            id: 'cannon_s',
            name: 'S炮',
            type: 'weapon',
            slot: 'weapon',
            attack: 30,
            description: '标准轻型火炮',
            price: 1000
        },
        'cannon_m': {
            id: 'cannon_m',
            name: 'M炮',
            type: 'weapon',
            slot: 'weapon',
            attack: 60,
            description: '中型火炮',
            price: 3000
        },
        'cannon_l': {
            id: 'cannon_l',
            name: 'L炮',
            type: 'weapon',
            slot: 'weapon',
            attack: 100,
            description: '重型加农炮',
            price: 8000
        },
        'armor_s': {
            id: 'armor_s',
            name: '轻型装甲',
            type: 'armor',
            slot: 'armor',
            defense: 20,
            hpBonus: 50,
            description: '轻型坦克装甲',
            price: 800
        },
        'armor_m': {
            id: 'armor_m',
            name: '中型装甲',
            type: 'armor',
            slot: 'armor',
            defense: 50,
            hpBonus: 150,
            description: '中型坦克装甲',
            price: 2500
        },
        'armor_l': {
            id: 'armor_l',
            name: '重型装甲',
            type: 'armor',
            slot: 'armor',
            defense: 100,
            hpBonus: 300,
            description: '重型坦克装甲',
            price: 6000
        },
        'engine_s': {
            id: 'engine_s',
            name: 'S引擎',
            type: 'engine',
            slot: 'engine',
            speedBonus: 5,
            hpBonus: 30,
            description: '标准引擎',
            price: 600
        },
        'engine_m': {
            id: 'engine_m',
            name: 'M引擎',
            type: 'engine',
            slot: 'engine',
            speedBonus: 10,
            hpBonus: 80,
            description: '强力引擎',
            price: 2000
        },
        'engine_l': {
            id: 'engine_l',
            name: 'L引擎',
            type: 'engine',
            slot: 'engine',
            speedBonus: 18,
            hpBonus: 150,
            description: '重型引擎',
            price: 5000
        }
    },
    
    SKILLS: {
        'attack': {
            id: 'attack',
            name: '攻击',
            type: 'attack',
            damage: 1.0,
            mpCost: 0,
            description: '普通攻击',
            target: 'enemy',
            accuracy: 95
        },
        'heavy_blow': {
            id: 'heavy_blow',
            name: '重击',
            type: 'attack',
            damage: 1.8,
            mpCost: 5,
            description: '造成1.8倍伤害',
            target: 'enemy',
            accuracy: 75
        },
        'poison': {
            id: 'poison',
            name: '毒攻击',
            type: 'attack',
            damage: 0.5,
            mpCost: 3,
            description: '造成伤害并中毒',
            target: 'enemy',
            accuracy: 90,
            effect: { poison: 3 }
        },
        'bite': {
            id: 'bite',
            name: '撕咬',
            type: 'attack',
            damage: 1.3,
            mpCost: 0,
            description: '造成1.3倍伤害',
            target: 'enemy',
            accuracy: 85
        },
        'fire': {
            id: 'fire',
            name: '火焰攻击',
            type: 'attack',
            damage: 2.5,
            mpCost: 15,
            description: '造成2.5倍火焰伤害',
            target: 'enemy',
            accuracy: 70
        },
        'heal': {
            id: 'heal',
            name: '治疗',
            type: 'heal',
            healing: 50,
            mpCost: 5,
            description: '恢复50点HP',
            target: 'ally',
            accuracy: 100
        },
        'power_up': {
            id: 'power_up',
            name: '强化',
            type: 'buff',
            effect: { attackBoost: 1.5 },
            duration: 3,
            mpCost: 8,
            description: '攻击力提升50%',
            target: 'self',
            accuracy: 100
        }
    },
    
    QUESTS: {
        'bounty_01': {
            id: 'bounty_01',
            name: '赏金任务-红狼',
            description: '击败通缉犯红狼',
            target: 'bounty_01',
            reward: {
                gold: 5000,
                exp: 500,
                item: null
            },
            progress: 0,
            completed: false
        }
    },
    
    INITIAL_PLAYER: {
        name: '主角',
        level: 1,
        exp: 0,
        expToNext: 100,
        hp: 50,
        maxHp: 50,
        mp: 20,
        maxMp: 20,
        attack: 10,
        defense: 5,
        speed: 10,
        gold: 200,
        position: { x: 160, y: 120, mapId: 'paradise' },
        inventory: [
            { itemId: 'potion', quantity: 3 },
            { itemId: 'super_potion', quantity: 1 }
        ],
        equipment: {
            weapon: null,
            armor: null,
            accessory: null
        },
        skills: ['attack'],
        tanks: ['starting_tank'],
        activeTank: 0
    },
    
    BATTLE_CONFIG: {
        playerFirstChance: 0.6,
        criticalHitChance: 0.1,
        criticalHitMultiplier: 2.0,
        escapeBaseChance: 0.3,
        escapeSpeedFactor: 0.02
    },
    
    PRICE_MODIFIERS: {
        shop: 1.0,
        sell: 0.5
    },
    
    HOSPITAL_COST_PER_HP: 10,
    REPAIR_COST_PER_HP: 5
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
}
