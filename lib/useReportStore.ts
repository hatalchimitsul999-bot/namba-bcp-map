import { useState, useEffect } from "react";

export interface ReportDraft {
  safetyStatus: string;
  safetyMemo: string;
  damageItems: string[];
  damageDetail: string;
  businessStatus: string;
  businessMemo: string;
  needsSupport: string; // "" | "true" | "false"
  supportType: string;
  supportUrgency: string;
  supportDetail: string;
}

const STORAGE_KEY = "namba_bcp_draft";

export const emptyDraft: ReportDraft = {
  safetyStatus: "",
  safetyMemo: "",
  damageItems: [],
  damageDetail: "",
  businessStatus: "",
  businessMemo: "",
  needsSupport: "",
  supportType: "",
  supportUrgency: "",
  supportDetail: "",
};

export function useReportStore() {
  const [draft, setDraft] = useState<ReportDraft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDraft({ ...emptyDraft, ...JSON.parse(saved) });
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  const updateDraft = (partial: Partial<ReportDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  // hasStarted: safety status has been selected (minimum for individual update menus)
  const hasStarted = hydrated && draft.safetyStatus !== "";

  // hasSavedData: any key field is filled
  const hasSavedData =
    hydrated &&
    (draft.safetyStatus !== "" ||
      draft.businessStatus !== "" ||
      draft.needsSupport !== "");

  return { draft, updateDraft, hydrated, hasStarted, hasSavedData };
}
