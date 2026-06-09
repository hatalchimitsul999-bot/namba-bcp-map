import { supabase } from "@/lib/supabaseClient";
import type { SupportRequest, SupportType, Urgency, SupportStatus } from "@/types";

type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSupportRequest(row: any): SupportRequest {
  return {
    id: row.id as number,
    disasterEventId: row.disaster_event_id as number,
    storeId: row.store_id as number,
    supportType: row.support_type as SupportType,
    urgency: row.urgency as Urgency,
    detail: (row.detail as string | null) ?? undefined,
    status: row.status as SupportStatus,
    assignedTo: (row.assigned_to as number | null) ?? undefined,
    createdBy: (row.created_by as number | null) ?? 0,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export async function fetchSupportRequestsByEventId(eventId: number): Promise<FetchResult<SupportRequest[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("disaster_event_id", eventId)
      .order("created_at");

    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapSupportRequest), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export async function fetchSupportRequestsByStoreAndEvent(
  storeId: number,
  eventId: number,
): Promise<FetchResult<SupportRequest[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("support_requests")
      .select("*")
      .eq("store_id", storeId)
      .eq("disaster_event_id", eventId)
      .order("created_at");

    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapSupportRequest), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export type SupportRequestInput = {
  disasterEventId: number;
  storeId: number;
  supportType: SupportType;
  urgency: Urgency;
  detail?: string;
};

export async function upsertSupportRequest(
  input: SupportRequestInput,
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { error: deleteError } = await supabase
      .from("support_requests")
      .delete()
      .eq("disaster_event_id", input.disasterEventId)
      .eq("store_id", input.storeId)
      .eq("status", "open");

    if (deleteError) return { error: deleteError.message };

    const { error } = await supabase.from("support_requests").insert({
      disaster_event_id: input.disasterEventId,
      store_id: input.storeId,
      support_type: input.supportType,
      urgency: input.urgency,
      detail: input.detail ?? null,
      status: "open",
    });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
