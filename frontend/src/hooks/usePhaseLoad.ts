import { useMemo } from "react";
import { PHASE_IMBALANCE_LIMIT } from "../constants/PowerRules";
import type { FixtureHookup } from "../types/FixtureHookup";
import type { PowerCircuit } from "../types/PowerCircuit";
import { computePhaseLoads, phaseImbalance } from "../utils/powerMath";

export function usePhaseLoad(circuits: PowerCircuit[], hookups: FixtureHookup[]) {
  return useMemo(() => {
    const phaseLoads = computePhaseLoads(circuits, hookups);
    const imbalance = phaseImbalance(phaseLoads);
    const totalWatts = hookups.reduce((sum, hookup) => sum + hookup.wattage, 0);
    return {
      phaseLoads,
      imbalance,
      totalWatts,
      canPublish: imbalance <= PHASE_IMBALANCE_LIMIT
    };
  }, [circuits, hookups]);
}
