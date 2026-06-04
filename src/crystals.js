const crystals = []
const crystalPool = []
const POOL_SIZE = 20

export function spawnCrystal(canvasWidth, canvasHeight, excludePositions = []) {
  const crystal = crystalPool.length < POOL_SIZE
    ? { collected: false, rotation: 0 }
    : crystalPool.find(c => c.collected)

  if (!crystal) return null

  let validPosition = false
  let x, y
  let attempts = 0
  const margin = 40

  while (!validPosition && attempts < 50) {
    x = margin + Math.random() * (canvasWidth - margin * 2)
    y = margin + Math.random() * (canvasHeight - margin * 2)

    validPosition = true
    for (const pos of excludePositions) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
      if (dist < 50) {
        validPosition = false
        break
      }
    }
    attempts++
  }

  crystal.x = x
  crystal.y = y
  crystal.size = 12
  crystal.rotation = 0
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

    crystal.rotation += 0.05
    crystal.y = crystal.baseY + Math.sin(time * 0.004 + crystal.floatPhase) * 3
  }
}

export function drawCrystals(ctx, crystals) {
  for (const crystal of crystals) {
    if (crystal.collected) continue

    const x = crystal.x
    const y = crystal.y
    const s = crystal.size

    ctx.save()

    ctx.fillStyle = '#c4a02a'
    ctx.fillRect(x - s / 2, y - s / 2, s, s)

    ctx.fillStyle = '#e4c04a'
    ctx.fillRect(x - s / 2, y - s / 2, s, 3)
    ctx.fillRect(x - s / 2, y - s / 2, 3, s)

    ctx.fillStyle = '#8a701a'
    ctx.fillRect(x + s / 2 - 3, y - s / 2, 3, s)
    ctx.fillRect(x - s / 2, y + s / 2 - 3, s, 3)

    ctx.fillStyle = '#f4d05a'
    ctx.fillRect(x - 2, y - 2, 4, 4)

    ctx.restore()
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
  crystal.collected = true
  const index = crystals.indexOf(crystal)
  if (index > -1) {
    crystals.splice(index, 1)
  }
}

export function getActiveCrystals() {
  return crystals.filter(c => !c.collected)
}
