import { supabase } from "@/lib/supabaseClient";
import type { EmergencyContact } from "@/types";
import type { MaybeResult } from "./disasterEvents";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): EmergencyContact {
  return {
    id: row.id as number,
    storeId: row.store_id as number,
    contactName: row.contact_name as string,
    relation: row.relation as string,
    phone: row.phone as string,
    email: (row.email as string | null) ?? undefined,
    priority: row.priority as number,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export async function fetchEmergencyContactsByStoreId(
  storeId: number,
): Promise<MaybeResult<EmergencyContact[]>> {
  if (!supabase) return { data: null, error: "Supabase クライアントが初期化されていません" };
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("store_id", storeId)
      .order("priority");
    if (error) return { data: null, error: error.message };
    return { data: (data ?? []).map(mapRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export type CreateContactInput = {
  storeId: number;
  contactName: string;
  relation: string;
  phone: string;
  email?: string;
  priority?: number;
};

export async function createEmergencyContact(
  input: CreateContactInput,
): Promise<MaybeResult<EmergencyContact>> {
  if (!supabase) return { data: null, error: "Supabase クライアントが初期化されていません" };
  try {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert({
        store_id: input.storeId,
        contact_name: input.contactName,
        relation: input.relation,
        phone: input.phone,
        email: input.email ?? null,
        priority: input.priority ?? 1,
      })
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data: mapRow(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export async function deleteEmergencyContact(
  id: number,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase クライアントが初期化されていません" };
  try {
    const { error } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("id", id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
