class SaveManager {
    constructor(game) {
        this.game = game;
        this.storageKey = 'metal_max_save';
        this.maxSaveSlots = 3;
    }

    getSaveData() {
        return {
            version: GAME_DATA.VERSION,
            timestamp: Date.now(),
            playTime: this.game.playTime || 0,
            player: { ...this.game.playerData },
            gameFlags: this.game.gameFlags || {},
            currentMap: this.game.currentMap || 'paradise'
        };
    }

    save(slot, saveData = null) {
        if (slot < 0 || slot >= this.maxSaveSlots) {
            console.error('Invalid save slot');
            return false;
        }

        const data = saveData || this.getSaveData();
        
        try {
            const saves = this.getAllSaves();
            saves[slot] = data;
            localStorage.setItem(this.storageKey, JSON.stringify(saves));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    load(slot) {
        if (slot < 0 || slot >= this.maxSaveSlots) {
            console.error('Invalid save slot');
            return null;
        }

        try {
            const saves = this.getAllSaves();
            return saves[slot] || null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    getAllSaves() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [null, null, null];
        } catch (e) {
            return [null, null, null];
        }
    }

    deleteSave(slot) {
        if (slot < 0 || slot >= this.maxSaveSlots) {
            return false;
        }

        try {
            const saves = this.getAllSaves();
            saves[slot] = null;
            localStorage.setItem(this.storageKey, JSON.stringify(saves));
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }

    hasSave(slot) {
        const saves = this.getAllSaves();
        return saves[slot] !== null;
    }

    getSaveInfo(slot) {
        const save = this.load(slot);
        if (!save) return null;
        
        return {
            slot: slot,
            timestamp: save.timestamp,
            playTime: save.playTime,
            playerLevel: save.player.level,
            playerName: save.player.name,
            currentMap: save.currentMap,
            mapName: GAME_DATA.MAPS[save.currentMap]?.name || '未知地图'
        };
    }

    formatPlayTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}小时${minutes}分`;
        } else if (minutes > 0) {
            return `${minutes}分${secs}秒`;
        } else {
            return `${secs}秒`;
        }
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
}

class MenuSystem {
    constructor(game) {
        this.game = game;
        this.state = 'closed';
        this.selectedIndex = 0;
        this.menuItems = [];
        this.currentMenu = 'main';
        this.subMenuData = null;
    }

    open() {
        this.state = 'open';
        this.currentMenu = 'main';
        this.selectedIndex = 0;
        this.menuItems = [
            { id: 'status', name: '状态', icon: '👤' },
            { id: 'equipment', name: '装备', icon: '⚔️' },
            { id: 'items', name: '道具', icon: '💊' },
            { id: 'tank', name: '战车', icon: '🚗' },
            { id: 'save', name: '存档', icon: '💾' },
            { id: 'quit', name: '结束', icon: '🚪' }
        ];
    }

    close() {
        this.state = 'closed';
        this.currentMenu = 'main';
        this.selectedIndex = 0;
    }

    handleInput(key) {
        if (this.state === 'closed') return;

        if (key === 'Escape' || key === 'KeyK') {
            if (this.currentMenu === 'main') {
                this.close();
            } else {
                this.currentMenu = 'main';
                this.selectedIndex = 0;
            }
            return;
        }

        if (key === 'ArrowUp' || key === 'KeyW') {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
        } else if (key === 'ArrowDown' || key === 'KeyS') {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
        } else if (key === 'Enter' || key === 'KeyJ') {
            this.selectMenuItem(this.menuItems[this.selectedIndex].id);
        }
    }

    selectMenuItem(itemId) {
        switch (itemId) {
            case 'status':
                this.currentMenu = 'status';
                this.selectedIndex = 0;
                break;
            case 'equipment':
                this.currentMenu = 'equipment';
                this.selectedIndex = 0;
                break;
            case 'items':
                this.currentMenu = 'items';
                this.selectedIndex = 0;
                break;
            case 'tank':
                this.currentMenu = 'tank';
                this.selectedIndex = 0;
                break;
            case 'save':
                this.currentMenu = 'save';
                this.selectedIndex = 0;
                break;
            case 'quit':
                if (confirm('确定要结束游戏吗？')) {
                    this.game.gameState = 'QUIT';
                }
                break;
        }
    }

    handleMenuInput(key) {
        if (this.currentMenu === 'save') {
            if (key >= '1' && key <= '3') {
                const slot = parseInt(key) - 1;
                this.game.saveManager.save(slot);
                this.game.addLog('游戏已保存！');
            } else if (key === '0' || key === 'Escape' || key === 'KeyK') {
                this.currentMenu = 'main';
            }
        } else if (key === 'Escape' || key === 'KeyK') {
            this.currentMenu = 'main';
            this.selectedIndex = 0;
        }
    }

    render(ctx) {
        if (this.state === 'closed') return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        if (this.currentMenu === 'main') {
            this.renderMainMenu(ctx);
        } else if (this.currentMenu === 'status') {
            this.renderStatusMenu(ctx);
        } else if (this.currentMenu === 'equipment') {
            this.renderEquipmentMenu(ctx);
        } else if (this.currentMenu === 'items') {
            this.renderItemsMenu(ctx);
        } else if (this.currentMenu === 'tank') {
            this.renderTankMenu(ctx);
        } else if (this.currentMenu === 'save') {
            this.renderSaveMenu(ctx);
        }
    }

    renderMainMenu(ctx) {
        const menuWidth = 160;
        const menuHeight = this.menuItems.length * 30 + 40;
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('菜单', x + menuWidth / 2, y + 25);

        ctx.strokeStyle = '#34495E';
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 35);
        ctx.lineTo(x + menuWidth - 10, y + 35);
        ctx.stroke();

        this.menuItems.forEach((item, index) => {
            const itemY = y + 50 + index * 30;
            const isSelected = index === this.selectedIndex;

            if (isSelected) {
                ctx.fillStyle = '#34495E';
                ctx.fillRect(x + 10, itemY - 12, menuWidth - 20, 24);
                ctx.fillStyle = '#F39C12';
                ctx.fillText('▶', x + 20, itemY + 4);
            }

            ctx.fillStyle = isSelected ? '#ECF0F1' : '#BDC3C7';
            ctx.font = '14px Courier New';
            ctx.textAlign = 'left';
            ctx.fillText(`${item.icon} ${item.name}`, x + 35, itemY + 4);
        });
    }

    renderStatusMenu(ctx) {
        const player = this.game.playerData;
        const menuWidth = 240;
        const menuHeight = 180;
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#3498DB';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('状态', x + menuWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';

        const stats = [
            `名前: ${player.name}`,
            `等级: ${player.level}`,
            `经验: ${player.exp}/${player.expToNext}`,
            `HP: ${player.hp}/${player.maxHp}`,
            `MP: ${player.mp}/${player.maxMp}`,
            `攻击: ${player.attack}`,
            `防御: ${player.defense}`,
            `速度: ${player.speed}`,
            `金币: ${player.gold}`
        ];

        stats.forEach((stat, index) => {
            ctx.fillText(stat, x + 20, y + 50 + index * 14);
        });

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('按ESC返回', x + menuWidth / 2, y + menuHeight - 15);
    }

    renderEquipmentMenu(ctx) {
        const player = this.game.playerData;
        const menuWidth = 240;
        const menuHeight = 150;
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#9B59B6';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('装备', x + menuWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';

        const slots = ['weapon', 'armor', 'accessory'];
        const slotNames = ['武器', '护甲', '饰品'];

        slots.forEach((slot, index) => {
            const equipment = player.equipment[slot];
            const name = equipment ? GAME_DATA.ITEMS[equipment].name : '无';
            ctx.fillText(`${slotNames[index]}: ${name}`, x + 20, y + 50 + index * 18);
        });

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('按ESC返回', x + menuWidth / 2, y + menuHeight - 15);
    }

    renderItemsMenu(ctx) {
        const items = player.inventory;
        const menuWidth = 240;
        const menuHeight = Math.min(200, 40 + items.length * 18 + 30);
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#27AE60';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('道具', x + menuWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';

        if (items.length === 0) {
            ctx.fillStyle = '#7F8C8D';
            ctx.fillText('没有道具', x + 20, y + 50);
        } else {
            items.forEach((inv, index) => {
                const item = GAME_DATA.ITEMS[inv.itemId];
                const itemY = y + 45 + index * 16;
                ctx.fillText(`${item.name} x${inv.quantity}`, x + 20, itemY);
            });
        }

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('按ESC返回', x + menuWidth / 2, y + menuHeight - 15);
    }

    renderTankMenu(ctx) {
        const player = this.game.playerData;
        const tankId = player.tanks[player.activeTank];
        const tank = tankId ? GAME_DATA.TANKS[tankId] : null;
        const menuWidth = 240;
        const menuHeight = 160;
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#E67E22';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('战车', x + menuWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';

        if (!tank) {
            ctx.fillText('没有战车', x + 20, y + 50);
        } else {
            const tankStats = [
                `名称: ${tank.name}`,
                `HP: ${tank.hp}/${tank.maxHp}`,
                `攻击: ${tank.attack}`,
                `防御: ${tank.defense}`,
                `速度: ${tank.speed}`
            ];

            tankStats.forEach((stat, index) => {
                ctx.fillText(stat, x + 20, y + 50 + index * 16);
            });
        }

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('按ESC返回', x + menuWidth / 2, y + menuHeight - 15);
    }

    renderSaveMenu(ctx) {
        const saves = this.game.saveManager.getAllSaves();
        const menuWidth = 260;
        const menuHeight = 180;
        const x = (this.game.width - menuWidth) / 2;
        const y = (this.game.height - menuHeight) / 2;

        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, menuWidth, menuHeight);

        ctx.fillStyle = '#F39C12';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('存档', x + menuWidth / 2, y + 25);

        ctx.fillStyle = '#ECF0F1';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';

        for (let i = 0; i < 3; i++) {
            const slotY = y + 50 + i * 35;
            const save = saves[i];
            
            ctx.fillStyle = '#34495E';
            ctx.fillRect(x + 15, slotY - 12, menuWidth - 30, 30);
            
            ctx.fillStyle = '#ECF0F1';
            ctx.font = '12px Courier New';
            
            if (save) {
                ctx.fillText(`${i + 1}. ${save.player.name} Lv.${save.player.level}`, x + 25, slotY + 4);
                ctx.fillStyle = '#7F8C8D';
                ctx.font = '10px Courier New';
                ctx.fillText(`地图: ${GAME_DATA.MAPS[save.currentMap]?.name || '未知'}`, x + 25, slotY + 16);
            } else {
                ctx.fillStyle = '#7F8C8D';
                ctx.fillText(`${i + 1}. 空存档位`, x + 25, slotY + 4);
            }
        }

        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('按1-3保存，ESC返回', x + menuWidth / 2, y + menuHeight - 15);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager, MenuSystem };
}
