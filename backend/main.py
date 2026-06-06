"""
Fashion Try-On Studio — FastAPI Backend
Integrates IDM-VTON from HuggingFace for virtual try-on inference.

Step 1: This file is a complete stub — all endpoints are wired up and return
        dummy responses so the frontend can be tested end-to-end.

Step 2 (next): Replace the stub handlers with real IDM-VTON inference.
"""

import io
import time
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from PIL import Image, ImageFilter, ImageEnhance

app = FastAPI(title="Fashion Try-On Studio API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Shared model holder (populated when real model is loaded) ──────────────
_pipeline = None  # IDM-VTON pipeline goes here in Step 2


def _load_image(upload: UploadFile) -> Image.Image:
    data = upload.file.read()
    return Image.open(io.BytesIO(data)).convert("RGB")


def _to_bytes(img: Image.Image, fmt: str = "JPEG") -> bytes:
    buf = io.BytesIO()
    img.save(buf, format=fmt, quality=92)
    return buf.getvalue()


def _dummy_process(img: Image.Image) -> Image.Image:
    """Stub: apply a subtle filter to visually signal AI processing."""
    img = img.convert("RGB")
    # Slight warmth + sharpen to simulate post-processing
    img = ImageEnhance.Color(img).enhance(1.1)
    img = ImageEnhance.Sharpness(img).enhance(1.2)
    img = ImageEnhance.Brightness(img).enhance(1.05)
    return img


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": _pipeline is not None}


# ── Main generate endpoint ────────────────────────────────────────────────────
@app.post("/generate")
async def generate(
    feature: str = Form(...),
    model_image: UploadFile | None = File(None),
    garment_image: UploadFile | None = File(None),
    second_image: UploadFile | None = File(None),
    face_image: UploadFile | None = File(None),
    prompt: str = Form(""),
    background: str = Form("white-studio"),
    ratio: str = Form("3:4"),
    resolution: str = Form("1024"),
    mode: str = Form("balanced"),
    category: str = Form("auto"),
    gender: str = Form("female"),
    pose_style: str = Form("casual"),
):
    # Simulate processing time
    time.sleep(1.0)

    # ── Determine which image to use as the basis for the dummy result ──────
    base_img: Image.Image | None = None
    if model_image:
        base_img = _load_image(model_image)
    elif garment_image:
        base_img = _load_image(garment_image)
    elif second_image:
        base_img = _load_image(second_image)
    elif face_image:
        base_img = _load_image(face_image)

    if base_img is None:
        # Return a simple placeholder for text-only features (e.g. create-model)
        base_img = Image.new("RGB", (512, 682), color=(26, 26, 46))

    # ── Stub: apply dummy processing ────────────────────────────────────────
    result_img = _dummy_process(base_img)

    # ── In Step 2, swap the above with real IDM-VTON inference: ─────────────
    # if feature == "tryon" and model_image and garment_image:
    #     result_img = run_idm_vton(
    #         pipeline=_pipeline,
    #         person=_load_image(model_image),
    #         garment=_load_image(garment_image),
    #         category=category,
    #     )

    return Response(content=_to_bytes(result_img), media_type="image/jpeg")


# ── Model loading (called explicitly to avoid cold-start on import) ───────────
@app.on_event("startup")
async def on_startup():
    """
    In Step 2, load IDM-VTON here:

    from pipeline_idm_vton import TryonPipeline
    global _pipeline
    _pipeline = TryonPipeline.from_pretrained(
        "yisol/IDM-VTON",
        torch_dtype=torch.float16,
    ).to("cuda")
    """
    print("✓ Fashion Try-On Studio API ready (stub mode)")
    print("  Connect to http://localhost:8000")
    print("  Load IDM-VTON model in on_startup() to enable real inference")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
