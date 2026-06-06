import PixelSprites from './pixel_sprites.js';

// 16色限制调色板 - Metal Max Returns 风格
const TANK_PALETTE = {
  R: '#c82424',        // 0: 血染主红
  L: '#e85454',        // 1: 红色高光
  D: '#8c1414',        // 2: 红色阴影
  X: '#5c0c0c',        // 3: 最深红色
  M: '#6c6c6c',        // 4: 金属灰主色
  G: '#9c9c9c',        // 5: 金属高光
  H: '#3c3c3c',        // 6: 金属阴影
  I: '#1c1c1c',        // 7: 深金属
  T: '#2c2c2c',        // 8: 履带主色
  B: '#4c4c4c',        // 9: 履带高光
  U: '#5c3c1c',        // 10: 履带泥土
  V: '#8c6c3c',        // 11: 灰尘
  W: '#f8d870',        // 12: 火焰黄
  O: '#f88438',        // 13: 火焰橙
  K: '#0c0606',        // 14: 弹孔/深黑
  S: '#7c3c1c'         // 15: 锈迹
};

const TANK_SPRITES = {
  up: [
    // 1
    '                ',
    // 2 - 炮管顶端
    '       DD       ',
    // 3
    '      DXXD      ',
    // 4
    '      DMMD      ',
    // 5 - 炮管
    '      DMMD      ',
    '      DMMD      ',
    // 7 - 炮管根部
    '      DMMD      ',
    '     DDMMMDD    ',
    // 9 - 炮塔顶
    '    DDMMMMMMD   ',
    // 10 - 机枪塔
    '   DMGMMMGMGD   ',
    // 11 - 机枪
    '   DMGMGMGMGD   ',
    '   DMGMGMGMGD   ',
    // 13 - 炮塔
    '  DMMGMMMMGMMD  ',
    '  DMGMMMMMMMMD  ',
    // 15 - 车身
    '  DMRLLRLLRLLMD  ',
    '  DMRRRRMMMMMRD  '
  ],
  down: [
    // 车身
    '  DMRRRMMMMMRRD  ',
    '  DMRLLRRLLRRMD  ',
    '  DMRRRRMMMMMRD  ',
    // 炮塔
    '  DMMGMMMMMGMMD  ',
    '   DMGMMMMMMMD   ',
    // 机枪
    '   DMGMGMGMGMD   ',
    '   DMGMGMGMGMD   ',
    // 炮塔底
    '   DMGMMMMMGMD   ',
    '    DDMMMMMMDD   ',
    // 炮管根部
    '     DDMMMMDD    ',
    '      DMMD       ',
    // 炮管
    '      DMMD       ',
    '      DMMD       ',
    '      DMMD       ',
    '      DMMD       ',
    '      DXXD       '
  ],
  left: [
    // 炮管
    '       DD       ',
    '      DXXD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    // 炮塔
    '     DMMMD      ',
    '    DMGGMMD     ',
    '   DMGMMGMMD    ',
    '  DMGMGMGMMD    ',
    '  DMGMGMGMMD    ',
    '  DMGMGMGMMD    ',
    // 车身
    '  DMMMMMMRRD    ',
    '  DMRRRRMRRD    ',
    ' DMRRRRMRRD     '
  ],
  right: [
    // 炮管
    '       DD       ',
    '      DXXD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    '      DMMD      ',
    // 炮塔
    '     DMMMD      ',
    '    DMMGGMD     ',
    '    DMMGMGMD    ',
    '    DMMGMGMD    ',
    '    DMMGMGMD    ',
    '    DMMGMGMD    ',
    // 车身
    '    DRRRMMMMD   ',
    '    DRRRRRMMD   ',
    '     DRRRRRMMD  '
  ]
};

class TankSpriteAtlas {
  constructor() {
    this.palette = TANK_PALETTE;
    this.cache = new Map();
  }

  getSprite(direction, frameIndex = 0) {
    const cacheKey = `tank_${direction}_${frameIndex}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const grid = TANK_SPRITES[direction];
    if (!grid) return null;

    this.cache.set(cacheKey, {
      grid,
      palette: this.palette,
      direction,
      frameIndex
    });

    return this.cache.get(cacheKey);
  }

  drawTank(ctx, x, y, direction, frameIndex = 0) {
    const sprite = this.getSprite(direction, frameIndex);
    if (!sprite) return;
    PixelSprites.drawSpriteFromGrid(ctx, sprite.grid, x, y, 1, sprite.palette);
  }

  drawTankAt(ctx, screenX, screenY, tileSize, direction, frameIndex = 0) {
    const scale = tileSize / 16;
    ctx.save();
    ctx.translate(screenX - tileSize / 2, screenY - tileSize / 2);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    this.drawTank(ctx, 0, 0, direction, frameIndex);
    ctx.restore();
  }
}

const tankAtlas = new TankSpriteAtlas();
export default tankAtlas;
export { TANK_PALETTE, TANK_SPRITES };
