# 技术架构文档 - 3D H5 旋转立方体游戏

## 1. 架构设计

```
┌─────────────────────────────────────────────┐
│                  UI 层                       │
│  (HTML/CSS - 分数显示、游戏提示)              │
├─────────────────────────────────────────────┤
│                Three.js 渲染层                │
│  (场景、相机、渲染器、物体)                   │
├─────────────────────────────────────────────┤
│                游戏逻辑层                     │
│  (玩家控制、碰撞检测、分数系统)               │
├─────────────────────────────────────────────┤
│                初始化层                       │
│  (场景搭建、资源加载、事件绑定)               │
└─────────────────────────────────────────────┘
```

## 2. 技术描述

- **前端**：Vanilla JavaScript + Three.js@0.160.0
- **构建工具**：Vite@5.0.0
- **3D 引擎**：Three.js (WebGL)
- **动画库**：Three.js 内置动画系统
- **后端**：无 (纯前端项目)

## 3. 目录结构

```
/workspace
├── index.html          # 入口 HTML
├── package.json        # 项目配置
├── vite.config.js      # Vite 配置
├── src/
│   ├── main.js         # 主入口
│   ├── style.css       # 样式文件
│   ├── scene.js        # 3D 场景初始化
│   ├── player.js       # 玩家控制
│   ├── crystals.js      # 晶体生成与管理
│   ├── collision.js    # 碰撞检测
│   └── ui.js           # UI 更新
└── .trae/
    └── documents/      # 文档目录
```

## 4. 模块定义

### 4.1 scene.js - 3D 场景模块
```javascript
// 功能：初始化 Three.js 场景、相机、渲染器、光照
// 导出：scene, camera, renderer
```

### 4.2 player.js - 玩家控制模块
```javascript
// 功能：创建玩家立方体、处理鼠标/触摸输入、更新位置
// 导出：player, updatePlayerPosition()
```

### 4.3 crystals.js - 晶体系统模块
```javascript
// 功能：生成、管理晶体，检测收集
// 导出：crystals[], spawnCrystal(), updateCrystals()
```

### 4.4 collision.js - 碰撞检测模块
```javascript
// 功能：AABB 盒碰撞检测
// 导出：checkCollision(object1, object2)
```

### 4.5 ui.js - UI 更新模块
```javascript
// 功能：更新分数显示、游戏提示
// 导出：updateScore(), showGameTip()
```

## 5. 关键数据结构

### 玩家对象
```javascript
{
  mesh: THREE.Mesh,      // 立方体网格
  velocity: {x, z},      // 移动速度
  position: {x, y, z}    // 世界坐标
}
```

### 晶体对象
```javascript
{
  mesh: THREE.Mesh,      // 八面体网格
  position: {x, y, z},   // 世界坐标
  collected: boolean     // 是否已被收集
}
```

### 游戏状态
```javascript
{
  score: number,         // 当前分数
  isPlaying: boolean,    // 游戏是否进行中
  crystals: Crystal[]    // 晶体数组
}
```

## 6. 性能优化策略

1. **对象池**：晶体回收复用，避免频繁创建销毁
2. **视锥剔除**：只渲染相机可见区域
3. **简化几何体**：使用较低面数的几何体
4. **移动端适配**：降低渲染分辨率，简化阴影

## 7. 兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器 (iOS Safari, Chrome Android)
