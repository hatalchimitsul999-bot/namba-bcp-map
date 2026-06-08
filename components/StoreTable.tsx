import Link from "next/link";
import type { Store, Report } from "@/types";
import StatusBadge, { safetyBadgeColor, businessBadgeColor } from "./StatusBadge";
import { safetyStatusLabels, businessStatusLabels, getReportByStoreId } from "@/lib/mockData";

interface StoreTableProps {
  stores: Store[];
  showActions?: boolean;
  actionLabel?: string;
  actionHref?: (storeId: number) => string;
  extraActionLabel?: string;
  extraActionHref?: (storeId: number) => string;
}

export default function StoreTable({
  stores,
  showActions = true,
  actionLabel = "詳細",
  actionHref,
  extraActionLabel,
  extraActionHref,
}: StoreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">店舗名</th>
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">業種</th>
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">エリア</th>
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">安否</th>
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">営業状況</th>
            <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">電話番号</th>
            {showActions && <th className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">操作</th>}
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => {
            const report = getReportByStoreId(store.id);
            return (
              <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{store.name}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{store.category}</td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{store.areaName}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {report ? (
                    <StatusBadge
                      label={safetyStatusLabels[report.safetyStatus]}
                      color={safetyBadgeColor(report.safetyStatus)}
                      size="sm"
                    />
                  ) : (
                    <StatusBadge label="未報告" color="gray" size="sm" />
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {report ? (
                    <StatusBadge
                      label={businessStatusLabels[report.businessStatus]}
                      color={businessBadgeColor(report.businessStatus)}
                      size="sm"
                    />
                  ) : (
                    <StatusBadge label="未報告" color="gray" size="sm" />
                  )}
                </td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{store.phone}</td>
                {showActions && (
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={actionHref ? actionHref(store.id) : `/admin/stores/${store.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium"
                      >
                        {actionLabel}
                      </Link>
                      {extraActionLabel && extraActionHref && (
                        <Link
                          href={extraActionHref(store.id)}
                          className="text-orange-600 hover:text-orange-800 hover:underline text-xs font-medium"
                        >
                          {extraActionLabel}
                        </Link>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
