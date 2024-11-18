import Image from "next/image"
import localFont from "next/font/local"
import Header from "@/components/Header"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Clock, InfinityIcon, Settings, Trophy, User } from "lucide-react"
import { useRouter } from 'next/router'
import withAuth from "@/components/WithAuth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

interface Game {
  id: string;
  gameMode: string;
  score: number;
  startTime: string;
  userId: string;
  username?: string;
}

const Home: React.FC = () => {
  const [username, setUsername] = useState('')
  const [level, setLevel] = useState(5)
  const [totalScore, setTotalScore] = useState(1250)
  const [userId, setUserId] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const [rank, setRank] = useState(0)
  const router = useRouter()

  const fetchUserId = async () => {
    try {
      const response = await fetch('/api/user/id/' + localStorage.getItem('currentUserId'))
      if (response.ok) {
        const data = await response.json()
        setUserId(data.id)
        setUsername(data.username)
      } else {
        console.error('Failed to fetch data from the backend')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      window.location.href = '/auth/login'
    }
  }

  const fetchUsername = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/id/${userId}`)
      if (response.ok) {
        const data = await response.json()
        return data.username
      } else {
        console.error('Failed to fetch username from the backend')
        return 'Unknown'
      }
    } catch (error) {
      console.error('Error fetching username:', error)
      return 'Unknown'
    }
  }

  const calculateUserStats = (games: Game[], currentUserId: string) => {
    if (!currentUserId || !games.length) return;

    // Calculate total score from all user's games
    const userGames = games.filter(game => game.userId === currentUserId);
    const userTotalScore = userGames.reduce((sum, game) => sum + game.score, 0);
    setTotalScore(userTotalScore);

    // Calculate level (score / 10)
    const calculatedLevel = Math.floor(userTotalScore / 10);
    setLevel(calculatedLevel || 0);

    // Calculate user ranking
    const userScores = new Map<string, number>();
    games.forEach(game => {
      const currentScore = userScores.get(game.userId) || 0;
      userScores.set(game.userId, currentScore + game.score);
    });

    // Convert to array and sort by score
    const rankings = Array.from(userScores.entries())
      .sort(([, a], [, b]) => b - a);
    
    // Find user's rank (1-based index)
    const userRank = rankings.findIndex(([id]) => id === currentUserId) + 1;
    setRank(userRank || 0);
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/game/all')
      if (response.ok) {
        const data = await response.json()
        const gamesWithUsernames = await Promise.all(data.map(async (game: Game) => {
          const username = await fetchUsername(game.userId)
          return { ...game, username }
        }))
        setGames(gamesWithUsernames)
      } else {
        console.error('Failed to fetch games data from the backend')
      }
    } catch (error) {
      console.error('Error fetching games data:', error)
    }
  }

  useEffect(() => {
    if (userId && games.length > 0) {
      calculateUserStats(games, userId);
    }
  }, [userId, games]);

  useEffect(() => {
    fetchUserId();
    fetchGames();
  }, []);

  const handleStartGame = (mode: string) => {
    router.push(`/game?mode=${mode}&userId=${userId}`)
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
      <Header />
      <main className="container mx-auto px-4">
        <h1 className="text-[#22333B] font-semibold text-5xl max-w-lg mx-auto pt-8 text-center mt-20">
          Welcome to MathMaster, {username}!
        </h1>
        <p className="text-center mt-4 text-xl text-gray-600 font-mono">
          Ready to challenge your math skills?
        </p>
        
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{level}</div>
              <p className="text-xs text-muted-foreground">Keep practicing to level up!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Score</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScore}</div>
              <p className="text-xs text-muted-foreground">Across all game modes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ranking</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{rank}</div>
              <p className="text-xs text-muted-foreground">
                Out of {games.length > 0 ? new Set(games.map(g => g.userId)).size : 0} players
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="game-modes" className="mt-12">
          <TabsList className="mx-auto">
            <TabsTrigger value="game-modes">Game Modes</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="game-modes" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Time Trial</CardTitle>
                  <CardDescription>Race against the clock!</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => handleStartGame('time-trial')}>
                    <Clock className="mr-2 h-4 w-4" /> Start Time Trial
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Endless Challenge</CardTitle>
                  <CardDescription>How long can you last?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => handleStartGame('endless')}>
                    <InfinityIcon className="mr-2 h-4 w-4" /> Start Endless Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="statistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>View your performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                  [Placeholder for statistics chart]
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 flex justify-center space-x-4">
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" /> Profile
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center">Games Played</h2>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Game ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{game.username}</TableCell>
                  <TableCell>{game.gameMode}</TableCell>
                  <TableCell>{game.score}</TableCell>
                  <TableCell>{new Date(game.startTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

export default withAuth(Home)