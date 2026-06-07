# mmz

# 《重装机兵》HTML5 重制版

基于 React + TypeScript + Vite + Canvas 2D 的《重装机兵》FC 原版风格像素 RPG 浏览器重制。

## 启动

```bash
npm install
npm run dev      # 开发模式 (http://localhost:5173)
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 操作

| 按键 | 功能 |
|------|------|
| 方向键 / WASD | 移动 |
| Z / 空格 / Enter | 确认 / 交互 |
| X / Esc | 取消 / 离开 |
| M | 存档 |

移动端：屏幕底部自动显示方向键 + A/B 按钮。

## 玩法

1. 主菜单选择「开始游戏」
2. 拉多镇家中与父亲对话获取「红狼号」战车
3. 出城进入世界地图，按方向键探索
4. 遇敌进入回合制战斗
5. 击败敌人获得金币、经验，赏金首击败后到赏金事务所领取赏金
6. 回城升级战车引擎 / 购买装备

## 核心特性

- 256×224 逻辑画布，整数倍像素缩放
- FC 8 位机像素美术风格（程序化生成）
- 回合制战斗（步行 / 战车双模式）
- 战车改装系统（引擎、武器、装甲、底盘）
- 6 名赏金首任务链
- 经典 BUG 还原：暴攻 / 暴血 / 暴装甲
- 键盘 + 触屏双操作模式
- LocalStorage 存档
- 扫描线 CRT 效果（可关闭）

## 目录结构

```
src/
├── main.tsx          # 入口
├── App.tsx
├── components/       # React 组件
│   ├── GameCanvas.tsx
│   └── TouchControls.tsx
├── game/             # 游戏引擎
│   ├── render.ts     # Canvas 渲染
│   ├── sprites.ts    # 像素精灵 / 字体
│   ├── world.ts      # 地图生成
│   ├── data.ts       # 数据 / 敌人 / 武器
│   ├── mod.ts        # 战车改装
│   └── input.ts      # 输入系统
├── store/            # 状态管理 (Zustand)
└── types/            # 类型定义
```
