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

function drawPixelRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h))
}

const FC_COLORS = {
  grass1: '#4a8c23',
  grass2: '#3a6c18',
  dirt1: '#c4a06a',
  dirt2: '#a08050',
  water1: '#4a7cc4',
  water2: '#3a6ca0',
  wall1: '#8c8c8c',
  wall2: '#6c6c6c',
  roof1: '#c44a4a',
  roof2: '#a03a3a',
  tree1: '#2a5a1a',
  tree2: '#4a9a2a',
  road1: '#a09080',
  road2: '#807060',
  sky: '#8ab4f8',
  cloud: '#ffffff'
}

export function drawFCMetalslugMap(ctx, width, height, time) {
  const tileSize = 16
  const gridW = Math.ceil(width / tileSize) + 2
  const gridH = Math.ceil(height / tileSize) + 2

  const seed = 12345
  function random(x, y) {
    return Math.sin(seed + x * 123.456 + y * 789.012) * 0.5 + 0.5
  }

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const x = gx * tileSize
      const y = gy * tileSize
      const r = random(gx, gy)

      let baseColor
      if (r < 0.7) {
        baseColor = r < 0.35 ? FC_COLORS.grass1 : FC_COLORS.grass2
      } else if (r < 0.85) {
        baseColor = r < 0.775 ? FC_COLORS.dirt1 : FC_COLORS.dirt2
      } else {
        baseColor = r < 0.925 ? FC_COLORS.water1 : FC_COLORS.water2
      }

      drawPixelRect(ctx, x, y, tileSize, tileSize, baseColor)

      if (r < 0.7 && random(gx + 100, gy + 100) < 0.08) {
        drawPixelRect(ctx, x + 4, y + 6, 2, 6, FC_COLORS.tree1)
        drawPixelRect(ctx, x + 6, y + 4, 2, 8, FC_COLORS.tree1)
        drawPixelRect(ctx, x + 8, y + 6, 2, 6, FC_COLORS.tree1)
        drawPixelRect(ctx, x + 3, y + 2, 4, 4, FC_COLORS.tree2)
        drawPixelRect(ctx, x + 7, y + 2, 4, 4, FC_COLORS.tree2)
        drawPixelRect(ctx, x + 5, y, 2, 4, FC_COLORS.tree2)
      }
    }
  }

  const roadY = Math.floor(height / tileSize / 2) * tileSize
  for (let x = 0; x < width; x += tileSize) {
    const roadColor = (x / tileSize) % 2 === 0 ? FC_COLORS.road1 : FC_COLORS.road2
    drawPixelRect(ctx, x, roadY - tileSize, tileSize, tileSize * 2, roadColor)
    drawPixelRect(ctx, x, roadY + tileSize, tileSize, tileSize * 2, roadColor)
  }

  const buildings = [
    { x: 0.15, y: 0.25, w: 3, h: 3 },
    { x: 0.35, y: 0.2, w: 4, h: 4 },
    { x: 0.6, y: 0.28, w: 3, h: 3 },
    { x: 0.8, y: 0.22, w: 2, h: 3 },
    { x: 0.12, y: 0.6, w: 4, h: 3 },
    { x: 0.45, y: 0.65, w: 3, h: 4 },
    { x: 0.7, y: 0.58, w: 2, h: 3 },
    { x: 0.88, y: 0.62, w: 3, h: 3 }
  ]

  for (const b of buildings) {
    const bx = width * b.x
    const by = height * b.y
    const bw = b.w * tileSize
    const bh = b.h * tileSize

    drawPixelRect(ctx, bx, by, bw, bh, FC_COLORS.wall1)
    drawPixelRect(ctx, bx + 2, by + 2, bw - 4, bh - 4, FC_COLORS.wall2)
    drawPixelRect(ctx, bx, by, bw, tileSize / 2, FC_COLORS.roof1)
    drawPixelRect(ctx, bx + tileSize / 2, by - tileSize / 2, bw - tileSize, tileSize / 2, FC_COLORS.roof2)

    for (let wy = by + tileSize; wy < by + bh - tileSize; wy += tileSize) {
      for (let wx = bx + tileSize / 2; wx < bx + bw - tileSize / 2; wx += tileSize) {
        drawPixelRect(ctx, wx + 2, wy + 2, 6, 6, '#4a6a8a')
        drawPixelRect(ctx, wx + 3, wy + 3, 4, 4, '#6a8aaa')
      }
    }
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

    drawPixelRect(ctx, tx + 8, ty + 12, 4, 8, '#6a4a2a')
    drawPixelRect(ctx, tx + 4, ty + 2, 12, 12, FC_COLORS.tree2)
    drawPixelRect(ctx, tx + 6, ty, 8, 4, FC_COLORS.tree1)
    drawPixelRect(ctx, tx + 2, ty + 6, 4, 4, FC_COLORS.tree1)
    drawPixelRect(ctx, tx + 14, ty + 6, 4, 4, FC_COLORS.tree1)
  }

  for (let i = 0; i < 12; i++) {
    const px = (0.05 + i * 0.08) * width
    const py = roadY - 24 + (i % 2) * 48

    drawPixelRect(ctx, px, py, 8, 20, '#4a4a4a')
    drawPixelRect(ctx, px + 2, py - 4, 4, 6, '#6a6a6a')
    drawPixelRect(ctx, px - 2, py - 6, 12, 4, '#aaaaaa')
  }
}
