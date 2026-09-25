import { create } from "zustand";
import { listFixture, saveFixture } from "../api/Fixture";
import { listPowerCircuit, savePowerCircuit } from "../api/PowerCircuit";
import { listShowSnapshot, saveShowSnapshot } from "../api/ShowSnapshot";
import type { Fixture } from "../types/Fixture";
import type { PowerCircuit } from "../types/PowerCircuit";
import type { ShowSnapshot } from "../types/ShowSnapshot";
import { createSnapshotFromPlan } from "../constructors/ShowSnapshotConstructor";
import { computeCircuitLoads, computePhaseLoads, isPhaseImbalanceExceeded, validatePlan } from "../utils/powerPlan";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { NOTICE_MESSAGES } from "../constants/noticeMessages";
import { MAX_USABLE_PLAN_HISTORY } from "../constants/PowerConfig";

interface UsablePlan {
  fixtures: Fixture[];
  circuits: PowerCircuit[];
}

const clonePlan = (fixtures: Fixture[], circuits: PowerCircuit[]): UsablePlan => ({
  fixtures: fixtures.map((fixture) => ({ ...fixture })),
  circuits: circuits.map((circuit) => ({ ...circuit }))
});

type State = {
  fixtures: Fixture[];
  circuits: PowerCircuit[];
  snapshots: ShowSnapshot[];
  usableHistory: UsablePlan[];
  loading: boolean;
  loaded: boolean;
  lastError: string | null;
  lastNotice: string | null;
  load: () => Promise<void>;
  assignCircuit: (fixtureId: number, circuitId: number | null) => boolean;
  setFixturePower: (fixtureId: number, watt: number) => boolean;
  saveCircuitConfig: (circuitId: number, patch: Partial<Omit<PowerCircuit, "id" | "circuit_code">>) => boolean;
  restoreLastUsable: () => boolean;
  publishSnapshot: (title: string) => boolean;
  dismissMessages: () => void;
};

export const usePowerDistributionStore = create<State>((set, get) => {
  // 所有挂接/回路变更先过方案校验：超载或接到检修回路就拦住本次变更，
  // 状态保持不动，上一版可用方案留在 usableHistory 里可随时恢复。
  const attempt = (next: UsablePlan, appliedLog: string): boolean => {
    const violation = validatePlan(next.fixtures, next.circuits)[0];
    if (violation) {
      console.info(LOG_TEMPLATES.PowerDistribution[1], violation.message);
      set({ lastError: violation.message, lastNotice: null });
      return false;
    }
    const { fixtures, circuits, usableHistory } = get();
    const history = [...usableHistory, clonePlan(fixtures, circuits)].slice(-MAX_USABLE_PLAN_HISTORY);
    console.info(appliedLog);
    set({ fixtures: next.fixtures, circuits: next.circuits, usableHistory: history, lastError: null, lastNotice: null });
    return true;
  };

  return {
    fixtures: [],
    circuits: [],
    snapshots: [],
    usableHistory: [],
    loading: false,
    loaded: false,
    lastError: null,
    lastNotice: null,

    async load() {
      set({ loading: true });
      const [fixtures, circuits, snapshots] = await Promise.all([listFixture(), listPowerCircuit(), listShowSnapshot()]);
      set({ fixtures, circuits, snapshots, loading: false, loaded: true });
    },

    assignCircuit(fixtureId, circuitId) {
      const fixtures = get().fixtures.map((fixture) => (fixture.id === fixtureId ? { ...fixture, circuit_id: circuitId } : fixture));
      const ok = attempt({ fixtures, circuits: get().circuits }, LOG_TEMPLATES.PowerDistribution[0]);
      const changed = fixtures.find((fixture) => fixture.id === fixtureId);
      if (ok && changed) void saveFixture(changed);
      return ok;
    },

    setFixturePower(fixtureId, watt) {
      if (!Number.isFinite(watt) || watt < 0) {
        set({ lastError: ERROR_MESSAGES.VALIDATION_FAILED, lastNotice: null });
        return false;
      }
      const fixtures = get().fixtures.map((fixture) => (fixture.id === fixtureId ? { ...fixture, power_watt: Math.round(watt) } : fixture));
      const ok = attempt({ fixtures, circuits: get().circuits }, LOG_TEMPLATES.PowerDistribution[0]);
      const changed = fixtures.find((fixture) => fixture.id === fixtureId);
      if (ok && changed) void saveFixture(changed);
      return ok;
    },

    saveCircuitConfig(circuitId, patch) {
      if (patch.rated_amp !== undefined && (!Number.isFinite(patch.rated_amp) || patch.rated_amp <= 0)) {
        set({ lastError: ERROR_MESSAGES.VALIDATION_FAILED, lastNotice: null });
        return false;
      }
      const rated = patch.rated_amp !== undefined ? Math.round(patch.rated_amp) : undefined;
      const nextPatch = rated !== undefined ? { ...patch, rated_amp: rated } : patch;
      const circuits = get().circuits.map((circuit) => (circuit.id === circuitId ? { ...circuit, ...nextPatch } : circuit));
      const log = patch.maintenance_status !== undefined ? LOG_TEMPLATES.PowerCircuit[2] : LOG_TEMPLATES.PowerCircuit[1];
      const ok = attempt({ fixtures: get().fixtures, circuits }, log);
      const changed = circuits.find((circuit) => circuit.id === circuitId);
      if (ok && changed) void savePowerCircuit(changed);
      return ok;
    },

    restoreLastUsable() {
      const { usableHistory } = get();
      const last = usableHistory[usableHistory.length - 1];
      if (!last) {
        set({ lastError: ERROR_MESSAGES.NO_USABLE_PLAN, lastNotice: null });
        return false;
      }
      const restored = clonePlan(last.fixtures, last.circuits);
      console.info(LOG_TEMPLATES.PowerDistribution[2]);
      set({
        fixtures: restored.fixtures,
        circuits: restored.circuits,
        usableHistory: usableHistory.slice(0, -1),
        lastError: null,
        lastNotice: NOTICE_MESSAGES.PLAN_RESTORED
      });
      return true;
    },

    publishSnapshot(title) {
      const { fixtures, circuits, snapshots } = get();
      const violation = validatePlan(fixtures, circuits)[0];
      if (violation) {
        set({ lastError: violation.message, lastNotice: null });
        return false;
      }
      const phaseLoads = computePhaseLoads(computeCircuitLoads(fixtures, circuits));
      if (isPhaseImbalanceExceeded(phaseLoads)) {
        console.info(LOG_TEMPLATES.PowerDistribution[3]);
        set({ lastError: ERROR_MESSAGES.PHASE_IMBALANCE_EXCEEDED, lastNotice: null });
        return false;
      }
      const id = snapshots.reduce((max, snapshot) => Math.max(max, snapshot.id), 0) + 1;
      const snapshot = createSnapshotFromPlan(fixtures, circuits, title.trim() || `演出快照 ${id}`, id, new Date().toISOString());
      console.info(LOG_TEMPLATES.ShowSnapshot[0], snapshot.title);
      void saveShowSnapshot(snapshot);
      set({ snapshots: [...snapshots, snapshot], lastError: null, lastNotice: NOTICE_MESSAGES.SNAPSHOT_PUBLISHED });
      return true;
    },

    dismissMessages() {
      set({ lastError: null, lastNotice: null });
    }
  };
});
