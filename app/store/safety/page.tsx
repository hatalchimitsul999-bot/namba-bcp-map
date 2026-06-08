"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useReportStore } from "@/lib/useReportStore";

const options = [
  { value: "safe", label: "無事", emoji: "✅", desc: "人的被害なし、建物も問題なし", selectedClass: "border-green-400 bg-green-50" },
  { value: "damaged", label: "被害あり", emoji: "⚠️", desc: "建物・設備に被害が発生した", selectedClass: "border-red-400 bg-red-50" },
  { value: "checking", label: "確認中", emoji: "🔍", desc: "状況を確認している途中", selectedClass: "border-yellow-400 bg-yellow-50" },
  { value: "evacuated", label: "避難済み", emoji: "🚶", desc: "安全な場所に避難した", selectedClass: "border-orange-400 bg-orange-50" },
];

function SafetyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTop = searchParams.get("from") === "top";
  const { draft, updateDraft, hasSavedData } = useReportStore();

  const handleNext = () => {
    router.push(fromTop ? "/store" : "/store/damage");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="安否確認" backHref="/store" variant="store" showLogout />

      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5">
        {/* ステップ表示（フル報告ルートのみ） */}
        {!fromTop && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
            <span className="text-red-600 font-semibold">安否確認</span>
            <span className="text-gray-300 mx-1">›</span>
            <span>2 被害</span>
            <span className="text-gray-300 mx-1">›</span>
            <span>3 営業</span>
            <span className="text-gray-300 mx-1">›</span>
            <span>4 支援</span>
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

        <div>
          <h2 className="font-bold text-gray-800 text-base mb-3">安否状況を選択してください</h2>
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = draft.safetyStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateDraft({ safetyStatus: opt.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? opt.selectedClass + " shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <div className="font-bold text-base text-gray-900">{opt.label}</div>
                      <div className="text-sm text-gray-600">{opt.desc}</div>
                    </div>
                    {isSelected && <div className="ml-auto text-gray-700 font-bold">✓</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモ（任意）
          </label>
          <textarea
            value={draft.safetyMemo}
            onChange={(e) => updateDraft({ safetyMemo: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400"
            rows={3}
            placeholder="状況の詳細を入力してください"
          />
        </div>

        <button
          onClick={handleNext}
          disabled={!draft.safetyStatus}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-base hover:bg-red-700 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {fromTop ? "安否状況を更新する" : "次へ → 被害状況報告"}
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

export default function SafetyPage() {
  return (
    <Suspense>
      <SafetyPageContent />
    </Suspense>
  );
}
