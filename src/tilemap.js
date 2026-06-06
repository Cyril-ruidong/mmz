import PixelSprites from './pixel_sprites.js';

const TILE_SIZE = 16;

const FC_COLORS = {
  BG: '#1c3c2c',
  GRASS: '#4c8c4c',
  ROAD: '#dcc89c',
  BUILDING: '#ac7c5c',
  WATER: '#5c9cbc',
  BLACK: '#000000',
  WHITE: '#fcfffc'
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
  FENCE: 9
};

const TileSprites = {
  tileSize: TILE_SIZE,
  colors: FC_COLORS,

  drawGrass(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGBGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGBGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGBGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG',
      'GGGGGGGGGGGGGGGG'
    ], x, y, 1, { G: FC_COLORS.GRASS, B: FC_COLORS.BG });
  },

  drawDirt(ctx, x, y) {
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
    ], x, y, 1, { S: FC_COLORS.ROAD });
  },

  drawWater(ctx, x, y, time) {
    const wave = time % 2 === 0 ? 'W' : 'w';
    PixelSprites.drawSpriteFromGrid(ctx, [
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWW'
    ], x, y, 1, { W: FC_COLORS.WATER, w: FC_COLORS.WATER });
  },

  drawRoad(ctx, x, y) {
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
    ], x, y, 1, { S: FC_COLORS.ROAD });
  },

  drawWall(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'SSSSSSSSSSSSSSSS',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'SSSSSSSSSSSSSSSS',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'SSSSSSSSSSSSSSSS',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'SSSSSSSSSSSSSSSS',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'SSSSSSSSSSSSSSSS',
      'BBBBBBBBBBBBBBBB'
    ], x, y, 1, { B: FC_COLORS.BUILDING, S: FC_COLORS.ROAD });
  },

  drawFloor(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSBBBBBBSSSSSSSS',
      'SSBBBBBBSSSSSSSS',
      'SSBBBBBBSSSSSSSS',
      'SSBBBBBBSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSBBBBSS',
      'SSSSSSSSSSBBBBSS',
      'SSSSSSSSSSBBBBSS',
      'SSSSSSSSSSBBBBSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS'
    ], x, y, 1, { S: FC_COLORS.ROAD, B: FC_COLORS.BUILDING });
  },

  drawDoor(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBKKKKKBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB'
    ], x, y, 1, { B: FC_COLORS.BUILDING, K: FC_COLORS.BLACK });
  },

  drawRoof(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBB'
    ], x, y, 1, { B: FC_COLORS.BUILDING });
  },

  drawTree(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      '      GGGG      ',
      '     GGGGGG     ',
      '    GGGGGGGG    ',
      '   GGGGGGGGGG   ',
      '  GGGGGGGGGGGG  ',
      ' GGGGGGGGGGGGGG ',
      'GGGGGGGGGGGGGGGG',
      ' GGGGGGGGGGGGGG ',
      '  GGGGGGGGGGGG  ',
      '      TTTT      ',
      '      TTTT      ',
      '      TTTT      ',
      '      TTTT      ',
      '      TTTT      ',
      '      TTTT      ',
      '      TTTT      '
    ], x, y, 1, { G: FC_COLORS.GRASS, T: FC_COLORS.BUILDING });
  },

  drawFence(ctx, x, y) {
    PixelSprites.drawSpriteFromGrid(ctx, [
      'SSSSSSSSSSSSSSSS',
      'SBBSSBBSSBBSSBB',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SBBSSBBSSBBSSBB',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SBBSSBBSSBBSSBB',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SBBSSBBSSBBSSBB',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS',
      'SBBSSBBSSBBSSBB',
      'SSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSS'
    ], x, y, 1, { S: FC_COLORS.BG, B: FC_COLORS.BUILDING });
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
