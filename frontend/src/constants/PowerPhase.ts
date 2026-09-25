export const PowerPhase = ["L1", "L2", "L3"] as const;
export type PowerPhase = (typeof PowerPhase)[number];
export const PowerPhaseText: Record<PowerPhase, string> = {
  L1: "L1 相",
  L2: "L2 相",
  L3: "L3 相"
};
