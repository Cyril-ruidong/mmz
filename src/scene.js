import { initGrid, updateObstacles, NPCPathfinder } from './pathfinding.js'

export function createGameCanvas(container) {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
  }

  window.addEventListener('resize', resize)

  return { canvas, ctx, resize }
}

const tileCache = new Map()
const TILE_SIZE = 32

function createTileCanvas(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

function drawGradientRect(ctx, x, y, w, h, color1, color2, vertical = true) {
  const gradient = vertical
    ? ctx.createLinearGradient(x, y, x, y + h)
    : ctx.createLinearGradient(x, y, x + w, y)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, w, h)
}

function drawGrassTile(variant) {
  const key = 'grass_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  // 多层渐变底色
  const baseGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 24)
  baseGrad.addColorStop(0, '#6aaa40')
  baseGrad.addColorStop(0.6, '#5a9a30')
  baseGrad.addColorStop(1, '#4a8a25')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 草地纹理层
  ctx.fillStyle = '#4a8a26'
  for (let i = 0; i < 25; i++) {
    const x = (variant * 100 + i * 127) % TILE_SIZE
    const y = (variant * 200 + i * 251) % TILE_SIZE
    ctx.beginPath()
    ctx.moveTo(x, y + 5)
    ctx.lineTo(x + 1, y)
    ctx.lineTo(x + 2, y + 5)
    ctx.fill()
  }

  // 高光草叶
  ctx.fillStyle = '#7aba50'
  for (let i = 0; i < 12; i++) {
    const x = (variant * 150 + i * 173) % (TILE_SIZE - 4) + 2
    const y = (variant * 250 + i * 311) % (TILE_SIZE - 6) + 3
    ctx.fillRect(x, y, 2, 3)
    ctx.fillStyle = '#8aca60'
    ctx.fillRect(x, y, 1, 2)
    ctx.fillStyle = '#7aba50'
  }

  // 泥土斑点
  ctx.fillStyle = 'rgba(90, 60, 30, 0.3)'
  for (let i = 0; i < 6; i++) {
    const x = (variant * 300 + i * 97) % TILE_SIZE
    const y = (variant * 400 + i * 131) % TILE_SIZE
    ctx.beginPath()
    ctx.ellipse(x, y, 2, 1.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // 花朵装饰
  if (variant % 5 === 0) {
    // 花朵
    ctx.fillStyle = '#ff69b4'
    ctx.beginPath()
    ctx.arc(14, 14, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ff1493'
    ctx.beginPath()
    ctx.arc(14, 14, 2, 0, Math.PI * 2)
    ctx.fill()
    // 花瓣高光
    ctx.fillStyle = '#ffb6c1'
    ctx.beginPath()
    ctx.arc(13, 13, 1, 0, Math.PI * 2)
    ctx.fill()
  }

  // 小石子
  ctx.fillStyle = '#8a8a7a'
  for (let i = 0; i < 3; i++) {
    const x = (variant * 200 + i * 67) % TILE_SIZE
    const y = (variant * 300 + i * 89) % TILE_SIZE
    ctx.beginPath()
    ctx.ellipse(x, y, 1.5, 1, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawDirtTile(variant) {
  const key = 'dirt_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  // 沙土渐变
  const baseGrad = ctx.createRadialGradient(16, 16, 0, 16, 16, 24)
  baseGrad.addColorStop(0, '#d4b080')
  baseGrad.addColorStop(0.5, '#c4a06a')
  baseGrad.addColorStop(1, '#a08050')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 深色纹理
  ctx.fillStyle = '#b49060'
  for (let i = 0; i < 15; i++) {
    const x = (variant * 100 + i * 137) % TILE_SIZE
    const y = (variant * 200 + i * 271) % TILE_SIZE
    ctx.fillRect(x, y, 3, 2)
    ctx.fillStyle = '#a48050'
    ctx.fillRect(x + 1, y, 1, 1)
    ctx.fillStyle = '#b49060'
  }

  // 高光斑点
  ctx.fillStyle = '#e4c090'
  for (let i = 0; i < 8; i++) {
    const x = (variant * 150 + i * 193) % TILE_SIZE
    const y = (variant * 250 + i * 331) % TILE_SIZE
    ctx.fillRect(x, y, 2, 1)
  }

  // 小碎石
  ctx.fillStyle = '#9a8a70'
  for (let i = 0; i < 4; i++) {
    const x = (variant * 250 + i * 73) % TILE_SIZE
    const y = (variant * 350 + i * 97) % TILE_SIZE
    ctx.beginPath()
    ctx.ellipse(x, y, 2, 1.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawWaterTile(time, variant) {
  const key = 'water_' + Math.floor(time / 200) + '_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  // 水面渐变
  const waterGrad = ctx.createLinearGradient(0, 0, 0, TILE_SIZE)
  waterGrad.addColorStop(0, '#6a9cd0')
  waterGrad.addColorStop(0.5, '#5a8cc0')
  waterGrad.addColorStop(1, '#4a7cb0')
  ctx.fillStyle = waterGrad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  const waveOffset = ((time + variant * 100) % 600) / 600

  // 波浪
  ctx.fillStyle = 'rgba(120, 180, 240, 0.4)'
  for (let y = 0; y < TILE_SIZE; y += 4) {
    const waveX = Math.sin((y + waveOffset * TILE_SIZE) * 0.5) * 4
    ctx.beginPath()
    ctx.ellipse(waveX + 8, y + 2, 7, 2.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(waveX + 22, y + 3, 6, 2, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // 高光点
  ctx.fillStyle = 'rgba(180, 220, 255, 0.6)'
  ctx.fillRect(6, 8, 3, 2)
  ctx.fillRect(20, 14, 2, 2)
  ctx.fillRect(12, 22, 2, 2)
  ctx.fillRect(25, 6, 2, 1)

  // 水下阴影
  ctx.fillStyle = 'rgba(30, 60, 100, 0.2)'
  ctx.fillRect(0, TILE_SIZE - 4, TILE_SIZE, 4)

  tileCache.set(key, canvas)
  return canvas
}

function drawRoadTile() {
  const key = 'road'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  // 路面渐变
  const roadGrad = ctx.createLinearGradient(0, 0, 0, TILE_SIZE)
  roadGrad.addColorStop(0, '#a89a8a')
  roadGrad.addColorStop(0.5, '#9a8a7a')
  roadGrad.addColorStop(1, '#8a7a6a')
  ctx.fillStyle = roadGrad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 路面纹理
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  for (let i = 0; i < 10; i++) {
    const x = (i * 7 + 2) % TILE_SIZE
    const y = (i * 11 + 5) % TILE_SIZE
    ctx.fillRect(x, y, 3, 2)
  }

  // 边缘高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fillRect(0, 0, TILE_SIZE, 1)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
  ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2)

  // 道路中线
  ctx.fillStyle = '#e8e4d8'
  ctx.fillRect(15, 0, 2, TILE_SIZE)
  ctx.fillStyle = '#f8f4e8'
  ctx.fillRect(15, 0, 1, TILE_SIZE)

  // 斑马纹
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(15, i * 8 + 2, 2, 4)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawDetailedBuildingTile(type, time) {
  const key = 'building_detailed_' + type + '_' + Math.floor(time / 2000)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE * 4, TILE_SIZE * 4)

  // 建筑主体渐变
  const wallGrad = ctx.createLinearGradient(0, 0, TILE_SIZE * 4, 0)
  wallGrad.addColorStop(0, '#a8a8a8')
  wallGrad.addColorStop(0.3, '#9a9a9a')
  wallGrad.addColorStop(0.7, '#8a8a8a')
  wallGrad.addColorStop(1, '#7a7a7a')
  ctx.fillStyle = wallGrad
  ctx.fillRect(0, 0, TILE_SIZE * 4, TILE_SIZE * 4)

  // 砖块纹理
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.lineWidth = 1
  for (let y = 0; y < TILE_SIZE * 4; y += 8) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(TILE_SIZE * 4, y)
    ctx.stroke()
  }
  for (let x = 0; x < TILE_SIZE * 4; x += 16) {
    const offset = (Math.floor(x / 16) % 2) * 8
    for (let y = offset; y < TILE_SIZE * 4; y += 16) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + 8)
      ctx.stroke()
    }
  }

  // 房顶渐变
  const roofGrad = ctx.createLinearGradient(0, 0, 0, 12)
  roofGrad.addColorStop(0, '#d85a4a')
  roofGrad.addColorStop(0.5, '#c44a3a')
  roofGrad.addColorStop(1, '#a03a2a')
  ctx.fillStyle = roofGrad
  ctx.fillRect(0, 0, TILE_SIZE * 4, 12)

  // 房顶瓦片
  ctx.fillStyle = '#b03a2a'
  for (let x = 0; x < TILE_SIZE * 4; x += 8) {
    ctx.beginPath()
    ctx.moveTo(x, 12)
    ctx.lineTo(x + 4, 6)
    ctx.lineTo(x + 8, 12)
    ctx.fill()
  }

  // 屋檐
  ctx.fillStyle = '#8a2a1a'
  ctx.fillRect(0, 10, TILE_SIZE * 4, 3)

  // 门
  ctx.fillStyle = '#2a2015'
  ctx.fillRect(TILE_SIZE * 2 - 14, TILE_SIZE * 4 - 32, 28, 32)
  ctx.fillStyle = '#3a3025'
  ctx.fillRect(TILE_SIZE * 2 - 12, TILE_SIZE * 4 - 30, 24, 30)
  
  // 门把手
  ctx.fillStyle = '#c0a030'
  ctx.beginPath()
  ctx.arc(TILE_SIZE * 2 + 6, TILE_SIZE * 4 - 16, 2, 0, Math.PI * 2)
  ctx.fill()

  // 窗户
  const windowLit = type === 'lit'
  const flicker = Math.sin(time * 0.003) * 0.2 + 0.8

  for (let wy = 20; wy < TILE_SIZE * 4 - 28; wy += 18) {
    for (let wx = 12; wx < TILE_SIZE * 4 - 16; wx += 20) {
      if (windowLit) {
        // 窗户发光效果
        const glowGrad = ctx.createRadialGradient(wx + 6, wy + 6, 0, wx + 6, wy + 6, 20)
        glowGrad.addColorStop(0, 'rgba(255, 245, 180, 0.4)')
        glowGrad.addColorStop(1, 'rgba(255, 220, 100, 0)')
        ctx.fillStyle = glowGrad
        ctx.fillRect(wx - 14, wy - 14, 40, 40)

        // 窗户框架
        ctx.fillStyle = '#4a4035'
        ctx.fillRect(wx, wy, 12, 12)
        
        // 窗户玻璃（发光）
        const intensity = 0.8 + Math.sin(wx + time * 0.002) * 0.2
        ctx.fillStyle = `rgba(255, 245, 180, ${intensity * flicker})`
        ctx.fillRect(wx + 1, wy + 1, 10, 10)
        
        // 窗户高光
        ctx.fillStyle = 'rgba(255, 255, 220, 0.6)'
        ctx.fillRect(wx + 1, wy + 1, 4, 4)
        
        // 窗框
        ctx.fillStyle = '#3a3025'
        ctx.fillRect(wx + 5, wy, 2, 12)
        ctx.fillRect(wx, wy + 5, 12, 2)
      } else {
        // 窗户框架（暗）
        ctx.fillStyle = '#3a3a40'
        ctx.fillRect(wx, wy, 12, 12)
        ctx.fillStyle = '#2a2a30'
        ctx.fillRect(wx + 1, wy + 1, 10, 10)
        ctx.fillStyle = '#4a4a50'
        ctx.fillRect(wx + 5, wy, 2, 12)
        ctx.fillRect(wx, wy + 5, 12, 2)
      }
    }
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawTreeTile(variant) {
  const key = 'tree_detailed_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  // 草地底
  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#5a9a30', '#3a7a18')

  // 树干
  const trunkGrad = ctx.createLinearGradient(14, 18, 19, 32)
  trunkGrad.addColorStop(0, '#7a5a3a')
  trunkGrad.addColorStop(0.5, '#6a4a2a')
  trunkGrad.addColorStop(1, '#5a3a1a')
  ctx.fillStyle = trunkGrad
  ctx.fillRect(14, 18, 5, 14)

  // 树干纹理
  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(15, 20, 1, 10)
  ctx.fillRect(18, 22, 1, 8)

  // 树冠阴影
  ctx.fillStyle = 'rgba(0, 50, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // 主树冠
  const leafGrad = ctx.createRadialGradient(16, 10, 2, 16, 10, 14)
  leafGrad.addColorStop(0, '#7aba50')
  leafGrad.addColorStop(0.5, '#5a9a30')
  leafGrad.addColorStop(0.8, '#4a8a25')
  leafGrad.addColorStop(1, '#3a7a18')
  ctx.fillStyle = leafGrad
  ctx.beginPath()
  ctx.arc(16, 10, 13, 0, Math.PI * 2)
  ctx.fill()

  // 树冠层次
  ctx.fillStyle = '#6aaa40'
  ctx.beginPath()
  ctx.arc(12, 8, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(20, 8, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(16, 4, 6, 0, Math.PI * 2)
  ctx.fill()

  // 树冠高光
  ctx.fillStyle = '#8aca60'
  ctx.beginPath()
  ctx.arc(14, 6, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(18, 10, 3, 0, Math.PI * 2)
  ctx.fill()

  // 树干截面
  ctx.fillStyle = '#5a4030'
  ctx.beginPath()
  ctx.ellipse(16.5, 18, 3, 1.5, 0, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawTankTile() {
  const key = 'tank_detailed'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(256, 32)
  ctx.imageSmoothingEnabled = false

  for (let i = 0; i < 8; i++) {
    drawPixelTank(ctx, i * 32, 4, i, '#d84a4a', 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawNPCTankTile(color) {
  const key = 'npc_tank_detailed_' + color
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(256, 32)
  ctx.imageSmoothingEnabled = false

  for (let i = 0; i < 8; i++) {
    drawPixelTank(ctx, i * 32, 4, i, color, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

export function drawNPCHumanTile(variant) {
  const key = 'npc_human_detailed_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(24, 32)

  const skinColors = ['#f5d0b0', '#e5c0a0', '#d5b090', '#c5a080']
  const clothColors = ['#4a6a9a', '#6a5a8a', '#5a7a6a', '#8a6a5a', '#7a5a6a']
  const pantsColors = ['#3a4a5a', '#4a3a3a', '#5a4a3a', '#3a3a4a']

  const skin = skinColors[variant % 4]
  const cloth = clothColors[Math.floor(variant / 4) % 5]
  const pants = pantsColors[Math.floor(variant / 8) % 4]

  // 阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.ellipse(12, 30, 6, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // 裤子
  ctx.fillStyle = pants
  ctx.fillRect(8, 18, 8, 14)
  ctx.fillStyle = shadeColor(pants, -15)
  ctx.fillRect(8, 18, 8, 2)
  ctx.fillStyle = shadeColor(pants, 10)
  ctx.fillRect(8, 28, 8, 4)

  // 上衣
  ctx.fillStyle = cloth
  ctx.fillRect(6, 10, 12, 10)
  ctx.fillStyle = shadeColor(cloth, -15)
  ctx.fillRect(6, 10, 12, 2)
  ctx.fillStyle = shadeColor(cloth, 15)
  ctx.fillRect(6, 16, 12, 4)

  // 头
  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.arc(12, 6, 5, 0, Math.PI * 2)
  ctx.fill()

  // 头发
  ctx.fillStyle = shadeColor(skin, -25)
  ctx.beginPath()
  ctx.arc(12, 3, 5, Math.PI, Math.PI * 2)
  ctx.fill()

  // 眼睛
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(10, 5, 1.5, 2)
  ctx.fillRect(12.5, 5, 1.5, 2)

  // 嘴巴
  ctx.fillStyle = shadeColor(skin, -20)
  ctx.fillRect(11, 8, 2, 1)

  // 手臂
  ctx.fillStyle = skin
  ctx.fillRect(4, 11, 3, 7)
  ctx.fillRect(17, 11, 3, 7)

  // 鞋子
  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(7, 28, 4, 4)
  ctx.fillRect(13, 28, 4, 4)

  tileCache.set(key, canvas)
  return canvas
}

function shadeColor(color, percent) {
  if (color === 'human') return '#888888'
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)
}

function getDirectionIndex(angle) {
  const normalized = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  const octant = Math.floor((normalized + Math.PI / 8) / (Math.PI / 4)) % 8
  return octant
}

function drawPixelTank(ctx, x, y, direction, color, scale = 1) {
  const dir = direction % 8
  const tankWidth = 32 * scale
  const tankHeight = 24 * scale

  ctx.save()
  ctx.translate(x, y)

  const baseColor = color || '#d84a4a'
  const lightColor = shadeColor(baseColor, 20)
  const darkColor = shadeColor(baseColor, -20)
  const darkerColor = shadeColor(baseColor, -40)
  const trackColor = '#3a3a3a'
  const trackLight = '#4a4a4a'
  const gunColor = shadeColor(baseColor, -10)

  const drawPixel = (px, py, pc) => {
    ctx.fillStyle = pc
    ctx.fillRect(px * scale, py * scale, scale, scale)
  }

  if (dir === 0) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4, 4 + i * 2, trackColor)
      drawPixel(5, 4 + i * 2, trackColor)
      drawPixel(6, 4 + i * 2, trackLight)
      drawPixel(7, 4 + i * 2, trackLight)
      drawPixel(24, 4 + i * 2, trackColor)
      drawPixel(25, 4 + i * 2, trackColor)
      drawPixel(26, 4 + i * 2, trackLight)
      drawPixel(27, 4 + i * 2, trackLight)
    }
    for (let y = 8; y < 20; y++) {
      for (let x = 8; x < 24; x++) {
        if (x === 8 || x === 23 || y === 8 || y === 19) {
          drawPixel(x, y, darkColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    for (let y = 10; y < 16; y++) {
      for (let x = 12; x < 20; x++) {
        if (x === 12 || x === 19 || y === 10 || y === 15) {
          drawPixel(x, y, lightColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    drawPixel(15, 4, gunColor)
    drawPixel(16, 4, gunColor)
    drawPixel(15, 5, gunColor)
    drawPixel(16, 5, gunColor)
    drawPixel(15, 6, gunColor)
    drawPixel(16, 6, gunColor)
    drawPixel(15, 7, gunColor)
    drawPixel(16, 7, gunColor)
  } else if (dir === 1) {
    for (let i = 0; i < 8; i++) {
      drawPixel(8 + i, 2, trackColor)
      drawPixel(9 + i, 3, trackColor)
      drawPixel(18 + i, 2, trackLight)
      drawPixel(19 + i, 3, trackLight)
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 10 - i; j++) {
        drawPixel(10 + i + j, 6 + i, baseColor)
        drawPixel(10 + j, 6 + i, baseColor)
      }
    }
    drawPixel(22, 0, gunColor)
    drawPixel(23, 0, gunColor)
    drawPixel(24, 1, gunColor)
    drawPixel(25, 1, gunColor)
  } else if (dir === 2) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4 + i * 2, 4, trackColor)
      drawPixel(4 + i * 2, 5, trackColor)
      drawPixel(4 + i * 2, 6, trackLight)
      drawPixel(4 + i * 2, 7, trackLight)
    }
    for (let x = 8; x < 24; x++) {
      for (let y = 8; y < 16; y++) {
        if (x === 8 || x === 23 || y === 8 || y === 15) {
          drawPixel(x, y, darkColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    drawPixel(24, 11, gunColor)
    drawPixel(25, 11, gunColor)
    drawPixel(26, 11, gunColor)
    drawPixel(27, 11, gunColor)
    drawPixel(24, 12, gunColor)
    drawPixel(25, 12, gunColor)
  } else if (dir === 3) {
    for (let i = 0; i < 8; i++) {
      drawPixel(8 + i, 20, trackColor)
      drawPixel(9 + i, 21, trackColor)
      drawPixel(18 + i, 20, trackLight)
      drawPixel(19 + i, 21, trackLight)
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 10 - i; j++) {
        drawPixel(10 + i + j, 18 - i, baseColor)
        drawPixel(10 + j, 18 - i, baseColor)
      }
    }
    drawPixel(22, 22, gunColor)
    drawPixel(23, 22, gunColor)
    drawPixel(24, 23, gunColor)
    drawPixel(25, 23, gunColor)
  } else if (dir === 4) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4, 4 + i * 2, trackColor)
      drawPixel(5, 4 + i * 2, trackColor)
      drawPixel(6, 4 + i * 2, trackLight)
      drawPixel(7, 4 + i * 2, trackLight)
      drawPixel(24, 4 + i * 2, trackColor)
      drawPixel(25, 4 + i * 2, trackColor)
      drawPixel(26, 4 + i * 2, trackLight)
      drawPixel(27, 4 + i * 2, trackLight)
    }
    for (let y = 4; y < 16; y++) {
      for (let x = 8; x < 24; x++) {
        if (x === 8 || x === 23 || y === 4 || y === 15) {
          drawPixel(x, y, darkColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    for (let y = 6; y < 12; y++) {
      for (let x = 12; x < 20; x++) {
        if (x === 12 || x === 19 || y === 6 || y === 11) {
          drawPixel(x, y, lightColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    drawPixel(15, 16, gunColor)
    drawPixel(16, 16, gunColor)
    drawPixel(15, 17, gunColor)
    drawPixel(16, 17, gunColor)
    drawPixel(15, 18, gunColor)
    drawPixel(16, 18, gunColor)
    drawPixel(15, 19, gunColor)
    drawPixel(16, 19, gunColor)
  } else if (dir === 5) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4 + i, 20, trackColor)
      drawPixel(5 + i, 21, trackColor)
      drawPixel(4 + i, 20, trackLight)
      drawPixel(5 + i, 21, trackLight)
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 10 - i; j++) {
        drawPixel(10 - i + j, 18 - i, baseColor)
        drawPixel(10 + j, 18 - i, baseColor)
      }
    }
    drawPixel(6, 22, gunColor)
    drawPixel(7, 22, gunColor)
    drawPixel(4, 23, gunColor)
    drawPixel(5, 23, gunColor)
  } else if (dir === 6) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4 + i * 2, 16, trackColor)
      drawPixel(4 + i * 2, 17, trackColor)
      drawPixel(4 + i * 2, 18, trackLight)
      drawPixel(4 + i * 2, 19, trackLight)
    }
    for (let x = 8; x < 24; x++) {
      for (let y = 8; y < 16; y++) {
        if (x === 8 || x === 23 || y === 8 || y === 15) {
          drawPixel(x, y, darkColor)
        } else {
          drawPixel(x, y, baseColor)
        }
      }
    }
    drawPixel(0, 11, gunColor)
    drawPixel(1, 11, gunColor)
    drawPixel(2, 11, gunColor)
    drawPixel(3, 11, gunColor)
    drawPixel(4, 11, gunColor)
    drawPixel(5, 11, gunColor)
  } else if (dir === 7) {
    for (let i = 0; i < 8; i++) {
      drawPixel(4 + i, 2, trackColor)
      drawPixel(5 + i, 3, trackColor)
      drawPixel(4 + i, 2, trackLight)
      drawPixel(5 + i, 3, trackLight)
    }
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 10 - i; j++) {
        drawPixel(10 - i + j, 6 + i, baseColor)
        drawPixel(10 + j, 6 + i, baseColor)
      }
    }
    drawPixel(6, 0, gunColor)
    drawPixel(7, 0, gunColor)
    drawPixel(4, 1, gunColor)
    drawPixel(5, 1, gunColor)
  }

  ctx.restore()
}

function drawDirectionalTank(ctx, x, y, angle, color) {
  const dir = getDirectionIndex(angle)
  drawPixelTank(ctx, x - 16, y - 12, dir, color, 2)
}

const directionalTankCache = new Map()

function drawDirectionalTankTile(color = '#d84a4a') {
  const cacheKey = 'directional_tank_' + color
  if (directionalTankCache.has(cacheKey)) {
    return directionalTankCache.get(cacheKey)
  }

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  for (let i = 0; i < 8; i++) {
    drawPixelTank(ctx, i * 32, 4, i, color, 1)
  }

  directionalTankCache.set(cacheKey, canvas)
  return canvas
}

function drawCoinTile(time) {
  const key = 'coin_detailed_' + Math.floor(time / 200)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(20, 20)

  const spin = Math.sin(time * 0.008)
  const width = 5 + Math.abs(spin) * 7

  // 硬币阴影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.ellipse(10, 12, width * 0.8, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // 硬币主体
  const coinGrad = ctx.createRadialGradient(10 - width * 0.2, 8, 0, 10, 10, 10)
  coinGrad.addColorStop(0, '#f8e080')
  coinGrad.addColorStop(0.4, '#f0d060')
  coinGrad.addColorStop(0.8, '#c0a030')
  coinGrad.addColorStop(1, '#a08020')
  ctx.fillStyle = coinGrad
  ctx.beginPath()
  ctx.ellipse(10, 10, width, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // 硬币边缘
  ctx.strokeStyle = '#806010'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(10, 10, width, 8, 0, 0, Math.PI * 2)
  ctx.stroke()

  // 高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.beginPath()
  ctx.ellipse(10 - width * 0.3, 8, width * 0.4, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // 星星标记
  if (width > 8) {
    ctx.fillStyle = '#f8f080'
    ctx.font = '8px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('★', 10, 12)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawLampPostTile(time) {
  const key = 'lamp_detailed_' + Math.floor(time / 500)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(20, 44)

  const flicker = 0.85 + Math.sin(time * 0.006) * 0.15

  // 灯柱
  const poleGrad = ctx.createLinearGradient(9, 8, 11, 44)
  poleGrad.addColorStop(0, '#7a7a7a')
  poleGrad.addColorStop(0.5, '#5a5a5a')
  poleGrad.addColorStop(1, '#3a3a3a')
  ctx.fillStyle = poleGrad
  ctx.fillRect(9, 8, 3, 36)

  // 灯座
  ctx.fillStyle = '#6a6a6a'
  ctx.fillRect(6, 6, 8, 4)

  // 光晕
  const glowGrad = ctx.createRadialGradient(10, 4, 0, 10, 4, 25)
  glowGrad.addColorStop(0, `rgba(255, 255, 200, ${flicker * 0.7})`)
  glowGrad.addColorStop(0.3, `rgba(255, 255, 150, ${flicker * 0.4})`)
  glowGrad.addColorStop(0.6, `rgba(255, 220, 100, ${flicker * 0.15})`)
  glowGrad.addColorStop(1, 'rgba(255, 200, 50, 0)')
  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(10, 4, 25, 0, Math.PI * 2)
  ctx.fill()

  // 灯泡
  ctx.fillStyle = `rgba(255, 255, 220, ${flicker})`
  ctx.beginPath()
  ctx.arc(10, 4, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fffff0'
  ctx.beginPath()
  ctx.arc(10, 4, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(9, 3, 2, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

const particles = []

function createParticle(x, y, type) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 4,
    vy: -Math.random() * 4 - 1,
    life: 1,
    type,
    size: 2 + Math.random() * 5
  })
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.12
    p.life -= 0.02
    if (p.life <= 0) {
      particles.splice(i, 1)
    }
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    ctx.globalAlpha = p.life
    if (p.type === 'sparkle') {
      const sparkleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
      sparkleGrad.addColorStop(0, '#ffff88')
      sparkleGrad.addColorStop(0.5, '#ffcc00')
      sparkleGrad.addColorStop(1, 'rgba(255, 200, 0, 0)')
      ctx.fillStyle = sparkleGrad
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (p.type === 'dust') {
      ctx.fillStyle = '#a09080'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

let lastCollectTime = 0

export function onCollect(x, y) {
  for (let i = 0; i < 25; i++) {
    createParticle(x, y, 'sparkle')
  }
  lastCollectTime = Date.now()
}

const npcs = []

export function createNPCs(count, canvasWidth, canvasHeight, buildings) {
  npcs.length = 0
  
  initGrid(canvasWidth, canvasHeight)
  updateObstacles(buildings)
  
  // FC 重装机兵原版风格的 NPC 类型
  const types = ['red_wolf', 'townsfolk', 'bar_drinker', 'human']
  const colors = ['#d84a4a', '#6a9a6a', '#8a6a4a', 'human']

  for (let i = 0; i < count; i++) {
    const typeIndex = i % types.length
    const x = Math.random() * (canvasWidth - 200) + 100
    const y = Math.random() * (canvasHeight - 200) + 100
    npcs.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      type: types[typeIndex],
      color: colors[typeIndex],
      direction: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
      changeTimer: 0,
      variant: i,
      pathfinder: new NPCPathfinder(x, y)
    })
  }
}

export function updateNPCs(width, height, time, buildings) {
  for (const npc of npcs) {
    // 定期随机改变方向（类似 FC 重装机兵风格）
    npc.changeTimer += 1
    if (npc.changeTimer > 60 + Math.random() * 60) {
      npc.changeTimer = 0
      npc.direction = Math.random() * Math.PI * 2
      npc.speed = 0.3 + Math.random() * 0.5
    }

    // 简单移动
    const vx = Math.cos(npc.direction) * npc.speed
    const vy = Math.sin(npc.direction) * npc.speed
    npc.x += vx
    npc.y += vy

    // 边界检查
    if (npc.x < 50 || npc.x > width - 50) {
      npc.direction = Math.PI - npc.direction
      npc.x = Math.max(50, Math.min(width - 50, npc.x))
    }
    if (npc.y < 50 || npc.y > height - 50) {
      npc.direction = -npc.direction
      npc.y = Math.max(50, Math.min(height - 50, npc.y))
    }

    // 如果有 pathfinder，更新障碍物信息
    if (npc.pathfinder) {
      npc.pathfinder.update(buildings, width, height)
    }
  }
}

export function drawNPCs(ctx, time) {
  for (const npc of npcs) {
    if (npc.type === 'red_wolf') {
      // 红狼：红色坦克（使用 8 方向渲染）
      drawDirectionalTank(ctx, npc.x, npc.y, npc.direction, '#d84a4a')
    } else if (npc.type === 'human' || npc.type === 'townsfolk' || npc.type === 'bar_drinker') {
      // 人类 NPC
      const humanTile = drawNPCHumanTile(npc.variant)
      ctx.save()
      ctx.translate(npc.x, npc.y)
      // 根据 direction 判断朝向（右方向为 0，左方向为 PI）
      if (Math.cos(npc.direction) < 0) {
        ctx.scale(-1, 1)
      }
      ctx.drawImage(humanTile, -12, -16)
      ctx.restore()
    } else {
      // 其他类型坦克（使用 8 方向渲染）
      drawDirectionalTank(ctx, npc.x, npc.y, npc.direction, npc.color)
    }
  }
}

function drawInteriorFloor(ctx, width, height) {
  const { canvas, ctx: floorCtx } = createTileCanvas(TILE_SIZE, TILE_SIZE)
  
  // 木地板渐变
  const floorGrad = floorCtx.createRadialGradient(16, 16, 0, 16, 16, 24)
  floorGrad.addColorStop(0, '#4a4035')
  floorGrad.addColorStop(0.5, '#3a3025')
  floorGrad.addColorStop(1, '#2a2015')
  floorCtx.fillStyle = floorGrad
  floorCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  
  // 木纹
  floorCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)'
  floorCtx.lineWidth = 1
  for (let y = 0; y < TILE_SIZE; y += 8) {
    floorCtx.beginPath()
    floorCtx.moveTo(0, y)
    floorCtx.lineTo(TILE_SIZE, y)
    floorCtx.stroke()
  }
  
  // 高光线条
  floorCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  floorCtx.beginPath()
  floorCtx.moveTo(0, 0)
  floorCtx.lineTo(TILE_SIZE, 0)
  floorCtx.stroke()
  
  // 木板间接缝
  floorCtx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  floorCtx.fillRect(0, 0, TILE_SIZE, 1)
  floorCtx.fillRect(0, 0, 1, TILE_SIZE)
  
  const tile = canvas
  
  const gridW = Math.ceil(width / TILE_SIZE) + 1
  const gridH = Math.ceil(height / TILE_SIZE) + 1
  
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      ctx.drawImage(tile, gx * TILE_SIZE, gy * TILE_SIZE)
    }
  }
}

function drawInteriorItem(ctx, item, x, y, time) {
  const itemX = x * ctx.canvas.width
  const itemY = y * ctx.canvas.height
  
  ctx.save()
  ctx.translate(itemX, itemY)
  
  switch (item.type) {
    case 'table':
      // 桌面
      const tableGrad = ctx.createLinearGradient(-30, -20, 30, 10)
      tableGrad.addColorStop(0, '#6a5040')
      tableGrad.addColorStop(0.5, '#5a4030')
      tableGrad.addColorStop(1, '#4a3020')
      ctx.fillStyle = tableGrad
      ctx.fillRect(-30, -15, 60, 30)
      
      // 桌面高光
      ctx.fillStyle = '#7a6050'
      ctx.fillRect(-30, -15, 60, 4)
      
      // 桌腿
      ctx.fillStyle = '#4a3020'
      ctx.fillRect(-28, 10, 6, 20)
      ctx.fillRect(22, 10, 6, 20)
      
      // 桌面纹理
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-25, -10)
      ctx.lineTo(25, -10)
      ctx.moveTo(-25, 0)
      ctx.lineTo(25, 0)
      ctx.stroke()
      break
      
    case 'bed':
      // 床架
      ctx.fillStyle = '#5a4030'
      ctx.fillRect(-28, -22, 56, 44)
      
      // 床垫
      ctx.fillStyle = '#6a5a50'
      ctx.fillRect(-26, -20, 52, 24)
      
      // 枕头
      ctx.fillStyle = '#8a7a70'
      ctx.fillRect(-22, -18, 20, 12)
      ctx.fillStyle = '#9a8a80'
      ctx.fillRect(-20, -16, 16, 8)
      
      // 被子
      ctx.fillStyle = '#5a6a7a'
      ctx.fillRect(-24, -4, 48, 18)
      ctx.fillStyle = '#6a7a8a'
      ctx.fillRect(-22, -2, 44, 14)
      
      // 床腿
      ctx.fillStyle = '#4a3020'
      ctx.fillRect(-26, 18, 6, 6)
      ctx.fillRect(20, 18, 6, 6)
      break
      
    case 'lamp':
      // 灯柱
      ctx.fillStyle = '#5a5a50'
      ctx.fillRect(-3, -28, 6, 28)
      
      // 灯罩
      ctx.fillStyle = '#6a6a60'
      ctx.beginPath()
      ctx.moveTo(-10, -30)
      ctx.lineTo(10, -30)
      ctx.lineTo(8, -20)
      ctx.lineTo(-8, -20)
      ctx.closePath()
      ctx.fill()
      
      // 灯泡发光
      const lampGlow = ctx.createRadialGradient(0, -25, 0, 0, -25, 50)
      lampGlow.addColorStop(0, 'rgba(255, 255, 200, 0.6)')
      lampGlow.addColorStop(0.3, 'rgba(255, 255, 180, 0.3)')
      lampGlow.addColorStop(1, 'rgba(255, 255, 150, 0)')
      ctx.fillStyle = lampGlow
      ctx.beginPath()
      ctx.arc(0, -25, 50, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#ffffc0'
      ctx.beginPath()
      ctx.arc(0, -25, 6, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'counter':
      // 柜台
      const counterGrad = ctx.createLinearGradient(-40, -20, 40, 15)
      counterGrad.addColorStop(0, '#6a5a4a')
      counterGrad.addColorStop(0.5, '#5a4a3a')
      counterGrad.addColorStop(1, '#4a3a2a')
      ctx.fillStyle = counterGrad
      ctx.fillRect(-40, -15, 80, 30)
      
      // 高光
      ctx.fillStyle = '#7a6a5a'
      ctx.fillRect(-40, -15, 80, 4)
      
      // 柜面
      ctx.fillStyle = '#8a7a6a'
      ctx.fillRect(-38, -11, 76, 4)
      
      // 柜门
      ctx.fillStyle = '#4a3a2a'
      ctx.fillRect(-38, -5, 35, 18)
      ctx.fillRect(3, -5, 35, 18)
      break
      
    case 'shelf':
      // 货架
      ctx.fillStyle = '#5a4535'
      ctx.fillRect(-32, -45, 64, 90)
      
      // 层板
      ctx.fillStyle = '#6a5545'
      ctx.fillRect(-30, -43, 60, 4)
      ctx.fillRect(-30, -15, 60, 4)
      ctx.fillRect(-30, 13, 60, 4)
      ctx.fillRect(-30, 38, 60, 4)
      
      // 商品
      ctx.fillStyle = '#8a7a6a'
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-25, -38 + i * 28, 50, 8)
        ctx.fillStyle = '#7a6a5a'
        ctx.fillRect(-20, -30 + i * 28, 10, 12)
        ctx.fillRect(-5, -30 + i * 28, 15, 12)
        ctx.fillRect(15, -30 + i * 28, 10, 12)
        ctx.fillStyle = '#8a7a6a'
      }
      break
      
    case 'crate':
      // 木箱
      const crateGrad = ctx.createLinearGradient(-22, -22, 22, 22)
      crateGrad.addColorStop(0, '#7a6a50')
      crateGrad.addColorStop(0.5, '#6a5a40')
      crateGrad.addColorStop(1, '#5a4a30')
      ctx.fillStyle = crateGrad
      ctx.fillRect(-20, -20, 40, 40)
      
      // 高光边
      ctx.fillStyle = '#8a7a60'
      ctx.fillRect(-20, -20, 40, 3)
      ctx.fillRect(-20, -20, 3, 40)
      
      // 阴影边
      ctx.fillStyle = '#4a3a20'
      ctx.fillRect(-20, 17, 40, 3)
      ctx.fillRect(17, -20, 3, 40)
      
      // 木板纹
      ctx.strokeStyle = '#5a4a30'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-20, 0)
      ctx.lineTo(20, 0)
      ctx.moveTo(0, -20)
      ctx.lineTo(0, 20)
      ctx.stroke()
      break
      
    case 'workbench':
      // 工作台
      ctx.fillStyle = '#5a5a5a'
      ctx.fillRect(-38, -15, 76, 30)
      
      // 台面
      ctx.fillStyle = '#6a6a6a'
      ctx.fillRect(-36, -13, 72, 6)
      
      // 支架
      ctx.fillStyle = '#4a4a4a'
      ctx.fillRect(-34, 12, 8, 18)
      ctx.fillRect(26, 12, 8, 18)
      
      // 工具
      ctx.fillStyle = '#8a8a8a'
      ctx.fillRect(-30, -8, 20, 4)
      ctx.fillRect(10, -8, 15, 4)
      break
      
    case 'oil_barrel':
      // 油桶
      const barrelGrad = ctx.createLinearGradient(-16, -20, 16, 20)
      barrelGrad.addColorStop(0, '#5a7a5a')
      barrelGrad.addColorStop(0.5, '#4a6a4a')
      barrelGrad.addColorStop(1, '#3a5a3a')
      ctx.fillStyle = barrelGrad
      ctx.beginPath()
      ctx.ellipse(0, -12, 14, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(-14, -12, 28, 28)
      ctx.beginPath()
      ctx.ellipse(0, 16, 14, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // 桶环
      ctx.strokeStyle = '#3a4a3a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, -8, 13, 4, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(0, 12, 13, 4, 0, 0, Math.PI * 2)
      ctx.stroke()
      break
      
    case 'weapon_rack':
      // 武器架
      ctx.fillStyle = '#4a3a2a'
      ctx.fillRect(-38, -55, 76, 110)
      
      // 层板
      ctx.fillStyle = '#5a4a3a'
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-36, -50 + i * 28, 72, 4)
      }
      
      // 武器
      ctx.fillStyle = '#7a7a7a'
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-30, -45 + i * 28, 60, 6)
        // 枪管
        ctx.fillStyle = '#6a6a6a'
        ctx.fillRect(-25, -42 + i * 28, 50, 3)
        ctx.fillStyle = '#8a8a8a'
      }
      break
      
    case 'radar':
      // 雷达底座
      ctx.fillStyle = '#3a4a5a'
      ctx.fillRect(-45, 10, 90, 25)
      
      // 雷达天线
      const radarGrad = ctx.createRadialGradient(0, -20, 0, 0, -20, 45)
      radarGrad.addColorStop(0, '#5a7a8a')
      radarGrad.addColorStop(0.7, '#4a6a7a')
      radarGrad.addColorStop(1, '#3a5a6a')
      ctx.fillStyle = radarGrad
      ctx.beginPath()
      ctx.ellipse(0, -20, 42, 32, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // 雷达屏幕
      ctx.fillStyle = '#2a4a5a'
      ctx.beginPath()
      ctx.ellipse(0, -20, 36, 26, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // 扫描线
      ctx.strokeStyle = 'rgba(100, 200, 100, 0.6)'
      ctx.lineWidth = 2
      const sweepAngle = (time * 0.004) % (Math.PI * 2)
      ctx.beginPath()
      ctx.moveTo(0, -20)
      ctx.lineTo(Math.cos(sweepAngle) * 34, -20 + Math.sin(sweepAngle) * 24)
      ctx.stroke()
      
      // 雷达圈
      ctx.strokeStyle = 'rgba(100, 180, 100, 0.4)'
      ctx.beginPath()
      ctx.ellipse(0, -20, 25, 18, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(0, -20, 12, 9, 0, 0, Math.PI * 2)
      ctx.stroke()
      
      // 中心点
      ctx.fillStyle = '#80ff80'
      ctx.beginPath()
      ctx.arc(0, -20, 3, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'console':
      // 控制台
      ctx.fillStyle = '#4a5a6a'
      ctx.fillRect(-35, -25, 70, 45)
      
      // 屏幕
      ctx.fillStyle = '#2a3a4a'
      ctx.fillRect(-32, -22, 64, 35)
      
      // 屏幕内容
      ctx.fillStyle = '#3a5a7a'
      ctx.fillRect(-30, -20, 28, 20)
      ctx.fillRect(2, -20, 28, 20)
      
      // 指示灯
      const blinkOn = Math.sin(time * 0.008) > 0
      ctx.fillStyle = blinkOn ? '#80ff80' : '#306030'
      ctx.beginPath()
      ctx.arc(-25, 10, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = blinkOn ? '#ff8080' : '#603030'
      ctx.beginPath()
      ctx.arc(-15, 10, 3, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'map_table':
      // 地图桌
      ctx.fillStyle = '#5a5040'
      ctx.fillRect(-45, -30, 90, 60)
      
      // 桌面
      ctx.fillStyle = '#6a6050'
      ctx.fillRect(-43, -28, 86, 56)
      
      // 地图
      ctx.fillStyle = '#d4c4a4'
      ctx.fillRect(-40, -25, 80, 50)
      
      // 地图纹理
      ctx.fillStyle = '#b4a484'
      ctx.fillRect(-35, -20, 30, 40)
      ctx.fillRect(5, -15, 30, 30)
      
      // 地图标记
      ctx.fillStyle = '#c44a4a'
      ctx.beginPath()
      ctx.arc(-20, 0, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#4a4ac4'
      ctx.beginPath()
      ctx.arc(20, -5, 4, 0, Math.PI * 2)
      ctx.fill()
      break
  }
  
  ctx.restore()
}

function drawExitZone(ctx, scene, width, height) {
  if (!scene.exitPosition) return
  
  const exitX = scene.exitPosition.x * width
  const exitY = scene.exitPosition.y * height
  
  // 出口光圈
  const exitGrad = ctx.createRadialGradient(exitX, exitY, 0, exitX, exitY, 45)
  exitGrad.addColorStop(0, 'rgba(150, 255, 150, 0.4)')
  exitGrad.addColorStop(0.5, 'rgba(100, 200, 100, 0.2)')
  exitGrad.addColorStop(1, 'rgba(50, 150, 50, 0)')
  ctx.fillStyle = exitGrad
  ctx.beginPath()
  ctx.arc(exitX, exitY, 45, 0, Math.PI * 2)
  ctx.fill()
  
  // 虚线边框
  ctx.strokeStyle = 'rgba(100, 255, 100, 0.7)'
  ctx.lineWidth = 3
  ctx.setLineDash([8, 6])
  ctx.beginPath()
  ctx.arc(exitX, exitY, 35, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
  
  // 出口图标
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Courier New'
  ctx.textAlign = 'center'
  ctx.fillText('⬆', exitX, exitY - 50)
  
  ctx.font = '12px Courier New'
  ctx.fillText('出口', exitX, exitY - 38)
}

function drawInteriorScene(ctx, scene, width, height, time) {
  drawInteriorFloor(ctx, width, height)
  
  // 室内环境光
  const ambientGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
  ambientGrad.addColorStop(0, 'rgba(255, 250, 240, 0.1)')
  ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)')
  ctx.fillStyle = ambientGrad
  ctx.fillRect(0, 0, width, height)
  
  if (scene.items) {
    for (const item of scene.items) {
      drawInteriorItem(ctx, item, item.x, item.y, time)
    }
  }
  
  drawExitZone(ctx, scene, width, height)
}

export function drawScene(ctx, currentScene, width, height, time) {
  if (currentScene.isInterior) {
    drawInteriorScene(ctx, currentScene, width, height, time)
  } else {
    drawDetailedTownMap(ctx, width, height, time, currentScene.buildings)
  }
}

export function drawDetailedTownMap(ctx, width, height, time, buildings) {
  const gridW = Math.ceil(width / TILE_SIZE) + 2
  const gridH = Math.ceil(height / TILE_SIZE) + 2

  const seed = 12345
  function random(x, y) {
    return Math.sin(seed + x * 123.456 + y * 789.012) * 0.5 + 0.5
  }

  // 绘制地形
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const x = gx * TILE_SIZE
      const y = gy * TILE_SIZE
      const r = random(gx, gy)
      const variant = Math.floor(random(gx + 100, gy + 100) * 10)

      let tile
      if (r < 0.65) {
        tile = drawGrassTile(variant)
      } else if (r < 0.82) {
        tile = drawDirtTile(variant)
      } else {
        tile = drawWaterTile(time, variant)
      }

      ctx.drawImage(tile, x, y)
    }
  }

  const roadY = Math.floor(height / TILE_SIZE / 2) * TILE_SIZE
  
  // 道路
  for (let x = 0; x < width; x += TILE_SIZE) {
    const roadTile = drawRoadTile()
    ctx.drawImage(roadTile, x, roadY - TILE_SIZE)
    ctx.drawImage(roadTile, x, roadY)
    ctx.drawImage(roadTile, x, roadY + TILE_SIZE)
  }

  // 建筑
  if (buildings) {
    for (const b of buildings) {
      const bx = width * b.x
      const by = height * b.y
      const buildingTile = drawDetailedBuildingTile(b.type, time)
      ctx.drawImage(buildingTile, bx, by)
      
      if (b.enterable) {
        // 入口标记背景
        ctx.fillStyle = 'rgba(100, 255, 100, 0.3)'
        ctx.beginPath()
        ctx.arc(bx + TILE_SIZE * 2, by + TILE_SIZE * 3.5, 18, 0, Math.PI * 2)
        ctx.fill()
        
        // 入口文字
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 14px Courier New'
        ctx.textAlign = 'center'
        ctx.fillText('入', bx + TILE_SIZE * 2, by + TILE_SIZE * 3.5 + 5)
      }
    }
  }

  // 路灯
  for (let i = 0; i < 16; i++) {
    const px = (0.03 + i * 0.062) * width
    const py = roadY - TILE_SIZE * 1.5 + (i % 2) * TILE_SIZE * 3
    const lampTile = drawLampPostTile(time)
    ctx.drawImage(lampTile, px, py)
    
    // 路灯光照效果
    const lampGlow = ctx.createRadialGradient(px + 10, py + 4, 0, px + 10, py + 4, 80)
    lampGlow.addColorStop(0, 'rgba(255, 255, 200, 0.08)')
    lampGlow.addColorStop(1, 'rgba(255, 255, 200, 0)')
    ctx.fillStyle = lampGlow
    ctx.beginPath()
    ctx.arc(px + 10, py + 4, 80, 0, Math.PI * 2)
    ctx.fill()
  }

  // 树木
  const treePositions = []
  for (let i = 0; i < 15; i++) {
    treePositions.push({
      x: (0.05 + (i % 5) * 0.2 + Math.sin(i * 123) * 0.02),
      y: (0.08 + Math.floor(i / 5) * 0.22 + Math.cos(i * 234) * 0.02),
      v: i
    })
  }

  for (const t of treePositions) {
    const tx = width * t.x
    const ty = height * t.y
    if (Math.abs(ty - roadY) > TILE_SIZE * 2) {
      const treeTile = drawTreeTile(t.v)
      ctx.drawImage(treeTile, tx, ty)
    }
  }

  // 粒子效果
  updateParticles()
  drawParticles(ctx)

  // 收集闪光
  if (Date.now() - lastCollectTime < 150) {
    const flashAlpha = 1 - (Date.now() - lastCollectTime) / 150
    ctx.fillStyle = `rgba(255, 255, 220, ${flashAlpha * 0.3})`
    ctx.fillRect(0, 0, width, height)
  }
}

export function drawTankSprite(ctx, x, y, isInTank, direction = 0) {
  if (isInTank) {
    drawDirectionalTank(ctx, x, y, direction, '#d84a4a')
  } else {
    ctx.globalAlpha = 0.6
    drawDirectionalTank(ctx, x, y, direction, '#d84a4a')
    ctx.globalAlpha = 1
  }

  if (isInTank && Math.random() > 0.9) {
    createParticle(x + (Math.random() - 0.5) * 25, y - 12, 'dust')
  }
}

export function drawCoinSprite(ctx, x, y, time) {
  const coinTile = drawCoinTile(time)
  ctx.drawImage(coinTile, x - 10, y - 10)

  // 金币光环
  ctx.globalAlpha = 0.15 + Math.sin(time * 0.005) * 0.1
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
  glowGradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)')
  glowGradient.addColorStop(0.5, 'rgba(255, 255, 50, 0.4)')
  glowGradient.addColorStop(1, 'rgba(255, 255, 50, 0)')
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

export function getNPCs() {
  return npcs
}
