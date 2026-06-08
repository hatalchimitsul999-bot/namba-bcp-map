import AppHeader from "@/components/AppHeader";
import StatusBadge, { supportStatusBadgeColor, urgencyBadgeColor } from "@/components/StatusBadge";
import { mockSupportRequests, mockStores, supportTypeLabels, urgencyLabels, supportStatusLabels } from "@/lib/mockData";

export default function SupportRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="支援要請一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full">
            未対応 {mockSupportRequests.filter((s) => s.status === "open").length}
          </span>
          <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full">
            対応中 {mockSupportRequests.filter((s) => s.status === "in_progress").length}
          </span>
          <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
            対応済み {mockSupportRequests.filter((s) => s.status === "closed").length}
          </span>
        </div>

        <div className="space-y-3">
          {mockSupportRequests.map((req) => {
            const store = mockStores.find((s) => s.id === req.storeId);
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{store?.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {req.createdAt.replace("T", " ").slice(0, 16)} に登録
                    </p>
                  </div>
                  <StatusBadge label={supportStatusLabels[req.status]} color={supportStatusBadgeColor(req.status)} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge label={supportTypeLabels[req.supportType]} color="purple" />
                  <StatusBadge label={`緊急度: ${urgencyLabels[req.urgency]}`} color={urgencyBadgeColor(req.urgency)} />
                </div>

                {req.detail && (
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{req.detail}</p>
                )}

                <div className="flex gap-2 pt-1">
                  {req.status === "open" && (
                    <button className="flex-1 bg-yellow-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-yellow-600">
                      対応中に変更
                    </button>
                  )}
                  {req.status === "in_progress" && (
                    <button className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-green-600">
                      対応済みに変更
                    </button>
                  )}
                  {req.status === "closed" && (
                    <div className="flex-1 text-center text-green-600 text-sm font-medium py-2">✓ 対応済み</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
