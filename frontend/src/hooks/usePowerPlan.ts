import { useMemo } from "react";
import { usePowerDistributionStore } from "../stores/PowerDistributionStore";
import { computeCircuitLoads, computeImbalanceRatio, computePhaseLoads, isPhaseImbalanceExceeded, validatePlan } from "../utils/powerPlan";

export function usePowerPlan() {
  const fixtures = usePowerDistributionStore((state) => state.fixtures);
  const circuits = usePowerDistributionStore((state) => state.circuits);
  return useMemo(() => {
    const circuitLoads = computeCircuitLoads(fixtures, circuits);
    const phaseLoads = computePhaseLoads(circuitLoads);
    const imbalance = computeImbalanceRatio(phaseLoads);
    return {
      circuitLoads,
      phaseLoads,
      imbalance,
      imbalanceExceeded: isPhaseImbalanceExceeded(phaseLoads),
      violations: validatePlan(fixtures, circuits),
      totalWatt: fixtures.reduce((sum, fixture) => sum + (Number(fixture.power_watt) || 0), 0)
    };
  }, [fixtures, circuits]);
}
