import type { PowerCircuit } from "../types/PowerCircuit";

export const createDefaultPowerCircuit = (overrides: Partial<PowerCircuit> = {}): PowerCircuit => ({
  id: 1,
  circuit_code: "C-101",
  phase: "L1",
  rated_amps: 32,
  status: "ACTIVE",
  ...overrides
});

export const createPowerCircuitForm = createDefaultPowerCircuit;
export const createPowerCircuitResponse = createDefaultPowerCircuit;
