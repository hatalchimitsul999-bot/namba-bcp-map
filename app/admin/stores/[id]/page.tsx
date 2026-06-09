import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import StatusBadge, {
  safetyBadgeColor,
  businessBadgeColor,
  supportStatusBadgeColor,
  urgencyBadgeColor,
} from "@/components/StatusBadge";
import { safetyStatusLabels, businessStatusLabels, supportTypeLabels, urgencyLabels, supportStatusLabels } from "@/lib/labels";
import { fetchStoreById } from "@/lib/db/stores";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchReportByStoreAndEvent } from "@/lib/db/reports";
import { fetchSupportRequestsByStoreAndEvent } from "@/lib/db/supportRequests";
import { fetchEmergencyContactsByStoreId } from "@/lib/db/emergencyContacts";
import EmergencyContactsSection from "./EmergencyContactsSection";

export const dynamic = "force-dynamic";

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const storeId = parseInt(id);

  const [storeResult, eventResult, contactsResult] = await Promise.all([
    fetchStoreById(storeId),
    fetchActiveDisasterEvent(),
    fetchEmergencyContactsByStoreId(storeId),
  ]);

  // 店舗が見つからない場合
  if (storeResult.error || !storeResult.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="店舗詳細" backHref="/admin/stores" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 max-w-sm w-full text-center space-y-3">
            <p className="text-gray-500 text-sm">
              {storeResult.error ?? "店舗が見つかりませんでした"}
            </p>
            <Link href="/admin/stores" className="text-blue-600 text-sm hover:underline">
              ← 店舗一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const store = storeResult.data;
  const event = eventResult.data;
  const contacts = contactsResult.data ?? [];

  // イベントがある場合のみ報告を取得
  const reportResult = event
    ? await fetchReportByStoreAndEvent(storeId, event.id)
    : { data: null, error: null };

  const report = reportResult.data;

  const supportResult = event
    ? await fetchSupportRequestsByStoreAndEvent(storeId, event.id)
    : { data: [], error: null };

  const supportReqs = supportResult.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title={store.name} backHref="/admin/stores" variant="admin" showLogout />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 space-y-5">
        {/* 報告取得エラー */}
        {reportResult.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            報告データの取得に失敗しました: {reportResult.error}
          </div>
        )}

        {/* 基本情報 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
          <h2 className="font-bold text-gray-700 text-sm border-b border-gray-100 pb-2">基本情報</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">店舗名</div><div className="font-medium text-gray-900">{store.name}</div>
            <div className="text-gray-500">業種</div><div className="text-gray-800">{store.category}</div>
            <div className="text-gray-500">エリア</div><div className="text-gray-800">{store.areaName}</div>
            <div className="text-gray-500">住所</div><div className="text-gray-800">{store.address}</div>
            <div className="text-gray-500">担当者</div><div className="text-gray-800">{store.managerName}</div>
            <div className="text-gray-500">電話番号</div><div className="text-gray-800">{store.phone}</div>
            <div className="text-gray-500">メール</div><div className="truncate text-gray-800">{store.email}</div>
          </div>
        </div>

        <EmergencyContactsSection contacts={contacts} storeId={storeId} />

        {/* 報告状況 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h2 className="font-bold text-gray-700 text-sm border-b border-gray-100 pb-2 mb-3">報告状況</h2>
          {!event ? (
            <p className="text-sm text-gray-500 py-2">現在稼働中の災害イベントがありません</p>
          ) : report ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-gray-500">安否状況</div>
                <div>
                  <StatusBadge label={safetyStatusLabels[report.safetyStatus]} color={safetyBadgeColor(report.safetyStatus)} />
                  {report.isProxy && <span className="ml-1 text-xs text-gray-500">(代理入力)</span>}
                </div>
                <div className="text-gray-500">営業状況</div>
                <div>
                  <StatusBadge label={businessStatusLabels[report.businessStatus]} color={businessBadgeColor(report.businessStatus)} />
                </div>
                <div className="text-gray-500">被害</div>
                <div>
                  {report.hasDamage ? (
                    report.damageItems.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {report.damageItems.map((d) => (
                          <StatusBadge key={d.id} label={d.damageItemName} color="orange" size="sm" />
                        ))}
                      </div>
                    ) : (
                      <StatusBadge label="被害あり" color="orange" />
                    )
                  ) : (
                    <StatusBadge label="被害なし" color="green" />
                  )}
                </div>
                <div className="text-gray-500">報告日時</div>
                <div className="text-xs text-gray-800">{report.reportedAt.replace("T", " ").slice(0, 16)}</div>
              </div>
              {report.memo && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  <span className="text-gray-500 text-xs font-medium">メモ: </span>{report.memo}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 py-2">まだ報告がありません</div>
          )}
        </div>

        {/* 支援要請（次フェーズまでモック） */}
        {supportReqs.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h2 className="font-bold text-gray-700 text-sm border-b border-gray-100 pb-2 mb-3">支援要請</h2>
            {supportReqs.map((sr) => (
              <div key={sr.id} className="border border-gray-100 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge label={supportTypeLabels[sr.supportType]} color="purple" />
                  <StatusBadge label={`緊急度: ${urgencyLabels[sr.urgency]}`} color={urgencyBadgeColor(sr.urgency)} />
                  <StatusBadge label={supportStatusLabels[sr.status]} color={supportStatusBadgeColor(sr.status)} />
                </div>
                {sr.detail && <p className="text-gray-600">{sr.detail}</p>}
              </div>
            ))}
          </div>
        )}

        {/* アクション */}
        <div className="flex gap-3">
          <Link href="/admin/proxy-input" className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl text-center hover:bg-orange-600 transition-colors text-sm">
            ✏️ 代理入力
          </Link>
          <Link href="/admin/support-requests" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl text-center hover:bg-blue-700 transition-colors text-sm">
            支援要請一覧
          </Link>
        </div>
      </div>
    </div>
  );
}
