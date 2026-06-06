import PixelSprites from './pixel_sprites.js';

// 16色调色板 - SNES 重装机兵大地图风格
const WASTELAND_PALETTE = {
  // 0: 透明
  T: 'transparent',
  // 1: 黑色（描边/阴影）
  K: '#1c1410',
  // 2: 深沙色（最暗阴影）
  D: '#6c4c2c',
  // 3: 主沙色
  S: '#a87844',
  // 4: 浅沙色
  L: '#d8a868',
  // 5: 亮沙色（高光）
  H: '#e8c890',
  // 6: 干裂土地
  C: '#8c5c34',
  // 7: 锈红色（血迹/污染）
  R: '#7c3c1c',
  // 8: 暗灰（废墟）
  G: '#4c4c4c',
  // 9: 金属灰
  M: '#6c6c6c',
  // 10: 金属高光
  W: '#9c9c9c',
  // 11: 仙人掌深绿
  P: '#2c4c1c',
  // 12: 仙人掌主绿
  X: '#4c6c2c',
  // 13: 仙人掌浅绿
  Y: '#6c8c3c',
  // 14: 枯草
  V: '#7c6c3c',
  // 15: 天空蓝（远景）
  B: '#8cb4cc'
};

// 沙漠荒野地面瓦片
const SAND_TILES = {
  plain: [
    'LHHHHHHHHHHHHHHHH',
    'HLLLHHHHHHLLLHHHH',
    'HLHHHLLLHHHLLLHHH',
    'HHLHLLLHHHHHHLLLH',
    'HHLLLHHHHHHLLHHHH',
    'LHHHHLLLHHLLLHHHL',
    'HLLHHHLLLHHHHLLLH',
    'HHLLLHHHHLLLHHHLH',
    'LHHLLLHHHHHHLLLHH',
    'HHHHLLLHHLLHHHHLL',
    'LLHHHHHLLLHHHHLLH',
    'HLLLHHHHHHLLHHHLH',
    'HHLLLHHLLHHHHHHLL',
    'LHHHHLLLHHLLLHHHL',
    'HHHLLHHHHHHLLLHHH',
    'HHHHLLLHHHLLHHHHH'
  ],
  dry_crack: [
    'LHHHHHHHHHHHHHHHH',
    'HHLLLHHHHHHLLHHHH',
    'HLHHHLLLHHHLLLHHH',
    'CKHLLCCLHHHHHCCCLH',
    'HCCLCHHHLCCCLHHLH',
    'LHHHCLLCLHHLHCCCL',
    'HCLCHHCCLHHHCCLHH',
    'HCLLLHHHCCLLHHCLH',
    'LHCLLHHHCHHHCCLHH',
    'HHCCLHHHLLHCHHCLL',
    'LLHCLLHHHLLHCCCHH',
    'HCLLHHHHHCLHHHCLH',
    'HHCCLHHCLHHHHCCLL',
    'LHCHCLLCLHHLLHCCL',
    'HHHCCLHHHCCCLHHHL',
    'HCHHHCCLLLHHHHHCH'
  ],
  rocky: [
    'LHHHHHHHHHHHLLLHH',
    'HHLLLHHHLLLHHHHGH',
    'HLHHHLLLHHHGLLHHH',
    'HGHLLGHHHHHGLLLLH',
    'HHGLLHHHHHGLLHHHH',
    'LHHHGLLHHGLLLHHGL',
    'HLLHHGLLHGGHHGLLHG',
    'HHGLLHHGGLLHHHGLH',
    'LHGGGLLHHHHHGLLGH',
    'HHGHGLLHHGLHHHHGL',
    'LLGHHHGLLHGGHGLLH',
    'HGLLGHHHGLHHHGLGH',
    'HHGLLHHGLGHHHHGGL',
    'LHHHGLLHHGLLHHGGL',
    'HHHGLHHHHHGLLLHHH',
    'HHHHGLLHHHGLHHHHG'
  ],
  dirt: [
    'CKHCKHCKHCKHCKHKC',
    'KCKCKCKCKCKCKCKCK',
    'CHCKCKHCKCKHKCKCK',
    'KCKCKCKCKCKCKCKCK',
    'CKCKHKCKCKCKCKCKC',
    'KCKCKCKCKCKHKCKCK',
    'CKCKCKCKHCKCKCKCK',
    'KCKCKCKCKCKCKHKCK',
    'CKCKCKHCKCKCKCKCK',
    'KCKCKCKCKCKCKCKCK',
    'CKCKCKCKCKHCKCKCK',
    'KCKCKCKHCKCKCKCKC',
    'CHCKCKCKCKCKCKHKC',
    'KCKCKCKCKCKCKCKCK',
    'CKCKHKCKCKCKCKCKC',
    'KCKCKCKCKCKCKCKCK'
  ]
};

// 仙人掌精灵（多种变体）
const CACTUS_SPRITES = {
  small: [
    '      YY      ',
    '      YY      ',
    '      YY      ',
    '   YYYYYY     ',
    '   YPXXP YYYY ',
    '   YPXXP YYY Y',
    'YYYYPXXPYY  YY',
    'YPXXXXPYP YY Y',
    'YPXXXXXP YYY Y',
    'YPXXXXXP YY YY',
    'YPXXXXPYP YYY Y',
    'YPXXPXP YYYY  ',
    'YY YXPY    YY ',
    ' Y YXXY  YYYYY',
    '  YPPY YYY    ',
    '   YY  YY     '
  ],
  medium: [
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '    YYYYYYYY    ',
    '    YPXXXXXPY   ',
    '    YPXXXXXPY   ',
    'YYYYYPXXXXPYPYY ',
    'YPXXXPXXXXPXXPY',
    'YPXXXPXXXXPXXPY',
    'YPXXXPXXXXPXXPY',
    'YPXXXYPXXPYXXPY',
    'YYYYYYPXPYYXXPY',
    '     YXPY YXXPY',
    '    YYPY  YXPY ',
    '    YY     YY  '
  ],
  tall: [
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '       YY       ',
    '    YYYYYYY     ',
    '    YPXXXXY     ',
    '    YPXXXY      ',
    '    YPXXXY  YYY ',
    'YYYYYPXXPXXYY YY',
    'YPXXXPXXXPXY YY',
    'YPXXXPXXXPXYY  ',
    'YPXXPYPXXPXY   ',
    'YYYYY YXXPY    ',
    '     YPPY      '
  ]
};

// 岩石精灵
const ROCK_SPRITES = {
  small: [
    '      KKK      ',
    '    KKMMMKK    ',
    '   KMMMMMMMK   ',
    '  KMMWWWMMMMK  ',
    ' KMMWWMMMMMMMK ',
    'KMMWMMMMMMMMMMK',
    'KMMMMMMMMMMMMMK',
    'KMMMMMMMMMMMMMK',
    ' KMMMMMMMMMMMK ',
    '  KMMMMMMMMMK  ',
    '   KMMMMMMMK   ',
    '    KMMMMMK    ',
    '     KMMMK     ',
    '      KKK      ',
    '              ',
    '              '
  ],
  medium: [
    '     KKKKK     ',
    '   KKMMMMMKK   ',
    '  KMMWWWWMMMK  ',
    ' KMWWWMMMMWWMK ',
    'KMWWMMMMMMMMWMK',
    'KMWMMMMMMMMMMWK',
    'KMGMMMMMMMMMMMK',
    'KMGMMWWMMMMMMMK',
    'KMMMMMMMMMMMMMK',
    'KMMMWMMMMMMMMMK',
    ' KMMWMMMMMMWMK ',
    '  KMMMMMMMMMK  ',
    '   KMMMMMMMK   ',
    '    KMMMMMK    ',
    '     KMMMK     ',
    '      KKK      '
  ],
  large: [
    '   KKKKKKKKK   ',
    '  KMMMMMMMMMK  ',
    ' KMMWWWWWWMMMK ',
    'KMWWWMMMMMMWWMK',
    'KMWWMMMMMMMMWMK',
    'KMGMMMWWMMMMMMK',
    'KMGMWWMMMMMMMWK',
    'KMGMMMWMMMMWMMK',
    'KMMMMMWMMMMMMMK',
    'KMMMMMMMMWMMMMK',
    'KMMMWMMMMMMMMMK',
    ' KMMMMMMMMMMMK ',
    '  KMMMMMMMMMK  ',
    '   KMMMMMMMK   ',
    '    KMMMMMK    ',
    '     KMMMK     '
  ]
};

// 废弃工厂废墟
const FACTORY_RUIN_SPRITES = {
  main: [
    'KKKKKKKKKKKKKKKKKKKK',
    'KGGGGGGGGGGGGGGGGGGK',
    'KGMMMMMMMMMMMMMMMMMK',
    'KGMRRRRRRRRRRRRRRMRK',
    'KGMGGGGGGGGGGGGGGGMK',
    'KGMGMMMMMMMMMMMMMGMK',
    'KGMGMMRRRRRRRRMMGMGK',
    'KGMGMGMGGGGGGGMGMGMK',
    'KGMGMGMGMMMMMGMGMGMK',
    'KGMGMGMGMMRRRMGMGMGK',
    'KGMGMGMGMGGGGMGMGMMK',
    'KGMGMGMGMMMMMMGMGMGK',
    'KGMGMGMGMRRRRGMGMGMK',
    'KGMGMGMGMGMGMGMGMGMK',
    'KGMGMGGGGGGGGGGGGMGK',
    'KGMMMMMMMMMMMMMMMMMK',
    'KGGGGGGGGGGGGGGGGGGK',
    'KKKKKKKKKKKKKKKKKKKK'
  ],
  chimney: [
    '       KKKKK       ',
    '      K     K      ',
    '      K     K      ',
    '      K  G  K      ',
    '      K GWG K      ',
    '      KGGGGGK      ',
    '      K     K      ',
    '      K  G  K      ',
    '      K GWG K      ',
    '      KGGGGGK      ',
    '      K     K      ',
    '      KKKKKKK      ',
    '                  ',
    '                  ',
    '                  ',
    '                  '
  ],
  broken_wall: [
    'KGGGGGGGGGGGGGGGGK',
    'KGMMMMMMMMMMMMMMMK',
    'KGMGGGGGGGGGGGGGMK',
    'KGMMMMRRRRRRRRMMMK',
    'KGMGMGGGGGGGGGMGMK',
    'KGMMMMRRRRRRRRMMMK',
    'KGMGMGGGGGGGGGMGMK',
    'KGGGGGGGGGGGGGGGGK',
    'K    KKKK        K',
    'K   K    KK      K',
    'K  K      K      K',
    'K K        K     K',
    'K           K    K',
    'K            K   K',
    'K             KKKK',
    'KKKKKKKKKKKKKKKKKK'
  ]
};

// 油桶和垃圾
const DEBRIS_SPRITES = {
  barrel: [
    '   KKKKKKKKK   ',
    '  KRRRRRRRRRK  ',
    '  KRGGGGGGGRK  ',
    '  KRGKKKKKGRK  ',
    '  KRGKRRKGRK   ',
    '  KRGKR KGRK   ',
    '  KRGKKKKGRK   ',
    '  KRGGGGGGGRK  ',
    '  KRRRRRRRRRK  ',
    '   KKKKKKKKK   ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                '
  ],
  scrap: [
    '    KKK    KKK    ',
    '   KMMK   KMMK   ',
    '  KMGMMK KMGMMK  ',
    ' KMMGMMMMMGMMMMK ',
    'KMGWMMMMMMMMMMWK',
    'KMMGMMMMRMMMGMMK',
    'KMMGMMMMRMMMGMMK',
    'KMGWMMMMMMMMMMWK',
    ' KMMGMMMMMMMMMK ',
    '  KMMGMMMGMGMMK  ',
    '   KMMGMMMGMMK   ',
    '    KMMGGMMMK    ',
    '     KMMGMK      ',
    '      KMMK       ',
    '       KK        ',
    '                '
  ]
};

// 干枯的灌木/草丛
const VEGETATION_SPRITES = {
  dead_bush: [
    '        KK        ',
    '       KDDK       ',
    '      KDDDKK     ',
    '   KKKDDDDDKK    ',
    '  KDDDVVDDDDK    ',
    '  KDVVDVVDDDKK   ',
    ' KDDVDVVDDDDDKK  ',
    'KDDDVVDDDDDDDDK  ',
    ' KDDDDDDDDDDDK   ',
    '  KKDDDDDDDKKK   ',
    '   KKDDDDDKK     ',
    '     KKKKK       ',
    '                ',
    '                ',
    '                ',
    '                '
  ],
  grass: [
    '     V       V   ',
    '    V V     V V  ',
    '   V   V   V   V ',
    '  V     V V     V',
    '         V       ',
    'V       V       V',
    ' V     V V     V ',
    '  V   V   V   V  ',
    '   V V     V V   ',
    '    V       V    ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                ',
    '                '
  ]
};

// 远景元素
const DISTANT_SPRITES = {
  mountain: [
    '                 ',
    '       KKK       ',
    '      K   K      ',
    '     K  G  K     ',
    '    K  GWG  K    ',
    '   K  GMMMG  K   ',
    '  K  GMMMMMG  K  ',
    ' K  GMMMMMMMG  K ',
    'K  GMMMMMMMMMG  K',
    ' K GMMMMMMMMMMG K',
    '  KMMMMMMMMMMMK  ',
    '   KMMMMMMMMMK   ',
    '    KMMMMMMMK    ',
    '     KMMMMMK     ',
    '      KMMMK      ',
    '       KKK       '
  ],
  sky: [
    'BBBBBBBBBBBBBBBB',
    'BBBBBBBBBBBBBBBB',
    'BBWWBWWBBWWBWWBB',
    'BWWWBWWBBWWBWWWB',
    'BBBBBBBBBBBBBBBB',
    'BWWBWWBBWWBWWBB',
    'BBWWBWWBBWWBWWBB',
    'BBBBBBBBBBBBBBBB',
    'BWWBWWBBWWBWWBB',
    'BBWWBWWBBWWBWWBB',
    'BBBBBBBBBBBBBBBB',
    'BWWBWWBBWWBWWBB',
    'BBWWBWWBBWWBWWBB',
    'BBBBBBBBBBBBBBBB',
    'BBBBBBBBBBBBBBBB',
    'BBBBBBBBBBBBBBBB'
  ]
};

class WastelandAtlas {
  constructor() {
    this.palette = WASTELAND_PALETTE;
    this.cache = new Map();
  }

  getTile(type, variant = 0) {
    const cacheKey = `tile_${type}_${variant}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let grid;
    if (type === 'sand') {
      const types = ['plain', 'dry_crack', 'rocky', 'dirt'];
      grid = SAND_TILES[types[variant % types.length]];
    } else if (type === 'cactus') {
      const sizes = ['small', 'medium', 'tall'];
      grid = CACTUS_SPRITES[sizes[variant % sizes.length]];
    } else if (type === 'rock') {
      const sizes = ['small', 'medium', 'large'];
      grid = ROCK_SPRITES[sizes[variant % sizes.length]];
    } else if (type === 'factory') {
      const parts = ['main', 'chimney', 'broken_wall'];
      grid = FACTORY_RUIN_SPRITES[parts[variant % parts.length]];
    } else if (type === 'debris') {
      const items = ['barrel', 'scrap'];
      grid = DEBRIS_SPRITES[items[variant % items.length]];
    } else if (type === 'vegetation') {
      const types = ['dead_bush', 'grass'];
      grid = VEGETATION_SPRITES[types[variant % types.length]];
    } else if (type === 'distant') {
      const items = ['mountain', 'sky'];
      grid = DISTANT_SPRITES[items[variant % items.length]];
    }

    if (!grid) return null;

    this.cache.set(cacheKey, {
      grid,
      palette: this.palette,
      type,
      variant
    });

    return this.cache.get(cacheKey);
  }

  drawTile(ctx, type, x, y, variant = 0) {
    const sprite = this.getTile(type, variant);
    if (!sprite) return;
    PixelSprites.drawSpriteFromGrid(ctx, sprite.grid, x, y, 1, sprite.palette);
  }

  drawTileAt(ctx, type, screenX, screenY, tileSize, variant = 0) {
    const scale = tileSize / 16;
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    this.drawTile(ctx, type, 0, 0, variant);
    ctx.restore();
  }
}

const wastelandAtlas = new WastelandAtlas();
export default wastelandAtlas;
export { WASTELAND_PALETTE, SAND_TILES, CACTUS_SPRITES, ROCK_SPRITES, FACTORY_RUIN_SPRITES, DEBRIS_SPRITES, VEGETATION_SPRITES, DISTANT_SPRITES };
