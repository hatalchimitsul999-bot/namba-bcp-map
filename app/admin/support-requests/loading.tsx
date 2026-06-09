import AppHeader from "@/components/AppHeader";

export default function SupportRequestsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="支援要請一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="flex items-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="h-9 bg-yellow-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
