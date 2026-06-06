import { collisionSystem } from './collision_system.js';
import { getTileSize } from './tilemap.js';
import { sceneManager } from './scenes.js';

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

    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    const newPos = collisionSystem.tryMove(this.x, this.y, this.x + dx, this.y + dy, 1);
    this.x = newPos.x;
    this.y = newPos.y;
  }

  draw(ctx, scale, offsetX, offsetY) {
    const screenX = this.x * scale + offsetX;
    const screenY = this.y * scale + offsetY;
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);
    
    const size = this.tileSize * 0.8;
    const halfSize = size / 2;
    
    ctx.fillStyle = '#ffccaa';
    ctx.fillRect(-halfSize * 0.4, -halfSize, halfSize * 0.8, halfSize);
    
    const shirtColors = ['#3366cc', '#cc3333', '#33cc33', '#cc9933'];
    ctx.fillStyle = shirtColors[this.variant % shirtColors.length];
    ctx.fillRect(-halfSize * 0.5, 0, halfSize, halfSize * 0.8);
    
    ctx.fillStyle = '#333366';
    ctx.fillRect(-halfSize * 0.4, halfSize * 0.6, halfSize * 0.8, halfSize * 0.4);
    
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
