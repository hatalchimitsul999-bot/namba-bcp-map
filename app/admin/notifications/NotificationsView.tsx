"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import type { Notification, NotificationTargetType } from "@/types";
import { submitNotification, saveDraftNotification, sendDraftNotification } from "./actions";

const targetOptions = [
  { value: "all", label: "全店舗", desc: "商店街に登録されているすべての店舗" },
  { value: "unreported", label: "未報告店舗のみ", desc: "まだ報告していない店舗のみ" },
  { value: "support_requested", label: "支援要請中の店舗", desc: "支援要請が出ている店舗のみ" },
  { value: "area", label: "エリア指定", desc: "特定エリアの店舗に絞る" },
];

const targetLabels: Record<string, string> = {
  all: "全店舗",
  unreported: "未報告のみ",
  support_requested: "支援要請中",
  area: "エリア指定",
};

const templates = [
  {
    label: "安否確認依頼",
    title: "安否確認のお願い",
    body: "災害時モードが開始されました。お手元のスマートフォンから速やかに安否確認・被害状況の報告をお願いします。",
  },
  {
    label: "再通知",
    title: "報告の再お願い",
    body: "まだご報告をいただいていません。状況をご確認のうえ、速やかにご報告をお願いいたします。",
  },
  {
    label: "支援案内",
    title: "支援活動について",
    body: "現在、支援チームが対応中です。支援が必要な場合はシステムから支援要請を行ってください。",
  },
];

interface NotificationsViewProps {
  notifications: Notification[];
  fetchError: string | null;
}

export default function NotificationsView({ notifications, fetchError }: NotificationsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDraftPending, startDraftTransition] = useTransition();

  const [target, setTarget] = useState<NotificationTargetType>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  // 下書き一覧で送信中の ID を管理
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const applyTemplate = (t: (typeof templates)[0]) => {
    setTitle(t.title);
    setBody(t.body);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitNotification({ title, body, targetType: target });
      if (result.ok) {
        setSubmitted(true);
        router.refresh();
      } else {
        setSubmitError(result.error ?? "送信に失敗しました");
      }
    });
  };

  const handleSaveDraft = () => {
    setDraftError(null);
    setDraftSaved(false);
    startDraftTransition(async () => {
      const result = await saveDraftNotification({ title, body, targetType: target });
      if (result.ok) {
        setDraftSaved(true);
        router.refresh();
      } else {
        setDraftError(result.error ?? "下書き保存に失敗しました");
      }
    });
  };

  const handleSendDraft = (id: number) => {
    setSendError(null);
    setSendingId(id);
    startTransition(async () => {
      const result = await sendDraftNotification(id);
      setSendingId(null);
      if (result.ok) {
        router.refresh();
      } else {
        setSendError(result.error ?? "送信に失敗しました");
      }
    });
  };

  const resetForm = () => {
    setSubmitted(false);
    setTitle("");
    setBody("");
    setTarget("all");
    setSubmitError(null);
    setDraftSaved(false);
  };

  const isFormDisabled = isPending || isDraftPending;
  const drafts = notifications.filter((n) => n.status === "draft");
  const sent = notifications.filter((n) => n.status === "sent");

  // ── 送信成功画面 ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="一斉通知" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">📢</div>
            <h2 className="font-bold text-gray-800 text-lg">通知を送信しました</h2>
            <p className="text-sm text-gray-500">対象店舗への通知が保存されました。</p>
            <button
              onClick={resetForm}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
            >
              続けて通知を送る
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="一斉通知作成" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        {/* DB取得エラー */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">データ取得エラー</p>
            <p className="font-mono text-xs">{fetchError}</p>
          </div>
        )}

        {/* 下書き一覧（送信待ち） */}
        {drafts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-yellow-800">
              📋 下書き ({drafts.length}件) — 送信待ち
            </h3>
            {sendError && (
              <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">{sendError}</p>
            )}
            <div className="space-y-2">
              {drafts.map((n) => (
                <div
                  key={n.id}
                  className="bg-white border border-yellow-200 rounded-lg p-3 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500">
                      {targetLabels[n.targetType] ?? n.targetType} ·{" "}
                      {n.createdAt.replace("T", " ").slice(0, 16)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendDraft(n.id)}
                    disabled={isPending && sendingId === n.id}
                    className="shrink-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isPending && sendingId === n.id ? "送信中..." : "送信する"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* テンプレート */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">テンプレートから選ぶ</p>
          <div className="flex gap-2 flex-wrap">
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(t)}
                disabled={isFormDisabled}
                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-100 disabled:opacity-50"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {/* 通知対象 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">通知対象</label>
            <div className="space-y-2">
              {targetOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    target === opt.value
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-white"
                  } ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    checked={target === opt.value}
                    onChange={() => setTarget(opt.value as NotificationTargetType)}
                    disabled={isFormDisabled}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-sm text-gray-800">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">通知タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isFormDisabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50"
              placeholder="通知のタイトルを入力"
            />
          </div>

          {/* 本文 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">通知本文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={isFormDisabled}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50"
              rows={5}
              placeholder="通知の本文を入力してください"
            />
          </div>
        </div>

        {/* エラーメッセージ */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">送信に失敗しました</p>
            <p>{submitError}</p>
          </div>
        )}
        {draftError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">下書き保存に失敗しました</p>
            <p>{draftError}</p>
          </div>
        )}
        {draftSaved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
            下書きを保存しました
          </div>
        )}

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={isFormDisabled || !title.trim()}
            className="flex-1 border-2 border-blue-300 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isDraftPending ? "保存中..." : "💾 下書き保存"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isFormDisabled || !title.trim() || !body.trim()}
            className={`flex-1 font-bold py-3.5 rounded-xl text-base transition-colors ${
              isFormDisabled || !title.trim() || !body.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPending ? "送信中..." : "📢 通知を送信する"}
          </button>
        </div>

        {/* 送信済み通知履歴 */}
        {sent.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">📜 送信済み通知履歴</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sent.map((n) => (
                <div
                  key={n.id}
                  className="border border-gray-100 rounded-lg p-3 space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <span className="shrink-0 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      送信済み
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{n.body}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{targetLabels[n.targetType] ?? n.targetType}</span>
                    <span>·</span>
                    <span>{n.createdAt.replace("T", " ").slice(0, 16)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
