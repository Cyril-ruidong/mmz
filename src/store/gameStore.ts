import { create } from 'zustand'
import { makeInitialParty, makeRedWolf, BOUNTIES } from '@/game/data'
import type { Bounty, BattleState, Character, DialogLine, Enemy, Inventory, SceneKind, Tank } from '@/types/game'

interface Settings {
  bgm: boolean
  sfx: boolean
  scanlines: boolean
}

interface GameStore {
  scene: SceneKind
  prevScene: SceneKind | null
  party: Character[]
  tank: Tank
  inventory: Inventory
  bounties: Bounty[]
  // 玩家世界地图坐标
  worldX: number
  worldY: number
  worldDir: 'up' | 'down' | 'left' | 'right'
  // 拉多镇坐标
  townX: number
  townY: number
  townDir: 'up' | 'down' | 'left' | 'right'
  // 战斗
  battle: BattleState | null
  // 对话
  dialog: DialogLine | null
  // 设置
  settings: Settings
  // 战斗胜利次数
  bountyTotal: number
  setScene: (s: SceneKind) => void
  moveWorld: (dx: number, dy: number) => void
  moveTown: (dx: number, dy: number) => void
  startBattle: (enemies: Enemy[]) => void
  endBattle: (win: boolean) => void
  setDialog: (d: DialogLine | null) => void
  toggleSetting: (k: keyof Settings) => void
  reset: () => void
  tickBattle: () => void
  battleAction: (action: 'attack' | 'defend' | 'item' | 'escape' | 'skill' | 'se' | 'main' | 'sub') => void
  loadGame: () => void
  saveGame: () => void
}

const initial = () => {
  const party = makeInitialParty()
  const tank = makeRedWolf()
  const inv: Inventory = { gold: 500, items: [{ id: 'potion', name: '回复剂', count: 3 }], bullets: 50 }
  return { party, tank, inventory: inv, bounties: [...BOUNTIES], worldX: 30, worldY: 30, worldDir: 'down' as const, townX: 8, townY: 8, townDir: 'down' as const, bountyTotal: 0 }
}

export const useGameStore = create<GameStore>((set, get) => ({
  scene: 'title',
  prevScene: null,
  party: makeInitialParty(),
  tank: makeRedWolf(),
  inventory: { gold: 500, items: [{ id: 'potion', name: '回复剂', count: 3 }], bullets: 50 },
  bounties: [...BOUNTIES],
  worldX: 30,
  worldY: 30,
  worldDir: 'down',
  townX: 8,
  townY: 8,
  townDir: 'down',
  battle: null,
  dialog: null,
  settings: { bgm: true, sfx: true, scanlines: true },
  bountyTotal: 0,
  setScene: (s) => set({ scene: s }),
  moveWorld: (dx, dy) => {
    const { worldX, worldY, worldDir } = get()
    let nx = worldX + dx
    let ny = worldY + dy
    // 世界地图边界 0-63
    nx = Math.max(0, Math.min(63, nx))
    ny = Math.max(0, Math.min(63, ny))
    let ndir = worldDir
    if (dx > 0) ndir = 'right'
    if (dx < 0) ndir = 'left'
    if (dy > 0) ndir = 'down'
    if (dy < 0) ndir = 'up'
    set({ worldX: nx, worldY: ny, worldDir: ndir })
  },
  moveTown: (dx, dy) => {
    const { townX, townY, townDir } = get()
    let nx = townX + dx
    let ny = townY + dy
    nx = Math.max(0, Math.min(15, nx))
    ny = Math.max(0, Math.min(15, ny))
    let ndir = townDir
    if (dx > 0) ndir = 'right'
    if (dx < 0) ndir = 'left'
    if (dy > 0) ndir = 'down'
    if (dy < 0) ndir = 'up'
    set({ townX: nx, townY: ny, townDir: ndir })
  },
  startBattle: (enemies) => {
    set({
      scene: 'battle',
      battle: {
        enemies,
        turn: 0,
        selected: 0,
        menuIndex: 0,
        message: '遭遇敌人！',
        log: [],
        animFrame: 0,
        phase: 'select',
        attacked: false,
      },
    })
  },
  endBattle: (win) => {
    const b = get().battle
    if (!b) return
    if (win) {
      // 计算奖励
      const gold = b.enemies.reduce((s, e) => s + e.hp, 0)
      const exp = b.enemies.length * 5
      // 检查赏金首
      const newBounties = get().bounties.map((bb) => {
        if (!bb.completed && b.enemies.some((e) => e.id === bb.id)) {
          return { ...bb, completed: true }
        }
        return bb
      })
      const goldGot = b.enemies.filter((e) => e.isBoss).reduce((s, e) => {
        const b2 = get().bounties.find((bb) => bb.id === e.id)
        return s + (b2?.reward || 0)
      }, gold)
      set((st) => ({
        scene: 'world',
        battle: null,
        inventory: { ...st.inventory, gold: st.inventory.gold + goldGot },
        bounties: newBounties,
        bountyTotal: st.bountyTotal + exp,
      }))
    } else {
      set({ scene: 'world', battle: null })
    }
  },
  setDialog: (d) => set({ dialog: d }),
  toggleSetting: (k) => set((s) => ({ settings: { ...s.settings, [k]: !s.settings[k] } })),
  reset: () => {
    const fresh = initial()
    set({ scene: 'title', battle: null, dialog: null, ...fresh })
  },
  tickBattle: () => {
    const b = get().battle
    if (!b) return
    set({ battle: { ...b, animFrame: b.animFrame + 1 } })
  },
  battleAction: (action) => {
    const st = get()
    const b = st.battle
    if (!b || b.phase !== 'select') return
    if (b.turn !== 0) return
    const party = [...st.party]
    const tank = { ...st.tank }
    const enemies = b.enemies.map((e) => ({ ...e }))
    const target = enemies[b.selected]
    const attacker = party.find((p) => p.hp > 0) || party[0]

    if (action === 'attack') {
      // 步行攻击
      const atk = attacker.attack + Math.floor(Math.random() * 6)
      const dmg = Math.max(1, atk - target.defense / 2)
      target.hp = Math.max(0, target.hp - dmg)
      // 暴攻 BUG：连续攻击两次（如果 hp=0 后又被打中）
      if (target.hp === 0 && Math.random() < 0.2) {
        target.hp = 0 // 仍 0
      }
      set({ battle: { ...b, enemies, message: `${attacker.name} 攻击！ -${dmg}`, phase: 'anim' } })
      setTimeout(() => {
        if (enemies.every((e) => e.hp === 0)) {
          st.endBattle(true)
        } else {
          set({ battle: { ...st.battle!, enemies, turn: 1, message: '敌方回合', phase: 'select' } })
          // 敌方攻击
          setTimeout(() => {
            const live = enemies.filter((e) => e.hp > 0)
            const eAtk = live[Math.floor(Math.random() * live.length)]
            const tIdx = party.findIndex((p) => p.hp > 0)
            if (tIdx < 0) {
              st.endBattle(false)
              return
            }
            const dmg2 = Math.max(1, eAtk.attack - party[tIdx].defense / 2)
            // 暴血 BUG: 扣 HP 到负
            party[tIdx].hp = Math.max(-99, party[tIdx].hp - dmg2)
            // 暴装甲 BUG: C 装置也扣
            if (party[tIdx].isTank) {
              tank.cHp = Math.max(-99, tank.cHp - Math.max(1, eAtk.attack - 5))
            }
            set({ party, tank, battle: { ...st.battle!, message: `${eAtk.name} 攻击！ -${dmg2}`, turn: 0, phase: 'select' } })
            if (party.every((p) => p.hp <= 0)) {
              st.endBattle(false)
            }
          }, 600)
        }
      }, 500)
      return
    }

    if (action === 'defend') {
      set({ battle: { ...b, message: `${attacker.name} 防御`, phase: 'anim' } })
      setTimeout(() => set({ battle: { ...b, turn: 1, phase: 'select', message: '敌方回合' } }), 400)
      return
    }

    if (action === 'escape') {
      if (Math.random() < 0.5) {
        set({ battle: null, scene: 'world' })
      } else {
        set({ battle: { ...b, message: '逃跑失败！', phase: 'anim' } })
        setTimeout(() => set({ battle: { ...b, turn: 1, phase: 'select' } }), 400)
      }
      return
    }
  },
  loadGame: () => {
    try {
      const raw = localStorage.getItem('mmz-save')
      if (!raw) return
      const data = JSON.parse(raw)
      set(data)
    } catch {}
  },
  saveGame: () => {
    const s = get()
    const data = {
      scene: s.scene,
      party: s.party,
      tank: s.tank,
      inventory: s.inventory,
      bounties: s.bounties,
      worldX: s.worldX,
      worldY: s.worldY,
      worldDir: s.worldDir,
      townX: s.townX,
      townY: s.townY,
      townDir: s.townDir,
      bountyTotal: s.bountyTotal,
      settings: s.settings,
    }
    try {
      localStorage.setItem('mmz-save', JSON.stringify(data))
    } catch {}
  },
}))
