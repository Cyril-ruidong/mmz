import * as THREE from 'three'

export function createPlayer(scene) {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)

  const material = new THREE.MeshStandardMaterial({
    color: 0x00f5ff,
    emissive: 0x00f5ff,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1
  })

  const player = new THREE.Mesh(geometry, material)
  player.position.y = 0.5
  player.castShadow = true
  player.receiveShadow = true

  const edgesGeometry = new THREE.EdgesGeometry(geometry)
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0xff2d95,
    linewidth: 2
  })
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
  player.add(edges)

  scene.add(player)

  const playerLight = new THREE.PointLight(0x00f5ff, 0.5, 10)
  playerLight.position.set(0, 0, 0)
  player.add(playerLight)

  return {
    mesh: player,
    velocity: { x: 0, z: 0 },
    targetPosition: { x: 0, z: 0 },
    speed: 0.15,
    bounds: 20
  }
}

export function updatePlayer(player, mouseX, mouseZ) {
  player.targetPosition.x = mouseX * player.bounds
  player.targetPosition.z = mouseZ * player.bounds

  const dx = player.targetPosition.x - player.mesh.position.x
  const dz = player.targetPosition.z - player.mesh.position.z

  player.velocity.x = dx * player.speed
  player.velocity.z = dz * player.speed

  player.mesh.position.x += player.velocity.x
  player.mesh.position.z += player.velocity.z

  player.mesh.rotation.y += 0.02
  player.mesh.rotation.x += 0.01

  player.mesh.position.x = Math.max(-player.bounds, Math.min(player.bounds, player.mesh.position.x))
  player.mesh.position.z = Math.max(-player.bounds, Math.min(player.bounds, player.mesh.position.z))
}

export function getPlayerBoundingBox(player) {
  const size = 1.5
  return {
    minX: player.mesh.position.x - size / 2,
    maxX: player.mesh.position.x + size / 2,
    minZ: player.mesh.position.z - size / 2,
    maxZ: player.mesh.position.z + size / 2,
    minY: player.mesh.position.y - size / 2,
    maxY: player.mesh.position.y + size / 2
  }
}
