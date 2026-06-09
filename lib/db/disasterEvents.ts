import { supabase } from "@/lib/supabaseClient";
import type { DisasterEvent } from "@/types";

export type MaybeResult<T> = { data: T | null; error: string | null };

export async function fetchActiveDisasterEvent(): Promise<MaybeResult<DisasterEvent>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("disaster_events")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: null };

    return {
      data: {
        id: data.id,
        name: data.name,
        eventType: data.event_type,
        targetArea: data.target_area,
        startedAt: data.started_at,
        endedAt: data.ended_at ?? undefined,
        status: data.status,
        memo: data.memo ?? undefined,
        createdBy: data.created_by ?? 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at ?? undefined,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
