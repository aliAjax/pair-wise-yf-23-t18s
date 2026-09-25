import { LOG_TEMPLATES } from "../constants/logTemplates";
import { mockData } from "../mocks/seedData";
import type { FixtureHookup } from "../types/FixtureHookup";

const endpoint = "/api/fixture-hookup";

export async function listFixtureHookup(): Promise<FixtureHookup[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return (mockData.fixtureHookup as unknown as FixtureHookup[]).map((row) => ({ ...row }));
}

export async function saveFixtureHookup(payload: FixtureHookup) {
  console.info(LOG_TEMPLATES.FixtureHookup[0], payload);
  return payload;
}
