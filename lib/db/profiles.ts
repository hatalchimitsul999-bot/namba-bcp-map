import { supabase } from "@/lib/supabaseClient";
import type { Profile, ProfileRole } from "@/types";
import type { MaybeResult } from "./disasterEvents";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Profile {
  return {
    id: row.id as number,
    authUserId: (row.auth_user_id as string | null) ?? undefined,
    loginId: row.login_id as string,
    email: row.email as string,
    role: row.role as ProfileRole,
    storeId: (row.store_id as number | null) ?? undefined,
    name: row.name as string,
    createdAt: row.created_at as string,
    updatedAt: (row.updated_at as string | null) ?? undefined,
  };
}

export async function fetchProfiles(): Promise<MaybeResult<Profile[]>> {
  if (!supabase) return { data: null, error: "Supabase クライアントが初期化されていません" };
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("id");
    if (error) return { data: null, error: error.message };
    return { data: data.map(mapRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

export type CreateProfileInput = {
  loginId: string;
  email: string;
  name: string;
  role: ProfileRole;
  storeId?: number;
  authUserId?: string;
};

export async function createProfile(
  input: CreateProfileInput,
): Promise<MaybeResult<Profile>> {
  if (!supabase) return { data: null, error: "Supabase クライアントが初期化されていません" };
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        login_id: input.loginId,
        email: input.email,
        name: input.name,
        role: input.role,
        store_id: input.storeId ?? null,
        auth_user_id: input.authUserId ?? null,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return { data: null, error: "このログインIDは既に使用されています" };
      return { data: null, error: error.message };
    }
    return { data: mapRow(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}

/**
 * login_id でプロフィールを検索する。
 * ログイン画面: ユーザー入力の login_id → このメソッドで email を取得 →
 * Supabase Auth の signInWithPassword(email, password) で認証する。
 */
export async function fetchProfileByLoginId(
  loginId: string,
): Promise<MaybeResult<Profile>> {
  if (!supabase) {
    return { data: null, error: "Supabase クライアントが初期化されていません" };
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("login_id", loginId)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    if (!data) return { data: null, error: null };
    return { data: mapRow(data), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
