export function createGameCanvas(container) {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.imageSmoothingEnabled = false
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
  ctx.imageSmoothingEnabled = false
  return { canvas, ctx }
}

function drawGrassTile(variant) {
  const key = 'grass_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  const baseColors = ['#3d7a1e', '#4a8c23', '#428420']
  ctx.fillStyle = baseColors[variant % 3]
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  const seed = variant * 1000
  for (let i = 0; i < 12; i++) {
    const x = ((seed + i * 127) % TILE_SIZE)
    const y = ((seed + i * 251) % TILE_SIZE)
    ctx.fillStyle = '#2a5a10'
    ctx.fillRect(x, y, 1, 2)
    ctx.fillRect(x + 1, y + 1, 1, 1)
  }

  for (let i = 0; i < 6; i++) {
    const x = ((seed + i * 313) % TILE_SIZE)
    const y = ((seed + i * 419) % TILE_SIZE)
    ctx.fillStyle = '#5a9c30'
    ctx.fillRect(x, y, 1, 1)
  }

  if (variant % 5 === 0) {
    const flowerColors = ['#ff69b4', '#ffd700', '#ff6347', '#7fffd4']
    const color = flowerColors[variant % 4]
    const x = (seed % 24) + 4
    const y = (seed % 24) + 4
    ctx.fillStyle = color
    ctx.fillRect(x, y, 2, 2)
    ctx.fillStyle = '#228b22'
    ctx.fillRect(x, y + 2, 1, 2)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawDirtTile(variant) {
  const key = 'dirt_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  const baseColors = ['#b89058', '#c4a06a', '#ad8050']
  ctx.fillStyle = baseColors[variant % 3]
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  const seed = variant * 1500
  for (let i = 0; i < 8; i++) {
    const x = ((seed + i * 173) % TILE_SIZE)
    const y = ((seed + i * 289) % TILE_SIZE)
    const w = 2 + (i % 3)
    const h = 1 + (i % 2)
    ctx.fillStyle = '#8a7040'
    ctx.fillRect(x, y, w, h)
  }

  for (let i = 0; i < 4; i++) {
    const x = ((seed + i * 397) % TILE_SIZE)
    const y = ((seed + i * 457) % TILE_SIZE)
    ctx.fillStyle = '#d4b880'
    ctx.fillRect(x, y, 1, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawWaterTile(time, variant) {
  const key = 'water_' + Math.floor(time / 150) + '_' + variant
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  const waveOffset = ((time + variant * 100) % 500) / 500

  ctx.fillStyle = '#3a6c90'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#2a5c80'
  for (let y = 0; y < TILE_SIZE; y += 3) {
    const waveX = Math.sin((y + waveOffset * TILE_SIZE) * 0.4) * 3
    ctx.fillRect(waveX + 1, y, 5, 2)
    ctx.fillRect(waveX + 10, y + 1, 5, 2)
    ctx.fillRect(waveX + 20, y, 5, 2)
  }

  ctx.fillStyle = '#4a7ca0'
  for (let y = 1; y < TILE_SIZE; y += 4) {
    const waveX = Math.sin((y + waveOffset * TILE_SIZE + 50) * 0.35) * 2
    ctx.fillRect(waveX + 6, y, 3, 1)
    ctx.fillRect(waveX + 17, y + 2, 3, 1)
  }

  ctx.fillStyle = '#5a8cb0'
  ctx.globalAlpha = 0.6 + Math.sin(time * 0.003 + variant) * 0.2
  ctx.fillRect(8, 12, 2, 1)
  ctx.fillRect(20, 6, 1, 1)
  ctx.globalAlpha = 1

  tileCache.set(key, canvas)
  return canvas
}

function drawRoadTile() {
  const key = 'road'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#7a6a5a'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#5a4a3a'
  for (let i = 0; i < 6; i++) {
    const x = (i * 5 + 3) % TILE_SIZE
    const y = (i * 7 + 8) % TILE_SIZE
    ctx.fillRect(x, y, 2, 2)
  }

  ctx.fillStyle = '#d4d0c0'
  ctx.fillRect(15, 0, 2, TILE_SIZE)
  ctx.fillStyle = '#e8e4d4'
  ctx.fillRect(15, 0, 1, TILE_SIZE)

  ctx.fillStyle = '#6a5a4a'
  ctx.fillRect(0, 0, TILE_SIZE, 2)
  ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2)

  tileCache.set(key, canvas)
  return canvas
}

function drawBuildingTile(type, time) {
  const key = 'building_' + type + '_' + Math.floor(time / 1000)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE * 4, TILE_SIZE * 4)

  ctx.fillStyle = '#8a8a8a'
  ctx.fillRect(0, 0, TILE_SIZE * 4, TILE_SIZE * 4)

  ctx.fillStyle = '#7a7a7a'
  for (let y = 4; y < TILE_SIZE * 4; y += 16) {
    ctx.fillRect(0, y, TILE_SIZE * 4, 3)
  }

  ctx.fillStyle = '#6a6a6a'
  ctx.fillRect(0, 0, TILE_SIZE * 4, 6)

  ctx.fillStyle = '#c44a3a'
  ctx.fillRect(6, 0, TILE_SIZE * 4 - 12, 12)

  ctx.fillStyle = '#a03a2a'
  ctx.fillRect(12, 6, TILE_SIZE * 4 - 24, 6)

  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(0, TILE_SIZE * 4 - 12, TILE_SIZE * 4, 12)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(TILE_SIZE * 2 - 10, TILE_SIZE * 4 - 24, 20, 24)

  const windowLit = type === 'lit'
  const flicker = Math.sin(time * 0.005) * 0.3 + 0.7

  for (let wy = 18; wy < TILE_SIZE * 4 - 20; wy += 14) {
    for (let wx = 10; wx < TILE_SIZE * 4 - 10; wx += 14) {
      const isLit = windowLit && Math.sin(wx * 0.3 + wy * 0.2 + time * 0.002) > -0.3
      
      if (isLit) {
        const intensity = 0.7 + Math.sin(wx + time * 0.003) * 0.3
        ctx.fillStyle = `rgba(248, 248, 100, ${intensity * flicker})`
        ctx.beginPath()
        ctx.arc(wx + 5, wy + 5, 10, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#f8f864'
        ctx.fillRect(wx, wy, 10, 10)
        ctx.fillStyle = '#f8f8a0'
        ctx.fillRect(wx + 2, wy + 2, 6, 6)
      } else {
        ctx.fillStyle = '#3a5a70'
        ctx.fillRect(wx, wy, 10, 10)
        ctx.fillStyle = '#2a4a60'
        ctx.fillRect(wx + 2, wy + 2, 6, 6)
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

  const baseColors = ['#3d7a1e', '#4a8c23', '#428420']
  ctx.fillStyle = baseColors[variant % 3]
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#5a3a1a'
  ctx.fillRect(13, 18, 6, 14)
  ctx.fillStyle = '#6a4a2a'
  ctx.fillRect(14, 18, 2, 14)

  ctx.fillStyle = '#1a4a10'
  ctx.beginPath()
  ctx.arc(16, 12, 12, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#2a5a1a'
  ctx.beginPath()
  ctx.arc(12, 14, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(20, 14, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(16, 8, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#3a6a2a'
  ctx.beginPath()
  ctx.arc(16, 12, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#4a7a3a'
  ctx.beginPath()
  ctx.arc(14, 10, 3, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawTankTile() {
  const key = 'tank'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(3, 8, 26, 16)
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(3, 8, 26, 2)
  ctx.fillRect(3, 22, 26, 2)

  ctx.fillStyle = '#5a7a4a'
  ctx.fillRect(5, 10, 22, 12)

  ctx.fillStyle = '#3a5a3a'
  ctx.fillRect(5, 10, 22, 2)
  ctx.fillRect(5, 20, 22, 2)

  ctx.fillStyle = '#4a6a4a'
  ctx.fillRect(9, 12, 14, 8)

  ctx.fillStyle = '#5a7a5a'
  ctx.fillRect(11, 14, 10, 4)

  ctx.fillStyle = '#4a6a4a'
  ctx.fillRect(14, 6, 4, 20)
  ctx.fillStyle = '#3a5a4a'
  ctx.fillRect(14, 2, 4, 6)

  ctx.fillStyle = '#6a8a6a'
  ctx.fillRect(15, 7, 2, 10)

  ctx.fillStyle = '#3a5a3a'
  ctx.fillRect(5, 10, 2, 12)
  ctx.fillRect(25, 10, 2, 12)

  tileCache.set(key, canvas)
  return canvas
}

function drawCoinTile(time) {
  const key = 'coin_' + Math.floor(time / 200)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(18, 18)

  const spin = Math.sin(time * 0.008)
  const width = 6 + Math.abs(spin) * 6

  ctx.fillStyle = '#a0801a'
  ctx.beginPath()
  ctx.ellipse(9, 9, width, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#c0a02a'
  ctx.beginPath()
  ctx.ellipse(9, 9, width - 1, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e0c04a'
  ctx.beginPath()
  ctx.ellipse(9, 8, width - 2, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f0d06a'
  ctx.beginPath()
  ctx.ellipse(8, 7, 2, 1.5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#806010'
  ctx.fillRect(8, 4, 2, 10)

  tileCache.set(key, canvas)
  return canvas
}

function drawLampPostTile(time) {
  const key = 'lamp_' + Math.floor(time / 500)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(20, 40)

  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(8, 10, 4, 30)

  ctx.fillStyle = '#5a5a5a'
  ctx.fillRect(6, 8, 8, 4)

  ctx.fillStyle = '#7a7a7a'
  ctx.fillRect(4, 6, 12, 4)

  const flicker = 0.7 + Math.sin(time * 0.008) * 0.3
  ctx.fillStyle = `rgba(255, 255, 100, ${flicker * 0.4})`
  ctx.beginPath()
  ctx.arc(10, 6, 14, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = `rgba(255, 255, 150, ${flicker})`
  ctx.beginPath()
  ctx.arc(10, 6, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f8f8c0'
  ctx.beginPath()
  ctx.arc(10, 6, 4, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawRockTile(size) {
  const key = 'rock_' + size
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(size, size)

  const s = size
  ctx.fillStyle = '#6a6a6a'
  ctx.beginPath()
  ctx.moveTo(s * 0.2, s * 0.8)
  ctx.lineTo(s * 0.1, s * 0.5)
  ctx.lineTo(s * 0.3, s * 0.2)
  ctx.lineTo(s * 0.7, s * 0.15)
  ctx.lineTo(s * 0.9, s * 0.4)
  ctx.lineTo(s * 0.85, s * 0.8)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#8a8a8a'
  ctx.beginPath()
  ctx.moveTo(s * 0.3, s * 0.2)
  ctx.lineTo(s * 0.7, s * 0.15)
  ctx.lineTo(s * 0.6, s * 0.4)
  ctx.lineTo(s * 0.35, s * 0.45)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#4a4a4a'
  ctx.beginPath()
  ctx.moveTo(s * 0.6, s * 0.8)
  ctx.lineTo(s * 0.85, s * 0.8)
  ctx.lineTo(s * 0.9, s * 0.4)
  ctx.lineTo(s * 0.7, s * 0.5)
  ctx.closePath()
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawFlowerTile(type) {
  const key = 'flower_' + type
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(16, 16)

  const colors = {
    0: { petal: '#ff69b4', center: '#ffd700' },
    1: { petal: '#ffd700', center: '#ff8c00' },
    2: { petal: '#ff6347', center: '#ffff00' },
    3: { petal: '#7fffd4', center: '#ffffff' },
    4: { petal: '#9370db', center: '#fffacd' }
  }

  const c = colors[type % 5]

  ctx.fillStyle = c.petal
  ctx.beginPath()
  ctx.arc(8, 6, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(5, 8, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(11, 8, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(6, 11, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(10, 11, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = c.center
  ctx.beginPath()
  ctx.arc(8, 9, 2.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#228b22'
  ctx.fillRect(7, 12, 2, 4)

  tileCache.set(key, canvas)
  return canvas
}

const particles = []

function createParticle(x, y, type) {
  particles.push({
    x, y,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 2 - 1,
    life: 1,
    type,
    size: 2 + Math.random() * 3
  })
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
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
      ctx.fillStyle = '#ffff88'
    } else if (p.type === 'dust') {
      ctx.fillStyle = '#a0a080'
    } else {
      ctx.fillStyle = '#ffffff'
    }
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
  }
  ctx.globalAlpha = 1
}

let lastCollectTime = 0

export function onCollect(x, y) {
  for (let i = 0; i < 15; i++) {
    createParticle(x, y, 'sparkle')
  }
  lastCollectTime = Date.now()
}

export function drawFCMetalslugMap(ctx, width, height, time) {
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

  const buildings = [
    { x: 0.12, y: 0.22, type: 'lit' },
    { x: 0.32, y: 0.18, type: 'dark' },
    { x: 0.58, y: 0.25, type: 'lit' },
    { x: 0.82, y: 0.20, type: 'lit' },
    { x: 0.10, y: 0.58, type: 'dark' },
    { x: 0.42, y: 0.62, type: 'lit' },
    { x: 0.68, y: 0.56, type: 'dark' },
    { x: 0.85, y: 0.60, type: 'lit' }
  ]

  for (const b of buildings) {
    const bx = width * b.x
    const by = height * b.y
    const buildingTile = drawBuildingTile(b.type, time)
    ctx.drawImage(buildingTile, bx, by)
  }

  const treePositions = []
  for (let i = 0; i < 20; i++) {
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

  for (let i = 0; i < 16; i++) {
    const px = (0.03 + i * 0.062) * width
    const py = roadY - TILE_SIZE * 1.5 + (i % 2) * TILE_SIZE * 3
    const lampTile = drawLampPostTile(time)
    ctx.drawImage(lampTile, px, py)
  }

  for (let i = 0; i < 8; i++) {
    const rx = (0.15 + i * 0.11) * width
    const ry = (0.35 + (i % 3) * 0.12) * height
    if (Math.abs(ry - roadY) > TILE_SIZE) {
      const size = 16 + (i % 3) * 8
      const rockTile = drawRockTile(size)
      ctx.drawImage(rockTile, rx, ry)
    }
  }

  for (let i = 0; i < 25; i++) {
    const fx = (0.02 + (i * 0.041) % 0.95) * width
    const fy = (0.05 + (i * 0.037) % 0.4 + (i % 2) * 0.4) * height
    if (Math.abs(fy - roadY) > TILE_SIZE * 1.5) {
      const flowerTile = drawFlowerTile(i)
      ctx.drawImage(flowerTile, fx, fy)
    }
  }

  updateParticles()
  drawParticles(ctx)

  if (Date.now() - lastCollectTime < 100) {
    const flashAlpha = 1 - (Date.now() - lastCollectTime) / 100
    ctx.fillStyle = `rgba(255, 255, 200, ${flashAlpha * 0.3})`
    ctx.fillRect(0, 0, width, height)
  }
}

export function drawTankSprite(ctx, x, y) {
  const tankTile = drawTankTile()
  ctx.drawImage(tankTile, x - TILE_SIZE / 2, y - TILE_SIZE / 2)

  if (Math.random() > 0.95) {
    createParticle(x + 4, y - 12, 'dust')
    createParticle(x - 4, y - 12, 'dust')
  }
}

export function drawCoinSprite(ctx, x, y, time) {
  const coinTile = drawCoinTile(time)
  ctx.drawImage(coinTile, x - 9, y - 9)

  ctx.globalAlpha = 0.15 + Math.sin(time * 0.005) * 0.1
  ctx.fillStyle = '#ffff00'
  ctx.beginPath()
  ctx.arc(x, y, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}