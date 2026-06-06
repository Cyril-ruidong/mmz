import { TILES } from './tilemap.js';

const MAP_WIDTH = 32;
const MAP_HEIGHT = 24;

function createTownTiles() {
  const tiles = [];

  for (let i = 0; i < MAP_WIDTH * MAP_HEIGHT; i++) {
    tiles.push(TILES.GRASS);
  }

  for (let y = 10; y < 14; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  for (let x = 12; x < 16; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD;
    }
  }

  addBuilding(tiles, 2, 2, 6, 6, 'house');
  addBuilding(tiles, 12, 2, 8, 6, 'shop');
  addBuilding(tiles, 24, 2, 6, 6, 'lab');
  addBuilding(tiles, 2, 16, 6, 6, 'house');
  addBuilding(tiles, 12, 16, 8, 6, 'shop');
  addBuilding(tiles, 24, 16, 6, 6, 'lab');

  addTree(tiles, 0, 8);
  addTree(tiles, 1, 8);
  addTree(tiles, 8, 8);
  addTree(tiles, 9, 8);
  addTree(tiles, 20, 8);
  addTree(tiles, 21, 8);
  addTree(tiles, 30, 8);
  addTree(tiles, 31, 8);
  addTree(tiles, 0, 16);
  addTree(tiles, 1, 16);
  addTree(tiles, 8, 16);
  addTree(tiles, 9, 16);
  addTree(tiles, 20, 16);
  addTree(tiles, 21, 16);
  addTree(tiles, 30, 16);
  addTree(tiles, 31, 16);

  addFence(tiles, 0, 0, MAP_WIDTH, 1);
  addFence(tiles, 0, MAP_HEIGHT - 1, MAP_WIDTH, 1);
  addFence(tiles, 0, 0, 1, MAP_HEIGHT);
  addFence(tiles, MAP_WIDTH - 1, 0, 1, MAP_HEIGHT);

  return tiles;
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

function addFence(tiles, startX, startY, width, height) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        tiles[y * MAP_WIDTH + x] = TILES.FENCE;
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
      const idx = y * MAP_WIDTH + x;
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        collisions[idx] = true;
      }
    }
  }

  markBuildingCollision(collisions, 2, 2, 6, 6);
  markBuildingCollision(collisions, 12, 2, 8, 6);
  markBuildingCollision(collisions, 24, 2, 6, 6);
  markBuildingCollision(collisions, 2, 16, 6, 6);
  markBuildingCollision(collisions, 12, 16, 8, 6);
  markBuildingCollision(collisions, 24, 16, 6, 6);

  markTreeCollision(collisions, 0, 8);
  markTreeCollision(collisions, 1, 8);
  markTreeCollision(collisions, 8, 8);
  markTreeCollision(collisions, 9, 8);
  markTreeCollision(collisions, 20, 8);
  markTreeCollision(collisions, 21, 8);
  markTreeCollision(collisions, 30, 8);
  markTreeCollision(collisions, 31, 8);
  markTreeCollision(collisions, 0, 16);
  markTreeCollision(collisions, 1, 16);
  markTreeCollision(collisions, 8, 16);
  markTreeCollision(collisions, 9, 16);
  markTreeCollision(collisions, 20, 16);
  markTreeCollision(collisions, 21, 16);
  markTreeCollision(collisions, 30, 16);
  markTreeCollision(collisions, 31, 16);

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
  { x: 4, y: 7, target: 'home' },
  { x: 15, y: 7, target: 'shop' },
  { x: 26, y: 7, target: 'lab' },
  { x: 4, y: 21, target: 'garage' },
  { x: 15, y: 21, target: 'hospital' },
  { x: 26, y: 21, target: 'hunter' }
];

const START_POSITION = { x: 14, y: 12 };

export const TOWN_MAP = {
  tiles: createTownTiles(),
  collisions: createCollisionMap(),
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  entrances: ENTRANCES,
  startPosition: START_POSITION
};
