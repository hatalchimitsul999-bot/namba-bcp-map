import { supabase } from "@/lib/supabaseClient";
import type { DamageItemName } from "@/types";

/**
 * 指定レポートの被害項目を洗い替えする（削除 → 挿入）。
 * upsertReport 後に呼ぶこと。
 */
export async function replaceDamageItems(
  reportId: number,
  itemNames: DamageItemName[],
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase クライアントが初期化されていません" };
  try {
    const { error: deleteError } = await supabase
      .from("report_damage_items")
      .delete()
      .eq("report_id", reportId);
    if (deleteError) return { error: deleteError.message };

    if (itemNames.length > 0) {
      const { error: insertError } = await supabase
        .from("report_damage_items")
        .insert(itemNames.map((name) => ({ report_id: reportId, item_name: name })));
      if (insertError) return { error: insertError.message };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "不明なエラー" };
  }
}
