import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Game: React.FC = () => {
  const router = useRouter()
  const { mode } = router.query
  const [gameMode, setGameMode] = useState<string | undefined>(undefined)
  const [problem, setProblem] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [score, setScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(6)
  const [gameOver, setGameOver] = useState<boolean>(false)

  useEffect(() => {
    if (mode) {
      setGameMode(mode as string)
    }
  }, [mode])

  useEffect(() => {
    generateProblem()
    if (gameMode === 'time-trial') {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setGameOver(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameMode])

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)]
    setProblem(`${num1} ${operator} ${num2}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctAnswer = eval(problem)
    if (parseInt(answer) === correctAnswer) {
      setScore(score + 1)
      generateProblem()
    } else if (gameMode === 'endless') {
      setGameOver(true)
    }
    setAnswer('')
  }

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
        <div className="mt-12 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                {gameMode === 'time-trial' ? `Time Left: ${timeLeft}s` : `Score: ${score}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!gameOver ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-3xl text-center font-bold">{problem}</div>
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="text-center"
                  />
                  <Button type="submit" className="w-full">Submit Answer</Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold">Game Over!</p>
                  <p className="text-xl">Your final score: {score}</p>
                  <Button onClick={() => router.reload()}>Play Again</Button>
                </div>
              )}
            </CardContent>
          </Card>
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