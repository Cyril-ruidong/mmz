import './style.css'
import { createGameCanvas, drawFCMetalslugMap } from './scene.js'
import { createPlayer, updatePlayer, drawPlayer, getPlayerBounds } from './player.js'
import { spawnCrystal, updateCrystals, drawCrystals, getCrystalBounds, collectCrystal, getActiveCrystals } from './crystals.js'
import { checkPlayerCrystalCollision } from './collision.js'
import { updateScore, hideGameTip } from './ui.js'

const INITIAL_CRYSTALS = 5
const CRYSTAL_RESPAWN_DELAY = 500

const container = document.getElementById('game-container')
const { canvas, ctx } = createGameCanvas(container)

const player = createPlayer(ctx)

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

  updatePlayer(player, mouse.x, mouse.y, canvas.width, canvas.height)
  updateCrystals(getActiveCrystals(), currentTime, canvas.height)

  checkCollisions()

  drawCrystals(ctx, getActiveCrystals())
  drawPlayer(ctx, player)
}

setTimeout(() => {
  hideGameTip()
}, 5000)

animate(0)
