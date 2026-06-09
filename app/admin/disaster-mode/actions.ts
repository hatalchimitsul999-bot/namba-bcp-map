"use server";

import { revalidatePath } from "next/cache";
import {
  createDisasterEvent,
  closeDisasterEvent,
  type CreateDisasterEventInput,
} from "@/lib/db/disasterEvents";

export async function startDisasterMode(
  input: CreateDisasterEventInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!input.name.trim()) return { ok: false, error: "災害名を入力してください" };
  if (!input.targetArea.trim()) return { ok: false, error: "対象エリアを入力してください" };

  const { error } = await createDisasterEvent(input);
  if (error) return { ok: false, error };

  revalidatePath("/admin");
  revalidatePath("/admin/disaster-mode");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/map");

  return { ok: true };
}

export async function endDisasterMode(
  eventId: number,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await closeDisasterEvent(eventId);
  if (error) return { ok: false, error };

  revalidatePath("/admin");
  revalidatePath("/admin/disaster-mode");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/map");
  revalidatePath("/admin/unreported");
  revalidatePath("/admin/support-requests");

  return { ok: true };
}
