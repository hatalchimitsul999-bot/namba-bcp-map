import { supabase } from "@/lib/supabaseClient";
import type { Notification, NotificationTargetType, NotificationStatus } from "@/types";
import type { MaybeResult } from "./disasterEvents";

type FetchResult<T> = { data: T; error: null } | { data: null; error: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Notification {
  return {
    id: row.id as number,
    disasterEventId: (row.disaster_event_id as number | null) ?? undefined,
    title: row.title as string,
    body: row.body as string,
    targetType: row.target_type as NotificationTargetType,
    status: row.status as NotificationStatus,
    createdBy: (row.created_by as number | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export async function fetchNotifications(): Promise<FetchResult<Notification[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export async function fetchNotificationsByEventId(
  eventId: number,
): Promise<FetchResult<Notification[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("disaster_event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export type CreateNotificationInput = {
  disasterEventId?: number;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  status: NotificationStatus;
};

export async function createNotification(
  input: CreateNotificationInput,
): Promise<MaybeResult<Notification>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        disaster_event_id: input.disasterEventId ?? null,
        title: input.title,
        body: input.body,
        target_type: input.targetType,
        status: input.status,
        created_by: null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: mapRow(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export async function updateNotificationStatus(
  id: number,
  status: NotificationStatus,
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ status })
      .eq("id", id);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
