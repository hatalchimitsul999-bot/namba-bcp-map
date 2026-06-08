"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";

const targetOptions = [
  { value: "all", label: "全店舗", desc: "商店街に登録されているすべての店舗" },
  { value: "unreported", label: "未報告店舗のみ", desc: "まだ報告していない店舗のみ" },
  { value: "area", label: "エリア指定", desc: "特定エリアの店舗に絞る" },
];

const templates = [
  { label: "安否確認依頼", title: "安否確認のお願い", body: "災害時モードが開始されました。お手元のスマートフォンから速やかに安否確認・被害状況の報告をお願いします。" },
  { label: "再通知", title: "報告の再お願い", body: "まだご報告をいただいていません。状況をご確認のうえ、速やかにご報告をお願いいたします。" },
  { label: "支援案内", title: "支援活動について", body: "現在、支援チームが対応中です。支援が必要な場合はシステムから支援要請を行ってください。" },
];

export default function NotificationsPage() {
  const [target, setTarget] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  const applyTemplate = (t: typeof templates[0]) => {
    setTitle(t.title);
    setBody(t.body);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="一斉通知" backHref="/admin" variant="admin" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">📢</div>
            <h2 className="font-bold text-gray-800 text-lg">通知を送信しました</h2>
            <p className="text-sm text-gray-500">対象店舗への通知が完了しました。</p>
            <button onClick={() => { setSent(false); setTitle(""); setBody(""); }} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
              続けて通知を送る
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
        {/* テンプレート */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">テンプレートから選ぶ</p>
          <div className="flex gap-2 flex-wrap">
            {templates.map((t) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(t)}
                className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
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
                <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  target === opt.value ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
                }`}>
                  <input
                    type="radio"
                    value={opt.value}
                    checked={target === opt.value}
                    onChange={() => setTarget(opt.value)}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              placeholder="通知のタイトルを入力"
            />
          </div>

          {/* 本文 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">通知本文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              rows={5}
              placeholder="通知の本文を入力してください"
            />
          </div>
        </div>

        <button
          onClick={() => setSent(true)}
          disabled={!title || !body}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          📢 通知を送信する
        </button>
      </div>
    </div>
  );
}
