import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured = supabaseUrl !== "" && supabaseAnonKey !== "";

if (!isConfigured) {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL または NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません。" +
      ".env.local を確認してください。"
  );
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type ConnectionResult = { ok: true } | { ok: false; error: string };

export async function checkSupabaseConnection(): Promise<ConnectionResult> {
  if (!supabase) {
    return { ok: false, error: "Supabase クライアントが初期化されていません（環境変数未設定）" };
  }
  try {
    const { error } = await supabase.from("stores").select("id").limit(1);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "不明な接続エラー",
    };
  }
}
