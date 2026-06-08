"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import StatusBadge, { safetyBadgeColor, businessBadgeColor } from "@/components/StatusBadge";
import { useReportStore } from "@/lib/useReportStore";
import { mockStores } from "@/lib/mockData";
import {
  safetyStatusLabels,
  businessStatusLabels,
  supportTypeLabels,
  urgencyLabels,
} from "@/lib/mockData";

function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const fromTop = searchParams.get("from") === "top";
  const backHref = fromTop ? "/store" : "/store/support";
  const { draft, hydrated } = useReportStore();
  const store = mockStores[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="報告内容確認" backHref={backHref} variant="store" showLogout />

      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-4">
        {/* ステップ（ステップフローからのみ表示） */}
        {!fromTop && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">4</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">5</span>
            <span className="text-red-600 font-semibold">確認・送信</span>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
          ⚠ 以下の内容で送信します。内容を確認してください。
        </div>

        {/* 確認カード */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">{store.name}</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {/* 安否状況 */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">安否状況</span>
              {hydrated && draft.safetyStatus ? (
                <StatusBadge
                  label={safetyStatusLabels[draft.safetyStatus] ?? draft.safetyStatus}
                  color={safetyBadgeColor(draft.safetyStatus)}
                />
              ) : (
                <span className="text-sm text-gray-400">未入力</span>
              )}
            </div>

            {/* 被害状況 */}
            <div className="px-4 py-3 flex items-start justify-between gap-3">
              <span className="text-sm text-gray-600 shrink-0">被害状況</span>
              {hydrated && draft.damageItems.length > 0 ? (
                <div className="flex gap-1 flex-wrap justify-end">
                  {draft.damageItems.map((item) => (
                    <StatusBadge key={item} label={item} color="orange" size="sm" />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500">なし</span>
              )}
            </div>

            {/* 被害詳細 */}
            {hydrated && draft.damageDetail && (
              <div className="px-4 py-3">
                <span className="text-sm text-gray-500 block mb-1">被害詳細</span>
                <p className="text-sm text-gray-700">{draft.damageDetail}</p>
              </div>
            )}

            {/* 営業状況 */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">営業状況</span>
              {hydrated && draft.businessStatus ? (
                <StatusBadge
                  label={businessStatusLabels[draft.businessStatus] ?? draft.businessStatus}
                  color={businessBadgeColor(draft.businessStatus)}
                />
              ) : (
                <span className="text-sm text-gray-400">未入力</span>
              )}
            </div>

            {/* 支援要請 */}
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">支援要請</span>
              {!hydrated ? (
                <span className="text-sm text-gray-400">—</span>
              ) : draft.needsSupport === "true" ? (
                <div className="text-right">
                  <StatusBadge
                    label={supportTypeLabels[draft.supportType] ?? "要請あり"}
                    color="red"
                    size="sm"
                  />
                  {draft.supportUrgency && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      緊急度: {urgencyLabels[draft.supportUrgency] ?? draft.supportUrgency}
                    </p>
                  )}
                </div>
              ) : draft.needsSupport === "false" ? (
                <StatusBadge label="なし" color="green" />
              ) : (
                <span className="text-sm text-gray-400">未入力</span>
              )}
            </div>
          </div>
        </div>

        {/* 修正リンク */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/store/safety" className="text-center py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
            ← 安否を修正
          </Link>
          <Link href="/store/damage" className="text-center py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
            ← 被害を修正
          </Link>
          <Link href="/store/business" className="text-center py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
            ← 営業を修正
          </Link>
          <Link href="/store/support" className="text-center py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100">
            ← 支援を修正
          </Link>
        </div>

        <Link
          href="/store/complete"
          className="block w-full bg-red-600 text-white font-bold py-4 rounded-xl text-center text-base hover:bg-red-700 transition-colors"
        >
          📤 この内容で送信する
        </Link>

        {/* ホームに戻る（フル報告ルートのみ） */}
        {!fromTop && (
          <Link href="/store" className="block text-center text-sm text-gray-500 hover:text-gray-700 py-1">
            ← ホームに戻る
          </Link>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmPageContent />
    </Suspense>
  );
}
