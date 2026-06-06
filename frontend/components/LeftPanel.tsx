"use client"

import { useState } from "react"
import {
  Shirt,
  Package,
  Camera,
  Users,
  Scan,
  Wand2,
  Sparkles,
  Video,
  ChevronRight,
  Zap,
  Scale,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import UploadZone from "./UploadZone"
import type { FeatureId, Settings, UploadSlots } from "@/lib/types"
import { BACKGROUNDS, RATIOS, RESOLUTIONS } from "@/lib/types"

const FEATURES: { id: FeatureId; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "tryon", label: "Try-On", icon: Shirt, desc: "Dress a person with any garment" },
  { id: "product-to-model", label: "Product to Model", icon: Package, desc: "Place product on AI model" },
  { id: "packshot", label: "Packshot", icon: Camera, desc: "Clean product photography" },
  { id: "model-swap", label: "Model Swap", icon: Users, desc: "Swap the model in a photo" },
  { id: "face-swap", label: "Face Swap", icon: Scan, desc: "Replace face with reference" },
  { id: "edit", label: "Edit", icon: Wand2, desc: "Edit image with a prompt" },
  { id: "create-model", label: "Create Model", icon: Sparkles, desc: "Generate AI fashion model" },
  { id: "image-to-video", label: "Image to Video", icon: Video, desc: "Animate a fashion image" },
]

const EDIT_CHIPS = [
  "Change background",
  "Change color",
  "Add accessories",
  "Change lighting",
  "Remove wrinkles",
  "Enhance fabric",
]

const MOTION_TYPES = ["Subtle", "Dynamic", "Runway Walk", "Pose Change"]
const DURATIONS = ["2s", "4s", "8s"]
const GENDER_OPTIONS = ["Female", "Male", "Non-binary"]
const POSE_OPTIONS = ["Casual", "Professional", "Dynamic", "Editorial"]
const PACKSHOT_BG = ["White Studio", "Gradient", "Floating", "Shadow Floor"]
const MODEL_STYLES = ["Fashion", "Lifestyle", "Editorial", "Street"]

interface LeftPanelProps {
  activeFeature: FeatureId
  setActiveFeature: (f: FeatureId) => void
  uploads: UploadSlots
  setUpload: (key: keyof UploadSlots, url: string | null) => void
  settings: Settings
  setSettings: (s: Partial<Settings>) => void
  onRun: () => void
  isGenerating: boolean
}

export default function LeftPanel({
  activeFeature,
  setActiveFeature,
  uploads,
  setUpload,
  settings,
  setSettings,
  onRun,
  isGenerating,
}: LeftPanelProps) {
  const [extraSettings, setExtraSettings] = useState({
    category: "auto",
    gender: "female",
    poseStyle: "casual",
    motionType: "subtle",
    duration: "4s",
    packshotBg: "white-studio",
    modelStyle: "fashion",
  })

  const setExtra = (k: string, v: string) =>
    setExtraSettings((p) => ({ ...p, [k]: v }))

  const FeatureInputs = () => {
    switch (activeFeature) {
      case "tryon":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Person Photo"
              sublabel="Full body, front facing"
              value={uploads.person}
              onChange={(url) => setUpload("person", url)}
            />
            <UploadZone
              label="Garment Image"
              sublabel="Flat lay or on hanger"
              value={uploads.garment}
              onChange={(url) => setUpload("garment", url)}
            />
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Auto", "Tops", "Bottoms", "One-pieces", "Outerwear"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setExtra("category", c.toLowerCase())}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      extraSettings.category === c.toLowerCase()
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "product-to-model":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Garment / Product Image"
              sublabel="Flat lay, hanger, or packshot"
              value={uploads.garment}
              onChange={(url) => setUpload("garment", url)}
            />
            <PillGroup
              label="Gender"
              options={GENDER_OPTIONS}
              value={extraSettings.gender}
              onChange={(v) => setExtra("gender", v)}
            />
            <PillGroup
              label="Pose Style"
              options={POSE_OPTIONS}
              value={extraSettings.poseStyle}
              onChange={(v) => setExtra("poseStyle", v)}
            />
          </div>
        )

      case "packshot":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Product Image"
              sublabel="Any product on any background"
              value={uploads.reference}
              onChange={(url) => setUpload("reference", url)}
            />
            <PillGroup
              label="Packshot Background"
              options={PACKSHOT_BG}
              value={extraSettings.packshotBg}
              onChange={(v) => setExtra("packshotBg", v)}
            />
          </div>
        )

      case "model-swap":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Fashion Photo"
              sublabel="Source image with model"
              value={uploads.person}
              onChange={(url) => setUpload("person", url)}
            />
            <UploadZone
              label="New Model Reference"
              sublabel="Photo of the replacement model"
              value={uploads.reference}
              onChange={(url) => setUpload("reference", url)}
            />
          </div>
        )

      case "face-swap":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Source Image"
              sublabel="Image whose face to replace"
              value={uploads.person}
              onChange={(url) => setUpload("person", url)}
            />
            <UploadZone
              label="Face Reference"
              sublabel="Clear frontal face photo"
              value={uploads.face}
              onChange={(url) => setUpload("face", url)}
            />
          </div>
        )

      case "edit":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Image to Edit"
              value={uploads.person}
              onChange={(url) => setUpload("person", url)}
            />
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
                Quick Prompts
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EDIT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() =>
                      setSettings({ prompt: chip })
                    }
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs transition-colors border",
                      settings.prompt === chip
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "create-model":
        return (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
                Model Description
              </label>
              <textarea
                value={settings.prompt}
                onChange={(e) => setSettings({ prompt: e.target.value })}
                placeholder="Describe the model: age, ethnicity, hair, body type, expression…"
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/30 transition-colors"
              />
            </div>
            <PillGroup
              label="Style"
              options={MODEL_STYLES}
              value={extraSettings.modelStyle}
              onChange={(v) => setExtra("modelStyle", v)}
            />
            <PillGroup
              label="Gender"
              options={GENDER_OPTIONS}
              value={extraSettings.gender}
              onChange={(v) => setExtra("gender", v)}
            />
          </div>
        )

      case "image-to-video":
        return (
          <div className="space-y-3">
            <UploadZone
              label="Fashion Image"
              sublabel="High quality fashion photo"
              value={uploads.person}
              onChange={(url) => setUpload("person", url)}
            />
            <PillGroup
              label="Motion Type"
              options={MOTION_TYPES}
              value={extraSettings.motionType}
              onChange={(v) => setExtra("motionType", v)}
            />
            <PillGroup
              label="Duration"
              options={DURATIONS}
              value={extraSettings.duration}
              onChange={(v) => setExtra("duration", v)}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <aside className="w-[360px] shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800 overflow-hidden">
      {/* Feature tabs */}
      <div className="px-3 pt-3 pb-2 border-b border-zinc-800/60">
        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest px-1 mb-2">
          Features
        </p>
        <div className="space-y-0.5">
          {FEATURES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFeature(id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all group text-left",
                activeFeature === id
                  ? "bg-green-500/10 text-green-300 border border-green-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  activeFeature === id ? "text-green-400" : "text-zinc-600 group-hover:text-zinc-400"
                )}
              />
              <span className="font-medium">{label}</span>
              {activeFeature === id && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-green-500/60" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 min-h-0">
        {/* Feature-specific inputs */}
        <div>
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest mb-2.5">
            Inputs
          </p>
          <FeatureInputs />
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800" />

        {/* Settings */}
        <div className="space-y-3.5">
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
            Settings
          </p>

          {/* Prompt (hidden for create-model which has its own textarea above) */}
          {activeFeature !== "create-model" && (
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Image Prompt</label>
              <input
                type="text"
                value={settings.prompt}
                onChange={(e) => setSettings({ prompt: e.target.value })}
                placeholder="Describe the output style…"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/30 transition-colors"
              />
            </div>
          )}

          {/* Background */}
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Background</label>
            <select
              value={settings.background}
              onChange={(e) => setSettings({ background: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-green-500/50 appearance-none"
            >
              {BACKGROUNDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Aspect Ratio</label>
            <div className="flex gap-1.5">
              {RATIOS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSettings({ ratio: r })}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    settings.ratio === r
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Resolution</label>
            <div className="flex gap-1.5">
              {RESOLUTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSettings({ resolution: r })}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    settings.resolution === r
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                  )}
                >
                  {r}px
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Mode</label>
            <div className="flex gap-1.5">
              {[
                { value: "quality", label: "Quality", icon: Award },
                { value: "balanced", label: "Balanced", icon: Scale },
                { value: "fast", label: "Fast", icon: Zap },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSettings({ mode: value })}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-colors",
                    settings.mode === value
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Run button — pinned to bottom */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900 shrink-0">
        <button
          onClick={onRun}
          disabled={isGenerating}
          className={cn(
            "relative w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden",
            isGenerating
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-900/40 active:scale-[0.98] pulse-green"
          )}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Run Generation
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}

/* ── Reusable pill group ── */
function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt.toLowerCase())}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
              value === opt.toLowerCase()
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
