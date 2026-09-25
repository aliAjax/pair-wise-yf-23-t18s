import type { FixtureHookup } from "../types/FixtureHookup";
import type { PowerCircuit } from "../types/PowerCircuit";
import type { PowerSnapshot } from "../types/PowerSnapshot";
import { computePhaseLoads, deepCloneHookups, phaseImbalance } from "../utils/powerMath";

export const createDefaultPowerSnapshot = (overrides: Partial<PowerSnapshot> = {}): PowerSnapshot => ({
  id: 1,
  name: "演出快照 1",
  created_at: "2026-09-25T20:00:00+08:00",
  total_watts: 0,
  imbalance: 0,
  phase_loads: { L1: 0, L2: 0, L3: 0 },
  hookups: [],
  ...overrides
});

// 发布即冻结：深拷贝当前挂接与相位负载，后续灯具调整不影响已发布快照。
export const createSnapshotFromPlan = (
  id: number,
  name: string,
  hookups: FixtureHookup[],
  circuits: PowerCircuit[],
  createdAt: string = new Date().toISOString()
): PowerSnapshot => {
  const phaseLoads = computePhaseLoads(circuits, hookups);
  return createDefaultPowerSnapshot({
    id,
    name,
    created_at: createdAt,
    total_watts: hookups.reduce((sum, hookup) => sum + hookup.wattage, 0),
    imbalance: phaseImbalance(phaseLoads),
    phase_loads: phaseLoads,
    hookups: deepCloneHookups(hookups)
  });
};

export const createPowerSnapshotForm = createDefaultPowerSnapshot;
export const createPowerSnapshotResponse = createDefaultPowerSnapshot;
