export function createPlayer(ctx) {
  return {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    size: 24,
    targetX: ctx.canvas.width / 2,
    targetY: ctx.canvas.height / 2,
    speed: 0.12
  }
}

export function updatePlayer(player, mouseX, mouseY, canvasWidth, canvasHeight) {
  player.targetX = mouseX * canvasWidth
  player.targetY = mouseY * canvasHeight

  const dx = player.targetX - player.x
  const dy = player.targetY - player.y

  player.x += dx * player.speed
  player.y += dy * player.speed
}

export function drawPlayer(ctx, player) {
  const x = player.x
  const y = player.y
  const s = player.size

  ctx.save()

  ctx.fillStyle = '#4a7a2a'
  ctx.fillRect(x - s / 2, y - s / 2, s, s)

  ctx.fillStyle = '#3a5a1a'
  ctx.fillRect(x - s / 2, y - s / 2, s, 4)
  ctx.fillRect(x - s / 2, y + s / 2 - 4, s, 4)

  ctx.fillStyle = '#2a3a1a'
  ctx.fillRect(x - s / 2, y - s / 2, 4, s)
  ctx.fillRect(x + s / 2 - 4, y - s / 2, 4, s)

  ctx.fillStyle = '#5a8a3a'
  ctx.fillRect(x - 6, y - 8, 12, 12)

  ctx.fillStyle = '#3a5a1a'
  ctx.fillRect(x - 2, y - 6, 4, 20)

  ctx.fillStyle = '#2a4a1a'
  ctx.fillRect(x - 2, y + 12, 4, 4)

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
