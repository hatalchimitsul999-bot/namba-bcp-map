"use server";

import { revalidatePath } from "next/cache";
import { createStore, type CreateStoreInput } from "@/lib/db/stores";

export async function submitNewStore(
  input: CreateStoreInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!input.name.trim()) return { ok: false, error: "店舗名を入力してください" };
  if (!input.category.trim()) return { ok: false, error: "業種を入力してください" };
  if (!input.areaName.trim()) return { ok: false, error: "エリアを入力してください" };
  if (!input.address.trim()) return { ok: false, error: "住所を入力してください" };
  if (!input.managerName.trim()) return { ok: false, error: "担当者名を入力してください" };
  if (!input.phone.trim()) return { ok: false, error: "電話番号を入力してください" };
  if (!input.email.trim()) return { ok: false, error: "メールアドレスを入力してください" };
  if (isNaN(input.latitude) || isNaN(input.longitude)) {
    return { ok: false, error: "緯度・経度は数値で入力してください" };
  }

  const { error } = await createStore(input);
  if (error) return { ok: false, error };

  revalidatePath("/admin/stores");
  return { ok: true };
}
