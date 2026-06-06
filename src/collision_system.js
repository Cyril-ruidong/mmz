import { getTileSize } from './tilemap.js';

export class CollisionSystem {
  constructor() {
    this.currentMap = null;
    this.tileSize = getTileSize();
  }

  setMap(map) {
    this.currentMap = map;
  }

  checkCollision(tileX, tileY) {
    if (!this.currentMap) return false;
    
    if (tileX < 0 || tileX >= this.currentMap.width || 
        tileY < 0 || tileY >= this.currentMap.height) {
      return true;
    }
    
    const idx = tileY * this.currentMap.width + tileX;
    return this.currentMap.collisions[idx];
  }

  checkAreaCollision(startX, startY, width, height) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (this.checkCollision(x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  pixelToTile(pixelX, pixelY) {
    return {
      x: Math.floor(pixelX / this.tileSize),
      y: Math.floor(pixelY / this.tileSize)
    };
  }

  tileToPixel(tileX, tileY) {
    return {
      x: tileX * this.tileSize + this.tileSize / 2,
      y: tileY * this.tileSize + this.tileSize / 2
    };
  }

  checkPixelCollision(pixelX, pixelY, entitySize = 1) {
    const centerTile = this.pixelToTile(pixelX, pixelY);
    
    const halfSize = Math.max(0, Math.floor(entitySize / 2) - 1);
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        if (this.checkCollision(centerTile.x + dx, centerTile.y + dy)) {
          return true;
        }
      }
    }
    
    return false;
  }

  tryMove(currentX, currentY, targetX, targetY, entitySize = 1) {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    
    let newX = currentX;
    let newY = currentY;
    let canMoveX = !this.checkPixelCollision(currentX + dx, currentY, entitySize);
    let canMoveY = !this.checkPixelCollision(currentX, currentY + dy, entitySize);
    
    if (canMoveX) {
      newX = currentX + dx;
    }
    
    if (canMoveY) {
      newY = currentY + dy;
    }
    
    if (!canMoveX && !canMoveY) {
      if (!this.checkPixelCollision(currentX + dx, currentY + dy, entitySize)) {
        newX = currentX + dx;
        newY = currentY + dy;
      }
    }
    
    return { x: newX, y: newY };
  }

  findEntrance(pixelX, pixelY) {
    if (!this.currentMap || !this.currentMap.entrances) return null;
    
    const playerTile = this.pixelToTile(pixelX, pixelY);
    
    for (const entrance of this.currentMap.entrances) {
      const distance = Math.sqrt(
        Math.pow(playerTile.x - entrance.x, 2) + 
        Math.pow(playerTile.y - entrance.y, 2)
      );
      
      if (distance <= 1.5) {
        return entrance;
      }
    }
    
    return null;
  }

  checkExit(pixelX, pixelY) {
    if (!this.currentMap || !this.currentMap.exit) return false;
    
    const playerTile = this.pixelToTile(pixelX, pixelY);
    
    const distance = Math.sqrt(
      Math.pow(playerTile.x - this.currentMap.exit.x, 2) + 
      Math.pow(playerTile.y - this.currentMap.exit.y, 2)
    );
    
    return distance <= 1;
  }
}

export const collisionSystem = new CollisionSystem();
