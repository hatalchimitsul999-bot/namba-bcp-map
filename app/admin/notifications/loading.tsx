import AppHeader from "@/components/AppHeader";

export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="一斉通知作成" backHref="/admin" variant="admin" showLogout />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        {/* テンプレートボタン */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        {/* フォームカード */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-28 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        {/* ボタン */}
        <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
