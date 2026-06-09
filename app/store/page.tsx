"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { useReportStore } from "@/lib/useReportStore";
import { fetchStoreById } from "@/lib/db/stores";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { fetchReportByStoreAndEvent } from "@/lib/db/reports";
import { fetchSupportRequestsByStoreAndEvent } from "@/lib/db/supportRequests";
import { supportTypeLabels, urgencyLabels, supportStatusLabels } from "@/lib/labels";
import { useProfile } from "@/lib/auth/ProfileContext";
import type { Store, DisasterEvent, Report, SupportRequest } from "@/types";

const subMenuItems = [
  { href: "/store/safety?from=top", icon: "👤", label: "安否だけ更新" },
  { href: "/store/business?from=top", icon: "🏬", label: "営業状況だけ更新" },
  { href: "/store/support?from=top", icon: "🆘", label: "支援要請だけ更新" },
  { href: "/store/confirm?from=top", icon: "📋", label: "報告内容確認" },
];

export default function StorePage() {
  const router = useRouter();
  const profile = useProfile();
  const { hasStarted, hasSavedData, hydrated } = useReportStore();

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [event, setEvent] = useState<DisasterEvent | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);

  useEffect(() => {
    const storeId = profile?.storeId;
    if (!storeId) return;

    async function loadData() {
      setLoading(true);
      setFetchError(null);

      const [storeResult, eventResult] = await Promise.all([
        fetchStoreById(storeId!),
        fetchActiveDisasterEvent(),
      ]);

      const errs = [storeResult.error, eventResult.error].filter(Boolean);
      if (errs.length > 0) {
        setFetchError(errs.join(" / "));
        setLoading(false);
        return;
      }

      setStore(storeResult.data);
      setEvent(eventResult.data);

      if (eventResult.data) {
        const [reportResult, supportResult] = await Promise.all([
          fetchReportByStoreAndEvent(storeId!, eventResult.data.id),
          fetchSupportRequestsByStoreAndEvent(storeId!, eventResult.data.id),
        ]);

        const subErrs: string[] = [];
        if (reportResult.error) subErrs.push(reportResult.error);
        else setReport(reportResult.data);

        if (supportResult.error) subErrs.push(supportResult.error);
        else setSupportRequests(supportResult.data ?? []);

        if (subErrs.length > 0) setFetchError(subErrs.join(" / "));
      }

      setLoading(false);
    }

    loadData();
  }, [profile?.storeId]);

  // ── ローディング ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="難波商店街 BCPマップ" variant="store" showLogout />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">データを読み込んでいます...</p>
          </div>
        </div>
      </div>
    );
  }

  const lastReported = report?.reportedAt
    ? report.reportedAt.replace("T", " ").slice(0, 16)
    : null;

  const activeSupportRequests = supportRequests.filter((s) => s.status !== "closed");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="難波商店街 BCPマップ" variant="store" showLogout />

      <div className="flex-1 px-4 py-4 space-y-4 max-w-lg mx-auto w-full">
        {/* DB取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">データ取得エラー</p>
            <p className="font-mono text-xs">{fetchError}</p>
          </div>
        )}

        {/* 店舗情報 */}
        {store && (
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">ログイン中の店舗</p>
                <h2 className="font-bold text-gray-900 text-lg mt-0.5">{store.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{store.address}</p>
              </div>
              <div className="text-3xl">🏪</div>
            </div>
          </div>
        )}

        {/* モード表示 */}
        {event ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-600 text-lg">⚠</span>
              <span className="text-red-700 font-bold text-base">災害時モード稼働中</span>
            </div>
            <p className="text-red-600 text-sm">{event.name}</p>
            <p className="text-xs text-red-500 mt-1">
              開始: {event.startedAt.replace("T", " ").slice(0, 16)}
            </p>
            {lastReported ? (
              <p className="text-xs text-green-700 mt-2 bg-green-50 rounded px-2 py-1">
                ✓ 最終報告: {lastReported}
              </p>
            ) : (
              <p className="text-xs text-orange-700 mt-2 bg-orange-50 rounded px-2 py-1">
                ⚠ まだ報告がありません。速やかに報告してください。
              </p>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">🔵</span>
              <span className="text-blue-700 font-bold text-base">平常時モード</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">現在稼働中の災害イベントはありません。</p>
          </div>
        )}

        {/* 支援要請状況 */}
        {activeSupportRequests.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
            <p className="text-xs font-bold text-orange-700 mb-2">
              🆘 支援要請中 ({activeSupportRequests.length}件)
            </p>
            <div className="space-y-1.5">
              {activeSupportRequests.slice(0, 3).map((sr) => (
                <div key={sr.id} className="flex items-center gap-2 text-xs text-orange-700">
                  <span>{supportTypeLabels[sr.supportType] ?? sr.supportType}</span>
                  <span className="bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">
                    緊急度: {urgencyLabels[sr.urgency] ?? sr.urgency}
                  </span>
                  <span className="text-orange-500">
                    {supportStatusLabels[sr.status] ?? sr.status}
                  </span>
                </div>
              ))}
              {activeSupportRequests.length > 3 && (
                <p className="text-xs text-orange-500">他 {activeSupportRequests.length - 3} 件</p>
              )}
            </div>
          </div>
        )}

        {/* 一時保存インジケーター */}
        {hasSavedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
            <span>💾</span>
            <span>入力内容は一時保存されています</span>
          </div>
        )}

        {/* メインボタン */}
        <Link
          href="/store/safety"
          className="block w-full bg-red-600 text-white font-bold py-5 rounded-xl text-center text-lg hover:bg-red-700 active:bg-red-800 transition-colors shadow-md"
        >
          <div>📋 災害報告を開始・更新する</div>
          <div className="text-sm font-normal mt-1 text-red-100">
            安否 → 被害 → 営業 → 支援 の順に入力
          </div>
        </Link>

        {/* サブメニュー */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 px-1">個別に更新する</p>
          {hydrated && !hasStarted && (
            <div className="mb-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
              先に「災害報告を開始・更新する」から報告を開始してください
            </div>
          )}
          <div className="space-y-2">
            {subMenuItems.map((item) =>
              hasStarted ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1 text-sm font-bold text-gray-800">{item.label}</span>
                  <span className="text-gray-400 text-lg">›</span>
                </Link>
              ) : (
                <div
                  key={item.href}
                  className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 cursor-not-allowed"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1 text-sm font-bold text-gray-500">{item.label}</span>
                  <span className="text-gray-400 text-lg">›</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      {store && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            担当者: {store.managerName} | {store.phone}
          </p>
        </div>
      )}
    </div>
  );
}
