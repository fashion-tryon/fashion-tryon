"use client"

import { useState, useCallback } from "react"
import Header from "@/components/Header"
import LeftPanel from "@/components/LeftPanel"
import ResultPanel from "@/components/ResultPanel"
import type { FeatureId, UploadSlots, Settings, GenerateResult } from "@/lib/types"
import { DEFAULT_SETTINGS } from "@/lib/types"

/* ── Dummy fashion image as base64 SVG (shown when no upload available) ── */
const DUMMY_RESULT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1067" viewBox="0 0 800 1067">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
    <linearGradient id="fig" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1067" fill="url(#bg)"/>
  <text x="400" y="420" font-family="sans-serif" font-size="80" fill="url(#fig)" text-anchor="middle">✦</text>
  <text x="400" y="520" font-family="sans-serif" font-size="22" fill="#4ade80" text-anchor="middle" font-weight="600">AI Generated Result</text>
  <text x="400" y="560" font-family="sans-serif" font-size="14" fill="#52525b" text-anchor="middle">Connect backend to see real output</text>
  <rect x="300" y="590" width="200" height="2" fill="#27272a" rx="1"/>
  <text x="400" y="630" font-family="sans-serif" font-size="12" fill="#3f3f46" text-anchor="middle">IDM-VTON · localhost:8000</text>
</svg>
`)}`

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>("tryon")
  const [uploads, setUploads] = useState<UploadSlots>({
    person: null,
    garment: null,
    reference: null,
    face: null,
  })
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)

  const setUpload = useCallback((key: keyof UploadSlots, url: string | null) => {
    setUploads((prev) => {
      if (prev[key] && prev[key] !== url) URL.revokeObjectURL(prev[key]!)
      return { ...prev, [key]: url }
    })
  }, [])

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }))
  }, [])

  /* ── Find the best "original" image for before/after comparison ── */
  const getPrimaryImage = (): string | null => {
    return uploads.person ?? uploads.garment ?? uploads.reference ?? uploads.face ?? null
  }

  /* ── Dummy generate: simulate API call with 2.5s delay ── */
  const handleRun = useCallback(async () => {
    setIsGenerating(true)
    setResult(null)

    const originalUrl = getPrimaryImage()

    // Simulate backend processing time
    await new Promise((r) => setTimeout(r, 2500))

    // Dummy result: use uploaded image (or SVG placeholder) as "after"
    // Apply a subtle CSS filter via canvas to visually differentiate before/after
    const resultImageUrl = originalUrl
      ? await applyDummyFilter(originalUrl)
      : DUMMY_RESULT_SVG

    setResult({
      imageUrl: resultImageUrl,
      originalUrl: originalUrl,
    })

    setIsGenerating(false)
  }, [uploads, settings, activeFeature])

  const handleUseAsInput = useCallback((url: string) => {
    setUpload("person", url)
    setResult(null)
  }, [setUpload])

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0">
        <LeftPanel
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          uploads={uploads}
          setUpload={setUpload}
          settings={settings}
          setSettings={setSettings}
          onRun={handleRun}
          isGenerating={isGenerating}
        />
        <ResultPanel
          result={result}
          isGenerating={isGenerating}
          onUseAsInput={handleUseAsInput}
          onSelectFeature={setActiveFeature}
        />
      </div>
    </div>
  )
}

/* ── Creates a visually distinct "processed" version of the uploaded image ── */
async function applyDummyFilter(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!

      // Draw original
      ctx.drawImage(img, 0, 0)

      // Apply subtle warm tone overlay to simulate AI processing
      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = "rgba(255, 240, 220, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add a slight brightness boost
      ctx.globalCompositeOperation = "screen"
      ctx.fillStyle = "rgba(100, 220, 120, 0.08)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "source-over"

      // Stamp watermark
      const pad = 12
      const label = "✦ AI Result"
      ctx.font = "bold 14px -apple-system, sans-serif"
      const textW = ctx.measureText(label).width + 16
      ctx.fillStyle = "rgba(0,0,0,0.55)"
      ctx.beginPath()
      ctx.roundRect(pad, pad, textW, 28, 6)
      ctx.fill()
      ctx.fillStyle = "#4ade80"
      ctx.fillText(label, pad + 8, pad + 19)

      resolve(canvas.toDataURL("image/jpeg", 0.92))
    }
    img.onerror = () => resolve(DUMMY_RESULT_SVG)
    img.src = imageUrl
  })
}
