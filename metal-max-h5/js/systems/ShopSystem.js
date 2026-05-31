class ShopSystem {
    constructor(game) {
        this.game = game;
        this.state = 'closed';
        this.shopType = 'general';
        this.selectedIndex = 0;
        this.goods = [];
        this.mode = 'buy';
    }

    open(shopType = 'general') {
        this.state = 'open';
        this.shopType = shopType;
        this.selectedIndex = 0;
        this.mode = 'buy';
        this.loadGoods();
    }

    close() {
        this.state = 'closed';
        this.selectedIndex = 0;
    }

    loadGoods() {
        switch (this.shopType) {
            case 'general':
                this.goods = Object.values(GAME_DATA.ITEMS).filter(item => item.price > 0);
                break;
            case 'weapon':
                this.goods = Object.values(GAME_DATA.ITEMS).filter(item => item.type === 'weapon');
                break;
            case 'armor':
                this.goods = Object.values(GAME_DATA.ITEMS).filter(item => item.type === 'armor');
                break;
            case 'item':
                this.goods = Object.values(GAME_DATA.ITEMS).filter(item => item.type === 'consumable');
                break;
            default:
                this.goods = Object.values(GAME_DATA.ITEMS).filter(item => item.price > 0);
        }
    }

    handleInput(key) {
        if (this.state === 'closed') return;

        if (key === 'Escape' || key === 'KeyK') {
            this.close();
            return;
        }

        if (key === 'ArrowUp' || key === 'KeyW') {
            this.selectedIndex = (this.selectedIndex - 1 + this.goods.length) % Math.max(1, this.goods.length);
        } else if (key === 'ArrowDown' || key === 'KeyS') {
            this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.goods.length);
        } else if (key === 'Enter' || key === 'KeyJ') {
            if (this.goods.length > 0) {
                this.buyItem(this.selectedIndex);
            }
        } else if (key === 'Tab' || key === 'KeyQ') {
            this.mode = this.mode === 'buy' ? 'sell' : 'buy';
            this.selectedIndex = 0;
        }
    }

    buyItem(index) {
        if (index < 0 || index >= this.goods.length) return;

        const item = this.goods[index];
        const player = this.game.playerData;

        if (player.gold < item.price) {
            this.game.addLog(`金钱不足！需要 ${item.price}G`);
            return;
        }

        player.gold -= item.price;

        const existingItem = player.inventory.find(i => i.itemId === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            player.inventory.push({ itemId: item.id, quantity: 1 });
        }

        this.game.addLog(`购买了 ${item.name}！`);
    }

    sellItem(index) {
        if (index < 0 || index >= this.game.playerData.inventory.length) return;

        const inv = this.game.playerData.inventory[index];
        const item = GAME_DATA.ITEMS[inv.itemId];

        if (!item || item.sellPrice === 0) {
            this.game.addLog('这个物品无法出售！');
            return;
        }

        this.game.playerData.gold += item.sellPrice;
        inv.quantity--;

        if (inv.quantity <= 0) {
            this.game.playerData.inventory.splice(index, 1);
        }

        this.game.addLog(`出售了 ${item.name}，获得 ${item.sellPrice}G！`);
    }

    render(ctx) {
        if (this.state === 'closed') return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        this.renderShopUI(ctx);
    }

    renderShopUI(ctx) {
        const shopWidth = 200;
        const shopHeight = Math.min(220, 40 + this.goods.length * 18 + 60);
        const x = 10;
        const y = (this.game.height - shopHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, shopWidth, shopHeight);
        ctx.strokeStyle = '#9C27B0';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, shopWidth, shopHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        const shopName = this.shopType === 'general' ? '杂货店' : 
                        this.shopType === 'weapon' ? '武器店' : 
                        this.shopType === 'armor' ? '防具店' : '道具店';
        ctx.fillText(shopName, x + shopWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`持有金: ${this.game.playerData.gold}G`, x + 15, y + 45);

        ctx.fillStyle = '#34495E';
        ctx.fillRect(x + 10, y + 55, shopWidth - 20, shopHeight - 85);

        const displayItems = this.mode === 'buy' ? this.goods : this.game.playerData.inventory.map(inv => ({
            ...GAME_DATA.ITEMS[inv.itemId],
            quantity: inv.quantity
        }));

        displayItems.forEach((item, index) => {
            const itemY = y + 65 + index * 16;
            const isSelected = index === this.selectedIndex;

            if (isSelected) {
                ctx.fillStyle = '#34495E';
                ctx.fillRect(x + 12, itemY - 10, shopWidth - 24, 16);
                ctx.fillStyle = '#F39C12';
                ctx.fillText('▶', x + 15, itemY + 2);
            }

            ctx.fillStyle = isSelected ? '#ECF0F1' : '#BDC3C7';
            ctx.font = '11px Courier New';
            
            const price = this.mode === 'buy' ? item.price : (item.sellPrice || 0);
            const name = item.quantity ? `${item.name} x${item.quantity}` : item.name;
            ctx.fillText(name, x + 30, itemY + 2);
            ctx.fillText(`${price}G`, x + shopWidth - 50, itemY + 2);
        });

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('↑↓选择 ↑↓移动 J购买 Tab出售 ESC关闭', x + shopWidth / 2, y + shopHeight - 15);
    }
}

class HospitalSystem {
    constructor(game) {
        this.game = game;
        this.state = 'closed';
        this.healCost = 0;
    }

    open() {
        this.state = 'open';
        this.calculateCost();
    }

    close() {
        this.state = 'closed';
    }

    calculateCost() {
        const player = this.game.playerData;
        const hpToHeal = player.maxHp - player.hp;
        this.healCost = hpToHeal * GAME_DATA.HOSPITAL_COST_PER_HP;
    }

    handleInput(key) {
        if (this.state === 'closed') return;

        if (key === 'Escape' || key === 'KeyK') {
            this.close();
            return;
        }

        if (key === 'Enter' || key === 'KeyJ') {
            this.heal();
        }
    }

    heal() {
        const player = this.game.playerData;

        if (player.hp >= player.maxHp) {
            this.game.addLog('HP已经满了！');
            return;
        }

        if (player.gold < this.healCost) {
            this.game.addLog(`金钱不足！需要 ${this.healCost}G`);
            return;
        }

        player.gold -= this.healCost;
        player.hp = player.maxHp;
        player.mp = player.maxMp;

        this.game.addLog(`治疗完成！花费 ${this.healCost}G`);
        this.calculateCost();
    }

    render(ctx) {
        if (this.state === 'closed') return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        const hospitalWidth = 200;
        const hospitalHeight = 160;
        const x = (this.game.width - hospitalWidth) / 2;
        const y = (this.game.height - hospitalHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, hospitalWidth, hospitalHeight);
        ctx.strokeStyle = '#E91E63';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, hospitalWidth, hospitalHeight);

        ctx.fillStyle = '#E91E63';
        ctx.font = '16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('🏥 医院', x + hospitalWidth / 2, y + 30);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`HP: ${this.game.playerData.hp}/${this.game.playerData.maxHp}`, x + 20, y + 60);
        ctx.fillText(`治疗费用: ${this.healCost}G`, x + 20, y + 80);
        ctx.fillText(`持有金: ${this.game.playerData.gold}G`, x + 20, y + 100);

        ctx.fillStyle = '#F39C12';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('J: 治疗  ESC: 离开', x + hospitalWidth / 2, y + 130);
    }
}

class RepairSystem {
    constructor(game) {
        this.game = game;
        this.state = 'closed';
        this.repairCost = 0;
    }

    open() {
        this.state = 'open';
        this.calculateCost();
    }

    close() {
        this.state = 'closed';
    }

    calculateCost() {
        const player = this.game.playerData;
        if (player.tanks.length === 0) {
            this.repairCost = 0;
            return;
        }

        const tankId = player.tanks[player.activeTank];
        const tank = GAME_DATA.TANKS[tankId];
        
        if (!tank) {
            this.repairCost = 0;
            return;
        }

        const hpToRepair = tank.maxHp - tank.hp;
        this.repairCost = hpToRepair * GAME_DATA.REPAIR_COST_PER_HP;
    }

    handleInput(key) {
        if (this.state === 'closed') return;

        if (key === 'Escape' || key === 'KeyK') {
            this.close();
            return;
        }

        if (key === 'Enter' || key === 'KeyJ') {
            this.repair();
        }
    }

    repair() {
        const player = this.game.playerData;
        
        if (player.tanks.length === 0) {
            this.game.addLog('没有战车！');
            return;
        }

        const tankId = player.tanks[player.activeTank];
        const tank = GAME_DATA.TANKS[tankId];

        if (!tank) {
            this.game.addLog('没有战车！');
            return;
        }

        if (tank.hp >= tank.maxHp) {
            this.game.addLog('战车状态完好！');
            return;
        }

        if (player.gold < this.repairCost) {
            this.game.addLog(`金钱不足！需要 ${this.repairCost}G`);
            return;
        }

        player.gold -= this.repairCost;
        tank.hp = tank.maxHp;

        this.game.addLog(`修理完成！花费 ${this.repairCost}G`);
        this.calculateCost();
    }

    render(ctx) {
        if (this.state === 'closed') return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        const repairWidth = 200;
        const repairHeight = 160;
        const x = (this.game.width - repairWidth) / 2;
        const y = (this.game.height - repairHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, repairWidth, repairHeight);
        ctx.strokeStyle = '#607D8B';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, repairWidth, repairHeight);

        ctx.fillStyle = '#607D8B';
        ctx.font = '16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('🔧 修理工', x + repairWidth / 2, y + 30);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        
        const player = this.game.playerData;
        if (player.tanks.length > 0) {
            const tankId = player.tanks[player.activeTank];
            const tank = GAME_DATA.TANKS[tankId];
            if (tank) {
                ctx.fillText(`战车: ${tank.name}`, x + 20, y + 60);
                ctx.fillText(`HP: ${tank.hp}/${tank.maxHp}`, x + 20, y + 80);
            }
        } else {
            ctx.fillText('没有战车', x + 20, y + 60);
        }
        
        ctx.fillText(`修理费用: ${this.repairCost}G`, x + 20, y + 100);
        ctx.fillText(`持有金: ${player.gold}G`, x + 20, y + 120);

        ctx.fillStyle = '#F39C12';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('J: 修理  ESC: 离开', x + repairWidth / 2, y + 145);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShopSystem, HospitalSystem, RepairSystem };
}
