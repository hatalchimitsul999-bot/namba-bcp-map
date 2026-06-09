"use server";

import { revalidatePath } from "next/cache";
import {
  createEmergencyContact,
  deleteEmergencyContact,
} from "@/lib/db/emergencyContacts";

export async function addContact(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const storeId = Number(formData.get("store_id"));
  const contactName = (formData.get("contact_name") as string | null)?.trim() ?? "";
  const relation = (formData.get("relation") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() || undefined;

  if (!contactName) return { ok: false, error: "氏名を入力してください" };
  if (!relation) return { ok: false, error: "続柄・役職を入力してください" };
  if (!phone) return { ok: false, error: "電話番号を入力してください" };

  const { error } = await createEmergencyContact({ storeId, contactName, relation, phone, email });
  if (error) return { ok: false, error };

  revalidatePath(`/admin/stores/${storeId}`);
  return { ok: true };
}

export async function removeContact(id: number, storeId: number): Promise<{ ok: boolean; error?: string }> {
  const { error } = await deleteEmergencyContact(id);
  if (error) return { ok: false, error };
  revalidatePath(`/admin/stores/${storeId}`);
  return { ok: true };
}
