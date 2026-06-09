import AppHeader from "@/components/AppHeader";
import ProxyInputForm from "./ProxyInputForm";
import { fetchStores } from "@/lib/db/stores";

export const dynamic = "force-dynamic";

export default async function ProxyInputPage() {
  const result = await fetchStores();
  const stores = result.data ?? [];
  const fetchError = result.error;

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="代理入力" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 max-w-sm w-full space-y-2">
            <p className="font-bold text-red-700 text-sm">店舗データの取得に失敗しました</p>
            <p className="text-red-600 text-xs font-mono break-all">{fetchError}</p>
            <p className="text-red-500 text-xs">時間をおいて再読み込みしてください。</p>
          </div>
        </div>
      </div>
    );
  }

  return <ProxyInputForm stores={stores} />;
}
