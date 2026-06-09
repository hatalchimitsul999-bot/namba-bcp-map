"use server";

import { revalidatePath } from "next/cache";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import {
  createNotification,
  updateNotificationStatus,
} from "@/lib/db/notifications";
import type { NotificationTargetType } from "@/types";

export async function submitNotification(input: {
  title: string;
  body: string;
  targetType: NotificationTargetType;
}): Promise<{ ok: boolean; error?: string }> {
  if (!input.title.trim()) return { ok: false, error: "タイトルを入力してください" };
  if (!input.body.trim()) return { ok: false, error: "本文を入力してください" };

  const { data: event } = await fetchActiveDisasterEvent();

  const { error } = await createNotification({
    disasterEventId: event?.id,
    title: input.title.trim(),
    body: input.body.trim(),
    targetType: input.targetType,
    status: "sent",
  });

  if (error) return { ok: false, error };

  revalidatePath("/admin/notifications");
  return { ok: true };
}

export async function saveDraftNotification(input: {
  title: string;
  body: string;
  targetType: NotificationTargetType;
}): Promise<{ ok: boolean; error?: string }> {
  if (!input.title.trim()) return { ok: false, error: "タイトルを入力してください" };

  const { data: event } = await fetchActiveDisasterEvent();

  const { error } = await createNotification({
    disasterEventId: event?.id,
    title: input.title.trim(),
    body: input.body.trim(),
    targetType: input.targetType,
    status: "draft",
  });

  if (error) return { ok: false, error };

  revalidatePath("/admin/notifications");
  return { ok: true };
}

export async function sendDraftNotification(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await updateNotificationStatus(id, "sent");
  if (error) return { ok: false, error };

  revalidatePath("/admin/notifications");
  return { ok: true };
}
