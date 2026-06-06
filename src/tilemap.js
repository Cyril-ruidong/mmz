const TILE_SIZE = 16;

const FC_COLORS = {
  BG: '#1c3c2c',
  GRASS: '#4c8c4c',
  ROAD: '#dcc89c',
  BUILDING: '#ac7c5c',
  WATER: '#5c9cbc',
  BLACK: '#000000',
  WHITE: '#fcfffc'
};

const TILES = {
  GRASS: 0,
  DIRT: 1,
  WATER: 2,
  ROAD: 3,
  WALL: 4,
  FLOOR: 5,
  DOOR: 6,
  ROOF: 7,
  TREE: 8,
  FENCE: 9
};

function drawPixelRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawFCTile(ctx, type, x, y, time = 0) {
  ctx.imageSmoothingEnabled = false;
  
  switch (type) {
    case TILES.GRASS:
      drawGrass(ctx, x, y);
      break;
    case TILES.DIRT:
      drawDirt(ctx, x, y);
      break;
    case TILES.WATER:
      drawWater(ctx, x, y, time);
      break;
    case TILES.ROAD:
      drawRoad(ctx, x, y);
      break;
    case TILES.WALL:
      drawWall(ctx, x, y);
      break;
    case TILES.FLOOR:
      drawFloor(ctx, x, y);
      break;
    case TILES.DOOR:
      drawDoor(ctx, x, y);
      break;
    case TILES.ROOF:
      drawRoof(ctx, x, y);
      break;
    case TILES.TREE:
      drawTreeTile(ctx, x, y);
      break;
    case TILES.FENCE:
      drawFence(ctx, x, y);
      break;
    default:
      drawGrass(ctx, x, y);
  }
}

function drawGrass(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.GRASS);
  drawPixelRect(ctx, x + 2, y + 2, 2, 2, FC_COLORS.BG);
  drawPixelRect(ctx, x + 10, y + 6, 2, 2, FC_COLORS.BG);
  drawPixelRect(ctx, x + 6, y + 12, 2, 2, FC_COLORS.BG);
}

function drawDirt(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 4, y + 4, 4, 4, FC_COLORS.ROAD);
  drawPixelRect(ctx, x + 10, y + 10, 4, 4, FC_COLORS.ROAD);
}

function drawWater(ctx, x, y, time) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.WATER);
  const wave = Math.floor(time / 20) % 2;
  if (wave === 0) {
    drawPixelRect(ctx, x + 2, y + 4, 12, 2, FC_COLORS.BG);
    drawPixelRect(ctx, x + 4, y + 10, 8, 2, FC_COLORS.BG);
  } else {
    drawPixelRect(ctx, x + 4, y + 6, 8, 2, FC_COLORS.BG);
    drawPixelRect(ctx, x + 2, y + 12, 12, 2, FC_COLORS.BG);
  }
}

function drawRoad(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.ROAD);
  drawPixelRect(ctx, x + 2, y + 2, 4, 4, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 10, y + 10, 4, 4, FC_COLORS.BUILDING);
}

function drawWall(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x, y, TILE_SIZE, 2, FC_COLORS.ROAD);
  drawPixelRect(ctx, x, y + 8, TILE_SIZE, 2, FC_COLORS.ROAD);
  drawPixelRect(ctx, x, y, 2, TILE_SIZE, FC_COLORS.ROAD);
  drawPixelRect(ctx, x + 8, y, 2, TILE_SIZE, FC_COLORS.ROAD);
}

function drawFloor(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.ROAD);
  drawPixelRect(ctx, x + 2, y + 2, 6, 6, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 10, y + 10, 6, 6, FC_COLORS.BUILDING);
}

function drawDoor(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 4, y + 2, 8, 12, FC_COLORS.BLACK);
  drawPixelRect(ctx, x + 10, y + 8, 2, 2, FC_COLORS.ROAD);
}

function drawRoof(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 2, y + 2, 4, 4, FC_COLORS.ROAD);
  drawPixelRect(ctx, x + 10, y + 10, 4, 4, FC_COLORS.ROAD);
}

function drawTreeTile(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.GRASS);
  drawPixelRect(ctx, x + 4, y + 2, 8, 8, FC_COLORS.GRASS);
  drawPixelRect(ctx, x + 6, y + 10, 4, 6, FC_COLORS.BUILDING);
}

function drawFence(ctx, x, y) {
  drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, FC_COLORS.GRASS);
  drawPixelRect(ctx, x + 2, y, 2, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 7, y, 2, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x + 12, y, 2, TILE_SIZE, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x, y + 4, TILE_SIZE, 2, FC_COLORS.BUILDING);
  drawPixelRect(ctx, x, y + 10, TILE_SIZE, 2, FC_COLORS.BUILDING);
}

function renderTilemap(ctx, map, time, offsetX = 0, offsetY = 0) {
  ctx.imageSmoothingEnabled = false;
  const { tiles, width, height } = map;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tileType = tiles[y * width + x];
      drawFCTile(ctx, tileType, x * TILE_SIZE + offsetX, y * TILE_SIZE + offsetY, time);
    }
  }
}

function getTileSize() {
  return TILE_SIZE;
}

export { renderTilemap, getTileSize, TILES, FC_COLORS };
