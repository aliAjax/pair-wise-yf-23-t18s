import type { CircuitStatus } from "./CircuitStatus";
import type { PowerPhase } from "./PowerPhase";

export interface PowerCircuit {
  id: number;
  circuit_code: string;
  phase: PowerPhase;
  rated_amps: number;
  status: CircuitStatus;
}
