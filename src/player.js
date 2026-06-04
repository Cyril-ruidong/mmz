export function createPlayer(ctx) {
  return {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    size: 30,
    targetX: ctx.canvas.width / 2,
    targetY: ctx.canvas.height / 2,
    speed: 0.1,
    rotation: 0,
    glowPhase: 0
  }
}

export function updatePlayer(player, mouseX, mouseY, canvasWidth, canvasHeight) {
  player.targetX = mouseX * canvasWidth
  player.targetY = mouseY * canvasHeight

  const dx = player.targetX - player.x
  const dy = player.targetY - player.y

  player.x += dx * player.speed
  player.y += dy * player.speed

  player.rotation += 0.02
  player.glowPhase += 0.05
}

export function drawPlayer(ctx, player) {
  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.rotate(player.rotation)

  const glowIntensity = 0.5 + Math.sin(player.glowPhase) * 0.3

  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 20 * glowIntensity

  ctx.fillStyle = '#00f5ff'
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size)

  ctx.strokeStyle = '#ff2d95'
  ctx.lineWidth = 3
  ctx.strokeRect(-player.size / 2, -player.size / 2, player.size, player.size)

  ctx.shadowBlur = 0
  ctx.restore()
}

export function getPlayerBounds(player) {
  return {
    x: player.x - player.size / 2,
    y: player.y - player.size / 2,
    width: player.size,
    height: player.size
  }
}
