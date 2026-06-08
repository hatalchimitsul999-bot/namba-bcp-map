import AppHeader from "@/components/AppHeader";
import StoreTable from "@/components/StoreTable";
import { mockStores } from "@/lib/mockData";

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="店舗一覧" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">全 {mockStores.length} 店舗</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="店舗名で検索..."
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <StoreTable stores={mockStores} />
        </div>
      </div>
    </div>
  );
}
