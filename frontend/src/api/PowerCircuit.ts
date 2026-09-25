import { mockData } from "../mocks/seedData";
import type { PowerCircuit } from "../types/PowerCircuit";

const endpoint = "/api/power-circuit";

export async function listPowerCircuit(): Promise<PowerCircuit[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.powerCircuit as unknown as PowerCircuit[])];
}

export async function savePowerCircuit(payload: PowerCircuit) {
  console.info("save PowerCircuit", payload);
  return payload;
}
