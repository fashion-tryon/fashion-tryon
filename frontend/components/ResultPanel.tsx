"use client"

import { Download, RefreshCw, Layers, Wand2, ImageIcon } from "lucide-react"
import { useState } from "react"
import BeforeAfterSlider from "./BeforeAfterSlider"
import { cn } from "@/lib/utils"
import type { GenerateResult } from "@/lib/types"

interface ResultPanelProps {
  result: GenerateResult | null
  isGenerating: boolean
  onUseAsInput: (url: string) => void
}

export default function ResultPanel({
  result,
  isGenerating,
  onUseAsInput,
}: ResultPanelProps) {
  const [showComparison, setShowComparison] = useState(false)

  const handleDownload = () => {
    if (!result?.imageUrl) return
    const a = document.createElement("a")
    a.href = result.imageUrl
    a.download = `fashion-tryon-${Date.now()}.jpg`
    a.click()
  }

  /* ── Generating state ── */
  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl shimmer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-green-400 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-white font-medium">Generating your look…</p>
          <p className="text-zinc-500 text-sm">This usually takes 10–30 seconds</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  /* ── Has result ── */
  if (result) {
    const canCompare = result.originalUrl && result.originalUrl !== result.imageUrl

    return (
      <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
        {/* Image area */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          {showComparison && canCompare ? (
            <BeforeAfterSlider
              before={result.originalUrl!}
              after={result.imageUrl}
              className="max-h-full max-w-full"
              style={{ aspectRatio: "3/4", height: "100%", maxHeight: "calc(100vh - 200px)" } as React.CSSProperties}
            />
          ) : (
            <div className="relative group max-h-full" style={{ maxHeight: "calc(100vh - 200px)" }}>
              <img
                src={result.imageUrl}
                alt="Generated result"
                className="max-h-full max-w-full rounded-xl shadow-2xl shadow-black/60 object-contain"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="shrink-0 px-6 pb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {canCompare && (
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                  showComparison
                    ? "bg-green-500/15 text-green-400 border-green-500/30"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                )}
              >
                <Layers className="w-4 h-4" />
                {showComparison ? "Hide" : "Before / After"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUseAsInput(result.imageUrl)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Use as Input
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors shadow-lg shadow-green-900/30"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Empty state ── */
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center bg-zinc-950 gap-6 p-8">
      {/* Decorative grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-xs">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <ImageIcon className="w-7 h-7 text-zinc-600" />
        </div>
        <div>
          <p className="text-zinc-300 font-medium text-base">
            Your result will appear here
          </p>
          <p className="text-zinc-600 text-sm mt-1.5 leading-relaxed">
            Upload your images, configure settings,
            <br />
            then hit <span className="text-green-500 font-medium">Run</span> to generate
          </p>
        </div>

        {/* Feature hints */}
        <div className="grid grid-cols-2 gap-2 w-full mt-2">
          {[
            "Virtual try-on",
            "Product on model",
            "Clean packshots",
            "AI face swap",
          ].map((hint) => (
            <div
              key={hint}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs text-center"
            >
              {hint}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
