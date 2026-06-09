"use server";

import { revalidatePath } from "next/cache";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { upsertReport } from "@/lib/db/reports";
import type { SafetyStatus, BusinessStatus } from "@/types";

export type ProxyReportInput = {
  storeId: number;
  safetyStatus: string;
  businessStatus: string;
  proxyMethod: string;
  memo: string;
};

export async function submitProxyReport(
  input: ProxyReportInput,
): Promise<{ ok: boolean; error?: string }> {
  const { data: event, error: eventError } = await fetchActiveDisasterEvent();
  if (eventError) return { ok: false, error: eventError };
  if (!event) {
    return {
      ok: false,
      error: "稼働中の災害イベントがありません。管理者にお問い合わせください。",
    };
  }

  const { error } = await upsertReport({
    disasterEventId: event.id,
    storeId: input.storeId,
    safetyStatus: input.safetyStatus as SafetyStatus,
    businessStatus: input.businessStatus as BusinessStatus,
    hasDamage: false,
    hasSupportRequest: false,
    memo: input.memo || undefined,
    isProxy: true,
    proxyMethod: input.proxyMethod,
    reportedAt: new Date().toISOString(),
  });

  if (error) return { ok: false, error };

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/stores");
  revalidatePath("/admin/unreported");

  return { ok: true };
}
