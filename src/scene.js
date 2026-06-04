export function createGameCanvas(container) {
  const canvas = document.createElement('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  container.appendChild(canvas)

  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  window.addEventListener('resize', resize)

  return { canvas, ctx, resize }
}

export function clearCanvas(ctx, width, height) {
  ctx.fillStyle = '#1a0a2e'
  ctx.fillRect(0, 0, width, height)
}

export function drawGrid(ctx, width, height) {
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)'
  ctx.lineWidth = 1

  const gridSize = 40

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

export function drawStarfield(ctx, width, height, time) {
  const starCount = 100
  ctx.fillStyle = '#ffffff'

  for (let i = 0; i < starCount; i++) {
    const x = (Math.sin(i * 1234.5 + time * 0.0001) * 0.5 + 0.5) * width
    const y = (Math.cos(i * 5678.9 + time * 0.0001) * 0.5 + 0.5) * height
    const size = (Math.sin(i * 9012.3 + time * 0.002) * 0.5 + 0.5) * 2 + 0.5

    ctx.globalAlpha = 0.3 + Math.sin(i + time * 0.003) * 0.3
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
