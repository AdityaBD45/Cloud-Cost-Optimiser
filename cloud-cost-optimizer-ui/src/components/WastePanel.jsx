import { ClockIcon, StampCheckIcon } from "./icons";

export default function WastePanel({ waste }) {
  if (!waste) return null;
  const { waste_analysis, idle_periods, recommendations } = waste;

  return (
    <div className="card card-waste">
      <h3 className="card-heading">
        <StampCheckIcon /> Idle resources &amp; waste
      </h3>

      <div className="waste-stats">
        <div className="waste-stat">
          <span className="waste-stat-value mono">{waste_analysis.total_waste_percentage.toFixed(1)}%</span>
          <span className="waste-stat-label">of the period was underutilized</span>
        </div>
        <div className="waste-stat">
          <span className="waste-stat-value mono">${waste_analysis.estimated_monthly_savings.toFixed(2)}</span>
          <span className="waste-stat-label">estimated savings / month</span>
        </div>
      </div>

      {idle_periods.length > 0 && (
        <>
          <p className="waste-subheading">Flagged idle periods</p>
          <ul className="idle-list">
            {idle_periods.slice(0, 6).map((p, i) => (
              <li className="idle-item" key={i}>
                <ClockIcon className="idle-icon" />
                <div>
                  <span className="idle-range mono">
                    {p.start.slice(5, 16)} &rarr; {p.end.slice(11, 16)}
                  </span>
                  <span className="idle-detail">
                    {p.duration_hours}h idle &middot; CPU {p.avg_cpu.toFixed(0)}% &middot; wasted{" "}
                    <span className="mono">${p.wasted_cost.toFixed(2)}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          {idle_periods.length > 6 && (
            <p className="waste-more">+{idle_periods.length - 6} more idle periods detected</p>
          )}
        </>
      )}

      {recommendations?.length > 0 && (
        <>
          <p className="waste-subheading">Recommendations</p>
          <ul className="rec-list">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}