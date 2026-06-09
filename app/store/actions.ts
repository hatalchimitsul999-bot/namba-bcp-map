"use server";

import { revalidatePath } from "next/cache";
import { fetchActiveDisasterEvent } from "@/lib/db/disasterEvents";
import { upsertReport } from "@/lib/db/reports";
import { upsertSupportRequest } from "@/lib/db/supportRequests";
import type { ReportDraft } from "@/lib/useReportStore";
import type { SafetyStatus, BusinessStatus, SupportType, Urgency } from "@/types";

const MOCK_STORE_ID = 1;

export async function submitReport(
  draft: ReportDraft,
): Promise<{ ok: boolean; error?: string }> {
  const { data: event, error: eventError } = await fetchActiveDisasterEvent();
  if (eventError) return { ok: false, error: eventError };
  if (!event) {
    return {
      ok: false,
      error: "稼働中の災害イベントがありません。管理者にお問い合わせください。",
    };
  }

  const hasDamage = draft.damageItems.length > 0;
  const hasSupportRequest = draft.needsSupport === "true";

  const memoParts = [draft.damageDetail, draft.safetyMemo, draft.businessMemo].filter(Boolean);
  const memo = memoParts.length > 0 ? memoParts.join(" / ") : undefined;

  const { error: reportError } = await upsertReport({
    disasterEventId: event.id,
    storeId: MOCK_STORE_ID,
    safetyStatus: (draft.safetyStatus || "unknown") as SafetyStatus,
    businessStatus: (draft.businessStatus || "unknown") as BusinessStatus,
    hasDamage,
    hasSupportRequest,
    memo,
    isProxy: false,
    reportedAt: new Date().toISOString(),
  });

  if (reportError) return { ok: false, error: reportError };

  if (hasSupportRequest && draft.supportType) {
    const { error: supportError } = await upsertSupportRequest({
      disasterEventId: event.id,
      storeId: MOCK_STORE_ID,
      supportType: draft.supportType as SupportType,
      urgency: (draft.supportUrgency || "middle") as Urgency,
      detail: draft.supportDetail || undefined,
    });

    if (supportError) return { ok: false, error: supportError };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/stores");
  revalidatePath("/admin/unreported");
  revalidatePath("/admin/support-requests");

  return { ok: true };
}
