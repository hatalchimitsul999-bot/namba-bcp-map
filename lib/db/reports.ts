import { supabase } from "@/lib/supabaseClient";
import type { Report, SafetyStatus, BusinessStatus, DamageItemName } from "@/types";
import type { MaybeResult } from "./disasterEvents";

type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Report {
  const rawItems: any[] = row.report_damage_items ?? [];
  const damageItems = rawItems.map((d) => ({
    id: d.id as number,
    reportId: row.id as number,
    damageItemId: 0,
    damageItemName: d.item_name as DamageItemName,
    createdAt: d.created_at as string,
  }));

  return {
    id: row.id as number,
    disasterEventId: row.disaster_event_id as number,
    storeId: row.store_id as number,
    safetyStatus: row.safety_status as SafetyStatus,
    businessStatus: row.business_status as BusinessStatus,
    hasDamage: row.has_damage as boolean,
    damageItems,
    hasSupportRequest: row.has_support_request as boolean,
    memo: (row.memo as string | null) ?? undefined,
    isProxy: row.is_proxy as boolean,
    proxyMethod: (row.proxy_method as string | null) ?? undefined,
    reportedBy: (row.reported_by as number | null) ?? 0,
    reportedAt: row.reported_at as string,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

// 管理者一覧用（damage items は含まない — リスト表示では不要）
export async function fetchReportsByEventId(eventId: number): Promise<FetchResult<Report[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("disaster_event_id", eventId)
      .order("reported_at");

    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

// 店舗・詳細画面用（damage items を JOIN して取得）
export async function fetchReportByStoreAndEvent(
  storeId: number,
  eventId: number,
): Promise<MaybeResult<Report>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*, report_damage_items(id, item_name, created_at)")
      .eq("store_id", storeId)
      .eq("disaster_event_id", eventId)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: null };
    return { data: mapRow(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export type ReportInput = {
  disasterEventId: number;
  storeId: number;
  safetyStatus: SafetyStatus;
  businessStatus: BusinessStatus;
  hasDamage: boolean;
  hasSupportRequest: boolean;
  memo?: string;
  isProxy: boolean;
  proxyMethod?: string;
  reportedAt: string;
};

// レポートを upsert し、保存したレポートの ID を返す
export async function upsertReport(
  input: ReportInput,
): Promise<{ data: number | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("reports")
      .upsert(
        {
          disaster_event_id: input.disasterEventId,
          store_id: input.storeId,
          safety_status: input.safetyStatus,
          business_status: input.businessStatus,
          has_damage: input.hasDamage,
          has_support_request: input.hasSupportRequest,
          memo: input.memo ?? null,
          is_proxy: input.isProxy,
          proxy_method: input.proxyMethod ?? null,
          reported_by: null,
          reported_at: input.reportedAt,
        },
        { onConflict: "disaster_event_id,store_id" },
      )
      .select("id")
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data.id as number, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
