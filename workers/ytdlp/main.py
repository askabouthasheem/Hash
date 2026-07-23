"""
Hash yt-dlp resolver worker.

Small FastAPI service that turns a YouTube / Twitch / Kick / TikTok URL
into a direct media URL (MP4 for VODs, HLS .m3u8 for livestreams) that
Cloudinary's remote-fetch upload can consume.

Deploy anywhere that runs Python 3.11 + ffmpeg. Railway config lives in
`railway.json` next to this file.

Auth: every request must send `Authorization: Bearer <YTDLP_WORKER_SECRET>`
matching the WORKER_SECRET env var. Requests without it get 401.

Env vars:
  WORKER_SECRET   required, shared with the Lovable backend
  PORT            optional, defaults to 8080 (Railway sets this)
"""

from __future__ import annotations

import os
from typing import Literal, Optional

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, HttpUrl
from yt_dlp import YoutubeDL

app = FastAPI(title="hash-ytdlp", version="1.0.0")

WORKER_SECRET = os.environ.get("WORKER_SECRET", "").strip()


class ResolveIn(BaseModel):
    url: HttpUrl
    live: bool = False
    prefer: Literal["mp4", "hls"] = "mp4"


class ResolveOut(BaseModel):
    media_url: str
    is_live: bool
    duration: Optional[float] = None
    title: Optional[str] = None
    ext: Optional[str] = None
    protocol: Optional[str] = None


def _check_auth(authorization: Optional[str]) -> None:
    if not WORKER_SECRET:
        raise HTTPException(500, "Worker not configured: WORKER_SECRET missing")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    if authorization.removeprefix("Bearer ").strip() != WORKER_SECRET:
        raise HTTPException(401, "Invalid bearer token")


def _pick_format(info: dict, prefer: str) -> dict:
    """Return the best format matching preference, falling back gracefully."""
    formats = info.get("formats") or []
    # Live streams almost always come out as HLS/m3u8; honour that first.
    if info.get("is_live"):
        for f in formats:
            if f.get("protocol") in ("m3u8", "m3u8_native") and f.get("url"):
                return f
    if prefer == "mp4":
        mp4s = [
            f for f in formats
            if f.get("ext") == "mp4" and f.get("vcodec") != "none" and f.get("acodec") != "none" and f.get("url")
        ]
        if mp4s:
            return max(mp4s, key=lambda f: f.get("height") or 0)
    # Fall back to whatever yt-dlp thinks is best.
    if info.get("url"):
        return {"url": info["url"], "ext": info.get("ext"), "protocol": info.get("protocol")}
    if formats:
        return formats[-1]
    raise HTTPException(422, "No playable format found")


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/resolve", response_model=ResolveOut)
def resolve(body: ResolveIn, authorization: Optional[str] = Header(None)) -> ResolveOut:
    _check_auth(authorization)

    ydl_opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
        "noplaylist": True,
        # Prefer progressive mp4 for VODs; live falls through in _pick_format.
        "format": "best[ext=mp4][vcodec!=none][acodec!=none]/best",
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(str(body.url), download=False)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(422, f"yt-dlp failed: {e}") from e

    if not info:
        raise HTTPException(422, "No info returned")

    fmt = _pick_format(info, body.prefer)
    media_url = fmt.get("url")
    if not media_url:
        raise HTTPException(422, "Resolved format has no URL")

    return ResolveOut(
        media_url=media_url,
        is_live=bool(info.get("is_live")),
        duration=info.get("duration"),
        title=info.get("title"),
        ext=fmt.get("ext") or info.get("ext"),
        protocol=fmt.get("protocol") or info.get("protocol"),
    )
