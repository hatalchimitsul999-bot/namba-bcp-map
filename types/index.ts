export type UserRole = "store_user" | "admin" | "external" | "system_admin";

export type ProfileRole = "admin" | "store" | "external";

export interface Profile {
  id: number;
  authUserId?: string;
  loginId: string;
  email: string;
  role: ProfileRole;
  storeId?: number;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  storeId?: number;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SafetyStatus = "safe" | "damaged" | "checking" | "evacuated" | "unknown";
export type BusinessStatus = "open" | "partially_open" | "closed" | "preparing" | "checking" | "unknown";
export type DamageItemName = "停電" | "断水" | "ガス停止" | "通信障害" | "建物損傷" | "設備破損" | "浸水" | "火災" | "人的被害" | "その他";
export type SupportType = "human_support" | "goods_support" | "cleanup" | "facility_check" | "building_check" | "reopen_support" | "other";
export type Urgency = "high" | "middle" | "low";
export type SupportStatus = "open" | "in_progress" | "closed";
export type DisasterEventStatus = "active" | "closed" | "training";
export type NotificationTargetType = "all" | "area" | "unreported" | "support_requested";
export type NotificationStatus = "draft" | "sent";

export interface Store {
  id: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  areaName: string;
  managerName: string;
  phone: string;
  email: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencyContact {
  id: number;
  storeId: number;
  contactName: string;
  relation: string;
  phone: string;
  email?: string;
  priority: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DisasterEvent {
  id: number;
  name: string;
  eventType: string;
  targetArea: string;
  startedAt: string;
  endedAt?: string;
  status: DisasterEventStatus;
  memo?: string;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DamageItem {
  id: number;
  name: DamageItemName;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportDamageItem {
  id: number;
  reportId: number;
  damageItemId: number;
  damageItemName: DamageItemName;
  detail?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Report {
  id: number;
  disasterEventId: number;
  storeId: number;
  safetyStatus: SafetyStatus;
  businessStatus: BusinessStatus;
  hasDamage: boolean;
  damageItems: ReportDamageItem[];
  hasSupportRequest: boolean;
  memo?: string;
  isProxy: boolean;
  proxyMethod?: string;
  reportedBy: number;
  reportedAt: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportRequest {
  id: number;
  disasterEventId: number;
  storeId: number;
  supportType: SupportType;
  urgency: Urgency;
  detail?: string;
  status: SupportStatus;
  assignedTo?: number;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Photo {
  id: number;
  reportId?: number;
  storeId: number;
  filePath: string;
  caption?: string;
  uploadedBy: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: number;
  disasterEventId?: number;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  status: NotificationStatus;
  createdBy?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationTarget {
  id: number;
  notificationId: number;
  storeId: number;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmergencySupply {
  id: number;
  name: string;
  storagePlace: string;
  quantity: number;
  unit: string;
  managerName: string;
  expirationDate?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OperationLog {
  id: number;
  userId: number;
  action: string;
  targetTable: string;
  targetId?: number;
  detail?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStores: number;
  reportedStores: number;
  unreportedStores: number;
  safeStores: number;
  damagedStores: number;
  openStores: number;
  closedStores: number;
  supportRequestsTotal: number;
  supportRequestsInProgress: number;
  supportRequestsClosed: number;
}
