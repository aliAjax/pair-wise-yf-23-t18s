import type { Fixture } from "../types/Fixture";
import type { PowerCircuit } from "../types/PowerCircuit";
import type { ShowSnapshot, SnapshotHookup } from "../types/ShowSnapshot";
import { UNASSIGNED_CIRCUIT_TEXT } from "../constants/statusText";
import { computeCircuitLoads, computeImbalanceRatio, computePhaseLoads } from "../utils/powerPlan";

export const createDefaultShowSnapshot = (overrides: Partial<ShowSnapshot> = {}): ShowSnapshot => ({
  id: 1 as never,
  title: "title 1" as never,
  published_at: "2026-09-25T19:30:00Z" as never,
  hookups: [] as never,
  circuits: [] as never,
  phase_loads: [] as never,
  total_watt: 0 as never,
  imbalance_ratio: 0 as never,
  ...overrides
});

// 发布即冻结：深拷贝当前方案的灯具挂接与回路配置，后续调整不会渗进快照
export const createSnapshotFromPlan = (
  fixtures: Fixture[],
  circuits: PowerCircuit[],
  title: string,
  id: number,
  published_at: string
): ShowSnapshot => {
  const phaseLoads = computePhaseLoads(computeCircuitLoads(fixtures, circuits));
  const hookups: SnapshotHookup[] = fixtures.map((fixture) => {
    const circuit = circuits.find((item) => item.id === fixture.circuit_id) ?? null;
    return {
      fixture_id: fixture.id,
      fixture_code: fixture.fixture_code,
      power_watt: fixture.power_watt,
      circuit_id: circuit?.id ?? null,
      circuit_code: circuit?.circuit_code ?? UNASSIGNED_CIRCUIT_TEXT,
      phase: circuit?.phase ?? null
    };
  });
  return {
    id,
    title,
    published_at,
    hookups,
    circuits: circuits.map((circuit) => ({ ...circuit })),
    phase_loads: phaseLoads.map((load) => ({ phase: load.phase, total_watt: load.total_watt, load_amp: load.load_amp })),
    total_watt: fixtures.reduce((sum, fixture) => sum + (Number(fixture.power_watt) || 0), 0),
    imbalance_ratio: computeImbalanceRatio(phaseLoads)
  };
};

export const createShowSnapshotForm = createDefaultShowSnapshot;
export const createShowSnapshotResponse = createDefaultShowSnapshot;
