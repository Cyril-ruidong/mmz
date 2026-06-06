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

  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#5a9a30', '#3a7a18')

  ctx.fillStyle = '#4a8a26'
  for (let i = 0; i < 20; i++) {
    const x = (variant * 100 + i * 127) % TILE_SIZE
    const y = (variant * 200 + i * 251) % TILE_SIZE
    ctx.beginPath()
    ctx.moveTo(x, y + 4)
    ctx.lineTo(x + 1, y)
    ctx.lineTo(x + 2, y + 4)
    ctx.fill()
  }

  ctx.fillStyle = '#6aaa40'
  for (let i = 0; i < 8; i++) {
    const x = (variant * 150 + i * 173) % (TILE_SIZE - 4) + 2
    const y = (variant * 250 + i * 311) % (TILE_SIZE - 6) + 3
    ctx.fillRect(x, y, 2, 3)
  }

  if (variant % 5 === 0) {
    ctx.fillStyle = '#ff69b4'
    ctx.beginPath()
    ctx.arc(16, 16, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ff1493'
    ctx.beginPath()
    ctx.arc(16, 16, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawDirtTile(variant) {
  const key = 'dirt_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#c4a06a', '#a08050')

  ctx.fillStyle = '#b49060'
  for (let i = 0; i < 10; i++) {
    const x = (variant * 100 + i * 137) % TILE_SIZE
    const y = (variant * 200 + i * 271) % TILE_SIZE
    ctx.fillRect(x, y, 3, 2)
  }

  ctx.fillStyle = '#d4b080'
  for (let i = 0; i < 5; i++) {
    const x = (variant * 150 + i * 193) % TILE_SIZE
    const y = (variant * 250 + i * 331) % TILE_SIZE
    ctx.fillRect(x, y, 2, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawWaterTile(time, variant) {
  const key = 'water_' + Math.floor(time / 200) + '_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#5a8cb8', '#3a6c98')

  const waveOffset = ((time + variant * 100) % 600) / 600

  ctx.fillStyle = 'rgba(100, 160, 220, 0.3)'
  for (let y = 0; y < TILE_SIZE; y += 4) {
    const waveX = Math.sin((y + waveOffset * TILE_SIZE) * 0.4) * 3
    ctx.beginPath()
    ctx.ellipse(waveX + 8, y + 2, 6, 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(waveX + 22, y + 3, 5, 2, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = 'rgba(150, 200, 255, 0.4)'
  ctx.fillRect(6, 8, 3, 2)
  ctx.fillRect(20, 14, 2, 2)
  ctx.fillRect(12, 22, 2, 2)

  tileCache.set(key, canvas)
  return canvas
}

function drawRoadTile() {
  const key = 'road'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#9a8a7a', '#7a6a5a')

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  for (let i = 0; i < 8; i++) {
    const x = (i * 7 + 2) % TILE_SIZE
    const y = (i * 11 + 5) % TILE_SIZE
    ctx.fillRect(x, y, 2, 2)
  }

  ctx.fillStyle = '#d8d4c8'
  ctx.fillRect(15, 0, 2, TILE_SIZE)
  ctx.fillStyle = '#f0ece0'
  ctx.fillRect(15, 0, 1, TILE_SIZE)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.fillRect(0, 0, TILE_SIZE, 2)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2)

  tileCache.set(key, canvas)
  return canvas
}

function drawBuildingTile(type, time) {
  const key = 'building_' + type + '_' + Math.floor(time / 2000)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE * 4, TILE_SIZE * 4)

  drawGradientRect(ctx, 0, 0, TILE_SIZE * 4, TILE_SIZE * 4, '#9a9a9a', '#7a7a7a')

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  for (let y = 4; y < TILE_SIZE * 4; y += 16) {
    ctx.fillRect(0, y, TILE_SIZE * 4, 3)
  }

  drawGradientRect(ctx, 0, 0, TILE_SIZE * 4, 8, '#c44a3a', '#a03a2a')

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(TILE_SIZE * 2 - 12, TILE_SIZE * 4 - 28, 24, 28)
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(TILE_SIZE * 2 - 10, TILE_SIZE * 4 - 26, 20, 24)

  const windowLit = type === 'lit'
  const flicker = Math.sin(time * 0.003) * 0.2 + 0.8

  for (let wy = 18; wy < TILE_SIZE * 4 - 24; wy += 14) {
    for (let wx = 10; wx < TILE_SIZE * 4 - 14; wx += 14) {
      if (windowLit) {
        const intensity = 0.7 + Math.sin(wx + time * 0.002) * 0.3
        ctx.fillStyle = `rgba(255, 240, 150, ${intensity * flicker})`
        ctx.beginPath()
        ctx.arc(wx + 5, wy + 5, 8, 0, Math.PI * 2)
        ctx.fill()
        
        const gradient = ctx.createRadialGradient(wx + 5, wy + 5, 0, wx + 5, wy + 5, 8)
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)')
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(wx - 3, wy - 3, 16, 16)
        
        ctx.fillStyle = '#fff8c0'
        ctx.fillRect(wx, wy, 10, 10)
      } else {
        drawGradientRect(ctx, wx, wy, 10, 10, '#4a6a80', '#3a5a70')
      }
    }
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawTreeTile(variant) {
  const key = 'tree_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  drawGradientRect(ctx, 0, 0, TILE_SIZE, TILE_SIZE, '#5a9a30', '#3a7a18')

  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(14, 20, 5, 12)
  ctx.fillStyle = '#6a4a2a'
  ctx.fillRect(15, 20, 3, 12)

  const trunkGradient = ctx.createLinearGradient(14, 20, 19, 32)
  trunkGradient.addColorStop(0, '#6a4a2a')
  trunkGradient.addColorStop(0.5, '#5a3a1a')
  trunkGradient.addColorStop(1, '#4a2a0a')
  ctx.fillStyle = trunkGradient
  ctx.fillRect(14, 20, 5, 12)

  const leafGradient = ctx.createRadialGradient(16, 12, 2, 16, 12, 14)
  leafGradient.addColorStop(0, '#6aaa40')
  leafGradient.addColorStop(0.5, '#4a8a28')
  leafGradient.addColorStop(1, '#2a5a10')
  ctx.fillStyle = leafGradient
  ctx.beginPath()
  ctx.arc(16, 12, 13, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#7aba50'
  ctx.beginPath()
  ctx.arc(12, 10, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(20, 10, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(16, 6, 5, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawTankTile() {
  const key = 'tank'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(64, 48)

  const bodyGradient = ctx.createLinearGradient(8, 12, 56, 36)
  bodyGradient.addColorStop(0, '#c42c2c')
  bodyGradient.addColorStop(0.5, '#a41c1c')
  bodyGradient.addColorStop(1, '#7a0f0f')
  ctx.fillStyle = bodyGradient
  ctx.fillRect(8, 12, 48, 24)

  ctx.fillStyle = '#e84c4c'
  ctx.fillRect(10, 12, 44, 3)
  ctx.fillStyle = '#4a0a0a'
  ctx.fillRect(10, 33, 44, 3)

  ctx.fillStyle = '#b42424'
  ctx.beginPath()
  ctx.ellipse(32, 24, 14, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#d44444'
  ctx.beginPath()
  ctx.ellipse(30, 22, 8, 7, -0.3, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#9a1a1a'
  ctx.fillRect(42, 20, 18, 8)
  ctx.fillStyle = '#7a0f0f'
  ctx.fillRect(42, 20, 18, 3)

  ctx.fillStyle = '#2a0505'
  ctx.fillRect(57, 21, 3, 6)

  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(4, 18, 56, 14)
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(4, 18, 56, 4)
  ctx.fillRect(4, 28, 56, 4)

  ctx.fillStyle = '#1a1a1a'
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(8 + i * 5, 19, 2, 3)
    ctx.fillRect(8 + i * 5, 29, 2, 3)
  }

  ctx.fillStyle = '#6a0a0a'
  ctx.fillRect(14, 16, 4, 8)
  ctx.fillRect(28, 14, 8, 12)
  ctx.fillRect(44, 16, 4, 8)

  ctx.fillStyle = '#5a8ac4'
  ctx.fillRect(30, 16, 4, 4)
  ctx.fillStyle = '#7abae4'
  ctx.fillRect(31, 17, 2, 2)

  tileCache.set(key, canvas)
  return canvas
}

function drawNPCTankTile(color) {
  const key = 'npc_tank_' + color
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(48, 36)

  const bodyGradient = ctx.createLinearGradient(4, 8, 44, 28)
  bodyGradient.addColorStop(0, color)
  bodyGradient.addColorStop(0.5, shadeColor(color, -20))
  bodyGradient.addColorStop(1, shadeColor(color, -40))
  ctx.fillStyle = bodyGradient
  ctx.fillRect(4, 8, 40, 20)

  ctx.fillStyle = shadeColor(color, -30)
  ctx.fillRect(4, 8, 40, 3)
  ctx.fillStyle = shadeColor(color, 10)
  ctx.fillRect(4, 25, 40, 3)

  ctx.fillStyle = shadeColor(color, 10)
  ctx.fillRect(12, 10, 24, 14)

  ctx.fillStyle = shadeColor(color, -20)
  ctx.fillRect(20, 4, 6, 22)

  ctx.fillStyle = shadeColor(color, -40)
  ctx.fillRect(20, 0, 6, 6)

  tileCache.set(key, canvas)
  return canvas
}

export function drawNPCHumanTile(variant) {
  const key = 'npc_human_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(24, 32)

  const skinColors = ['#f5d0b0', '#e5c0a0', '#d5b090', '#c5a080']
  const clothColors = ['#4a6a9a', '#6a5a8a', '#5a7a6a', '#8a6a5a', '#7a5a6a']
  const pantsColors = ['#3a4a5a', '#4a3a3a', '#5a4a3a', '#3a3a4a']

  const skin = skinColors[variant % 4]
  const cloth = clothColors[Math.floor(variant / 4) % 5]
  const pants = pantsColors[Math.floor(variant / 8) % 4]

  ctx.fillStyle = pants
  ctx.fillRect(8, 20, 8, 12)

  ctx.fillStyle = shadeColor(pants, -20)
  ctx.fillRect(8, 28, 8, 4)

  ctx.fillStyle = cloth
  ctx.fillRect(6, 10, 12, 12)

  ctx.fillStyle = shadeColor(cloth, -20)
  ctx.fillRect(6, 10, 12, 3)

  ctx.fillStyle = skin
  ctx.beginPath()
  ctx.arc(12, 6, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = shadeColor(skin, -20)
  ctx.beginPath()
  ctx.arc(12, 3, 5, Math.PI, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(10, 2, 1.5, 3)
  ctx.fillRect(12.5, 2, 1.5, 3)

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(10, 7, 2, 1)
  ctx.fillRect(12, 7, 2, 1)

  ctx.fillStyle = skin
  ctx.fillRect(4, 12, 3, 6)
  ctx.fillRect(17, 12, 3, 6)

  tileCache.set(key, canvas)
  return canvas
}

function shadeColor(color, percent) {
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

function drawCoinTile(time) {
  const key = 'coin_' + Math.floor(time / 200)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(20, 20)

  const spin = Math.sin(time * 0.008)
  const width = 6 + Math.abs(spin) * 6

  const gradient = ctx.createRadialGradient(10, 10, 0, 10, 10, 8)
  gradient.addColorStop(0, '#f0d060')
  gradient.addColorStop(0.7, '#c0a030')
  gradient.addColorStop(1, '#a08020')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.ellipse(10, 10, width, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.beginPath()
  ctx.ellipse(10 - width * 0.2, 10 - 2, width * 0.4, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#806010'
  ctx.fillRect(9, 4, 2, 12)

  tileCache.set(key, canvas)
  return canvas
}

function drawLampPostTile(time) {
  const key = 'lamp_' + Math.floor(time / 500)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(20, 44)

  const poleGradient = ctx.createLinearGradient(9, 10, 11, 44)
  poleGradient.addColorStop(0, '#6a6a6a')
  poleGradient.addColorStop(1, '#3a3a3a')
  ctx.fillStyle = poleGradient
  ctx.fillRect(9, 10, 3, 34)

  ctx.fillStyle = '#5a5a5a'
  ctx.fillRect(6, 8, 8, 4)

  const flicker = 0.8 + Math.sin(time * 0.006) * 0.2

  const glowGradient = ctx.createRadialGradient(10, 6, 0, 10, 6, 20)
  glowGradient.addColorStop(0, `rgba(255, 255, 180, ${flicker * 0.6})`)
  glowGradient.addColorStop(0.5, `rgba(255, 255, 100, ${flicker * 0.2})`)
  glowGradient.addColorStop(1, 'rgba(255, 200, 50, 0)')
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(10, 6, 20, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fff8c0'
  ctx.beginPath()
  ctx.arc(10, 6, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#ffffd0'
  ctx.beginPath()
  ctx.arc(10, 6, 3, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

const particles = []

function createParticle(x, y, type) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 3,
    vy: -Math.random() * 3 - 1,
    life: 1,
    type,
    size: 2 + Math.random() * 4
  })
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.1
    p.life -= 0.025
    if (p.life <= 0) {
      particles.splice(i, 1)
    }
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    ctx.globalAlpha = p.life
    if (p.type === 'sparkle') {
      ctx.fillStyle = '#ffff88'
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    } else if (p.type === 'dust') {
      ctx.fillStyle = '#a09080'
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
    }
  }
  ctx.globalAlpha = 1
}

let lastCollectTime = 0

export function onCollect(x, y) {
  for (let i = 0; i < 20; i++) {
    createParticle(x, y, 'sparkle')
  }
  lastCollectTime = Date.now()
}

const npcs = []

export function createNPCs(count) {
  npcs.length = 0
  const types = ['tank_green', 'tank_red', 'tank_blue', 'human']
  const colors = ['#4a7a4a', '#9a4a4a', '#4a6a9a', 'human']

  for (let i = 0; i < count; i++) {
    const typeIndex = i % types.length
    npcs.push({
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      type: types[typeIndex],
      color: colors[typeIndex],
      direction: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1,
      changeTimer: 0,
      variant: i
    })
  }
}

export function updateNPCs(width, height, time) {
  const margin = 50

  for (const npc of npcs) {
    npc.changeTimer--
    if (npc.changeTimer <= 0) {
      npc.vx = (Math.random() - 0.5) * 2
      npc.vy = (Math.random() - 0.5) * 2
      npc.changeTimer = 100 + Math.random() * 200
    }

    if (npc.type === 'human') {
      npc.x += npc.vx * 0.5
      npc.y += npc.vy * 0.5
    } else {
      npc.x += npc.vx
      npc.y += npc.vy
    }

    if (npc.x < margin) { npc.x = margin; npc.vx *= -1 }
    if (npc.x > width - margin) { npc.x = width - margin; npc.vx *= -1 }
    if (npc.y < margin) { npc.y = margin; npc.vy *= -1 }
    if (npc.y > height - margin) { npc.y = height - margin; npc.vy *= -1 }

    if (Math.abs(npc.vx) > 0.1 || Math.abs(npc.vy) > 0.1) {
      npc.direction = Math.atan2(npc.vy, npc.vx)
    }
  }
}

export function drawNPCs(ctx, time) {
  for (const npc of npcs) {
    if (npc.type === 'human') {
      const humanTile = drawNPCHumanTile(npc.variant)
      ctx.save()
      ctx.translate(npc.x, npc.y)
      if (npc.vx < 0) {
        ctx.scale(-1, 1)
      }
      ctx.drawImage(humanTile, -12, -16)
      ctx.restore()
    } else {
      const tankTile = drawNPCTankTile(npc.color)
      ctx.save()
      ctx.translate(npc.x, npc.y)
      ctx.rotate(npc.direction + Math.PI / 2)
      ctx.drawImage(tankTile, -16, -16)
      ctx.restore()
    }
  }
}

function drawInteriorFloor(ctx, width, height) {
  const { canvas, ctx: floorCtx } = createTileCanvas(TILE_SIZE, TILE_SIZE)
  
  drawGradientRect(floorCtx, 0, 0, TILE_SIZE, TILE_SIZE, '#3a3020', '#2a2015')
  
  floorCtx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  for (let i = 0; i < 4; i++) {
    floorCtx.fillRect(0, i * 8, TILE_SIZE, 1)
  }
  
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
      ctx.fillStyle = '#5a4030'
      ctx.fillRect(-30, -15, 60, 30)
      ctx.fillStyle = '#4a3020'
      ctx.fillRect(-30, -15, 60, 5)
      ctx.fillStyle = '#6a5040'
      ctx.fillRect(-28, -10, 56, 3)
      break
      
    case 'bed':
      ctx.fillStyle = '#4a3a30'
      ctx.fillRect(-25, -20, 50, 40)
      ctx.fillStyle = '#6a5a50'
      ctx.fillRect(-23, -18, 46, 20)
      ctx.fillStyle = '#7a6a60'
      ctx.fillRect(-20, -15, 40, 15)
      break
      
    case 'lamp':
      ctx.fillStyle = '#4a4a40'
      ctx.fillRect(-3, -25, 6, 25)
      ctx.fillStyle = '#ffff88'
      ctx.beginPath()
      ctx.arc(0, -30, 10, 0, Math.PI * 2)
      ctx.fill()
      const glowGrad = ctx.createRadialGradient(0, -30, 0, 0, -30, 40)
      glowGrad.addColorStop(0, 'rgba(255, 255, 150, 0.3)')
      glowGrad.addColorStop(1, 'rgba(255, 255, 100, 0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(0, -30, 40, 0, Math.PI * 2)
      ctx.fill()
      break
      
    case 'counter':
      ctx.fillStyle = '#5a4a3a'
      ctx.fillRect(-40, -15, 80, 30)
      ctx.fillStyle = '#4a3a2a'
      ctx.fillRect(-40, -15, 80, 8)
      ctx.fillStyle = '#6a5a4a'
      ctx.fillRect(-38, -7, 76, 4)
      break
      
    case 'shelf':
      ctx.fillStyle = '#5a4535'
      ctx.fillRect(-30, -40, 60, 80)
      ctx.fillStyle = '#4a3525'
      ctx.fillRect(-30, -40, 60, 5)
      ctx.fillRect(-30, 0, 60, 5)
      ctx.fillRect(-30, 35, 60, 5)
      ctx.fillStyle = '#8a7a6a'
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(-25, -35 + i * 35, 50, 8)
      }
      break
      
    case 'crate':
      ctx.fillStyle = '#6a5a40'
      ctx.fillRect(-20, -20, 40, 40)
      ctx.fillStyle = '#5a4a30'
      ctx.fillRect(-20, -20, 40, 5)
      ctx.fillRect(-20, 15, 40, 5)
      ctx.fillRect(-2, -20, 4, 40)
      ctx.fillRect(-20, -2, 40, 4)
      break
      
    case 'workbench':
      ctx.fillStyle = '#4a4a4a'
      ctx.fillRect(-35, -12, 70, 24)
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(-35, -12, 70, 6)
      ctx.fillStyle = '#5a5a5a'
      ctx.fillRect(-33, -6, 66, 3)
      break
      
    case 'oil_barrel':
      ctx.fillStyle = '#3a5a3a'
      ctx.beginPath()
      ctx.ellipse(0, -15, 15, 8, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(-15, -15, 30, 30)
      ctx.fillStyle = '#4a6a4a'
      ctx.fillRect(-15, -15, 30, 5)
      ctx.fillStyle = '#2a4a2a'
      ctx.fillRect(-15, 10, 30, 5)
      break
      
    case 'parts':
      ctx.fillStyle = '#5a5a5a'
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(-20 + i * 10, Math.sin(i) * 5, 5, 0, Math.PI * 2)
        ctx.fill()
      }
      break
      
    case 'weapon_rack':
      ctx.fillStyle = '#4a3a2a'
      ctx.fillRect(-35, -50, 70, 100)
      ctx.fillStyle = '#5a4a3a'
      ctx.fillRect(-33, -48, 66, 96)
      ctx.fillStyle = '#6a6a6a'
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-30, -45 + i * 24, 60, 6)
      }
      ctx.fillStyle = '#8a8a8a'
      ctx.fillRect(-25, -40, 50, 4)
      break
      
    case 'ammo_crate':
      ctx.fillStyle = '#5a6a4a'
      ctx.fillRect(-25, -20, 50, 40)
      ctx.fillStyle = '#4a5a3a'
      ctx.fillRect(-25, -20, 50, 6)
      ctx.fillStyle = '#6a7a5a'
      ctx.fillRect(-23, -14, 46, 34)
      break
      
    case 'display_case':
      ctx.fillStyle = '#3a3a4a'
      ctx.fillRect(-30, -35, 60, 70)
      ctx.fillStyle = 'rgba(100, 150, 200, 0.2)'
      ctx.fillRect(-28, -33, 56, 66)
      ctx.fillStyle = '#8a8a9a'
      ctx.fillRect(-28, -33, 56, 3)
      break
      
    case 'radar':
      ctx.fillStyle = '#2a3a4a'
      ctx.beginPath()
      ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#3a4a5a'
      ctx.beginPath()
      ctx.ellipse(0, 0, 35, 25, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#5a8aaa'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, -25)
      ctx.lineTo(0, 25)
      ctx.moveTo(-35, 0)
      ctx.lineTo(35, 0)
      ctx.stroke()
      const sweepAngle = (time * 0.003) % (Math.PI * 2)
      ctx.strokeStyle = 'rgba(100, 200, 100, 0.6)'
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(sweepAngle) * 30, Math.sin(sweepAngle) * 20)
      ctx.stroke()
      break
      
    case 'console':
      ctx.fillStyle = '#3a4a5a'
      ctx.fillRect(-30, -20, 60, 40)
      ctx.fillStyle = '#2a3a4a'
      ctx.fillRect(-28, -18, 56, 36)
      ctx.fillStyle = '#4a6a8a'
      ctx.fillRect(-25, -15, 20, 10)
      ctx.fillRect(5, -15, 20, 10)
      break
      
    case 'map_table':
      ctx.fillStyle = '#5a5040'
      ctx.fillRect(-40, -25, 80, 50)
      ctx.fillStyle = '#4a4030'
      ctx.fillRect(-40, -25, 80, 8)
      ctx.fillStyle = '#6a6050'
      ctx.fillRect(-38, -17, 76, 40)
      ctx.fillStyle = '#3a5a7a'
      ctx.beginPath()
      ctx.ellipse(0, 5, 30, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#2a4a6a'
      ctx.beginPath()
      ctx.ellipse(0, 5, 25, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      break
  }
  
  ctx.restore()
}

function drawExitZone(ctx, scene, width, height) {
  if (!scene.exitPosition) return
  
  const exitX = scene.exitPosition.x * width
  const exitY = scene.exitPosition.y * height
  
  ctx.fillStyle = 'rgba(100, 200, 100, 0.3)'
  ctx.beginPath()
  ctx.arc(exitX, exitY, 30, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.strokeStyle = 'rgba(100, 200, 100, 0.6)'
  ctx.lineWidth = 3
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.arc(exitX, exitY, 35, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
  
  ctx.fillStyle = '#ffffff'
  ctx.font = '14px Courier New'
  ctx.textAlign = 'center'
  ctx.fillText('出口', exitX, exitY - 45)
}

function drawInteriorScene(ctx, scene, width, height, time) {
  drawInteriorFloor(ctx, width, height)
  
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
    drawFCMetalslugMap(ctx, width, height, time, currentScene.buildings)
  }
}

export function drawFCMetalslugMap(ctx, width, height, time, buildings) {
  const gridW = Math.ceil(width / TILE_SIZE) + 2
  const gridH = Math.ceil(height / TILE_SIZE) + 2

  const seed = 12345
  function random(x, y) {
    return Math.sin(seed + x * 123.456 + y * 789.012) * 0.5 + 0.5
  }

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
  for (let x = 0; x < width; x += TILE_SIZE) {
    const roadTile = drawRoadTile()
    ctx.drawImage(roadTile, x, roadY - TILE_SIZE)
    ctx.drawImage(roadTile, x, roadY)
    ctx.drawImage(roadTile, x, roadY + TILE_SIZE)
  }

  if (!buildings) return

  for (const b of buildings) {
    const bx = width * b.x
    const by = height * b.y
    const buildingTile = drawBuildingTile(b.type, time)
    ctx.drawImage(buildingTile, bx, by)
    
    if (b.enterable) {
      ctx.fillStyle = 'rgba(100, 200, 100, 0.3)'
      ctx.fillRect(bx + TILE_SIZE * 2 - 10, by + TILE_SIZE * 3 - 15, 20, 15)
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px Courier New'
      ctx.textAlign = 'center'
      ctx.fillText('入', bx + TILE_SIZE * 2, by + TILE_SIZE * 3 - 5)
    }
  }

  for (let i = 0; i < 16; i++) {
    const px = (0.03 + i * 0.062) * width
    const py = roadY - TILE_SIZE * 1.5 + (i % 2) * TILE_SIZE * 3
    const lampTile = drawLampPostTile(time)
    ctx.drawImage(lampTile, px, py)
  }

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

  updateParticles()
  drawParticles(ctx)

  if (Date.now() - lastCollectTime < 150) {
    const flashAlpha = 1 - (Date.now() - lastCollectTime) / 150
    ctx.fillStyle = `rgba(255, 255, 220, ${flashAlpha * 0.4})`
    ctx.fillRect(0, 0, width, height)
  }
}

export function drawTankSprite(ctx, x, y, isInTank) {
  const tankTile = drawTankTile()
  if (isInTank) {
    ctx.drawImage(tankTile, x - 32, y - 24)
  } else {
    ctx.globalAlpha = 0.7
    ctx.drawImage(tankTile, x - 32, y - 24)
    ctx.globalAlpha = 1
  }

  if (isInTank && Math.random() > 0.92) {
    createParticle(x + (Math.random() - 0.5) * 20, y - 16, 'dust')
  }
}

export function drawCoinSprite(ctx, x, y, time) {
  const coinTile = drawCoinTile(time)
  ctx.drawImage(coinTile, x - 10, y - 10)

  ctx.globalAlpha = 0.15 + Math.sin(time * 0.005) * 0.1
  const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 16)
  glowGradient.addColorStop(0, 'rgba(255, 255, 100, 0.6)')
  glowGradient.addColorStop(1, 'rgba(255, 255, 50, 0)')
  ctx.fillStyle = glowGradient
  ctx.beginPath()
  ctx.arc(x, y, 16, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

export function getNPCs() {
  return npcs
}
