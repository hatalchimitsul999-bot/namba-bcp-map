"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createProfile, type CreateProfileInput } from "@/lib/db/profiles";

export type SubmitNewUserInput = CreateProfileInput & { password: string };

export async function submitNewUser(
  input: SubmitNewUserInput,
): Promise<{ ok: boolean; error?: string; authSkipped?: boolean }> {
  if (!input.loginId.trim()) return { ok: false, error: "ログインIDを入力してください" };
  if (!input.email.trim()) return { ok: false, error: "メールアドレスを入力してください" };
  if (!input.name.trim()) return { ok: false, error: "表示名を入力してください" };
  if (!["admin", "store", "external"].includes(input.role)) {
    return { ok: false, error: "ロールを選択してください" };
  }
  if (input.role === "store" && !input.storeId) {
    return { ok: false, error: "店舗を選択してください" };
  }
  if (!input.password || input.password.length < 8) {
    return { ok: false, error: "パスワードは8文字以上で入力してください" };
  }

  // Step 1: Supabase Auth にユーザーを作成（サービスロールキーがある場合のみ）
  let authUserId: string | undefined;
  let authSkipped = false;

  if (supabaseAdmin) {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email.trim(),
        password: input.password,
        email_confirm: true,
      });

    if (authError) {
      const msg = authError.message;
      if (msg.includes("already been registered") || msg.includes("already exists")) {
        return { ok: false, error: "このメールアドレスは既に Supabase Auth に登録されています" };
      }
      return { ok: false, error: `Supabase Auth エラー: ${msg}` };
    }
    authUserId = authData.user?.id;
  } else {
    authSkipped = true;
  }

  // Step 2: profiles テーブルに登録
  const { error: profileError } = await createProfile({
    loginId: input.loginId.trim(),
    email: input.email.trim(),
    name: input.name.trim(),
    role: input.role,
    storeId: input.role === "store" ? input.storeId : undefined,
    authUserId,
  });

  if (profileError) {
    // Auth ユーザーを作成済みの場合はロールバック
    if (authUserId && supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    }
    return { ok: false, error: profileError };
  }

  revalidatePath("/admin/users");
  return { ok: true, authSkipped };
}
