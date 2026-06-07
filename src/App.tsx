import { GameCanvas } from './components/GameCanvas'

export default function App() {
  return (
    <div className="fixed inset-0 bg-black text-white font-pixel overflow-hidden">
      <GameCanvas />
    </div>
  )
}
