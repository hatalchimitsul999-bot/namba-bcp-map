"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import type { Store, ProfileRole } from "@/types";
import { submitNewUser } from "./actions";

const roleOptions: { value: ProfileRole; label: string; desc: string }[] = [
  { value: "admin",    label: "管理者",     desc: "全機能にアクセスできます" },
  { value: "store",    label: "店舗ユーザー", desc: "自店舗の報告のみ可能です" },
  { value: "external", label: "外部関係者",  desc: "閲覧権限のみです" },
];

export default function UserForm({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [authSkipped, setAuthSkipped] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<ProfileRole>("store");
  const [storeId, setStoreId] = useState<number | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = () => {
    setSubmitError(null);
    if (password !== passwordConfirm) {
      setSubmitError("パスワードが一致しません");
      return;
    }
    startTransition(async () => {
      const result = await submitNewUser({
        loginId, email, name, role, storeId, password,
      });
      if (result.ok) {
        setAuthSkipped(result.authSkipped ?? false);
        setSuccess(true);
        setTimeout(() => router.push("/admin/users"), 2500);
      } else {
        setSubmitError(result.error ?? "登録に失敗しました");
      }
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50";

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="新規ユーザー登録" backHref="/admin/users" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl border border-green-200 p-8 text-center space-y-3 max-w-sm w-full">
            <div className="text-4xl">✅</div>
            <p className="font-bold text-green-700">ユーザーを登録しました</p>
            {authSkipped ? (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-800 text-left">
                <p className="font-bold mb-1">注意</p>
                <p>SUPABASE_SERVICE_ROLE_KEY が未設定のため、Supabase Authentication へのユーザー登録はスキップされました。手動で追加してください。</p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Supabase Auth にも登録されました</p>
            )}
            <p className="text-sm text-gray-500">ユーザー一覧に移動します...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="新規ユーザー登録" backHref="/admin/users" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

          {/* ログインID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ログインID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={isPending}
              placeholder="例: store_namba01"
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">半角英数字・アンダースコア推奨。重複不可。</p>
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              内部メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              placeholder="例: store01@namba-bcp.internal"
              className={inputClass}
            />
          </div>

          {/* 表示名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              表示名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              placeholder="例: たこ焼き本舗 担当者"
              className={inputClass}
            />
          </div>

          {/* ロール */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ロール <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {roleOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex-1 cursor-pointer border rounded-lg px-3 py-2.5 text-center transition-colors ${
                    role === opt.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => {
                      setRole(opt.value);
                      if (opt.value !== "store") setStoreId(undefined);
                    }}
                    className="sr-only"
                  />
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* 紐づけ店舗（store のみ） */}
          {role === "store" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                紐づけ店舗 <span className="text-red-500">*</span>
              </label>
              <select
                value={storeId ?? ""}
                onChange={(e) => setStoreId(e.target.value ? Number(e.target.value) : undefined)}
                disabled={isPending}
                className={inputClass}
              >
                <option value="">店舗を選択してください</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}（{s.areaName}）
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* パスワード */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              placeholder="8文字以上"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              パスワード（確認） <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              disabled={isPending}
              placeholder="同じパスワードを再入力"
              className={inputClass}
            />
            {passwordConfirm && password !== passwordConfirm && (
              <p className="text-xs text-red-500 mt-1">パスワードが一致しません</p>
            )}
          </div>
        </div>

        {/* エラー */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">登録に失敗しました</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            disabled={isPending}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-3.5 rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex-1 font-bold py-3.5 rounded-xl transition-colors ${
              isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPending ? "登録中..." : "ユーザーを登録する"}
          </button>
        </div>
      </div>
    </div>
  );
}
