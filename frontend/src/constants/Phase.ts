export const Phase = ["L1","L2","L3"] as const;
export type Phase = (typeof Phase)[number];
export const PhaseText: Record<Phase, string> = { L1: "L1 相", L2: "L2 相", L3: "L3 相" };
