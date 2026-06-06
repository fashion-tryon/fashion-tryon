"use client"

import { useRef, useState, useCallback } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  label: string
  sublabel?: string
  value: string | null
  onChange: (url: string | null) => void
  accept?: string
  compact?: boolean
  className?: string
}

export default function UploadZone({
  label,
  sublabel,
  value,
  onChange,
  accept = "image/png,image/jpeg,image/webp",
  compact = false,
  className,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return
      if (value) URL.revokeObjectURL(value)
      const url = URL.createObjectURL(file)
      onChange(url)
    },
    [value, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const item = Array.from(e.clipboardData.items).find((i) =>
        i.type.startsWith("image/")
      )
      if (item) {
        const file = item.getAsFile()
        if (file) handleFile(file)
      }
    },
    [handleFile]
  )

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value) URL.revokeObjectURL(value)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  if (value) {
    return (
      <div
        className={cn(
          "relative rounded-xl overflow-hidden border border-zinc-700 group bg-zinc-800",
          compact ? "h-28" : "h-48",
          className
        )}
      >
        <img
          src={value}
          alt={label}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-medium hover:bg-black/90 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium">
          {label}
        </div>
      </div>
    )
  }

  return (
    <div
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onPaste={handlePaste}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 cursor-pointer transition-all duration-200 outline-none",
        "hover:border-zinc-500 hover:bg-zinc-800/50",
        "focus-visible:ring-2 focus-visible:ring-green-500/50",
        isDragging && "drag-over",
        compact ? "h-28" : "h-48",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-zinc-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">{label}</p>
          {sublabel && <p className="text-xs text-zinc-500 mt-0.5">{sublabel}</p>}
          <p className="text-[10px] text-zinc-600 mt-1.5">
            Drop, paste, or{" "}
            <span className="text-green-500">browse</span>
          </p>
        </div>
      </div>
    </div>
  )
}
