// FC重装机兵装备数据定义
// 数据参考原版游戏

// 装备类型枚举
export const EquipmentType = {
  // 坦克装备
  MAIN_CANNON: 'mainCannon',      // 主炮
  SUB_CANNON: 'subCannon',        // 副炮
  SE: 'se',                       // S-E特殊装备
  C_UNIT: 'cUnit',                // C装置
  ENGINE: 'engine',               // 引擎
  // 人类装备
  HAT: 'hat',                     // 帽子
  ARMOR: 'armor',                 // 衣服
  GLOVE: 'glove',                 // 手套
  SHOES: 'shoes',                 // 鞋子
  WEAPON: 'weapon'                // 武器
};

// 攻击范围枚举
export const AttackRange = {
  SINGLE: 'single',    // 单体攻击
  GROUP: 'group',       // 组攻击
  ALL: 'all'           // 全体攻击
};

// 主炮数据
export const mainCannons = [
  { id: 'mc_45', name: '45炮', attack: 45, defense: 0, price: 100, weight: 1.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_55', name: '55炮', attack: 55, defense: 0, price: 300, weight: 2.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_75', name: '75炮', attack: 75, defense: 0, price: 800, weight: 3.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_80h', name: '80高炮', attack: 80, defense: 0, price: 1200, weight: 3.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_95', name: '95炮', attack: 95, defense: 0, price: 2000, weight: 4.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_105j', name: '105加农', attack: 105, defense: 0, price: 3500, weight: 4.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_115t', name: '115T型', attack: 115, defense: 0, price: 5000, weight: 5.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_125t', name: '125T型', attack: 125, defense: 0, price: 7000, weight: 5.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_125j', name: '125加农', attack: 125, defense: 0, price: 8000, weight: 5.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_135j', name: '135加农', attack: 135, defense: 0, price: 10000, weight: 6.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_140h', name: '140高炮', attack: 140, defense: 0, price: 12000, weight: 6.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_155j', name: '155加农', attack: 155, defense: 0, price: 15000, weight: 7.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_160h', name: '160滑膛', attack: 160, defense: 0, price: 18000, weight: 7.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_165t', name: '165T型', attack: 165, defense: 0, price: 22000, weight: 8.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_165g', name: '165钢炮', attack: 165, defense: 0, price: 25000, weight: 8.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_175j', name: '175加农', attack: 175, defense: 0, price: 30000, weight: 8.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_180h', name: '180高炮', attack: 180, defense: 0, price: 35000, weight: 9.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_195j', name: '195加农', attack: 195, defense: 0, price: 45000, weight: 9.5, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_205j', name: '205加农', attack: 205, defense: 0, price: 55000, weight: 10.0, ammo: 99, range: AttackRange.SINGLE },
  { id: 'mc_220', name: '220炮', attack: 220, defense: 0, price: 70000, weight: 11.0, ammo: 99, range: AttackRange.SINGLE }
];

// 副炮数据
export const subCannons = [
  { id: 'sc_07jg', name: '07机关', attack: 7, defense: 0, price: 50, weight: 0.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_09jg', name: '09机关', attack: 9, defense: 0, price: 100, weight: 0.6, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_glp', name: '格林炮', attack: 12, defense: 0, price: 200, weight: 0.8, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_09hp', name: '09火炮', attack: 9, defense: 0, price: 150, weight: 0.7, ammo: 99, range: AttackRange.SINGLE },
  { id: 'sc_11jg', name: '11机关', attack: 11, defense: 0, price: 250, weight: 0.8, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_11hp', name: '11火炮', attack: 11, defense: 0, price: 300, weight: 0.9, ammo: 99, range: AttackRange.SINGLE },
  { id: 'sc_15jg', name: '15机关', attack: 15, defense: 0, price: 400, weight: 1.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_ls', name: '雷神', attack: 20, defense: 0, price: 600, weight: 1.2, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_18jg', name: '18机关', attack: 18, defense: 0, price: 500, weight: 1.1, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_jg', name: '激光', attack: 25, defense: 0, price: 800, weight: 1.3, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_sd', name: '闪电', attack: 30, defense: 0, price: 1000, weight: 1.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_20hp', name: '20火炮', attack: 20, defense: 0, price: 700, weight: 1.2, ammo: 99, range: AttackRange.SINGLE },
  { id: 'sc_25jg', name: '25机关', attack: 25, defense: 0, price: 900, weight: 1.4, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_hl', name: '火龙', attack: 35, defense: 0, price: 1500, weight: 1.8, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_bt', name: '波坦', attack: 40, defense: 0, price: 2000, weight: 2.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_fb', name: '风暴', attack: 45, defense: 0, price: 2500, weight: 2.2, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_atm', name: 'ATM导弹', attack: 50, defense: 0, price: 3000, weight: 2.5, ammo: 20, range: AttackRange.SINGLE },
  { id: 'sc_ph', name: '喷火', attack: 30, defense: 0, price: 1800, weight: 1.6, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_lx', name: 'LI旋炮', attack: 55, defense: 0, price: 3500, weight: 2.8, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_qd', name: '汽弹', attack: 60, defense: 0, price: 4000, weight: 3.0, ammo: 15, range: AttackRange.SINGLE },
  { id: 'sc_jp', name: '巨炮', attack: 65, defense: 0, price: 4500, weight: 3.2, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_dg', name: '电光', attack: 70, defense: 0, price: 5000, weight: 3.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_lk', name: '拉卡', attack: 75, defense: 0, price: 5500, weight: 3.8, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_ft', name: '福特', attack: 80, defense: 0, price: 6000, weight: 4.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_tf', name: '台风', attack: 85, defense: 0, price: 6500, weight: 4.2, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_hs', name: '火神', attack: 90, defense: 0, price: 7000, weight: 4.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_ld', name: '雷电', attack: 95, defense: 0, price: 7500, weight: 4.8, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_jj', name: '截击', attack: 100, defense: 0, price: 8000, weight: 5.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_hl2', name: '火狼', attack: 105, defense: 0, price: 8500, weight: 5.2, ammo: null, range: AttackRange.GROUP },
  { id: 'sc_qx', name: '气旋', attack: 110, defense: 0, price: 9000, weight: 5.5, ammo: null, range: AttackRange.ALL },
  { id: 'sc_tl', name: '托卢', attack: 115, defense: 0, price: 10000, weight: 6.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_hal900', name: 'HAL900', attack: 120, defense: 0, price: 12000, weight: 6.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_nk', name: '尼克', attack: 125, defense: 0, price: 14000, weight: 7.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_am', name: '艾米', attack: 130, defense: 0, price: 16000, weight: 7.5, ammo: null, range: AttackRange.SINGLE },
  { id: 'sc_solomon2', name: 'SOLOMON2', attack: 140, defense: 0, price: 20000, weight: 8.0, ammo: null, range: AttackRange.ALL }
];

// S-E（特殊装备）数据
export const seEquipments = [
  { id: 'se_missile', name: '导弹', attack: 80, defense: 0, price: 3000, weight: 3.0, ammo: 10, range: AttackRange.SINGLE },
  { id: 'se_torpedo', name: '鱼雷', attack: 100, defense: 0, price: 5000, weight: 4.0, ammo: 8, range: AttackRange.SINGLE },
  { id: 'se_flamethrower', name: '火焰喷射器', attack: 60, defense: 0, price: 2500, weight: 2.5, ammo: null, range: AttackRange.GROUP },
  { id: 'se_ice', name: '冷冻炮', attack: 70, defense: 0, price: 4000, weight: 3.5, ammo: 15, range: AttackRange.SINGLE },
  { id: 'se_plasma', name: '等离子炮', attack: 120, defense: 0, price: 8000, weight: 5.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'se_sonic', name: '音波炮', attack: 90, defense: 0, price: 6000, weight: 4.5, ammo: null, range: AttackRange.GROUP },
  { id: 'se_laser', name: '激光炮', attack: 150, defense: 0, price: 12000, weight: 6.0, ammo: null, range: AttackRange.SINGLE },
  { id: 'se_napalm', name: '凝固汽油弹', attack: 85, defense: 0, price: 5500, weight: 4.2, ammo: 12, range: AttackRange.GROUP },
  { id: 'se_emp', name: '电磁脉冲', attack: 95, defense: 0, price: 7000, weight: 4.8, ammo: null, range: AttackRange.ALL },
  { id: 'se_antiair', name: '对空导弹', attack: 110, defense: 0, price: 9000, weight: 5.5, ammo: 10, range: AttackRange.SINGLE }
];

// C装置数据
export const cUnits = [
  { id: 'cu_hal900', name: 'HAL900', attack: 0, defense: 5, price: 15000, weight: 2.0, accuracy: 15, evasion: 10 },
  { id: 'cu_nike', name: '尼克', attack: 0, defense: 8, price: 18000, weight: 2.5, accuracy: 20, evasion: 15 },
  { id: 'cu_amy', name: '艾米', attack: 0, defense: 10, price: 22000, weight: 3.0, accuracy: 25, evasion: 20 },
  { id: 'cu_solomon2', name: 'SOLOMON2', attack: 0, defense: 15, price: 30000, weight: 4.0, accuracy: 35, evasion: 30 }
];

// 引擎数据
export const engines = [
  { id: 'eng_mot1', name: 'MOT1', attack: 0, defense: 0, price: 500, weight: 1.0, loadCapacity: 3.0, fuel: 50 },
  { id: 'eng_mot2', name: 'MOT2', attack: 0, defense: 0, price: 1000, weight: 1.5, loadCapacity: 5.0, fuel: 80 },
  { id: 'eng_mot3', name: 'MOT3', attack: 0, defense: 0, price: 2000, weight: 2.0, loadCapacity: 8.0, fuel: 120 },
  { id: 'eng_sol0', name: 'SOL0', attack: 0, defense: 0, price: 3000, weight: 2.5, loadCapacity: 10.0, fuel: 150 },
  { id: 'eng_sol1', name: 'SOL1', attack: 0, defense: 0, price: 5000, weight: 3.0, loadCapacity: 12.0, fuel: 180 },
  { id: 'eng_sol2', name: 'SOL2', attack: 0, defense: 0, price: 8000, weight: 3.5, loadCapacity: 15.0, fuel: 220 },
  { id: 'eng_bul', name: 'BUL', attack: 0, defense: 0, price: 4000, weight: 2.8, loadCapacity: 11.0, fuel: 160 },
  { id: 'eng_bul1', name: 'BUL1', attack: 0, defense: 0, price: 7000, weight: 3.2, loadCapacity: 14.0, fuel: 200 },
  { id: 'eng_bul11', name: 'BUL11', attack: 0, defense: 0, price: 10000, weight: 3.8, loadCapacity: 18.0, fuel: 260 },
  { id: 'eng_hun0', name: 'HUN0', attack: 0, defense: 0, price: 6000, weight: 3.0, loadCapacity: 13.0, fuel: 190 },
  { id: 'eng_hun1', name: 'HUN1', attack: 0, defense: 0, price: 9000, weight: 3.5, loadCapacity: 16.0, fuel: 230 },
  { id: 'eng_hun2', name: 'HUN2', attack: 0, defense: 0, price: 12000, weight: 4.0, loadCapacity: 20.0, fuel: 280 },
  { id: 'eng_v24', name: 'V24', attack: 0, defense: 0, price: 15000, weight: 4.5, loadCapacity: 22.0, fuel: 320 },
  { id: 'eng_v36', name: 'V36', attack: 0, defense: 0, price: 20000, weight: 5.0, loadCapacity: 25.0, fuel: 380 },
  { id: 'eng_v48', name: 'V48', attack: 0, defense: 0, price: 25000, weight: 5.5, loadCapacity: 28.0, fuel: 420 },
  { id: 'eng_sil0', name: 'SIL0', attack: 0, defense: 0, price: 18000, weight: 4.2, loadCapacity: 24.0, fuel: 350 },
  { id: 'eng_sil1', name: 'SIL1', attack: 0, defense: 0, price: 23000, weight: 4.8, loadCapacity: 27.0, fuel: 400 },
  { id: 'eng_sil2', name: 'SIL2', attack: 0, defense: 0, price: 28000, weight: 5.2, loadCapacity: 30.0, fuel: 450 },
  { id: 'eng_ohc', name: 'OHC', attack: 0, defense: 0, price: 30000, weight: 5.8, loadCapacity: 32.0, fuel: 480 },
  { id: 'eng_turbo', name: '涡轮', attack: 0, defense: 0, price: 35000, weight: 6.0, loadCapacity: 35.0, fuel: 520 },
  { id: 'eng_jet', name: '喷气', attack: 0, defense: 0, price: 40000, weight: 6.5, loadCapacity: 38.0, fuel: 560 },
  { id: 'eng_v66', name: 'V66', attack: 0, defense: 0, price: 50000, weight: 7.0, loadCapacity: 42.0, fuel: 620 },
  { id: 'eng_v100', name: 'V100', attack: 0, defense: 0, price: 65000, weight: 8.0, loadCapacity: 50.0, fuel: 700 }
];

// 人类装备 - 帽子
export const hats = [
  { id: 'hat_goldcrown', name: '金冠', attack: 0, defense: 15, price: 5000, weight: 0.5 },
  { id: 'hat_headband', name: '头巾', attack: 0, defense: 5, price: 200, weight: 0.1 }
];

// 人类装备 - 衣服
export const armors = [
  { id: 'armor_steel', name: '钢甲', attack: 0, defense: 20, price: 1500, weight: 5.0 },
  { id: 'armor_iron', name: '铁甲', attack: 0, defense: 30, price: 3000, weight: 7.0 },
  { id: 'armor_gold', name: '金甲', attack: 0, defense: 50, price: 8000, weight: 10.0 },
  { id: 'armor_goldcloth', name: '金衣', attack: 0, defense: 35, price: 5000, weight: 3.0 }
];

// 人类装备 - 手套
export const gloves = [
  { id: 'glove_goldclaw', name: '金爪', attack: 25, defense: 5, price: 4000, weight: 0.3 }
];

// 人类装备 - 鞋子
export const shoes = [
  { id: 'shoe_steel', name: '钢靴', attack: 0, defense: 10, price: 1000, weight: 2.0 },
  { id: 'shoe_gold', name: '金靴', attack: 0, defense: 20, price: 6000, weight: 3.0 }
];

// 人类装备 - 武器
export const weapons = [
  { id: 'wp_laser', name: '激光炮', attack: 100, defense: 0, price: 10000, weight: 2.0, range: AttackRange.SINGLE },
  { id: 'wp_armor', name: '穿甲炮', attack: 80, defense: 0, price: 6000, weight: 3.0, range: AttackRange.SINGLE },
  { id: 'wp_knife', name: '首', attack: 15, defense: 0, price: 100, weight: 0.2, range: AttackRange.SINGLE },
  { id: 'wp_blade', name: '宝刀', attack: 40, defense: 0, price: 2500, weight: 0.8, range: AttackRange.SINGLE }
];

// 获取所有装备的统一接口
export function getAllEquipment() {
  return {
    mainCannons,
    subCannons,
    seEquipments,
    cUnits,
    engines,
    hats,
    armors,
    gloves,
    shoes,
    weapons
  };
}

// 根据ID查找装备
export function findEquipmentById(id) {
  const allEquipment = [
    ...mainCannons,
    ...subCannons,
    ...seEquipments,
    ...cUnits,
    ...engines,
    ...hats,
    ...armors,
    ...gloves,
    ...shoes,
    ...weapons
  ];
  return allEquipment.find(eq => eq.id === id);
}

// 根据类型获取装备列表
export function getEquipmentByType(type) {
  switch (type) {
    case EquipmentType.MAIN_CANNON:
      return mainCannons;
    case EquipmentType.SUB_CANNON:
      return subCannons;
    case EquipmentType.SE:
      return seEquipments;
    case EquipmentType.C_UNIT:
      return cUnits;
    case EquipmentType.ENGINE:
      return engines;
    case EquipmentType.HAT:
      return hats;
    case EquipmentType.ARMOR:
      return armors;
    case EquipmentType.GLOVE:
      return gloves;
    case EquipmentType.SHOES:
      return shoes;
    case EquipmentType.WEAPON:
      return weapons;
    default:
      return [];
  }
}

// 判断是否为坦克装备
export function isTankEquipment(type) {
  return [EquipmentType.MAIN_CANNON, EquipmentType.SUB_CANNON, EquipmentType.SE, EquipmentType.C_UNIT, EquipmentType.ENGINE].includes(type);
}

// 判断是否为人类装备
export function isHumanEquipment(type) {
  return [EquipmentType.HAT, EquipmentType.ARMOR, EquipmentType.GLOVE, EquipmentType.SHOES, EquipmentType.WEAPON].includes(type);
}