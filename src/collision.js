export function checkAABBCollision(box1, box2) {
  return (
    box1.minX <= box2.maxX &&
    box1.maxX >= box2.minX &&
    box1.minZ <= box2.maxZ &&
    box1.maxZ >= box2.minZ &&
    box1.minY <= box2.maxY &&
    box1.maxY >= box2.minY
  )
}

export function checkPlayerCrystalCollision(playerBox, crystalBox) {
  const expandedBox = {
    minX: playerBox.minX - 0.3,
    maxX: playerBox.maxX + 0.3,
    minZ: playerBox.minZ - 0.3,
    maxZ: playerBox.maxZ + 0.3,
    minY: playerBox.minY - 0.3,
    maxY: playerBox.maxY + 0.3
  }

  return checkAABBCollision(expandedBox, crystalBox)
}
