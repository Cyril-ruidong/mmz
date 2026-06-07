// 主游戏画布
import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { renderGame, RenderState } from '@/game/render'
import { useInput } from '@/game/input'
import { makeRandomEncounter, makeBountyEnemy } from '@/game/data'
import { isTown, getTownBuildingAt, generateWorld } from '@/game/world'
import { TouchControls } from './TouchControls'

const LOGICAL_W = 256
const LOGICAL_H = 224
const ASPECT = LOGICAL_W / LOGICAL_H // 8:7

function fitScale(vw: number, vh: number, isTouch: boolean) {
  // 触屏设备需要为方向键留出空间
  const reservedY = isTouch ? 180 : 0
  const reservedX = 0
  const availW = vw - reservedX
  const availH = vh - reservedY
  // 优先取整数倍缩放（2x / 3x / 4x），保持像素锐利
  const maxByW = Math.floor(availW / LOGICAL_W)
  const maxByH = Math.floor(availH / LOGICAL_H)
  const maxScale = Math.max(1, Math.min(maxByW, maxByH))
  return Math.min(maxScale, 4)
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(3)
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 768)
  const [isTouch, setIsTouch] = useState(false)
  const stateRef = useRef<RenderState>({
    scene: 'title',
    party: [],
    tank: useGameStore.getState().tank,
    worldX: 0, worldY: 0, worldDir: 'down',
    townX: 0, townY: 0, townDir: 'down',
    battle: null,
    menuIndex: 0,
    flash: null,
    animFrame: 0,
    message: '',
    messageTime: 0,
    hud: { gold: 0, bullets: 0 },
  })
  const input = useInput()
  const stepRef = useRef({ lastStep: 0, encounter: 0 })
  const prevPulse = useRef({ confirm: 0, cancel: 0, menu: 0 })

  const setScene = useGameStore((s) => s.setScene)
  const moveWorld = useGameStore((s) => s.moveWorld)
  const moveTown = useGameStore((s) => s.moveTown)
  const startBattle = useGameStore((s) => s.startBattle)
  const setDialog = useGameStore((s) => s.setDialog)
  const battleAction = useGameStore((s) => s.battleAction)
  const saveGame = useGameStore((s) => s.saveGame)
  const loadGame = useGameStore((s) => s.loadGame)
  const reset = useGameStore((s) => s.reset)
  const scanlines = useGameStore((s) => s.settings.scanlines)

  // 同步 store -> ref
  useEffect(() => {
    const unsub = useGameStore.subscribe((s) => {
      stateRef.current.scene = s.scene
      stateRef.current.party = s.party
      stateRef.current.tank = s.tank
      stateRef.current.worldX = s.worldX
      stateRef.current.worldY = s.worldY
      stateRef.current.worldDir = s.worldDir
      stateRef.current.townX = s.townX
      stateRef.current.townY = s.townY
      stateRef.current.townDir = s.townDir
      stateRef.current.battle = s.battle
        ? {
            enemies: s.battle.enemies,
            turn: s.battle.turn,
            selected: s.battle.selected,
            menuIndex: s.battle.menuIndex,
            message: s.battle.message,
            animFrame: s.battle.animFrame,
            phase: s.battle.phase,
          }
        : null
      stateRef.current.hud.gold = s.inventory.gold
      stateRef.current.hud.bullets = s.inventory.bullets
    })
    return unsub
  }, [])

  // 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = LOGICAL_W
    canvas.height = LOGICAL_H
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    let raf = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = t - last
      last = t
      stateRef.current.animFrame += dt / 16
      if (stateRef.current.messageTime > 0) {
        stateRef.current.messageTime -= dt
        if (stateRef.current.messageTime <= 0) stateRef.current.message = ''
      }
      if (stateRef.current.flash) {
        stateRef.current.flash.t -= dt / 16
        if (stateRef.current.flash.t <= 0) stateRef.current.flash = null
      }
      renderGame(ctx, stateRef.current)
      if (scanlines) {
        ctx.fillStyle = 'rgba(0,0,0,0.18)'
        for (let y = 0; y < LOGICAL_H; y += 2) {
          ctx.fillRect(0, y, LOGICAL_W, 1)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scanlines])

  // 输入处理
  useEffect(() => {
    const s = useGameStore.getState()
    const scene = s.scene
    const battle = s.battle
    const isNewConfirm = input.state.pulse.confirm > prevPulse.current.confirm
    const isNewCancel = input.state.pulse.cancel > prevPulse.current.cancel
    const isNewMenu = input.state.pulse.menu > prevPulse.current.menu
    prevPulse.current = { ...input.state.pulse }

    if (s.dialog) {
      if (isNewConfirm) setDialog(null)
      return
    }

    if (scene === 'title') {
      if (isNewConfirm) {
        if (stateRef.current.menuIndex === 0) {
          reset()
          setTimeout(() => {
            useGameStore.getState().setScene('house')
            useGameStore.getState().setDialog({ text: '父亲：明奇，红狼号已经修好了，去吧！' })
          }, 50)
        } else if (stateRef.current.menuIndex === 1) {
          loadGame()
        } else if (stateRef.current.menuIndex === 2) {
          useGameStore.getState().setScene('bounty')
        }
      }
      if (input.state.up) stateRef.current.menuIndex = (stateRef.current.menuIndex + 3) % 4
      if (input.state.down) stateRef.current.menuIndex = (stateRef.current.menuIndex + 1) % 4
      return
    }

    if (scene === 'battle' && battle) {
      const inTank = s.party[0]?.isTank
      const maxMenu = 5
      if (input.state.left && battle.selected > 0) {
        useGameStore.setState((st) => ({ battle: st.battle ? { ...st.battle, selected: st.battle.selected - 1 } : null }))
      }
      if (input.state.right && battle.selected < battle.enemies.length - 1) {
        useGameStore.setState((st) => ({ battle: st.battle ? { ...st.battle, selected: st.battle.selected + 1 } : null }))
      }
      if (input.state.up) {
        useGameStore.setState((st) => ({ battle: st.battle ? { ...st.battle, menuIndex: (st.battle.menuIndex + maxMenu - 1) % maxMenu } : null }))
      }
      if (input.state.down) {
        useGameStore.setState((st) => ({ battle: st.battle ? { ...st.battle, menuIndex: (st.battle.menuIndex + 1) % maxMenu } : null }))
      }
      if (isNewConfirm) {
        const mi = battle.menuIndex
        if (inTank) {
          if (mi === 0) battleAction('main')
          else if (mi === 1) battleAction('sub')
          else if (mi === 2) battleAction('defend')
          else if (mi === 3) battleAction('item')
          else if (mi === 4) battleAction('escape')
        } else {
          if (mi === 0) battleAction('attack')
          else if (mi === 1) battleAction('defend')
          else if (mi === 2) battleAction('item')
          else if (mi === 3) battleAction('item')
          else if (mi === 4) battleAction('escape')
        }
      }
      if (isNewCancel) battleAction('escape')
      return
    }

    if (scene === 'house') {
      if (isNewConfirm) {
        setScene('town')
      }
      return
    }

    if (scene === 'bounty') {
      if (isNewConfirm) {
        const next = s.bounties.find((b) => !b.completed)
        if (next) {
          startBattle([makeBountyEnemy(next)])
        } else {
          setDialog({ text: '没有赏金任务了' })
        }
      }
      if (isNewCancel) setScene('town')
      return
    }

    if (scene === 'shop') {
      if (isNewConfirm) {
        // 简单购买：花费 100 金币获得一个回复剂
        if (s.inventory.gold >= 100) {
          useGameStore.setState((st) => ({
            inventory: {
              ...st.inventory,
              gold: st.inventory.gold - 100,
              items: [...st.inventory.items.filter((i) => i.id !== 'potion'), { id: 'potion', name: '回复剂', count: (st.inventory.items.find((i) => i.id === 'potion')?.count || 0) + 1 }],
            },
          }))
          setDialog({ text: '获得回复剂！' })
        } else {
          setDialog({ text: '金币不足' })
        }
      }
      if (isNewCancel) setScene('town')
      return
    }

    if (scene === 'mod') {
      if (isNewConfirm) {
        const t = useGameStore.getState().tank
        if (s.inventory.gold >= 200 && t.engine < 255) {
          useGameStore.setState((st) => ({
            tank: { ...st.tank, engine: Math.min(255, st.tank.engine + 5) },
            inventory: { ...st.inventory, gold: st.inventory.gold - 200 },
          }))
          setDialog({ text: '引擎升级成功！' })
        } else {
          setDialog({ text: '金币不足' })
        }
      }
      if (isNewCancel) setScene('town')
      return
    }

    if (scene === 'town') {
      if (input.state.left) moveTown(-1, 0)
      else if (input.state.right) moveTown(1, 0)
      else if (input.state.up) moveTown(0, -1)
      else if (input.state.down) moveTown(0, 1)
      if (isNewConfirm) {
        const b = getTownBuildingAt(s.townX, s.townY)
        if (b) setScene(b.scene as any)
      }
      if (isNewCancel) {
        if (s.townY === 0) setScene('world')
      }
      return
    }

    if (scene === 'world') {
      if (input.state.left) moveWorld(-1, 0)
      else if (input.state.right) moveWorld(1, 0)
      else if (input.state.up) moveWorld(0, -1)
      else if (input.state.down) moveWorld(0, 1)
      if (Date.now() - stepRef.current.lastStep > 280) {
        if (input.state.left || input.state.right || input.state.up || input.state.down) {
          stepRef.current.lastStep = Date.now()
          stepRef.current.encounter++
          if (stepRef.current.encounter > 10 && Math.random() < 0.16) {
            stepRef.current.encounter = 0
            const party = useGameStore.getState().party
            const tank = useGameStore.getState().tank
            const enemies = makeRandomEncounter(party, tank)
            startBattle(enemies)
            stateRef.current.flash = { x: 0, y: 0, color: '#FFFFFF', t: 24 }
          }
        }
      }
      const wm = generateWorld()
      if (isTown(wm[s.worldY][s.worldX])) {
        setScene('town')
      }
      if (isNewMenu) {
        saveGame()
        setDialog({ text: '已保存！' })
      }
      return
    }

    if (scene === 'gameover') {
      if (isNewConfirm) reset()
      return
    }
  }, [input.state])

  const [isTouchLocal, setIsTouch] = useState(false)
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setVw(w)
      setVh(h)
      setIsTouch(touch)
      setIsTouchLocal(touch)
      setScale(fitScale(w, h, touch))
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  const displayW = LOGICAL_W * scale
  const displayH = LOGICAL_H * scale

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden relative"
    >
      <div
        className="relative flex-shrink-0"
        style={{
          width: displayW,
          height: displayH,
          maxWidth: '100vw',
          maxHeight: isTouchLocal ? 'calc(100vh - 180px)' : '100vh',
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            width: displayW,
            height: displayH,
            imageRendering: 'pixelated',
            boxShadow: '0 0 0 4px #1C3878, 0 0 0 8px #000000',
          }}
        />
        {useGameStore((s) => s.dialog) && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-blue-900 border-2 border-white p-2 font-pixel text-white"
            style={{ bottom: 8, width: displayW - 16, fontSize: 10, textShadow: '1px 1px 0 #000' }}
          >
            {useGameStore.getState().dialog?.text}
          </div>
        )}
      </div>
      {isTouchLocal && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <TouchControls
            onDir={input.setDir}
            onConfirm={() => input.press('confirm')}
            onCancel={() => input.press('cancel')}
            onMenu={() => input.press('menu')}
          />
        </div>
      )}
    </div>
  )
}
