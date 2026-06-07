// 触屏方向键 + A/B 按钮（移动端）
import { useEffect, useRef, useState } from 'react'

interface Props {
  onDir: (d: 'up' | 'down' | 'left' | 'right', on: boolean) => void
  onConfirm: () => void
  onCancel: () => void
  onMenu: () => void
}

export function TouchControls({ onDir, onConfirm, onCancel, onMenu }: Props) {
  const [active, setActive] = useState<Record<string, boolean>>({})
  const setA = (k: string, v: boolean) => {
    setActive((p) => ({ ...p, [k]: v }))
  }

  const dirBtn = (d: 'up' | 'down' | 'left' | 'right', label: string, className: string) => (
    <button
      onTouchStart={(e) => {
        e.preventDefault()
        onDir(d, true)
        setA(d, true)
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        onDir(d, false)
        setA(d, false)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        onDir(d, true)
        setA(d, true)
      }}
      onMouseUp={(e) => {
        e.preventDefault()
        onDir(d, false)
        setA(d, false)
      }}
      onMouseLeave={() => {
        onDir(d, false)
        setA(d, false)
      }}
      className={`${className} ${active[d] ? 'opacity-100' : 'opacity-60'}`}
    >
      {label}
    </button>
  )

  const actionBtn = (label: string, k: string, color: string, action: () => void) => (
    <button
      onTouchStart={(e) => {
        e.preventDefault()
        action()
        setA(k, true)
        setTimeout(() => setA(k, false), 150)
      }}
      className={`w-14 h-14 rounded-full ${color} ${active[k] ? 'scale-90' : ''} font-pixel text-xs text-white border-2 border-white/80 active:scale-90 transition-transform shadow-lg flex items-center justify-center`}
    >
      {label}
    </button>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 flex justify-between p-4 select-none">
      {/* 方向键 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36 pointer-events-auto">
        <div></div>
        {dirBtn('up', '▲', 'col-start-2 row-start-1 bg-black/70 text-white border-2 border-white/80 rounded')}
        <div></div>
        {dirBtn('left', '◀', 'col-start-1 row-start-2 bg-black/70 text-white border-2 border-white/80 rounded')}
        <div className="col-start-2 row-start-2"></div>
        {dirBtn('right', '▶', 'col-start-3 row-start-2 bg-black/70 text-white border-2 border-white/80 rounded')}
        <div></div>
        {dirBtn('down', '▼', 'col-start-2 row-start-3 bg-black/70 text-white border-2 border-white/80 rounded')}
        <div></div>
      </div>
      {/* 动作键 */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        <div className="flex gap-2">
          {actionBtn('B', 'cancel', 'bg-red-700', onCancel)}
          {actionBtn('A', 'confirm', 'bg-blue-700', onConfirm)}
        </div>
        {actionBtn('MENU', 'menu', 'bg-gray-700', onMenu)}
      </div>
    </div>
  )
}
