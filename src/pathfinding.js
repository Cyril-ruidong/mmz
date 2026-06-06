// 简化的寻路算法 - 避免性能问题

const GRID_SIZE = 64 // 更大的网格减少计算量

// 简单的避障移动
export function simplePathMove(x, y, targetX, targetY, buildings, width, height) {
  const dx = targetX - x
  const dy = targetY - y
  const dist = Math.sqrt(dx * dx + dy * dy)
  
  if (dist < 5) return { x, y, moving: false }
  
  const speed = 1.5
  let moveX = (dx / dist) * speed
  let moveY = (dy / dist) * speed
  
  // 简单的障碍物检测
  const newX = x + moveX
  const newY = y + moveY
  
  // 检查是否撞到建筑
  let blocked = false
  if (buildings) {
    for (const b of buildings) {
      const bx = width * b.x
      const by = height * b.y
      const bw = b.width * 32
      const bh = b.height * 32
      
      if (newX > bx && newX < bx + bw && newY > by && newY < by + bh) {
        blocked = true
        // 尝试绕行
        if (x < bx) moveX = -speed
        else if (x > bx + bw) moveX = speed
        if (y < by) moveY = -speed
        else if (y > by + bh) moveY = speed
        break
      }
    }
  }
  
  // 边界检查
  const margin = 50
  const finalX = Math.max(margin, Math.min(width - margin, x + moveX))
  const finalY = Math.max(margin, Math.min(height - margin, y + moveY))
  
  return {
    x: finalX,
    y: finalY,
    moving: true,
    direction: Math.atan2(moveY, moveX)
  }
}

// 初始化（空函数，保持兼容）
export function initGrid(width, height) {
  // 不需要初始化网格
}

// 更新障碍物（空函数）
export function updateObstacles(buildings) {
  // 不需要更新
}

// NPCPathfinder 简化版
export class NPCPathfinder {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.speed = 1.0
    this.path = []
    this.pathIndex = 0
  }
  
  setTarget(tx, ty) {
    this.targetX = tx
    this.targetY = ty
  }
  
  update(buildings, width, height) {
    const result = simplePathMove(
      this.x, this.y,
      this.targetX, this.targetY,
      buildings, width, height
    )
    
    this.x = result.x
    this.y = result.y
    
    return result
  }
  
  isMoving() {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    return Math.sqrt(dx * dx + dy * dy) > 10
  }
  
  getDirection() {
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    return Math.atan2(dy, dx)
  }
  
  recalculatePath() {
    // 简化版不需要路径计算
  }
}

// 导出空的 findPath 保持兼容
export function findPath(startX, startY, endX, endY) {
  return null
}