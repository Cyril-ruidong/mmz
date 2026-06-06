import { renderTilemap, getTileSize } from './tilemap.js';
import { sceneManager } from './scenes.js';

export function createGameCanvas(container) {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
  }

  window.addEventListener('resize', resize);

  return { canvas, ctx, resize };
}

export function drawScene(ctx, width, height, time) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);
  
  const map = sceneManager.getCurrentMap();
  const tileSize = getTileSize();
  
  const mapPixelWidth = map.width * tileSize;
  const mapPixelHeight = map.height * tileSize;
  
  const offsetX = Math.max(0, Math.min(width - mapPixelWidth, 0));
  const offsetY = Math.max(0, Math.min(height - mapPixelHeight, 0));
  
  const scaleX = width / mapPixelWidth;
  const scaleY = height / mapPixelHeight;
  const scale = Math.min(scaleX, scaleY, 2);
  
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  
  renderTilemap(ctx, map, time, 0, 0);
  
  ctx.restore();
  
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`当前位置: ${sceneManager.getSceneName()}`, 10, 30);
}

export function drawNPCHumanTile(variant) {
  return {
    width: 24,
    height: 32,
    draw: (ctx, x, y) => {
      ctx.save();
      ctx.translate(x - 12, y - 16);
      
      ctx.fillStyle = '#ffccaa';
      ctx.fillRect(6, 0, 12, 12);
      
      const colors = ['#3366cc', '#cc3333', '#33cc33', '#cc9933'];
      ctx.fillStyle = colors[variant % colors.length];
      ctx.fillRect(4, 12, 16, 12);
      
      ctx.fillStyle = '#333366';
      ctx.fillRect(6, 24, 12, 8);
      
      ctx.restore();
    }
  };
}
