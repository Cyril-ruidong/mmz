const PixelSprites = {
  canvas: null,
  ctx: null,
  tileSize: 16,
  
  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 512;
    this.canvas.height = 512;
  },
  
  drawPixel(x, y, color, scale = 1) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x * scale, y * scale, scale, scale);
  },
  
  drawPlayer(ctx, x, y, direction, frame, scale = 1) {
    const colors = {
      skin: '#f4c4a0',
      hair: '#8b4513',
      shirt: '#0066ff',
      pants: '#333333',
      shoes: '#000000',
      outline: '#000000'
    };
    
    const sprites = {
      down: [
        [
          '    HH    ',
          '   HHHH   ',
          '   SSSS   ',
          '  SSSSSS  ',
          '  FFFFFF  ',
          '   FFFF   ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '  PP  PP  ',
          '  SS  SS  '
        ],
        [
          '    HH    ',
          '   HHHH   ',
          '   SSSS   ',
          '  SSSSSS  ',
          '  FFFFFF  ',
          '   FFFF   ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          ' PP    PP ',
          ' SS    SS '
        ]
      ],
      up: [
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  BBBBBB  ',
          '   BBBB   ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '  PP  PP  ',
          '  SS  SS  '
        ],
        [
          '    HH    ',
          '   HHHH   ',
          '   HHHH   ',
          '  HHHHHH  ',
          '  BBBBBB  ',
          '   BBBB   ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          ' PP    PP ',
          ' SS    SS '
        ]
      ],
      left: [
        [
          '   HHH    ',
          '  HHHH    ',
          '  HSSS    ',
          ' HSSSS    ',
          ' HFFFF    ',
          '  FFFF    ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '   PP  PP ',
          '   SS  SS '
        ],
        [
          '   HHH    ',
          '  HHHH    ',
          '  HSSS    ',
          ' HSSSS    ',
          ' HFFFF    ',
          '  FFFF    ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '  PP    P ',
          '  SS    S '
        ]
      ],
      right: [
        [
          '    HHH   ',
          '    HHHH  ',
          '    SSSH  ',
          '    SSSSH ',
          '    FFFFH ',
          '    FFFF  ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '  PP  PP  ',
          '  SS  SS  '
        ],
        [
          '    HHH   ',
          '    HHHH  ',
          '    SSSH  ',
          '    SSSSH ',
          '    FFFFH ',
          '    FFFF  ',
          '  PPPPPP  ',
          '  PPPPPP  ',
          '  P    PP ',
          '  S    SS '
        ]
      ]
    };
    
    const sprite = sprites[direction][frame % 2];
    const pixelScale = scale;
    
    sprite.forEach((row, py) => {
      for (let px = 0; px < row.length; px++) {
        const char = row[px];
        let color = null;
        
        switch(char) {
          case 'H': color = colors.hair; break;
          case 'S': color = colors.shirt; break;
          case 'F': color = colors.skin; break;
          case 'P': color = colors.pants; break;
          case 'B': color = '#4444aa'; break;
          case 'SS':
          case 'S':
            if (char === 'SS') {
              color = colors.shoes;
            }
            break;
        }
        
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            x + px * pixelScale,
            y + py * pixelScale,
            pixelScale,
            pixelScale
          );
        }
      }
    });
  },
  
  drawTank(ctx, x, y, direction, scale = 1) {
    const tankColors = {
      body: '#cc0000',
      dark: '#880000',
      light: '#ff4444',
      cannon: '#666666',
      track: '#333333',
      wheel: '#555555'
    };
    
    const size = 16 * scale;
    
    ctx.save();
    
    ctx.fillStyle = tankColors.track;
    ctx.fillRect(x, y + size * 0.6, size, size * 0.4);
    
    ctx.fillStyle = tankColors.body;
    ctx.fillRect(x + size * 0.1, y + size * 0.3, size * 0.8, size * 0.4);
    
    ctx.fillStyle = tankColors.cannon;
    ctx.fillRect(x + size * 0.35, y, size * 0.3, size * 0.4);
    
    ctx.fillStyle = tankColors.light;
    ctx.fillRect(x + size * 0.2, y + size * 0.35, size * 0.2, size * 0.1);
    
    ctx.fillStyle = tankColors.dark;
    ctx.fillRect(x + size * 0.1, y + size * 0.55, size * 0.8, size * 0.1);
    
    ctx.restore();
  },
  
  drawBuilding(ctx, x, y, type, scale = 1) {
    const size = 32 * scale;
    
    switch(type) {
      case 'house':
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x, y + size * 0.4, size, size * 0.6);
        
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(x, y + size * 0.4);
        ctx.lineTo(x + size * 0.5, y);
        ctx.lineTo(x + size, y + size * 0.4);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(x + size * 0.4, y + size * 0.6, size * 0.2, size * 0.4);
        break;
        
      case 'shop':
        ctx.fillStyle = '#4682b4';
        ctx.fillRect(x, y + size * 0.2, size, size * 0.8);
        
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(x, y, size, size * 0.2);
        
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(x + size * 0.1, y + size * 0.4, size * 0.3, size * 0.3);
        ctx.fillRect(x + size * 0.6, y + size * 0.4, size * 0.3, size * 0.3);
        
        ctx.fillStyle = '#2f4f4f';
        ctx.fillRect(x + size * 0.35, y + size * 0.6, size * 0.3, size * 0.4);
        break;
        
      case 'lab':
        ctx.fillStyle = '#708090';
        ctx.fillRect(x, y + size * 0.3, size, size * 0.7);
        
        ctx.fillStyle = '#a9a9a9';
        ctx.fillRect(x + size * 0.1, y, size * 0.8, size * 0.3);
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x + size * 0.4, y + size * 0.1, size * 0.2, size * 0.1);
        break;
    }
  },
  
  drawTree(ctx, x, y, scale = 1) {
    const size = 16 * scale;
    
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x + size * 0.4, y + size * 0.5, size * 0.2, size * 0.5);
  },
  
  drawDialogBox(ctx, x, y, width, height, scale = 1) {
    ctx.fillStyle = '#000080';
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x + 2 * scale, y + 2 * scale, width - 4 * scale, height - 4 * scale);
  },
  
  drawText(ctx, text, x, y, scale = 1) {
    ctx.fillStyle = '#000000';
    ctx.font = `${8 * scale}px monospace`;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  },
  
  drawGround(ctx, x, y, type, scale = 1) {
    const size = 16 * scale;
    
    switch(type) {
      case 'grass':
        ctx.fillStyle = '#228b22';
        ctx.fillRect(x, y, size, size);
        
        ctx.fillStyle = '#32cd32';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(x + Math.random() * size * 0.8, y + Math.random() * size * 0.8, scale * 2, scale * 2);
        }
        break;
        
      case 'road':
        ctx.fillStyle = '#808080';
        ctx.fillRect(x, y, size, size);
        
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(x + size * 0.4, y, size * 0.2, size);
        break;
        
      case 'water':
        ctx.fillStyle = '#0000cd';
        ctx.fillRect(x, y, size, size);
        
        ctx.fillStyle = '#1e90ff';
        ctx.fillRect(x + size * 0.2, y + size * 0.3, size * 0.6, scale);
        ctx.fillRect(x + size * 0.1, y + size * 0.7, size * 0.5, scale);
        break;
    }
  }
};

PixelSprites.init();
export default PixelSprites;
