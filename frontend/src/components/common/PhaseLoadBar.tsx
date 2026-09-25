import { PhaseText } from "../../constants/Phase";
import { formatAmp, formatPercent, formatWatt } from "../../utils/formatters";
import type { PhaseLoad } from "../../utils/powerPlan";

export function PhaseLoadBar({ load, warn = false }: { load: PhaseLoad; warn?: boolean }) {
  const width = Math.max(0, Math.min(100, Math.round(load.usage_ratio * 100)));
  return <div className={"phase-bar" + (warn ? " warn" : "")}>
    <div className="phase-bar-head">
      <strong>{PhaseText[load.phase]}</strong>
      <span>{formatWatt(load.total_watt)} · {formatAmp(load.load_amp)}</span>
    </div>
    <div className="phase-bar-track"><div className="phase-bar-fill" style={{ width: `${width}%` }} /></div>
    <div className="phase-bar-foot">
      <span>回路容量 {formatAmp(load.rated_amp)}</span>
      <span>{formatPercent(load.usage_ratio)}</span>
    </div>
  </div>;
}
