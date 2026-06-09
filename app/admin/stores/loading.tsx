import AppHeader from "@/components/AppHeader";

export default function StoresLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="店舗一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-4">
        {/* 件数エリア */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-36 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* テーブルスケルトン */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {["店舗名", "業種", "エリア", "安否", "営業状況", "電話番号", "操作"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-gray-600 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-3 py-2"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-4 w-14 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
                    <td className="px-3 py-2"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
