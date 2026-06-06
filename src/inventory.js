// FC重装机兵装备管理系统
import { EquipmentType, findEquipmentById, getEquipmentByType, isTankEquipment, isHumanEquipment, AttackRange } from './equipment.js';

// 坦克装备槽位
export class TankSlot {
  constructor() {
    this.mainCannon = null;    // 主炮
    this.subCannon = null;     // 副炮
    this.se = null;            // S-E特殊装备
    this.cUnit = null;         // C装置
    this.engine = null;        // 引擎
  }
}

// 人类装备槽位
export class HumanSlot {
  constructor() {
    this.hat = null;           // 帽子
    this.armor = null;         // 衣服
    this.glove = null;         // 手套
    this.shoes = null;         // 鞋子
    this.weapon = null;        // 武器
  }
}

// 单个坦克状态
export class Tank {
  constructor(name = '坦克', id = null) {
    this.name = name;
    this.id = id || name;
    this.slots = new TankSlot();
    this.currentFuel = 0;
    this.currentAmmo = {};     // 各武器当前弹药 { equipmentId: currentAmmo }
  }

  // 获取总重量
  getTotalWeight() {
    let weight = 0;
    for (const slot in this.slots) {
      if (this.slots[slot]) {
        weight += this.slots[slot].weight || 0;
      }
    }
    return weight;
  }

  // 获取载重能力
  getLoadCapacity() {
    return this.slots.engine ? this.slots.engine.loadCapacity : 0;
  }

  // 检查是否超载
  isOverloaded() {
    return this.getTotalWeight() > this.getLoadCapacity();
  }

  // 获取总攻击力
  getTotalAttack() {
    let attack = 0;
    // 主炮攻击力
    if (this.slots.mainCannon) {
      attack += this.slots.mainCannon.attack || 0;
    }
    // 副炮攻击力
    if (this.slots.subCannon) {
      attack += this.slots.subCannon.attack || 0;
    }
    // S-E攻击力
    if (this.slots.se) {
      attack += this.slots.se.attack || 0;
    }
    return attack;
  }

  // 获取总防御力
  getTotalDefense() {
    let defense = 0;
    if (this.slots.cUnit) {
      defense += this.slots.cUnit.defense || 0;
    }
    return defense;
  }

  // 获取命中率修正
  getAccuracyBonus() {
    return this.slots.cUnit ? (this.slots.cUnit.accuracy || 0) : 0;
  }

  // 获取回避率修正
  getEvasionBonus() {
    return this.slots.cUnit ? (this.slots.cUnit.evasion || 0) : 0;
  }

  // 获取最大燃料
  getMaxFuel() {
    return this.slots.engine ? this.slots.engine.fuel : 0;
  }
}

// 单个人类角色状态
export class Human {
  constructor(name = '角色', id = null) {
    this.name = name;
    this.id = id || name;
    this.slots = new HumanSlot();
  }

  // 获取总重量
  getTotalWeight() {
    let weight = 0;
    for (const slot in this.slots) {
      if (this.slots[slot]) {
        weight += this.slots[slot].weight || 0;
      }
    }
    return weight;
  }

  // 获取总攻击力
  getTotalAttack() {
    let attack = 0;
    if (this.slots.weapon) {
      attack += this.slots.weapon.attack || 0;
    }
    if (this.slots.glove) {
      attack += this.slots.glove.attack || 0;
    }
    return attack;
  }

  // 获取总防御力
  getTotalDefense() {
    let defense = 0;
    if (this.slots.hat) {
      defense += this.slots.hat.defense || 0;
    }
    if (this.slots.armor) {
      defense += this.slots.armor.defense || 0;
    }
    if (this.slots.glove) {
      defense += this.slots.glove.defense || 0;
    }
    if (this.slots.shoes) {
      defense += this.slots.shoes.defense || 0;
    }
    return defense;
  }
}

// 装备库存管理器
export class InventoryManager {
  constructor() {
    this.gold = 1000;                    // 金币
    this.tanks = [new Tank('1号坦克')];   // 坦克列表
    this.humans = [new Human('主角')];    // 人类角色列表
    this.inventory = {                    // 背包中的装备
      mainCannons: [],
      subCannons: [],
      seEquipments: [],
      cUnits: [],
      engines: [],
      hats: [],
      armors: [],
      gloves: [],
      shoes: [],
      weapons: []
    };
  }

  // ========== 金币系统 ==========

  // 获取金币
  getGold() {
    return this.gold;
  }

  // 增加金币
  addGold(amount) {
    this.gold += amount;
    return true;
  }

  // 减少金币
  spendGold(amount) {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  }

  // 检查是否有足够金币
  canAfford(amount) {
    return this.gold >= amount;
  }

  // ========== 装备购买 ==========

  // 购买装备
  buyEquipment(equipmentId, quantity = 1) {
    const equipment = findEquipmentById(equipmentId);
    if (!equipment) {
      return { success: false, message: '装备不存在' };
    }

    const totalCost = equipment.price * quantity;
    if (!this.canAfford(totalCost)) {
      return { success: false, message: '金币不足' };
    }

    this.spendGold(totalCost);
    this.addToInventory(equipmentId, quantity);

    return { success: true, message: `购买了 ${equipment.name} x${quantity}` };
  }

  // 出售装备
  sellEquipment(equipmentId, quantity = 1) {
    const equipment = findEquipmentById(equipmentId);
    if (!equipment) {
      return { success: false, message: '装备不存在' };
    }

    const inventoryList = this.getInventoryListByType(this.getEquipmentType(equipmentId));
    const inventoryIndex = inventoryList.findIndex(item => item.id === equipmentId);

    if (inventoryIndex === -1 || inventoryList[inventoryIndex].quantity < quantity) {
      return { success: false, message: '背包中装备数量不足' };
    }

    const sellPrice = Math.floor(equipment.price * 0.5); // 出售价格为购买价的50%
    this.addGold(sellPrice * quantity);

    inventoryList[inventoryIndex].quantity -= quantity;
    if (inventoryList[inventoryIndex].quantity <= 0) {
      inventoryList.splice(inventoryIndex, 1);
    }

    return { success: true, message: `出售了 ${equipment.name} x${quantity}，获得 ${sellPrice * quantity} 金币` };
  }

  // ========== 背包管理 ==========

  // 添加装备到背包
  addToInventory(equipmentId, quantity = 1) {
    const equipment = findEquipmentById(equipmentId);
    if (!equipment) return false;

    const type = this.getEquipmentType(equipmentId);
    const inventoryList = this.getInventoryListByType(type);

    const existingItem = inventoryList.find(item => item.id === equipmentId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      inventoryList.push({ ...equipment, quantity });
    }

    return true;
  }

  // 从背包移除装备
  removeFromInventory(equipmentId, quantity = 1) {
    const type = this.getEquipmentType(equipmentId);
    const inventoryList = this.getInventoryListByType(type);

    const index = inventoryList.findIndex(item => item.id === equipmentId);
    if (index === -1) return false;

    inventoryList[index].quantity -= quantity;
    if (inventoryList[index].quantity <= 0) {
      inventoryList.splice(index, 1);
    }

    return true;
  }

  // 获取背包中装备数量
  getInventoryQuantity(equipmentId) {
    const type = this.getEquipmentType(equipmentId);
    const inventoryList = this.getInventoryListByType(type);
    const item = inventoryList.find(i => i.id === equipmentId);
    return item ? item.quantity : 0;
  }

  // 根据类型获取背包列表
  getInventoryListByType(type) {
    switch (type) {
      case EquipmentType.MAIN_CANNON:
        return this.inventory.mainCannons;
      case EquipmentType.SUB_CANNON:
        return this.inventory.subCannons;
      case EquipmentType.SE:
        return this.inventory.seEquipments;
      case EquipmentType.C_UNIT:
        return this.inventory.cUnits;
      case EquipmentType.ENGINE:
        return this.inventory.engines;
      case EquipmentType.HAT:
        return this.inventory.hats;
      case EquipmentType.ARMOR:
        return this.inventory.armors;
      case EquipmentType.GLOVE:
        return this.inventory.gloves;
      case EquipmentType.SHOES:
        return this.inventory.shoes;
      case EquipmentType.WEAPON:
        return this.inventory.weapons;
      default:
        return [];
    }
  }

  // 获取装备类型
  getEquipmentType(equipmentId) {
    if (equipmentId.startsWith('mc_')) return EquipmentType.MAIN_CANNON;
    if (equipmentId.startsWith('sc_')) return EquipmentType.SUB_CANNON;
    if (equipmentId.startsWith('se_')) return EquipmentType.SE;
    if (equipmentId.startsWith('cu_')) return EquipmentType.C_UNIT;
    if (equipmentId.startsWith('eng_')) return EquipmentType.ENGINE;
    if (equipmentId.startsWith('hat_')) return EquipmentType.HAT;
    if (equipmentId.startsWith('armor_')) return EquipmentType.ARMOR;
    if (equipmentId.startsWith('glove_')) return EquipmentType.GLOVE;
    if (equipmentId.startsWith('shoe_')) return EquipmentType.SHOES;
    if (equipmentId.startsWith('wp_')) return EquipmentType.WEAPON;
    return null;
  }

  // ========== 坦克装备安装/卸下 ==========

  // 安装坦克装备
  installTankEquipment(tankIndex, equipmentId) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    const equipment = findEquipmentById(equipmentId);
    if (!equipment) {
      return { success: false, message: '装备不存在' };
    }

    const type = this.getEquipmentType(equipmentId);
    if (!isTankEquipment(type)) {
      return { success: false, message: '该装备不能安装在坦克上' };
    }

    const tank = this.tanks[tankIndex];

    // 检查背包中是否有该装备
    if (this.getInventoryQuantity(equipmentId) <= 0) {
      return { success: false, message: '背包中没有该装备' };
    }

    // 获取目标槽位
    let slotName;
    switch (type) {
      case EquipmentType.MAIN_CANNON:
        slotName = 'mainCannon';
        break;
      case EquipmentType.SUB_CANNON:
        slotName = 'subCannon';
        break;
      case EquipmentType.SE:
        slotName = 'se';
        break;
      case EquipmentType.C_UNIT:
        slotName = 'cUnit';
        break;
      case EquipmentType.ENGINE:
        slotName = 'engine';
        break;
      default:
        return { success: false, message: '未知装备类型' };
    }

    // 如果槽位已有装备，先卸下
    if (tank.slots[slotName]) {
      this.addToInventory(tank.slots[slotName].id, 1);
    }

    // 安装新装备
    tank.slots[slotName] = { ...equipment };
    this.removeFromInventory(equipmentId, 1);

    // 初始化弹药
    if (equipment.ammo) {
      tank.currentAmmo[equipmentId] = equipment.ammo;
    }

    // 检查是否超载
    if (tank.isOverloaded()) {
      return { success: true, message: `${equipment.name} 已安装，但坦克超载！` };
    }

    return { success: true, message: `${equipment.name} 已安装到 ${tank.name}` };
  }

  // 卸下坦克装备
  uninstallTankEquipment(tankIndex, slotName) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    const tank = this.tanks[tankIndex];

    if (!tank.slots[slotName]) {
      return { success: false, message: '该槽位没有装备' };
    }

    const equipment = tank.slots[slotName];
    this.addToInventory(equipment.id, 1);
    tank.slots[slotName] = null;

    // 清除弹药记录
    if (equipment.ammo && tank.currentAmmo[equipment.id] !== undefined) {
      delete tank.currentAmmo[equipment.id];
    }

    return { success: true, message: `${equipment.name} 已卸下` };
  }

  // ========== 人类装备安装/卸下 ==========

  // 安装人类装备
  installHumanEquipment(humanIndex, equipmentId) {
    if (humanIndex < 0 || humanIndex >= this.humans.length) {
      return { success: false, message: '角色不存在' };
    }

    const equipment = findEquipmentById(equipmentId);
    if (!equipment) {
      return { success: false, message: '装备不存在' };
    }

    const type = this.getEquipmentType(equipmentId);
    if (!isHumanEquipment(type)) {
      return { success: false, message: '该装备不能装备在人类角色上' };
    }

    const human = this.humans[humanIndex];

    // 检查背包中是否有该装备
    if (this.getInventoryQuantity(equipmentId) <= 0) {
      return { success: false, message: '背包中没有该装备' };
    }

    // 获取目标槽位
    let slotName;
    switch (type) {
      case EquipmentType.HAT:
        slotName = 'hat';
        break;
      case EquipmentType.ARMOR:
        slotName = 'armor';
        break;
      case EquipmentType.GLOVE:
        slotName = 'glove';
        break;
      case EquipmentType.SHOES:
        slotName = 'shoes';
        break;
      case EquipmentType.WEAPON:
        slotName = 'weapon';
        break;
      default:
        return { success: false, message: '未知装备类型' };
    }

    // 如果槽位已有装备，先卸下
    if (human.slots[slotName]) {
      this.addToInventory(human.slots[slotName].id, 1);
    }

    // 安装新装备
    human.slots[slotName] = { ...equipment };
    this.removeFromInventory(equipmentId, 1);

    return { success: true, message: `${equipment.name} 已装备到 ${human.name}` };
  }

  // 卸下人类装备
  uninstallHumanEquipment(humanIndex, slotName) {
    if (humanIndex < 0 || humanIndex >= this.humans.length) {
      return { success: false, message: '角色不存在' };
    }

    const human = this.humans[humanIndex];

    if (!human.slots[slotName]) {
      return { success: false, message: '该槽位没有装备' };
    }

    const equipment = human.slots[slotName];
    this.addToInventory(equipment.id, 1);
    human.slots[slotName] = null;

    return { success: true, message: `${equipment.name} 已卸下` };
  }

  // ========== 弹药管理 ==========

  // 补充弹药
  refillAmmo(tankIndex, equipmentId) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    const tank = this.tanks[tankIndex];
    const equipment = findEquipmentById(equipmentId);

    if (!equipment || !equipment.ammo) {
      return { success: false, message: '该装备不需要弹药' };
    }

    tank.currentAmmo[equipmentId] = equipment.ammo;
    return { success: true, message: '弹药已补充' };
  }

  // 使用弹药
  useAmmo(tankIndex, equipmentId) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return false;
    }

    const tank = this.tanks[tankIndex];

    if (!tank.currentAmmo[equipmentId] || tank.currentAmmo[equipmentId] <= 0) {
      return false;
    }

    tank.currentAmmo[equipmentId]--;
    return true;
  }

  // 获取当前弹药数
  getCurrentAmmo(tankIndex, equipmentId) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return 0;
    }

    const tank = this.tanks[tankIndex];
    return tank.currentAmmo[equipmentId] || 0;
  }

  // ========== 燃料管理 ==========

  // 补充燃料
  refuel(tankIndex, amount) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    const tank = this.tanks[tankIndex];
    const maxFuel = tank.getMaxFuel();

    tank.currentFuel = Math.min(tank.currentFuel + amount, maxFuel);

    return { success: true, message: `燃料已补充，当前: ${tank.currentFuel}/${maxFuel}` };
  }

  // 消耗燃料
  consumeFuel(tankIndex, amount) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return false;
    }

    const tank = this.tanks[tankIndex];

    if (tank.currentFuel < amount) {
      return false;
    }

    tank.currentFuel -= amount;
    return true;
  }

  // ========== 状态查询 ==========

  // 获取坦克完整状态
  getTankStatus(tankIndex) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return null;
    }

    const tank = this.tanks[tankIndex];
    return {
      name: tank.name,
      totalAttack: tank.getTotalAttack(),
      totalDefense: tank.getTotalDefense(),
      totalWeight: tank.getTotalWeight(),
      loadCapacity: tank.getLoadCapacity(),
      isOverloaded: tank.isOverloaded(),
      accuracyBonus: tank.getAccuracyBonus(),
      evasionBonus: tank.getEvasionBonus(),
      currentFuel: tank.currentFuel,
      maxFuel: tank.getMaxFuel(),
      equipment: {
        mainCannon: tank.slots.mainCannon,
        subCannon: tank.slots.subCannon,
        se: tank.slots.se,
        cUnit: tank.slots.cUnit,
        engine: tank.slots.engine
      }
    };
  }

  // 获取人类角色完整状态
  getHumanStatus(humanIndex) {
    if (humanIndex < 0 || humanIndex >= this.humans.length) {
      return null;
    }

    const human = this.humans[humanIndex];
    return {
      name: human.name,
      totalAttack: human.getTotalAttack(),
      totalDefense: human.getTotalDefense(),
      totalWeight: human.getTotalWeight(),
      equipment: {
        hat: human.slots.hat,
        armor: human.slots.armor,
        glove: human.slots.glove,
        shoes: human.slots.shoes,
        weapon: human.slots.weapon
      }
    };
  }

  // 获取完整背包状态
  getInventoryStatus() {
    return {
      gold: this.gold,
      inventory: this.inventory,
      tanks: this.tanks.map((_, index) => this.getTankStatus(index)),
      humans: this.humans.map((_, index) => this.getHumanStatus(index))
    };
  }

  // ========== 坦克/角色管理 ==========

  // 添加新坦克
  addTank(name = '新坦克', id = null) {
    this.tanks.push(new Tank(name, id));
    return this.tanks.length - 1;
  }

  // 移除坦克
  removeTank(tankIndex) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    if (this.tanks.length <= 1) {
      return { success: false, message: '至少需要保留一辆坦克' };
    }

    const tank = this.tanks[tankIndex];

    // 将坦克上的装备返还到背包
    for (const slot in tank.slots) {
      if (tank.slots[slot]) {
        this.addToInventory(tank.slots[slot].id, 1);
      }
    }

    this.tanks.splice(tankIndex, 1);
    return { success: true, message: '坦克已移除' };
  }

  // 添加新人类角色
  addHuman(name = '新角色', id = null) {
    this.humans.push(new Human(name, id));
    return this.humans.length - 1;
  }

  // 移除人类角色
  removeHuman(humanIndex) {
    if (humanIndex < 0 || humanIndex >= this.humans.length) {
      return { success: false, message: '角色不存在' };
    }

    if (this.humans.length <= 1) {
      return { success: false, message: '至少需要保留一个角色' };
    }

    const human = this.humans[humanIndex];

    // 将角色身上的装备返还到背包
    for (const slot in human.slots) {
      if (human.slots[slot]) {
        this.addToInventory(human.slots[slot].id, 1);
      }
    }

    this.humans.splice(humanIndex, 1);
    return { success: true, message: '角色已移除' };
  }

  // 重命名坦克
  renameTank(tankIndex, newName) {
    if (tankIndex < 0 || tankIndex >= this.tanks.length) {
      return { success: false, message: '坦克不存在' };
    }

    this.tanks[tankIndex].name = newName;
    return { success: true, message: '坦克已重命名' };
  }

  // 重命名人类角色
  renameHuman(humanIndex, newName) {
    if (humanIndex < 0 || humanIndex >= this.humans.length) {
      return { success: false, message: '角色不存在' };
    }

    this.humans[humanIndex].name = newName;
    return { success: true, message: '角色已重命名' };
  }
}

// 导出单例实例
export const inventoryManager = new InventoryManager();

// 默认导出
export default InventoryManager;