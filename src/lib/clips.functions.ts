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
    const { data: row, error } = await context.supabase
      .from("clips")
      .insert({
        user_id: context.userId,
        source_url: data.source_url,
        source,
        title: data.title ?? null,
        start_seconds: data.start_seconds ?? null,
        duration_seconds: data.duration_seconds,
        aspect: data.aspect,
        captions: data.captions,
        auto_post_tiktok: data.auto_post_tiktok,
        status: "queued",
        progress: 0,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
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

export const advanceClip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    // Simulated pipeline advance based on age of the row.
    const { data: row, error } = await context.supabase
      .from("clips")
      .select("id,status,created_at,source_url")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Not found");
    if (row.status === "done" || row.status === "failed") return row;

    const age = (Date.now() - new Date(row.created_at).getTime()) / 1000;
    let status: "queued" | "downloading" | "rendering" | "captioning" | "posting" | "done" = "queued";
    let progress = 0;
    if (age < 1.2) { status = "downloading"; progress = 15; }
    else if (age < 2.6) { status = "rendering"; progress = 45; }
    else if (age < 4.0) { status = "captioning"; progress = 75; }
    else if (age < 5.5) { status = "posting"; progress = 92; }
    else { status = "done"; progress = 100; }

    const patch: Record<string, unknown> = { status, progress };
    if (status === "done") {
      patch.output_url = `https://cdn.hash.local/clips/${row.id}.mp4`;
    }
    const { data: updated, error: uerr } = await context.supabase
      .from("clips")
      .update(patch)
      .eq("id", row.id)
      .select("*")
      .single();
    if (uerr) throw new Error(uerr.message);
    return updated;
  });

export const deleteClip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("clips").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
