import './style.css'
import { createScene } from './scene.js'
import { createPlayer, updatePlayer, getPlayerBoundingBox } from './player.js'
import { spawnCrystal, updateCrystals, getCrystalBoundingBox, collectCrystal, getActiveCrystals } from './crystals.js'
import { checkPlayerCrystalCollision } from './collision.js'
import { updateScore, hideGameTip } from './ui.js'

const INITIAL_CRYSTALS = 5
const CRYSTAL_RESPAWN_DELAY = 500

const container = document.getElementById('game-container')
const { scene, camera, renderer } = createScene(container)

const player = createPlayer(scene)

const mouse = { x: 0, z: 0 }
let isPointerLocked = false

function onMouseMove(event) {
  if (event.touches) {
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1
    mouse.z = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
  } else {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.z = -(event.clientY / window.innerHeight) * 2 + 1
  }
}

function onTouchStart(event) {
  onMouseMove(event)
}

document.addEventListener('mousemove', onMouseMove)
document.addEventListener('touchstart', onTouchStart, { passive: true })
document.addEventListener('touchmove', onMouseMove, { passive: true })

for (let i = 0; i < INITIAL_CRYSTALS; i++) {
  spawnCrystal(scene, 18, [])
}

function checkCollisions() {
  const playerBox = getPlayerBoundingBox(player)
  const activeCrystals = getActiveCrystals()

  for (const crystal of activeCrystals) {
    if (!crystal.visible) continue

    const crystalBox = getCrystalBoundingBox(crystal)

    if (checkPlayerCrystalCollision(playerBox, crystalBox)) {
      collectCrystal(crystal)
      updateScore(parseInt(document.getElementById('score-value').textContent) + 1)

      setTimeout(() => {
        const activePositions = getActiveCrystals().map(c => ({
          x: c.position.x,
          z: c.position.z
        }))
        spawnCrystal(scene, 18, activePositions)
      }, CRYSTAL_RESPAWN_DELAY)
    }
  }
}

function updateCamera() {
  const targetX = player.mesh.position.x * 0.3
  const targetZ = player.mesh.position.z * 0.3

  camera.position.x += (targetX - camera.position.x) * 0.05
  camera.position.z += (15 + targetZ - camera.position.z) * 0.05

  camera.lookAt(
    player.mesh.position.x * 0.5,
    0,
    player.mesh.position.z * 0.5
  )
}

let hideTipTimeout = setTimeout(() => {
  hideGameTip()
}, 5000)

let lastTime = 0
function animate(currentTime) {
  requestAnimationFrame(animate)

  const time = currentTime * 0.001

  updatePlayer(player, mouse.x, mouse.z)
  updateCrystals(getActiveCrystals(), time)
  checkCollisions()
  updateCamera()

  renderer.render(scene, camera)
}

animate(0)
