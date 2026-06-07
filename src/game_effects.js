// 重装机兵风格游戏画面效果系统
// 实现屏幕闪烁、震动、状态动画等功能

class GameEffects {
  constructor() {
    // 屏幕闪烁状态
    this.flashState = {
      active: false,
      color: [255, 255, 255, 0],
      duration: 0,
      currentTime: 0,
      intensity: 1
    };

    // 屏幕震动状态
    this.shakeState = {
      active: false,
      intensity: 0,
      duration: 0,
      currentTime: 0,
      offsetX: 0,
      offsetY: 0
    };

    // 动画状态
    this.animations = new Map();

    // 音效系统
    this.soundEffects = new Map();

    // 角色状态机
    this.characterState = 'idle';
    this.stateAnimations = {
      idle: { frames: [0, 1], interval: 30, loop: true },
      walk: { frames: [0, 1, 2, 3], interval: 8, loop: true },
      guard: { frames: [4], interval: 1, loop: false },
      damage: { frames: [5, 6], interval: 4, loop: false, duration: 30 },
      dead: { frames: [7], interval: 1, loop: false },
      attack: { frames: [8, 9], interval: 6, loop: false, duration: 20 }
    };

    // 全局动画参数
    this.ANIMATION_INTERVAL = 40;
    this.ANIMATION_DELAY_FRAMES = 0;
    this.ANIMATION_SCALE = 1.0;
  }

  /**
   * 屏幕闪烁
   * @param {Array} color - RGBA颜色 [r, g, b, a]
   * @param {number} duration - 持续时间（毫秒）
   * @param {number} intensity - 强度 0-1
   */
  screenFlash(color = [255, 255, 255, 128], duration = 200, intensity = 1) {
    this.flashState = {
      active: true,
      color: color,
      duration: duration,
      currentTime: 0,
      intensity: intensity
    };
  }

  /**
   * 屏幕震动
   * @param {number} intensity - 震动强度
   * @param {number} duration - 持续时间（毫秒）
   */
  screenShake(intensity = 5, duration = 300) {
    this.shakeState = {
      active: true,
      intensity: intensity,
      duration: duration,
      currentTime: 0,
      offsetX: 0,
      offsetY: 0
    };
  }

  /**
   * 更新效果状态
   * @param {number} deltaTime - 帧间隔（毫秒）
   */
  update(deltaTime) {
    // 更新闪烁
    if (this.flashState.active) {
      this.flashState.currentTime += deltaTime;
      if (this.flashState.currentTime >= this.flashState.duration) {
        this.flashState.active = false;
      }
    }

    // 更新震动
    if (this.shakeState.active) {
      this.shakeState.currentTime += deltaTime;
      if (this.shakeState.currentTime >= this.shakeState.duration) {
        this.shakeState.active = false;
        this.shakeState.offsetX = 0;
        this.shakeState.offsetY = 0;
      } else {
        const progress = 1 - (this.shakeState.currentTime / this.shakeState.duration);
        const currentIntensity = this.shakeState.intensity * progress;
        this.shakeState.offsetX = (Math.random() - 0.5) * currentIntensity * 2;
        this.shakeState.offsetY = (Math.random() - 0.5) * currentIntensity * 2;
      }
    }
  }

  /**
   * 渲染屏幕效果
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} width
   * @param {number} height
   */
  render(ctx, width, height) {
    // 渲染闪烁
    if (this.flashState.active) {
      const progress = this.flashState.currentTime / this.flashState.duration;
      const alpha = this.flashState.color[3] * (1 - progress) * this.flashState.intensity / 255;
      ctx.save();
      ctx.fillStyle = `rgba(${this.flashState.color[0]}, ${this.flashState.color[1]}, ${this.flashState.color[2]}, ${alpha})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /**
   * 获取震动偏移
   */
  getShakeOffset() {
    return {
      x: this.shakeState.offsetX,
      y: this.shakeState.offsetY
    };
  }

  /**
   * 设置角色状态
   * @param {string} state
   */
  setCharacterState(state) {
    if (this.stateAnimations[state]) {
      this.characterState = state;
    }
  }

  /**
   * 获取当前状态的动画帧
   * @param {number} frameCount - 总帧数
   */
  getCurrentFrame(frameCount) {
    const stateAnim = this.stateAnimations[this.characterState];
    if (!stateAnim) return 0;

    const frameIndex = Math.floor(frameCount / stateAnim.interval) % stateAnim.frames.length;
    return stateAnim.frames[frameIndex];
  }

  /**
   * 播放音效
   * @param {string} name
   */
  playSE(name) {
    // 简单的音效实现 - 通过Web Audio API生成音效
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // 根据音效名称设置不同的参数
      const seParams = this.getSEParams(name);

      oscillator.type = seParams.type;
      oscillator.frequency.setValueAtTime(seParams.frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(seParams.endFrequency, audioContext.currentTime + seParams.duration);

      gainNode.gain.setValueAtTime(seParams.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + seParams.duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + seParams.duration);
    } catch (e) {
      console.warn('音效播放失败:', e);
    }
  }

  /**
   * 获取音效参数
   */
  getSEParams(name) {
    const params = {
      'Damage1': { type: 'square', frequency: 200, endFrequency: 100, duration: 0.1, volume: 0.3 },
      'Damage2': { type: 'square', frequency: 150, endFrequency: 80, duration: 0.15, volume: 0.3 },
      'Explosion': { type: 'sawtooth', frequency: 100, endFrequency: 30, duration: 0.5, volume: 0.4 },
      'MenuOpen': { type: 'sine', frequency: 600, endFrequency: 800, duration: 0.1, volume: 0.2 },
      'MenuSelect': { type: 'sine', frequency: 800, endFrequency: 1000, duration: 0.05, volume: 0.2 },
      'Step': { type: 'sine', frequency: 300, endFrequency: 200, duration: 0.05, volume: 0.1 },
      'Door': { type: 'square', frequency: 200, endFrequency: 100, duration: 0.3, volume: 0.3 },
      'Buy': { type: 'sine', frequency: 400, endFrequency: 600, duration: 0.2, volume: 0.2 }
    };
    return params[name] || params['MenuSelect'];
  }

  /**
   * 应用屏幕色调变化
   * @param {Array} tone - [r, g, b, gray]
   */
  applyTone(tone) {
    // 在main.js中通过CSS filter或canvas叠加实现
    this.currentTone = tone;
  }

  /**
   * 像素完美渲染设置
   * @param {CanvasRenderingContext2D} ctx
   */
  setupPixelPerfect(ctx) {
    ctx.imageSmoothingEnabled = false;
    if (ctx.mozImageSmoothingEnabled !== undefined) {
      ctx.mozImageSmoothingEnabled = false;
    }
    if (ctx.webkitImageSmoothingEnabled !== undefined) {
      ctx.webkitImageSmoothingEnabled = false;
    }
    if (ctx.msImageSmoothingEnabled !== undefined) {
      ctx.msImageSmoothingEnabled = false;
    }
  }
}

const gameEffects = new GameEffects();
export default gameEffects;
