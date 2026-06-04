export function checkAABBCollision(box1, box2) {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  )
}

export function checkPlayerCrystalCollision(playerBox, crystalBox) {
  const expandedBox = {
    x: playerBox.x - 10,
    y: playerBox.y - 10,
    width: playerBox.width + 20,
    height: playerBox.height + 20
  }

  return checkAABBCollision(expandedBox, crystalBox)
}
