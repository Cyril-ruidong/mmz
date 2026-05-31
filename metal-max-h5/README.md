# 重装机兵H5版

基于经典FC游戏《重装机兵》(Metal Max)的H5网页版复刻项目。

## 游戏特性

- 🎮 **纯HTML5实现** - 无需任何插件，浏览器即可运行
- 📱 **响应式设计** - 支持PC、手机、平板等多种设备
- 🕹️ **触控支持** - 虚拟摇杆和按钮，专为移动端优化
- 🎨 **像素风格** - 完美还原FC时代的经典像素画风
- ⚡ **流畅运行** - 60FPS游戏体验

## 快速开始

### 方法一：直接打开

1. 下载或克隆本项目
2. 直接在浏览器中打开 `index.html`

### 方法二：本地服务器

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx http-server

# 使用PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 操作说明

### PC端

| 按键 | 功能 |
|------|------|
| 方向键 / WASD | 移动 |
| Enter / J | 确认/对话 |
| K | 取消/返回 |
| ESC | 菜单 |

### 移动端

- **虚拟摇杆**：屏幕左下角滑动控制移动
- **确认按钮**：屏幕右下角"J"按钮
- **取消按钮**：屏幕右下角"K"按钮

## 游戏内容

### 已实现功能

- ✅ 标题画面
- ✅ 地图探索系统
- ✅ 角色移动控制
- ✅ NPC对话系统
- ✅ 触控虚拟控件
- ✅ 响应式布局

### 开发中的功能

- 🔨 战斗系统
- 🔨 装备系统
- 🔨 战车系统
- 🔨 商店系统
- 🔨 存档系统

## 技术架构

```
metal-max-h5/
├── index.html              # 游戏入口
├── css/
│   └── main.css           # 样式文件
├── js/
│   └── core/
│       └── Game.js        # 游戏核心逻辑
├── assets/                # 资源文件
│   ├── tilesets/         # 瓦片图
│   ├── sprites/          # 精灵图
│   └── audio/            # 音频文件
└── maps/                  # 地图数据
```

### 核心模块

| 模块 | 说明 |
|------|------|
| Game | 游戏主类，负责初始化和主循环 |
| InputManager | 统一处理键盘、鼠标、触控输入 |
| AudioManager | 音频播放管理 |
| Scene | 场景基类 |
| TitleScene | 标题画面场景 |
| WorldScene | 世界地图场景 |

## 开发指南

### 环境要求

- 现代浏览器（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）
- 无需任何构建工具

### 代码规范

- 使用ES6+语法
- 类名使用PascalCase
- 方法名和变量使用camelCase
- 常量使用UPPER_SNAKE_CASE

### 添加新场景

```javascript
class NewScene extends Scene {
    constructor(game) {
        super(game);
    }

    async init() {
        // 初始化场景资源
        await super.init();
    }

    update(deltaTime) {
        // 更新场景逻辑
    }

    render(ctx) {
        // 渲染场景内容
    }
}

// 在Game.initScenes中注册
this.scenes.set('newScene', new NewScene(this));
```

### 添加新资源

在 `Game.loadAssets` 方法中添加：

```javascript
await this.loadImage('resourceName', 'path/to/image.png');
```

## 浏览器兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |
| iOS Safari | 13+ |
| Android Chrome | 80+ |

## 性能优化

- Canvas视口裁剪，只渲染可见区域
- requestAnimationFrame游戏循环
- 对象复用和池化
- 资源按需加载

## 许可证

本项目仅供学习交流使用，请勿用于商业用途。

## 致谢

- 经典FC游戏《重装机兵》- Data East
- 所有像素美术素材的创作者
- 游戏开发社区的支持

---

**版本**: v0.1.0  
**开发时间**: 2026-05-31
