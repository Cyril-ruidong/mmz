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
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, width, height)
}

export function drawCityBackground(ctx, width, height, time) {
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, width, height)

  const horizonY = height * 0.65

  const gradient = ctx.createLinearGradient(0, horizonY - 100, 0, horizonY)
  gradient.addColorStop(0, '#1a0a2e')
  gradient.addColorStop(1, '#2d1b4e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, horizonY - 100, width, 100)

  const buildings = []
  const buildingCount = Math.ceil(width / 60) + 5

  for (let i = 0; i < buildingCount; i++) {
    buildings.push({
      x: i * 60 - 100 + Math.sin(i * 12.34) * 20,
      width: 30 + Math.random() * 40,
      height: 80 + Math.random() * 200,
      color: `hsl(${240 + Math.random() * 20}, 30%, ${8 + Math.random() * 12}%)`,
      windows: Math.floor(Math.random() * 8) + 3,
      windowLit: Math.random() > 0.3
    })
  }

  for (const building of buildings) {
    const buildingY = horizonY - building.height

    ctx.fillStyle = building.color
    ctx.fillRect(building.x, buildingY, building.width, building.height)

    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(building.x - 2, buildingY - 5, building.width + 4, 5)

    if (building.windowLit) {
      const windowRows = Math.floor(building.height / 20)
      const windowCols = Math.floor(building.width / 15)

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const wx = building.x + 5 + col * 15
          const wy = buildingY + 10 + row * 20

          const isLit = Math.sin(time * 0.001 + row + col + building.x) > -0.3

          if (isLit) {
            ctx.fillStyle = `rgba(255, ${180 + Math.random() * 75}, ${50 + Math.random() * 50}, 0.8)`
            ctx.shadowColor = '#ffaa00'
            ctx.shadowBlur = 5
          } else {
            ctx.fillStyle = '#1a1a2e'
            ctx.shadowBlur = 0
          }

          ctx.fillRect(wx, wy, 8, 10)
        }
      }
      ctx.shadowBlur = 0
    }
  }

  ctx.fillStyle = '#2d1b4e'
  ctx.fillRect(0, horizonY, width, height - horizonY)

  ctx.strokeStyle = '#00f5ff'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.3

  const roadWidth = width * 0.3
  const roadX = (width - roadWidth) / 2

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(roadX, horizonY, roadWidth, height - horizonY)

  ctx.setLineDash([20, 20])
  ctx.beginPath()
  ctx.moveTo(width / 2, horizonY)
  ctx.lineTo(width / 2, height)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.globalAlpha = 1

  const starCount = 50
  ctx.fillStyle = '#ffffff'

  for (let i = 0; i < starCount; i++) {
    const x = (Math.sin(i * 1234.5 + time * 0.0001) * 0.5 + 0.5) * width
    const y = (Math.cos(i * 5678.9 + time * 0.0001) * 0.5 + 0.5) * horizonY * 0.7
    const size = (Math.sin(i * 9012.3 + time * 0.002) * 0.5 + 0.5) * 1.5 + 0.5

    ctx.globalAlpha = 0.3 + Math.sin(i + time * 0.003) * 0.3
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}
