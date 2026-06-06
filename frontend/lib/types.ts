export type FeatureId =
  | "tryon"
  | "product-to-model"
  | "packshot"
  | "model-swap"
  | "face-swap"
  | "edit"
  | "create-model"
  | "image-to-video"

export interface UploadSlots {
  person: string | null
  garment: string | null
  reference: string | null
  face: string | null
}

export interface Settings {
  prompt: string
  background: string
  ratio: string
  resolution: string
  mode: string
  category: string
  gender: string
  poseStyle: string
}

export interface GenerateResult {
  imageUrl: string
  videoUrl?: string
  originalUrl: string | null
}

export const DEFAULT_SETTINGS: Settings = {
  prompt: "",
  background: "white-studio",
  ratio: "3:4",
  resolution: "1024",
  mode: "balanced",
  category: "auto",
  gender: "female",
  poseStyle: "casual",
}

export const BACKGROUNDS = [
  { value: "white-studio", label: "White Studio" },
  { value: "outdoor", label: "Outdoor" },
  { value: "festive", label: "Festive" },
  { value: "plain", label: "Plain" },
  { value: "custom", label: "Custom" },
]

export const RATIOS = ["1:1", "3:4", "4:3", "16:9"]
export const RESOLUTIONS = ["512", "768", "1024"]
export const MODES = ["quality", "balanced", "fast"]
