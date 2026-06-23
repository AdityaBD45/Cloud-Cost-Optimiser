export default function ForecastTable({ days }) {
  return (
    <div className="ledger-table" role="table" aria-label="Daily forecast breakdown">
      <div className="ledger-row ledger-row--head" role="row">
        <span role="columnheader" className="col-day">Day</span>
        <span role="columnheader" className="col-cost">Cost</span>
        <span role="columnheader" className="col-range">Range</span>
        <span role="columnheader" className="col-cpu">CPU</span>
        <span role="columnheader" className="col-mem">Memory</span>
        <span role="columnheader" className="col-confidence">Confidence</span>
      </div>
      {days.map((d) => (
        <div className="ledger-row" role="row" key={d.date}>
          <span className="ledger-day col-day">
            <strong>{d.weekday.slice(0, 3)}</strong>
            <span className="ledger-date mono">{d.date.slice(5)}</span>
          </span>
          <span className="mono ledger-cost col-cost">${d.cost.toFixed(2)}</span>
          <span className="mono ledger-range col-range">
            ${d.cost_range[0].toFixed(2)}&ndash;${d.cost_range[1].toFixed(2)}
          </span>
          <span className="mono col-cpu">{d.avg_cpu.toFixed(0)}%</span>
          <span className="mono col-mem">{d.avg_memory.toFixed(0)}%</span>
          <span className="ledger-confidence col-confidence">
            <span
              className="confidence-bar"
              style={{ width: `${Math.round(d.confidence * 100)}%` }}
            />
            <span className="mono confidence-value">{Math.round(d.confidence * 100)}%</span>
          </span>
        </div>
      ))}
    </div>
  );
}