import { ERROR_CODES } from "../constants/errorCodes";
import { PHASE_VOLTAGE } from "../constants/PowerRules";
import { PowerPhase } from "../constants/PowerPhase";
import type { FixtureHookup } from "../types/FixtureHookup";
import type { PowerCircuit } from "../types/PowerCircuit";

export interface PlanIssue {
  code: string;
  circuit_id: number;
  fixture_id?: number;
  detail: string;
}

export const ampsForWatts = (watts: number): number => watts / PHASE_VOLTAGE;

export function computeCircuitLoads(hookups: FixtureHookup[]): Record<number, number> {
  const loads: Record<number, number> = {};
  for (const hookup of hookups) {
    if (hookup.circuit_id == null) continue;
    loads[hookup.circuit_id] = (loads[hookup.circuit_id] ?? 0) + ampsForWatts(hookup.wattage);
  }
  return loads;
}

export function computePhaseLoads(
  circuits: PowerCircuit[],
  hookups: FixtureHookup[]
): Record<PowerPhase, number> {
  const circuitLoads = computeCircuitLoads(hookups);
  const phaseLoads = Object.fromEntries(PowerPhase.map((phase) => [phase, 0])) as Record<PowerPhase, number>;
  for (const circuit of circuits) {
    phaseLoads[circuit.phase] += circuitLoads[circuit.id] ?? 0;
  }
  return phaseLoads;
}

// 负载差 = (最重相 - 最轻相) / 三相平均负载；空载视为平衡。
export function phaseImbalance(phaseLoads: Record<PowerPhase, number>): number {
  const values = PowerPhase.map((phase) => phaseLoads[phase]);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (avg <= 0) return 0;
  return (Math.max(...values) - Math.min(...values)) / avg;
}

// 校验一整版挂接方案：回路超载、挂到检修回路都要拦截。
export function validateHookups(hookups: FixtureHookup[], circuits: PowerCircuit[]): PlanIssue[] {
  const issues: PlanIssue[] = [];
  const circuitById = new Map(circuits.map((circuit) => [circuit.id, circuit]));
  for (const hookup of hookups) {
    if (hookup.circuit_id == null) continue;
    const circuit = circuitById.get(hookup.circuit_id);
    if (!circuit) continue;
    if (circuit.status === "MAINTENANCE") {
      issues.push({
        code: ERROR_CODES.CIRCUIT_IN_MAINTENANCE,
        circuit_id: circuit.id,
        fixture_id: hookup.fixture_id,
        detail: `回路 ${circuit.circuit_code} 正在检修，灯具 #${hookup.fixture_id} 不能挂接`
      });
    }
  }
  const circuitLoads = computeCircuitLoads(hookups);
  for (const circuit of circuits) {
    const load = circuitLoads[circuit.id] ?? 0;
    if (load > circuit.rated_amps) {
      issues.push({
        code: ERROR_CODES.CIRCUIT_OVERLOADED,
        circuit_id: circuit.id,
        detail: `回路 ${circuit.circuit_code} 负载 ${load.toFixed(1)}A，超过额定 ${circuit.rated_amps}A`
      });
    }
  }
  return issues;
}

export function deepCloneHookups(hookups: FixtureHookup[]): FixtureHookup[] {
  return hookups.map((hookup) => ({ ...hookup }));
}
