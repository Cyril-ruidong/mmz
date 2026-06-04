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
  crystal.size = 20 + Math.random() * 10
  crystal.rotation = Math.random() * Math.PI * 2
  crystal.rotationSpeed = 0.03 + Math.random() * 0.02
  crystal.floatPhase = Math.random() * Math.PI * 2
  crystal.floatSpeed = 2 + Math.random()
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

    crystal.rotation += crystal.rotationSpeed
    crystal.y = crystal.baseY + Math.sin(time * 0.003 * crystal.floatSpeed + crystal.floatPhase) * 10
  }
}

export function drawCrystals(ctx, crystals) {
  for (const crystal of crystals) {
    if (crystal.collected) continue

    ctx.save()
    ctx.translate(crystal.x, crystal.y)
    ctx.rotate(crystal.rotation)

    ctx.shadowColor = '#ffd700'
    ctx.shadowBlur = 15

    ctx.fillStyle = '#ffd700'
    ctx.beginPath()
    ctx.moveTo(0, -crystal.size)
    ctx.lineTo(crystal.size * 0.7, 0)
    ctx.lineTo(0, crystal.size)
    ctx.lineTo(-crystal.size * 0.7, 0)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#ffed4a'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.restore()
  }
}

export function getCrystalBounds(crystal) {
  const size = crystal.size * 1.5
  return {
    x: crystal.x - size / 2,
    y: crystal.y - size / 2,
    width: size,
    height: size
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
