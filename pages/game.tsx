import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const Game: React.FC = () => {
  const router = useRouter()
  const { mode } = router.query
  const [gameMode, setGameMode] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (mode) {
      setGameMode(mode as string)
    }
  }, [mode])

  const handleReturnHome = () => {
    router.push('/')
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mt-20">
          {gameMode === 'time-trial' ? 'Time Trial Mode' : 'Endless Mode'}
        </h1>
        <p className="text-center mt-4 text-xl text-gray-600">
          {gameMode === 'time-trial' ? 'Race against the clock!' : 'How long can you last?'}
        </p>
        {/* Add your game logic here */}
        <div className="mt-12 flex justify-center">
          <div className="border border-gray-300 p-4 text-center w-full h-96">
            Game will be here
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Button variant="outline" onClick={handleReturnHome}>
            Return to Homepage
          </Button>
        </div>
      </main>
    </div>
  )
}

export default Game