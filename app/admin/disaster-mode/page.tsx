"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { mockDisasterEvent } from "@/lib/mockData";

export default function DisasterModePage() {
  const [mode, setMode] = useState<"active" | "closing" | "closed">("active");
  const [disasterName, setDisasterName] = useState("南海トラフ地震（訓練）");
  const [targetArea, setTargetArea] = useState("難波商店街全域");
  const [adminMemo, setAdminMemo] = useState("");

  if (mode === "closed") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="モード切替" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">🔵</div>
            <h2 className="font-bold text-gray-800 text-lg">平常時モードに切り替わりました</h2>
            <p className="text-sm text-gray-500">災害時モードを終了しました。お疲れ様でした。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="災害時モード切替" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        {/* 現在のモード */}
        <div className="bg-red-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-red-100">現在のモード</div>
              <div className="font-bold text-xl mt-0.5">⚠ 災害時モード稼働中</div>
            </div>
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          </div>
          <div className="mt-2 text-red-100 text-sm">
            <div>開始: {mockDisasterEvent.startedAt.replace("T", " ").slice(0, 16)}</div>
            <div>災害名: {mockDisasterEvent.name}</div>
          </div>
        </div>

        {/* 災害情報 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-bold text-gray-700 text-sm">現在の災害イベント情報</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">災害名</label>
            <input
              type="text"
              value={disasterName}
              onChange={(e) => setDisasterName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">対象エリア</label>
            <input
              type="text"
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">管理者メモ</label>
            <textarea
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              rows={3}
              placeholder="対応状況などをメモしてください"
            />
          </div>
        </div>

        {/* 通知発送エリア */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-blue-700 text-sm">全店舗への通知</h3>
          <p className="text-blue-600 text-xs">災害時モード開始を各店舗へ通知します</p>
          <button className="w-full border-2 border-blue-400 text-blue-700 font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-sm">
            📢 一斉通知を送信する
          </button>
        </div>

        {/* 終了ボタン */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-4 space-y-3">
          <h3 className="font-bold text-gray-700 text-sm">災害時モードを終了する</h3>
          <p className="text-gray-500 text-xs">
            終了するとシステムは平常時モードに戻ります。すべての報告内容は保存されます。
          </p>
          {mode === "active" ? (
            <button
              onClick={() => setMode("closing")}
              className="w-full border-2 border-red-400 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              🔴 災害時モードを終了する
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-600 font-bold">本当に終了しますか？</p>
              <div className="flex gap-2">
                <button onClick={() => setMode("closed")} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">
                  終了する
                </button>
                <button onClick={() => setMode("active")} className="flex-1 border border-gray-300 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100">
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
