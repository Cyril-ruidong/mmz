import { drawCoinSprite, onCollect } from './scene.js'

const crystals = []
const crystalPool = []
const POOL_SIZE = 20

export function spawnCrystal(canvasWidth, canvasHeight, excludePositions = []) {
  const crystal = crystalPool.length < POOL_SIZE
    ? { collected: false }
    : crystalPool.find(c => c.collected)

  if (!crystal) return null

  let validPosition = false
  let x, y
  let attempts = 0
  const margin = 50

  while (!validPosition && attempts < 50) {
    x = margin + Math.random() * (canvasWidth - margin * 2)
    y = margin + Math.random() * (canvasHeight - margin * 2)

    validPosition = true
    for (const pos of excludePositions) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
      if (dist < 60) {
        validPosition = false
        break
      }
    }
    attempts++
  }

  crystal.x = x
  crystal.y = y
  crystal.size = 18
  crystal.floatPhase = Math.random() * Math.PI * 2
  crystal.collected = false
  crystal.baseY = y

  if (!crystalPool.includes(crystal)) {
    crystalPool.push(crystal)
  }
  if (!crystals.includes(crystal)) {
    crystals.push(crystal)
  }

  return crystal
}

export function updateCrystals(crystals, time, canvasHeight) {
  for (const crystal of crystals) {
    if (crystal.collected) continue

    crystal.y = crystal.baseY + Math.sin(time * 0.004 + crystal.floatPhase) * 5
  }
}

export function drawCrystals(ctx, crystals, time) {
  for (const crystal of crystals) {
    if (crystal.collected) continue

    drawCoinSprite(ctx, crystal.x, crystal.y, time)
  }
}

export function getCrystalBounds(crystal) {
  return {
    x: crystal.x - crystal.size / 2,
    y: crystal.y - crystal.size / 2,
    width: crystal.size,
    height: crystal.size
  }
}

export function collectCrystal(crystal) {
  onCollect(crystal.x, crystal.y)
  crystal.collected = true
  const index = crystals.indexOf(crystal)
  if (index > -1) {
    crystals.splice(index, 1)
  }
}

export function getActiveCrystals() {
  return crystals.filter(c => !c.collected)
}