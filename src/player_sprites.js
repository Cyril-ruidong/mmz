import PixelSprites from './pixel_sprites.js';

// 14色调色板 - 严格限制 - Metal Max Returns 风格
const PLAYER_PALETTE = {
  // 0: 透明背景
  T: 'transparent',
  // 1: 黑色（描边/头发）
  K: '#0c0c0c',
  // 2: 皮肤阴影
  S: '#a87858',
  // 3: 皮肤主色
  F: '#d8a878',
  // 4: 皮肤高光
  H: '#f0c898',
  // 5: 红色斗篷阴影
  D: '#7c1414',
  // 6: 红色斗篷主色
  R: '#c82424',
  // 7: 红色斗篷高光
  L: '#e85454',
  // 8: 裤子阴影
  P: '#3c2818',
  // 9: 裤子/皮带主色
  B: '#5c3c1c',
  // 10: 金属高光（子弹带）
  G: '#8c7044',
  // 11: 子弹
  A: '#f8d870',
  // 12: 靴子阴影
  X: '#1c0c08',
  // 13: 靴子主色
  Y: '#3c2014'
};

const PLAYER_SPRITES = {
  down: {
    idle: [
      // 头部 - 黑发
      '      KK      ',
      '     KHHK     ',
      '    KHFFHK    ',
      '    KFFFK     ',
      '    KFHHK     ',
      '    KSSK      ',
      '     KK       ',
      // 红色斗篷覆盖肩膀
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      // 躯干 - 皮带和子弹带
      '   DBBGGGBD   ',
      '   BAAAAAAAB  ',
      '   BAAAAAAAB  ',
      // 腿部
      '   PP    PP   ',
      '   PP    PP   ',
      // 靴子
      '   XY    XY   '
    ],
    walk1: [
      '      KK      ',
      '     KHHK     ',
      '    KHFFHK    ',
      '    KFFFK     ',
      '    KFHHK     ',
      '    KSSK      ',
      '     KK       ',
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      '   DBBGGGBD   ',
      '   BAAAAAAAB  ',
      '   BAAAAAAAB  ',
      '    PP  PP    ',
      '    PP  PP    ',
      '     XXYY     '
    ],
    walk2: [
      '      KK      ',
      '     KHHK     ',
      '    KHFFHK    ',
      '    KFFFK     ',
      '    KFHHK     ',
      '    KSSK      ',
      '     KK       ',
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      '   DBBGGGBD   ',
      '   BAAAAAAAB  ',
      '   BAAAAAAAB  ',
      '     PP  PP   ',
      '     PP  PP   ',
      '      YYXX    '
    ]
  },
  up: {
    idle: [
      '      KK      ',
      '     KHHK     ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '     KK       ',
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      '   DBBBBBD    ',
      '   BBBBBBBB   ',
      '   BBBBBBBB   ',
      '   PP    PP   ',
      '   PP    PP   ',
      '   XY    XY   '
    ],
    walk1: [
      '      KK      ',
      '     KHHK     ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '     KK       ',
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      '   DBBBBBD    ',
      '   BBBBBBBB   ',
      '   BBBBBBBB   ',
      '    PP  PP    ',
      '    PP  PP    ',
      '     XXYY     '
    ],
    walk2: [
      '      KK      ',
      '     KHHK     ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '    KKKKKK    ',
      '     KK       ',
      '   DDDRRRDD   ',
      '   DRLRRRLRD  ',
      '   DRLRRRLRD  ',
      '  DDDRRRRRDD  ',
      '   DBBBBBD    ',
      '   BBBBBBBB   ',
      '   BBBBBBBB   ',
      '     PP  PP   ',
      '     PP  PP   ',
      '      YYXX    '
    ]
  },
  left: {
    idle: [
      '     KKK      ',
      '    KHHK      ',
      '   KFFK       ',
      '   KFFK       ',
      '   KSHK       ',
      '    KK        ',
      '     KK       ',
      '  DDDRRDD     ',
      '  DRLRRRD     ',
      '  DRLRRRD     ',
      '  DDRRRRD     ',
      '  DBBGGD      ',
      '  BAAAAA      ',
      '  BAAAAA      ',
      '  PP          ',
      '  PP          ',
      '  XY          '
    ],
    walk1: [
      '     KKK      ',
      '    KHHK      ',
      '   KFFK       ',
      '   KFFK       ',
      '   KSHK       ',
      '    KK        ',
      '     KK       ',
      '  DDDRRDD     ',
      '  DRLRRRD     ',
      '  DRLRRRD     ',
      '  DDRRRRD     ',
      '  DBBGGD      ',
      '  BAAAAA      ',
      '  BAAAAA      ',
      '   PP         ',
      '   PP         ',
      '   XXY        '
    ]
  },
  right: {
    idle: [
      '      KKK     ',
      '      KHHK    ',
      '       KFFK   ',
      '       KFFK   ',
      '       KHSK   ',
      '        KK    ',
      '       KK     ',
      '     DDRRDDD  ',
      '     DRRRLRD  ',
      '     DRRRLRD  ',
      '     DRRRRDD  ',
      '      DGGBBD  ',
      '      AAAAAB  ',
      '      AAAAAB  ',
      '          PP  ',
      '          PP  ',
      '          YX  '
    ],
    walk1: [
      '      KKK     ',
      '      KHHK    ',
      '       KFFK   ',
      '       KFFK   ',
      '       KHSK   ',
      '        KK    ',
      '       KK     ',
      '     DDRRDDD  ',
      '     DRRRLRD  ',
      '     DRRRLRD  ',
      '     DRRRRDD  ',
      '      DGGBBD  ',
      '      AAAAAB  ',
      '      AAAAAB  ',
      '         PP   ',
      '         PP   ',
      '        YXX   '
    ]
  }
};

class PlayerSpriteAtlas {
  constructor() {
    this.palette = PLAYER_PALETTE;
    this.cache = new Map();
  }

  getSprite(direction, frame = 'idle') {
    const cacheKey = `player_${direction}_${frame}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const directionData = PLAYER_SPRITES[direction];
    if (!directionData) return null;

    const grid = directionData[frame] || directionData.idle;
    if (!grid) return null;

    this.cache.set(cacheKey, {
      grid,
      palette: this.palette,
      direction,
      frame
    });

    return this.cache.get(cacheKey);
  }

  drawPlayer(ctx, x, y, direction, frame = 'idle') {
    const sprite = this.getSprite(direction, frame);
    if (!sprite) return;
    PixelSprites.drawSpriteFromGrid(ctx, sprite.grid, x, y, 1, sprite.palette);
  }

  drawPlayerAt(ctx, screenX, screenY, tileSize, direction, frame = 'idle') {
    const scale = tileSize / 12;
    ctx.save();
    ctx.translate(screenX - (12 * scale) / 2, screenY - (17 * scale) / 2);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    this.drawPlayer(ctx, 0, 0, direction, frame);
    ctx.restore();
  }
}

const playerAtlas = new PlayerSpriteAtlas();
export default playerAtlas;
export { PLAYER_PALETTE, PLAYER_SPRITES };
