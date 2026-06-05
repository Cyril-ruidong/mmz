import { drawTankSprite } from './scene.js'

export function createPlayer(ctx) {
  return {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    size: 32,
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
  drawTankSprite(ctx, player.x, player.y)
}

export function getPlayerBounds(player) {
  return {
    x: player.x - player.size / 2,
    y: player.y - player.size / 2,
    width: player.size,
    height: player.size
  }
}