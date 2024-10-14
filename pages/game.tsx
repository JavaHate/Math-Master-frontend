import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Game: React.FC = () => {
  const router = useRouter()
  const { mode, userId } = router.query
  const [gameMode, setGameMode] = useState<string | undefined>(undefined)
  const [problem, setProblem] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [score, setScore] = useState<number>(0) // this 0 too needs to be a variable
  const [timeLeft, setTimeLeft] = useState<number>(30) // needs to be changed to a button or something
  const [startTime, setStartTime] = useState<string>('')
  const [gameOver, setGameOver] = useState<boolean>(false)

  useEffect(() => {
    if (mode) {
      setGameMode(mode as string)
    }
  }, [mode])

  useEffect (() => {
    setStartTime(localISOTime());
  }, [])

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

  const generateProblem = async () => {
    try 
    {
      const response = await fetch('/api/question/random')
    if (response.ok) {
      const data = await response.json();
      setProblem(data[0].text);
    } else {
      console.error('Failed to fetch the problem from the backend');
    }
  } catch (error) {
    console.error('Error fetching problem:', error);
  }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctAnswer = eval(problem)
    if (parseInt(answer) === correctAnswer) {
      setScore(score + 1)
      generateProblem()
    } else {
      if (gameMode === 'endless') {
        setGameOver(true)
      }
      saveGame()
    }
    setAnswer('')
  }

  const saveGame = async () => {
    const gameData = {
      gameMode: gameMode,
      score: score,
      startTime: startTime,
      endTime: localISOTime(),
      userId: userId
    };

    try {
      const response = await fetch('api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Game saved successfully:', result);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }

  const localISOTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString().slice(0, -1);
  };

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