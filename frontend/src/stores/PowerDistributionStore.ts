import { create } from "zustand";
import { listFixtureHookup, saveFixtureHookup } from "../api/FixtureHookup";
import { listPowerCircuit } from "../api/PowerCircuit";
import { listPowerSnapshot, savePowerSnapshot } from "../api/PowerSnapshot";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { PHASE_IMBALANCE_LIMIT } from "../constants/PowerRules";
import { createSnapshotFromPlan } from "../constructors/PowerSnapshotConstructor";
import type { FixtureHookup } from "../types/FixtureHookup";
import type { PowerCircuit } from "../types/PowerCircuit";
import type { PowerSnapshot } from "../types/PowerSnapshot";
import {
  computePhaseLoads,
  deepCloneHookups,
  phaseImbalance,
  validateHookups,
  type PlanIssue
} from "../utils/powerMath";

const formatIssues = (issues: PlanIssue[]): string =>
  issues
    .map((issue) => `${ERROR_MESSAGES[issue.code as keyof typeof ERROR_MESSAGES] ?? issue.code}：${issue.detail}`)
    .join("；");

type State = {
  circuits: PowerCircuit[];
  hookups: FixtureHookup[];
  lastUsableHookups: FixtureHookup[] | null;
  lastUsableAt: string | null;
  issues: PlanIssue[];
  snapshots: PowerSnapshot[];
  lastError: string | null;
  loading: boolean;
  load: () => Promise<void>;
  reassignCircuit: (fixtureId: number, circuitId: number | null) => boolean;
  updateWattage: (fixtureId: number, wattage: number) => boolean;
  restoreLastUsable: () => void;
  publishSnapshot: (name: string) => boolean;
  dismissError: () => void;
};

export const usePowerDistributionStore = create<State>((set, get) => {
  // 每次挂接调整都先整版校验：超载或挂到检修回路时拦截本次变更，
  // 不纳入可用方案，上一版可用方案原样保留，可随时恢复。
  const commitDraft = (candidate: FixtureHookup[], changed: FixtureHookup, logIndex: number): boolean => {
    const issues = validateHookups(candidate, get().circuits);
    if (issues.length > 0) {
      console.info(LOG_TEMPLATES.FixtureHookup[2], { changed, issues });
      set({ hookups: candidate, issues, lastError: formatIssues(issues) });
      return false;
    }
    set({
      hookups: candidate,
      issues: [],
      lastUsableHookups: deepCloneHookups(candidate),
      lastUsableAt: new Date().toISOString(),
      lastError: null
    });
    if (logIndex === 0) {
      void saveFixtureHookup(changed);
    } else {
      console.info(LOG_TEMPLATES.FixtureHookup[logIndex], changed);
    }
    return true;
  };

  return {
    circuits: [],
    hookups: [],
    lastUsableHookups: null,
    lastUsableAt: null,
    issues: [],
    snapshots: [],
    lastError: null,
    loading: false,
    async load() {
      set({ loading: true });
      const [circuits, hookups, snapshots] = await Promise.all([
        listPowerCircuit(),
        listFixtureHookup(),
        listPowerSnapshot()
      ]);
      set({
        circuits,
        hookups,
        snapshots,
        issues: validateHookups(hookups, circuits),
        lastUsableHookups: deepCloneHookups(hookups),
        lastUsableAt: new Date().toISOString(),
        loading: false
      });
    },
    reassignCircuit(fixtureId, circuitId) {
      const candidate = get().hookups.map((hookup) =>
        hookup.fixture_id === fixtureId ? { ...hookup, circuit_id: circuitId } : hookup
      );
      const changed = candidate.find((hookup) => hookup.fixture_id === fixtureId);
      if (!changed) return false;
      return commitDraft(candidate, changed, 0);
    },
    updateWattage(fixtureId, wattage) {
      const safeWattage = Number.isFinite(wattage) ? Math.max(0, Math.round(wattage)) : 0;
      const candidate = get().hookups.map((hookup) =>
        hookup.fixture_id === fixtureId ? { ...hookup, wattage: safeWattage } : hookup
      );
      const changed = candidate.find((hookup) => hookup.fixture_id === fixtureId);
      if (!changed) return false;
      return commitDraft(candidate, changed, 1);
    },
    restoreLastUsable() {
      const { lastUsableHookups } = get();
      if (!lastUsableHookups) {
        set({ lastError: ERROR_MESSAGES.NO_USABLE_PLAN });
        return;
      }
      console.info(LOG_TEMPLATES.FixtureHookup[3], { restoredAt: new Date().toISOString() });
      set({ hookups: deepCloneHookups(lastUsableHookups), issues: [], lastError: null });
    },
    publishSnapshot(name) {
      const { hookups, circuits, snapshots } = get();
      const issues = validateHookups(hookups, circuits);
      if (issues.length > 0) {
        console.info(LOG_TEMPLATES.PowerSnapshot[1], { issues });
        set({ lastError: formatIssues(issues) });
        return false;
      }
      const imbalance = phaseImbalance(computePhaseLoads(circuits, hookups));
      if (imbalance > PHASE_IMBALANCE_LIMIT) {
        console.info(LOG_TEMPLATES.PowerSnapshot[1], { imbalance });
        set({ lastError: `${ERROR_MESSAGES.PHASE_IMBALANCE}：当前负载差 ${(imbalance * 100).toFixed(1)}%` });
        return false;
      }
      const snapshot = createSnapshotFromPlan(
        snapshots.reduce((max, item) => Math.max(max, item.id), 0) + 1,
        name.trim() || `演出快照 ${snapshots.length + 1}`,
        hookups,
        circuits
      );
      set({ snapshots: [...snapshots, snapshot], lastError: null });
      void savePowerSnapshot(snapshot);
      return true;
    },
    dismissError() {
      set({ lastError: null });
    }
  };
});
