import './style.css'
import { createGameCanvas, drawFCMetalslugMap, createNPCs, updateNPCs, drawNPCs, drawTankSprite } from './scene.js'
import { createPlayer, updatePlayer, drawPlayer, getPlayerBounds, toggleVehicle, isNearTank } from './player.js'
import { spawnCrystal, updateCrystals, drawCrystals, getCrystalBounds, collectCrystal, getActiveCrystals } from './crystals.js'
import { checkPlayerCrystalCollision } from './collision.js'
import { updateScore, hideGameTip, updateToggleBtn } from './ui.js'

const INITIAL_CRYSTALS = 6
const NPC_COUNT = 6
const CRYSTAL_RESPAWN_DELAY = 600

const container = document.getElementById('game-container')
const { canvas, ctx } = createGameCanvas(container)

const player = createPlayer(ctx)
createNPCs(NPC_COUNT)

const mouse = { x: 0.5, y: 0.5 }

function onMouseMove(event) {
  if (event.touches) {
    mouse.x = event.touches[0].clientX / window.innerWidth
    mouse.y = event.touches[0].clientY / window.innerHeight
  } else {
    mouse.x = event.clientX / window.innerWidth
    mouse.y = event.clientY / window.innerHeight
  }
}

function onTouchStart(event) {
  onMouseMove(event)
}

document.addEventListener('mousemove', onMouseMove)
document.addEventListener('touchstart', onTouchStart, { passive: true })
document.addEventListener('touchmove', onMouseMove, { passive: true })

// 上下车按钮
const toggleBtn = document.getElementById('toggle-vehicle-btn')
toggleBtn.addEventListener('click', () => {
  toggleVehicle(player)
  updateToggleBtn(player)
})

for (let i = 0; i < INITIAL_CRYSTALS; i++) {
  spawnCrystal(canvas.width, canvas.height, [])
}

function checkCollisions() {
  const playerBox = getPlayerBounds(player)
  const activeCrystals = getActiveCrystals()

  for (const crystal of activeCrystals) {
    if (crystal.collected) continue

    const crystalBox = getCrystalBounds(crystal)

    if (checkPlayerCrystalCollision(playerBox, crystalBox)) {
      collectCrystal(crystal)
      updateScore(parseInt(document.getElementById('score-value').textContent) + 1)

      setTimeout(() => {
        const activePositions = getActiveCrystals().map(c => ({
          x: c.x,
          y: c.y
        }))
        spawnCrystal(canvas.width, canvas.height, activePositions)
      }, CRYSTAL_RESPAWN_DELAY)
    }
  }
}

function animate(currentTime) {
  requestAnimationFrame(animate)

  drawFCMetalslugMap(ctx, canvas.width, canvas.height, currentTime)

  updateNPCs(canvas.width, canvas.height, currentTime)
  drawNPCs(ctx, currentTime)

  // 始终绘制坦克（即使玩家不在里面）
  if (!player.isInTank) {
    drawTankSprite(ctx, player.tankX, player.tankY, false)
  }

  updatePlayer(player, mouse.x, mouse.y, canvas.width, canvas.height)
  updateCrystals(getActiveCrystals(), currentTime, canvas.height)

  checkCollisions()

  drawCrystals(ctx, getActiveCrystals(), currentTime)
  
  if (player.isInTank) {
    drawTankSprite(ctx, player.x, player.y, true)
  }
  
  drawPlayer(ctx, player)
  
  // 更新按钮状态
  updateToggleBtn(player)
}

setTimeout(() => {
  hideGameTip()
}, 5000)

animate(0)