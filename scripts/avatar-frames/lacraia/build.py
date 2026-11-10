"""Render the Lacraia frame (lacraia.html) into the assets the component plays.

Needs Python with `playwright` and `pillow`, and Google Chrome. From the repository root:

    python3 scripts/avatar-frames/lacraia/build.py

Writes src/assets/avatar-frames/lacraia/crawl.webp (the animated loop) and still.webp (the frame
shown whenever the avatar must not move).
"""
import base64
import io
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parents[2] / "src/assets/avatar-frames/lacraia"
SIZE = 460
STILL_FRAME = 56

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": SIZE, "height": SIZE})
    page.goto(f"{(HERE / 'lacraia.html').as_uri()}?size={SIZE}&shadow=0")
    info = page.evaluate("window.LACRAIA")
    frames = []
    for i in range(info["FRAMES"]):
        data = page.evaluate("(i) => window.renderFrame(i)", i)
        frames.append(Image.open(io.BytesIO(base64.b64decode(data.split(",")[1]))).convert("RGBA"))
    browser.close()

ASSETS.mkdir(parents=True, exist_ok=True)
frames[0].save(
    ASSETS / "crawl.webp",
    save_all=True,
    append_images=frames[1:],
    duration=round(1000 / info["FPS"]),
    loop=0,
    quality=70,
    alpha_quality=70,
    method=6,
    minimize_size=True,
)
frames[STILL_FRAME].save(ASSETS / "still.webp", quality=82, alpha_quality=85, method=6)
print(f"{len(frames)} frames, {info['LOOP']:.2f}s -> {ASSETS}")
