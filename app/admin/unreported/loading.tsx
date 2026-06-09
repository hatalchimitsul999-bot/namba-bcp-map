import AppHeader from "@/components/AppHeader";

export default function UnreportedLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="未報告店舗一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 h-16 animate-pulse" />

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-8 bg-gray-100 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="flex-1 h-9 bg-gray-100 rounded-lg animate-pulse" />
                <div className="flex-1 h-9 bg-orange-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
