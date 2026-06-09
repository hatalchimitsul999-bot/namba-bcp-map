"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { EmergencyContact } from "@/types";
import { addContact, removeContact } from "./actions";

export default function EmergencyContactsSection({
  contacts,
  storeId,
}: {
  contacts: EmergencyContact[];
  storeId: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAdd = (formData: FormData) => {
    setFormError(null);
    startTransition(async () => {
      const result = await addContact(formData);
      if (result.ok) {
        setShowForm(false);
        router.refresh();
      } else {
        setFormError(result.error ?? "追加に失敗しました");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("この緊急連絡先を削除しますか？")) return;
    setDeletingId(id);
    startTransition(async () => {
      await removeContact(id, storeId);
      setDeletingId(null);
      router.refresh();
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
        <h2 className="font-bold text-gray-700 text-sm">緊急連絡先</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            + 追加
          </button>
        )}
      </div>

      {/* 既存の連絡先リスト */}
      {contacts.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 py-1">緊急連絡先が登録されていません</p>
      )}

      {contacts.length > 0 && (
        <ul className="space-y-2 mb-3">
          {contacts.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-sm">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{c.contactName}</span>
                <span className="text-gray-500 text-xs ml-1">({c.relation})</span>
                <div className="text-xs text-gray-600 mt-0.5">{c.phone}</div>
                {c.email && <div className="text-xs text-gray-400">{c.email}</div>}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id || isPending}
                className="text-xs text-red-400 hover:text-red-600 disabled:opacity-40 mt-0.5 whitespace-nowrap"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 追加フォーム */}
      {showForm && (
        <form action={handleAdd} className="border border-blue-200 rounded-lg p-3 space-y-2 bg-blue-50">
          <input type="hidden" name="store_id" value={storeId} />

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact_name"
                required
                disabled={isPending}
                placeholder="例: 山田 太郎"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                続柄・役職 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="relation"
                required
                disabled={isPending}
                placeholder="例: 店長"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              required
              disabled={isPending}
              placeholder="例: 090-1234-5678"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              メール（任意）
            </label>
            <input
              type="email"
              name="email"
              disabled={isPending}
              placeholder="例: yamada@namba.jp"
              className={inputClass}
            />
          </div>

          {formError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-1.5">{formError}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormError(null); }}
              disabled={isPending}
              className="flex-1 border border-gray-300 text-gray-600 text-xs py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "追加中..." : "追加する"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
