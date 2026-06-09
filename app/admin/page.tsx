import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import MenuCard from "@/components/MenuCard";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchStores } from "@/lib/db/stores";
import { fetchReportsByEventId } from "@/lib/db/reports";
import { fetchSupportRequestsByEventId } from "@/lib/db/supportRequests";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [eventResult, storesResult] = await Promise.all([
    fetchActiveDisasterEvent(),
    fetchStores(),
  ]);

  const event = eventResult.data;
  const stores = storesResult.data ?? [];
  const fetchError = eventResult.error ?? storesResult.error;

  const [reportsResult, supportResult] = event
    ? await Promise.all([
        fetchReportsByEventId(event.id),
        fetchSupportRequestsByEventId(event.id),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];

  const reports = reportsResult.data ?? [];
  const supportRequests = supportResult.data ?? [];

  const totalStores = stores.length;
  const reportedStoreIds = new Set(reports.map((r) => r.storeId));
  const unreportedStores = event ? totalStores - reportedStoreIds.size : 0;
  const supportTotal = supportRequests.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="難波商店街 BCPマップ 管理" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-5">
        {/* DB取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-bold text-red-700 text-sm">データ取得エラー</p>
            <p className="text-red-600 text-xs font-mono mt-1">{fetchError}</p>
          </div>
        )}

        {/* 災害モードバナー */}
        {event ? (
          <div className="bg-red-600 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-lg flex items-center gap-2">
                <span>⚠</span> 災害時モード稼働中
              </div>
              <div className="text-red-200 text-sm mt-0.5">{event.name}</div>
              <div className="text-red-200 text-xs mt-0.5">
                開始: {event.startedAt.replace("T", " ").slice(0, 16)}
              </div>
            </div>
            <Link
              href="/admin/disaster-mode"
              className="bg-white text-red-600 font-bold px-3 py-2 rounded-lg text-sm hover:bg-red-50"
            >
              モード管理
            </Link>
          </div>
        ) : (
          <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-lg flex items-center gap-2">
                <span>🔵</span> 平常時モード
              </div>
              <div className="text-blue-200 text-sm mt-0.5">
                現在、災害時モードは稼働していません
              </div>
            </div>
            <Link
              href="/admin/disaster-mode"
              className="bg-white text-blue-600 font-bold px-3 py-2 rounded-lg text-sm hover:bg-blue-50"
            >
              モード管理
            </Link>
          </div>
        )}

        {/* サマリー */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">{totalStores}</div>
            <div className="text-xs text-gray-500 mt-0.5">総店舗数</div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-3 text-center">
            <div className="text-2xl font-bold text-orange-700">{unreportedStores}</div>
            <div className="text-xs text-orange-600 mt-0.5">未報告</div>
          </div>
          <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
            <div className="text-2xl font-bold text-red-700">{supportTotal}</div>
            <div className="text-xs text-red-600 mt-0.5">支援要請</div>
          </div>
        </div>

        {/* メニュー */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <MenuCard
            href="/admin/dashboard"
            title="管理ダッシュボード"
            description="商店街全体の状況を数値で確認"
            icon="📊"
            color="blue"
          />
          <MenuCard
            href="/admin/map"
            title="BCPマップ"
            description="地図上で各店舗の状況を確認"
            icon="🗺"
            color="green"
          />
          <MenuCard
            href="/admin/stores"
            title="店舗一覧"
            description="全店舗の状況を一覧で確認"
            icon="🏪"
            color="blue"
          />
          <MenuCard
            href="/admin/unreported"
            title="未報告店舗"
            description="まだ報告していない店舗を確認"
            icon="⚠"
            color="orange"
            badge={String(unreportedStores)}
          />
          <MenuCard
            href="/admin/support-requests"
            title="支援要請一覧"
            description="支援が必要な店舗を確認・対応"
            icon="🆘"
            color="red"
            badge={String(supportTotal)}
          />
          <MenuCard
            href="/admin/proxy-input"
            title="代理入力"
            description="店舗に代わって状況を登録する"
            icon="✏️"
            color="purple"
          />
          <MenuCard
            href="/admin/notifications"
            title="一斉通知"
            description="店舗へ通知を送信する"
            icon="📢"
            color="blue"
          />
          <MenuCard
            href="/admin/disaster-mode"
            title="モード切替"
            description="災害時モードの開始・終了"
            icon="🔴"
            color="red"
          />
          <MenuCard
            href="/admin/users"
            title="ユーザー管理"
            description="ログインユーザーの一覧・新規登録"
            icon="👤"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}
