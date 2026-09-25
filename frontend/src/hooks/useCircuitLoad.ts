import { useMemo } from "react";
import type { FixtureHookup } from "../types/FixtureHookup";
import type { PowerCircuit } from "../types/PowerCircuit";
import { computeCircuitLoads } from "../utils/powerMath";

export interface CircuitLoad {
  circuit: PowerCircuit;
  amps: number;
  utilization: number;
  overloaded: boolean;
}

export function useCircuitLoad(circuits: PowerCircuit[], hookups: FixtureHookup[]) {
  return useMemo<CircuitLoad[]>(() => {
    const loads = computeCircuitLoads(hookups);
    return circuits.map((circuit) => {
      const amps = loads[circuit.id] ?? 0;
      return {
        circuit,
        amps,
        utilization: circuit.rated_amps > 0 ? amps / circuit.rated_amps : 0,
        overloaded: amps > circuit.rated_amps
      };
    });
  }, [circuits, hookups]);
}
