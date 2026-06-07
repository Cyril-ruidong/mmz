// 世界地图生成 - 64x64 tile 地图
// 0=草 1=沙 2=岩石 3=水 4=道路 5=树 6=城镇入口 7=洞穴 8=山

export type Tile = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const W = 64
const H = 64

// 简单确定性噪声
function noise(x: number, y: number, seed: number): number {
  const v = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453
  return v - Math.floor(v)
}

function smooth(x: number, y: number, seed: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const tl = noise(xi, yi, seed)
  const tr = noise(xi + 1, yi, seed)
  const bl = noise(xi, yi + 1, seed)
  const br = noise(xi + 1, yi + 1, seed)
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return tl * (1 - u) * (1 - v) + tr * u * (1 - v) + bl * (1 - u) * v + br * u * v
}

export function generateWorld(): Tile[][] {
  const map: Tile[][] = []
  // 拉多镇区域 (28,28) - (32,32) 城镇
  for (let y = 0; y < H; y++) {
    const row: Tile[] = []
    for (let x = 0; x < W; x++) {
      // 城镇
      if (x >= 28 && x <= 32 && y >= 28 && y <= 32) {
        row.push(6)
        continue
      }
      // 道路
      if (x === 30 || y === 30) {
        if (x < 28 || x > 32 || y < 28 || y > 32) row.push(4)
        else row.push(6)
        continue
      }
      // 河流
      if (y === 16 && (x < 28 || x > 32)) {
        row.push(3)
        continue
      }
      // 洞穴
      if (x === 50 && y === 20) {
        row.push(7)
        continue
      }
      // 山脉
      if (x >= 48 && y <= 14) {
        row.push(8)
        continue
      }
      // 基础地形
      const n = smooth(x / 8, y / 8, 1)
      if (n < 0.35) row.push(0) // 草
      else if (n < 0.55) row.push(1) // 沙
      else if (n < 0.7) row.push(5) // 树
      else row.push(2) // 岩石
    }
    map.push(row)
  }
  return map
}

export function isWalkable(t: Tile, inTank: boolean): boolean {
  if (inTank) {
    // 战车可以穿过树和水（穿墙秘籍边界），不能穿山
    return t !== 8
  }
  // 步行
  return t !== 3 && t !== 8 && t !== 5 && t !== 7
}

export function isTown(t: Tile): boolean {
  return t === 6
}

export const WORLD_SIZE = { w: W, h: H }

// 拉多镇地图 16x16
export function generateTown(): Tile[][] {
  const map: Tile[][] = []
  for (let y = 0; y < 16; y++) {
    const row: Tile[] = []
    for (let x = 0; x < 16; x++) {
      // 边界 = 建筑
      if (x === 0 || y === 0 || x === 15 || y === 15) {
        row.push(2)
        continue
      }
      // 道路十字
      if (x === 7 || x === 8 || y === 7 || y === 8) {
        row.push(4)
        continue
      }
      // 建筑
      if ((x === 2 || x === 3) && (y === 2 || y === 3)) {
        row.push(8) // 山(表示建筑)
        continue
      }
      if ((x === 12 || x === 13) && (y === 2 || y === 3)) {
        row.push(8)
        continue
      }
      if ((x === 2 || x === 3) && (y === 12 || y === 13)) {
        row.push(8)
        continue
      }
      if ((x === 12 || x === 13) && (y === 12 || y === 13)) {
        row.push(8)
        continue
      }
      // 草地
      row.push(0)
    }
    map.push(row)
  }
  return map
}

// 城镇建筑位置
export const TOWN_BUILDINGS: Record<string, { x: number; y: number; name: string; scene: 'house' | 'bounty' | 'shop' | 'mod' | 'inn' }> = {
  inn: { x: 2, y: 2, name: '旅馆', scene: 'house' }, // 左上
  bounty: { x: 12, y: 2, name: '赏金事务所', scene: 'bounty' }, // 右上
  shop: { x: 2, y: 12, name: '商店', scene: 'shop' }, // 左下
  mod: { x: 12, y: 12, name: '改装车间', scene: 'mod' }, // 右下
}

export function getTownBuildingAt(x: number, y: number) {
  for (const b of Object.values(TOWN_BUILDINGS)) {
    if (b.x === x && b.y === y) return b
  }
  return null
}
