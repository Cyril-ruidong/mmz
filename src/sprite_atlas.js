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
  STONE_DARK: '#7c7c7c',
  WINDOW_LIGHT: '#7cbcdc',
  DOOR: '#6c4c2c',
  DOOR_LIGHT: '#8c6c4c'
};

const SPRITE_DEFINITIONS = {
  player: {
    name: '主角',
    frames: {
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
    },
    palette: {
      H: FC_COLORS.BLACK,
      S: FC_COLORS.ROAD,
      F: FC_COLORS.ROAD,
      C: FC_COLORS.BUILDING
    }
  },
  tank_red: {
    name: '红狼坦克',
    frames: {
      up: [
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
      ],
      down: [
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
      ],
      left: [
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
      ],
      right: [
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
      ]
    },
    palette: {
      N: '#cc4444',
      W: '#3a2222',
      T: '#222222'
    }
  },
  npc_villager: {
    name: '镇民',
    frames: {
      down: [
        '    HH    ',
        '   HHHH   ',
        '   HHHH   ',
        '  HHHHHH  ',
        '  SSFSSS  ',
        '   SSSS   ',
        '  CCCCC   ',
        '  CCCCC   ',
        '  CC  CC  ',
        '  SS  SS  '
      ],
      up: [
        '    HH    ',
        '   HHHH   ',
        '   HHHH   ',
        '  HHHHHH  ',
        '  CCCCC   ',
        '   CCCC   ',
        '  CCCCC   ',
        '  CCCCC   ',
        '  CC  CC  ',
        '  SS  SS  '
      ]
    },
    palette: {
      H: FC_COLORS.BLACK,
      S: FC_COLORS.ROAD,
      F: FC_COLORS.ROAD,
      C: '#5a9a5a'
    }
  },
  npc_drunk: {
    name: '醉汉',
    frames: {
      down: [
        '    HH    ',
        '   HHHH   ',
        '   HHHH   ',
        '  HHHHHH  ',
        '  RRRRRR  ',
        '   RRRR   ',
        '  PPPPPP  ',
        '  PPPPPP  ',
        '  PP  PP  ',
        '  SS  SS  '
      ]
    },
    palette: {
      H: FC_COLORS.BLACK,
      R: '#aa6633',
      P: '#884422',
      S: FC_COLORS.ROAD
    }
  },
  building_house: {
    name: '房屋',
    frames: {
      main: [
        '    RRRR    ',
        '   RRRRRR   ',
        '  RRRRRRRR  ',
        ' RRRRRRRRRR ',
        'RRRRRRRRRRRR',
        'WWWWWWWWWWWW',
        'WBBWWBBBWWBW',
        'WBBWWBBBWWBW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      R: FC_COLORS.ROOF,
      W: FC_COLORS.BUILDING_LIGHT,
      B: FC_COLORS.WINDOW,
      D: FC_COLORS.DOOR
    }
  },
  building_shop: {
    name: '商店',
    frames: {
      main: [
        'RRRRRRRRRRRR',
        'RLLLLLLLLLLR',
        'RLLLLLLLLLLR',
        'RRRRRRRRRRRR',
        'WWWWWWWWWWWW',
        'WBBWWWWBBWWW',
        'WBBWWWWBBWWW',
        'WWWWWWWWWWWW',
        'WSSSSSSSSWWW',
        'WSSSSSSSSWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      R: '#3344aa',
      L: '#5566cc',
      W: FC_COLORS.BUILDING_LIGHT,
      B: FC_COLORS.WINDOW,
      S: '#88aacc',
      D: FC_COLORS.DOOR
    }
  },
  building_bar: {
    name: '酒吧',
    frames: {
      main: [
        '    RRRR    ',
        '   RRRRRR   ',
        '  RRRRRRRR  ',
        ' RRRRRRRRRR ',
        'RRRRRRRRRRRR',
        'WWWWWWWWWWWW',
        'WYYWWWWYYWWW',
        'WYYWWWWYYWWW',
        'WWWWWWWWWWWW',
        'WRRRRRRRRWWW',
        'WRRRRRRRRWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      R: '#884422',
      W: FC_COLORS.BUILDING_LIGHT,
      Y: '#f8d870',
      D: FC_COLORS.DOOR
    }
  },
  building_lab: {
    name: '研究所',
    frames: {
      main: [
        '    LLLL    ',
        '   LLLLLL   ',
        '  LLLLLLLL  ',
        ' LLLLLLLLLL ',
        'LLLLLLLLLLLL',
        'WWWWWWWWWWWW',
        'WGGWWGGGGWWW',
        'WGGWWGGGGWWW',
        'WWWWWWWWWWWW',
        'WBBBBBBBBWWW',
        'WBBBBBBBBWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      L: FC_COLORS.GRASS_LIGHT,
      W: FC_COLORS.BUILDING_LIGHT,
      G: FC_COLORS.WINDOW,
      B: '#88aacc',
      D: FC_COLORS.DOOR
    }
  },
  building_hospital: {
    name: '医院',
    frames: {
      main: [
        'RRRRRRRRRRRR',
        'RRRRRRRRRRRR',
        'RRRRRRRRRRRR',
        'RRRRRRRRRRRR',
        'WWWWWWWWWWWW',
        'WWHHWHHHHWWW',
        'WWHHWHHHHWWW',
        'WWWWWWWWWWWW',
        'WHHWWWHHHWWW',
        'WHHWWWHHHWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWDDWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      R: FC_COLORS.ROOF,
      W: FC_COLORS.BUILDING_LIGHT,
      H: '#f8f8f8',
      D: FC_COLORS.DOOR
    }
  },
  building_garage: {
    name: '修理厂',
    frames: {
      main: [
        '    RRRR    ',
        '   RRRRRR   ',
        '  RRRRRRRR  ',
        ' RRRRRRRRRR ',
        'RRRRRRRRRRRR',
        'WWWWWWWWWWWW',
        'WSSWWWWSSWWW',
        'WSSWWWWSSWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWWWWWWWWWW',
        'WWWDDDWWWWWW',
        'WWWDDDWWWWWW',
        'WWWWWWWWWWWW'
      ]
    },
    palette: {
      R: '#666666',
      W: FC_COLORS.BUILDING_LIGHT,
      S: '#444444',
      D: FC_COLORS.DOOR
    }
  },
  tree_oak: {
    name: '橡树',
    frames: {
      main: [
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
      ]
    },
    palette: {
      L: FC_COLORS.TREE_LEAVES,
      T: FC_COLORS.TREE_TRUNK
    }
  },
  tree_pine: {
    name: '松树',
    frames: {
      main: [
        '      LL      ',
        '     LLLL     ',
        '    LLLLLL    ',
        '   LLLLLLLL   ',
        '  LLLLLLLLLL  ',
        ' LLLLLLLLLLLL ',
        'LLLLLLLLLLLLLL',
        ' LLLLLLLLLLLL ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     ',
        '     TTTT     '
      ]
    },
    palette: {
      L: '#1a4a1a',
      T: FC_COLORS.TREE_TRUNK
    }
  },
  flower_yellow: {
    name: '黄花',
    frames: {
      main: [
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
      ]
    },
    palette: {
      G: FC_COLORS.GRASS,
      F: FC_COLORS.YELLOW
    }
  },
  flower_red: {
    name: '红花',
    frames: {
      main: [
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
    },
    palette: {
      G: FC_COLORS.GRASS,
      F: FC_COLORS.RED
    }
  },
  rock: {
    name: '石头',
    frames: {
      main: [
        '      SSSSSS      ',
        '    SSSSSSSSSS    ',
        '   SSSSSSSSSSSS   ',
        '  SSSSSSSSSSSSSS  ',
        ' SSSSSSSSSSSSSSSS ',
        'SSSSSSSSSSSSSSSSSS',
        'SSSSSSSSSSSSSSSSSS',
        ' SSSSSSSSSSSSSSSS ',
        '  SSSSSSSSSSSSSS  ',
        '   SSSSSSSSSSSS   ',
        '    SSSSSSSSSS    ',
        '      SSSSSS      ',
        '                ',
        '                ',
        '                ',
        '                '
      ]
    },
    palette: {
      S: FC_COLORS.STONE
    }
  },
  sign: {
    name: '指示牌',
    frames: {
      main: [
        '      WWWW      ',
        '     WWWWWW     ',
        '    WWBBBBWW    ',
        '    WWBBBBWW    ',
        '    WWBBBBWW    ',
        '     WWWWWW     ',
        '       TT       ',
        '       TT       ',
        '       TT       ',
        '       TT       ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                ',
        '                '
      ]
    },
    palette: {
      W: '#6c4c2c',
      B: '#f8d870',
      T: '#4c2c1c'
    }
  }
};

class SpriteAtlas {
  constructor() {
    this.cache = new Map();
    this.definitions = SPRITE_DEFINITIONS;
  }

  getSprite(name, frameKey = 'main', frameIndex = 0) {
    const cacheKey = `${name}_${frameKey}_${frameIndex}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const def = this.definitions[name];
    if (!def) {
      console.warn(`Sprite "${name}" not found in atlas`);
      return null;
    }

    const frame = def.frames[frameKey];
    if (!frame) {
      console.warn(`Frame "${frameKey}" not found for sprite "${name}"`);
      return null;
    }

    const grid = Array.isArray(frame[0]) ? frame[frameIndex % frame.length] : frame;
    
    this.cache.set(cacheKey, {
      grid,
      palette: def.palette,
      name: def.name,
      frameKey,
      frameIndex
    });

    return this.cache.get(cacheKey);
  }

  drawSprite(ctx, name, x, y, frameKey = 'main', frameIndex = 0) {
    const sprite = this.getSprite(name, frameKey, frameIndex);
    if (!sprite) return;

    PixelSprites.drawSpriteFromGrid(ctx, sprite.grid, x, y, 1, sprite.palette);
  }

  drawPlayer(ctx, x, y, direction, frameIndex = 0) {
    this.drawSprite(ctx, 'player', x, y, direction, frameIndex);
  }

  drawTank(ctx, x, y, direction) {
    this.drawSprite(ctx, 'tank_red', x, y, direction);
  }

  drawNPC(ctx, x, y, type = 'villager') {
    const spriteName = `npc_${type}`;
    this.drawSprite(ctx, spriteName, x, y, 'down', 0);
  }

  drawBuilding(ctx, x, y, type) {
    this.drawSprite(ctx, `building_${type}`, x, y, 'main');
  }

  drawTree(ctx, x, y, type = 'oak') {
    this.drawSprite(ctx, `tree_${type}`, x, y, 'main');
  }

  drawFlower(ctx, x, y, color = 'yellow') {
    this.drawSprite(ctx, `flower_${color}`, x, y, 'main');
  }

  getAllSpriteNames() {
    return Object.keys(this.definitions);
  }

  getAllBuildingTypes() {
    return Object.keys(this.definitions)
      .filter(name => name.startsWith('building_'))
      .map(name => name.replace('building_', ''));
  }

  getAllNPCTypes() {
    return Object.keys(this.definitions)
      .filter(name => name.startsWith('npc_'))
      .map(name => name.replace('npc_', ''));
  }
}

const spriteAtlas = new SpriteAtlas();
export default spriteAtlas;
export { SPRITE_DEFINITIONS, FC_COLORS };
