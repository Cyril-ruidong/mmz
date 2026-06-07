import type { Bounty, Character, Enemy, Tank, Weapon } from '@/types/game'

// 武器目录
export const WEAPONS: Record<string, Weapon> = {
  // 主炮
  cannon: { id: 'cannon', name: '加农炮', kind: 'main', attack: 30, weight: 8 },
  blaster: { id: 'blaster', name: '光束炮', kind: 'main', attack: 55, weight: 14 },
  // 副炮
  mg: { id: 'mg', name: '机关炮', kind: 'sub', attack: 18, ammo: 99, maxAmmo: 99, weight: 4 },
  laser: { id: 'laser', name: '激光炮', kind: 'sub', attack: 32, ammo: 30, maxAmmo: 30, weight: 6 },
  // SE 武器
  s1: { id: 's1', name: '烈焰火', kind: 'se', attack: 60, ammo: 5, maxAmmo: 5, weight: 10 },
  s2: { id: 's2', name: '穿甲弹', kind: 'se', attack: 80, ammo: 3, maxAmmo: 3, weight: 12 },
}

// 初始战车：红狼号
export function makeRedWolf(): Tank {
  return {
    id: 'redwolf',
    name: '红狼号',
    cHp: 200,
    cMaxHp: 200,
    engine: 40,
    chassis: 50,
    weight: 50,
    load: 0,
    mainWeapon: { ...WEAPONS.cannon },
    subWeapon: { ...WEAPONS.mg },
  }
}

// 初始队伍
export function makeInitialParty(): Character[] {
  return [
    { id: 'hero', name: '明奇', job: 'warrior', level: 1, exp: 0, hp: 60, maxHp: 60, attack: 18, defense: 12, isTank: true },
    { id: 'nina', name: '妮娜', job: 'ranger', level: 1, exp: 0, hp: 45, maxHp: 45, attack: 14, defense: 9, isTank: true },
    { id: 'mech', name: '机械师', job: 'mechanic', level: 1, exp: 0, hp: 50, maxHp: 50, attack: 12, defense: 14, isTank: true },
  ]
}

// 赏金首列表
export const BOUNTIES: Bounty[] = [
  { id: 'b1', name: '马歇尔上士', reward: 1000, hp: 120, attack: 22, defense: 18, completed: false, sprite: 0 },
  { id: 'b2', name: '戈麦斯', reward: 5000, hp: 220, attack: 32, defense: 24, completed: false, sprite: 1 },
  { id: 'b3', name: '帕鲁', reward: 8000, hp: 280, attack: 40, defense: 28, completed: false, sprite: 2 },
  { id: 'b4', name: '水怪', reward: 15000, hp: 380, attack: 48, defense: 30, completed: false, sprite: 3 },
  { id: 'b5', name: '迪亚波', reward: 20000, hp: 450, attack: 56, defense: 36, completed: false, sprite: 4 },
  { id: 'b6', name: '诺亚祖鲁', reward: 30000, hp: 600, attack: 70, defense: 45, completed: false, sprite: 5 },
]

// 普通敌人列表
const NORMAL_ENEMIES: Omit<Enemy, 'maxHp'>[] = [
  { id: 'e1', name: '沙蝎', hp: 30, attack: 12, defense: 8, isBoss: false, isTank: false, sprite: 0 },
  { id: 'e2', name: '废土狗', hp: 25, attack: 10, defense: 6, isBoss: false, isTank: false, sprite: 1 },
  { id: 'e3', name: '机械兵', hp: 60, attack: 18, defense: 14, isBoss: false, isTank: true, sprite: 2 },
  { id: 'e4', name: '土匪', hp: 50, attack: 16, defense: 10, isBoss: false, isTank: false, sprite: 3 },
  { id: 'e5', name: '导弹塔', hp: 80, attack: 22, defense: 16, isBoss: false, isTank: true, sprite: 4 },
]

export function makeRandomEncounter(party: Character[], tank: Tank): Enemy[] {
  // 根据队伍平均等级生成敌人
  const avgLevel = party.reduce((s, c) => s + c.level, 0) / party.length
  const isTankMode = party[0]?.isTank
  const enemyCount = 1 + Math.floor(Math.random() * 3) // 1-3 个敌人

  const enemies: Enemy[] = []
  for (let i = 0; i < enemyCount; i++) {
    const tpl = NORMAL_ENEMIES[Math.floor(Math.random() * NORMAL_ENEMIES.length)]
    // 战车模式下敌人也倾向战车
    const isTankEnemy = isTankMode ? Math.random() < 0.6 : tpl.isTank
    const scale = 0.7 + avgLevel * 0.25 + Math.random() * 0.3
    const hp = Math.floor(tpl.hp * scale * (isTankEnemy ? 1.4 : 1))
    enemies.push({ ...tpl, hp, maxHp: hp, isTank: isTankEnemy })
  }
  return enemies
}

// 赏金首战斗初始化
export function makeBountyEnemy(b: Bounty): Enemy {
  return {
    id: b.id,
    name: b.name,
    hp: b.hp,
    maxHp: b.hp,
    attack: b.attack,
    defense: b.defense,
    isBoss: true,
    isTank: Math.random() < 0.5,
    sprite: b.sprite,
  }
}
