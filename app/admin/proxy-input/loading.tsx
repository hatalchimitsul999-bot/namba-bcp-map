import AppHeader from "@/components/AppHeader";

export default function ProxyInputLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="代理入力" backHref="/admin" variant="admin" showLogout />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
