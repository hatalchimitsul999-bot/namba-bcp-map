"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import MockMap from "@/components/MockMap";
import { mockStores, mockReports, mockSupportRequests } from "@/lib/mockData";

const filterOptions = [
  { value: "open", label: "営業可能", color: "bg-green-500" },
  { value: "partially_open", label: "一部営業", color: "bg-yellow-400" },
  { value: "closed", label: "営業停止", color: "bg-red-500" },
  { value: "support", label: "支援要請中", color: "bg-orange-500" },
  { value: "damaged", label: "被害あり", color: "bg-purple-500" },
  { value: "unknown", label: "未確認", color: "bg-gray-400" },
];

export default function MapPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="BCPマップ" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 space-y-4">
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
            全 <span className="font-bold">{mockStores.length}</span> 店舗
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-orange-700">
            未報告 <span className="font-bold">4</span> 件
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700">
            支援要請 <span className="font-bold">3</span> 件
          </div>
        </div>

        {/* マップ */}
        <MockMap
          stores={mockStores}
          reports={mockReports}
          supportRequests={mockSupportRequests}
          filterStatus={activeFilters}
        />
      </div>
    </div>
  );
}
