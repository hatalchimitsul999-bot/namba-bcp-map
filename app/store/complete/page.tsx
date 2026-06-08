import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="報告完了" variant="store" showLogout />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full text-center space-y-5">
          <div className="text-6xl">✅</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">報告を送信しました</h2>
            <p className="text-gray-500 text-sm mt-2">
              ご報告いただきありがとうございます。
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
            <div className="text-green-700 font-bold mb-2">送信内容</div>
            <div className="text-left text-green-700 space-y-1">
              <div>安否状況: <span className="font-medium">無事</span></div>
              <div>営業状況: <span className="font-medium">一部営業可能</span></div>
              <div>支援要請: <span className="font-medium">なし</span></div>
            </div>
            <div className="text-xs text-green-600 mt-2 border-t border-green-200 pt-2">
              報告日時: 2026-06-09 09:25
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
            状況が変わった場合は、再度報告を行ってください。
          </div>

          <Link
            href="/store"
            className="block w-full bg-red-600 text-white font-bold py-3 rounded-xl text-base hover:bg-red-700 transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
