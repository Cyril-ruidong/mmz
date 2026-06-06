import { collisionSystem } from './collision_system.js';
import { getTileSize } from './tilemap.js';
import { sceneManager } from './scenes.js';
import PixelSprites from './pixel_sprites.js';

export class Player {
  constructor(startTileX, startTileY) {
    const tileSize = getTileSize();
    this.x = startTileX * tileSize + tileSize / 2;
    this.y = startTileY * tileSize + tileSize / 2;
    this.speed = 2;
    this.variant = 0;
    this.tileSize = tileSize;
    this.isMoving = false;
    this.lastDirection = 'down';
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(keys) {
    let dx = 0;
    let dy = 0;

    if (keys.up) {
      dy -= this.speed;
      this.lastDirection = 'up';
    }
    if (keys.down) {
      dy += this.speed;
      this.lastDirection = 'down';
    }
    if (keys.left) {
      dx -= this.speed;
      this.lastDirection = 'left';
    }
    if (keys.right) {
      dx += this.speed;
      this.lastDirection = 'right';
    }

    this.isMoving = dx !== 0 || dy !== 0;

    if (this.isMoving) {
      this.animTimer++;
      if (this.animTimer > 8) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 2;
      }
    } else {
      this.animFrame = 0;
    }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const newPos = collisionSystem.tryMove(this.x, this.y, this.x + dx, this.y + dy, 1);
    this.x = newPos.x;
    this.y = newPos.y;
  }

  draw(ctx, scale, offsetX, offsetY) {
    // 坐标已经在 main.js 中被 translate 和 scale 了，所以直接用 tile 坐标
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    PixelSprites.drawPlayer(ctx, this.x - this.tileSize / 2, this.y - this.tileSize / 2, this.lastDirection, this.animFrame, 1);
    ctx.restore();
  }

  teleportToTile(tileX, tileY) {
    this.x = tileX * this.tileSize + this.tileSize / 2;
    this.y = tileY * this.tileSize + this.tileSize / 2;
  }

  getTilePosition() {
    return {
      x: Math.floor(this.x / this.tileSize),
      y: Math.floor(this.y / this.tileSize)
    };
  }
}

export function createPlayer(startTileX, startTileY) {
  return new Player(startTileX, startTileY);
}
