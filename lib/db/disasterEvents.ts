import { supabase } from "@/lib/supabaseClient";
import type { DisasterEvent } from "@/types";

export type MaybeResult<T> = { data: T | null; error: string | null };

function mapRow(row: Record<string, unknown>): DisasterEvent {
  return {
    id: row.id as number,
    name: row.name as string,
    eventType: row.event_type as string,
    targetArea: row.target_area as string,
    startedAt: row.started_at as string,
    endedAt: (row.ended_at as string | null) ?? undefined,
    status: row.status as DisasterEvent["status"],
    memo: (row.memo as string | null) ?? undefined,
    createdBy: (row.created_by as number | null) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export type CreateDisasterEventInput = {
  name: string;
  eventType: string;
  targetArea: string;
  memo?: string;
};

export async function createDisasterEvent(
  input: CreateDisasterEventInput,
): Promise<MaybeResult<DisasterEvent>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("disaster_events")
      .insert({
        name: input.name,
        event_type: input.eventType,
        target_area: input.targetArea,
        started_at: now,
        status: "active",
        memo: input.memo ?? null,
        created_by: null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: mapRow(data as Record<string, unknown>), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export async function closeDisasterEvent(id: number): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { error } = await supabase
      .from("disaster_events")
      .update({
        status: "closed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

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

    return { data: mapRow(data as Record<string, unknown>), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
