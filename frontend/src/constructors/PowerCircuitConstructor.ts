import type { PowerCircuit } from "../types/PowerCircuit";

export const createDefaultPowerCircuit = (overrides: Partial<PowerCircuit> = {}): PowerCircuit => ({
  id: 1 as never,
  circuit_code: "C1" as never,
  phase: "L1" as never,
  rated_amp: 16 as never,
  maintenance_status: "NORMAL" as never,
  ...overrides
});

export const createPowerCircuitForm = createDefaultPowerCircuit;
export const createPowerCircuitResponse = createDefaultPowerCircuit;
