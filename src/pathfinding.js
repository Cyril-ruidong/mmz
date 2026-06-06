// A* 寻路算法模块

const GRID_SIZE = 32
const DIAGONAL_COST = 1.414

// 节点类
class Node {
  constructor(x, y, walkable = true) {
    this.x = x
    this.y = y
    this.walkable = walkable
    this.g = 0
    this.h = 0
    this.f = 0
    this.parent = null
  }
}

// 地图网格
let grid = []
let gridWidth = 0
let gridHeight = 0

// 初始化网格
export function initGrid(width, height) {
  gridWidth = Math.ceil(width / GRID_SIZE)
  gridHeight = Math.ceil(height / GRID_SIZE)
  grid = []
  
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = []
    for (let x = 0; x < gridWidth; x++) {
      grid[y][x] = new Node(x, y, true)
    }
  }
}

// 更新障碍物
export function updateObstacles(buildings) {
  if (!buildings) return
  
  for (const building of buildings) {
    // 标记建筑区域为不可行走
    const startX = Math.floor(building.x * gridWidth)
    const startY = Math.floor(building.y * gridHeight)
    const endX = startX + building.width
    const endY = startY + building.height
    
    for (let y = startY; y < endY && y < gridHeight; y++) {
      for (let x = startX; x < endX && x < gridWidth; x++) {
        if (y >= 0 && y < gridHeight && x >= 0 && x < gridWidth) {
          grid[y][x].walkable = false
        }
      }
    }
  }
  
  // 标记道路为可通行
  const roadY = Math.floor(gridHeight / 2) - 1
  for (let y = roadY; y <= roadY + 2 && y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (y >= 0 && y < gridHeight) {
        grid[y][x].walkable = true
      }
    }
  }
}

// A* 寻路
export function findPath(startX, startY, endX, endY) {
  const startNode = worldToGrid(startX, startY)
  const endNode = worldToGrid(endX, endY)
  
  if (!startNode || !endNode) return null
  if (!endNode.walkable) {
    // 如果终点不可达，找最近的可达点
    const nearest = findNearestWalkable(endNode.x, endNode.y)
    if (nearest) {
      endNode.x = nearest.x
      endNode.y = nearest.y
    }
  }
  
  const openList = []
  const closedList = []
  
  openList.push(startNode)
  
  while (openList.length > 0) {
    // 找到 f 值最小的节点
    let current = openList[0]
    let currentIndex = 0
    
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < current.f) {
        current = openList[i]
        currentIndex = i
      }
    }
    
    // 到达终点
    if (current.x === endNode.x && current.y === endNode.y) {
      return reconstructPath(current)
    }
    
    // 移动到 closedList
    openList.splice(currentIndex, 1)
    closedList.push(current)
    
    // 检查相邻节点
    const neighbors = getNeighbors(current)
    
    for (const neighbor of neighbors) {
      if (!neighbor.walkable || closedList.includes(neighbor)) {
        continue
      }
      
      const tentativeG = current.g + 
        (neighbor.x === current.x || neighbor.y === current.y ? 1 : DIAGONAL_COST)
      
      if (!openList.includes(neighbor)) {
        neighbor.g = tentativeG
        neighbor.h = heuristic(neighbor, endNode)
        neighbor.f = neighbor.g + neighbor.h
        neighbor.parent = current
        openList.push(neighbor)
      } else if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG
        neighbor.f = neighbor.g + neighbor.h
        neighbor.parent = current
      }
    }
  }
  
  return null // 无路径
}

// 获取相邻节点
function getNeighbors(node) {
  const neighbors = []
  const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],          [1, 0],
    [-1, 1],  [0, 1], [1, 1]
  ]
  
  for (const [dx, dy] of directions) {
    const nx = node.x + dx
    const ny = node.y + dy
    
    if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
      const isDiagonal = dx !== 0 && dy !== 0
      
      // 对角线移动需要检查两个方向都可通行
      if (isDiagonal) {
        if (!grid[ny][node.x].walkable || !grid[node.y][nx].walkable) {
          continue
        }
      }
      
      neighbors.push(grid[ny][nx])
    }
  }
  
  return neighbors
}

// 启发函数（曼哈顿距离）
function heuristic(nodeA, nodeB) {
  const dx = Math.abs(nodeA.x - nodeB.x)
  const dy = Math.abs(nodeA.y - nodeB.y)
  return dx + dy
}

// 世界坐标转网格坐标
function worldToGrid(worldX, worldY) {
  const x = Math.floor(worldX / GRID_SIZE)
  const y = Math.floor(worldY / GRID_SIZE)
  
  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
    return grid[y][x]
  }
  return null
}

// 网格坐标转世界坐标（取格子中心）
function gridToWorld(gridX, gridY) {
  return {
    x: gridX * GRID_SIZE + GRID_SIZE / 2,
    y: gridY * GRID_SIZE + GRID_SIZE / 2
  }
}

// 重建路径
function reconstructPath(endNode) {
  const path = []
  let current = endNode
  
  while (current.parent) {
    const worldPos = gridToWorld(current.x, current.y)
    path.unshift(worldPos)
    current = current.parent
  }
  
  return path
}

// 找最近的可达点
function findNearestWalkable(x, y) {
  for (let radius = 1; radius < Math.max(gridWidth, gridHeight); radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const nx = x + dx
        const ny = y + dy
        
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
          if (grid[ny][nx].walkable) {
            return grid[ny][nx]
          }
        }
      }
    }
  }
  return null
}

// NPC 寻路类
export class NPCPathfinder {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.targetX = 0
    this.targetY = 0
    this.path = []
    this.pathIndex = 0
    this.speed = 1.5
    this.reachThreshold = 10
    this.pathRecalcTimer = 0
    this.pathRecalcInterval = 60 // 每60帧重新计算路径
  }
  
  setTarget(tx, ty) {
    this.targetX = tx
    this.targetY = ty
    this.recalculatePath()
  }
  
  recalculatePath() {
    this.path = findPath(this.x, this.y, this.targetX, this.targetY) || []
    this.pathIndex = 0
  }
  
  update() {
    if (this.path.length === 0) {
      // 随机移动
      this.randomMove()
      return
    }
    
    if (this.pathIndex >= this.path.length) {
      this.path = []
      return
    }
    
    const target = this.path[this.pathIndex]
    const dx = target.x - this.x
    const dy = target.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < this.reachThreshold) {
      this.pathIndex++
      return
    }
    
    // 移动向目标点
    const moveX = (dx / dist) * this.speed
    const moveY = (dy / dist) * this.speed
    
    this.x += moveX
    this.y += moveY
    
    // 检查是否到达路径点
    const currentTarget = this.path[this.pathIndex]
    if (currentTarget) {
      const newDx = currentTarget.x - this.x
      const newDy = currentTarget.y - this.y
      if (Math.sqrt(newDx * newDx + newDy * newDy) < this.reachThreshold) {
        this.pathIndex++
      }
    }
    
    // 定期重新计算路径
    this.pathRecalcTimer++
    if (this.pathRecalcTimer >= this.pathRecalcInterval) {
      this.pathRecalcTimer = 0
      if (Math.random() < 0.3) {
        this.recalculatePath()
      }
    }
  }
  
  randomMove() {
    // 随机改变方向
    if (Math.random() < 0.02) {
      this.targetX = Math.random() * (gridWidth * GRID_SIZE * 0.8) + GRID_SIZE
      this.targetY = Math.random() * (gridHeight * GRID_SIZE * 0.8) + GRID_SIZE
      this.recalculatePath()
    }
  }
  
  isMoving() {
    return this.path.length > 0 && this.pathIndex < this.path.length
  }
  
  getDirection() {
    if (this.path.length === 0 || this.pathIndex >= this.path.length) {
      return 0
    }
    
    const target = this.path[this.pathIndex]
    return Math.atan2(target.y - this.y, target.x - this.x)
  }
}
