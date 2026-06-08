"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { mockStores } from "@/lib/mockData";

const safetyOptions = [
  { value: "safe", label: "無事" },
  { value: "damaged", label: "被害あり" },
  { value: "checking", label: "確認中" },
  { value: "evacuated", label: "避難済み" },
];

const businessOptions = [
  { value: "open", label: "営業可能" },
  { value: "partially_open", label: "一部営業可能" },
  { value: "closed", label: "営業停止" },
  { value: "preparing", label: "再開準備中" },
  { value: "checking", label: "確認中" },
];

const proxyMethods = [
  { value: "phone", label: "📞 電話確認" },
  { value: "onsite", label: "🚶 現地確認" },
  { value: "third_party", label: "👥 第三者確認" },
  { value: "other", label: "📝 その他" },
];

export default function ProxyInputPage() {
  const [storeId, setStoreId] = useState<string>("");
  const [safety, setSafety] = useState("");
  const [business, setBusiness] = useState("");
  const [proxyMethod, setProxyMethod] = useState("");
  const [memo, setMemo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader title="代理入力" backHref="/admin" variant="admin" showLogout />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="font-bold text-gray-800 text-lg">代理入力が完了しました</h2>
            <p className="text-sm text-gray-500">
              {mockStores.find((s) => String(s.id) === storeId)?.name} の情報を代理で登録しました。
            </p>
            <button
              onClick={() => { setSubmitted(false); setStoreId(""); setSafety(""); setBusiness(""); setProxyMethod(""); setMemo(""); }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
            >
              続けて代理入力する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="代理入力" backHref="/admin" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
          ✏️ 店舗に代わって報告情報を登録します。入力者（管理者）と確認方法が記録されます。
        </div>

        {/* 対象店舗 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">対象店舗</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                storeId === "" ? "text-gray-400" : "text-gray-900"
              }`}
            >
              <option value="">店舗を選択してください</option>
              {mockStores.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* 安否状況 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">安否状況</label>
            <div className="grid grid-cols-2 gap-2">
              {safetyOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setSafety(o.value)}
                  className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    safety === o.value
                      ? "border-blue-400 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* 営業状況 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">営業状況</label>
            <div className="grid grid-cols-2 gap-2">
              {businessOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setBusiness(o.value)}
                  className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    business === o.value
                      ? "border-blue-400 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* 確認方法 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">確認方法</label>
            <div className="grid grid-cols-2 gap-2">
              {proxyMethods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setProxyMethod(m.value)}
                  className={`py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    proxyMethod === m.value
                      ? "border-orange-400 bg-orange-50 text-orange-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">メモ（任意）</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400"
              rows={3}
              placeholder="確認した際のメモを入力してください"
            />
          </div>
        </div>

        <button
          onClick={() => setSubmitted(true)}
          disabled={!storeId || !safety || !business || !proxyMethod}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl text-base hover:bg-orange-600 transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          代理入力を登録する
        </button>
      </div>
    </div>
  );
}
