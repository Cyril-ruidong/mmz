export const SCENES = {
  town: {
    id: 'town',
    name: '战后城镇',
    background: '#1a1a2e',
    buildings: [
      { id: 'house1', x: 0.12, y: 0.22, width: 4, height: 4, name: '民房', enterable: true, interior: 'house_interior' },
      { id: 'house2', x: 0.32, y: 0.18, width: 4, height: 4, name: '杂货店', enterable: true, interior: 'shop_interior' },
      { id: 'house3', x: 0.58, y: 0.25, width: 4, height: 4, name: '的车库', enterable: true, interior: 'garage_interior' },
      { id: 'house4', x: 0.82, y: 0.20, width: 4, height: 4, name: '废弃建筑', enterable: false },
      { id: 'house5', x: 0.10, y: 0.58, width: 4, height: 4, name: '民的舍', enterable: true, interior: 'house_interior' },
      { id: 'house6', x: 0.42, y: 0.62, width: 4, height: 4, name: '武器店', enterable: true, interior: 'weapon_shop' },
      { id: 'house7', x: 0.68, y: 0.56, width: 4, height: 4, name: '废墟', enterable: false },
      { id: 'house8', x: 0.85, y: 0.60, width: 4, height: 4, name: '指挥中心', enterable: true, interior: 'command_center' }
    ]
  },
  house_interior: {
    id: 'house_interior',
    name: '民房内部',
    background: '#2a2015',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'table', x: 0.5, y: 0.5 },
      { type: 'bed', x: 0.3, y: 0.7 },
      { type: 'lamp', x: 0.7, y: 0.3 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  shop_interior: {
    id: 'shop_interior',
    name: '杂货店内部',
    background: '#1a1a25',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'counter', x: 0.5, y: 0.4 },
      { type: 'shelf', x: 0.3, y: 0.6 },
      { type: 'crate', x: 0.7, y: 0.7 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  garage_interior: {
    id: 'garage_interior',
    name: '车库内部',
    background: '#1a1515',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'workbench', x: 0.4, y: 0.5 },
      { type: 'oil_barrel', x: 0.7, y: 0.6 },
      { type: 'parts', x: 0.3, y: 0.7 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  weapon_shop: {
    id: 'weapon_shop',
    name: '武器店内部',
    background: '#15151a',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'weapon_rack', x: 0.5, y: 0.4 },
      { type: 'ammo_crate', x: 0.3, y: 0.7 },
      { type: 'display_case', x: 0.7, y: 0.5 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  command_center: {
    id: 'command_center',
    name: '指挥中心',
    background: '#0a1520',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'radar', x: 0.5, y: 0.35 },
      { type: 'console', x: 0.3, y: 0.6 },
      { type: 'map_table', x: 0.7, y: 0.5 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  }
};

export let currentScene = SCENES.town;
export let playerInBuilding = null;

export function switchScene(sceneId) {
  if (SCENES[sceneId]) {
    currentScene = SCENES[sceneId];
    playerInBuilding = sceneId;
    return true;
  }
  return false;
}

export function exitBuilding(playerX, playerY, canvasWidth, canvasHeight) {
  const exitPos = currentScene.exitPosition;
  if (exitPos) {
    playerX = exitPos.x * canvasWidth;
    playerY = exitPos.y * canvasHeight;
  }
  
  currentScene = SCENES.town;
  playerInBuilding = null;
  
  return { x: playerX, y: playerY };
}

export function isInInterior() {
  return currentScene.isInterior === true;
}

export function getBuildings() {
  return currentScene.buildings || [];
}

export function checkEnterBuilding(playerX, playerY, canvasWidth, canvasHeight) {
  if (currentScene.isInterior) return null;
  
  const buildings = currentScene.buildings;
  const tileSize = 32;
  
  for (const building of buildings) {
    if (!building.enterable) continue;
    
    const bx = canvasWidth * building.x;
    const by = canvasHeight * building.y;
    const bw = building.width * tileSize;
    const bh = building.height * tileSize;
    
    if (playerX >= bx && playerX <= bx + bw &&
        playerY >= by && playerY <= by + bh) {
      return building;
    }
  }
  
  return null;
}

export function checkExitBuilding(playerX, playerY, canvasWidth, canvasHeight) {
  if (!currentScene.isInterior || !currentScene.exitPosition) return false;
  
  const exitX = currentScene.exitPosition.x * canvasWidth;
  const exitY = currentScene.exitPosition.y * canvasHeight;
  const exitRadius = 40;
  
  const dist = Math.sqrt(
    (playerX - exitX) ** 2 +
    (playerY - exitY) ** 2
  );
  
  return dist < exitRadius;
}
