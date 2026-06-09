import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { fetchProfiles } from "@/lib/db/profiles";
import { fetchStores } from "@/lib/db/stores";
import type { ProfileRole } from "@/types";

export const dynamic = "force-dynamic";

const roleLabel: Record<ProfileRole, string> = {
  admin: "管理者",
  store: "店舗",
  external: "外部",
};

const roleBadge: Record<ProfileRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  store: "bg-blue-100 text-blue-700",
  external: "bg-gray-100 text-gray-600",
};

export default async function UsersPage() {
  const [profilesResult, storesResult] = await Promise.all([
    fetchProfiles(),
    fetchStores(),
  ]);

  const profiles = profilesResult.data ?? [];
  const stores = storesResult.data ?? [];
  const storeMap = new Map(stores.map((s) => [s.id, s.name]));
  const error = profilesResult.error;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="ユーザー管理" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 space-y-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-2">
            <p className="font-bold text-red-700 text-sm">データの取得に失敗しました</p>
            <p className="text-red-600 text-xs font-mono break-all">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">全 {profiles.length} ユーザー</p>
              <Link
                href="/admin/users/new"
                className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                + 新規ユーザー登録
              </Link>
            </div>

            {/* 注意書き */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-700">
              ログインを有効にするには、Supabase Authentication 側にも同じメールアドレスでユーザーを作成してください。
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {profiles.length === 0 ? (
                <div className="px-4 py-10 text-center text-gray-500 text-sm">
                  ユーザーが登録されていません。
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {profiles.map((p) => (
                    <li key={p.id} className="px-4 py-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-gray-900">{p.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[p.role]}`}
                          >
                            {roleLabel[p.role]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ログインID: <span className="font-mono">{p.loginId}</span>
                        </p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                        {p.storeId && (
                          <p className="text-xs text-blue-600 mt-0.5">
                            {storeMap.get(p.storeId) ?? `店舗 ID: ${p.storeId}`}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap pt-0.5">
                        {p.authUserId ? (
                          <span className="text-green-600 font-medium">Auth 連携済</span>
                        ) : (
                          <span className="text-amber-500">Auth 未連携</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
