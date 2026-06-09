import type { Store, Report, SupportRequest, DisasterEvent, DashboardStats, EmergencyContact, DamageItem, ReportDamageItem } from "@/types";

export const mockDamageItems: DamageItem[] = [
  { id: 1, name: "停電", createdAt: "2024-01-01T00:00:00" },
  { id: 2, name: "断水", createdAt: "2024-01-01T00:00:00" },
  { id: 3, name: "ガス停止", createdAt: "2024-01-01T00:00:00" },
  { id: 4, name: "通信障害", createdAt: "2024-01-01T00:00:00" },
  { id: 5, name: "建物損傷", createdAt: "2024-01-01T00:00:00" },
  { id: 6, name: "設備破損", createdAt: "2024-01-01T00:00:00" },
  { id: 7, name: "浸水", createdAt: "2024-01-01T00:00:00" },
  { id: 8, name: "火災", createdAt: "2024-01-01T00:00:00" },
  { id: 9, name: "人的被害", createdAt: "2024-01-01T00:00:00" },
  { id: 10, name: "その他", createdAt: "2024-01-01T00:00:00" },
];

export const mockStores: Store[] = [
  { id: 1, name: "たこ焼き本舗 なんば店", category: "飲食店", address: "大阪府大阪市中央区難波3-1-1", latitude: 34.6687, longitude: 135.5013, areaName: "A エリア", managerName: "山田 太郎", phone: "06-1234-5678", email: "takoyaki@namba.jp", createdAt: "2024-01-10" },
  { id: 2, name: "アパレル NAMBA", category: "アパレル", address: "大阪府大阪市中央区難波3-1-5", latitude: 34.6690, longitude: 135.5020, areaName: "A エリア", managerName: "鈴木 花子", phone: "06-2345-6789", email: "apparel@namba.jp", createdAt: "2024-01-12" },
  { id: 3, name: "ドラッグストア ケア難波", category: "ドラッグストア", address: "大阪府大阪市中央区難波3-2-1", latitude: 34.6680, longitude: 135.5008, areaName: "A エリア", managerName: "佐藤 一郎", phone: "06-3456-7890", email: "care@namba.jp", createdAt: "2024-01-15" },
  { id: 4, name: "土産店 大阪みやげ", category: "土産店", address: "大阪府大阪市中央区難波3-2-8", latitude: 34.6695, longitude: 135.5030, areaName: "B エリア", managerName: "田中 幸子", phone: "06-4567-8901", email: "miyage@namba.jp", createdAt: "2024-01-18" },
  { id: 5, name: "カフェ ほっと", category: "飲食店", address: "大阪府大阪市中央区難波4-1-2", latitude: 34.6678, longitude: 135.5040, areaName: "B エリア", managerName: "中村 誠", phone: "06-5678-9012", email: "cafe@namba.jp", createdAt: "2024-01-20" },
  { id: 6, name: "電器店 エレクトロ難波", category: "電器店", address: "大阪府大阪市中央区難波4-2-1", latitude: 34.6702, longitude: 135.5018, areaName: "B エリア", managerName: "小林 健太", phone: "06-6789-0123", email: "electro@namba.jp", createdAt: "2024-02-01" },
  { id: 7, name: "書店 なんばブックス", category: "書店", address: "大阪府大阪市中央区難波4-3-5", latitude: 34.6710, longitude: 135.5025, areaName: "C エリア", managerName: "加藤 美咲", phone: "06-7890-1234", email: "books@namba.jp", createdAt: "2024-02-05" },
  { id: 8, name: "靴店 シューズパラダイス", category: "ファッション", address: "大阪府大阪市中央区難波4-4-2", latitude: 34.6715, longitude: 135.5010, areaName: "C エリア", managerName: "渡辺 隆", phone: "06-8901-2345", email: "shoes@namba.jp", createdAt: "2024-02-10" },
  { id: 9, name: "居酒屋 大阪の夜", category: "飲食店", address: "大阪府大阪市中央区難波5-1-3", latitude: 34.6698, longitude: 135.5045, areaName: "C エリア", managerName: "松本 和也", phone: "06-9012-3456", email: "izakaya@namba.jp", createdAt: "2024-02-15" },
  { id: 10, name: "コンビニ ナムバマート", category: "コンビニ", address: "大阪府大阪市中央区難波5-2-1", latitude: 34.6672, longitude: 135.5028, areaName: "A エリア", managerName: "伊藤 博", phone: "06-0123-4567", email: "conbini@namba.jp", createdAt: "2024-02-20" },
  { id: 11, name: "雑貨店 なんばライフ", category: "雑貨", address: "大阪府大阪市中央区難波5-3-4", latitude: 34.6683, longitude: 135.5050, areaName: "B エリア", managerName: "清水 久美", phone: "06-1111-2222", email: "life@namba.jp", createdAt: "2024-03-01" },
  { id: 12, name: "眼鏡店 ビジョン難波", category: "眼鏡", address: "大阪府大阪市中央区難波5-4-7", latitude: 34.6707, longitude: 135.5035, areaName: "C エリア", managerName: "橋本 真一", phone: "06-2222-3333", email: "vision@namba.jp", createdAt: "2024-03-05" },
];

export const mockEmergencyContacts: EmergencyContact[] = [
  { id: 1, storeId: 1, contactName: "山田 次郎", relation: "家族", phone: "090-1234-5678", priority: 1, createdAt: "2024-01-10" },
  { id: 2, storeId: 2, contactName: "鈴木 一郎", relation: "家族", phone: "090-2345-6789", priority: 1, createdAt: "2024-01-12" },
  { id: 3, storeId: 3, contactName: "佐藤 花子", relation: "配偶者", phone: "090-3456-7890", priority: 1, createdAt: "2024-01-15" },
  { id: 4, storeId: 4, contactName: "田中 太郎", relation: "家族", phone: "090-4567-8901", priority: 1, createdAt: "2024-01-18" },
  { id: 5, storeId: 5, contactName: "中村 恵", relation: "配偶者", phone: "090-5678-9012", priority: 1, createdAt: "2024-01-20" },
];

export const mockDisasterEvent: DisasterEvent = {
  id: 1,
  name: "南海トラフ地震（訓練）",
  eventType: "地震",
  targetArea: "難波商店街全域",
  startedAt: "2026-06-09T09:00:00",
  status: "active",
  memo: "震度6強を想定した訓練モードです",
  createdBy: 100,
  createdAt: "2026-06-09T08:55:00",
};

const rdi = (id: number, reportId: number, damageItemId: number, damageItemName: ReportDamageItem["damageItemName"], reportedAt: string, detail?: string): ReportDamageItem => ({
  id, reportId, damageItemId, damageItemName, detail, createdAt: reportedAt,
});

export const mockReports: Report[] = [
  {
    id: 1, disasterEventId: 1, storeId: 1,
    safetyStatus: "safe", businessStatus: "open",
    hasDamage: false, damageItems: [],
    hasSupportRequest: false, memo: "軽微なひび割れあり。営業継続中",
    isProxy: false, reportedBy: 1, reportedAt: "2026-06-09T09:15:00", createdAt: "2026-06-09T09:15:00",
  },
  {
    id: 2, disasterEventId: 1, storeId: 2,
    safetyStatus: "damaged", businessStatus: "closed",
    hasDamage: true, damageItems: [
      rdi(1, 2, 5, "建物損傷", "2026-06-09T09:20:00", "壁に亀裂。什器が倒れた"),
      rdi(2, 2, 6, "設備破損", "2026-06-09T09:20:00"),
    ],
    hasSupportRequest: true,
    isProxy: false, reportedBy: 2, reportedAt: "2026-06-09T09:20:00", createdAt: "2026-06-09T09:20:00",
  },
  {
    id: 3, disasterEventId: 1, storeId: 3,
    safetyStatus: "safe", businessStatus: "partially_open",
    hasDamage: true, damageItems: [
      rdi(3, 3, 1, "停電", "2026-06-09T09:25:00", "停電中だが自家発電で対応"),
    ],
    hasSupportRequest: false,
    isProxy: false, reportedBy: 3, reportedAt: "2026-06-09T09:25:00", createdAt: "2026-06-09T09:25:00",
  },
  {
    id: 4, disasterEventId: 1, storeId: 4,
    safetyStatus: "evacuated", businessStatus: "closed",
    hasDamage: true, damageItems: [
      rdi(4, 4, 7, "浸水", "2026-06-09T09:30:00"),
      rdi(5, 4, 1, "停電", "2026-06-09T09:30:00"),
    ],
    hasSupportRequest: true,
    isProxy: false, reportedBy: 4, reportedAt: "2026-06-09T09:30:00", createdAt: "2026-06-09T09:30:00",
  },
  {
    id: 5, disasterEventId: 1, storeId: 5,
    safetyStatus: "safe", businessStatus: "open",
    hasDamage: false, damageItems: [],
    hasSupportRequest: false,
    isProxy: false, reportedBy: 5, reportedAt: "2026-06-09T09:35:00", createdAt: "2026-06-09T09:35:00",
  },
  {
    id: 6, disasterEventId: 1, storeId: 6,
    safetyStatus: "checking", businessStatus: "checking",
    hasDamage: true, damageItems: [
      rdi(6, 6, 2, "断水", "2026-06-09T10:00:00"),
      rdi(7, 6, 5, "建物損傷", "2026-06-09T10:00:00"),
    ],
    hasSupportRequest: true,
    isProxy: true, proxyMethod: "電話確認", reportedBy: 100, reportedAt: "2026-06-09T10:00:00", createdAt: "2026-06-09T10:00:00",
  },
  {
    id: 7, disasterEventId: 1, storeId: 9,
    safetyStatus: "safe", businessStatus: "preparing",
    hasDamage: false, damageItems: [],
    hasSupportRequest: false, memo: "本日の営業は停止。明日再開予定",
    isProxy: false, reportedBy: 9, reportedAt: "2026-06-09T09:50:00", createdAt: "2026-06-09T09:50:00",
  },
  {
    id: 8, disasterEventId: 1, storeId: 10,
    safetyStatus: "safe", businessStatus: "open",
    hasDamage: false, damageItems: [],
    hasSupportRequest: false,
    isProxy: false, reportedBy: 10, reportedAt: "2026-06-09T09:10:00", createdAt: "2026-06-09T09:10:00",
  },
];

export const mockSupportRequests: SupportRequest[] = [
  { id: 1, disasterEventId: 1, storeId: 2, supportType: "cleanup", urgency: "high", detail: "什器が多数倒れており、片付けの人員支援が必要", status: "open", createdBy: 2, createdAt: "2026-06-09T09:20:00" },
  { id: 2, disasterEventId: 1, storeId: 4, supportType: "building_check", urgency: "high", detail: "浸水被害あり。建物の安全確認をお願いしたい", status: "in_progress", assignedTo: 100, createdBy: 4, createdAt: "2026-06-09T09:30:00" },
  { id: 3, disasterEventId: 1, storeId: 6, supportType: "goods_support", urgency: "middle", detail: "断水のため飲料水の支援をお願いしたい", status: "open", createdBy: 100, createdAt: "2026-06-09T10:00:00" },
];

export const mockDashboardStats: DashboardStats = {
  totalStores: 12,
  reportedStores: 8,
  unreportedStores: 4,
  safeStores: 5,
  damagedStores: 3,
  openStores: 3,
  closedStores: 3,
  supportRequestsTotal: 3,
  supportRequestsInProgress: 1,
  supportRequestsClosed: 0,
};

export const unreportedStores = mockStores.filter(
  (s) => !mockReports.find((r) => r.storeId === s.id)
);

export function getReportByStoreId(storeId: number): Report | undefined {
  return mockReports.find((r) => r.storeId === storeId);
}

export function getSupportRequestsByStoreId(storeId: number): SupportRequest[] {
  return mockSupportRequests.filter((s) => s.storeId === storeId);
}

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
