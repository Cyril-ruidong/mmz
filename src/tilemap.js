import PixelSprites from './pixel_sprites.js';

const TILE_SIZE = 16;

const FC_COLORS = {
  BG: '#1c3c2c',
  GRASS: '#4c8c4c',
  GRASS_LIGHT: '#5a9a5a',
  GRASS_DARK: '#3a7a3a',
  ROAD: '#dcc89c',
  ROAD_DARK: '#c8b080',
  ROAD_LIGHT: '#ecd8ac',
  BUILDING: '#ac7c5c',
  BUILDING_DARK: '#8c5c3c',
  BUILDING_LIGHT: '#cc9c7c',
  ROOF: '#cc4444',
  ROOF_DARK: '#aa2222',
  ROOF_LIGHT: '#ee6666',
  WATER: '#5c9cbc',
  WATER_LIGHT: '#7cbcdc',
  WATER_DARK: '#4c7c9c',
  BLACK: '#000000',
  WHITE: '#fcfffc',
  YELLOW: '#f8f880',
  RED: '#f88080',
  WINDOW: '#3c5c7c',
  TREE_TRUNK: '#6c4c2c',
  TREE_LEAVES: '#2c6c2c',
  TREE_LIGHT: '#3c8c3c',
  STONE: '#9c9c9c',
  STONE_DARK: '#7c7c7c'
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
  FENCE: 9,
  STONE: 10,
  FLOWER: 11,
  PATH: 12
};

const TileSprites = {
  tileSize: TILE_SIZE,
  colors: FC_COLORS,

  drawGrass(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'GGGGGGGGGGGGGGGG',
      'GGLGGGGGGGGFGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGFGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGFGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGLGGGGGGGGGGGGG',
      'GGGGGGGGGGGGFGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGFGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGFGGGGGGGGG',
      'GGGGGGGGGGGGGGGG'
    ], x, y, 1, { G: FC_COLORS.GRASS, L: FC_COLORS.GRASS_LIGHT, F: FC_COLORS.GRASS_DARK });
  },

  drawDirt(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD'
    ], x, y, 1, { D: FC_COLORS.ROAD });
  },

  drawWater(ctx, x, y, time) {
    const colors = {
      '0': FC_COLORS.WATER,
      '1': FC_COLORS.WATER_LIGHT,
      '2': FC_COLORS.WATER,
      '3': FC_COLORS.WATER_DARK
    };
    PixelSprites.drawSpriteFromGrid(ctx, [
      '0011110011110011',
      '0011110011110011',
      '2233332233332233',
      '2233332233332233',
      '0011110011110011',
      '0011110011110011',
      '2233332233332233',
      '2233332233332233',
      '0011110011110011',
      '0011110011110011',
      '2233332233332233',
      '2233332233332233',
      '0011110011110011',
      '0011110011110011',
      '2233332233332233',
      '2233332233332233'
    ], x, y, 1, colors);
  },

  drawRoad(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD'
    ], x, y, 1, { D: FC_COLORS.ROAD });
  },

  drawWall(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'WWWWWWWWWWWWWWWW',
      'WLLLWLLLWLLLWLLW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WLLLWLLLWLLLWLLW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WLLLWLLLWLLLWLLW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WLLLWLLLWLLLWLLW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WLLLWLLLWLLLWLLW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW'
    ], x, y, 1, { W: FC_COLORS.BUILDING, L: FC_COLORS.BUILDING_LIGHT });
  },

  drawFloor(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS'
    ], x, y, 1, { S: FC_COLORS.ROAD_DARK });
  },

  drawDoor(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWKKKKKKKKKKWW',
      'WWWWWWWWWWWWWWWW'
    ], x, y, 1, { W: FC_COLORS.BUILDING, K: FC_COLORS.BLACK });
  },

  drawRoof(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR',
      'RRRRRRRRRRRRRRRR',
      'RLLRRLLRRLLRRLLR'
    ], x, y, 1, { R: FC_COLORS.ROOF, L: FC_COLORS.ROOF_LIGHT });
  },

  drawTree(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      '    LLLLLL    ',
      '   LLLLLLLL   ',
      '  LLLLLLLLLL  ',
      ' LLLLLLLLLLLL ',
      'LLLLLLLLLLLLLLL',
      'LLLLLLLLLLLLLLL',
      ' LLLLLLLLLLLLL ',
      '  LLLLLLLLLL  ',
      '    LLLLLL    ',
      '     TTTT     ',
      '     TTTT     ',
      '     TTTT     ',
      '     TTTT     ',
      '     TTTT     ',
      '     TTTT     ',
      '     TTTT     '
    ], x, y, 1, { L: FC_COLORS.TREE_LEAVES, T: FC_COLORS.TREE_TRUNK });
  },

  drawFence(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'WWWWWWWWWWWWWWWW',
      'W  W  W  W  W  W',
      'WWWWWWWWWWWWWWWW',
      ' W  W  W  W  W W',
      'WWWWWWWWWWWWWWWW',
      'W  W  W  W  W  W',
      'WWWWWWWWWWWWWWWW',
      ' W  W  W  W  W W',
      'WWWWWWWWWWWWWWWW',
      'W  W  W  W  W  W',
      'WWWWWWWWWWWWWWWW',
      ' W  W  W  W  W W',
      'WWWWWWWWWWWWWWWW',
      'W  W  W  W  W  W',
      'WWWWWWWWWWWWWWWW',
      ' W  W  W  W  W W'
    ], x, y, 1, { W: FC_COLORS.BUILDING });
  },

  drawStone(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS'
    ], x, y, 1, { S: FC_COLORS.STONE });
  },

  drawFlower(ctx, x, y) {
    const flowerType = (x + y) % 2;
    
    const patterns = [
      [
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGFGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGFGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG'
      ],
      [
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGFGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGFGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG',
        'GGGGGGGGGGGGGGGG'
      ]
    ];
    
    PixelSprites.drawSpriteFromGrid(ctx, patterns[flowerType], x, y, 1, { G: FC_COLORS.GRASS, F: flowerType === 0 ? FC_COLORS.YELLOW : FC_COLORS.RED });
  },

  drawPath(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD',
      'DDDDDDDDDDDDDDDD'
    ], x, y, 1, { D: FC_COLORS.ROAD_LIGHT });
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
