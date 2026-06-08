export type UserRole = "store_user" | "admin" | "external" | "system_admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  storeId?: number;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export type SafetyStatus = "safe" | "damaged" | "checking" | "evacuated" | "unknown";
export type BusinessStatus = "open" | "partially_open" | "closed" | "preparing" | "checking" | "unknown";
export type DamageStatus = "停電" | "断水" | "ガス停止" | "通信障害" | "建物損傷" | "設備破損" | "浸水" | "火災" | "人的被害" | "その他";
export type SupportType = "human_support" | "goods_support" | "cleanup" | "facility_check" | "building_check" | "reopen_support" | "other";
export type Urgency = "high" | "middle" | "low";
export type SupportStatus = "open" | "in_progress" | "closed";
export type DisasterEventStatus = "active" | "closed" | "training";

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
}

export interface EmergencyContact {
  id: number;
  storeId: number;
  contactName: string;
  relation: string;
  phone: string;
  email?: string;
  priority: number;
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
}

export interface Report {
  id: number;
  disasterEventId: number;
  storeId: number;
  safetyStatus: SafetyStatus;
  businessStatus: BusinessStatus;
  hasDamage: boolean;
  damageItems: DamageStatus[];
  damageDetail?: string;
  hasSupportRequest: boolean;
  memo?: string;
  isProxy: boolean;
  proxyMethod?: string;
  reportedBy: number;
  reportedAt: string;
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
