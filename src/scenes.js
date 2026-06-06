import { TOWN_MAP } from './town_map.js';
import { INTERIOR_MAPS } from './interior_maps.js';
import { collisionSystem } from './collision_system.js';
import { getTileSize } from './tilemap.js';

class SceneManager {
  constructor() {
    this.currentScene = 'town';
    this.isInterior = false;
    this.townMap = TOWN_MAP;
    this.interiorMaps = INTERIOR_MAPS;
    this.tileSize = getTileSize();
    
    collisionSystem.setMap(this.townMap);
  }

  getCurrentMap() {
    if (this.isInterior) {
      return this.interiorMaps[this.currentScene];
    }
    return this.townMap;
  }

  getSceneName() {
    if (this.isInterior) {
      return this.interiorMaps[this.currentScene].name;
    }
    return '拉多镇';
  }

  enterInterior(interiorId) {
    if (this.interiorMaps[interiorId]) {
      this.currentScene = interiorId;
      this.isInterior = true;
      collisionSystem.setMap(this.interiorMaps[interiorId]);
      return this.interiorMaps[interiorId].startPosition;
    }
    return null;
  }

  exitToTown() {
    this.currentScene = 'town';
    this.isInterior = false;
    collisionSystem.setMap(this.townMap);
    
    const entrancePositions = {
      home: { x: 4, y: 26 },
      bar: { x: 17, y: 24 },
      shop: { x: 33, y: 24 },
      garage: { x: 4, y: 9 },
      hospital: { x: 34, y: 9 },
      hunter: { x: 17, y: 8 },
      inn: { x: 24, y: 8 }
    };
    
    return entrancePositions[this.currentScene] || this.townMap.startPosition;
  }

  checkEntrance(pixelX, pixelY) {
    if (this.isInterior) {
      if (collisionSystem.checkExit(pixelX, pixelY)) {
        return 'exit';
      }
      return null;
    }
    
    return collisionSystem.findEntrance(pixelX, pixelY);
  }
}

export const sceneManager = new SceneManager();
