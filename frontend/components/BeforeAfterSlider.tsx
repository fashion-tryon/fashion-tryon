"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BeforeAfterSliderProps {
  before: string
  after: string
  className?: string
  style?: React.CSSProperties
}

export default function BeforeAfterSlider({
  before,
  after,
  className,
  style,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(2, Math.min(98, x)))
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      updatePosition(e.clientX)
    },
    [updatePosition]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      updatePosition(e.touches[0].clientX)
    },
    [updatePosition]
  )

  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX)
    const handleTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX)
    const stop = () => setIsDragging(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", stop)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", stop)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", stop)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", stop)
    }
  }, [isDragging, updatePosition])

  return (
    <div
      ref={containerRef}
      className={cn("relative select-none overflow-hidden rounded-xl", className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ cursor: "col-resize", ...style }}
    >
      {/* After image (full) */}
      <img src={after} alt="After" className="w-full h-full object-cover" draggable={false} />

      {/* Before image clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${(100 / position) * 100}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="compare-handle"
        style={{ left: `${position}%` }}
      />

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium pointer-events-none">
        BEFORE
      </div>
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium pointer-events-none">
        AFTER
      </div>
    </div>
  )
}
