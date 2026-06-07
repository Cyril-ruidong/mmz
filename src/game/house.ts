// 主角家内部 - 第一幕起始场景
// 16x16 内部地图
// Tile 编码: 0=地板 1=墙 2=床 3=桌子 4=门 5=地毯 6=窗 7=椅子 8=灯

export type HouseTile = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const HOUSE_W = 16
export const HOUSE_H = 16

// 主角家内部布局：
//   顶部墙 + 窗 / 床 / 桌 / 椅 / 父亲 NPC / 底部门
export function buildHouseInterior(): HouseTile[][] {
  const map: HouseTile[][] = []
  for (let y = 0; y < HOUSE_H; y++) {
    const row: HouseTile[] = []
    for (let x = 0; x < HOUSE_W; x++) {
      // 上下墙
      if (y === 0) {
        row.push(1)
        continue
      }
      // 上下外墙 - 第二行也作为墙 + 窗
      if (y === 1) {
        if (x === 4 || x === 5 || x === 10 || x === 11) {
          row.push(6) // 窗
          continue
        }
        row.push(1)
        continue
      }
      // 左右墙
      if (x === 0 || x === HOUSE_W - 1) {
        row.push(1)
        continue
      }
      // 底部墙 + 门
      if (y === HOUSE_H - 1) {
        if (x === 7 || x === 8) {
          row.push(4) // 门
        } else {
          row.push(1)
        }
        continue
      }
      // 内部 - 床 (左上)
      if (x >= 2 && x <= 4 && y >= 3 && y <= 5) {
        row.push(2) // 床
        continue
      }
      // 桌子 (右上)
      if (x >= 10 && x <= 12 && y >= 3 && y <= 4) {
        row.push(3) // 桌子
        continue
      }
      // 椅子 (桌子旁)
      if (x === 11 && y === 5) {
        row.push(7) // 椅子
        continue
      }
      // 灯 (右上)
      if (x === 13 && y === 2) {
        row.push(8) // 灯
        continue
      }
      // 地毯 (中央)
      if (x >= 3 && x <= 12 && y >= 8 && y <= 11) {
        row.push(5) // 地毯
        continue
      }
      // 默认地板
      row.push(0)
    }
    map.push(row)
  }
  return map
}

// 是否可通行
export function isHouseWalkable(t: HouseTile): boolean {
  return t === 0 || t === 5 || t === 7 // 地板、地毯、椅子（可踩）
}

// 父亲 NPC 位置
export const FATHER_POS = { x: 4, y: 8, dir: 'right' as const }

// 玩家初始位置
export const PLAYER_START = { x: 8, y: 13, dir: 'down' as const }

// 床位置（醒来点）
export const BED_POS = { x: 3, y: 4 }

// 门的出口位置
export const DOOR_POS = { x: 7, y: 15 }

// 检查该位置是否是 NPC
export function getNpcAt(x: number, y: number) {
  if (x === FATHER_POS.x && y === FATHER_POS.y) {
    return { id: 'father', name: '父亲', ...FATHER_POS }
  }
  return null
}
