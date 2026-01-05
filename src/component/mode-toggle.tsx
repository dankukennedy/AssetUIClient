import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative rounded-lg border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {/* Sun Icon: Rotates and fades out in Dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
      
      {/* Moon Icon: Rotates and fades in in Dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}