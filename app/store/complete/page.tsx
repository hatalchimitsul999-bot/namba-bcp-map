import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { safetyStatusLabels, businessStatusLabels, supportTypeLabels } from "@/lib/labels";

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ safety?: string; business?: string; support?: string; supportType?: string }>;
}) {
  const params = await searchParams;
  const safety = params.safety;
  const business = params.business;
  const support = params.support;
  const supportType = params.supportType;

  const safetyLabel = safety ? (safetyStatusLabels[safety] ?? safety) : null;
  const businessLabel = business ? (businessStatusLabels[business] ?? business) : null;
  const supportLabel =
    support === "true"
      ? (supportType ? supportTypeLabels[supportType] ?? "要請あり" : "要請あり")
      : support === "false"
      ? "なし"
      : null;

  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

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

          {safetyLabel || businessLabel || supportLabel ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
              <div className="text-green-700 font-bold mb-2">送信内容</div>
              <div className="text-left text-green-700 space-y-1">
                {safetyLabel && (
                  <div>安否状況: <span className="font-medium">{safetyLabel}</span></div>
                )}
                {businessLabel && (
                  <div>営業状況: <span className="font-medium">{businessLabel}</span></div>
                )}
                {supportLabel && (
                  <div>支援要請: <span className="font-medium">{supportLabel}</span></div>
                )}
              </div>
              <div className="text-xs text-green-600 mt-2 border-t border-green-200 pt-2">
                報告日時: {now}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
              報告内容が保存されました。
            </div>
          )}

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
