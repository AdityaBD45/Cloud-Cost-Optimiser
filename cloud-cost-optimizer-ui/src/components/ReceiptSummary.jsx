import { TrendUpIcon, TrendDownIcon, TrendFlatIcon } from "./icons";

const TREND_META = {
  increasing: { icon: TrendUpIcon, label: "Trending up", tone: "brick" },
  decreasing: { icon: TrendDownIcon, label: "Trending down", tone: "forest" },
  stable: { icon: TrendFlatIcon, label: "Holding steady", tone: "ink" },
};

export default function ReceiptSummary({ costPredictions }) {
  const { total_predicted_weekly_cost, trend, trend_strength, predicted_cost_next_7_days } =
    costPredictions;

  const meta = TREND_META[trend] || TREND_META.stable;
  const TrendIcon = meta.icon;
  const avgConfidence =
    predicted_cost_next_7_days.reduce((s, d) => s + d.confidence, 0) /
    predicted_cost_next_7_days.length;

  return (
    <div className="receipt">
      <p className="receipt-eyebrow">7-day forecast &mdash; next billing window</p>
      <div className="receipt-total-row">
        <span className="receipt-currency">$</span>
        <span className="receipt-total mono">{total_predicted_weekly_cost.toFixed(2)}</span>
      </div>
      <p className="receipt-sub">projected total for the week ahead</p>

      <div className="receipt-rule" />

      <div className="receipt-meta-row">
        <span className={`receipt-trend tone-${meta.tone}`}>
          <TrendIcon />
          {meta.label}
          <span className="mono receipt-trend-value">
            {trend !== "stable" ? `${(Math.abs(trend_strength) * 100).toFixed(1)}%/day` : ""}
          </span>
        </span>
        <span className="receipt-confidence">
          Model confidence&nbsp;<span className="mono">{Math.round(avgConfidence * 100)}%</span>
        </span>
      </div>

      <div className="receipt-perforation" aria-hidden="true" />
    </div>
  );
}