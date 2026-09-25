import type { Phase } from "./Phase";
import type { PowerCircuit } from "./PowerCircuit";

export interface SnapshotHookup {
  fixture_id: number;
  fixture_code: string;
  power_watt: number;
  circuit_id: number | null;
  circuit_code: string;
  phase: Phase | null;
}

export interface SnapshotPhaseLoad {
  phase: Phase;
  total_watt: number;
  load_amp: number;
}

export interface ShowSnapshot {
  id: number;
  title: string;
  published_at: string;
  hookups: SnapshotHookup[];
  circuits: PowerCircuit[];
  phase_loads: SnapshotPhaseLoad[];
  total_watt: number;
  imbalance_ratio: number;
}
