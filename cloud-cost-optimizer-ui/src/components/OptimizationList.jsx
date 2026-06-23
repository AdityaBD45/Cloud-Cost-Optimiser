import { BoltIcon } from "./icons";

const TYPE_META = {
  right_sizing: {
    label: "Right-size your instances",
    detail: "Your forecasted spend is higher than your recent average — check whether you're provisioned larger than you need.",
  },
  scheduling: {
    label: "Schedule off-hours shutdown",
    detail: "CPU stays low overnight. Shutting down or scaling to zero during that window could cut idle spend.",
  },
  burstable_instance: {
    label: "Switch to burstable instances",
    detail: "Usage spikes occasionally but sits low on average — a burstable instance type may cost less for this pattern.",
  },
  auto_scaling: {
    label: "Enable auto-scaling",
    detail: "There's a wide gap between peak and average load — auto-scaling would right-size capacity automatically.",
  },
  monitoring: {
    label: "Keep monitoring",
    detail: "No major waste pattern found in this window. Worth checking back as usage changes.",
  },
};

export default function OptimizationList({ opportunities }) {
  return (
    <div className="card card-optimization">
      <h3 className="card-heading">
        <BoltIcon /> Optimization opportunities
      </h3>
      <ul className="opt-list">
        {opportunities.map((op, i) => {
          const meta = TYPE_META[op.type] || { label: op.type, detail: "" };
          return (
            <li className="opt-item" key={i}>
              <div className="opt-item-row">
                <span className="opt-item-label">{meta.label}</span>
                {op.savings_potential > 0 && (
                  <span className="mono opt-item-savings">
                    save ~${op.savings_potential.toFixed(2)}/wk
                  </span>
                )}
              </div>
              {meta.detail && <p className="opt-item-detail">{meta.detail}</p>}
              <div className="opt-item-confidence">
                <span
                  className="confidence-bar confidence-bar--sm"
                  style={{ width: `${Math.round(op.confidence * 100)}%` }}
                />
                <span className="mono confidence-value">{Math.round(op.confidence * 100)}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}