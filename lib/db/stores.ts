import { supabase } from "@/lib/supabaseClient";
import type { Store } from "@/types";
import type { MaybeResult } from "./disasterEvents";

type FetchResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export async function fetchStores(): Promise<FetchResult<Store[]>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません（環境変数を確認してください）" };
  }

  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("id");

    if (error) return { data: null, error: error.message };

    const stores: Store[] = data.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      address: row.address,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      areaName: row.area_name,
      managerName: row.manager_name,
      phone: row.phone,
      email: row.email,
      note: row.note ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at ?? undefined,
    }));

    return { data: stores, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "不明なエラーが発生しました",
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStore(row: any): Store {
  return {
    id: row.id as number,
    name: row.name as string,
    category: row.category as string,
    address: row.address as string,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    areaName: row.area_name as string,
    managerName: row.manager_name as string,
    phone: row.phone as string,
    email: row.email as string,
    note: (row.note as string | null) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export async function fetchStoreById(id: number): Promise<MaybeResult<Store>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: null };
    return { data: mapStore(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
