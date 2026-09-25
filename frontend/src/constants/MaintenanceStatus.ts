export const MaintenanceStatus = ["NORMAL","MAINTENANCE"] as const;
export type MaintenanceStatus = (typeof MaintenanceStatus)[number];
export const MaintenanceStatusText: Record<MaintenanceStatus, string> = { NORMAL: "正常", MAINTENANCE: "检修中" };
