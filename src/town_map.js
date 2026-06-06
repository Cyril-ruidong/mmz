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
      tiles[y * MAP_WIDTH + x] = TILES.ROAD_H;
    }
  }
  
  for (let x = 8; x < 14; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD_V;
    }
  }
  for (let x = 24; x < 30; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD_V;
    }
  }
  
  for (let y = 12; y < 18; y++) {
    for (let x = 8; x < 14; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD_CROSS;
    }
    for (let x = 24; x < 30; x++) {
      tiles[y * MAP_WIDTH + x] = TILES.ROAD_CROSS;
    }
  }
  
  for (let x = 1; x < 7; x++) {
    for (let y = 20; y < 28; y++) {
      tiles[y * MAP_WIDTH + x] = TILES.DIRT;
    }
  }
  
  addBuilding(tiles, 2, 20, 5, 6, 'home');
  
  addBuilding(tiles, 15, 20, 4, 4, 'bar');
  
  addBuilding(tiles, 31, 20, 5, 4, 'shop');
  
  addBuilding(tiles, 2, 4, 5, 5, 'garage');
  
  addBuilding(tiles, 31, 4, 6, 5, 'hospital');
  
  addBuilding(tiles, 15, 4, 5, 4, 'hunter');
  
  addBuilding(tiles, 22, 4, 5, 4, 'inn');
  
  for (let x = 0; x < MAP_WIDTH; x++) {
    tiles[MAP_HEIGHT - 1 + x * MAP_WIDTH] = TILES.FENCE;
    tiles[x] = TILES.FENCE;
  }
  for (let y = 0; y < MAP_HEIGHT; y++) {
    tiles[y * MAP_WIDTH] = TILES.FENCE;
    tiles[y * MAP_WIDTH + MAP_WIDTH - 1] = TILES.FENCE;
  }
  
  addTree(tiles, 1, 10);
  addTree(tiles, 4, 10);
  addTree(tiles, 15, 10);
  addTree(tiles, 18, 10);
  addTree(tiles, 22, 10);
  addTree(tiles, 33, 10);
  addTree(tiles, 36, 10);
  addTree(tiles, 1, 27);
  addTree(tiles, 8, 27);
  addTree(tiles, 20, 27);
  addTree(tiles, 28, 27);
  addTree(tiles, 35, 27);
  
  addLight(tiles, 11, 11);
  addLight(tiles, 27, 11);
  addLight(tiles, 11, 18);
  addLight(tiles, 27, 18);
  
  addSign(tiles, 20, 14);
  
  return tiles;
}

function addBuilding(tiles, startX, startY, width, height, type) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      const idx = y * MAP_WIDTH + x;
      if (y === startY) {
        tiles[idx] = TILES.ROOF_EDGE;
      } else if (y < startY + height - 1) {
        tiles[idx] = TILES.ROOF;
      } else {
        if (x === startX + Math.floor(width / 2)) {
          tiles[idx] = TILES.DOOR;
        } else {
          tiles[idx] = TILES.WALL_TOP;
        }
      }
    }
  }
  
  for (let y = startY + height; y < startY + height + 2; y++) {
    for (let x = startX; x < startX + width; x++) {
      const idx = y * MAP_WIDTH + x;
      if (x === startX) {
        tiles[idx] = TILES.WALL_SIDE;
      } else if (x === startX + width - 1) {
        tiles[idx] = TILES.WALL_SIDE;
      } else {
        tiles[idx] = TILES.DIRT;
      }
    }
  }
}

function addTree(tiles, x, y) {
  tiles[y * MAP_WIDTH + x] = TILES.TREE;
}

function addLight(tiles, x, y) {
  tiles[y * MAP_WIDTH + x] = TILES.LIGHT;
}

function addSign(tiles, x, y) {
  tiles[y * MAP_WIDTH + x] = TILES.SIGN;
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
  
  markBuildingCollision(collisions, 2, 20, 5, 8);
  markBuildingCollision(collisions, 15, 20, 4, 6);
  markBuildingCollision(collisions, 31, 20, 5, 6);
  markBuildingCollision(collisions, 2, 4, 5, 7);
  markBuildingCollision(collisions, 31, 4, 6, 7);
  markBuildingCollision(collisions, 15, 4, 5, 6);
  markBuildingCollision(collisions, 22, 4, 5, 6);
  
  markTreeCollision(collisions, 1, 10);
  markTreeCollision(collisions, 4, 10);
  markTreeCollision(collisions, 15, 10);
  markTreeCollision(collisions, 18, 10);
  markTreeCollision(collisions, 22, 10);
  markTreeCollision(collisions, 33, 10);
  markTreeCollision(collisions, 36, 10);
  markTreeCollision(collisions, 1, 27);
  markTreeCollision(collisions, 8, 27);
  markTreeCollision(collisions, 20, 27);
  markTreeCollision(collisions, 28, 27);
  markTreeCollision(collisions, 35, 27);
  
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
  { x: 4, y: 27, target: 'home' },
  { x: 17, y: 25, target: 'bar' },
  { x: 33, y: 25, target: 'shop' },
  { x: 4, y: 10, target: 'garage' },
  { x: 34, y: 10, target: 'hospital' },
  { x: 17, y: 9, target: 'hunter' },
  { x: 24, y: 9, target: 'inn' }
];

const START_POSITION = { x: 20, y: 15 };

export const TOWN_MAP = {
  tiles: createTownTiles(),
  collisions: createCollisionMap(),
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  entrances: ENTRANCES,
  startPosition: START_POSITION
};
