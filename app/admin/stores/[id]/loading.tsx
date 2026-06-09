import AppHeader from "@/components/AppHeader";

export default function StoreDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="店舗詳細" backHref="/admin/stores" variant="admin" showLogout />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 space-y-5">
        {["基本情報", "報告状況", "支援要請"].map((label) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
