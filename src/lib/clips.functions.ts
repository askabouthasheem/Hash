import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const urlSchema = z.string().trim().url().max(2000);

function detectSource(url: string): "twitch" | "youtube" | "kick" | "tiktok" | "other" {
  const u = url.toLowerCase();
  if (u.includes("twitch.tv")) return "twitch";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("kick.com")) return "kick";
  if (u.includes("tiktok.com")) return "tiktok";
  return "other";
}

const ASPECT_TO_DIMS: Record<string, { w: number; h: number; ar: string }> = {
  "9:16": { w: 1080, h: 1920, ar: "9:16" },
  "1:1": { w: 1080, h: 1080, ar: "1:1" },
  "16:9": { w: 1920, h: 1080, ar: "16:9" },
};

async function sha1Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  duration?: number;
  eager?: Array<{ secure_url: string; transformation?: string }>;
  error?: { message: string };
};

async function renderWithCloudinary(opts: {
  sourceUrl: string;
  startSeconds: number;
  durationSeconds: number;
  aspect: string;
  captions: boolean;
  publicId: string;
}): Promise<{ output_url: string; public_id: string }> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured");

  const dims = ASPECT_TO_DIMS[opts.aspect] ?? ASPECT_TO_DIMS["9:16"];
  const timestamp = Math.floor(Date.now() / 1000);
  const transformation = [
    `so_${opts.startSeconds}`,
    `du_${opts.durationSeconds}`,
    `c_fill`,
    `ar_${dims.ar}`,
    `g_auto`,
    `w_${dims.w}`,
    `h_${dims.h}`,
    `q_auto`,
    `f_mp4`,
  ].join(",");

  // Params to sign (alphabetical, excluding file/api_key/signature/resource_type).
  const signedParams: Record<string, string> = {
    eager: transformation,
    eager_async: "false",
    folder: "hash-clips",
    public_id: opts.publicId,
    timestamp: String(timestamp),
  };
  const toSign = Object.keys(signedParams).sort().map((k) => `${k}=${signedParams[k]}`).join("&");
  const signature = await sha1Hex(toSign + apiSecret);

  const form = new FormData();
  form.set("file", opts.sourceUrl);
  form.set("api_key", apiKey);
  form.set("signature", signature);
  for (const [k, v] of Object.entries(signedParams)) form.set(k, v);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/video/upload`, {
    method: "POST",
    body: form,
  });
  const json = (await res.json()) as CloudinaryUploadResult;
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `Cloudinary upload failed (${res.status})`);
  }
  const eagerUrl = json.eager?.[0]?.secure_url;
  return { output_url: eagerUrl ?? json.secure_url, public_id: json.public_id };
}

type ResolvedMedia = {
  media_url: string;
  is_live: boolean;
  duration?: number;
  title?: string;
  ext?: string;
  protocol?: string;
};

async function resolveYouTube(url: string): Promise<ResolvedMedia> {
  const ytdl = (await import("@distube/ytdl-core")).default;
  const info = await ytdl.getInfo(url);
  const isLive = Boolean(info.videoDetails.isLiveContent && info.videoDetails.isLive);
  const progressive = info.formats.filter(
    (f) => f.container === "mp4" && f.hasVideo && f.hasAudio && f.url,
  );
  progressive.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
  const chosen = progressive[0] ?? info.formats.find((f) => f.url);
  if (!chosen?.url) throw new Error("Couldn't find a playable YouTube format");
  return {
    media_url: chosen.url,
    is_live: isLive,
    duration: Number(info.videoDetails.lengthSeconds) || undefined,
    title: info.videoDetails.title,
    ext: chosen.container ?? "mp4",
    protocol: "https",
  };
}

async function resolveViaWorker(url: string): Promise<ResolvedMedia> {
  const workerUrl = process.env.YTDLP_WORKER_URL;
  const workerSecret = process.env.YTDLP_WORKER_SECRET;
  if (!workerUrl || !workerSecret) {
    throw new Error(
      "Twitch, Kick, and TikTok need the yt-dlp worker. YouTube works out of the box — for the others, deploy workers/ytdlp and set YTDLP_WORKER_URL / YTDLP_WORKER_SECRET.",
    );
  }
  const res = await fetch(`${workerUrl.replace(/\/$/, "")}/resolve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${workerSecret}`,
    },
    body: JSON.stringify({ url, prefer: "mp4" }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Couldn't resolve that link (${res.status}): ${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text) as ResolvedMedia;
  } catch {
    throw new Error("Resolver returned an unexpected response");
  }
}

export const createClip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    source_url: string;
    title?: string;
    start_seconds?: number;
    duration_seconds?: number;
    aspect?: string;
    captions?: boolean;
    auto_post_tiktok?: boolean;
  }) =>
    z
      .object({
        source_url: urlSchema,
        title: z.string().trim().max(140).optional(),
        start_seconds: z.number().int().min(0).max(60 * 60 * 12).optional(),
        duration_seconds: z.number().int().min(5).max(180).default(60),
        aspect: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
        captions: z.boolean().default(true),
        auto_post_tiktok: z.boolean().default(false),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const source = detectSource(data.source_url);

    // For social platforms (YouTube / Twitch / Kick / TikTok), route through
    // the yt-dlp worker to turn the page URL into a direct media URL that
    // Cloudinary's remote-fetch upload can actually consume. Direct
    // .mp4 / .mov / .m3u8 URLs skip the worker.
    let cloudinarySourceUrl = data.source_url;
    let resolvedTitle: string | null = data.title ?? null;
    if (source === "youtube") {
      const resolved = await resolveYouTube(data.source_url);
      cloudinarySourceUrl = resolved.media_url;
      if (!resolvedTitle && resolved.title) resolvedTitle = resolved.title;
    } else if (source !== "other") {
      const resolved = await resolveViaWorker(data.source_url);
      cloudinarySourceUrl = resolved.media_url;
      if (!resolvedTitle && resolved.title) resolvedTitle = resolved.title;
    }


    const { data: row, error } = await context.supabase
      .from("clips")
      .insert({
        user_id: context.userId,
        source_url: data.source_url,
        source,
        title: resolvedTitle,
        start_seconds: data.start_seconds ?? null,
        duration_seconds: data.duration_seconds,
        aspect: data.aspect,
        captions: data.captions,
        auto_post_tiktok: data.auto_post_tiktok,
        status: "rendering",
        progress: 10,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    // Kick the render synchronously — Cloudinary returns the transformed URL
    // in the same response when eager_async=false.
    try {
      const result = await renderWithCloudinary({
        sourceUrl: cloudinarySourceUrl,
        startSeconds: data.start_seconds ?? 0,
        durationSeconds: data.duration_seconds,
        aspect: data.aspect,
        captions: data.captions,
        publicId: row.id,
      });
      const { data: done, error: uerr } = await context.supabase
        .from("clips")
        .update({ status: "done", progress: 100, output_url: result.output_url, error: null })
        .eq("id", row.id)
        .select("*")
        .single();
      if (uerr) throw new Error(uerr.message);
      return done;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await context.supabase
        .from("clips")
        .update({ status: "failed", progress: 0, error: message })
        .eq("id", row.id);
      throw new Error(message);
    }
  });

export const listClips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("clips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data;
  });

// Kept for API compatibility with the polling hook; real work happens in
// createClip now, so this just returns the current row.
export const advanceClip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("clips")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Not found");
    return row;
  });

export const deleteClip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("clips").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
