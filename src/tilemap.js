import spriteAtlas, { FC_COLORS } from './sprite_atlas.js';

const TILE_SIZE = 16;

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
  FENCE: 9,
  STONE: 10,
  FLOWER: 11,
  PATH: 12
};

const TileSprites = {
  tileSize: TILE_SIZE,
  colors: FC_COLORS,

  drawGrass(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'grass_tile', x, y);
  },

  drawDirt(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'dirt_tile', x, y);
  },

  drawWater(ctx, x, y, time) {
    const frame = Math.floor(time / 30) % 2;
    spriteAtlas.drawSprite(ctx, 'water_tile', x, y, 'main', frame);
  },

  drawRoad(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'road_tile', x, y);
  },

  drawWall(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'wall_tile', x, y);
  },

  drawFloor(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'floor_tile', x, y);
  },

  drawDoor(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'door_tile', x, y);
  },

  drawRoof(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'roof_tile', x, y);
  },

  drawTree(ctx, x, y) {
    spriteAtlas.drawTree(ctx, x, y, 'oak');
  },

  drawFence(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'fence_tile', x, y);
  },

  drawStone(ctx, x, y) {
    spriteAtlas.drawRock(ctx, x, y);
  },

  drawFlower(ctx, x, y) {
    const color = (x + y) % 2 === 0 ? 'yellow' : 'red';
    spriteAtlas.drawFlower(ctx, x, y, color);
  },

  drawPath(ctx, x, y) {
    spriteAtlas.drawSprite(ctx, 'path_tile', x, y);
  },

  drawTile(ctx, tileType, x, y, time) {
    switch (tileType) {
      case TILES.GRASS:
        this.drawGrass(ctx, x, y);
        break;
      case TILES.DIRT:
        this.drawDirt(ctx, x, y);
        break;
      case TILES.WATER:
        this.drawWater(ctx, x, y, time);
        break;
      case TILES.ROAD:
        this.drawRoad(ctx, x, y);
        break;
      case TILES.WALL:
        this.drawWall(ctx, x, y);
        break;
      case TILES.FLOOR:
        this.drawFloor(ctx, x, y);
        break;
      case TILES.DOOR:
        this.drawDoor(ctx, x, y);
        break;
      case TILES.ROOF:
        this.drawRoof(ctx, x, y);
        break;
      case TILES.TREE:
        this.drawTree(ctx, x, y);
        break;
      case TILES.FENCE:
        this.drawFence(ctx, x, y);
        break;
      case TILES.STONE:
        this.drawStone(ctx, x, y);
        break;
      case TILES.FLOWER:
        this.drawFlower(ctx, x, y);
        break;
      case TILES.PATH:
        this.drawPath(ctx, x, y);
        break;
      default:
        this.drawGrass(ctx, x, y);
    }
  }
};

function renderTilemap(ctx, map, time, offsetX = 0, offsetY = 0) {
  ctx.imageSmoothingEnabled = false;
  const { tiles, width, height } = map;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tileType = tiles[y * width + x];
      TileSprites.drawTile(ctx, tileType, x * TILE_SIZE + offsetX, y * TILE_SIZE + offsetY, time);
    }
  }
}

function getTileSize() {
  return TILE_SIZE;
}

export { renderTilemap, getTileSize, TILES, FC_COLORS };
