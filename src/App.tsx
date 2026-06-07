import { GameCanvas } from './components/GameCanvas'

export default function App() {
  return (
    <div className="w-screen h-screen bg-black text-white font-pixel overflow-hidden flex items-center justify-center">
      <GameCanvas />
    </div>
  )
}
