"use client";

import { useState } from "react";
import MockMap from "@/components/MockMap";
import type { Store, Report, SupportRequest, DisasterEvent } from "@/types";

const filterOptions = [
  { value: "open", label: "営業可能", color: "bg-green-500" },
  { value: "partially_open", label: "一部営業", color: "bg-yellow-400" },
  { value: "closed", label: "営業停止", color: "bg-red-500" },
  { value: "support", label: "支援要請中", color: "bg-orange-500" },
  { value: "damaged", label: "被害あり", color: "bg-purple-500" },
  { value: "unknown", label: "未確認", color: "bg-gray-400" },
];

interface MapViewProps {
  stores: Store[];
  reports: Report[];
  supportRequests: SupportRequest[];
  event: DisasterEvent | null;
  fetchError: string | null;
}

export default function MapView({ stores, reports, supportRequests, event, fetchError }: MapViewProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const reportedStoreIds = new Set(reports.map((r) => r.storeId));
  const unreportedCount = event ? stores.length - reportedStoreIds.size : 0;
  const activeSupportCount = supportRequests.filter((s) => s.status !== "closed").length;

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 space-y-4">
      {/* DB取得エラー */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="font-bold text-red-700 text-sm">データ取得エラー</p>
          <p className="text-red-600 text-xs font-mono mt-1">{fetchError}</p>
        </div>
      )}

      {/* 災害イベントなし */}
      {!event && !fetchError && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
          現在稼働中の災害イベントがありません。店舗位置のみ表示しています。
        </div>
      )}

      {/* フィルター */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">表示フィルター（複数選択可。何も選択しなければ全表示）</p>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => {
            const isActive = activeFilters.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleFilter(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                  isActive
                    ? "border-gray-700 bg-gray-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${opt.color}`} />
                {opt.label}
              </button>
            );
          })}
          {activeFilters.length > 0 && (
            <button
              onClick={() => setActiveFilters([])}
              className="px-3 py-1.5 rounded-full text-sm text-gray-500 border border-gray-200 hover:bg-gray-100"
            >
              × クリア
            </button>
          )}
        </div>
      </div>

      {/* 統計バー */}
      <div className="flex gap-3 text-xs">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
          全 <span className="font-bold">{stores.length}</span> 店舗
        </div>
        {event && (
          <>
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-orange-700">
              未報告 <span className="font-bold">{unreportedCount}</span> 件
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700">
              支援要請 <span className="font-bold">{activeSupportCount}</span> 件
            </div>
          </>
        )}
      </div>

      {/* マップ */}
      <MockMap
        stores={stores}
        reports={reports}
        supportRequests={supportRequests}
        filterStatus={activeFilters}
      />
    </div>
  );
}
