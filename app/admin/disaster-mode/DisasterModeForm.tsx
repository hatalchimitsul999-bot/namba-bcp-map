"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import type { DisasterEvent } from "@/types";
import { startDisasterMode, endDisasterMode } from "./actions";

const eventTypeOptions = ["地震", "洪水", "台風", "火災", "土砂災害", "その他"];

interface DisasterModeFormProps {
  event: DisasterEvent | null;
  fetchError: string | null;
}

export default function DisasterModeForm({ event, fetchError }: DisasterModeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 終了フロー状態
  const [endStep, setEndStep] = useState<"idle" | "confirming" | "success">("idle");
  const [endError, setEndError] = useState<string | null>(null);

  // 開始フォーム状態
  const [name, setName] = useState("南海トラフ地震（訓練）");
  const [eventType, setEventType] = useState("地震");
  const [targetArea, setTargetArea] = useState("難波商店街全域");
  const [memo, setMemo] = useState("");
  const [startError, setStartError] = useState<string | null>(null);
  const [startSuccess, setStartSuccess] = useState(false);

  // ── 終了成功画面 ──
  if (endStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="モード切替" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">🔵</div>
            <h2 className="font-bold text-gray-800 text-lg">平常時モードに切り替わりました</h2>
            <p className="text-sm text-gray-500">災害時モードを終了しました。お疲れ様でした。</p>
            <button
              onClick={() => router.push("/admin")}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
            >
              管理トップへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 開始成功画面 ──
  if (startSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="モード切替" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">🔴</div>
            <h2 className="font-bold text-gray-800 text-lg">災害時モードを開始しました</h2>
            <p className="text-sm text-gray-500">各店舗への報告受付を開始しました。</p>
            <button
              onClick={() => router.refresh()}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700"
            >
              モード管理画面を確認する
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="w-full border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50"
            >
              管理トップへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 災害時モード稼働中 ──
  if (event) {
    const handleEnd = () => {
      setEndError(null);
      setEndStep("confirming");
    };

    const handleEndConfirm = () => {
      setEndError(null);
      startTransition(async () => {
        const result = await endDisasterMode(event.id);
        if (result.ok) {
          setEndStep("success");
        } else {
          setEndError(result.error ?? "終了処理に失敗しました");
          setEndStep("idle");
        }
      });
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="災害時モード切替" backHref="/admin" variant="admin" showLogout />

        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
          {/* 現在のモードバナー */}
          <div className="bg-red-600 text-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-red-100">現在のモード</div>
                <div className="font-bold text-xl mt-0.5">⚠ 災害時モード稼働中</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            </div>
            <div className="mt-2 text-red-100 text-sm space-y-0.5">
              <div>開始: {event.startedAt.replace("T", " ").slice(0, 16)}</div>
              <div>災害名: {event.name}</div>
              <div>対象: {event.targetArea}</div>
            </div>
          </div>

          {/* 現在のイベント情報 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-bold text-gray-700 text-sm">現在の災害イベント情報</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-500">災害種別</div>
              <div className="text-gray-800 font-medium">{event.eventType}</div>
              <div className="text-gray-500">対象エリア</div>
              <div className="text-gray-800 font-medium">{event.targetArea}</div>
              <div className="text-gray-500">開始日時</div>
              <div className="text-gray-800 font-medium">{event.startedAt.replace("T", " ").slice(0, 16)}</div>
              {event.memo && (
                <>
                  <div className="text-gray-500">メモ</div>
                  <div className="text-gray-800">{event.memo}</div>
                </>
              )}
            </div>
          </div>

          {/* 通知 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-blue-700 text-sm">全店舗への通知</h3>
            <p className="text-blue-600 text-xs">災害時モード開始を各店舗へ通知します</p>
            <a
              href="/admin/notifications"
              className="block w-full border-2 border-blue-400 text-blue-700 font-bold py-2.5 rounded-xl text-center text-sm hover:bg-blue-100 transition-colors"
            >
              📢 一斉通知を作成する
            </a>
          </div>

          {/* エラーメッセージ */}
          {endError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <p className="font-bold mb-1">終了処理に失敗しました</p>
              <p>{endError}</p>
            </div>
          )}

          {/* 終了ボタン */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-gray-700 text-sm">災害時モードを終了する</h3>
            <p className="text-gray-500 text-xs">
              終了するとシステムは平常時モードに戻ります。すべての報告内容は保存されます。
            </p>
            {endStep === "idle" ? (
              <button
                onClick={handleEnd}
                disabled={isPending}
                className="w-full border-2 border-red-400 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                🔴 災害時モードを終了する
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-red-600 font-bold">本当に終了しますか？</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEndConfirm}
                    disabled={isPending}
                    className={`flex-1 font-bold py-3 rounded-xl transition-colors ${
                      isPending
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isPending ? "保存中..." : "終了する"}
                  </button>
                  <button
                    onClick={() => setEndStep("idle")}
                    disabled={isPending}
                    className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100 disabled:opacity-50"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── 平常時モード（開始フォーム） ──
  const handleStart = () => {
    setStartError(null);
    startTransition(async () => {
      const result = await startDisasterMode({
        name: name.trim(),
        eventType,
        targetArea: targetArea.trim(),
        memo: memo.trim() || undefined,
      });
      if (result.ok) {
        setStartSuccess(true);
      } else {
        setStartError(result.error ?? "開始処理に失敗しました");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="災害時モード切替" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        {/* DB 取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">データ取得エラー</p>
            <p className="font-mono text-xs">{fetchError}</p>
          </div>
        )}

        {/* 現在のモードバナー（平常時） */}
        <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-100">現在のモード</div>
            <div className="font-bold text-xl mt-0.5">🔵 平常時モード</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-200" />
        </div>

        {/* 開始フォーム */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-bold text-gray-700 text-sm">新規災害時モードを開始する</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              災害名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
              placeholder="例: 南海トラフ地震（訓練）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              災害種別 <span className="text-red-500">*</span>
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              disabled={isPending}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
            >
              {eventTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              対象エリア <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              disabled={isPending}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
              placeholder="例: 難波商店街全域"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">管理者メモ（任意）</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isPending}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-gray-400 disabled:opacity-50"
              rows={3}
              placeholder="対応状況などをメモしてください"
            />
          </div>
        </div>

        {/* エラーメッセージ */}
        {startError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">開始処理に失敗しました</p>
            <p>{startError}</p>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={isPending || !name.trim() || !targetArea.trim()}
          className={`w-full font-bold py-4 rounded-xl text-base transition-colors ${
            isPending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          }`}
        >
          {isPending ? "保存中..." : "⚠ 災害時モードを開始する"}
        </button>
      </div>
    </div>
  );
}
