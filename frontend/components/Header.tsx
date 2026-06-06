"use client"

import { Sparkles, ExternalLink, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

export default function Header() {
  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shrink-0 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/30">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white tracking-tight text-[15px]">
          Fashion Try-On Studio
        </span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/20 ml-1">
          BETA
        </span>
      </div>

      <div className="flex items-center gap-3 text-zinc-400">
        <span className="text-xs hidden sm:block">Powered by IDM-VTON</span>
        <div className="h-4 w-px bg-zinc-700" />
        <a
          href="https://github.com/yisol/IDM-VTON"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-200 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
        <div className="h-4 w-px bg-zinc-700" />
        <ThemeToggle />
      </div>
    </header>
  )
}
