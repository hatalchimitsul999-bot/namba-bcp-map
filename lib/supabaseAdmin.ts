import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const isConfigured = supabaseUrl !== "" && serviceRoleKey !== "";

if (!isConfigured && process.env.NODE_ENV !== "test") {
  console.warn(
    "[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY が設定されていません。" +
      "ユーザー作成時に Supabase Auth への自動登録がスキップされます。"
  );
}

// サービスロールキーはサーバーサイドのみで使用すること。
// クライアントに公開しないように "use server" のファイルからのみ import する。
export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
