// FC重装机兵风格装备管理UI
// 模仿原版FC游戏的像素风格界面

import { 
  EquipmentType, 
  getAllEquipment, 
  findEquipmentById, 
  getEquipmentByType,
  isTankEquipment,
  isHumanEquipment,
  AttackRange 
} from './equipment.js';

// 当前使用的 inventoryManager 实例
let currentInventoryManager = null;

// FC重装机兵配色方案
const COLORS = {
  // 背景色
  bgDark: '#1a1a2e',
  bgMedium: '#2a2a4e',
  bgLight: '#3a3a6e',
  // 文字色
  textWhite: '#ffffff',
  textYellow: '#f8f864',
  textCyan: '#64f8f8',
  textGreen: '#64f864',
  textRed: '#f86464',
  textGray: '#888888',
  // 边框色
  borderLight: '#6a6a9a',
  borderDark: '#4a4a7a',
  // 强调色
  accent: '#c42c2c',
  accentLight: '#e84c4c',
  // 装备品质色
  qualityNormal: '#ffffff',
  qualityGood: '#64f864',
  qualityRare: '#6464f8',
  qualityEpic: '#f864f8'
};

// 装备类型中文名称映射
const EQUIPMENT_TYPE_NAMES = {
  [EquipmentType.MAIN_CANNON]: '主炮',
  [EquipmentType.SUB_CANNON]: '副炮',
  [EquipmentType.SE]: 'S-E',
  [EquipmentType.C_UNIT]: 'C装置',
  [EquipmentType.ENGINE]: '引擎',
  [EquipmentType.HAT]: '帽子',
  [EquipmentType.ARMOR]: '衣服',
  [EquipmentType.GLOVE]: '手套',
  [EquipmentType.SHOES]: '鞋子',
  [EquipmentType.WEAPON]: '武器'
};

// 攻击范围中文名称
const ATTACK_RANGE_NAMES = {
  [AttackRange.SINGLE]: '单体',
  [AttackRange.GROUP]: '组攻',
  [AttackRange.ALL]: '全体'
};

// UI状态枚举
const UIState = {
  MAIN_MENU: 'mainMenu',
  TANK_SELECT: 'tankSelect',
  TANK_EQUIP: 'tankEquip',
  HUMAN_SELECT: 'humanSelect',
  HUMAN_EQUIP: 'humanEquip',
  BACKPACK: 'backpack',
  SHOP: 'shop',
  SHOP_CATEGORY: 'shopCategory',
  SHOP_LIST: 'shopList'
};

// 装备UI管理器
class EquipmentUIManager {
  constructor() {
    this.container = null;
    this.currentUI = null;
    this.state = UIState.MAIN_MENU;
    this.selectedIndex = 0;
    this.subIndex = 0;
    this.thirdIndex = 0;
    this.message = '';
    this.messageTimer = null;
    this.shopCategory = null;
    this.visible = false;
    
    // 键盘状态
    this.keyDelay = 0;
    this.keyDelayMax = 150; // 按键延迟(ms)
  }
  
  // 设置 inventoryManager
  setInventoryManager(manager) {
    currentInventoryManager = manager;
  }
  
  // 获取当前 inventoryManager
  getInventoryManager() {
    return currentInventoryManager;
  }
  
  // 创建UI容器
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'equipment-ui-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${COLORS.bgDark};
      z-index: 1000;
      font-family: 'Courier New', monospace;
      display: none;
      image-rendering: pixelated;
    `;
    
    document.body.appendChild(this.container);
    
    // 添加键盘事件监听
    this.setupKeyboardListeners();
    
    // 添加触摸事件监听
    this.setupTouchListeners();
  }
  
  // 设置键盘监听
  setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
      if (!this.visible) return;
      
      if (this.keyDelay > 0) return;
      this.keyDelay = this.keyDelayMax;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.navigateUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.navigateDown();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.navigateLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.navigateRight();
          break;
        case 'Enter':
        case ' ':
        case 'z':
        case 'Z':
          this.confirm();
          break;
        case 'Escape':
        case 'x':
        case 'X':
          this.cancel();
          break;
      }
      
      e.preventDefault();
    });
    
    // 按键延迟更新
    setInterval(() => {
      if (this.keyDelay > 0) {
        this.keyDelay -= 16;
      }
    }, 16);
  }
  
  // 设置触摸监听
  setupTouchListeners() {
    let touchStartY = 0;
    let touchStartX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      if (!this.visible) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchEndY - touchStartY;
      const diffX = touchEndX - touchStartX;
      
      if (Math.abs(diffY) < 30 && Math.abs(diffX) < 30) {
        // 点击 - 确认
        this.confirm();
      } else if (Math.abs(diffY) > Math.abs(diffX)) {
        // 垂直滑动
        if (diffY > 30) this.navigateDown();
        else if (diffY < -30) this.navigateUp();
      }
    });
  }
  
  // 显示UI
  show() {
    if (!this.container) this.createContainer();
    this.container.style.display = 'block';
    this.visible = true;
    this.state = UIState.MAIN_MENU;
    this.selectedIndex = 0;
    this.render();
  }
  
  // 隐藏UI
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
    this.visible = false;
  }
  
  // 切换显示
  toggle() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  // 导航 - 上
  navigateUp() {
    const maxIndex = this.getMaxIndex();
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else {
      this.selectedIndex = maxIndex - 1;
    }
    this.render();
  }
  
  // 导航 - 下
  navigateDown() {
    const maxIndex = this.getMaxIndex();
    if (this.selectedIndex < maxIndex - 1) {
      this.selectedIndex++;
    } else {
      this.selectedIndex = 0;
    }
    this.render();
  }
  
  // 导航 - 左
  navigateLeft() {
    if (this.state === UIState.BACKPACK || this.state === UIState.SHOP) {
      if (this.subIndex > 0) {
        this.subIndex--;
        this.thirdIndex = 0;
        this.render();
      }
    }
  }
  
  // 导航 - 右
  navigateRight() {
    if (this.state === UIState.BACKPACK || this.state === UIState.SHOP) {
      const maxSubIndex = this.getMaxSubIndex();
      if (this.subIndex < maxSubIndex - 1) {
        this.subIndex++;
        this.thirdIndex = 0;
        this.render();
      }
    }
  }
  
  // 确认
  confirm() {
    switch(this.state) {
      case UIState.MAIN_MENU:
        this.handleMainMenuConfirm();
        break;
      case UIState.TANK_SELECT:
        this.handleTankSelectConfirm();
        break;
      case UIState.TANK_EQUIP:
        this.handleTankEquipConfirm();
        break;
      case UIState.HUMAN_SELECT:
        this.handleHumanSelectConfirm();
        break;
      case UIState.HUMAN_EQUIP:
        this.handleHumanEquipConfirm();
        break;
      case UIState.BACKPACK:
        this.handleBackpackConfirm();
        break;
      case UIState.SHOP:
        this.handleShopConfirm();
        break;
      case UIState.SHOP_LIST:
        this.handleShopListConfirm();
        break;
    }
  }
  
  // 取消
  cancel() {
    switch(this.state) {
      case UIState.MAIN_MENU:
        this.hide();
        break;
      case UIState.TANK_SELECT:
      case UIState.HUMAN_SELECT:
      case UIState.BACKPACK:
      case UIState.SHOP:
        this.state = UIState.MAIN_MENU;
        this.selectedIndex = 0;
        break;
      case UIState.TANK_EQUIP:
        this.state = UIState.TANK_SELECT;
        this.selectedIndex = 0;
        break;
      case UIState.HUMAN_EQUIP:
        this.state = UIState.HUMAN_SELECT;
        this.selectedIndex = 0;
        break;
      case UIState.SHOP_LIST:
        this.state = UIState.SHOP;
        this.selectedIndex = this.subIndex;
        break;
    }
    this.render();
  }
  
  // 获取最大索引
  getMaxIndex() {
    switch(this.state) {
      case UIState.MAIN_MENU:
        return 5; // 坦克、人类、背包、商店、取消
      case UIState.TANK_SELECT:
        return currentInventoryManager.tanks.length + 1; // 坦克列表 + 返回
      case UIState.TANK_EQUIP:
        return 7; // 5个装备槽 + 装甲片 + 返回
      case UIState.HUMAN_SELECT:
        return currentInventoryManager.humans.length + 1;
      case UIState.HUMAN_EQUIP:
        return 6; // 5个装备槽 + 返回
      case UIState.BACKPACK:
        return this.getBackpackItems().length + 1;
      case UIState.SHOP:
        return 11; // 10个装备分类 + 返回
      case UIState.SHOP_LIST:
        return this.getShopItems().length + 1;
      default:
        return 1;
    }
  }
  
  // 获取最大子索引
  getMaxSubIndex() {
    if (this.state === UIState.BACKPACK) {
      return 3; // 坦克装备、人类装备、道具
    } else if (this.state === UIState.SHOP) {
      return 10; // 10个装备分类
    }
    return 1;
  }
  
  // 处理主菜单确认
  handleMainMenuConfirm() {
    switch(this.selectedIndex) {
      case 0: // 坦克装备
        this.state = UIState.TANK_SELECT;
        this.selectedIndex = 0;
        break;
      case 1: // 人类装备
        this.state = UIState.HUMAN_SELECT;
        this.selectedIndex = 0;
        break;
      case 2: // 背包
        this.state = UIState.BACKPACK;
        this.selectedIndex = 0;
        this.subIndex = 0;
        this.thirdIndex = 0;
        break;
      case 3: // 商店
        this.state = UIState.SHOP;
        this.selectedIndex = 0;
        this.subIndex = 0;
        break;
      case 4: // 取消
        this.hide();
        break;
    }
    this.render();
  }
  
  // 处理坦克选择确认
  handleTankSelectConfirm() {
    if (this.selectedIndex === currentInventoryManager.tanks.length) {
      // 返回
      this.state = UIState.MAIN_MENU;
      this.selectedIndex = 0;
    } else {
      this.state = UIState.TANK_EQUIP;
      this.selectedIndex = 0;
    }
    this.render();
  }
  
  // 处理坦克装备确认
  handleTankEquipConfirm() {
    const tankIndex = this.getPreviousSelection();
    
    if (this.selectedIndex === 6) {
      // 返回
      this.state = UIState.TANK_SELECT;
      this.selectedIndex = tankIndex;
      this.render();
      return;
    }
    
    if (this.selectedIndex === 5) {
      // 购买装甲片
      this.showMessage('装甲片购买功能开发中...');
      return;
    }
    
    // 装备槽位
    const slotNames = ['mainCannon', 'subCannon', 'se', 'cUnit', 'engine'];
    const slotName = slotNames[this.selectedIndex];
    const tank = currentInventoryManager.tanks[tankIndex];
    
    if (tank.slots[slotName]) {
      // 卸下装备
      const result = currentInventoryManager.uninstallTankEquipment(tankIndex, slotName);
      this.showMessage(result.message);
    } else {
      // 从背包选择装备安装
      const equipmentType = this.getSlotEquipmentType(slotName);
      const items = this.getBackpackItemsByType(equipmentType);
      
      if (items.length === 0) {
        this.showMessage('背包中没有可用的装备！');
        return;
      }
      
      // 选择第一个可用装备
      const result = currentInventoryManager.installTankEquipment(tankIndex, items[0].id);
      this.showMessage(result.message);
    }
    
    this.render();
  }
  
  // 处理人类选择确认
  handleHumanSelectConfirm() {
    if (this.selectedIndex === currentInventoryManager.humans.length) {
      this.state = UIState.MAIN_MENU;
      this.selectedIndex = 0;
    } else {
      this.state = UIState.HUMAN_EQUIP;
      this.selectedIndex = 0;
    }
    this.render();
  }
  
  // 处理人类装备确认
  handleHumanEquipConfirm() {
    const humanIndex = this.getPreviousSelection();
    
    if (this.selectedIndex === 5) {
      this.state = UIState.HUMAN_SELECT;
      this.selectedIndex = humanIndex;
      this.render();
      return;
    }
    
    const slotNames = ['hat', 'armor', 'glove', 'shoes', 'weapon'];
    const slotName = slotNames[this.selectedIndex];
    const human = currentInventoryManager.humans[humanIndex];
    
    if (human.slots[slotName]) {
      const result = currentInventoryManager.uninstallHumanEquipment(humanIndex, slotName);
      this.showMessage(result.message);
    } else {
      const equipmentType = this.getHumanSlotEquipmentType(slotName);
      const items = this.getBackpackItemsByType(equipmentType);
      
      if (items.length === 0) {
        this.showMessage('背包中没有可用的装备！');
        return;
      }
      
      const result = currentInventoryManager.installHumanEquipment(humanIndex, items[0].id);
      this.showMessage(result.message);
    }
    
    this.render();
  }
  
  // 处理背包确认
  handleBackpackConfirm() {
    const items = this.getBackpackItems();
    
    if (this.selectedIndex === items.length) {
      this.state = UIState.MAIN_MENU;
      this.selectedIndex = 0;
      this.render();
      return;
    }
    
    const item = items[this.selectedIndex];
    if (item) {
      this.showMessage(`已选择: ${item.name}`);
    }
  }
  
  // 处理商店确认
  handleShopConfirm() {
    const categories = [
      EquipmentType.MAIN_CANNON, EquipmentType.SUB_CANNON, EquipmentType.SE,
      EquipmentType.C_UNIT, EquipmentType.ENGINE,
      EquipmentType.HAT, EquipmentType.ARMOR, EquipmentType.GLOVE,
      EquipmentType.SHOES, EquipmentType.WEAPON
    ];
    
    if (this.selectedIndex === 10) {
      this.state = UIState.MAIN_MENU;
      this.selectedIndex = 0;
    } else {
      this.shopCategory = categories[this.selectedIndex];
      this.state = UIState.SHOP_LIST;
      this.selectedIndex = 0;
    }
    this.render();
  }
  
  // 处理商店列表确认
  handleShopListConfirm() {
    const items = this.getShopItems();
    
    if (this.selectedIndex === items.length) {
      this.state = UIState.SHOP;
      this.selectedIndex = 0;
      this.render();
      return;
    }
    
    const item = items[this.selectedIndex];
    if (item && currentInventoryManager.canAfford(item.price)) {
      const result = currentInventoryManager.buyEquipment(item.id, 1);
      this.showMessage(result.message);
    } else if (item) {
      this.showMessage('金币不足！');
    }
    
    this.render();
  }
  
  // 获取前一个选择（用于返回）
  getPreviousSelection() {
    // 简化实现，实际应该保存之前的选择
    return 0;
  }
  
  // 获取槽位对应的装备类型
  getSlotEquipmentType(slotName) {
    const map = {
      mainCannon: EquipmentType.MAIN_CANNON,
      subCannon: EquipmentType.SUB_CANNON,
      se: EquipmentType.SE,
      cUnit: EquipmentType.C_UNIT,
      engine: EquipmentType.ENGINE
    };
    return map[slotName];
  }
  
  // 获取人类槽位对应的装备类型
  getHumanSlotEquipmentType(slotName) {
    const map = {
      hat: EquipmentType.HAT,
      armor: EquipmentType.ARMOR,
      glove: EquipmentType.GLOVE,
      shoes: EquipmentType.SHOES,
      weapon: EquipmentType.WEAPON
    };
    return map[slotName];
  }
  
  // 获取背包物品
  getBackpackItems() {
    const categories = [
      [EquipmentType.MAIN_CANNON, EquipmentType.SUB_CANNON, EquipmentType.SE, EquipmentType.C_UNIT, EquipmentType.ENGINE],
      [EquipmentType.HAT, EquipmentType.ARMOR, EquipmentType.GLOVE, EquipmentType.SHOES, EquipmentType.WEAPON],
      [] // 道具
    ];
    
    const categoryIndex = this.subIndex;
    const items = [];
    
    if (categoryIndex < 2) {
      const types = categories[categoryIndex];
      for (const type of types) {
        const list = currentInventoryManager.getInventoryListByType(type);
        items.push(...list);
      }
    }
    
    return items;
  }
  
  // 根据类型获取背包物品
  getBackpackItemsByType(type) {
    return currentInventoryManager.getInventoryListByType(type);
  }
  
  // 获取商店物品
  getShopItems() {
    if (!this.shopCategory) return [];
    return getEquipmentByType(this.shopCategory);
  }
  
  // 显示消息
  showMessage(msg) {
    this.message = msg;
    if (this.messageTimer) clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => {
      this.message = '';
      this.render();
    }, 2000);
    this.render();
  }
  
  // 渲染UI
  render() {
    if (!this.container) return;
    
    let html = '';
    
    switch(this.state) {
      case UIState.MAIN_MENU:
        html = this.renderMainMenu();
        break;
      case UIState.TANK_SELECT:
        html = this.renderTankSelect();
        break;
      case UIState.TANK_EQUIP:
        html = this.renderTankEquip();
        break;
      case UIState.HUMAN_SELECT:
        html = this.renderHumanSelect();
        break;
      case UIState.HUMAN_EQUIP:
        html = this.renderHumanEquip();
        break;
      case UIState.BACKPACK:
        html = this.renderBackpack();
        break;
      case UIState.SHOP:
        html = this.renderShop();
        break;
      case UIState.SHOP_LIST:
        html = this.renderShopList();
        break;
    }
    
    this.container.innerHTML = html;
  }
  
  // 渲染主菜单
  renderMainMenu() {
    const gold = currentInventoryManager.getGold();
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader('装备管理')}
        
        <!-- 金币显示 -->
        <div style="
          background: ${COLORS.bgMedium};
          border: 3px solid ${COLORS.borderLight};
          padding: 15px 20px;
          margin: 15px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${COLORS.textYellow}; font-size: 18px;">💰 金币</span>
          <span style="color: ${COLORS.textYellow}; font-size: 24px; font-weight: bold;">${gold.toLocaleString()} G</span>
        </div>
        
        <!-- 菜单选项 -->
        <div style="
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 0;
        ">
          ${this.renderMenuItem('🛡️ 坦克装备', 0, '管理坦克的武器和装备')}
          ${this.renderMenuItem('👤 人类装备', 1, '管理角色的防具和武器')}
          ${this.renderMenuItem('🎒 背包', 2, '查看拥有的装备和道具')}
          ${this.renderMenuItem('🏪 商店', 3, '购买新的装备')}
          ${this.renderMenuItem('❌ 关闭', 4, '返回游戏')}
        </div>
        
        ${this.renderWindowFooter('↑↓选择  Enter确认  Esc取消')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染坦克选择
  renderTankSelect() {
    const tanks = currentInventoryManager.tanks;
    
    let tankListHtml = '';
    tanks.forEach((tank, index) => {
      const status = currentInventoryManager.getTankStatus(index);
      const isOverloaded = status.isOverloaded;
      const selected = this.selectedIndex === index;
      
      tankListHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${COLORS.textWhite}; font-size: 16px; font-weight: bold;">
              ${selected ? '▶ ' : ''}${tank.name}
            </div>
            <div style="color: ${COLORS.textGray}; font-size: 12px; margin-top: 5px;">
              攻击: ${status.totalAttack} | 防御: ${status.totalDefense}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: ${isOverloaded ? COLORS.textRed : COLORS.textGreen}; font-size: 14px;">
              ${isOverloaded ? '⚠ 超载' : '✓ 正常'}
            </div>
            <div style="color: ${COLORS.textGray}; font-size: 12px;">
              ${status.totalWeight.toFixed(1)}t / ${status.loadCapacity.toFixed(1)}t
            </div>
          </div>
        </div>
      `;
    });
    
    // 返回选项
    tankListHtml += this.renderBackOption(tanks.length);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader('坦克装备 - 选择坦克')}
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 10px 0;">
          ${tankListHtml}
        </div>
        ${this.renderWindowFooter('↑↓选择  Enter确认  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染坦克装备界面
  renderTankEquip() {
    const tankIndex = 0; // 简化实现
    const status = currentInventoryManager.getTankStatus(tankIndex);
    const tank = currentInventoryManager.tanks[tankIndex];
    
    const slots = [
      { name: '主炮', slot: 'mainCannon', icon: '🔫' },
      { name: '副炮', slot: 'subCannon', icon: '🎯' },
      { name: 'S-E', slot: 'se', icon: '🚀' },
      { name: 'C装置', slot: 'cUnit', icon: '📡' },
      { name: '引擎', slot: 'engine', icon: '⚙️' }
    ];
    
    let slotsHtml = '';
    slots.forEach((slotInfo, index) => {
      const equip = status.equipment[slotInfo.slot];
      const selected = this.selectedIndex === index;
      
      slotsHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${slotInfo.icon}</span>
            <span style="color: ${COLORS.textWhite};">${slotInfo.name}</span>
          </div>
          <div style="text-align: right;">
            ${equip ? `
              <div style="color: ${COLORS.textYellow};">${equip.name}</div>
              <div style="color: ${COLORS.textGray}; font-size: 12px;">
                ${equip.attack ? `攻:${equip.attack} ` : ''}${equip.defense ? `防:${equip.defense} ` : ''}重:${equip.weight}t
              </div>
            ` : `
              <div style="color: ${COLORS.textGray};">------</div>
            `}
          </div>
        </div>
      `;
    });
    
    // 装甲片和返回
    slotsHtml += this.renderMenuItem('🛡️ 装甲片', 5, '购买装甲片增强防御');
    slotsHtml += this.renderBackOption(6);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`${tank.name} 装备管理`)}
        
        <!-- 状态面板 -->
        <div style="
          background: ${COLORS.bgMedium};
          border: 3px solid ${COLORS.borderLight};
          padding: 15px;
          margin-bottom: 15px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        ">
          <div style="text-align: center;">
            <div style="color: ${COLORS.textGray}; font-size: 12px;">总攻击</div>
            <div style="color: ${COLORS.textRed}; font-size: 20px; font-weight: bold;">${status.totalAttack}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${COLORS.textGray}; font-size: 12px;">总防御</div>
            <div style="color: ${COLORS.textCyan}; font-size: 20px; font-weight: bold;">${status.totalDefense}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${COLORS.textGray}; font-size: 12px;">重量</div>
            <div style="color: ${status.isOverloaded ? COLORS.textRed : COLORS.textGreen}; font-size: 20px; font-weight: bold;">
              ${status.totalWeight.toFixed(1)}t/${status.loadCapacity.toFixed(1)}t
            </div>
          </div>
        </div>
        
        <!-- 装备槽 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${slotsHtml}
        </div>
        
        ${this.renderWindowFooter('↑↓选择  Enter装备/卸下  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染人类选择
  renderHumanSelect() {
    const humans = currentInventoryManager.humans;
    
    let humanListHtml = '';
    humans.forEach((human, index) => {
      const status = currentInventoryManager.getHumanStatus(index);
      const selected = this.selectedIndex === index;
      
      humanListHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${COLORS.textWhite}; font-size: 16px; font-weight: bold;">
              ${selected ? '▶ ' : ''}${human.name}
            </div>
            <div style="color: ${COLORS.textGray}; font-size: 12px; margin-top: 5px;">
              攻击: ${status.totalAttack} | 防御: ${status.totalDefense}
            </div>
          </div>
          <div style="color: ${COLORS.textCyan}; font-size: 14px;">
            👤 角色
          </div>
        </div>
      `;
    });
    
    humanListHtml += this.renderBackOption(humans.length);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader('人类装备 - 选择角色')}
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 10px 0;">
          ${humanListHtml}
        </div>
        ${this.renderWindowFooter('↑↓选择  Enter确认  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染人类装备界面
  renderHumanEquip() {
    const humanIndex = 0;
    const status = currentInventoryManager.getHumanStatus(humanIndex);
    const human = currentInventoryManager.humans[humanIndex];
    
    const slots = [
      { name: '帽子', slot: 'hat', icon: '🎩' },
      { name: '衣服', slot: 'armor', icon: '👕' },
      { name: '手套', slot: 'glove', icon: '🧤' },
      { name: '鞋子', slot: 'shoes', icon: '👟' },
      { name: '武器', slot: 'weapon', icon: '⚔️' }
    ];
    
    let slotsHtml = '';
    slots.forEach((slotInfo, index) => {
      const equip = status.equipment[slotInfo.slot];
      const selected = this.selectedIndex === index;
      
      slotsHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${slotInfo.icon}</span>
            <span style="color: ${COLORS.textWhite};">${slotInfo.name}</span>
          </div>
          <div style="text-align: right;">
            ${equip ? `
              <div style="color: ${COLORS.textYellow};">${equip.name}</div>
              <div style="color: ${COLORS.textGray}; font-size: 12px;">
                ${equip.attack ? `攻:${equip.attack} ` : ''}${equip.defense ? `防:${equip.defense} ` : ''}
              </div>
            ` : `
              <div style="color: ${COLORS.textGray};">------</div>
            `}
          </div>
        </div>
      `;
    });
    
    slotsHtml += this.renderBackOption(5);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`${human.name} 装备管理`)}
        
        <!-- 状态面板 -->
        <div style="
          background: ${COLORS.bgMedium};
          border: 3px solid ${COLORS.borderLight};
          padding: 15px;
          margin-bottom: 15px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        ">
          <div style="text-align: center;">
            <div style="color: ${COLORS.textGray}; font-size: 12px;">总攻击</div>
            <div style="color: ${COLORS.textRed}; font-size: 20px; font-weight: bold;">${status.totalAttack}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${COLORS.textGray}; font-size: 12px;">总防御</div>
            <div style="color: ${COLORS.textCyan}; font-size: 20px; font-weight: bold;">${status.totalDefense}</div>
          </div>
        </div>
        
        <!-- 装备槽 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${slotsHtml}
        </div>
        
        ${this.renderWindowFooter('↑↓选择  Enter装备/卸下  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染背包
  renderBackpack() {
    const categories = ['坦克装备', '人类装备', '道具'];
    const categoryTypes = [
      [EquipmentType.MAIN_CANNON, EquipmentType.SUB_CANNON, EquipmentType.SE, EquipmentType.C_UNIT, EquipmentType.ENGINE],
      [EquipmentType.HAT, EquipmentType.ARMOR, EquipmentType.GLOVE, EquipmentType.SHOES, EquipmentType.WEAPON],
      []
    ];
    
    // 分类标签
    let tabsHtml = '';
    categories.forEach((cat, index) => {
      const selected = this.subIndex === index;
      tabsHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 2px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 10px 20px;
          cursor: pointer;
          color: ${selected ? COLORS.textCyan : COLORS.textGray};
          font-weight: ${selected ? 'bold' : 'normal'};
        ">${cat}</div>
      `;
    });
    
    // 物品列表
    const items = this.getBackpackItems();
    let itemsHtml = '';
    
    items.forEach((item, index) => {
      const selected = this.selectedIndex === index;
      itemsHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 2px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${COLORS.textYellow};">${selected ? '▶ ' : ''}${item.name} x${item.quantity}</div>
            <div style="color: ${COLORS.textGray}; font-size: 11px;">
              ${item.attack ? `攻:${item.attack} ` : ''}${item.defense ? `防:${item.defense} ` : ''}${item.weight ? `重:${item.weight}t ` : ''}
            </div>
          </div>
          <div style="color: ${COLORS.textGreen}; font-size: 14px;">
            ${item.price}G
          </div>
        </div>
      `;
    });
    
    if (items.length === 0) {
      itemsHtml = `
        <div style="
          text-align: center;
          padding: 40px;
          color: ${COLORS.textGray};
        ">暂无装备</div>
      `;
    }
    
    itemsHtml += this.renderBackOption(items.length);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader('背包')}
        
        <!-- 分类标签 -->
        <div style="display: flex; gap: 5px; margin-bottom: 15px;">
          ${tabsHtml}
        </div>
        
        <!-- 物品列表 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;">
          ${itemsHtml}
        </div>
        
        ${this.renderWindowFooter('←→切换分类  ↑↓选择  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染商店
  renderShop() {
    const gold = currentInventoryManager.getGold();
    const categories = [
      { name: '主炮', type: EquipmentType.MAIN_CANNON, icon: '🔫' },
      { name: '副炮', type: EquipmentType.SUB_CANNON, icon: '🎯' },
      { name: 'S-E', type: EquipmentType.SE, icon: '🚀' },
      { name: 'C装置', type: EquipmentType.C_UNIT, icon: '📡' },
      { name: '引擎', type: EquipmentType.ENGINE, icon: '⚙️' },
      { name: '帽子', type: EquipmentType.HAT, icon: '🎩' },
      { name: '衣服', type: EquipmentType.ARMOR, icon: '👕' },
      { name: '手套', type: EquipmentType.GLOVE, icon: '🧤' },
      { name: '鞋子', type: EquipmentType.SHOES, icon: '👟' },
      { name: '武器', type: EquipmentType.WEAPON, icon: '⚔️' }
    ];
    
    let categoriesHtml = '';
    categories.forEach((cat, index) => {
      const selected = this.selectedIndex === index;
      categoriesHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        ">
          <span style="font-size: 24px;">${cat.icon}</span>
          <span style="color: ${COLORS.textWhite}; font-size: 16px;">
            ${selected ? '▶ ' : ''}${cat.name}
          </span>
        </div>
      `;
    });
    
    categoriesHtml += this.renderBackOption(10);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader('商店')}
        
        <!-- 金币显示 -->
        <div style="
          background: ${COLORS.bgMedium};
          border: 3px solid ${COLORS.borderLight};
          padding: 10px 20px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${COLORS.textYellow}; font-size: 16px;">💰 持有金币</span>
          <span style="color: ${COLORS.textYellow}; font-size: 20px; font-weight: bold;">${gold.toLocaleString()} G</span>
        </div>
        
        <!-- 商品分类 -->
        <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${categoriesHtml}
        </div>
        
        ${this.renderWindowFooter('↑↓选择  Enter进入  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染商店列表
  renderShopList() {
    const gold = currentInventoryManager.getGold();
    const items = this.getShopItems();
    const categoryName = EQUIPMENT_TYPE_NAMES[this.shopCategory] || '装备';
    
    let itemsHtml = '';
    items.forEach((item, index) => {
      const selected = this.selectedIndex === index;
      const canAfford = gold >= item.price;
      
      itemsHtml += `
        <div style="
          background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
          border: 2px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${COLORS.textYellow};">${selected ? '▶ ' : ''}${item.name}</div>
            <div style="color: ${COLORS.textGray}; font-size: 11px;">
              ${item.attack !== undefined && item.attack > 0 ? `攻:${item.attack} ` : ''}
              ${item.defense !== undefined && item.defense > 0 ? `防:${item.defense} ` : ''}
              ${item.weight ? `重:${item.weight}t ` : ''}
              ${item.loadCapacity ? `载重:${item.loadCapacity}t ` : ''}
              ${item.ammo ? `弹药:${item.ammo} ` : ''}
            </div>
          </div>
          <div style="color: ${canAfford ? COLORS.textGreen : COLORS.textRed}; font-size: 16px; font-weight: bold;">
            ${item.price}G
          </div>
        </div>
      `;
    });
    
    itemsHtml += this.renderBackOption(items.length);
    
    return `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`商店 - ${categoryName}`)}
        
        <!-- 金币显示 -->
        <div style="
          background: ${COLORS.bgMedium};
          border: 3px solid ${COLORS.borderLight};
          padding: 10px 20px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${COLORS.textYellow}; font-size: 16px;">💰 持有金币</span>
          <span style="color: ${COLORS.textYellow}; font-size: 20px; font-weight: bold;">${gold.toLocaleString()} G</span>
        </div>
        
        <!-- 商品列表 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;">
          ${itemsHtml}
        </div>
        
        ${this.renderWindowFooter('↑↓选择  Enter购买  Esc返回')}
        ${this.renderMessage()}
      </div>
    `;
  }
  
  // 渲染窗口标题
  renderWindowHeader(title) {
    return `
      <div style="
        background: linear-gradient(180deg, ${COLORS.accent}, ${COLORS.bgDark});
        border: 3px solid ${COLORS.accentLight};
        border-radius: 8px 8px 0 0;
        padding: 15px 20px;
        text-align: center;
        margin-bottom: 10px;
      ">
        <h2 style="
          color: ${COLORS.textYellow};
          font-size: 24px;
          margin: 0;
          text-shadow: 2px 2px 0 #000;
          letter-spacing: 4px;
        ">${title}</h2>
      </div>
    `;
  }
  
  // 渲染窗口底部
  renderWindowFooter(hint) {
    return `
      <div style="
        background: ${COLORS.bgMedium};
        border: 2px solid ${COLORS.borderLight};
        padding: 10px 20px;
        text-align: center;
        margin-top: 10px;
      ">
        <span style="color: ${COLORS.textGray}; font-size: 12px;">${hint}</span>
      </div>
    `;
  }
  
  // 渲染菜单项
  renderMenuItem(text, index, description) {
    const selected = this.selectedIndex === index;
    return `
      <div style="
        background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
        border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
        padding: 15px 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span style="color: ${selected ? COLORS.textCyan : COLORS.textWhite}; font-size: 18px;">
          ${selected ? '▶ ' : ''}${text}
        </span>
        <span style="color: ${COLORS.textGray}; font-size: 12px;">${description}</span>
      </div>
    `;
  }
  
  // 渲染返回选项
  renderBackOption(index) {
    const selected = this.selectedIndex === index;
    return `
      <div style="
        background: ${selected ? COLORS.bgLight : COLORS.bgMedium};
        border: 3px solid ${selected ? COLORS.textCyan : COLORS.borderLight};
        padding: 15px;
        cursor: pointer;
        text-align: center;
        margin-top: 10px;
      ">
        <span style="color: ${selected ? COLORS.textCyan : COLORS.textGray}; font-size: 16px;">
          ${selected ? '▶ ' : ''}返回
        </span>
      </div>
    `;
  }
  
  // 渲染消息
  renderMessage() {
    if (!this.message) return '';
    
    return `
      <div style="
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${COLORS.accent};
        border: 3px solid ${COLORS.accentLight};
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 100;
        animation: fadeIn 0.3s ease;
      ">
        <span style="color: ${COLORS.textWhite}; font-size: 16px; font-weight: bold;">
          ${this.message}
        </span>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `;
  }
}

// 创建单例实例
export const equipmentUI = new EquipmentUIManager();

// 初始化装备UI
export function initEquipmentUI(manager) {
  equipmentUI.setInventoryManager(manager);
}

// 初始化装备UI按钮
export function initEquipmentUIButton() {
  const btn = document.createElement('button');
  btn.id = 'equipment-ui-btn';
  btn.textContent = '装备';
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    background: linear-gradient(180deg, #2a6a9a, #1a4a6a);
    color: #fff;
    border: 3px solid #4a9aff;
    padding: 14px 30px;
    font-size: 18px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s;
    text-shadow: 1px 1px 2px #000;
    box-shadow: 0 4px 0 #0a2a4a, 0 0 20px rgba(74, 154, 255, 0.4);
    z-index: 100;
  `;
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 6px 0 #0a2a4a, 0 0 25px rgba(74, 154, 255, 0.6)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 4px 0 #0a2a4a, 0 0 20px rgba(74, 154, 255, 0.4)';
  });
  
  btn.addEventListener('click', () => {
    equipmentUI.toggle();
  });
  
  document.getElementById('ui-layer').appendChild(btn);
}

// 默认导出
export default equipmentUI;