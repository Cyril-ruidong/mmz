import * as THREE from 'three'

const crystalGeometry = new THREE.OctahedronGeometry(0.6, 0)
const crystalMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  emissive: 0xffd700,
  emissiveIntensity: 0.5,
  metalness: 1,
  roughness: 0.1,
  transparent: true,
  opacity: 0.9
})

const crystals = []
const crystalPool = []
const POOL_SIZE = 20

for (let i = 0; i < POOL_SIZE; i++) {
  const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial.clone())
  crystal.visible = false
  crystalPool.push(crystal)
}

export function spawnCrystal(scene, bounds = 18, excludePositions = []) {
  let crystal = crystalPool.find(c => !c.visible)

  if (!crystal) {
    crystal = new THREE.Mesh(crystalGeometry, crystalMaterial.clone())
    crystalPool.push(crystal)
  }

  let validPosition = false
  let x, z
  let attempts = 0

  while (!validPosition && attempts < 50) {
    x = (Math.random() - 0.5) * 2 * bounds
    z = (Math.random() - 0.5) * 2 * bounds

    validPosition = true
    for (const pos of excludePositions) {
      const dist = Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2)
      if (dist < 3) {
        validPosition = false
        break
      }
    }
    attempts++
  }

  crystal.position.set(x, 1 + Math.random() * 2, z)
  crystal.visible = true
  crystal.userData.baseY = crystal.position.y
  crystal.userData.rotationSpeed = 0.02 + Math.random() * 0.03
  crystal.userData.floatSpeed = 1 + Math.random() * 0.5
  crystal.userData.floatOffset = Math.random() * Math.PI * 2

  if (!scene.children.includes(crystal)) {
    scene.add(crystal)
  }

  crystals.push(crystal)
  return crystal
}

export function updateCrystals(crystals, time) {
  for (const crystal of crystals) {
    if (!crystal.visible) continue

    crystal.rotation.y += crystal.userData.rotationSpeed
    crystal.rotation.x += crystal.userData.rotationSpeed * 0.5

    crystal.position.y = crystal.userData.baseY +
      Math.sin(time * crystal.userData.floatSpeed + crystal.userData.floatOffset) * 0.3
  }
}

export function getCrystalBoundingBox(crystal) {
  const size = 1.2
  return {
    minX: crystal.position.x - size / 2,
    maxX: crystal.position.x + size / 2,
    minZ: crystal.position.z - size / 2,
    maxZ: crystal.position.z + size / 2,
    minY: crystal.position.y - size / 2,
    maxY: crystal.position.y + size / 2
  }
}

export function collectCrystal(crystal) {
  crystal.visible = false
  const index = crystals.indexOf(crystal)
  if (index > -1) {
    crystals.splice(index, 1)
  }
}

export function getActiveCrystals() {
  return crystals.filter(c => c.visible)
}
