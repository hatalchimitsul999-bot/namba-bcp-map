"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { submitNewStore } from "./actions";

const categoryOptions = [
  "飲食店", "アパレル", "ドラッグストア", "土産店", "コンビニ",
  "電器店", "書店", "ファッション", "雑貨", "眼鏡", "その他",
];

type Field = {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: string;
  step?: string;
};

const fields: Field[] = [
  { key: "name",        label: "店舗名",         placeholder: "例: たこ焼き本舗 なんば店",  required: true },
  { key: "areaName",    label: "エリア",          placeholder: "例: A エリア",              required: true },
  { key: "address",     label: "住所",            placeholder: "例: 大阪府大阪市中央区難波3-1-1", required: true },
  { key: "latitude",    label: "緯度",            placeholder: "例: 34.6687",              required: true, type: "number", step: "0.000001" },
  { key: "longitude",   label: "経度",            placeholder: "例: 135.5013",             required: true, type: "number", step: "0.000001" },
  { key: "managerName", label: "担当者名",         placeholder: "例: 山田 太郎",            required: true },
  { key: "phone",       label: "電話番号",         placeholder: "例: 06-1234-5678",         required: true },
  { key: "email",       label: "メールアドレス",   placeholder: "例: store@namba.jp",       required: true, type: "email" },
  { key: "note",        label: "備考",            placeholder: "任意メモ",                  required: false },
];

export default function StoreForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [values, setValues] = useState<Record<string, string>>({
    name: "", category: "", areaName: "", address: "",
    latitude: "", longitude: "", managerName: "", phone: "", email: "", note: "",
  });

  const set = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitNewStore({
        name: values.name.trim(),
        category: values.category.trim(),
        areaName: values.areaName.trim(),
        address: values.address.trim(),
        latitude: parseFloat(values.latitude),
        longitude: parseFloat(values.longitude),
        managerName: values.managerName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        note: values.note.trim() || undefined,
      });

      if (result.ok) {
        router.push("/admin/stores");
      } else {
        setSubmitError(result.error ?? "登録に失敗しました");
      }
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title="新規店舗登録" backHref="/admin/stores" variant="admin" showLogout />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {/* 業種（セレクト） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              業種 <span className="text-red-500">*</span>
            </label>
            <select
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              disabled={isPending}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* その他のフィールド */}
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {f.label}
                {f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              <input
                type={f.type ?? "text"}
                step={f.step}
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                disabled={isPending}
                placeholder={f.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* エラーメッセージ */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            <p className="font-bold mb-1">登録に失敗しました</p>
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/stores")}
            disabled={isPending}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-3.5 rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className={`flex-1 font-bold py-3.5 rounded-xl transition-colors ${
              isPending
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPending ? "登録中..." : "店舗を登録する"}
          </button>
        </div>
      </div>
    </div>
  );
}
