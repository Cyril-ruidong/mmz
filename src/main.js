import './style.css';
import { createGameCanvas, drawScene } from './scene.js';
import { createPlayer } from './player.js';
import { sceneManager } from './scenes.js';
import { getTileSize } from './tilemap.js';
import gameController from './game_controller.js';
import PixelSprites from './pixel_sprites.js';

const container = document.getElementById('game-container');
const { canvas, ctx } = createGameCanvas(container);

const startPos = sceneManager.townMap.startPosition;
const player = createPlayer(startPos.x, startPos.y);

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  interact: false
};

let interactCooldown = 0;
let animFrame = 0;
let animTimer = 0;

gameController.onInput((controllerKeys) => {
  keys.up = controllerKeys.up;
  keys.down = controllerKeys.down;
  keys.left = controllerKeys.left;
  keys.right = controllerKeys.right;
  keys.interact = controllerKeys.start || controllerKeys.a;
});

function handleInteraction() {
  if (interactCooldown > 0) {
    interactCooldown--;
    return;
  }
  
  const entrance = sceneManager.checkEntrance(player.x, player.y);
  
  if (entrance === 'exit') {
    const exitPos = sceneManager.exitToTown();
    player.teleportToTile(exitPos.x, exitPos.y);
    interactCooldown = 30;
  } else if (entrance && entrance.target) {
    const interiorStart = sceneManager.enterInterior(entrance.target);
    if (interiorStart) {
      player.teleportToTile(interiorStart.x, interiorStart.y);
      interactCooldown = 30;
    }
  }
}

function animate(time) {
  requestAnimationFrame(animate);
  
  animTimer++;
  if (animTimer > 10) {
    animTimer = 0;
    animFrame = (animFrame + 1) % 2;
  }
  
  player.update(keys);
  
  if (keys.interact) {
    handleInteraction();
  } else if (interactCooldown > 15) {
    interactCooldown = 15;
  }
  
  const width = canvas.width;
  const height = canvas.height;
  const map = sceneManager.getCurrentMap();
  const tileSize = getTileSize();
  
  const mapPixelWidth = map.width * tileSize;
  const mapPixelHeight = map.height * tileSize;
  
  const scaleX = width / mapPixelWidth;
  const scaleY = height / mapPixelHeight;
  const scale = Math.min(scaleX, scaleY, 2);
  
  const offsetX = (width - mapPixelWidth * scale) / 2;
  const offsetY = (height - mapPixelHeight * scale) / 2;
  
  drawScene(ctx, width, height, time);
  
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  
  drawEntranceHints(ctx, map, tileSize);
  
  player.draw(ctx, 1, 0, 0);
  
  ctx.restore();
  
  drawControlsHint(ctx, width, height);
}

function drawEntranceHints(ctx, map, tileSize) {
  if (!map.entrances) return;
  
  ctx.fillStyle = '#ffff00';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  
  for (const entrance of map.entrances) {
    const x = entrance.x * tileSize + tileSize / 2;
    const y = entrance.y * tileSize - 5;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x - 30, y - 15, 60, 18);
    
    ctx.fillStyle = '#ffff00';
    ctx.fillText('按 [A/空格] 进入', x, y);
  }
}

function drawControlsHint(ctx, width, height) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 240, 120);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  
  const lines = [
    'FC重装机兵风格',
    '-----------------',
    '方向键/WASD - 移动',
    'A/空格/回车 - 交互',
    'SELECT/B - 返回',
    '',
    '提示: 走到建筑门口按A进入'
  ];
  
  lines.forEach((line, i) => {
    ctx.fillText(line, 20, 30 + i * 16);
  });
}

requestAnimationFrame(animate);
