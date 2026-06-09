import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import DashboardCard from "@/components/DashboardCard";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchStores } from "@/lib/db/stores";

export const dynamic = "force-dynamic";
import { fetchReportsByEventId } from "@/lib/db/reports";
import { fetchSupportRequestsByEventId } from "@/lib/db/supportRequests";

export default async function DashboardPage() {
  const [eventResult, storesResult] = await Promise.all([
    fetchActiveDisasterEvent(),
    fetchStores(),
  ]);

  const event = eventResult.data;
  const stores = storesResult.data ?? [];
  const fetchError = storesResult.error ?? eventResult.error;

  // 報告・支援要請はイベントがある場合のみ取得
  const [reportsResult, supportResult] = event
    ? await Promise.all([
        fetchReportsByEventId(event.id),
        fetchSupportRequestsByEventId(event.id),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];

  const reports = reportsResult.data ?? [];
  const supportRequests = supportResult.data ?? [];

  // 集計
  const reportedStoreIds = new Set(reports.map((r) => r.storeId));
  const totalStores = stores.length;
  const reportedStores = reportedStoreIds.size;
  const unreportedStores = totalStores - reportedStores;
  const safeStores = reports.filter((r) => r.safetyStatus === "safe").length;
  const damagedStores = reports.filter((r) =>
    r.safetyStatus === "damaged" || r.safetyStatus === "evacuated"
  ).length;
  const openStores = reports.filter((r) => r.businessStatus === "open").length;
  const closedStores = reports.filter((r) => r.businessStatus === "closed").length;
  const supportTotal = supportRequests.length;
  const supportInProgress = supportRequests.filter((s) => s.status === "in_progress").length;
  const supportClosed = supportRequests.filter((s) => s.status === "closed").length;

  const reportRate = totalStores > 0
    ? Math.round((reportedStores / totalStores) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="管理ダッシュボード" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-6">
        {/* DB取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-bold text-red-700 text-sm">データ取得エラー</p>
            <p className="text-red-600 text-xs font-mono mt-1">{fetchError}</p>
          </div>
        )}

        {/* 災害イベント情報 */}
        {event ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">稼働中</span>
                <h2 className="font-bold text-gray-800 text-base mt-1">{event.name}</h2>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>開始: {event.startedAt.replace("T", " ").slice(0, 16)}</div>
                <div>対象: {event.targetArea}</div>
              </div>
            </div>
            {event.memo && <p className="text-xs text-gray-500 mt-2">{event.memo}</p>}
          </div>
        ) : (
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center text-gray-500 text-sm">
            現在、稼働中の災害時モードはありません
          </div>
        )}

        {/* 報告状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">📋 報告状況</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DashboardCard label="総店舗数" value={totalStores} color="blue" />
            <DashboardCard label="報告済み" value={reportedStores} color="green" sub={`${reportRate}%`} />
            <DashboardCard label="未報告" value={unreportedStores} color="orange" />
          </div>
        </div>

        {/* 安否状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">👤 安否状況</h3>
          <div className="grid grid-cols-2 gap-3">
            <DashboardCard label="無事" value={safeStores} color="green" />
            <DashboardCard label="被害あり" value={damagedStores} color="red" />
          </div>
        </div>

        {/* 営業状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">🏬 営業状況</h3>
          <div className="grid grid-cols-2 gap-3">
            <DashboardCard label="営業可能" value={openStores} color="green" />
            <DashboardCard label="営業停止" value={closedStores} color="red" />
          </div>
        </div>

        {/* 支援要請 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">🆘 支援要請</h3>
          <div className="grid grid-cols-3 gap-3">
            <DashboardCard label="合計" value={supportTotal} color="red" />
            <DashboardCard label="対応中" value={supportInProgress} color="yellow" />
            <DashboardCard label="対応済み" value={supportClosed} color="green" />
          </div>
        </div>

        {/* クイックリンク */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link href="/admin/map" className="block bg-blue-600 text-white font-bold text-center py-3 rounded-xl hover:bg-blue-700 transition-colors">
            🗺 BCPマップを見る
          </Link>
          <Link href="/admin/unreported" className="block bg-orange-500 text-white font-bold text-center py-3 rounded-xl hover:bg-orange-600 transition-colors">
            ⚠ 未報告店舗を確認
          </Link>
          <Link href="/admin/support-requests" className="block bg-red-600 text-white font-bold text-center py-3 rounded-xl hover:bg-red-700 transition-colors">
            🆘 支援要請を確認
          </Link>
        </div>
      </div>
    </div>
  );
}
