export const safetyStatusLabels: Record<string, string> = {
  safe: "無事",
  damaged: "被害あり",
  checking: "確認中",
  evacuated: "避難済み",
  unknown: "未確認",
};

export const businessStatusLabels: Record<string, string> = {
  open: "営業可能",
  partially_open: "一部営業可能",
  closed: "営業停止",
  preparing: "再開準備中",
  checking: "確認中",
  unknown: "未確認",
};

export const supportTypeLabels: Record<string, string> = {
  human_support: "人員支援",
  goods_support: "物資支援",
  cleanup: "片付け支援",
  facility_check: "設備確認",
  building_check: "建物確認",
  reopen_support: "営業再開支援",
  other: "その他",
};

export const urgencyLabels: Record<string, string> = {
  high: "高",
  middle: "中",
  low: "低",
};

export const supportStatusLabels: Record<string, string> = {
  open: "未対応",
  in_progress: "対応中",
  closed: "対応済み",
};
