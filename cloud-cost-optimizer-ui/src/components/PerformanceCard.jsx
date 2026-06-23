import { GaugeIcon, ClockIcon } from "./icons";

const RISK_LABEL = {
  high: { label: "High bottleneck risk", tone: "brick" },
  medium: { label: "Medium bottleneck risk", tone: "copper" },
  low: { label: "Low bottleneck risk", tone: "forest" },
};

export default function PerformanceCard({ performance }) {
  const { expected_peak_cpu, expected_peak_memory, peak_time_prediction, bottleneck_risk } =
    performance;
  const risk = RISK_LABEL[bottleneck_risk] || RISK_LABEL.low;
  const peakDate = new Date(peak_time_prediction.replace(" ", "T"));
  const peakLabel = isNaN(peakDate.getTime())
    ? peak_time_prediction
    : peakDate.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });

  return (
    <div className="card card-performance">
      <h3 className="card-heading">
        <GaugeIcon /> Peak load
      </h3>

      <div className="bar-metric">
        <div className="bar-metric-label">
          <span>CPU</span>
          <span className="mono">{expected_peak_cpu.toFixed(0)}%</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill bar-fill--cpu" style={{ width: `${expected_peak_cpu}%` }} />
        </div>
      </div>

      <div className="bar-metric">
        <div className="bar-metric-label">
          <span>Memory</span>
          <span className="mono">{expected_peak_memory.toFixed(0)}%</span>
        </div>
        <div className="bar-track">
          <div className="bar-fill bar-fill--mem" style={{ width: `${expected_peak_memory}%` }} />
        </div>
      </div>

      <div className="card-footer-row">
        <span className="card-footer-item">
          <ClockIcon /> Peak expected {peakLabel}
        </span>
        <span className={`badge tone-${risk.tone}`}>{risk.label}</span>
      </div>
    </div>
  );
}