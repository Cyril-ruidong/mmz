import { renderTilemap, getTileSize, FC_COLORS } from './tilemap.js';
import { sceneManager } from './scenes.js';
import PixelSprites from './pixel_sprites.js';

export function createGameCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.imageRendering = 'crisp-edges';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function resize() {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const scale = Math.min(containerWidth / 512, containerHeight / 384);
    canvas.style.width = `${512 * scale}px`;
    canvas.style.height = `${384 * scale}px`;
    ctx.imageSmoothingEnabled = false;
  }

  window.addEventListener('resize', resize);
  resize();

  return { canvas, ctx, resize };
}

export function drawScene(ctx, width, height, time) {
  PixelSprites.drawPixelRect(ctx, 0, 0, width, height, FC_COLORS.BG);
  
  const map = sceneManager.getCurrentMap();
  const tileSize = getTileSize();
  
  const mapPixelWidth = map.width * tileSize;
  const mapPixelHeight = map.height * tileSize;
  
  const offsetX = (width - mapPixelWidth * 2) / 2;
  const offsetY = (height - mapPixelHeight * 2) / 2;
  const scale = 2;
  
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;
  
  renderTilemap(ctx, map, time, 0, 0);
  
  ctx.restore();
}

export function drawEntranceHints(ctx, map, tileSize, scale, offsetX, offsetY) {
  if (!map.entrances) return;
  
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;
  
  for (const entrance of map.entrances) {
    const x = entrance.x * tileSize + tileSize / 2;
    const y = entrance.y * tileSize - 4;
    
    PixelSprites.drawText(ctx, '▶', x - 4, y, 1, FC_COLORS.WHITE);
  }
  
  ctx.restore();
}

export function drawControlsHint(ctx, width, height) {
  const hints = [
    'FC METAL MAX STYLE',
    '-----------------',
    'Arrow Keys: Move',
    'Space/Z: Confirm',
    'ESC/X: Cancel'
  ];
  
  let y = 20;
  for (const hint of hints) {
    PixelSprites.drawText(ctx, hint, 10, y, 1, FC_COLORS.WHITE);
    y += 14;
  }
}
