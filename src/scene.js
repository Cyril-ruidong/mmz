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

export function drawMetalslugCity(ctx, width, height, time) {
  const pixelSize = 4
  const horizonY = height * 0.5

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const noise = Math.sin(x * 0.1 + y * 0.1 + time * 0.0005) * 0.5 + 0.5
      const r = 45 + noise * 20
      const g = 35 + noise * 15
      const b = 28 + noise * 10
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(x, y, pixelSize, pixelSize)
    }
  }

  const groundY = horizonY + 20
  for (let y = groundY; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const shade = ((x + y) % 20 < 10) ? 0 : 8
      ctx.fillStyle = `rgb(${60 + shade}, ${50 + shade}, ${40 + shade})`
      ctx.fillRect(x, y, pixelSize, pixelSize)
    }
  }

  const ruins = [
    { x: 0.05, w: 0.12, h: 0.25, damaged: true },
    { x: 0.2, w: 0.08, h: 0.18, damaged: false },
    { x: 0.35, w: 0.15, h: 0.3, damaged: true },
    { x: 0.55, w: 0.1, h: 0.22, damaged: false },
    { x: 0.7, w: 0.18, h: 0.28, damaged: true },
    { x: 0.88, w: 0.1, h: 0.2, damaged: false }
  ]

  for (const ruin of ruins) {
    const bx = width * ruin.x
    const bw = width * ruin.w
    const bh = height * ruin.h
    const by = groundY - bh

    const baseColor = ruin.damaged ? '#4a4035' : '#5a5045'
    drawPixelRect(ctx, bx, by, bw, bh, baseColor)

    drawPixelRect(ctx, bx, by, bw, pixelSize, '#3a3530')

    for (let wy = by + pixelSize * 2; wy < groundY - pixelSize * 2; wy += pixelSize * 8) {
      for (let wx = bx + pixelSize * 2; wx < bx + bw - pixelSize * 4; wx += pixelSize * 6) {
        if (Math.random() > 0.3) {
          drawPixelRect(ctx, wx, wy, pixelSize * 3, pixelSize * 4, '#2a2520')
        }
      }
    }

    if (ruin.damaged) {
      const crackX = bx + bw * 0.3
      const crackY = by + bh * 0.2
      drawPixelRect(ctx, crackX, crackY, pixelSize, pixelSize * 15, '#2a2520')
      drawPixelRect(ctx, crackX + pixelSize * 2, crackY + pixelSize * 5, pixelSize, pixelSize * 8, '#2a2520')
      drawPixelRect(ctx, crackX - pixelSize * 2, crackY + pixelSize * 8, pixelSize, pixelSize * 6, '#2a2520')
    }
  }

  for (let i = 0; i < 8; i++) {
    const tx = width * (0.1 + i * 0.12)
    const th = pixelSize * (8 + Math.sin(i * 2.5) * 3)
    const ty = groundY - th

    drawPixelRect(ctx, tx, ty, pixelSize * 2, th, '#5a4a3a')
    drawPixelRect(ctx, tx - pixelSize * 2, ty - pixelSize * 2, pixelSize * 6, pixelSize * 3, '#4a4035')
  }

  for (let i = 0; i < 5; i++) {
    const sx = width * (0.15 + i * 0.18)
    const sy = horizonY + 40 + (i % 2) * 20
    const sw = pixelSize * (3 + i % 2)
    const sh = pixelSize * (2 + i % 3)

    drawPixelRect(ctx, sx, sy, sw, sh, '#3a3530')
  }

  const barrelX = width * 0.75
  const barrelY = groundY - pixelSize * 6
  drawPixelRect(ctx, barrelX, barrelY, pixelSize * 4, pixelSize * 6, '#4a4540')
  drawPixelRect(ctx, barrelX - pixelSize, barrelY - pixelSize * 2, pixelSize * 6, pixelSize * 2, '#5a5550')

  for (let i = 0; i < 3; i++) {
    const px = width * (0.25 + i * 0.25)
    const py = groundY - pixelSize * 12

    drawPixelRect(ctx, px, py, pixelSize * 8, pixelSize * 12, '#4a5550')
    drawPixelRect(ctx, px + pixelSize * 2, py - pixelSize * 4, pixelSize * 4, pixelSize * 4, '#3a4540')
  }

  const cloudOffset = (time * 0.01) % width
  for (let i = 0; i < 4; i++) {
    const cx = ((i * 0.3 + cloudOffset / width) % 1) * width
    const cy = height * (0.08 + i * 0.03)

    ctx.fillStyle = 'rgba(80, 70, 60, 0.5)'
    ctx.beginPath()
    ctx.arc(cx, cy, 20 + i * 5, 0, Math.PI * 2)
    ctx.arc(cx + 15, cy - 5, 15 + i * 3, 0, Math.PI * 2)
    ctx.arc(cx + 30, cy, 18 + i * 4, 0, Math.PI * 2)
    ctx.fill()
  }

  const horizonGradient = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 20)
  horizonGradient.addColorStop(0, 'rgba(90, 70, 50, 0)')
  horizonGradient.addColorStop(0.5, 'rgba(70, 55, 40, 0.3)')
  horizonGradient.addColorStop(1, 'rgba(50, 40, 30, 0.5)')
  ctx.fillStyle = horizonGradient
  ctx.fillRect(0, horizonY - 60, width, 80)
}
