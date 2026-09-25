import type { FixtureHookup } from "./FixtureHookup";
import type { PowerPhase } from "./PowerPhase";

export interface PowerSnapshot {
  id: number;
  name: string;
  created_at: string;
  total_watts: number;
  imbalance: number;
  phase_loads: Record<PowerPhase, number>;
  hookups: FixtureHookup[];
}
