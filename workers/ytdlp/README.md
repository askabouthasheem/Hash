# hash-ytdlp

Tiny FastAPI worker that resolves a YouTube / Twitch / Kick / TikTok URL to
a direct media URL (MP4 for VODs, HLS `.m3u8` for livestreams) so
Cloudinary can transcode it into a 9:16 clip.

## Deploy to Railway (fastest)

1. Push this `workers/ytdlp/` folder to a new GitHub repo (or use the whole
   monorepo and set the root directory to `workers/ytdlp`).
2. On [railway.app](https://railway.app) → **New Project** → **Deploy from
   GitHub repo** → pick the repo/folder.
3. Add a service variable **`WORKER_SECRET`** — any long random string. Save
   the same string as `YTDLP_WORKER_SECRET` in Lovable.
4. Once the deploy is green, copy the public URL (e.g.
   `https://hash-ytdlp-production.up.railway.app`) and save it in Lovable as
   `YTDLP_WORKER_URL`.

## Deploy anywhere else

Any host that runs Python 3.11 + ffmpeg works (Fly.io, Modal, Render, a VPS):

```bash
pip install -r requirements.txt
WORKER_SECRET=xxxxx uvicorn main:app --host 0.0.0.0 --port 8080
```

## API

`POST /resolve`

```
Authorization: Bearer <WORKER_SECRET>
Content-Type: application/json

{ "url": "https://youtube.com/watch?v=...", "live": false, "prefer": "mp4" }
```

Response:

```json
{
  "media_url": "https://...",
  "is_live": false,
  "duration": 612.3,
  "title": "…",
  "ext": "mp4",
  "protocol": "https"
}
```

`GET /health` → `{ "ok": true }` (used by Railway healthcheck).
