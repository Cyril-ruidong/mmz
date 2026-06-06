import { TILES } from './tilemap.js';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;

function createTownTiles() {
  const tiles = [];

  for (let i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
    tiles.push(TILES.GRASS);
  }

  for (let y = 12; y < 18; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  for (let x = 16; x < 24; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  for (let y = 5; y < 12; y++) {
    for (let x = 16; x < 24; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  for (let y = 18; y < 25; y++) {
    for (let x = 16; x < 24; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  addBuilding(tiles, 3, 3, 10, 8, 'shop');
  addBuilding(tiles, 27, 3, 10, 8, 'house');
  addBuilding(tiles, 3, 19, 10, 8, 'lab');
  addBuilding(tiles, 27, 19, 10, 8, 'bar');
  addBuilding(tiles, 16, 3, 10, 8, 'hospital');
  addBuilding(tiles, 16, 19, 10, 8, 'garage');

  for (let x = 2; x < MAP_WIDTH - 2; x++) {
    addDecor(tiles, x, 2);
    addDecor(tiles, x, 11);
    addDecor(tiles, x, 18);
    addDecor(tiles, x, 27);
  }

  for (let y = 3; y < MAP_HEIGHT - 3; y++) {
    addDecor(tiles, 2, y);
    addDecor(tiles, 37, y);
  }

  for (let i = 0; i < 10; i++) {
    const x = 3 + Math.floor(Math.random() * 34);
    const y = 3 + Math.floor(Math.random() * 24);
    if (!isBuildingArea(x, y)) {
      addTree(tiles, x, y);
    }
  }

  for (let i = 0; i < 15; i++) {
    const x = 3 + Math.floor(Math.random() * 34);
    const y = 3 + Math.floor(Math.random() * 24);
    if (!isBuildingArea(x, y) && !isRoad(x, y)) {
      addFlower(tiles, x, y);
    }
  }

  addPath(tiles, 7, 10, 7, 12);
  addPath(tiles, 32, 10, 32, 12);
  addPath(tiles, 7, 18, 7, 18);
  addPath(tiles, 32, 18, 32, 18);

  return tiles;
}

function isBuildingArea(x, y) {
  return (x >= 3 && x < 13 && y >= 3 && y < 11) ||
         (x >= 27 && x < 37 && y >= 3 && y < 11) ||
         (x >= 3 && x < 13 && y >= 19 && y < 27) ||
         (x >= 27 && x < 37 && y >= 19 && y < 27) ||
         (x >= 16 && x < 26 && y >= 3 && y < 11) ||
         (x >= 16 && x < 26 && y >= 19 && y < 27);
}

function isRoad(x, y) {
  return (y >= 12 && y < 18) ||
         (x >= 16 && x < 24);
}

function addBuilding(tiles, startX, startY, width, height, type) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      const idx = y * MAP_WIDTH + x;
      if (y < startY + 3) {
        tiles[idx] = TILES.ROOF;
      } else if (y === startY + height - 1 && x === startX + Math.floor(width / 2)) {
        tiles[idx] = TILES.DOOR;
      } else {
        tiles[idx] = TILES.WALL;
      }
    }
  }
}

function addTree(tiles, x, y) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    tiles[y * MAP_WIDTH + x] = TILES.TREE;
  }
}

function addFlower(tiles, x, y) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    tiles[y * MAP_WIDTH + x] = TILES.FLOWER;
  }
}

function addDecor(tiles, x, y) {
  if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
    if (Math.random() > 0.5) {
      tiles[y * MAP_WIDTH + x] = TILES.TREE;
    } else {
      tiles[y * MAP_WIDTH + x] = TILES.FLOWER;
    }
  }
}

function addPath(tiles, startX, startY, endX, endY) {
  for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
    for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        tiles[y * MAP_WIDTH + x] = TILES.PATH;
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

  markBuildingCollision(collisions, 3, 3, 10, 8);
  markBuildingCollision(collisions, 27, 3, 10, 8);
  markBuildingCollision(collisions, 3, 19, 10, 8);
  markBuildingCollision(collisions, 27, 19, 10, 8);
  markBuildingCollision(collisions, 16, 3, 10, 8);
  markBuildingCollision(collisions, 16, 19, 10, 8);

  for (let i = 0; i < 10; i++) {
    const x = 3 + Math.floor(Math.random() * 34);
    const y = 3 + Math.floor(Math.random() * 24);
    if (!isBuildingArea(x, y)) {
      markTreeCollision(collisions, x, y);
    }
  }

  return collisions;
}

function markBuildingCollision(collisions, startX, startY, width, height) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      const idx = y * MAP_WIDTH + x;
      if (idx >= 0 && idx < MAP_WIDTH * MAP_HEIGHT) {
        collisions[idx] = true;
      }
    }
  }
}

function markTreeCollision(collisions, x, y) {
  const idx = y * MAP_WIDTH + x;
  if (idx >= 0 && idx < MAP_WIDTH * MAP_HEIGHT) {
    collisions[idx] = true;
  }
}

const ENTRANCES = [
  { x: 7, y: 10, target: 'shop' },
  { x: 31, y: 10, target: 'house' },
  { x: 7, y: 26, target: 'lab' },
  { x: 31, y: 26, target: 'bar' },
  { x: 19, y: 10, target: 'hospital' },
  { x: 19, y: 26, target: 'garage' }
];

const START_POSITION = { x: 19, y: 15 };

export const TOWN_MAP = {
  tiles: createTownTiles(),
  collisions: createCollisionMap(),
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  entrances: ENTRANCES,
  startPosition: START_POSITION
};
