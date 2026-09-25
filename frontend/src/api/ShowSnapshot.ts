import { mockData } from "../mocks/seedData";
import type { ShowSnapshot } from "../types/ShowSnapshot";

const endpoint = "/api/show-snapshot";

export async function listShowSnapshot(): Promise<ShowSnapshot[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && false) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.showSnapshot as unknown as ShowSnapshot[])];
}

export async function saveShowSnapshot(payload: ShowSnapshot) {
  console.info("save ShowSnapshot", payload);
  return payload;
}
