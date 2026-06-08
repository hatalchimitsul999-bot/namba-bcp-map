"use client";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useReportStore } from "@/lib/useReportStore";

const options = [
  { value: "open", label: "営業可能", emoji: "🟢", desc: "通常通り営業できる" },
  { value: "partially_open", label: "一部営業可能", emoji: "🟡", desc: "一部の商品・サービスのみ提供可" },
  { value: "closed", label: "営業停止", emoji: "🔴", desc: "営業できない状態" },
  { value: "preparing", label: "再開準備中", emoji: "🔄", desc: "近日中に再開予定" },
  { value: "checking", label: "確認中", emoji: "🔍", desc: "判断できていない" },
];

function BusinessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTop = searchParams.get("from") === "top";
  const backHref = fromTop ? "/store" : "/store/damage";
  const { draft, updateDraft, hasSavedData } = useReportStore();

  const handleNext = () => {
    router.push(fromTop ? "/store" : "/store/support");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="営業状況報告" backHref={backHref} variant="store" showLogout />

      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-5">
        {/* ステップ */}
        {!fromTop && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">2</span>
            <span className="text-gray-300 mx-1">›</span>
            <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">3</span>
            <span className="text-red-600 font-semibold">営業状況</span>
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
          <h2 className="font-bold text-gray-800 text-base mb-3">現在の営業状況を選択してください</h2>
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = draft.businessStatus === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => updateDraft({ businessStatus: opt.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-blue-400 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-base text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-600">{opt.desc}</div>
                  </div>
                  {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            営業再開見込み・メモ（任意）
          </label>
          <textarea
            value={draft.businessMemo}
            onChange={(e) => updateDraft({ businessMemo: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-3 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400"
            rows={3}
            placeholder="例: 明日午前中には再開予定"
          />
        </div>

        <button
          onClick={handleNext}
          disabled={!draft.businessStatus}
          className="w-full bg-red-600 text-white font-bold py-4 rounded-xl text-base hover:bg-red-700 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {fromTop ? "営業状況を更新する" : "次へ → 支援要請"}
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

export default function BusinessPage() {
  return (
    <Suspense>
      <BusinessPageContent />
    </Suspense>
  );
}
