import { supabase } from "@/lib/supabaseClient";
import type { Profile, ProfileRole } from "@/types";

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

/**
 * 現在ログイン中のユーザーの profile を返す（クライアントサイド専用）。
 * Supabase Auth セッションのメールアドレスで profiles テーブルを照合する。
 * セッションがない・profile がない場合は null を返す。
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.email) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", session.user.email)
      .maybeSingle();

    if (error || !data) return null;
    return mapRow(data);
  } catch {
    return null;
  }
}
