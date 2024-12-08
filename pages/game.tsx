import { useRouter } from 'next/router'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import withAuth from "@/components/WithAuth"

interface PuzzleGuess {
  value: string;
  status: 'correct' | 'wrong-spot' | 'incorrect' | 'empty';
}

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
  const [puzzleGuess, setPuzzleGuess] = useState<string>('')
  const [puzzleFeedback, setPuzzleFeedback] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState<string[]>([])
  const [guesses, setGuesses] = useState<PuzzleGuess[][]>([])
  const [currentRow, setCurrentRow] = useState(0)
  const [solution, setSolution] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)

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
    } else if (gameMode === 'puzzles') {
      generatePuzzle()
    }
  }, [gameMode])

  const generateProblem = async () => {
    try 
    {
      const response = await fetch('https://javahate.azurewebsites.net/question/random')
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

  const generatePuzzle = async () => {
    try {
      const response = await fetch('https://javahate.azurewebsites.net/question/random')
      if (response.ok) {
        const data = await response.json()
        const equation = data[0].text + '=' + eval(data[0].text)
        setSolution(equation)
        setCurrentGuess(Array(equation.length).fill(''))
        setGuesses(Array(6).fill(null).map(() => 
          Array(equation.length).fill({ value: '', status: 'empty' })
        ))
      }
    } catch (error) {
      console.error('Error fetching puzzle:', error)
      const fallbackEquation = '10+20=30'
      setSolution(fallbackEquation)
      setCurrentGuess(Array(fallbackEquation.length).fill(''))
      setGuesses(Array(6).fill(null).map(() => 
        Array(fallbackEquation.length).fill({ value: '', status: 'empty' })
      ))
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

  const handlePuzzleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const feedback = checkPuzzleAnswer(puzzleGuess)
    setPuzzleFeedback(feedback)
    if (feedback.every(f => f === 'correct')) {
      setGameOver(true)
    }
    setPuzzleGuess('')
  }

  const checkPuzzleAnswer = (guess: string): string[] => {
    const solution = '10+20=30'
    const feedback = []
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === solution[i]) {
        feedback.push('correct')
      } else if (solution.includes(guess[i])) {
        feedback.push('wrong-spot')
      } else {
        feedback.push('incorrect')
      }
    }
    return feedback
  }

  const handleKeyInput = (value: string, index: number) => {
    if (!isGameWon && currentRow < 6) {
      const newGuess = [...currentGuess]
      newGuess[index] = value
      setCurrentGuess(newGuess)
    }
  }

  const checkGuess = () => {
    if (currentGuess.some(v => !v)) return;
    
    const guessString = currentGuess.join('')
    const newGuesses = [...guesses]
    const newGuess: PuzzleGuess[] = currentGuess.map((value, index) => {
      if (value === solution[index]) {
        return { value, status: 'correct' }
      } else if (solution.includes(value)) {
        return { value, status: 'wrong-spot' }
      }
      return { value, status: 'incorrect' }
    })

    newGuesses[currentRow] = newGuess
    setGuesses(newGuesses)

    if (guessString === solution) {
      setIsGameWon(true)
      setGameOver(true)
      saveGame() 
    } else if (currentRow === 5) {
      setGameOver(true)
      saveGame()
    }

    setCurrentRow(currentRow + 1)
    setCurrentGuess(Array(solution.length).fill(''))
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
      const response = await fetch('https://javahate.azurewebsites.net/game', {
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
          {gameMode === 'time-trial' ? 'Time Trial Mode' : gameMode === 'endless' ? 'Endless Mode' : 'Puzzles'}
        </h1>
        <p className="text-center mt-4 text-xl text-gray-600">
          {gameMode === 'time-trial' ? 'Race against the clock!' : gameMode === 'endless' ? 'How long can you last?' : 'Solve the puzzle!'}
        </p>
        <div className="mt-12 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                {gameMode === 'puzzles' ? 'Number Puzzle' : gameMode === 'time-trial' ? `Time Left: ${timeLeft}s` : gameMode === 'endless' ? `Score: ${score}` : 'Puzzles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gameMode === 'puzzles' ? (
                <div className="space-y-4">
                  {guesses.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid gap-1" style={{ 
                      gridTemplateColumns: `repeat(${solution.length}, minmax(0, 1fr))`
                    }}>
                      {row.map((cell, cellIndex) => (
                        <Input
                          key={cellIndex}
                          type="text"
                          maxLength={1}
                          className={`w-10 h-10 text-center font-bold ${
                            cell.status === 'correct' ? 'bg-green-500 text-white' :
                            cell.status === 'wrong-spot' ? 'bg-yellow-500 text-white' :
                            cell.status === 'incorrect' ? 'bg-gray-500 text-white' : ''
                          }`}
                          value={rowIndex === currentRow ? currentGuess[cellIndex] : cell.value}
                          onChange={(e) => rowIndex === currentRow && handleKeyInput(e.target.value, cellIndex)}
                          disabled={rowIndex !== currentRow}
                        />
                      ))}
                    </div>
                  ))}
                  <Button 
                    onClick={checkGuess} 
                    className="w-full"
                    disabled={currentGuess.some(v => !v) || isGameWon || gameOver}
                  >
                    Submit Guess
                  </Button>
                  {gameOver && (
                    <div className="text-center mt-4">
                      <p className="text-xl font-bold">
                        {isGameWon ? 'Congratulations!' : `The solution was: ${solution}`}
                      </p>
                      <Button onClick={() => router.reload()} className="mt-2">
                        Play Again
                      </Button>
                    </div>
                  )}
                </div>
              ) : !gameOver ? (
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

export default withAuth(Game);