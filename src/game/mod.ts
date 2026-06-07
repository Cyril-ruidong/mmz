// 战车改装系统逻辑
import type { Tank, Weapon } from '@/types/game'
import { WEAPONS } from './data'

export interface ModSlot {
  kind: 'engine' | 'main' | 'sub' | 'se' | 'chassis'
  weapon?: Weapon
  level: number
}

export function calculateLoad(tank: Tank): number {
  let load = 0
  if (tank.mainWeapon) load += tank.mainWeapon.weight
  if (tank.subWeapon) load += tank.subWeapon.weight
  if (tank.seWeapon) load += tank.seWeapon.weight
  return load
}

export function canEquip(tank: Tank, w: Weapon): boolean {
  return calculateLoad(tank) - (tank.mainWeapon?.weight || 0) - (tank.subWeapon?.weight || 0) - (tank.seWeapon?.weight || 0) + w.weight <= tank.chassis
}

export function installWeapon(tank: Tank, w: Weapon): Tank {
  const next: Tank = { ...tank }
  if (w.kind === 'main') next.mainWeapon = { ...w }
  else if (w.kind === 'sub') next.subWeapon = { ...w }
  else if (w.kind === 'se') next.seWeapon = { ...w }
  return next
}

export function uninstallWeapon(tank: Tank, kind: 'main' | 'sub' | 'se'): Tank {
  const next: Tank = { ...tank }
  if (kind === 'main') next.mainWeapon = undefined
  else if (kind === 'sub') next.subWeapon = undefined
  else if (kind === 'se') next.seWeapon = undefined
  return next
}

export function upgradeEngine(tank: Tank, level: number): Tank {
  return { ...tank, engine: Math.max(0, Math.min(255, level)) }
}

export function upgradeChassis(tank: Tank, level: number): Tank {
  return { ...tank, chassis: Math.max(0, Math.min(255, level)) }
}

// 穿墙秘籍 - 标记 0xB0 字节
export function hasWallHack(): boolean {
  return localStorage.getItem('mmz-wallhack') === '1'
}

export function toggleWallHack(): boolean {
  const next = !hasWallHack()
  localStorage.setItem('mmz-wallhack', next ? '1' : '0')
  return next
}

// 可购买武器列表
export const SHOP_WEAPONS = [
  WEAPONS.cannon,
  WEAPONS.blaster,
  WEAPONS.mg,
  WEAPONS.laser,
  WEAPONS.s1,
  WEAPONS.s2,
]
