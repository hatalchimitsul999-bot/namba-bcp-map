"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useReportStore } from "@/lib/useReportStore";

const damageItems = [
  { value: "停電", emoji: "💡" },
  { value: "断水", emoji: "🚰" },
  { value: "ガス停止", emoji: "🔥" },
  { value: "通信障害", emoji: "📡" },
  { value: "建物損傷", emoji: "🏚" },
  { value: "設備破損", emoji: "🔧" },
  { value: "浸水", emoji: "💧" },
  { value: "火災", emoji: "🔴" },
  { value: "人的被害", emoji: "🚑" },
  { value: "その他", emoji: "📝" },
];

export default function DamagePage() {
  const router = useRouter();
  const { draft, updateDraft, hasSavedData } = useReportStore();

  const toggle = (v: string) => {
    const items = draft.damageItems.includes(v)
      ? draft.damageItems.filter((x) => x !== v)
      : [...draft.damageItems, v];
    updateDraft({ damageItems: items });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="被害状況報告" backHref="/store/safety" variant="store" showLogout />

      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5">
        {/* ステップ */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
          <span className="text-gray-300 mx-1">›</span>
          <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
          <span className="text-red-600 font-semibold">被害状況</span>
          <span className="text-gray-300 mx-1">›</span>
          <span>3 営業</span>
          <span className="text-gray-300 mx-1">›</span>
          <span>4 支援</span>
          <span className="text-gray-300 mx-1">›</span>
          <span>5 確認</span>
        </div>

        {/* 一時保存インジケーター */}
        {hasSavedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
            <span>💾</span>
            <span>入力内容は一時保存されています</span>
          </div>
        )}

        <div>
          <h2 className="font-bold text-gray-800 text-base mb-1">被害項目を選択してください</h2>
          <p className="text-sm text-gray-600 mb-3">該当するものをすべて選択（複数可）。被害がない場合は選択不要です。</p>
          <div className="grid grid-cols-2 gap-2">
            {damageItems.map((item) => {
              const isSelected = draft.damageItems.includes(item.value);
              return (
                <button
                  key={item.value}
                  onClick={() => toggle(item.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                    isSelected
                      ? "border-orange-400 bg-orange-50 text-orange-800"
                      : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium text-sm">{item.value}</span>
                  {isSelected && <span className="ml-auto text-orange-600 font-bold text-sm">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            詳細メモ（任意）
          </label>
          <textarea
            value={draft.damageDetail}
            onChange={(e) => updateDraft({ damageDetail: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400"
            rows={3}
            placeholder="被害の詳細を入力してください"
          />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-sm text-gray-600">
            📷 写真を撮影して送信することもできます
          </p>
          <button className="mt-2 text-blue-600 text-sm font-medium hover:underline">
            写真を添付する（任意）
          </button>
        </div>

        <button
          onClick={() => router.push("/store/business")}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-base hover:bg-red-700 transition-colors"
        >
          次へ → 営業状況報告
        </button>

        <Link href="/store" className="block text-center text-sm text-gray-500 hover:text-gray-700 py-1">
          ← ホームに戻る
        </Link>
      </div>
    </div>
  );
}
