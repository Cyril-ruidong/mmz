import './style.css';
import { createGameCanvas, drawScene, drawEntranceHints, drawControlsHint } from './scene.js';
import { createPlayer } from './player.js';
import { sceneManager } from './scenes.js';
import { getTileSize } from './tilemap.js';
import gameController from './game_controller.js';

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

let time = 0;

function animate() {
  requestAnimationFrame(animate);
  
  time++;
  
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
  
  const scale = 2;
  const offsetX = (width - mapPixelWidth * scale) / 2;
  const offsetY = (height - mapPixelHeight * scale) / 2;
  
  drawScene(ctx, width, height, time);
  
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  
  drawEntranceHints(ctx, map, tileSize, scale, 0, 0);
  
  player.draw(ctx, scale, 0, 0);
  
  ctx.restore();
  
  drawControlsHint(ctx, width, height);
}

animate();
