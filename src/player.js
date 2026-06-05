import { drawNPCHumanTile } from './scene.js'

export function createPlayer(ctx) {
  return {
    x: ctx.canvas.width / 2,
    y: ctx.canvas.height / 2,
    tankX: ctx.canvas.width / 2,
    tankY: ctx.canvas.height / 2,
    size: 20,
    targetX: ctx.canvas.width / 2,
    targetY: ctx.canvas.height / 2,
    speed: 0.12,
    isInTank: true,
    variant: 5,
    walkFrame: 0
  }
}

export function updatePlayer(player, mouseX, mouseY, canvasWidth, canvasHeight) {
  player.targetX = mouseX * canvasWidth
  player.targetY = mouseY * canvasHeight

  const speed = player.isInTank ? 0.18 : 0.10
  const dx = player.targetX - player.x
  const dy = player.targetY - player.y

  player.x += dx * speed
  player.y += dy * speed

  // 更新坦克位置（如果在坦克中）
  if (player.isInTank) {
    player.tankX = player.x
    player.tankY = player.y
  }

  // 行走动画帧
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    player.walkFrame++
  }
}

export function drawPlayer(ctx, player) {
  if (player.isInTank) {
    // 坦克绘制在主循环中
  } else {
    // 绘制人类玩家
    const humanTile = drawNPCHumanTile(player.variant)
    ctx.save()
    ctx.translate(player.x, player.y)
    
    // 简单的行走动画
    const bounce = Math.sin(player.walkFrame * 0.3) * 2
    ctx.translate(0, bounce)
    
    ctx.drawImage(humanTile, -12, -16)
    ctx.restore()
  }
}

export function getPlayerBounds(player) {
  if (player.isInTank) {
    return {
      x: player.x - 32,
      y: player.y - 24,
      width: 64,
      height: 48
    }
  } else {
    return {
      x: player.x - 12,
      y: player.y - 16,
      width: 24,
      height: 32
    }
  }
}

export function toggleVehicle(player) {
  if (player.isInTank) {
    // 下车
    player.isInTank = false
    player.x = player.tankX + 40
    player.y = player.tankY
  } else {
    // 上车（检查是否靠近坦克）
    const dist = Math.sqrt(
      (player.x - player.tankX) ** 2 +
      (player.y - player.tankY) ** 2
    )
    if (dist < 60) {
      player.isInTank = true
      player.x = player.tankX
      player.y = player.tankY
    }
  }
}

export function isNearTank(player) {
  const dist = Math.sqrt(
    (player.x - player.tankX) ** 2 +
    (player.y - player.tankY) ** 2
  )
  return dist < 60
}