import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import StoreTable from "@/components/StoreTable";
import { fetchStores } from "@/lib/db/stores";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchReportsByEventId } from "@/lib/db/reports";

export const dynamic = "force-dynamic";

export default async function StoresPage() {
  const [storesResult, eventResult] = await Promise.all([
    fetchStores(),
    fetchActiveDisasterEvent(),
  ]);

  const error = storesResult.error;
  const stores = storesResult.data ?? [];
  const event = eventResult.data;

  const reportsResult = event
    ? await fetchReportsByEventId(event.id)
    : { data: [], error: null };

  const reports = reportsResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="店舗一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-4">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-2">
            <p className="font-bold text-red-700 text-sm">データの取得に失敗しました</p>
            <p className="text-red-600 text-xs font-mono break-all">{error}</p>
            <p className="text-red-500 text-xs">時間をおいて再読み込みしてください。</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">全 {stores.length} 店舗</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="店舗名で検索..."
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
                />
                <Link
                  href="/admin/stores/new"
                  className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  + 新規店舗登録
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {stores.length === 0 ? (
                <div className="px-4 py-10 text-center text-gray-500 text-sm">
                  店舗データがありません。Supabase の stores テーブルにデータを登録してください。
                </div>
              ) : (
                <StoreTable stores={stores} reports={reports} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
