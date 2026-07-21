import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { advanceClip, createClip, deleteClip, listClips } from "@/lib/clips.functions";

export type ClipRow = Awaited<ReturnType<typeof listClips>>[number];

const TERMINAL = new Set(["done", "failed"]);

export function useClips() {
  const list = useServerFn(listClips);
  const create = useServerFn(createClip);
  const advance = useServerFn(advanceClip);
  const remove = useServerFn(deleteClip);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["clips"],
    queryFn: () => list(),
    refetchOnWindowFocus: false,
  });

  // Poll advance for any in-flight clip.
  useEffect(() => {
    const inflight = (query.data ?? []).filter((c) => !TERMINAL.has(c.status));
    if (inflight.length === 0) return;
    const t = setInterval(async () => {
      try {
        await Promise.all(inflight.map((c) => advance({ data: { id: c.id } })));
        qc.invalidateQueries({ queryKey: ["clips"] });
      } catch {
        /* ignore */
      }
    }, 900);
    return () => clearInterval(t);
  }, [query.data, advance, qc]);

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createClip>[0]["data"]) => create({ data: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clips"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clips"] }),
  });

  return {
    clips: query.data ?? [],
    isLoading: query.isLoading,
    createClip: createMutation.mutateAsync,
    creating: createMutation.isPending,
    deleteClip: deleteMutation.mutateAsync,
  };
}
