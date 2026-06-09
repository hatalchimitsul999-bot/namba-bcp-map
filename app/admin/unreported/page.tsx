import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { fetchStores } from "@/lib/db/stores";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchReportsByEventId } from "@/lib/db/reports";

export const dynamic = "force-dynamic";

export default async function UnreportedPage() {
  const [storesResult, eventResult] = await Promise.all([
    fetchStores(),
    fetchActiveDisasterEvent(),
  ]);

  const stores = storesResult.data ?? [];
  const event = eventResult.data;
  const fetchError = storesResult.error ?? eventResult.error;

  const reportsResult = event
    ? await fetchReportsByEventId(event.id)
    : { data: [], error: null };

  const reports = reportsResult.data ?? [];
  const reportedStoreIds = new Set(reports.map((r) => r.storeId));
  const unreported = stores.filter((s) => !reportedStoreIds.has(s.id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="未報告店舗一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        {/* DB取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-bold text-red-700 text-sm">データ取得エラー</p>
            <p className="text-red-600 text-xs font-mono mt-1">{fetchError}</p>
          </div>
        )}

        {/* 災害イベント未起動 */}
        {!event && !fetchError && (
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center text-gray-500 text-sm">
            現在、稼働中の災害イベントがありません
          </div>
        )}

        {event && (
          <>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2">
              <span className="text-orange-600 text-xl">⚠</span>
              <div>
                <p className="text-orange-700 font-bold text-sm">
                  {unreported.length} 店舗がまだ報告していません
                </p>
                <p className="text-orange-600 text-xs">
                  電話で確認後、代理入力をお願いします
                </p>
              </div>
            </div>

            {unreported.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-700 font-bold text-sm">全店舗が報告済みです</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unreported.map((store) => (
                  <div key={store.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{store.name}</h3>
                        <p className="text-xs text-gray-500">{store.areaName} | {store.category}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">未報告</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500 text-xs">担当者</span>
                        <p className="font-medium text-gray-900">{store.managerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">電話番号</span>
                        <p className="font-medium text-blue-600">{store.phone}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 border border-orange-300 text-orange-600 font-medium py-2 rounded-lg text-sm hover:bg-orange-50">
                        📢 再通知
                      </button>
                      <Link
                        href="/admin/proxy-input"
                        className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg text-center text-sm hover:bg-orange-600"
                      >
                        ✏️ 代理入力
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
