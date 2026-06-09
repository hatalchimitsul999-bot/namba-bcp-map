import AppHeader from "@/components/AppHeader";

function CardSkeleton() {
  return <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-20 animate-pulse" />;
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="管理ダッシュボード" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-6">
        {/* 災害イベント情報スケルトン */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-24 animate-pulse" />

        {/* 各セクション */}
        {["報告状況", "安否状況", "営業状況", "支援要請"].map((label) => (
          <div key={label}>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
