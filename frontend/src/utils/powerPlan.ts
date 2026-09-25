import type { Fixture } from "../types/Fixture";
import type { PowerCircuit } from "../types/PowerCircuit";
import { Phase } from "../constants/Phase";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { PHASE_IMBALANCE_TOLERANCE, SUPPLY_VOLTAGE_V } from "../constants/PowerConfig";
import { formatAmp } from "./formatters";

export interface CircuitLoad {
  circuit: PowerCircuit;
  fixtures: Fixture[];
  total_watt: number;
  load_amp: number;
  usage_ratio: number;
  overloaded: boolean;
}

export interface PhaseLoad {
  phase: Phase;
  circuits: PowerCircuit[];
  total_watt: number;
  load_amp: number;
  rated_amp: number;
  usage_ratio: number;
}

export interface PlanViolation {
  code: string;
  message: string;
  circuit_id: number | null;
  fixture_id: number | null;
}

export function computeCircuitLoads(fixtures: Fixture[], circuits: PowerCircuit[]): CircuitLoad[] {
  return circuits.map((circuit) => {
    const attached = fixtures.filter((fixture) => fixture.circuit_id === circuit.id);
    const total_watt = attached.reduce((sum, fixture) => sum + (Number(fixture.power_watt) || 0), 0);
    const load_amp = total_watt / SUPPLY_VOLTAGE_V;
    return {
      circuit,
      fixtures: attached,
      total_watt,
      load_amp,
      usage_ratio: circuit.rated_amp > 0 ? load_amp / circuit.rated_amp : 0,
      overloaded: load_amp > circuit.rated_amp
    };
  });
}

export function computePhaseLoads(circuitLoads: CircuitLoad[]): PhaseLoad[] {
  return Phase.map((phase) => {
    const loads = circuitLoads.filter((load) => load.circuit.phase === phase);
    const total_watt = loads.reduce((sum, load) => sum + load.total_watt, 0);
    const rated_amp = loads.reduce((sum, load) => sum + load.circuit.rated_amp, 0);
    const load_amp = total_watt / SUPPLY_VOLTAGE_V;
    return {
      phase,
      circuits: loads.map((load) => load.circuit),
      total_watt,
      load_amp,
      rated_amp,
      usage_ratio: rated_amp > 0 ? load_amp / rated_amp : 0
    };
  });
}

// 相位负载差 = (最重相 - 最轻相) / 最重相，空舞台按 0 处理
export function computeImbalanceRatio(phaseLoads: PhaseLoad[]): number {
  const amps = phaseLoads.map((load) => load.load_amp);
  const max = Math.max(...amps);
  const min = Math.min(...amps);
  return max > 0 ? (max - min) / max : 0;
}

export function isPhaseImbalanceExceeded(phaseLoads: PhaseLoad[]): boolean {
  return computeImbalanceRatio(phaseLoads) > PHASE_IMBALANCE_TOLERANCE;
}

// 方案级校验：任一回路超载、任一灯具接到检修回路，都视为不可用方案
export function validatePlan(fixtures: Fixture[], circuits: PowerCircuit[]): PlanViolation[] {
  const violations: PlanViolation[] = [];
  for (const load of computeCircuitLoads(fixtures, circuits)) {
    if (load.overloaded) {
      violations.push({
        code: ERROR_CODES.CIRCUIT_OVERLOADED,
        message: `${ERROR_MESSAGES.CIRCUIT_OVERLOADED}：${load.circuit.circuit_code} 负载 ${formatAmp(load.load_amp)} 超过额定 ${formatAmp(load.circuit.rated_amp)}`,
        circuit_id: load.circuit.id,
        fixture_id: null
      });
    }
  }
  for (const fixture of fixtures) {
    if (fixture.circuit_id == null) continue;
    const circuit = circuits.find((item) => item.id === fixture.circuit_id);
    if (!circuit) {
      violations.push({
        code: ERROR_CODES.VALIDATION_FAILED,
        message: `${ERROR_MESSAGES.VALIDATION_FAILED}：${fixture.fixture_code} 挂接的回路不存在`,
        circuit_id: null,
        fixture_id: fixture.id
      });
      continue;
    }
    if (circuit.maintenance_status === "MAINTENANCE") {
      violations.push({
        code: ERROR_CODES.CIRCUIT_UNDER_MAINTENANCE,
        message: `${ERROR_MESSAGES.CIRCUIT_UNDER_MAINTENANCE}：${fixture.fixture_code} → ${circuit.circuit_code}`,
        circuit_id: circuit.id,
        fixture_id: fixture.id
      });
    }
  }
  return violations;
}
