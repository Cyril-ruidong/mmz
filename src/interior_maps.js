import { TILES } from './tilemap.js';

const INTERIOR_WIDTH = 16;
const INTERIOR_HEIGHT = 12;

function createInteriorBase() {
  const tiles = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      tiles.push(TILES.FLOOR);
    }
  }
  
  for (let x = 0; x < INTERIOR_WIDTH; x++) {
    tiles[x] = TILES.WALL_TOP;
  }
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    tiles[y * INTERIOR_WIDTH] = TILES.WALL_SIDE;
    tiles[y * INTERIOR_WIDTH + INTERIOR_WIDTH - 1] = TILES.WALL_SIDE;
  }
  tiles[0] = TILES.WALL_CORNER;
  tiles[INTERIOR_WIDTH - 1] = TILES.WALL_CORNER;
  
  const doorX = Math.floor(INTERIOR_WIDTH / 2);
  tiles[(INTERIOR_HEIGHT - 1) * INTERIOR_WIDTH + doorX] = TILES.DOOR;
  tiles[(INTERIOR_HEIGHT - 1) * INTERIOR_WIDTH + doorX - 1] = TILES.WALL_SIDE;
  tiles[(INTERIOR_HEIGHT - 1) * INTERIOR_WIDTH + doorX + 1] = TILES.WALL_SIDE;
  
  return tiles;
}

function createInteriorCollision(extraCollisions = []) {
  const collisions = [];
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      if (x === 0 || x === INTERIOR_WIDTH - 1 || y === 0) {
        collisions.push(true);
      } else if (y === INTERIOR_HEIGHT - 1) {
        const doorX = Math.floor(INTERIOR_WIDTH / 2);
        collisions.push(x !== doorX);
      } else {
        collisions.push(false);
      }
    }
  }
  
  extraCollisions.forEach(pos => {
    const idx = pos.y * INTERIOR_WIDTH + pos.x;
    if (idx >= 0 && idx < collisions.length) {
      collisions[idx] = true;
    }
  });
  
  return collisions;
}

function createHomeInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 10, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 },
    { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
    { x: 10, y: 4 }, { x: 11, y: 4 }, { x: 12, y: 4 },
    { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }
  ]);
  
  for (let y = 3; y <= 5; y++) {
    for (let x = 3; x <= 5; x++) {
      tiles[y * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    }
    for (let x = 10; x <= 12; x++) {
      tiles[y * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    }
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '主角家'
  };
}

function createBarInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, 
    { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 },
    { x: 10, y: 2 }, { x: 11, y: 2 },
    { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
    { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 },
    { x: 10, y: 3 }, { x: 11, y: 3 },
    { x: 3, y: 6 }, { x: 4, y: 6 },
    { x: 11, y: 6 }, { x: 12, y: 6 }
  ]);
  
  for (let x = 4; x <= 11; x++) {
    tiles[2 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    tiles[3 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '酒吧'
  };
}

function createShopInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
    { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
    { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 },
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 },
    { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 },
    { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 },
    { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }
  ]);
  
  for (let x = 3; x <= 11; x++) {
    tiles[2 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    tiles[3 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '勇士商店'
  };
}

function createGarageInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    { x: 11, y: 3 }, { x: 12, y: 3 }, { x: 13, y: 3 },
    { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 13, y: 4 },
    { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 },
    { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }
  ]);
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '战车修理厂'
  };
}

function createHospitalInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
    { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 },
    { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
    { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 }
  ]);
  
  for (let x = 4; x <= 11; x++) {
    tiles[2 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    tiles[3 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '明奇研究所'
  };
}

function createHunterInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
    { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 },
    { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
    { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 },
    { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 11, y: 5 }, { x: 12, y: 5 }
  ]);
  
  for (let x = 5; x <= 10; x++) {
    tiles[2 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    tiles[3 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '勇士办事处'
  };
}

function createInnInterior() {
  const tiles = createInteriorBase();
  const collisions = createInteriorCollision([
    { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
    { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 },
    { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
    { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 },
    { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
    { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 },
    { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 },
    { x: 11, y: 6 }, { x: 12, y: 6 }, { x: 13, y: 6 }
  ]);
  
  for (let x = 5; x <= 10; x++) {
    tiles[2 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
    tiles[3 * INTERIOR_WIDTH + x] = TILES.WALL_TOP;
  }
  
  return {
    tiles,
    collisions,
    width: INTERIOR_WIDTH,
    height: INTERIOR_HEIGHT,
    exit: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 1 },
    startPosition: { x: Math.floor(INTERIOR_WIDTH / 2), y: INTERIOR_HEIGHT - 2 },
    name: '旅店'
  };
}

export const INTERIOR_MAPS = {
  home: createHomeInterior(),
  bar: createBarInterior(),
  shop: createShopInterior(),
  garage: createGarageInterior(),
  hospital: createHospitalInterior(),
  hunter: createHunterInterior(),
  inn: createInnInterior()
};
