"use client";
import { useState } from "react";
import type { Store, Report, SupportRequest } from "@/types";
import { safetyStatusLabels, businessStatusLabels } from "@/lib/mockData";

interface MockMapProps {
  stores: Store[];
  reports: Report[];
  supportRequests: SupportRequest[];
  filterStatus?: string[];
}

type MarkerStatus = "open" | "partially_open" | "closed" | "support" | "damaged" | "unknown";

function getMarkerStatus(report: Report | undefined, hasSupportRequest: boolean): MarkerStatus {
  if (hasSupportRequest) return "support";
  if (!report) return "unknown";
  if (report.businessStatus === "open") return "open";
  if (report.businessStatus === "partially_open") return "partially_open";
  if (report.businessStatus === "closed") return "closed";
  if (report.hasDamage) return "damaged";
  return "unknown";
}

const markerColors: Record<MarkerStatus, string> = {
  open: "bg-green-500 border-green-700",
  partially_open: "bg-yellow-400 border-yellow-600",
  closed: "bg-red-500 border-red-700",
  support: "bg-orange-500 border-orange-700",
  damaged: "bg-purple-500 border-purple-700",
  unknown: "bg-gray-400 border-gray-600",
};

const markerLabels: Record<MarkerStatus, string> = {
  open: "営業可能",
  partially_open: "一部営業",
  closed: "営業停止",
  support: "支援要請中",
  damaged: "被害あり",
  unknown: "状況未確認",
};

const legendItems: { status: MarkerStatus; label: string }[] = [
  { status: "open", label: "営業可能" },
  { status: "partially_open", label: "一部営業可能" },
  { status: "closed", label: "営業停止" },
  { status: "support", label: "支援要請中" },
  { status: "damaged", label: "被害あり" },
  { status: "unknown", label: "状況未確認" },
];

const gridPositions = [
  { x: 10, y: 15 }, { x: 25, y: 10 }, { x: 40, y: 18 },
  { x: 55, y: 12 }, { x: 70, y: 20 }, { x: 20, y: 35 },
  { x: 38, y: 40 }, { x: 58, y: 38 }, { x: 75, y: 42 },
  { x: 12, y: 55 }, { x: 45, y: 60 }, { x: 68, y: 58 },
];

export default function MockMap({ stores, reports, supportRequests, filterStatus }: MockMapProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const activeStoreIds = supportRequests
    .filter((s) => s.status !== "closed")
    .map((s) => s.storeId);

  const filteredStores = filterStatus && filterStatus.length > 0
    ? stores.filter((store) => {
        const report = reports.find((r) => r.storeId === store.id);
        const hasSupportReq = activeStoreIds.includes(store.id);
        const status = getMarkerStatus(report, hasSupportReq);
        return filterStatus.includes(status);
      })
    : stores;

  const selectedStore = stores.find((s) => s.id === selected);
  const selectedReport = reports.find((r) => r.storeId === selected);
  const selectedSupportReqs = supportRequests.filter((s) => s.storeId === selected);

  return (
    <div className="space-y-3">
      {/* 凡例 */}
      <div className="flex flex-wrap gap-3 p-3 bg-white rounded-lg border border-gray-200">
        {legendItems.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded-full border-2 ${markerColors[status]}`} />
            <span className="text-xs text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      {/* マップエリア */}
      <div className="relative bg-stone-100 border-2 border-gray-300 rounded-xl overflow-hidden" style={{ height: 480 }}>
        {/* 道路の背景 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-10 bg-stone-200 opacity-70" />
          <div className="absolute top-2/3 left-0 right-0 h-8 bg-stone-200 opacity-70" />
          <div className="absolute left-1/3 top-0 bottom-0 w-10 bg-stone-200 opacity-70" />
          <div className="absolute left-2/3 top-0 bottom-0 w-8 bg-stone-200 opacity-70" />
        </div>

        {/* 商店街ラベル */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full opacity-90 whitespace-nowrap">
          難波商店街
        </div>

        {/* 店舗マーカー */}
        {stores.map((store, i) => {
          const report = reports.find((r) => r.storeId === store.id);
          const hasSupportReq = activeStoreIds.includes(store.id);
          const status = getMarkerStatus(report, hasSupportReq);
          const pos = gridPositions[i % gridPositions.length];
          const isFiltered = filterStatus && filterStatus.length > 0 && !filterStatus.includes(status);
          const isSelected = selected === store.id;

          return (
            <button
              key={store.id}
              onClick={() => setSelected(isSelected ? null : store.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all ${isFiltered ? "opacity-20" : "opacity-100"}`}
              style={{ left: `${pos.x + 5}%`, top: `${pos.y + 10}%` }}
            >
              <div
                className={`w-9 h-9 rounded-full border-3 border-2 flex items-center justify-center text-white text-xs font-bold shadow-md transition-transform group-hover:scale-110 ${markerColors[status]} ${isSelected ? "ring-4 ring-white ring-offset-1 scale-125" : ""}`}
              >
                {i + 1}
              </div>
              <div className="mt-1 bg-white border border-gray-300 rounded px-1 py-0.5 text-xs text-gray-700 whitespace-nowrap shadow-sm max-w-24 truncate text-center">
                {store.name.length > 8 ? store.name.slice(0, 8) + "…" : store.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* 選択店舗の詳細 */}
      {selectedStore && (
        <div className="bg-white border-2 border-blue-300 rounded-xl p-4 shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-base">{selectedStore.name}</h3>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="text-gray-500">安否状況</div>
            <div className="font-medium">
              {selectedReport ? safetyStatusLabels[selectedReport.safetyStatus] : "未報告"}
            </div>
            <div className="text-gray-500">営業状況</div>
            <div className="font-medium">
              {selectedReport ? businessStatusLabels[selectedReport.businessStatus] : "未報告"}
            </div>
            <div className="text-gray-500">支援要請</div>
            <div className="font-medium">
              {selectedSupportReqs.length > 0 ? `${selectedSupportReqs.length}件` : "なし"}
            </div>
            <div className="text-gray-500">最終更新</div>
            <div className="font-medium text-xs">
              {selectedReport ? selectedReport.reportedAt.replace("T", " ").slice(0, 16) : "—"}
            </div>
          </div>
          {selectedReport?.damageItems && selectedReport.damageItems.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">被害項目: </span>
              <span className="text-xs text-red-700 font-medium">{selectedReport.damageItems.join("、")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
