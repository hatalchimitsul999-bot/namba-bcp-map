"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useReportStore } from "@/lib/useReportStore";

const supportTypes = [
  { value: "human_support", label: "人員支援", emoji: "👷" },
  { value: "goods_support", label: "物資支援", emoji: "📦" },
  { value: "cleanup", label: "片付け支援", emoji: "🧹" },
  { value: "facility_check", label: "設備確認", emoji: "🔧" },
  { value: "building_check", label: "建物確認", emoji: "🏗" },
  { value: "reopen_support", label: "営業再開支援", emoji: "🏬" },
  { value: "other", label: "その他", emoji: "📋" },
];

const urgencyOptions = [
  { value: "high", label: "高（緊急）", color: "border-red-400 bg-red-50 text-red-800" },
  { value: "middle", label: "中（できれば早めに）", color: "border-orange-400 bg-orange-50 text-orange-800" },
  { value: "low", label: "低（急ぎではない）", color: "border-green-400 bg-green-50 text-green-800" },
];

function SupportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTop = searchParams.get("from") === "top";
  const backHref = fromTop ? "/store" : "/store/business";
  const { draft, updateDraft, hasSavedData } = useReportStore();

  const needsSupport = draft.needsSupport; // "" | "true" | "false"

  const handleNext = () => {
    router.push(fromTop ? "/store" : "/store/confirm");
  };

  const isNextDisabled =
    needsSupport === "" ||
    (needsSupport === "true" && (!draft.supportType || !draft.supportUrgency));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="支援要請" backHref={backHref} variant="store" showLogout />

      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5">
        {/* ステップ */}
        {!fromTop && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">4</span>
            <span className="text-red-600 font-semibold">支援要請</span>
            <span className="text-gray-300 mx-1">›</span>
            <span>5 確認</span>
          </div>
        )}

        {/* 一時保存インジケーター */}
        {hasSavedData && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
            <span>💾</span>
            <span>入力内容は一時保存されています</span>
          </div>
        )}

        {/* 支援要請の有無 */}
        <div>
          <h2 className="font-bold text-gray-800 text-base mb-3">支援は必要ですか？</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateDraft({ needsSupport: "false" })}
              className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${
                needsSupport === "false"
                  ? "border-green-400 bg-green-50 text-green-800"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <div className="text-2xl mb-1">✅</div>
              支援不要
            </button>
            <button
              onClick={() => updateDraft({ needsSupport: "true" })}
              className={`p-4 rounded-xl border-2 text-center font-bold transition-all ${
                needsSupport === "true"
                  ? "border-red-400 bg-red-50 text-red-800"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              <div className="text-2xl mb-1">🆘</div>
              支援が必要
            </button>
          </div>
        </div>

        {/* 支援が必要な場合の入力 */}
        {needsSupport === "true" && (
          <>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">支援の種別</h3>
              <div className="grid grid-cols-2 gap-2">
                {supportTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => updateDraft({ supportType: t.value })}
                    className={`p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all ${
                      draft.supportType === t.value
                        ? "border-purple-400 bg-purple-50 text-purple-800"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="text-sm font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">緊急度</h3>
              <div className="space-y-2">
                {urgencyOptions.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => updateDraft({ supportUrgency: u.value })}
                    className={`w-full p-3 rounded-xl border-2 text-left font-medium transition-all ${
                      draft.supportUrgency === u.value ? u.color : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細メモ（任意）
              </label>
              <textarea
                value={draft.supportDetail}
                onChange={(e) => updateDraft({ supportDetail: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400"
                rows={3}
                placeholder="支援内容の詳細を入力してください"
              />
            </div>
          </>
        )}

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-base hover:bg-red-700 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {fromTop ? "支援要請を更新する" : "次へ → 報告内容確認"}
        </button>

        {/* ホームに戻る（フル報告ルートのみ） */}
        {!fromTop && (
          <Link href="/store" className="block text-center text-sm text-gray-500 hover:text-gray-700 py-1">
            ← ホームに戻る
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense>
      <SupportPageContent />
    </Suspense>
  );
}
