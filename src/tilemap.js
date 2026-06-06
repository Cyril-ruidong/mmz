const TILE_SIZE = 16;

const TILES = {
  GRASS: 0,
  DIRT: 1,
  WATER: 2,
  ROAD_H: 3,
  ROAD_V: 4,
  ROAD_CROSS: 5,
  FENCE: 6,
  TREE: 7,
  WALL_TOP: 8,
  WALL_SIDE: 9,
  WALL_CORNER: 10,
  FLOOR: 11,
  DOOR: 12,
  ROOF: 13,
  ROOF_EDGE: 14,
  SIGN: 15,
  LIGHT: 16
};

const COLORS = {
  grass: ['#3da324', '#2d8314', '#4db334'],
  dirt: ['#c4956c', '#a4754c', '#84552c'],
  water: ['#3498db', '#2980b9', '#1a5276'],
  road: ['#95a5a6', '#7f8c8d', '#6c7a7b'],
  fence: ['#8b4513', '#654321', '#4a3520'],
  tree: ['#228b22', '#006400', '#32cd32'],
  wall: ['#8b7355', '#6b5335', '#4b3315'],
  floor: ['#d4a574', '#c49564', '#b48554'],
  door: ['#4a3728', '#3a2718', '#5a4738'],
  roof: ['#c0392b', '#a93226', '#922b21'],
  sign: ['#f39c12', '#e67e22', '#d35400'],
  light: ['#f1c40f', '#f39c12', '#e74c3c']
};

function drawFCTile(ctx, type, x, y, time = 0) {
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  ctx.translate(x, y);

  switch (type) {
    case TILES.GRASS:
      drawGrass(ctx);
      break;
    case TILES.DIRT:
      drawDirt(ctx);
      break;
    case TILES.WATER:
      drawWater(ctx, time);
      break;
    case TILES.ROAD_H:
    case TILES.ROAD_V:
    case TILES.ROAD_CROSS:
      drawRoad(ctx, type);
      break;
    case TILES.FENCE:
      drawFence(ctx);
      break;
    case TILES.TREE:
      drawTree(ctx);
      break;
    case TILES.WALL_TOP:
    case TILES.WALL_SIDE:
    case TILES.WALL_CORNER:
      drawWall(ctx, type);
      break;
    case TILES.FLOOR:
      drawFloor(ctx);
      break;
    case TILES.DOOR:
      drawDoor(ctx);
      break;
    case TILES.ROOF:
    case TILES.ROOF_EDGE:
      drawRoof(ctx, type);
      break;
    case TILES.SIGN:
      drawSign(ctx);
      break;
    case TILES.LIGHT:
      drawLight(ctx, time);
      break;
    default:
      ctx.fillStyle = COLORS.grass[0];
      ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  }

  ctx.restore();
}

function drawGrass(ctx) {
  ctx.fillStyle = COLORS.grass[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.grass[1];
  ctx.fillRect(0, 8, TILE_SIZE, 4);
  ctx.fillStyle = COLORS.grass[2];
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(i * 6 + 2, 2, 2, 4);
  }
}

function drawDirt(ctx) {
  ctx.fillStyle = COLORS.dirt[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.dirt[1];
  ctx.fillRect(0, 4, TILE_SIZE, 4);
  ctx.fillStyle = COLORS.dirt[2];
  ctx.fillRect(2, 10, 4, 4);
  ctx.fillRect(10, 2, 4, 4);
}

function drawWater(ctx, time) {
  const wave = Math.sin(time * 0.005) * 2;
  ctx.fillStyle = COLORS.water[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.water[1];
  ctx.fillRect(0, 4 + wave, TILE_SIZE, 4);
  ctx.fillRect(0, 12 + wave, TILE_SIZE, 4);
  ctx.fillStyle = COLORS.water[2];
  ctx.fillRect(2, 8, 4, 4);
  ctx.fillRect(10, 2, 4, 4);
}

function drawRoad(ctx, type) {
  ctx.fillStyle = COLORS.road[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.road[1];
  ctx.fillRect(0, 4, TILE_SIZE, 2);
  ctx.fillRect(0, 10, TILE_SIZE, 2);
  ctx.fillStyle = COLORS.road[2];
  if (type === TILES.ROAD_H || type === TILES.ROAD_CROSS) {
    ctx.fillRect(0, 7, TILE_SIZE, 2);
  }
  if (type === TILES.ROAD_V || type === TILES.ROAD_CROSS) {
    ctx.fillRect(7, 0, 2, TILE_SIZE);
  }
}

function drawFence(ctx) {
  ctx.fillStyle = COLORS.fence[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.fence[1];
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(i * 3 + 1, 0, 2, TILE_SIZE);
  }
  ctx.fillStyle = COLORS.fence[2];
  ctx.fillRect(0, 4, TILE_SIZE, 2);
  ctx.fillRect(0, 10, TILE_SIZE, 2);
}

function drawTree(ctx) {
  ctx.fillStyle = COLORS.grass[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.tree[0];
  ctx.fillRect(6, 2, 4, 8);
  ctx.fillRect(4, 4, 8, 6);
  ctx.fillStyle = COLORS.tree[1];
  ctx.fillRect(7, 10, 2, 6);
  ctx.fillStyle = COLORS.tree[2];
  ctx.fillRect(5, 3, 2, 2);
}

function drawWall(ctx, type) {
  ctx.fillStyle = COLORS.wall[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.wall[1];
  for (let y = 0; y < TILE_SIZE; y += 4) {
    for (let x = 0; x < TILE_SIZE; x += 8) {
      const offset = (Math.floor(y / 4) % 2) * 4;
      ctx.fillRect(x + offset, y, 7, 3);
    }
  }
  ctx.fillStyle = COLORS.wall[2];
  ctx.fillRect(0, 0, TILE_SIZE, 1);
  if (type === TILES.WALL_SIDE) {
    ctx.fillRect(0, 0, 1, TILE_SIZE);
  } else if (type === TILES.WALL_CORNER) {
    ctx.fillRect(0, 0, 1, TILE_SIZE);
    ctx.fillRect(0, 0, TILE_SIZE, 1);
  }
}

function drawFloor(ctx) {
  ctx.fillStyle = COLORS.floor[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.floor[1];
  for (let y = 0; y < TILE_SIZE; y += 8) {
    for (let x = 0; x < TILE_SIZE; x += 8) {
      ctx.fillRect(x, y, 7, 7);
    }
  }
  ctx.fillStyle = COLORS.floor[2];
  ctx.fillRect(0, 0, TILE_SIZE, 1);
  ctx.fillRect(0, 0, 1, TILE_SIZE);
}

function drawDoor(ctx) {
  ctx.fillStyle = COLORS.door[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.door[1];
  ctx.fillRect(2, 2, 12, 14);
  ctx.fillStyle = COLORS.door[2];
  ctx.fillRect(3, 3, 10, 12);
  ctx.fillStyle = '#c0a030';
  ctx.fillRect(10, 8, 2, 2);
}

function drawRoof(ctx, type) {
  ctx.fillStyle = COLORS.roof[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.roof[1];
  ctx.fillRect(0, 4, TILE_SIZE, 2);
  ctx.fillRect(0, 10, TILE_SIZE, 2);
  if (type === TILES.ROOF_EDGE) {
    ctx.fillStyle = COLORS.roof[2];
    ctx.fillRect(0, 0, TILE_SIZE, 2);
  }
}

function drawSign(ctx) {
  ctx.fillStyle = COLORS.grass[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.fence[0];
  ctx.fillRect(7, 8, 2, 8);
  ctx.fillStyle = COLORS.sign[0];
  ctx.fillRect(2, 2, 12, 8);
  ctx.fillStyle = COLORS.sign[1];
  ctx.fillRect(3, 3, 10, 6);
  ctx.fillStyle = COLORS.sign[2];
  ctx.fillRect(4, 4, 8, 1);
}

function drawLight(ctx, time) {
  const flicker = Math.sin(time * 0.01) > 0;
  ctx.fillStyle = COLORS.grass[0];
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = COLORS.road[1];
  ctx.fillRect(7, 4, 2, 12);
  ctx.fillStyle = flicker ? COLORS.light[0] : COLORS.light[1];
  ctx.fillRect(5, 0, 6, 6);
  if (flicker) {
    ctx.fillStyle = COLORS.light[2];
    ctx.globalAlpha = 0.3;
    ctx.fillRect(2, -2, 12, 10);
    ctx.globalAlpha = 1;
  }
}

export function renderTilemap(ctx, map, time, offsetX = 0, offsetY = 0) {
  const { tiles, width, height } = map;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tileType = tiles[y * width + x];
      drawFCTile(ctx, tileType, x * TILE_SIZE + offsetX, y * TILE_SIZE + offsetY, time);
    }
  }
}

export function getTileSize() {
  return TILE_SIZE;
}

export { TILES };
