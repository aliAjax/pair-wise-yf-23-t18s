import { LOG_TEMPLATES } from "../constants/logTemplates";
import { mockData } from "../mocks/seedData";
import type { PowerSnapshot } from "../types/PowerSnapshot";

const endpoint = "/api/power-snapshot";

export async function listPowerSnapshot(): Promise<PowerSnapshot[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return (mockData.powerSnapshot as unknown as PowerSnapshot[]).map((row) => ({
    ...row,
    phase_loads: { ...row.phase_loads },
    hookups: row.hookups.map((hookup) => ({ ...hookup }))
  }));
}

export async function savePowerSnapshot(payload: PowerSnapshot) {
  console.info(LOG_TEMPLATES.PowerSnapshot[0], payload);
  return payload;
}
