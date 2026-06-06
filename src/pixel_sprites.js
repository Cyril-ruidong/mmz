const FC_COLORS = {
  BG: '#1c3c2c',
  GRASS: '#4c8c4c',
  ROAD: '#dcc89c',
  BUILDING: '#ac7c5c',
  WATER: '#5c9cbc',
  BLACK: '#000000',
  WHITE: '#fcfffc'
};

const TILE_SIZE = 16;

const PixelSprites = {
  tileSize: TILE_SIZE,
  colors: FC_COLORS,

  drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  },

  drawPlayer(ctx, x, y, direction, frame, scale = 1) {
    const s = scale;
    const colors = {
      skin: FC_COLORS.ROAD,
      hair: FC_COLORS.BLACK,
      clothes: FC_COLORS.BUILDING,
      outline: FC_COLORS.BLACK,
      shirt: FC_COLORS.BG
    };

    const sprites = {
      down: [
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  SSFSSS  ',
          '   SSSS   ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '  CC  CC  ',
          '  SS  SS  '
        ],
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  SSFSSS  ',
          '   SSSS   ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          ' CC    CC ',
          ' SS    SS '
        ]
      ],
      up: [
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  CCCCCC  ',
          '   CCCC   ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '  CC  CC  ',
          '  SS  SS  '
        ],
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  CCCCCC  ',
          '   CCCC   ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          ' CC    CC ',
          ' SS    SS '
        ]
      ],
      left: [
        [
          '   HHH    ',
          '  HHHH    ',
          '  HHSS    ',
          ' HHSSS    ',
          ' HSFSS    ',
          '  SSSS    ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '   CC  CC ',
          '   SS  SS '
        ],
        [
          '   HHH    ',
          '  HHHH    ',
          '  HHSS    ',
          ' HHSSS    ',
          ' HSFSS    ',
          '  SSSS    ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '  CC    C ',
          '  SS    S '
        ]
      ],
      right: [
        [
          '    HHH   ',
          '    HHHH  ',
          '    SSHH  ',
          '    SSHHH ',
          '    SFSSH ',
          '    SSSS  ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '  CC  CC  ',
          '  SS  SS  '
        ],
        [
          '    HHH   ',
          '    HHHH  ',
          '    SSHH  ',
          '    SSHHH ',
          '    SFSSH ',
          '    SSSS  ',
          '  CCCCCC  ',
          '  CCCCCC  ',
          '  C    CC ',
          '  S    SS '
        ]
      ]
    };

    const sprite = sprites[direction]?.[frame % 2] || sprites.down[0];
    this.drawSpriteFromGrid(ctx, sprite, x, y, scale, {
      H: colors.hair,
      S: colors.clothes,
      F: colors.skin,
      C: colors.clothes
    });
  },

  drawTank(ctx, x, y, direction, scale = 1) {
    const colors = {
      body: FC_COLORS.BUILDING,
      dark: FC_COLORS.BG,
      light: FC_COLORS.ROAD,
      cannon: FC_COLORS.BLACK,
      track: FC_COLORS.BLACK,
      wheel: FC_COLORS.ROAD
    };

    const directions = {
      up: this.drawTankUp,
      down: this.drawTankDown,
      left: this.drawTankLeft,
      right: this.drawTankRight,
      upleft: this.drawTankUpLeft,
      upright: this.drawTankUpRight,
      downleft: this.drawTankDownLeft,
      downright: this.drawTankDownRight
    };

    const drawFn = directions[direction] || directions.up;
    drawFn.call(this, ctx, x, y, scale, colors);
  },

  drawTankUp(ctx, x, y, s, c) {
    this.drawSpriteFromGrid(ctx, [
      '      NN      ',
      '      NN      ',
      '    NNNNNN    ',
      '  NNNNNNNNNN  ',
      'NNNNNNNNNNNNNN',
      'NNWWNNWWNNWWNN',
      'NNNNNNNNNNNNNN',
      'NNWWNNWWNNWWNN',
      '  NNNNNNNNNN  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  '
    ], x, y, s, { N: c.body, W: c.wheel, T: c.track });
  },

  drawTankDown(ctx, x, y, s, c) {
    this.drawSpriteFromGrid(ctx, [
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  TT    TT  ',
      '  NNNNNNNNNN  ',
      'NNWWNNWWNNWWNN',
      'NNNNNNNNNNNNNN',
      'NNWWNNWWNNWWNN',
      '  NNNNNNNNNN  ',
      '    NNNNNN    ',
      '      NN      ',
      '      NN      ',
      '      NN      '
    ], x, y, s, { N: c.body, W: c.wheel, T: c.track });
  },

  drawTankLeft(ctx, x, y, s, c) {
    this.drawSpriteFromGrid(ctx, [
      '  TTTTTTTTTT  ',
      '  TTTTTTTTTT  ',
      'NNNNNNNNNNNN',
      'WNNNNNNNNNNNW',
      'WNNNNNNNNNNNW',
      'NNNNNNNNNNNN',
      'WNNNNNNNNNNNW',
      'WNNNNNNNNNNNW',
      'NNNNNNNNNNNN',
      '  TTTTTTTTTT  ',
      '  TTTTTTTTTT  ',
      '              ',
      '              ',
      '              ',
      '              ',
      '              '
    ], x, y, s, { N: c.body, W: c.wheel, T: c.track });
  },

  drawTankRight(ctx, x, y, s, c) {
    this.drawSpriteFromGrid(ctx, [
      '  TTTTTTTTTT  ',
      '  TTTTTTTTTT  ',
      'NNNNNNNNNNNN',
      'WNNNNNNNNNNNW',
      'WNNNNNNNNNNNW',
      'NNNNNNNNNNNN',
      'WNNNNNNNNNNNW',
      'WNNNNNNNNNNNW',
      'NNNNNNNNNNNN',
      '  TTTTTTTTTT  ',
      '  TTTTTTTTTT  ',
      '              ',
      '              ',
      '              ',
      '              ',
      '              '
    ], x, y, s, { N: c.body, W: c.wheel, T: c.track });
  },

  drawTankUpLeft(ctx, x, y, s, c) { this.drawTankUp(ctx, x, y, s, c); },
  drawTankUpRight(ctx, x, y, s, c) { this.drawTankUp(ctx, x, y, s, c); },
  drawTankDownLeft(ctx, x, y, s, c) { this.drawTankDown(ctx, x, y, s, c); },
  drawTankDownRight(ctx, x, y, s, c) { this.drawTankDown(ctx, x, y, s, c); },

  drawBuilding(ctx, x, y, type, scale = 1) {
    switch(type) {
      case 'house':
        this.drawHouse(ctx, x, y, scale);
        break;
      case 'shop':
        this.drawShop(ctx, x, y, scale);
        break;
      case 'lab':
        this.drawLab(ctx, x, y, scale);
        break;
      case 'bar':
        this.drawBar(ctx, x, y, scale);
        break;
      case 'hospital':
        this.drawHospital(ctx, x, y, scale);
        break;
      case 'garage':
        this.drawGarage(ctx, x, y, scale);
        break;
      case 'inn':
        this.drawInn(ctx, x, y, scale);
        break;
      case 'hunter':
        this.drawHunter(ctx, x, y, scale);
        break;
    }
  },

  drawHouse(ctx, x, y, scale) {
    this.drawSpriteFromGrid(ctx, [
      '    RRRR    ',
      '   RRRRRR   ',
      '  RRRRRRRR  ',
      ' RRRRRRRRRR ',
      'RRRRRRRRRRRR',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW',
      'WWWWDDWWWWWW',
      'WWWWDDWWWWWW',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW'
    ], x, y, scale, {
      R: FC_COLORS.BUILDING,
      W: FC_COLORS.ROAD,
      D: FC_COLORS.BLACK
    });
  },

  drawShop(ctx, x, y, scale) {
    this.drawSpriteFromGrid(ctx, [
      'SSSSSSSSSSSS',
      'SSSSSSSSSSSS',
      'SSSSSSSSSSSS',
      'SSSSSSSSSSSS',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW',
      'WWOOWWOOOWWW',
      'WWOOWWOOOWWW',
      'WWWWDDWWWWWW',
      'WWWWDDWWWWWW',
      'WWWWWWWWWWWW',
      'WWWWWWWWWWWW'
    ], x, y, scale, {
      S: FC_COLORS.BUILDING,
      W: FC_COLORS.ROAD,
      O: FC_COLORS.GRASS,
      D: FC_COLORS.BLACK
    });
  },

  drawLab(ctx, x, y, scale) {
    this.drawSpriteFromGrid(ctx, [
      '    LLLL    ',
      '   LLLLLL   ',
      '  LLLLLLLL  ',
      ' LLLLLLLLLL ',
      'LLLLLLLLLLLL',
      'GGGGGGGGGGGG',
      'GGGGGGGGGGGG',
      'GGGGGGGGGGGG',
      'GGGGDDGGGGGG',
      'GGGGDDGGGGGG',
      'GGGGGGGGGGGG',
      'GGGGGGGGGGGG'
    ], x, y, scale, {
      L: FC_COLORS.GRASS,
      G: FC_COLORS.ROAD,
      D: FC_COLORS.BLACK
    });
  },

  drawBar(ctx, x, y, scale) { this.drawHouse(ctx, x, y, scale); },
  drawHospital(ctx, x, y, scale) { this.drawShop(ctx, x, y, scale); },
  drawGarage(ctx, x, y, scale) { this.drawLab(ctx, x, y, scale); },
  drawInn(ctx, x, y, scale) { this.drawHouse(ctx, x, y, scale); },
  drawHunter(ctx, x, y, scale) { this.drawShop(ctx, x, y, scale); },

  drawTree(ctx, x, y, scale = 1) {
    this.drawSpriteFromGrid(ctx, [
      '    GG    ',
      '   GGGG   ',
      '  GGGGGG  ',
      ' GGGGGGGG ',
      'GGGGGGGGGG',
      ' GGGGGGGG ',
      '  GGGGGG  ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    ',
      '    TT    '
    ], x, y, scale, {
      G: FC_COLORS.GRASS,
      T: FC_COLORS.BUILDING
    });
  },

  drawDialogBox(ctx, x, y, width, height, scale = 1) {
    const s = scale;
    this.drawPixelRect(ctx, x, y, width, height, FC_COLORS.BG);
    this.drawPixelRect(ctx, x + s, y + s, width - s * 2, s, FC_COLORS.WHITE);
    this.drawPixelRect(ctx, x + s, y + height - s * 2, width - s * 2, s, FC_COLORS.WHITE);
    this.drawPixelRect(ctx, x + s, y + s, s, height - s * 2, FC_COLORS.WHITE);
    this.drawPixelRect(ctx, x + width - s * 2, y + s, s, height - s * 2, FC_COLORS.WHITE);
  },

  drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  },

  drawText(ctx, text, x, y, scale = 1, color = FC_COLORS.WHITE) {
    ctx.fillStyle = color;
    ctx.font = `${8 * scale}px monospace`;
    ctx.textBaseline = 'top';
    ctx.imageSmoothingEnabled = false;
    ctx.fillText(text, x, y);
  },

  drawSpriteFromGrid(ctx, grid, x, y, scale, colorMap) {
    const s = scale;
    grid.forEach((row, py) => {
      for (let px = 0; px < row.length; px++) {
        const char = row[px];
        if (char !== ' ' && colorMap[char]) {
          this.drawPixelRect(ctx, x + px * s, y + py * s, s, s, colorMap[char]);
        }
      }
    });
  }
};

export default PixelSprites;
