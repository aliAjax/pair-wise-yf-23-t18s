import { useEffect, useState } from "react";
import { usePowerDistributionStore } from "../stores/PowerDistributionStore";
import { usePowerPlan } from "../hooks/usePowerPlan";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { PhaseLoadBar } from "../components/common/PhaseLoadBar";
import { EmptyState } from "../components/common/EmptyState";
import { Phase, PhaseText } from "../constants/Phase";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { UNASSIGNED_CIRCUIT_TEXT } from "../constants/statusText";
import { PHASE_IMBALANCE_TOLERANCE, SUPPLY_VOLTAGE_V } from "../constants/PowerConfig";
import { formatAmp, formatDate, formatPercent, formatWatt } from "../utils/formatters";

export function PowerDistributionPage() {
  const store = usePowerDistributionStore();
  const { fixtures, circuits, snapshots, usableHistory, loaded, lastError, lastNotice } = store;
  const plan = usePowerPlan();
  const [powerDrafts, setPowerDrafts] = useState<Record<number, string>>({});
  const [ampDrafts, setAmpDrafts] = useState<Record<number, string>>({});
  const [snapshotTitle, setSnapshotTitle] = useState("");

  useEffect(() => {
    if (!loaded) void usePowerDistributionStore.getState().load();
  }, [loaded]);

  const clearDrafts = () => {
    setPowerDrafts({});
    setAmpDrafts({});
  };

  const commitPower = (fixtureId: number) => {
    const raw = powerDrafts[fixtureId];
    if (raw === undefined) return;
    setPowerDrafts((drafts) => {
      const next = { ...drafts };
      delete next[fixtureId];
      return next;
    });
    if (raw.trim() === "") return;
    store.setFixturePower(fixtureId, Number(raw));
  };

  const commitAmp = (circuitId: number) => {
    const raw = ampDrafts[circuitId];
    if (raw === undefined) return;
    setAmpDrafts((drafts) => {
      const next = { ...drafts };
      delete next[circuitId];
      return next;
    });
    if (raw.trim() === "") return;
    store.saveCircuitConfig(circuitId, { rated_amp: Number(raw) });
  };

  const handleRestore = () => {
    if (store.restoreLastUsable()) clearDrafts();
  };

  const handlePublish = () => {
    if (store.publishSnapshot(snapshotTitle)) setSnapshotTitle("");
  };

  const publishBlockReason = plan.violations[0]?.message ?? (plan.imbalanceExceeded ? ERROR_MESSAGES.PHASE_IMBALANCE_EXCEEDED : null);
  const overallStatus = plan.violations.length > 0 ? "BLOCKED" : plan.imbalanceExceeded ? "IMBALANCE" : "READY";

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">stage-light</p>
        <h1>配电方案</h1>
      </div>
      <div className="head-actions">
        <StatusBadge value={overallStatus} />
        <button className="btn" disabled={usableHistory.length === 0} onClick={handleRestore}>恢复最近可用方案</button>
      </div>
    </section>

    {lastError && <div className="banner error" onClick={store.dismissMessages}>
      <strong>变更被拦截</strong>
      <span>{lastError}</span>
    </div>}
    {lastNotice && <div className="banner notice" onClick={store.dismissMessages}>
      <span>{lastNotice}</span>
    </div>}

    <section className="metrics">
      <StatCard label="总功率" value={formatWatt(plan.totalWatt)} />
      <StatCard label="供电回路" value={circuits.length} />
      <StatCard label="相位负载差" value={formatPercent(plan.imbalance)} />
      <StatCard label="已发布快照" value={snapshots.length} />
    </section>

    <section className="panel">
      <h2>每相负载</h2>
      <div className="phase-grid">
        {plan.phaseLoads.map((load) => <PhaseLoadBar key={load.phase} load={load} warn={plan.imbalanceExceeded} />)}
      </div>
      <p className={plan.imbalanceExceeded ? "hint warn-text" : "hint"}>
        相位负载差 {formatPercent(plan.imbalance)}（阈值 {formatPercent(PHASE_IMBALANCE_TOLERANCE)}）
        {plan.imbalanceExceeded ? "，已超过两成，不能发布演出快照" : "，未超过两成，可发布演出快照"}
      </p>
    </section>

    <section className="workbench">
      <div className="panel wide">
        <h2>灯具挂接</h2>
        <table className="grid-table">
          <thead>
            <tr><th>灯具</th><th>类型</th><th>功率 (W)</th><th>挂接回路</th><th>电流</th><th>状态</th></tr>
          </thead>
          <tbody>
            {fixtures.map((fixture) => {
              const load = plan.circuitLoads.find((item) => item.circuit.id === fixture.circuit_id);
              const status = fixture.circuit_id == null
                ? "UNASSIGNED"
                : load?.circuit.maintenance_status === "MAINTENANCE"
                  ? "MAINTENANCE"
                  : load?.overloaded
                    ? "OVERLOADED"
                    : "NORMAL";
              return <tr key={fixture.id}>
                <td><strong>{fixture.fixture_code}</strong></td>
                <td>{fixture.fixture_type}</td>
                <td>
                  <input
                    className="num-input"
                    type="number"
                    min={0}
                    step={50}
                    value={powerDrafts[fixture.id] ?? String(fixture.power_watt)}
                    onChange={(event) => setPowerDrafts((drafts) => ({ ...drafts, [fixture.id]: event.target.value }))}
                    onBlur={() => commitPower(fixture.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                    }}
                  />
                </td>
                <td>
                  <select
                    value={fixture.circuit_id ?? ""}
                    onChange={(event) => store.assignCircuit(fixture.id, event.target.value === "" ? null : Number(event.target.value))}
                  >
                    <option value="">{UNASSIGNED_CIRCUIT_TEXT}</option>
                    {circuits.map((circuit) => <option key={circuit.id} value={circuit.id}>
                      {circuit.circuit_code} · {circuit.phase}{circuit.maintenance_status === "MAINTENANCE" ? "（检修中）" : ""}
                    </option>)}
                  </select>
                </td>
                <td>{formatAmp(fixture.power_watt / SUPPLY_VOLTAGE_V)}</td>
                <td><StatusBadge value={status} /></td>
              </tr>;
            })}
          </tbody>
        </table>
        <p className="hint">调整挂接或功率后若导致回路超载、接到检修回路，本次变更会被拦截，方案保持上一版可用状态。</p>
      </div>

      <div className="panel">
        <h2>供电回路柜</h2>
        {circuits.map((circuit) => {
          const load = plan.circuitLoads.find((item) => item.circuit.id === circuit.id);
          const usage = Math.max(0, Math.min(100, Math.round((load?.usage_ratio ?? 0) * 100)));
          return <div className="circuit-row" key={circuit.id}>
            <div className="circuit-row-head">
              <strong>{circuit.circuit_code}</strong>
              <StatusBadge value={load?.overloaded ? "OVERLOADED" : circuit.maintenance_status} />
            </div>
            <div className="circuit-row-body">
              <label>相位
                <select
                  value={circuit.phase}
                  onChange={(event) => store.saveCircuitConfig(circuit.id, { phase: event.target.value as Phase })}
                >
                  {Phase.map((phase) => <option key={phase} value={phase}>{PhaseText[phase]}</option>)}
                </select>
              </label>
              <label>额定 (A)
                <input
                  className="num-input"
                  type="number"
                  min={1}
                  step={1}
                  value={ampDrafts[circuit.id] ?? String(circuit.rated_amp)}
                  onChange={(event) => setAmpDrafts((drafts) => ({ ...drafts, [circuit.id]: event.target.value }))}
                  onBlur={() => commitAmp(circuit.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={circuit.maintenance_status === "MAINTENANCE"}
                  onChange={(event) => store.saveCircuitConfig(circuit.id, { maintenance_status: event.target.checked ? "MAINTENANCE" : "NORMAL" })}
                />
                检修
              </label>
            </div>
            <div className="mini-track"><div className={"mini-fill" + (load?.overloaded ? " over" : "")} style={{ width: `${usage}%` }} /></div>
            <div className="circuit-row-foot">
              <span>{formatWatt(load?.total_watt ?? 0)} · {formatAmp(load?.load_amp ?? 0)}</span>
              <span>{formatPercent(load?.usage_ratio ?? 0)}</span>
            </div>
          </div>;
        })}
      </div>
    </section>

    <section className="panel">
      <h2>演出快照</h2>
      <div className="publish-row">
        <input
          type="text"
          placeholder="快照标题（留空自动命名）"
          value={snapshotTitle}
          onChange={(event) => setSnapshotTitle(event.target.value)}
        />
        <button className="btn primary" disabled={publishBlockReason !== null} onClick={handlePublish}>发布演出快照</button>
      </div>
      {publishBlockReason
        ? <p className="hint warn-text">{publishBlockReason}</p>
        : <p className="hint">发布后快照冻结，后续灯具调整不影响快照内容。</p>}
      {snapshots.length === 0
        ? <EmptyState title="暂无演出快照" />
        : [...snapshots].reverse().map((snapshot) => <article className="snapshot-card" key={snapshot.id}>
          <div className="snapshot-head">
            <strong>{snapshot.title}</strong>
            <StatusBadge value="FROZEN" />
          </div>
          <p className="hint">
            发布于 {formatDate(snapshot.published_at)} · 总功率 {formatWatt(snapshot.total_watt)} · 相位负载差 {formatPercent(snapshot.imbalance_ratio)}
          </p>
          <div className="snapshot-phases">
            {snapshot.phase_loads.map((load) => <span className="chip" key={load.phase}>
              {PhaseText[load.phase]} {formatWatt(load.total_watt)} · {formatAmp(load.load_amp)}
            </span>)}
          </div>
          <table className="grid-table compact">
            <thead>
              <tr><th>灯具</th><th>功率</th><th>回路</th><th>相位</th></tr>
            </thead>
            <tbody>
              {snapshot.hookups.map((hookup) => <tr key={hookup.fixture_id}>
                <td>{hookup.fixture_code}</td>
                <td>{formatWatt(hookup.power_watt)}</td>
                <td>{hookup.circuit_code}</td>
                <td>{hookup.phase ?? "—"}</td>
              </tr>)}
            </tbody>
          </table>
        </article>)}
    </section>
  </main>;
}
