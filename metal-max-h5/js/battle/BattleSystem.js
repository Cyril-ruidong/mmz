class BattleSystem {
    constructor(game) {
        this.game = game;
        this.state = 'idle';
        this.playerParty = [];
        this.enemyParty = [];
        this.currentTurn = 0;
        this.selectedAction = null;
        this.selectedTarget = null;
        this.battleLog = [];
        this.turnOrder = [];
        this.animationQueue = [];
        this.escapeAttempts = 0;
    }

    startBattle(enemyIds, isBoss = false) {
        this.state = 'intro';
        this.battleLog = [];
        this.escapeAttempts = 0;
        
        this.playerParty = [this.createPlayerUnit()];
        
        this.enemyParty = enemyIds.map((id, index) => {
            const enemyData = GAME_DATA.ENEMIES[id];
            return {
                id: enemyData.id,
                name: enemyData.name,
                hp: enemyData.hp,
                maxHp: enemyData.hp,
                attack: enemyData.attack,
                defense: enemyData.defense,
                speed: enemyData.speed,
                exp: enemyData.exp,
                gold: enemyData.gold,
                skills: [...enemyData.skills],
                drops: [...enemyData.drops],
                boss: enemyData.boss || false,
                position: { x: 200 + index * 60, y: 60 },
                alive: true,
                poisoned: false,
                poisonTurns: 0,
                attackBoost: 1.0
            };
        });
        
        this.calculateTurnOrder();
        
        this.addLog(`遭遇 ${this.enemyParty.length} 个敌人！`);
        
        setTimeout(() => {
            this.state = 'player_turn';
            this.showBattleMenu();
        }, 1500);
    }

    createPlayerUnit() {
        const player = this.game.playerData;
        const tank = this.getActiveTank();
        
        return {
            id: 'player',
            name: player.name,
            hp: player.hp,
            maxHp: player.maxHp,
            mp: player.mp,
            maxMp: player.maxMp,
            attack: player.attack + (tank ? tank.attack : 0),
            defense: player.defense + (tank ? tank.defense : 0),
            speed: player.speed,
            level: player.level,
            skills: [...player.skills],
            position: { x: 60, y: 150 },
            alive: true,
            poisoned: false,
            poisonTurns: 0,
            attackBoost: 1.0
        };
    }

    getActiveTank() {
        if (this.game.playerData && this.game.playerData.tanks) {
            const tankId = this.game.playerData.tanks[this.game.playerData.activeTank];
            if (tankId && GAME_DATA.TANKS[tankId]) {
                return { ...GAME_DATA.TANKS[tankId] };
            }
        }
        return null;
    }

    calculateTurnOrder() {
        const allUnits = [...this.playerParty.filter(u => u.alive), ...this.enemyParty.filter(u => u.alive)];
        allUnits.sort((a, b) => b.speed - a.speed);
        this.turnOrder = allUnits.map(u => u.id);
    }

    showBattleMenu() {
        this.state = 'menu';
        this.selectedAction = null;
        this.selectedTarget = null;
    }

    selectAction(action) {
        this.selectedAction = action;
        
        if (action === 'attack') {
            this.state = 'select_target';
            this.targetMode = 'enemy';
        } else if (action === 'skill') {
            this.state = 'skill_menu';
        } else if (action === 'item') {
            this.state = 'item_menu';
        } else if (action === 'escape') {
            this.attemptEscape();
        }
    }

    selectSkill(skillId) {
        const skill = GAME_DATA.SKILLS[skillId];
        const player = this.playerParty[0];
        
        if (player.mp < skill.mpCost) {
            this.addLog('MP不足！');
            return;
        }
        
        this.selectedAction = { type: 'skill', skill: skill };
        this.state = 'select_target';
        this.targetMode = skill.target === 'enemy' ? 'enemy' : 'ally';
    }

    selectItem(itemId) {
        const item = GAME_DATA.ITEMS[itemId];
        
        if (item.type === 'consumable') {
            this.selectedAction = { type: 'item', item: item, itemId: itemId };
            this.state = 'select_target';
            this.targetMode = item.effect && item.effect.hp ? 'ally' : 'ally';
        }
    }

    selectTarget(targetIndex) {
        const target = this.targetMode === 'enemy' ? this.enemyParty[targetIndex] : this.playerParty[targetIndex];
        
        if (!target || !target.alive) {
            this.addLog('无法选择这个目标！');
            return;
        }
        
        this.selectedTarget = target;
        this.executePlayerAction();
    }

    executePlayerAction() {
        const player = this.playerParty[0];
        const action = this.selectedAction;
        
        if (action.type === 'attack' || action.type === 'skill') {
            const skill = action.type === 'skill' ? action.skill : GAME_DATA.SKILLS['attack'];
            
            if (action.type === 'skill') {
                player.mp -= skill.mpCost;
            }
            
            const hitChance = skill.accuracy / 100;
            if (Math.random() < hitChance) {
                const damage = this.calculateDamage(player, this.selectedTarget, skill);
                this.selectedTarget.hp -= damage;
                
                this.addLog(`${player.name} 使用 ${skill.name} 攻击 ${this.selectedTarget.name}！`);
                this.addLog(`造成 ${damage} 点伤害！`);
                
                if (skill.effect && skill.effect.poison) {
                    this.selectedTarget.poisoned = true;
                    this.selectedTarget.poisonTurns = skill.effect.poison;
                    this.addLog(`${this.selectedTarget.name} 中毒了！`);
                }
                
                if (skill.effect && skill.effect.attackBoost) {
                    this.selectedTarget.attackBoost = skill.effect.attackBoost;
                    this.addLog(`${this.selectedTarget.name} 的攻击力上升了！`);
                }
            } else {
                this.addLog(`${player.name} 的攻击落空了！`);
            }
        } else if (action.type === 'item') {
            const item = action.item;
            
            if (item.effect && item.effect.hp) {
                const healed = Math.min(item.effect.hp, this.selectedTarget.maxHp - this.selectedTarget.hp);
                this.selectedTarget.hp += healed;
                this.addLog(`${player.name} 对 ${this.selectedTarget.name} 使用了 ${item.name}！`);
                this.addLog(`恢复了 ${healed} 点HP！`);
            }
            
            const itemIndex = this.game.playerData.inventory.findIndex(i => i.itemId === action.itemId);
            if (itemIndex !== -1) {
                this.game.playerData.inventory[itemIndex].quantity--;
                if (this.game.playerData.inventory[itemIndex].quantity <= 0) {
                    this.game.playerData.inventory.splice(itemIndex, 1);
                }
            }
        }
        
        if (this.selectedTarget.hp <= 0) {
            this.selectedTarget.hp = 0;
            this.selectedTarget.alive = false;
            this.addLog(`${this.selectedTarget.name} 被击败了！`);
        }
        
        this.checkBattleEnd();
    }

    calculateDamage(attacker, defender, skill) {
        const baseDamage = attacker.attack * attacker.attackBoost * skill.damage;
        const defense = defender.defense * 0.5;
        let damage = Math.max(1, Math.floor(baseDamage - defense));
        
        const isCritical = Math.random() < GAME_DATA.BATTLE_CONFIG.criticalHitChance;
        if (isCritical) {
            damage = Math.floor(damage * GAME_DATA.BATTLE_CONFIG.criticalHitMultiplier);
            this.addLog('会心一击！');
        }
        
        return damage;
    }

    attemptEscape() {
        this.escapeAttempts++;
        const player = this.playerParty[0];
        const avgEnemySpeed = this.enemyParty.reduce((sum, e) => sum + e.speed, 0) / this.enemyParty.length;
        
        const escapeChance = GAME_DATA.BATTLE_CONFIG.escapeBaseChance + 
                            (player.speed - avgEnemySpeed) * GAME_DATA.BATTLE_CONFIG.escapeSpeedFactor +
                            (this.escapeAttempts - 1) * 0.1;
        
        if (Math.random() < Math.min(0.9, Math.max(0.1, escapeChance))) {
            this.addLog('成功逃脱了！');
            setTimeout(() => {
                this.game.changeScene('world');
            }, 1000);
        } else {
            this.addLog('逃跑失败！');
            setTimeout(() => {
                this.executeEnemyTurn();
            }, 1000);
        }
    }

    executeEnemyTurn() {
        const aliveEnemies = this.enemyParty.filter(e => e.alive);
        const alivePlayers = this.playerParty.filter(p => p.alive);
        
        if (aliveEnemies.length === 0 || alivePlayers.length === 0) {
            this.checkBattleEnd();
            return;
        }
        
        let turnIndex = 0;
        const executeNextTurn = () => {
            if (turnIndex >= aliveEnemies.length) {
                this.endEnemyTurn();
                return;
            }
            
            const enemy = aliveEnemies[turnIndex];
            if (!enemy.alive) {
                turnIndex++;
                executeNextTurn();
                return;
            }
            
            if (enemy.poisoned && enemy.poisonTurns > 0) {
                const poisonDamage = Math.floor(enemy.maxHp * 0.1);
                enemy.hp -= poisonDamage;
                this.addLog(`${enemy.name} 受到了 ${poisonDamage} 点毒伤害！`);
                enemy.poisonTurns--;
                
                if (enemy.poisonTurns <= 0) {
                    enemy.poisoned = false;
                    this.addLog(`${enemy.name} 的中毒效果消失了！`);
                }
                
                if (enemy.hp <= 0) {
                    enemy.hp = 0;
                    enemy.alive = false;
                    this.addLog(`${enemy.name} 被毒死了！`);
                }
            }
            
            if (enemy.alive) {
                const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
                if (target && target.alive) {
                    const skillId = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
                    const skill = GAME_DATA.SKILLS[skillId];
                    
                    if (Math.random() < skill.accuracy / 100) {
                        const damage = Math.floor(enemy.attack * skill.damage - target.defense * 0.5);
                        target.hp -= Math.max(1, damage);
                        
                        this.addLog(`${enemy.name} 使用 ${skill.name} 攻击 ${target.name}！`);
                        this.addLog(`造成 ${Math.max(1, damage)} 点伤害！`);
                        
                        if (skill.effect && skill.effect.poison && Math.random() < 0.5) {
                            target.poisoned = true;
                            target.poisonTurns = skill.effect.poison;
                            this.addLog(`${target.name} 中毒了！`);
                        }
                        
                        if (target.hp <= 0) {
                            target.hp = 0;
                            target.alive = false;
                            this.addLog(`${target.name} 倒下了！`);
                        }
                    } else {
                        this.addLog(`${enemy.name} 的攻击落空了！`);
                    }
                }
            }
            
            if (this.checkBattleEnd()) return;
            
            turnIndex++;
            setTimeout(executeNextTurn, 800);
        };
        
        executeNextTurn();
    }

    endEnemyTurn() {
        const alivePlayers = this.playerParty.filter(p => p.alive);
        
        alivePlayers.forEach(player => {
            if (player.poisoned && player.poisonTurns > 0) {
                const poisonDamage = Math.floor(player.maxHp * 0.1);
                player.hp -= poisonDamage;
                this.addLog(`${player.name} 受到了 ${poisonDamage} 点毒伤害！`);
                player.poisonTurns--;
                
                if (player.poisonTurns <= 0) {
                    player.poisoned = false;
                }
                
                if (player.hp <= 0) {
                    player.hp = 0;
                    player.alive = false;
                }
            }
        });
        
        if (!this.checkBattleEnd()) {
            this.calculateTurnOrder();
            this.state = 'player_turn';
            this.showBattleMenu();
        }
    }

    checkBattleEnd() {
        const alivePlayers = this.playerParty.filter(p => p.alive);
        const aliveEnemies = this.enemyParty.filter(e => e.alive);
        
        if (alivePlayers.length === 0) {
            this.state = 'game_over';
            this.addLog('队伍全灭...');
            this.addLog('游戏结束');
            return true;
        }
        
        if (aliveEnemies.length === 0) {
            this.state = 'victory';
            this.calculateRewards();
            return true;
        }
        
        return false;
    }

    calculateRewards() {
        let totalExp = 0;
        let totalGold = 0;
        const drops = [];
        
        this.enemyParty.forEach(enemy => {
            totalExp += enemy.exp;
            totalGold += enemy.gold;
            
            enemy.drops.forEach(dropId => {
                if (Math.random() < 0.3) {
                    drops.push(dropId);
                }
            });
        });
        
        this.game.playerData.exp += totalExp;
        this.game.playerData.gold += totalGold;
        
        drops.forEach(dropId => {
            const existingItem = this.game.playerData.inventory.find(i => i.itemId === dropId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.game.playerData.inventory.push({ itemId: dropId, quantity: 1 });
            }
        });
        
        this.addLog(`战斗胜利！`);
        this.addLog(`获得 ${totalExp} 经验值！`);
        this.addLog(`获得 ${totalGold} 金币！`);
        
        if (drops.length > 0) {
            this.addLog(`获得物品：${drops.map(d => GAME_DATA.ITEMS[d].name).join(', ')}`);
        }
        
        this.levelUpCheck();
    }

    levelUpCheck() {
        while (this.game.playerData.exp >= this.game.playerData.expToNext) {
            this.game.playerData.exp -= this.game.playerData.expToNext;
            this.game.playerData.level++;
            this.game.playerData.expToNext = Math.floor(this.game.playerData.expToNext * 1.5);
            
            this.game.playerData.maxHp += 10;
            this.game.playerData.maxMp += 5;
            this.game.playerData.attack += 3;
            this.game.playerData.defense += 2;
            this.game.playerData.speed += 1;
            
            this.game.playerData.hp = this.game.playerData.maxHp;
            this.game.playerData.mp = this.game.playerData.maxMp;
            
            this.addLog(`升级了！现在是 ${this.game.playerData.level} 级！`);
        }
        
        this.game.playerData.hp = this.playerParty[0].hp;
        this.game.playerData.mp = this.playerParty[0].mp;
        
        setTimeout(() => {
            this.game.changeScene('world');
        }, 2000);
    }

    addLog(message) {
        this.battleLog.push(message);
        if (this.battleLog.length > 50) {
            this.battleLog.shift();
        }
    }

    render(ctx) {
        ctx.fillStyle = '#1A252F';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        this.renderBattlefield(ctx);
        this.renderEnemyParty(ctx);
        this.renderPlayerParty(ctx);
        this.renderBattleUI(ctx);
        this.renderBattleLog(ctx);
        
        if (this.state === 'menu') {
            this.renderMenu(ctx);
        } else if (this.state === 'skill_menu') {
            this.renderSkillMenu(ctx);
        } else if (this.state === 'item_menu') {
            this.renderItemMenu(ctx);
        } else if (this.state === 'select_target') {
            this.renderTargetSelection(ctx);
        } else if (this.state === 'intro') {
            this.renderIntro(ctx);
        }
    }

    renderBattlefield(ctx) {
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 20; x++) {
                const isGround = (x + y) % 3 === 0;
                ctx.fillStyle = isGround ? '#3D5A45' : '#2C4535';
                ctx.fillRect(x * 16, y * 16, 16, 16);
            }
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, this.game.width, 24);
        ctx.fillRect(0, this.game.height - 80, this.game.width, 80);
    }

    renderEnemyParty(ctx) {
        this.enemyParty.forEach((enemy, index) => {
            if (!enemy.alive) {
                ctx.globalAlpha = 0.3;
            }
            
            const x = enemy.position.x;
            const y = enemy.position.y;
            
            ctx.fillStyle = enemy.boss ? '#C0392B' : '#8E44AD';
            ctx.fillRect(x, y, 24, 24);
            
            ctx.fillStyle = enemy.boss ? '#E74C3C' : '#9B59B6';
            ctx.fillRect(x + 4, y + 4, 16, 16);
            
            ctx.fillStyle = '#F1C40F';
            ctx.fillRect(x + 6, y + 8, 4, 4);
            ctx.fillRect(x + 14, y + 8, 4, 4);
            
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 7, y + 16, 10, 3);
            
            if (enemy.boss) {
                ctx.fillStyle = '#F39C12';
                ctx.font = '8px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText('BOSS', x + 12, y - 5);
            }
            
            ctx.globalAlpha = 1.0;
            
            const hpPercent = enemy.hp / enemy.maxHp;
            ctx.fillStyle = '#333';
            ctx.fillRect(x, y + 26, 24, 4);
            ctx.fillStyle = hpPercent > 0.5 ? '#27AE60' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
            ctx.fillRect(x, y + 26, 24 * hpPercent, 4);
            
            ctx.fillStyle = '#FFF';
            ctx.font = '8px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(`${enemy.hp}/${enemy.maxHp}`, x + 12, y + 36);
        });
    }

    renderPlayerParty(ctx) {
        const player = this.playerParty[0];
        if (!player) return;
        
        if (!player.alive) {
            ctx.globalAlpha = 0.3;
        }
        
        const x = player.position.x;
        const y = player.position.y;
        
        this.renderPixelCharacter(ctx, x, y, '#3498DB', true, 'down', 0);
        
        ctx.globalAlpha = 1.0;
        
        const hpPercent = player.hp / player.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y + 20, 24, 6);
        ctx.fillStyle = hpPercent > 0.5 ? '#27AE60' : hpPercent > 0.25 ? '#F39C12' : '#E74C3C';
        ctx.fillRect(x, y + 20, 24 * hpPercent, 6);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(x, y + 28, 24, 4);
        ctx.fillStyle = '#3498DB';
        ctx.fillRect(x, y + 28, 24 * (player.mp / player.maxMp), 4);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '8px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`HP:${player.hp}/${player.maxHp}`, x, y + 38);
        ctx.fillText(`MP:${player.mp}/${player.maxMp}`, x, y + 46);
        ctx.fillText(`LV:${player.level}`, x, y + 54);
    }

    renderPixelCharacter(ctx, x, y, mainColor, isPlayer, direction = 'down', frame = 0) {
        const bodyColor = mainColor;
        const darkColor = this.darkenColor(mainColor, 30);
        const skinColor = '#FFD5AA';
        
        const bob = frame % 2 === 0 ? 0 : -1;
        
        ctx.fillStyle = bodyColor;
        ctx.fillRect(x + 2, y + 6 + bob, 20, 12);
        ctx.fillRect(x + 4, y + 4 + bob, 16, 4);
        
        ctx.fillStyle = darkColor;
        ctx.fillRect(x + 2, y + 14 + bob, 20, 4);
        
        ctx.fillStyle = skinColor;
        ctx.fillRect(x + 6, y + bob, 12, 8);
        
        ctx.fillStyle = isPlayer ? '#8B4513' : '#4A4A4A';
        ctx.fillRect(x + 4, y - 2 + bob, 16, 4);
        
        ctx.fillStyle = '#000';
        if (direction === 'left') {
            ctx.fillRect(x + 6, y + 2 + bob, 3, 3);
            ctx.fillRect(x + 11, y + 2 + bob, 3, 3);
        } else if (direction === 'right') {
            ctx.fillRect(x + 8, y + 2 + bob, 3, 3);
            ctx.fillRect(x + 13, y + 2 + bob, 3, 3);
        } else {
            ctx.fillRect(x + 7, y + 2 + bob, 3, 3);
            ctx.fillRect(x + 13, y + 2 + bob, 3, 3);
        }
    }

    darkenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }

    renderBattleUI(ctx) {
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(0, 0, this.game.width, 20);
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️ 战斗', this.game.width / 2, 14);
    }

    renderBattleLog(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, this.game.height - 60, this.game.width, 60);
        
        ctx.fillStyle = '#ECF0F1';
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        
        const startIndex = Math.max(0, this.battleLog.length - 4);
        for (let i = 0; i < 4 && startIndex + i < this.battleLog.length; i++) {
            ctx.fillText(this.battleLog[startIndex + i], 10, this.game.height - 45 + i * 14);
        }
    }

    renderIntro(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        ctx.fillStyle = '#E74C3C';
        ctx.font = '20px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('⚔️ 遭遇战斗！', this.game.width / 2, this.game.height / 2 - 10);
        
        ctx.fillStyle = '#FFF';
        ctx.font = '12px Courier New';
        const enemyNames = this.enemyParty.map(e => e.name).join(', ');
        ctx.fillText(`敌人：${enemyNames}`, this.game.width / 2, this.game.height / 2 + 20);
    }

    renderMenu(ctx) {
        const menuItems = ['攻击', '技能', '道具', '逃跑'];
        const menuWidth = 100;
        const menuHeight = 80;
        const x = this.game.width - menuWidth - 10;
        const y = this.game.height - menuHeight - 90;
        
        ctx.fillStyle = 'rgba(44, 62, 80, 0.95)';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, menuWidth, menuHeight);
        
        ctx.font = '12px Courier New';
        ctx.textAlign = 'left';
        
        menuItems.forEach((item, index) => {
            const itemY = y + 20 + index * 18;
            ctx.fillStyle = '#ECF0F1';
            ctx.fillText(`${index + 1}. ${item}`, x + 10, itemY);
        });
        
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '10px Courier New';
        ctx.fillText('按1-4选择', x + 10, y + menuHeight - 8);
    }

    renderSkillMenu(ctx) {
        const player = this.playerParty[0];
        if (!player) return;
        
        const skills = player.skills.map(skillId => GAME_DATA.SKILLS[skillId]);
        const menuWidth = 140;
        const menuHeight = Math.min(100, 20 + skills.length * 18);
        const x = this.game.width - menuWidth - 10;
        const y = this.game.height - menuHeight - 90;
        
        ctx.fillStyle = 'rgba(44, 62, 80, 0.95)';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#3498DB';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, menuWidth, menuHeight);
        
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        
        skills.forEach((skill, index) => {
            const itemY = y + 18 + index * 16;
            const canUse = player.mp >= skill.mpCost;
            
            ctx.fillStyle = canUse ? '#ECF0F1' : '#7F8C8D';
            ctx.fillText(`${index + 1}. ${skill.name}`, x + 10, itemY);
            ctx.fillText(`MP:${skill.mpCost}`, x + 80, itemY);
        });
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '8px Courier New';
        ctx.fillText('按1-' + skills.length + '选择，0返回', x + 10, y + menuHeight - 5);
    }

    renderItemMenu(ctx) {
        const items = this.game.playerData.inventory.filter(i => i.quantity > 0);
        const menuWidth = 140;
        const menuHeight = Math.min(100, 20 + items.length * 16 + 20);
        const x = this.game.width - menuWidth - 10;
        const y = this.game.height - menuHeight - 90;
        
        ctx.fillStyle = 'rgba(44, 62, 80, 0.95)';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#27AE60';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, menuWidth, menuHeight);
        
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        
        if (items.length === 0) {
            ctx.fillStyle = '#7F8C8D';
            ctx.fillText('没有道具', x + 10, y + 20);
        } else {
            items.forEach((inv, index) => {
                const item = GAME_DATA.ITEMS[inv.itemId];
                const itemY = y + 18 + index * 16;
                
                ctx.fillStyle = '#ECF0F1';
                ctx.fillText(`${index + 1}. ${item.name}`, x + 10, itemY);
                ctx.fillText(`x${inv.quantity}`, x + 90, itemY);
            });
        }
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '8px Courier New';
        ctx.fillText('按1-' + Math.max(1, items.length) + '选择，0返回', x + 10, y + menuHeight - 5);
    }

    renderTargetSelection(ctx) {
        const targets = this.targetMode === 'enemy' ? this.enemyParty : this.playerParty;
        
        ctx.fillStyle = '#F39C12';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('选择目标:', this.game.width / 2, this.game.height - 85);
        
        const menuWidth = 80;
        const menuHeight = 20 + targets.filter(t => t.alive).length * 16;
        const x = 60;
        const y = this.game.height - menuHeight - 70;
        
        ctx.fillStyle = 'rgba(44, 62, 80, 0.95)';
        ctx.fillRect(x, y, menuWidth, menuHeight);
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, menuWidth, menuHeight);
        
        ctx.font = '10px Courier New';
        ctx.textAlign = 'left';
        
        let index = 0;
        targets.forEach((target, i) => {
            if (!target.alive) return;
            const itemY = y + 18 + index * 16;
            ctx.fillStyle = '#ECF0F1';
            ctx.fillText(`${index + 1}. ${target.name}`, x + 10, itemY);
            ctx.fillText(`HP:${target.hp}/${target.maxHp}`, x + 10, itemY + 10);
            index++;
        });
        
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '8px Courier New';
        ctx.fillText('按1-' + index + '选择，0返回', x + 10, y + menuHeight - 5);
    }

    handleInput(key) {
        if (this.state === 'menu') {
            if (key >= '1' && key <= '4') {
                const actions = ['attack', 'skill', 'item', 'escape'];
                const action = actions[parseInt(key) - 1];
                if (action) this.selectAction(action);
            }
        } else if (this.state === 'skill_menu') {
            const player = this.playerParty[0];
            if (key >= '1' && key <= '9') {
                const skillIndex = parseInt(key) - 1;
                if (skillIndex < player.skills.length) {
                    this.selectSkill(player.skills[skillIndex]);
                }
            } else if (key === '0') {
                this.state = 'menu';
            }
        } else if (this.state === 'item_menu') {
            const items = this.game.playerData.inventory.filter(i => i.quantity > 0);
            if (key >= '1' && key <= '9') {
                const itemIndex = parseInt(key) - 1;
                if (itemIndex < items.length) {
                    this.selectItem(items[itemIndex].itemId);
                }
            } else if (key === '0') {
                this.state = 'menu';
            }
        } else if (this.state === 'select_target') {
            const targets = (this.targetMode === 'enemy' ? this.enemyParty : this.playerParty).filter(t => t.alive);
            if (key >= '1' && key <= '9') {
                const targetIndex = parseInt(key) - 1;
                if (targetIndex < targets.length) {
                    const realIndex = (this.targetMode === 'enemy' ? this.enemyParty : this.playerParty).indexOf(targets[targetIndex]);
                    this.selectTarget(realIndex);
                }
            } else if (key === '0') {
                this.state = 'menu';
            }
        } else if (this.state === 'player_turn') {
            this.showBattleMenu();
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BattleSystem;
}
