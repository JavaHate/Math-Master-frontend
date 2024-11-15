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

const Home: React.FC = () => {
  const [username, setUsername] = useState('')
  const [level, setLevel] = useState(5)
  const [totalScore, setTotalScore] = useState(1250)
  const [userId, setUserId] = useState('')
  const router = useRouter()

  useEffect (() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/user/id/' + localStorage.getItem('currentUserId'))
        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
          setUsername(data.username);
        } else {
          console.error('Failed to fetch data from the backend');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        window.location.href = '/auth/login';
      }
    };
    fetchUserId();
  }, [])

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
              <div className="text-2xl font-bold">#42</div>
              <p className="text-xs text-muted-foreground">Out of 1000 players</p>
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
      </main>
    </div>
  )
}

export default withAuth(Home);