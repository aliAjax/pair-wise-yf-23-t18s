export const CircuitStatus = ["ACTIVE", "MAINTENANCE"] as const;
export type CircuitStatus = (typeof CircuitStatus)[number];
export const CircuitStatusText: Record<CircuitStatus, string> = {
  ACTIVE: "正常",
  MAINTENANCE: "检修中"
};
