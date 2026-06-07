// 主游戏 Canvas 渲染器
// 渲染：世界地图、拉多镇、战斗、标题、家中等所有游戏画面
import { drawSprite, drawText, drawBox, SPRITES, textWidth, PALETTE } from './sprites'
import { generateWorld, generateTown, getTownBuildingAt, isTown, isWalkable, WORLD_SIZE, TOWN_BUILDINGS } from './world'
import { buildHouseInterior, HOUSE_W, HOUSE_H, isHouseWalkable, getNpcAt, FATHER_POS, PLAYER_START, DOOR_POS, type HouseTile } from './house'
import type { Character, Direction, Enemy, Tank, Weapon } from '@/types/game'
import { calculateLoad } from './mod'

const TILE = 16 // 16x16 tile
const VIEW_W = 16
const VIEW_H = 14

export interface RenderState {
  scene: string
  party: Character[]
  tank: Tank
  worldX: number
  worldY: number
  worldDir: Direction
  townX: number
  townY: number
  townDir: Direction
  houseX: number
  houseY: number
  houseDir: Direction
  // 战斗
  battle: {
    enemies: Enemy[]
    turn: number
    selected: number
    menuIndex: number
    message: string
    animFrame: number
    phase: string
  } | null
  menuIndex: number // 战斗菜单选中项
  // 闪光
  flash: { x: number; y: number; color: string; t: number } | null
  // 动画帧
  animFrame: number
  // 消息
  message: string
  messageTime: number
  // 玩家姓名（用于标题）
  hud: {
    gold: number
    bullets: number
  }
  // 剧情
  story: {
    wokeUp: boolean
    talkedToFather: boolean
    receivedRedWolf: boolean
    leftHouseFirstTime: boolean
  }
  // 屋主父亲方向
  fatherDir?: Direction
}

const worldMap = generateWorld()
const townMap = generateTown()

export function renderGame(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  // 背景
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)

  if (s.scene === 'title') {
    renderTitle(ctx, s)
  } else if (s.scene === 'world') {
    renderWorld(ctx, s)
    renderHUD(ctx, s)
  } else if (s.scene === 'town') {
    renderTown(ctx, s)
    renderHUD(ctx, s)
  } else if (s.scene === 'house') {
    renderHouse(ctx, s)
    renderHUD(ctx, s)
  } else if (s.scene === 'battle') {
    renderBattle(ctx, s)
  } else if (s.scene === 'bounty') {
    renderInterior(ctx, s, '赏金事务所')
  } else if (s.scene === 'shop') {
    renderInterior(ctx, s, '商店')
  } else if (s.scene === 'mod') {
    renderInterior(ctx, s, '改装车间')
  } else if (s.scene === 'inn') {
    renderInterior(ctx, s, '旅馆')
  } else if (s.scene === 'gameover') {
    renderGameOver(ctx, s)
  }

  // 战斗伤害数字 / 消息
  if (s.message) {
    renderMessageBox(ctx, s.message)
  }
}

function renderMessageBox(ctx: CanvasRenderingContext2D, msg: string) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const boxH = 32
  drawBox(ctx, 8, h - boxH - 8, w - 16, boxH, '#1C3878', '#FCFCFC')
  drawText(ctx, msg, 14, h - boxH - 8 + 12, 2, '#FCFCFC', '#000000')
}

function renderTitle(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  // 渐变背景（沙漠落日）
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#3C1818')
  grad.addColorStop(0.5, '#A85C30')
  grad.addColorStop(1, '#C8A668')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // 远景山脉
  for (let i = 0; i < 5; i++) {
    const x = i * 60 - 30
    ctx.fillStyle = '#4C2810'
    ctx.beginPath()
    ctx.moveTo(x, h - 60)
    ctx.lineTo(x + 30, h - 100)
    ctx.lineTo(x + 60, h - 60)
    ctx.closePath()
    ctx.fill()
  }

  // 标题
  const t1 = '重装机兵'
  const t2 = 'METAL  MAX'
  drawText(ctx, t1, w / 2 - textWidth(t1, 4) / 2, 40, 4, '#E8C170', '#3C1818')
  drawText(ctx, t2, w / 2 - textWidth(t2, 2) / 2, 90, 2, '#FCFCFC', '#3C1818')
  drawText(ctx, 'HTML5  REMASTER', w / 2 - textWidth('HTML5  REMASTER', 1) / 2, 110, 1, '#FCFCFC')

  // 战车装饰
  drawSprite(ctx, SPRITES.redwolf.f, w / 2 - 80, h - 100, 4)
  drawSprite(ctx, SPRITES.redwolf.f, w / 2 + 16, h - 100, 4)

  // 菜单
  const items = ['开始游戏', '继续游戏', '赏金榜', '退出']
  for (let i = 0; i < items.length; i++) {
    const y = h - 60 + i * 18
    const sel = s.menuIndex === i
    if (sel) {
      drawText(ctx, '▶', w / 2 - 60, y, 2, '#E8C170', '#3C1818')
    }
    drawText(ctx, items[i], w / 2 - 40, y, 2, sel ? '#E8C170' : '#FCFCFC', '#3C1818')
  }

  // 闪烁提示
  if (Math.floor(s.animFrame / 30) % 2 === 0) {
    drawText(ctx, 'Z键 确认', w / 2 - textWidth('Z键 确认', 1) / 2, h - 8, 1, '#FCFCFC', '#3C1818')
  }
}

function renderGameOver(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, w, h)
  drawText(ctx, 'GAME  OVER', w / 2 - textWidth('GAME  OVER', 4) / 2, h / 2 - 20, 4, '#B8232C', '#3C1818')
  drawText(ctx, 'Z键 返回标题', w / 2 - textWidth('Z键 返回标题', 1) / 2, h / 2 + 30, 1, '#FCFCFC')
}

function renderWorld(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  // 摄像机居中
  const camX = s.worldX * TILE - w / 2 + TILE / 2
  const camY = s.worldY * TILE - h / 2 + TILE / 2

  for (let y = 0; y < VIEW_H + 1; y++) {
    for (let x = 0; x < VIEW_W + 1; x++) {
      const wx = Math.floor((camX + x * TILE) / TILE)
      const wy = Math.floor((camY + y * TILE) / TILE)
      if (wx < 0 || wy < 0 || wx >= WORLD_SIZE.w || wy >= WORLD_SIZE.h) continue
      const tile = worldMap[wy][wx]
      drawTile(ctx, tile, x * TILE - (camX % TILE), y * TILE - (camY % TILE))
    }
  }

  // 玩家
  const inTank = s.party[0]?.isTank
  const px = w / 2 - TILE / 2
  const py = h / 2 - TILE / 2
  const dir = s.worldDir
  if (inTank) {
    const sprite = dir === 'up' ? SPRITES.redwolf.b : SPRITES.redwolf.f
    drawSprite(ctx, sprite, px, py, 1)
  } else {
    const hero = s.party[0]
    if (hero) {
      const dirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
      drawSprite(ctx, (SPRITES.hero as any)[dirMap[dir]], px, py, 1)
    }
  }

  // 闪光
  if (s.flash) {
    ctx.fillStyle = s.flash.color
    ctx.globalAlpha = 0.5 * Math.max(0, 1 - s.flash.t / 20)
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1
  }
}

function drawTile(ctx: CanvasRenderingContext2D, t: number, x: number, y: number) {
  const s = TILE
  switch (t) {
    case 0: // 草
      ctx.fillStyle = '#5CAA48'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#387030'
      ctx.fillRect(x + 2, y + 4, 2, 2)
      ctx.fillRect(x + 8, y + 10, 2, 2)
      ctx.fillRect(x + 12, y + 6, 2, 2)
      break
    case 1: // 沙
      ctx.fillStyle = '#C8A668'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#E8C898'
      ctx.fillRect(x + 4, y + 4, 2, 2)
      ctx.fillRect(x + 10, y + 8, 2, 2)
      break
    case 2: // 岩石
      ctx.fillStyle = '#6B6B6B'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#3C3C3C'
      ctx.fillRect(x + 2, y + 4, 4, 6)
      ctx.fillRect(x + 8, y + 8, 6, 4)
      break
    case 3: // 水
      ctx.fillStyle = '#3858B8'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#1C3878'
      ctx.fillRect(x + 2, y + 8, 12, 1)
      ctx.fillRect(x + 4, y + 4, 8, 1)
      break
    case 4: // 路
      ctx.fillStyle = '#A85C30'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#7C4818'
      ctx.fillRect(x + 6, y + 2, 1, 12)
      ctx.fillRect(x + 10, y + 4, 1, 10)
      break
    case 5: // 树
      ctx.fillStyle = '#5CAA48'
      ctx.fillRect(x, y, s, s)
      ctx.fillRect(x + 4, y + 4, 8, 8)
      ctx.fillStyle = '#387030'
      ctx.fillRect(x + 4, y + 12, 2, 4)
      ctx.fillStyle = '#4C2810'
      ctx.fillRect(x + 7, y + 12, 2, 4)
      break
    case 6: // 城镇
      ctx.fillStyle = '#7C4818'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#4C2810'
      ctx.fillRect(x + 2, y + 2, 12, 12)
      ctx.fillStyle = '#E8C170'
      ctx.fillRect(x + 6, y + 6, 4, 8)
      break
    case 7: // 洞穴
      ctx.fillStyle = '#4C2810'
      ctx.fillRect(x, y, s, s)
      ctx.fillRect(x + 2, y + 4, 12, 12)
      ctx.fillStyle = '#000000'
      ctx.fillRect(x + 4, y + 8, 8, 8)
      break
    case 8: // 山
      ctx.fillStyle = '#3C3C3C'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#1C1C1C'
      ctx.fillRect(x + 2, y + 8, 12, 8)
      ctx.fillStyle = '#7C7C7C'
      ctx.fillRect(x + 6, y + 4, 4, 4)
      break
  }
  // 黑色网格
  // ctx.fillStyle = '#000000'
  // ctx.fillRect(x, y + s - 1, s, 1)
  // ctx.fillRect(x + s - 1, y, 1, s)
}

function renderTown(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const camX = s.townX * TILE - w / 2 + TILE / 2
  const camY = s.townY * TILE - h / 2 + TILE / 2

  for (let y = 0; y < VIEW_H + 1; y++) {
    for (let x = 0; x < VIEW_W + 1; x++) {
      const tx = Math.floor((camX + x * TILE) / TILE)
      const ty = Math.floor((camY + y * TILE) / TILE)
      if (tx < 0 || ty < 0 || tx >= 16 || ty >= 16) continue
      const tile = townMap[ty][tx]
      drawTile(ctx, tile === 8 ? 6 : tile, x * TILE - (camX % TILE), y * TILE - (camY % TILE))
    }
  }

  // 玩家
  const px = w / 2 - TILE / 2
  const py = h / 2 - TILE / 2
  const hero = s.party[0]
  if (hero) {
    const dirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
    drawSprite(ctx, (SPRITES.hero as any)[dirMap[s.townDir]], px, py, 1)
  }
}

// 主角家内部 - 第一幕场景
function renderHouse(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  const houseMap = buildHouseInterior()
  const camX = s.houseX * TILE - w / 2 + TILE / 2
  const camY = s.houseY * TILE - h / 2 + TILE / 2

  for (let y = 0; y < VIEW_H + 1; y++) {
    for (let x = 0; x < VIEW_W + 1; x++) {
      const tx = Math.floor((camX + x * TILE) / TILE)
      const ty = Math.floor((camY + y * TILE) / TILE)
      if (tx < 0 || ty < 0 || tx >= HOUSE_W || ty >= HOUSE_H) continue
      const tile = houseMap[ty][tx] as HouseTile
      drawHouseTile(ctx, tile, x * TILE - (camX % TILE), y * TILE - (camY % TILE))
    }
  }

  // 父亲 NPC (在 y=8 附近)
  if (FATHER_POS) {
    const fx = FATHER_POS.x * TILE - camX
    const fy = FATHER_POS.y * TILE - camY
    const fatherDir: Direction = s.fatherDir || FATHER_POS.dir
    const fdirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
    if (fx > -TILE && fy > -TILE && fx < w && fy < h) {
      drawSprite(ctx, (SPRITES.father as any)[fdirMap[fatherDir]], fx, fy, 1)
    }
  }

  // 玩家
  const px = w / 2 - TILE / 2
  const py = h / 2 - TILE / 2
  const dirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
  const hero = s.party[0]
  if (hero) {
    drawSprite(ctx, (SPRITES.hero as any)[dirMap[s.houseDir]], px, py, 1)
  }
}

function drawHouseTile(ctx: CanvasRenderingContext2D, t: HouseTile, x: number, y: number) {
  const s = TILE
  switch (t) {
    case 0: // 地板 - 木地板
      ctx.fillStyle = '#7C4818'
      ctx.fillRect(x, y, s, s)
      // 木纹
      ctx.fillStyle = '#5C2810'
      ctx.fillRect(x, y, s, 1)
      ctx.fillRect(x, y + 7, s, 1)
      ctx.fillStyle = '#4C2010'
      ctx.fillRect(x + 4, y + 2, 1, 5)
      ctx.fillRect(x + 12, y + 9, 1, 5)
      break
    case 1: // 墙 - 米黄色墙
      ctx.fillStyle = '#A87838'
      ctx.fillRect(x, y, s, s)
      // 墙纸纹理
      ctx.fillStyle = '#8C5C28'
      ctx.fillRect(x, y, s, 1)
      ctx.fillRect(x, y + 8, s, 1)
      ctx.fillRect(x + 4, y + 3, 1, 4)
      ctx.fillRect(x + 11, y + 3, 1, 4)
      break
    case 2: // 床 - 2x2 tile 大件
      // 此处只画床的一部分
      drawSprite(ctx, SPRITES.furniture.bed, x, y, 1)
      break
    case 3: // 桌子
      drawSprite(ctx, SPRITES.furniture.table, x, y, 1)
      break
    case 4: // 门
      drawSprite(ctx, SPRITES.furniture.door, x, y, 1)
      break
    case 5: // 地毯
      ctx.fillStyle = '#8C2818'
      ctx.fillRect(x, y, s, s)
      ctx.fillStyle = '#A82818'
      // 菱形花纹
      ctx.fillRect(x + 4, y + 4, 8, 1)
      ctx.fillRect(x + 3, y + 5, 10, 1)
      ctx.fillRect(x + 4, y + 6, 8, 1)
      ctx.fillStyle = '#FCFCFC'
      ctx.fillRect(x + 7, y + 7, 2, 2)
      break
    case 6: // 窗
      drawSprite(ctx, SPRITES.furniture.window, x, y, 1)
      break
    case 7: // 椅子
      drawSprite(ctx, SPRITES.furniture.chair, x, y, 1)
      break
    case 8: // 灯
      drawSprite(ctx, SPRITES.furniture.lamp, x, y, 1)
      // 灯光效果
      if (Math.floor((Date.now() / 200) % 2) === 0) {
        ctx.fillStyle = 'rgba(255, 220, 100, 0.15)'
        ctx.fillRect(x - 8, y - 4, s + 16, s + 8)
      }
      break
  }
  // 房间底部阴影
  if (t !== 4 && t !== 1) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    ctx.fillRect(x, y + s - 2, s, 2)
  }
}

// 标记 house 模块函数供 GameCanvas 调用
export { buildHouseInterior, HOUSE_W, HOUSE_H, isHouseWalkable, getNpcAt, FATHER_POS, PLAYER_START, DOOR_POS } from './house'

function renderInterior(ctx: CanvasRenderingContext2D, s: RenderState, name: string) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  // 内部 = 木地板
  ctx.fillStyle = '#4C2810'
  ctx.fillRect(0, 0, w, h)
  // 木纹
  for (let y = 0; y < h; y += 16) {
    for (let x = 0; x < w; x += 32) {
      ctx.fillStyle = '#3C1808'
      ctx.fillRect(x, y, 16, 1)
      ctx.fillRect(x + 16, y + 8, 16, 1)
    }
  }
  // 墙
  ctx.fillStyle = '#7C4818'
  ctx.fillRect(0, 0, w, 40)
  // 招牌
  drawBox(ctx, w / 2 - 80, 8, 160, 24, '#1C3878', '#FCFCFC')
  drawText(ctx, name, w / 2 - textWidth(name, 2) / 2, 16, 2, '#FCFCFC', '#000000')
  // 玩家
  const dirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
  const hero = s.party[0]
  if (hero) {
    drawSprite(ctx, (SPRITES.hero as any)['f'], w / 2 - 8, h - 60, 1)
  }
  // 提示
  if (Math.floor(s.animFrame / 30) % 2 === 0) {
    drawText(ctx, 'Z键 交互  X键 离开', w / 2 - textWidth('Z键 交互  X键 离开', 1) / 2, h - 16, 1, '#FCFCFC')
  }
}

function renderBattle(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  if (!s.battle) return
  // 战场背景（沙漠 + 天空）
  const grad = ctx.createLinearGradient(0, 0, 0, h / 2)
  grad.addColorStop(0, '#3C1818')
  grad.addColorStop(1, '#C8A668')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h / 2)
  // 地面
  ctx.fillStyle = '#A85C30'
  ctx.fillRect(0, h / 2, w, h / 2)
  ctx.fillStyle = '#7C4818'
  ctx.fillRect(0, h / 2 + 30, w, h / 2 - 30)

  // 敌人
  const b = s.battle
  const enemyCount = b.enemies.length
  const enemyW = 60
  const totalW = enemyCount * enemyW
  const startX = w / 2 - totalW / 2 + 20
  for (let i = 0; i < enemyCount; i++) {
    const e = b.enemies[i]
    const ex = startX + i * enemyW
    const ey = h / 2 - 80
    const sprite = e.isBoss ? SPRITES.bosses[Math.min(e.sprite, SPRITES.bosses.length - 1)] : SPRITES.enemies[e.sprite % SPRITES.enemies.length]
    drawSprite(ctx, sprite, ex, ey, 3)
    // HP 条
    const barX = ex
    const barY = ey + 64
    const barW = 48
    ctx.fillStyle = '#000000'
    ctx.fillRect(barX, barY, barW, 4)
    ctx.fillStyle = '#B8232C'
    ctx.fillRect(barX, barY, (e.hp / e.maxHp) * barW, 4)
    // 选中箭头
    if (b.selected === i && b.turn === 0) {
      drawText(ctx, '▼', ex + 20, ey - 10, 1, '#E8C170')
    }
    // 名称
    drawText(ctx, e.name, ex, ey - 18, 1, '#FCFCFC', '#000000')
  }

  // 战车或主角
  if (s.party[0]?.isTank) {
    drawSprite(ctx, SPRITES.redwolf.f, w / 2 - 80, h - 130, 5)
  } else {
    const dirMap: Record<Direction, string> = { down: 'f', up: 'b', left: 'l', right: 'r' }
    drawSprite(ctx, (SPRITES.hero as any)['f'], w / 2 - 80, h - 130, 5)
  }

  // 状态栏（顶部）
  drawBox(ctx, 0, 0, w, 20, '#1C3878', '#FCFCFC')
  // 队伍 HP
  let cx = 4
  s.party.forEach((p) => {
    drawText(ctx, p.name, cx, 4, 1, '#FCFCFC', '#000000')
    cx += textWidth(p.name, 1) + 4
    // HP
    const hpW = 40
    ctx.fillStyle = '#000000'
    ctx.fillRect(cx, 6, hpW, 6)
    ctx.fillStyle = p.hp > p.maxHp * 0.3 ? '#5CAA48' : '#B8232C'
    ctx.fillRect(cx, 6, (p.hp / p.maxHp) * hpW, 6)
    cx += hpW + 4
  })
  // 战车 C 装置
  if (s.party[0]?.isTank) {
    drawText(ctx, 'C', cx, 4, 1, '#FCFCFC', '#000000')
    cx += 8
    const chpW = 60
    ctx.fillStyle = '#000000'
    ctx.fillRect(cx, 6, chpW, 6)
    ctx.fillStyle = s.tank.cHp > s.tank.cMaxHp * 0.3 ? '#3858B8' : '#B8232C'
    ctx.fillRect(cx, 6, (s.tank.cHp / s.tank.cMaxHp) * chpW, 6)
    cx += chpW + 4
  }

  // 战斗菜单（底部）
  renderBattleMenu(ctx, s)
}

function renderBattleMenu(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  if (!s.battle) return
  const menuH = 56
  drawBox(ctx, 0, h - menuH, w, menuH, '#1C3878', '#FCFCFC')
  const items = ['攻击', '防御', '技能', '物品', '逃跑']
  const isInTank = s.party[0]?.isTank
  if (isInTank) {
    items.splice(0, 1, '主炮')
    items.splice(1, 0, '副炮')
  }
  // 顶部主菜单
  for (let i = 0; i < items.length; i++) {
    const x = 8 + i * 50
    const y = h - menuH + 8
    if (s.battle.menuIndex === i) {
      drawBox(ctx, x - 2, y - 2, 44, 16, '#3858B8', '#E8C170')
    }
    drawText(ctx, items[i], x, y, 1, '#FCFCFC', '#000000')
  }
  // 武器子菜单
  if (s.party[0]?.isTank) {
    if (s.battle.menuIndex === 0 && s.tank.mainWeapon) {
      drawText(ctx, s.tank.mainWeapon.name, 8, h - 32, 1, '#E8C170', '#000000')
    }
    if (s.battle.menuIndex === 1 && s.tank.subWeapon) {
      drawText(ctx, s.tank.subWeapon.name, 8, h - 32, 1, '#E8C170', '#000000')
    }
  }
  // 角色列表 / 目标信息
  drawText(ctx, s.battle.message, 8, h - 16, 1, '#FCFCFC', '#000000')
  // 回合指示
  drawText(ctx, s.battle.turn === 0 ? '我方回合' : '敌方回合', w - 80, h - menuH - 14, 1, s.battle.turn === 0 ? '#5CAA48' : '#B8232C', '#000000')
}

function renderHUD(ctx: CanvasRenderingContext2D, s: RenderState) {
  const w = ctx.canvas.width
  // 顶部 HUD
  const hero = s.party[0]
  if (!hero) return
  const boxW = 90
  const boxH = 30
  drawBox(ctx, 4, 4, boxW, boxH, '#000000', '#FCFCFC')
  drawText(ctx, hero.name, 8, 8, 1, '#FCFCFC', '#000000')
  // HP
  drawText(ctx, 'HP', 8, 18, 1, '#5CAA48', '#000000')
  const hpW = 50
  ctx.fillStyle = '#000000'
  ctx.fillRect(28, 19, hpW, 4)
  ctx.fillStyle = hero.hp > hero.maxHp * 0.3 ? '#5CAA48' : '#B8232C'
  ctx.fillRect(28, 19, (hero.hp / hero.maxHp) * hpW, 4)
  // 位置 / 金币
  drawBox(ctx, w - boxW - 4, 4, boxW, boxH, '#000000', '#FCFCFC')
  drawText(ctx, `G ${s.hud.gold}`, w - boxW, 8, 1, '#E8C170', '#000000')
  drawText(ctx, `X ${s.worldX},Y ${s.worldY}`, w - boxW, 18, 1, '#FCFCFC', '#000000')
  // 战车 C 装置
  if (hero.isTank) {
    drawBox(ctx, 4, 4 + boxH + 4, boxW, 16, '#000000', '#FCFCFC')
    drawText(ctx, 'C', 8, boxH + 8, 1, '#3858B8', '#000000')
    ctx.fillStyle = '#000000'
    ctx.fillRect(20, boxH + 10, hpW, 6)
    ctx.fillStyle = s.tank.cHp > s.tank.cMaxHp * 0.3 ? '#3858B8' : '#B8232C'
    ctx.fillRect(20, boxH + 10, (s.tank.cHp / s.tank.cMaxHp) * hpW, 6)
  }
}
