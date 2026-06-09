import AppHeader from "@/components/AppHeader";

export default function MapLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="BCPマップ" backHref="/admin" variant="admin" showLogout />
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 space-y-4">
        {/* フィルター */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        {/* 統計バー */}
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        {/* マップ */}
        <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
      </div>
    </div>
  );
}
