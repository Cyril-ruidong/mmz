import './style.css'
import { createGameCanvas, drawScene, createNPCs, updateNPCs, drawNPCs, drawTankSprite, getNPCs } from './scene.js'
import { createPlayer, updatePlayer, drawPlayer, getPlayerBounds, toggleVehicle } from './player.js'
import { spawnCrystal, updateCrystals, drawCrystals, getCrystalBounds, collectCrystal, getActiveCrystals } from './crystals.js'
import { checkPlayerCrystalCollision } from './collision.js'
import { updateScore, hideGameTip, updateToggleBtn } from './ui.js'
import { startIntro, talkToNPC, collectCrystal as collectCrystalStory, getMissionProgress } from './story.js'
import { initUI, updateDialog, updateMissionUI, showStartScreen } from './storyUI.js'
import { currentScene, switchScene, exitBuilding, checkEnterBuilding, checkExitBuilding, SCENES } from './scenes.js'

const INITIAL_CRYSTALS = 6
const NPC_COUNT = 6
const CRYSTAL_RESPAWN_DELAY = 600

const container = document.getElementById('game-container')
const { canvas, ctx } = createGameCanvas(container)

const player = createPlayer(ctx)
createNPCs(NPC_COUNT)

const mouse = { x: 0.5, y: 0.5 }
let lastClickTime = 0

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

function onCanvasClick(event) {
  const now = Date.now()
  if (now - lastClickTime < 300) return
  lastClickTime = now
  
  const clickX = event.clientX || event.touches?.[0]?.clientX
  const clickY = event.clientY || event.touches?.[0]?.clientY
  
  if (currentScene.isInterior) {
    if (checkExitBuilding(clickX, clickY, canvas.width, canvas.height)) {
      const pos = exitBuilding(clickX, clickY, canvas.width, canvas.height)
      player.x = pos.x
      player.y = pos.y
      player.tankX = pos.x
      player.tankY = pos.y
    }
    return
  }
  
  const building = checkEnterBuilding(clickX, clickY, canvas.width, canvas.height)
  if (building && building.enterable) {
    switchScene(building.interior)
    return
  }
  
  const npcs = getNPCs()
  for (let i = 0; i < npcs.length; i++) {
    const npc = npcs[i]
    const dist = Math.sqrt(
      (clickX - npc.x) ** 2 +
      (clickY - npc.y) ** 2
    )
    if (dist < 50) {
      talkToNPC(npc.type, `npc_${i}`)
      break
    }
  }
}

canvas.addEventListener('click', onCanvasClick)
canvas.addEventListener('touchstart', onCanvasClick, { passive: true })
document.addEventListener('mousemove', onMouseMove)
document.addEventListener('touchstart', onTouchStart, { passive: true })
document.addEventListener('touchmove', onMouseMove, { passive: true })

const toggleBtn = document.getElementById('toggle-vehicle-btn')
toggleBtn.addEventListener('click', () => {
  toggleVehicle(player)
  updateToggleBtn(player)
})

for (let i = 0; i < INITIAL_CRYSTALS; i++) {
  spawnCrystal(canvas.width, canvas.height, [])
}

function checkCollisions() {
  if (currentScene.isInterior) return
  
  const playerBox = getPlayerBounds(player)
  const activeCrystals = getActiveCrystals()

  for (const crystal of activeCrystals) {
    if (crystal.collected) continue

    const crystalBox = getCrystalBounds(crystal)

    if (checkPlayerCrystalCollision(playerBox, crystalBox)) {
      collectCrystal(crystal)
      collectCrystalStory()
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

  drawScene(ctx, currentScene, canvas.width, canvas.height, currentTime)

  if (!currentScene.isInterior) {
    updateNPCs(canvas.width, canvas.height, currentTime)
    drawNPCs(ctx, currentTime)

    if (!player.isInTank) {
      drawTankSprite(ctx, player.tankX, player.tankY, false)
    }
  }

  updatePlayer(player, mouse.x, mouse.y, canvas.width, canvas.height)
  updateCrystals(getActiveCrystals(), currentTime, canvas.height)

  checkCollisions()

  drawCrystals(ctx, getActiveCrystals(), currentTime)
  
  if (player.isInTank) {
    drawTankSprite(ctx, player.x, player.y, true)
  }
  
  drawPlayer(ctx, player)
  
  updateToggleBtn(player)
  
  updateDialog()
  updateMissionUI()
}

initUI()

showStartScreen().then(() => {
  setTimeout(() => {
    startIntro()
  }, 500)
  
  setTimeout(() => {
    hideGameTip()
  }, 5000)
  
  animate(0)
})
