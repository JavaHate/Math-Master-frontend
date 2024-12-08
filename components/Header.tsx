import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

export default function Header() {
  const { setTheme, theme } = useTheme()

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">MathMaster</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/auth/login" className="text-sm font-medium hover:underline">
              Log in
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="ml-4"
            >
              <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}