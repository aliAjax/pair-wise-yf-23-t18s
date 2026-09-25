import { formatAmps, formatPercent } from "../../utils/formatters";

export function PhaseLoadBar({
  label,
  amps,
  capacityAmps
}: {
  label: string;
  amps: number;
  capacityAmps: number;
}) {
  const ratio = capacityAmps > 0 ? amps / capacityAmps : 0;
  return (
    <div className="phase-load">
      <div className="phase-load-head">
        <strong>{label}</strong>
        <span>
          {formatAmps(amps)} / {formatAmps(capacityAmps)}
        </span>
      </div>
      <div className="bar">
        <div className={"bar-fill" + (ratio > 0.8 ? " warn" : "")} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
      </div>
      <span className="phase-load-note">占该相容量 {formatPercent(ratio)}</span>
    </div>
  );
}
