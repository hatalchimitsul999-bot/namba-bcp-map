"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { fetchProfileByLoginId } from "@/lib/db/profiles";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    if (!loginId.trim()) {
      setError("ログインIDを入力してください");
      return;
    }
    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    startTransition(async () => {
      // Step 1: login_id → profile (email を取得)
      const { data: profile, error: profileError } = await fetchProfileByLoginId(loginId.trim());

      if (profileError) {
        setError("ログイン処理中にエラーが発生しました");
        return;
      }
      if (!profile) {
        setError("ログインIDが見つかりません");
        return;
      }

      // Step 2: email + password で Supabase Auth 認証
      if (!supabase) {
        setError("認証サービスに接続できません（環境変数を確認してください）");
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (authError) {
        setError(
          authError.message.includes("Invalid login credentials")
            ? "パスワードが正しくありません"
            : "ログインに失敗しました"
        );
        return;
      }

      // Step 3: role に応じてリダイレクト
      if (profile.role === "store") {
        if (profile.storeId) {
          try {
            localStorage.setItem("current_store_id", String(profile.storeId));
          } catch {
            // ignore storage errors
          }
        }
        router.push("/store");
      } else {
        // admin / external
        router.push("/admin");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-white text-2xl font-bold">難波商店街</h1>
          <p className="text-red-200 text-sm mt-1">BCPマップシステム</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-gray-800 font-bold text-lg mb-5 text-center">ログイン</h2>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ログインID
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={isPending}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                placeholder="例: admin001"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                className={`w-full rounded-lg px-3 py-3 pr-10 text-base text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 border ${
                  error && error.includes("パスワード")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="パスワード"
                autoComplete="current-password"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isPending || !loginId.trim() || !password}
              className={`w-full font-bold py-3 rounded-lg text-base transition-colors mt-2 ${
                isPending || !loginId.trim() || !password
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isPending ? "ログイン中..." : "ログイン"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            パスワードを忘れた場合は管理者にお問い合わせください
          </p>
        </div>
      </div>
    </div>
  );
}
