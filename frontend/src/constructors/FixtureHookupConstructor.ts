import type { FixtureHookup } from "../types/FixtureHookup";

export const createDefaultFixtureHookup = (overrides: Partial<FixtureHookup> = {}): FixtureHookup => ({
  id: 1,
  fixture_id: 1,
  wattage: 750,
  circuit_id: null,
  ...overrides
});

export const createFixtureHookupForm = createDefaultFixtureHookup;
export const createFixtureHookupResponse = createDefaultFixtureHookup;
