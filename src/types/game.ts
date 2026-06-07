// 核心游戏类型定义

export type Job = 'warrior' | 'ranger' | 'mechanic'

export type Direction = 'up' | 'down' | 'left' | 'right'

export type SceneKind =
  | 'title'
  | 'world'
  | 'town'
  | 'house'
  | 'battle'
  | 'menu'
  | 'mod'
  | 'shop'
  | 'inn'
  | 'bounty'
  | 'dialog'
  | 'gameover'

export interface Character {
  id: string
  name: string
  job: Job
  level: number
  exp: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  isTank: boolean // 是否在战车中
}

export type WeaponKind = 'main' | 'sub' | 'se'

export interface Weapon {
  id: string
  name: string
  kind: WeaponKind
  attack: number
  ammo?: number // 弹药，无穷时为 undefined
  maxAmmo?: number
  weight: number
}

export interface Tank {
  id: string
  name: string
  cHp: number
  cMaxHp: number
  engine: number
  chassis: number
  weight: number
  load: number
  mainWeapon?: Weapon
  subWeapon?: Weapon
  seWeapon?: Weapon
}

export interface Bounty {
  id: string
  name: string
  reward: number
  hp: number
  attack: number
  defense: number
  completed: boolean
  sprite: number
}

export interface Enemy {
  id: string
  name: string
  hp: number
  maxHp: number
  attack: number
  defense: number
  isBoss: boolean
  isTank: boolean
  sprite: number
}

export interface Inventory {
  gold: number
  items: { id: string; name: string; count: number }[]
  bullets: number // 子弹
}

export interface DialogLine {
  text: string
  speaker?: string
  onDone?: () => void
}

export interface BattleState {
  enemies: Enemy[]
  turn: number // 0 = 玩家，1 = 敌人
  selected: number
  menuIndex: number
  message: string
  log: string[]
  animFrame: number
  phase: 'select' | 'action' | 'anim' | 'result'
  result?: 'win' | 'lose' | 'escape'
  reward?: { gold: number; exp: number }
  attacked: boolean
}
