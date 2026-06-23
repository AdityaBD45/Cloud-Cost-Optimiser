const WIDTH = 700;
const HEIGHT = 240;
const PAD = { top: 20, right: 16, bottom: 30, left: 44 };

export default function ForecastChart({ days }) {
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;

  const highs = days.map((d) => d.cost_range[1]);
  const lows = days.map((d) => d.cost_range[0]);
  const maxVal = Math.max(...highs) * 1.12;
  const minVal = Math.max(0, Math.min(...lows) * 0.85);

  const x = (i) => PAD.left + (i / (days.length - 1)) * plotW;
  const y = (v) => PAD.top + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;

  const bandPath =
    days.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.cost_range[1])}`).join(" ") +
    " " +
    days
      .slice()
      .reverse()
      .map((d, i) => `L ${x(days.length - 1 - i)} ${y(d.cost_range[0])}`)
      .join(" ") +
    " Z";

  const linePath = days
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.cost)}`)
    .join(" ");

  const yTicks = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="forecast-chart"
      role="img"
      aria-label="7-day cost forecast with confidence range"
    >
      {/* gridlines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={y(t)}
            y2={y(t)}
            className="chart-grid"
          />
          <text x={PAD.left - 8} y={y(t)} className="chart-tick mono" textAnchor="end" dy="3">
            ${t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* confidence band */}
      <path d={bandPath} className="chart-band" />

      {/* median line */}
      <path d={linePath} className="chart-line" />

      {/* points + x labels */}
      {days.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.cost)} r={3.5} className="chart-point" />
          <title>{`${d.weekday} ${d.date}: $${d.cost.toFixed(2)} ($${d.cost_range[0].toFixed(2)}–$${d.cost_range[1].toFixed(2)})`}</title>
          <text x={x(i)} y={HEIGHT - 8} className="chart-tick mono" textAnchor="middle">
            {d.weekday.slice(0, 3)}
          </text>
        </g>
      ))}
    </svg>
  );
}