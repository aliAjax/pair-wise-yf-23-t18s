import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/common/EmptyState";
import { PhaseLoadBar } from "../components/common/PhaseLoadBar";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { CircuitStatusText } from "../constants/CircuitStatus";
import { PowerPhase, PowerPhaseText } from "../constants/PowerPhase";
import { PHASE_IMBALANCE_LIMIT } from "../constants/PowerRules";
import { useCircuitLoad } from "../hooks/useCircuitLoad";
import { usePhaseLoad } from "../hooks/usePhaseLoad";
import { useFixtureStore } from "../stores/FixtureStore";
import { usePowerDistributionStore } from "../stores/PowerDistributionStore";
import { formatAmps, formatDate, formatPercent, formatWatts } from "../utils/formatters";
import { ampsForWatts } from "../utils/powerMath";

export function PowerDistributionPage() {
  const fixtures = useFixtureStore((state) => state.rows);
  const loadFixtures = useFixtureStore((state) => state.load);
  const {
    circuits,
    hookups,
    lastUsableHookups,
    lastUsableAt,
    issues,
    snapshots,
    lastError,
    load,
    reassignCircuit,
    updateWattage,
    restoreLastUsable,
    publishSnapshot,
    dismissError
  } = usePowerDistributionStore();

  const [snapshotName, setSnapshotName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void loadFixtures();
    void load();
  }, [loadFixtures, load]);

  const fixtureById = useMemo(() => new Map(fixtures.map((fixture) => [fixture.id, fixture])), [fixtures]);
  const circuitById = useMemo(() => new Map(circuits.map((circuit) => [circuit.id, circuit])), [circuits]);
  const circuitLoads = useCircuitLoad(circuits, hookups);
  const { phaseLoads, imbalance, totalWatts } = usePhaseLoad(circuits, hookups);
  const phaseCapacity = useMemo(() => {
    const capacity: Record<string, number> = { L1: 0, L2: 0, L3: 0 };
    for (const circuit of circuits) capacity[circuit.phase] += circuit.rated_amps;
    return capacity;
  }, [circuits]);
  const sortedHookups = useMemo(() => [...hookups].sort((a, b) => a.fixture_id - b.fixture_id), [hookups]);

  const patchedCount = hookups.filter((hookup) => hookup.circuit_id != null).length;
  const dirty = lastUsableHookups != null && JSON.stringify(lastUsableHookups) !== JSON.stringify(hookups);
  const planValid = issues.length === 0;
  const canPublish = planValid && imbalance <= PHASE_IMBALANCE_LIMIT;

  const handlePublish = () => {
    if (publishSnapshot(snapshotName)) {
      setNotice("演出快照已发布并冻结，后续灯具调整不会影响它");
      setSnapshotName("");
    } else {
      setNotice(null);
    }
  };

  return (
    <main className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">stage-light</p>
          <h1>配电方案</h1>
        </div>
        <StatusBadge value={planValid ? "READY" : "BLOCKED"} label={planValid ? "方案可用" : "变更被拦截"} />
      </section>

      <section className="metrics">
        <StatCard label="总功率" value={formatWatts(totalWatts)} />
        <StatCard label="已挂接灯具" value={`${patchedCount} / ${hookups.length}`} />
        <StatCard label="相位负载差" value={formatPercent(imbalance)} />
        <StatCard label="已发布快照" value={snapshots.length} />
      </section>

      {lastError && (
        <section className="banner">
          <div>
            <strong>本次变更已被拦截，未纳入可用方案</strong>
            <p>{lastError}</p>
          </div>
          <div className="banner-actions">
            <button className="btn ghost" onClick={dismissError}>知道了</button>
            <button className="btn" onClick={restoreLastUsable} disabled={!dirty}>恢复最近可用方案</button>
          </div>
        </section>
      )}
      {notice && <section className="notice">{notice}</section>}

      <section className="workbench">
        <div className="panel wide">
          <div className="panel-head">
            <h2>灯具挂接</h2>
            <div className="panel-actions">
              {lastUsableAt && <span className="muted">最近可用方案 {formatDate(lastUsableAt)}</span>}
              <button className="btn ghost" onClick={restoreLastUsable} disabled={!dirty}>
                恢复最近可用方案
              </button>
            </div>
          </div>
          <div className="hookup-head">
            <span>灯具</span>
            <span>功率（W）</span>
            <span>挂接回路</span>
            <span>电流</span>
            <span>相位</span>
          </div>
          {sortedHookups.map((hookup) => {
            const fixture = fixtureById.get(hookup.fixture_id);
            const circuit = hookup.circuit_id != null ? circuitById.get(hookup.circuit_id) : undefined;
            const maintenance = circuit?.status === "MAINTENANCE";
            return (
              <article key={hookup.id} className={"hookup-row" + (maintenance ? " row-danger" : "")}>
                <strong>{fixture?.fixture_code ?? `灯具 #${hookup.fixture_id}`}</strong>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={hookup.wattage}
                  onChange={(event) => updateWattage(hookup.fixture_id, Number(event.target.value))}
                />
                <select
                  value={hookup.circuit_id ?? ""}
                  onChange={(event) =>
                    reassignCircuit(hookup.fixture_id, event.target.value === "" ? null : Number(event.target.value))
                  }
                >
                  <option value="">未挂接</option>
                  {PowerPhase.map((phase) => (
                    <optgroup key={phase} label={PowerPhaseText[phase]}>
                      {circuits
                        .filter((circuit) => circuit.phase === phase)
                        .map((circuit) => (
                          <option key={circuit.id} value={circuit.id}>
                            {circuit.circuit_code} · {circuit.rated_amps}A
                            {circuit.status === "MAINTENANCE" ? " · 检修中" : ""}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
                <span>{formatAmps(ampsForWatts(hookup.wattage))}</span>
                <span className="phase-cell">
                  {circuit ? PowerPhaseText[circuit.phase] : "—"}
                  {maintenance && <StatusBadge value="MAINTENANCE" label="检修中" />}
                </span>
              </article>
            );
          })}
        </div>

        <div className="panel">
          <h2>每相负载</h2>
          {PowerPhase.map((phase) => (
            <PhaseLoadBar
              key={phase}
              label={PowerPhaseText[phase]}
              amps={phaseLoads[phase]}
              capacityAmps={phaseCapacity[phase] ?? 0}
            />
          ))}
          <p className={imbalance > PHASE_IMBALANCE_LIMIT ? "warn-text" : "muted"}>
            相位负载差 {formatPercent(imbalance)}（发布门槛 ≤ {formatPercent(PHASE_IMBALANCE_LIMIT)}）
          </p>
        </div>
      </section>

      <section className="workbench">
        <div className="panel wide">
          <h2>回路负载</h2>
          {circuitLoads.map(({ circuit, amps, utilization, overloaded }) => (
            <article key={circuit.id} className={"circuit-row" + (overloaded ? " row-danger" : "")}>
              <strong>{circuit.circuit_code}</strong>
              <StatusBadge value={circuit.status} label={CircuitStatusText[circuit.status]} />
              <span>{PowerPhaseText[circuit.phase]}</span>
              <div className="bar">
                <div
                  className={"bar-fill" + (overloaded ? " danger" : utilization > 0.8 ? " warn" : "")}
                  style={{ width: `${Math.min(utilization, 1) * 100}%` }}
                />
              </div>
              <span>
                {formatAmps(amps)} / {formatAmps(circuit.rated_amps)}
              </span>
            </article>
          ))}
        </div>

        <div className="panel">
          <h2>演出快照</h2>
          <div className="publish-form">
            <input
              value={snapshotName}
              placeholder="快照名称（如：换场后 V2）"
              onChange={(event) => setSnapshotName(event.target.value)}
            />
            <button className="btn" disabled={!canPublish} onClick={handlePublish}>
              发布演出快照
            </button>
          </div>
          {!canPublish && (
            <p className="warn-text">
              {planValid
                ? `相位负载差 ${formatPercent(imbalance)} 超过两成，调整挂接后再发布`
                : "当前方案存在被拦截的变更，修正或恢复后才能发布"}
            </p>
          )}
          {snapshots.length === 0 ? (
            <EmptyState title="暂无已发布快照" />
          ) : (
            snapshots.map((snapshot) => (
              <article key={snapshot.id} className="snapshot-item">
                <div className="snapshot-head">
                  <strong>{snapshot.name}</strong>
                  <StatusBadge value="FROZEN" label="已冻结" />
                </div>
                <p className="muted">
                  {formatDate(snapshot.created_at)} · 总功率 {formatWatts(snapshot.total_watts)} · 负载差{" "}
                  {formatPercent(snapshot.imbalance)}
                </p>
                <p className="muted">
                  {PowerPhase.map((phase) => `${PowerPhaseText[phase]} ${formatAmps(snapshot.phase_loads[phase])}`).join(" · ")}
                </p>
              </article>
            ))
          )}
          <p className="muted">快照发布后冻结保存，后续灯具调整不影响已发布内容。</p>
        </div>
      </section>
    </main>
  );
}
