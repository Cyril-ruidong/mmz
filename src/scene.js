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

function drawGrassTile() {
  const key = 'grass'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#4a8c23'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#3a6c18'
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(Math.random() * TILE_SIZE)
    const y = Math.floor(Math.random() * TILE_SIZE)
    ctx.fillRect(x, y, 2, 2)
  }

  ctx.fillStyle = '#5a9a2a'
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(Math.random() * TILE_SIZE)
    const y = Math.floor(Math.random() * TILE_SIZE)
    ctx.fillRect(x, y, 1, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawDirtTile() {
  const key = 'dirt'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#c4a06a'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#a08050'
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(Math.random() * TILE_SIZE)
    const y = Math.floor(Math.random() * TILE_SIZE)
    ctx.fillRect(x, y, 3, 2)
  }

  ctx.fillStyle = '#d4b07a'
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(Math.random() * TILE_SIZE)
    const y = Math.floor(Math.random() * TILE_SIZE)
    ctx.fillRect(x, y, 2, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawWaterTile(time) {
  const key = 'water_' + Math.floor(time / 200)
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  const waveOffset = (time % 400) / 400

  ctx.fillStyle = '#4a7cc4'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#3a6ca0'
  for (let y = 0; y < TILE_SIZE; y += 4) {
    const waveX = Math.sin((y + waveOffset * TILE_SIZE) * 0.3) * 2
    ctx.fillRect(waveX + 2, y, 4, 2)
    ctx.fillRect(waveX + 12, y + 2, 4, 2)
    ctx.fillRect(waveX + 22, y, 4, 2)
  }

  ctx.fillStyle = '#5a8cd4'
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(Math.random() * TILE_SIZE)
    const y = Math.floor(Math.random() * TILE_SIZE)
    ctx.fillRect(x, y, 2, 1)
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawRoadTile() {
  const key = 'road'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#a09080'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#807060'
  ctx.fillRect(0, 0, TILE_SIZE, 2)
  ctx.fillRect(0, TILE_SIZE - 2, TILE_SIZE, 2)

  ctx.fillStyle = '#c0b0a0'
  ctx.fillRect(14, 4, 4, TILE_SIZE - 8)

  tileCache.set(key, canvas)
  return canvas
}

function drawBuildingTile(type) {
  const key = 'building_' + type
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE * 3, TILE_SIZE * 3)

  ctx.fillStyle = '#8c8c8c'
  ctx.fillRect(0, 0, TILE_SIZE * 3, TILE_SIZE * 3)

  ctx.fillStyle = '#6c6c6c'
  for (let y = 4; y < TILE_SIZE * 3; y += 8) {
    ctx.fillRect(0, y, TILE_SIZE * 3, 2)
  }

  ctx.fillStyle = '#4c4c4c'
  ctx.fillRect(0, 0, TILE_SIZE * 3, 4)

  ctx.fillStyle = '#c44a4a'
  ctx.fillRect(4, 0, TILE_SIZE * 3 - 8, 8)

  ctx.fillStyle = '#a03a3a'
  ctx.fillRect(8, 4, TILE_SIZE * 3 - 16, 4)

  const windowColor = type === 'lit' ? '#f8f800' : '#4a6a8a'
  const windowInner = type === 'lit' ? '#f8f0a0' : '#3a5a7a'

  for (let wy = 16; wy < TILE_SIZE * 3 - 8; wy += 12) {
    for (let wx = 8; wx < TILE_SIZE * 3 - 8; wx += 12) {
      ctx.fillStyle = windowColor
      ctx.fillRect(wx, wy, 8, 8)
      ctx.fillStyle = windowInner
      ctx.fillRect(wx + 2, wy + 2, 4, 4)
    }
  }

  tileCache.set(key, canvas)
  return canvas
}

function drawTreeTile() {
  const key = 'tree'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#4a8c23'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#6a4a2a'
  ctx.fillRect(14, 20, 4, 12)

  ctx.fillStyle = '#2a5a1a'
  ctx.beginPath()
  ctx.arc(16, 12, 10, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#3a6a2a'
  ctx.beginPath()
  ctx.arc(12, 14, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(20, 14, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#4a8a3a'
  ctx.beginPath()
  ctx.arc(16, 10, 4, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

function drawTankTile(direction) {
  const key = 'tank_' + direction
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = '#4a7a2a'
  ctx.fillRect(4, 6, 24, 20)

  ctx.fillStyle = '#3a5a1a'
  ctx.fillRect(4, 6, 24, 3)
  ctx.fillRect(4, 23, 24, 3)

  ctx.fillStyle = '#5a8a3a'
  ctx.fillRect(8, 10, 16, 12)

  ctx.fillStyle = '#2a4a1a'
  ctx.fillRect(4, 6, 3, 20)
  ctx.fillRect(25, 6, 3, 20)

  ctx.fillStyle = '#3a5a1a'
  ctx.fillRect(14, 2, 4, 28)

  ctx.fillStyle = '#2a3a1a'
  ctx.fillRect(14, 0, 4, 4)

  ctx.fillStyle = '#5a8a3a'
  ctx.fillRect(10, 12, 12, 8)

  ctx.fillStyle = '#6a9a4a'
  ctx.fillRect(12, 14, 8, 4)

  tileCache.set(key, canvas)
  return canvas
}

function drawCoinTile() {
  const key = 'coin'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(16, 16)

  ctx.fillStyle = '#c4a02a'
  ctx.beginPath()
  ctx.arc(8, 8, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e4c04a'
  ctx.beginPath()
  ctx.arc(8, 8, 5, -Math.PI * 0.3, Math.PI * 0.3)
  ctx.fill()

  ctx.fillStyle = '#8a701a'
  ctx.beginPath()
  ctx.arc(8, 8, 6, Math.PI * 0.7, Math.PI * 1.3)
  ctx.fill()

  ctx.fillStyle = '#f4d05a'
  ctx.beginPath()
  ctx.arc(6, 6, 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#a08020'
  ctx.fillRect(7, 4, 2, 8)

  tileCache.set(key, canvas)
  return canvas
}

function drawLampPostTile() {
  const key = 'lamp'
  if (tileCache.has(key)) return tileCache.get(key)

  const { canvas, ctx } = createTileCanvas(16, 32)

  ctx.fillStyle = '#4a4a4a'
  ctx.fillRect(6, 8, 4, 24)

  ctx.fillStyle = '#6a6a6a'
  ctx.fillRect(4, 6, 8, 4)

  ctx.fillStyle = '#f8f800'
  ctx.beginPath()
  ctx.arc(8, 4, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f8f0a0'
  ctx.beginPath()
  ctx.arc(8, 4, 3, 0, Math.PI * 2)
  ctx.fill()

  tileCache.set(key, canvas)
  return canvas
}

export function drawFCMetalslugMap(ctx, width, height, time) {
  const gridW = Math.ceil(width / TILE_SIZE) + 1
  const gridH = Math.ceil(height / TILE_SIZE) + 1

  const seed = 12345
  function random(x, y) {
    return Math.sin(seed + x * 123.456 + y * 789.012) * 0.5 + 0.5
  }

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const x = gx * TILE_SIZE
      const y = gy * TILE_SIZE
      const r = random(gx, gy)

      let tile
      if (r < 0.7) {
        tile = drawGrassTile()
      } else if (r < 0.85) {
        tile = drawDirtTile()
      } else {
        tile = drawWaterTile(time)
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
    { x: 0.15, y: 0.25, type: 'lit' },
    { x: 0.35, y: 0.2, type: 'dark' },
    { x: 0.6, y: 0.28, type: 'lit' },
    { x: 0.8, y: 0.22, type: 'dark' },
    { x: 0.12, y: 0.6, type: 'lit' },
    { x: 0.45, y: 0.65, type: 'dark' },
    { x: 0.7, y: 0.58, type: 'lit' },
    { x: 0.88, y: 0.62, type: 'dark' }
  ]

  for (const b of buildings) {
    const bx = width * b.x
    const by = height * b.y
    const buildingTile = drawBuildingTile(b.type)
    ctx.drawImage(buildingTile, bx, by)
  }

  const treePositions = [
    { x: 0.08, y: 0.15 },
    { x: 0.25, y: 0.1 },
    { x: 0.48, y: 0.12 },
    { x: 0.7, y: 0.15 },
    { x: 0.92, y: 0.1 },
    { x: 0.05, y: 0.45 },
    { x: 0.3, y: 0.48 },
    { x: 0.55, y: 0.42 },
    { x: 0.78, y: 0.46 },
    { x: 0.08, y: 0.78 },
    { x: 0.35, y: 0.82 },
    { x: 0.62, y: 0.78 },
    { x: 0.85, y: 0.85 }
  ]

  for (const t of treePositions) {
    const tx = width * t.x
    const ty = height * t.y
    const treeTile = drawTreeTile()
    ctx.drawImage(treeTile, tx, ty)
  }

  for (let i = 0; i < 12; i++) {
    const px = (0.05 + i * 0.08) * width
    const py = roadY - TILE_SIZE + (i % 2) * TILE_SIZE * 2
    const lampTile = drawLampPostTile()
    ctx.drawImage(lampTile, px, py)
  }
}

export function drawTankSprite(ctx, x, y, direction) {
  const tankTile = drawTankTile(direction)
  ctx.drawImage(tankTile, x - TILE_SIZE / 2, y - TILE_SIZE / 2)
}

export function drawCoinSprite(ctx, x, y) {
  const coinTile = drawCoinTile()
  ctx.drawImage(coinTile, x - 8, y - 8)
}