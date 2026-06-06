import wastelandAtlas, { WASTELAND_PALETTE } from './wasteland_sprites.js';
import PixelSprites from './pixel_sprites.js';

const TILE_SIZE = 32;

const WASTELAND_TILES = {
  PLAIN: 0,
  DRY_CRACK: 1,
  ROCKY: 2,
  DIRT: 3,
  CACTUS: 4,
  ROCK: 5,
  FACTORY_MAIN: 6,
  FACTORY_CHIMNEY: 7,
  BROKEN_WALL: 8,
  BARREL: 9,
  SCRAP: 10,
  DEAD_BUSH: 11,
  GRASS: 12
};

const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;

function createWastelandTiles() {
  const tiles = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x < 2 || x >= MAP_WIDTH - 2 || y < 2 || y >= MAP_HEIGHT - 2) {
        tiles.push(WASTELAND_TILES.ROCKY);
      } else {
        const r = Math.random();
        if (r < 0.6) {
          tiles.push(WASTELAND_TILES.PLAIN);
        } else if (r < 0.75) {
          tiles.push(WASTELAND_TILES.DRY_CRACK);
        } else if (r < 0.85) {
          tiles.push(WASTELAND_TILES.ROCKY);
        } else {
          tiles.push(WASTELAND_TILES.DIRT);
        }
      }
    }
  }

  addFeature(tiles, 8, 8, 3, 3, WASTELAND_TILES.FACTORY_MAIN);
  addFeature(tiles, 7, 11, 2, 1, WASTELAND_TILES.BROKEN_WALL);
  addFeature(tiles, 12, 9, 1, 1, WASTELAND_TILES.FACTORY_CHIMNEY);

  addFeature(tiles, 22, 6, 2, 2, WASTELAND_TILES.FACTORY_MAIN);
  addFeature(tiles, 21, 8, 1, 1, WASTELAND_TILES.FACTORY_CHIMNEY);

  addFeature(tiles, 5, 20, 3, 2, WASTELAND_TILES.BROKEN_WALL);
  addFeature(tiles, 25, 22, 2, 2, WASTELAND_TILES.BROKEN_WALL);

  for (let i = 0; i < 15; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.PLAIN) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.CACTUS;
    }
  }

  for (let i = 0; i < 20; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.PLAIN ||
        tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.ROCKY) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.ROCK;
    }
  }

  for (let i = 0; i < 12; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.DRY_CRACK) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.DEAD_BUSH;
    }
  }

  for (let i = 0; i < 10; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.DIRT) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.BARREL;
    }
  }

  for (let i = 0; i < 15; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.ROCKY) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.SCRAP;
    }
  }

  for (let i = 0; i < 30; i++) {
    const x = 3 + Math.floor(Math.random() * (MAP_WIDTH - 6));
    const y = 3 + Math.floor(Math.random() * (MAP_HEIGHT - 6));
    if (tiles[y * MAP_WIDTH + x] === WASTELAND_TILES.PLAIN) {
      tiles[y * MAP_WIDTH + x] = WASTELAND_TILES.GRASS;
    }
  }

  return tiles;
}

function addFeature(tiles, startX, startY, width, height, tileType) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        tiles[y * MAP_WIDTH + x] = tileType;
      }
    }
  }
}

function createCollisionMap() {
  const collisions = [];

  for (let i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
    collisions.push(false);
  }

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        collisions[y * MAP_WIDTH + x] = true;
      }
    }
  }

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const idx = y * MAP_WIDTH + x;
      const tile = WASTELAND.tiles[idx];
      if (tile === WASTELAND_TILES.ROCK ||
          tile === WASTELAND_TILES.FACTORY_MAIN ||
          tile === WASTELAND_TILES.FACTORY_CHIMNEY ||
          tile === WASTELAND_TILES.BROKEN_WALL ||
          tile === WASTELAND_TILES.BARREL) {
        collisions[idx] = true;
      }
    }
  }

  return collisions;
}

const WASTELAND = {
  tiles: createWastelandTiles(),
  width: MAP_WIDTH,
  height: MAP_HEIGHT
};

WASTELAND.collisions = createCollisionMap();

WASTELAND.startPosition = { x: 16, y: 16 };

function renderWasteland(ctx, time, offsetX = 0, offsetY = 0) {
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = WASTELAND_PALETTE.H;
  ctx.fillRect(offsetX, offsetY, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tileType = WASTELAND.tiles[y * MAP_WIDTH + x];
      const screenX = x * TILE_SIZE + offsetX;
      const screenY = y * TILE_SIZE + offsetY;

      if (tileType === WASTELAND_TILES.PLAIN) {
        wastelandAtlas.drawTileAt(ctx, 'sand', screenX, screenY, TILE_SIZE, 0);
      } else if (tileType === WASTELAND_TILES.DRY_CRACK) {
        wastelandAtlas.drawTileAt(ctx, 'sand', screenX, screenY, TILE_SIZE, 1);
      } else if (tileType === WASTELAND_TILES.ROCKY) {
        wastelandAtlas.drawTileAt(ctx, 'sand', screenX, screenY, TILE_SIZE, 2);
      } else if (tileType === WASTELAND_TILES.DIRT) {
        wastelandAtlas.drawTileAt(ctx, 'sand', screenX, screenY, TILE_SIZE, 3);
      } else if (tileType === WASTELAND_TILES.CACTUS) {
        const variant = (x + y) % 3;
        wastelandAtlas.drawTileAt(ctx, 'cactus', screenX, screenY, TILE_SIZE, variant);
      } else if (tileType === WASTELAND_TILES.ROCK) {
        const variant = (x + y) % 3;
        wastelandAtlas.drawTileAt(ctx, 'rock', screenX, screenY, TILE_SIZE, variant);
      } else if (tileType === WASTELAND_TILES.FACTORY_MAIN) {
        wastelandAtlas.drawTileAt(ctx, 'factory', screenX, screenY, TILE_SIZE, 0);
      } else if (tileType === WASTELAND_TILES.FACTORY_CHIMNEY) {
        wastelandAtlas.drawTileAt(ctx, 'factory', screenX, screenY, TILE_SIZE, 1);
      } else if (tileType === WASTELAND_TILES.BROKEN_WALL) {
        wastelandAtlas.drawTileAt(ctx, 'factory', screenX, screenY, TILE_SIZE, 2);
      } else if (tileType === WASTELAND_TILES.BARREL) {
        wastelandAtlas.drawTileAt(ctx, 'debris', screenX, screenY, TILE_SIZE, 0);
      } else if (tileType === WASTELAND_TILES.SCRAP) {
        wastelandAtlas.drawTileAt(ctx, 'debris', screenX, screenY, TILE_SIZE, 1);
      } else if (tileType === WASTELAND_TILES.DEAD_BUSH) {
        wastelandAtlas.drawTileAt(ctx, 'vegetation', screenX, screenY, TILE_SIZE, 0);
      } else if (tileType === WASTELAND_TILES.GRASS) {
        wastelandAtlas.drawTileAt(ctx, 'vegetation', screenX, screenY, TILE_SIZE, 1);
      }
    }
  }
}

export { WASTELAND, WASTELAND_TILES, renderWasteland, TILE_SIZE };
