// 输入系统：键盘 + 触屏
import { useCallback, useEffect, useRef, useState } from 'react'

export type Dir = 'up' | 'down' | 'left' | 'right'

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  confirm: boolean
  cancel: boolean
  menu: boolean
  pulse: { confirm: number; cancel: number; menu: number }
}

export interface InputController {
  state: InputState
  setDir: (dir: Dir, on: boolean) => void
  press: (key: 'confirm' | 'cancel' | 'menu') => void
}

export function useInput(): InputController {
  const [state, setState] = useState<InputState>({
    up: false, down: false, left: false, right: false,
    confirm: false, cancel: false, menu: false,
    pulse: { confirm: 0, cancel: 0, menu: 0 },
  })
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key
      const s = stateRef.current
      const next = { ...s, pulse: { ...s.pulse } }
      let changed = false
      if ((k === 'ArrowUp' || k === 'w' || k === 'W') && !s.up) { next.up = true; changed = true }
      else if ((k === 'ArrowDown' || k === 's' || k === 'S') && !s.down) { next.down = true; changed = true }
      else if ((k === 'ArrowLeft' || k === 'a' || k === 'A') && !s.left) { next.left = true; changed = true }
      else if ((k === 'ArrowRight' || k === 'd' || k === 'D') && !s.right) { next.right = true; changed = true }
      else if ((k === 'z' || k === 'Z' || k === ' ' || k === 'Enter') && !s.confirm) {
        next.confirm = true
        next.pulse.confirm = s.pulse.confirm + 1
        changed = true
      }
      else if ((k === 'x' || k === 'X' || k === 'Escape') && !s.cancel) {
        next.cancel = true
        next.pulse.cancel = s.pulse.cancel + 1
        changed = true
      }
      else if ((k === 'm' || k === 'M') && !s.menu) {
        next.menu = true
        next.pulse.menu = s.pulse.menu + 1
        changed = true
      }
      if (changed) {
        setState(next)
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key
      const s = stateRef.current
      const next = { ...s }
      let changed = false
      if ((k === 'ArrowUp' || k === 'w' || k === 'W') && s.up) { next.up = false; changed = true }
      else if ((k === 'ArrowDown' || k === 's' || k === 'S') && s.down) { next.down = false; changed = true }
      else if ((k === 'ArrowLeft' || k === 'a' || k === 'A') && s.left) { next.left = false; changed = true }
      else if ((k === 'ArrowRight' || k === 'd' || k === 'D') && s.right) { next.right = false; changed = true }
      else if (k === 'z' || k === 'Z' || k === ' ' || k === 'Enter') { next.confirm = false; changed = true }
      else if (k === 'x' || k === 'X' || k === 'Escape') { next.cancel = false; changed = true }
      else if (k === 'm' || k === 'M') { next.menu = false; changed = true }
      if (changed) setState(next)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const setDir = useCallback((dir: Dir, on: boolean) => {
    setState((s) => (s[dir] === on ? s : { ...s, [dir]: on }))
  }, [])

  const press = useCallback((key: 'confirm' | 'cancel' | 'menu') => {
    setState((s) => ({
      ...s,
      [key]: true,
      pulse: { ...s.pulse, [key]: s.pulse[key] + 1 },
    }))
    setTimeout(() => {
      setState((s) => ({ ...s, [key]: false }))
    }, 150)
  }, [])

  return { state, setDir, press }
}
