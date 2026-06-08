import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import DashboardCard from "@/components/DashboardCard";
import { mockDashboardStats, mockDisasterEvent } from "@/lib/mockData";

export default function DashboardPage() {
  const s = mockDashboardStats;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="管理ダッシュボード" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-6">
        {/* 災害イベント情報 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">稼働中</span>
              <h2 className="font-bold text-gray-800 text-base mt-1">{mockDisasterEvent.name}</h2>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>開始: {mockDisasterEvent.startedAt.replace("T", " ").slice(0, 16)}</div>
              <div>対象: {mockDisasterEvent.targetArea}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{mockDisasterEvent.memo}</p>
        </div>

        {/* 報告状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">📋 報告状況</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DashboardCard label="総店舗数" value={s.totalStores} color="blue" />
            <DashboardCard label="報告済み" value={s.reportedStores} color="green" sub={`${Math.round(s.reportedStores / s.totalStores * 100)}%`} />
            <DashboardCard label="未報告" value={s.unreportedStores} color="orange" />
          </div>
        </div>

        {/* 安否状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">👤 安否状況</h3>
          <div className="grid grid-cols-2 gap-3">
            <DashboardCard label="無事" value={s.safeStores} color="green" />
            <DashboardCard label="被害あり" value={s.damagedStores} color="red" />
          </div>
        </div>

        {/* 営業状況 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">🏬 営業状況</h3>
          <div className="grid grid-cols-2 gap-3">
            <DashboardCard label="営業可能" value={s.openStores} color="green" />
            <DashboardCard label="営業停止" value={s.closedStores} color="red" />
          </div>
        </div>

        {/* 支援要請 */}
        <div>
          <h3 className="font-bold text-gray-700 text-sm mb-3">🆘 支援要請</h3>
          <div className="grid grid-cols-3 gap-3">
            <DashboardCard label="合計" value={s.supportRequestsTotal} color="red" />
            <DashboardCard label="対応中" value={s.supportRequestsInProgress} color="yellow" />
            <DashboardCard label="対応済み" value={s.supportRequestsClosed} color="green" />
          </div>
        </div>

        {/* クイックリンク */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            href="/admin/map"
            className="block bg-blue-600 text-white font-bold text-center py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            🗺 BCPマップを見る
          </Link>
          <Link
            href="/admin/unreported"
            className="block bg-orange-500 text-white font-bold text-center py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            ⚠ 未報告店舗を確認
          </Link>
          <Link
            href="/admin/support-requests"
            className="block bg-red-600 text-white font-bold text-center py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            🆘 支援要請を確認
          </Link>
        </div>
      </div>
    </div>
  );
}
