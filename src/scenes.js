export const SCENES = {
  town: {
    id: 'town',
    name: '拉多镇(リオラド)',
    background: '#1a1a2e',
    buildings: [
      { id: 'home', x: 0.12, y: 0.22, width: 5, height: 4, name: '主角家', enterable: true, interior: 'home_interior' },
      { id: 'bar', x: 0.35, y: 0.18, width: 4, height: 4, name: '酒吧', enterable: true, interior: 'bar_interior' },
      { id: 'shop', x: 0.58, y: 0.25, width: 4, height: 4, name: '勇士商店', enterable: true, interior: 'shop_interior' },
      { id: 'garage', x: 0.80, y: 0.20, width: 5, height: 4, name: '战车修理厂', enterable: true, interior: 'garage_interior' },
      { id: 'hospital', x: 0.10, y: 0.60, width: 4, height: 4, name: '明奇研究所', enterable: true, interior: 'hospital_interior' },
      { id: 'hunter_office', x: 0.38, y: 0.62, width: 4, height: 4, name: '勇士办事处', enterable: true, interior: 'hunter_interior' },
      { id: 'inn', x: 0.62, y: 0.58, width: 4, height: 4, name: '旅店', enterable: true, interior: 'inn_interior' }
    ]
  },
  home_interior: {
    id: 'home_interior',
    name: '主角家内部',
    background: '#2a2015',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'table', x: 0.5, y: 0.4 },
      { type: 'bed', x: 0.3, y: 0.65 },
      { type: 'bed', x: 0.7, y: 0.65 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  bar_interior: {
    id: 'bar_interior',
    name: '酒吧内部',
    background: '#1a1515',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'counter', x: 0.5, y: 0.3 },
      { type: 'table', x: 0.3, y: 0.6 },
      { type: 'table', x: 0.7, y: 0.6 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  shop_interior: {
    id: 'shop_interior',
    name: '勇士商店内部',
    background: '#1a1a25',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'counter', x: 0.5, y: 0.4 },
      { type: 'shelf', x: 0.3, y: 0.6 },
      { type: 'shelf', x: 0.7, y: 0.6 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  garage_interior: {
    id: 'garage_interior',
    name: '战车修理厂内部',
    background: '#252015',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'workbench', x: 0.5, y: 0.4 },
      { type: 'tool_rack', x: 0.3, y: 0.65 },
      { type: 'oil_barrel', x: 0.7, y: 0.65 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  hospital_interior: {
    id: 'hospital_interior',
    name: '明奇研究所内部',
    background: '#151a20',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'table', x: 0.5, y: 0.35 },
      { type: 'machine', x: 0.3, y: 0.6 },
      { type: 'machine', x: 0.7, y: 0.6 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  hunter_interior: {
    id: 'hunter_interior',
    name: '勇士办事处内部',
    background: '#15201a',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'counter', x: 0.5, y: 0.4 },
      { type: 'wanted_posters', x: 0.3, y: 0.25 },
      { type: 'chair', x: 0.7, y: 0.6 }
    ],
    exitPosition: { x: 0.5, y: 0.9 }
  },
  inn_interior: {
    id: 'inn_interior',
    name: '旅店内部',
    background: '#20151a',
    isInterior: true,
    floorTiles: true,
    items: [
      { type: 'counter', x: 0.5, y: 0.35 },
      { type: 'bed', x: 0.3, y: 0.6 },
      { type: 'bed', x: 0.7, y: 0.6 }
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
