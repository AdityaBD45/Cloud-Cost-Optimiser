import { useState } from "react";
import { predictCost, detectWaste } from "../cloudOptimizer";
import logo from '../assets/logo.png';
import { Upload, DollarSign, AlertTriangle, Loader2, Clock, Zap, TrendingDown, BarChart3, Calendar } from "lucide-react";
import "./Dashboard.css";

export default function CloudCostDashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleAction = async (actionFn, actionName) => {
    if (!file) {
      setError("Please upload a CSV file first");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await actionFn(file);
      setResult({ ...data, action: actionName });
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-inline-logo">
            <img src={logo} alt="Cloud Cost Optimizer" className="dashboard-logo" />
            <h1 className="dashboard-title" style={{ marginLeft: '20px' }}>
              <span className="shine-text blue-gradient" data-text="Cloud Cost Optimizer">Cloud Cost Optimizer</span>
            </h1>
          </div>
          <p className="dashboard-subtitle">
            Upload your cloud usage CSV to analyze costs and detect waste
          </p>
        </header>

        {/* Main Content */}
        <div className="dashboard-grid">
          {/* Left Column - Upload */}
          <div className="upload-column">
            <div className="upload-card">
              <div className="upload-card-header">
                <Upload className="upload-icon-header" />
                <h2 className="upload-card-title">Upload Data</h2>
              </div>

              {/* File Upload */}
              <div className="upload-section">
                <label className="upload-label">Select CSV File</label>
                <div
                  className="upload-area"
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="upload-input"
                  />

                  <Upload className="upload-icon" />

                  {fileName ? (
                    <div className="file-selected">
                      <p className="file-name-text">
                        ✓ {fileName}
                      </p>
                      <p className="file-hint">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="file-empty">
                      <p className="upload-text">
                        Click to upload CSV
                      </p>
                      <p className="upload-hint">
                        Supports AWS, Azure, GCP cost exports
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  onClick={() => handleAction(predictCost, "predict")}
                  disabled={!file || loading}
                  className="btn btn-primary"
                >
                  <DollarSign className="btn-icon" />
                  {loading ? "Analyzing..." : "Predict Cost"}
                </button>

                <button
                  onClick={() => handleAction(detectWaste, "waste")}
                  disabled={!file || loading}
                  className="btn btn-secondary"
                >
                  <AlertTriangle className="btn-icon" />
                  {loading ? "Scanning..." : "Detect Waste"}
                </button>
              </div>

              {/* Tips */}
              <div className="tips-section">
                <h4 className="tips-title">💡 Tip</h4>
                <p className="tips-text">
                  For best results, export 30 days of usage data from your cloud provider's cost management console.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="results-column">
            {/* Loading State */}
            {loading && (
              <div className="loading-card">
                <Loader2 className="loading-spinner" />
                <h3 className="loading-title">Analyzing your cloud data</h3>
                <p className="loading-text">
                  This may take a moment while we process your file...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="error-card">
                <div className="error-header">
                  <AlertTriangle className="error-icon" />
                  <h3 className="error-title">Error</h3>
                </div>
                <p className="error-message">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {result && !loading && (
              <>
                {result.action === "predict" ? (
                  <PredictionResultsDisplay data={result} />
                ) : (
                  <WasteResultsDisplay data={result} />
                )}
              </>
            )}

            {/* Empty State */}
            {!result && !loading && !error && (
              <div className="empty-state">
                <div className="empty-state-content">
                  <div className="empty-icon-circle">
                    <DollarSign className="empty-icon" />
                  </div>
                  <h3 className="empty-title">Ready to Optimize</h3>
                  <p className="empty-text">
                    Upload your cloud cost CSV file and click "Predict Cost" or "Detect Waste" to get started with optimization.
                  </p>
                  <div className="empty-formats">
                    <p>Supported formats:</p>
                    <p>• AWS Cost Explorer exports</p>
                    <p>• Azure Cost Management reports</p>
                    <p>• Google Cloud Billing exports</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to download report
function downloadReport(data) {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', `cloud-cost-report-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Prediction Results Component
function PredictionResultsDisplay({ data }) {
  const predictions = data.cost_predictions?.predicted_cost_next_7_days || [];
  const opportunities = data.optimization_opportunities || [];
  const performance = data.performance_predictions || {};

  // Calculate totals
  const totalWeeklyCost = data.cost_predictions?.total_predicted_weekly_cost || 0;
  const totalSavings = opportunities.reduce((sum, opp) => sum + (opp.savings_potential || 0), 0);

  return (
    <div className="results-card">
      {/* Header */}
      <div className="results-header">
        <div>
          <h2 className="results-title">Cost Prediction Results</h2>
          <p className="results-timestamp">
            Analysis completed at {new Date().toLocaleTimeString()}
          </p>
        </div>
        <span className="results-badge">💰 Prediction</span>
      </div>

      {/* Content */}
      <div className="results-content">
        {/* Summary Cards */}
        <div className="summary-grid">
          <SummaryCard
            title="Weekly Cost"
            value={`$${totalWeeklyCost.toFixed(2)}`}
            subtitle="Next 7 days"
            color="blue"
          />
          <SummaryCard
            title="Potential Savings"
            value={`$${totalSavings.toFixed(2)}`}
            subtitle="Weekly"
            color="green"
          />
          <SummaryCard
            title="Optimization Opportunities"
            value={opportunities.length}
            subtitle="Recommendations"
            color="purple"
          />
        </div>

        {/* Two-column layout */}
        <div className="detailed-grid">
          {/* Left Column - Cost Predictions */}
          <div className="detail-column">
            <div className="detail-card">
              <h3 className="detail-title">📊 Cost Predictions (Next 7 Days)</h3>
              <div className="predictions-table-container">
                <table className="predictions-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Cost</th>
                      <th>CPU %</th>
                      <th>Memory %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((day, index) => (
                      <tr key={index}>
                        <td>{day.date ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</td>
                        <td>{day.weekday ? day.weekday.substring(0, 3) : 'N/A'}</td>
                        <td className="cost-cell">${(day.cost || 0).toFixed(2)}</td>
                        <td>
                          <div className="metric-bar">
                            <div
                              className="metric-fill cpu-fill"
                              style={{ width: `${Math.min(day.avg_cpu || 0, 100)}%` }}
                            ></div>
                            <span className="metric-text">{(day.avg_cpu || 0).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="metric-bar">
                            <div
                              className="metric-fill memory-fill"
                              style={{ width: `${Math.min(day.avg_memory || 0, 100)}%` }}
                            ></div>
                            <span className="metric-text">{(day.avg_memory || 0).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="trend-info">
                <span className={`trend-badge ${data.cost_predictions?.trend || 'stable'}`}>
                  📈 {(data.cost_predictions?.trend || 'stable')} trend
                </span>
                <span className="confidence-badge">
                  Confidence: {((data.cost_predictions?.confidence || 0.9) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Opportunities */}
          <div className="detail-column">
            {/* Performance Card */}
            <div className="detail-card">
              <h3 className="detail-title">⚡ Performance Predictions</h3>
              <div className="performance-grid">
                <div className="performance-item">
                  <div className="performance-label">Peak CPU</div>
                  <div className="performance-value">{(performance.expected_peak_cpu || 0).toFixed(1)}%</div>
                  <div className="performance-bar">
                    <div
                      className="performance-fill cpu-peak"
                      style={{ width: `${Math.min(performance.expected_peak_cpu || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-label">Peak Memory</div>
                  <div className="performance-value">{(performance.expected_peak_memory || 0).toFixed(1)}%</div>
                  <div className="performance-bar">
                    <div
                      className="performance-fill memory-peak"
                      style={{ width: `${Math.min(performance.expected_peak_memory || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="performance-item">
                  <div className="performance-label">Bottleneck Risk</div>
                  <div className={`risk-badge ${performance.bottleneck_risk || 'medium'}`}>
                    {performance.bottleneck_risk || 'medium'}
                  </div>
                  <div className="performance-hint">
                    {performance.peak_time_prediction
                      ? `Peak: ${new Date(performance.peak_time_prediction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'Peak time not available'}
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Opportunities */}
            <div className="detail-card">
              <h3 className="detail-title">🎯 Optimization Opportunities</h3>
              <div className="opportunities-list">
                {opportunities.length > 0 ? (
                  opportunities.map((opp, index) => (
                    <div key={index} className="opportunity-item">
                      <div className="opportunity-header">
                        <div className="opportunity-type">
                          {opp.type === 'right_sizing' && '📏 Right Sizing'}
                          {opp.type === 'scheduling' && '⏰ Scheduling'}
                          {opp.type === 'burstable_instance' && '⚡ Burstable Instances'}
                          {opp.type === 'auto_scaling' && '📈 Auto Scaling'}
                          {!['right_sizing', 'scheduling', 'burstable_instance', 'auto_scaling'].includes(opp.type) && opp.type}
                        </div>
                        <div className="opportunity-savings">
                          ${(opp.savings_potential || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="opportunity-confidence">
                        <div className="confidence-bar">
                          <div
                            className="confidence-fill"
                            style={{ width: `${(opp.confidence || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="confidence-text">
                          {Math.round((opp.confidence || 0) * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-opportunities">No optimization opportunities found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button
            className="action-btn btn-download"
            onClick={() => downloadReport(data)}
          >
            📥 Download Full Report
          </button>
          <button
            className="action-btn btn-copy"
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          >
            📋 Copy Results
          </button>
        </div>
      </div>
    </div>
  );
}

// Waste Results Component
function WasteResultsDisplay({ data }) {
  const wasteAnalysis = data.waste_analysis || {};
  const idlePeriods = data.idle_periods || [];
  const recommendations = data.recommendations || [];

  // Calculate totals
  const totalWaste = idlePeriods.reduce((sum, period) => sum + (period.wasted_cost || 0), 0);
  const totalHours = idlePeriods.reduce((sum, period) => sum + (period.duration_hours || 0), 0);

  // Sort idle periods by date
  const sortedPeriods = [...idlePeriods].sort((a, b) =>
    new Date(b.start) - new Date(a.start)
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="results-card">
      {/* Header */}
      <div className="results-header">
        <div>
          <h2 className="results-title">Waste Detection Results</h2>
          <p className="results-timestamp">
            Analysis completed at {new Date().toLocaleTimeString()}
          </p>
        </div>
        <span className="results-badge">⚠️ Waste Detection</span>
      </div>

      {/* Content */}
      <div className="results-content">
        {/* Summary Cards */}
        <div className="summary-grid">
          <SummaryCard
            title="Monthly Savings"
            value={`$${(wasteAnalysis.estimated_monthly_savings || 0).toFixed(2)}`}
            subtitle="Potential"
            color="green"
          />
          <SummaryCard
            title="Waste Percentage"
            value={`${(wasteAnalysis.total_waste_percentage || 0).toFixed(1)}%`}
            subtitle="Of total usage"
            color="orange"
          />
          <SummaryCard
            title="Idle Periods"
            value={idlePeriods.length}
            subtitle={`${totalHours} total hours`}
            color="red"
          />
        </div>

        {/* Two-column layout */}
        <div className="detailed-grid">
          {/* Left Column - Idle Periods */}
          <div className="detail-column">
            <div className="detail-card">
              <div className="detail-card-header">
                <h3 className="detail-title">⏰ Idle Periods Detected</h3>
                <div className="detail-subtitle">
                  {idlePeriods.length} periods totaling ${totalWaste.toFixed(2)} in wasted cost
                </div>
              </div>

              <div className="idle-periods-container">
                <div className="periods-table-container">
                  <table className="periods-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Duration</th>
                        <th>Avg CPU</th>
                        <th>Avg Memory</th>
                        <th>Wasted Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPeriods.slice(0, 10).map((period, index) => (
                        <tr key={index} className="period-row">
                          <td>
                            <div className="period-time">
                              <div className="period-start">
                                {formatDate(period.start)}
                              </div>
                              <div className="period-hours">
                                to {formatDate(period.end)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="duration-cell">
                              <Clock size={14} />
                              <span>{period.duration_hours}h</span>
                            </div>
                          </td>
                          <td>
                            <div className="resource-usage">
                              <div className="usage-bar">
                                <div
                                  className="usage-fill cpu-usage"
                                  style={{ width: `${Math.min(period.avg_cpu || 0, 100)}%` }}
                                ></div>
                              </div>
                              <span className="usage-text">{period.avg_cpu?.toFixed(1) || 0}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="resource-usage">
                              <div className="usage-bar">
                                <div
                                  className="usage-fill memory-usage"
                                  style={{ width: `${Math.min(period.avg_memory || 0, 100)}%` }}
                                ></div>
                              </div>
                              <span className="usage-text">{period.avg_memory?.toFixed(1) || 0}%</span>
                            </div>
                          </td>
                          <td className="wasted-cost-cell">
                            <div className="cost-amount">
                              ${(period.wasted_cost || 0).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {idlePeriods.length > 10 && (
                  <div className="more-periods">
                    <span className="more-text">
                      + {idlePeriods.length - 10} more idle periods detected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Analysis */}
          <div className="detail-column">
            {/* Waste Analysis */}
            <div className="detail-card">
              <h3 className="detail-title">📊 Waste Analysis</h3>
              <div className="waste-analysis-grid">
                <div className="waste-metric">
                  <div className="waste-label">Underutilization Score</div>
                  <div className="waste-value">
                    {(wasteAnalysis.underutilized_score || 0).toFixed(2)}
                  </div>
                  <div className="waste-scale">
                    <div className="scale-bar">
                      <div
                        className="scale-fill"
                        style={{ width: `${(wasteAnalysis.underutilized_score || 0) * 100}%` }}
                      ></div>
                    </div>
                    <div className="scale-labels">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                <div className="waste-metric">
                  <div className="waste-label">Total Waste Percentage</div>
                  <div className="waste-value">
                    {(wasteAnalysis.total_waste_percentage || 0).toFixed(1)}%
                  </div>
                  <div className="waste-description">
                    Percentage of resources wasted due to underutilization
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="detail-card">
              <h3 className="detail-title">🚀 Optimization Recommendations</h3>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">
                      {index === 0 && '💡'}
                      {index === 1 && '⚡'}
                      {index === 2 && '📈'}
                      {index === 3 && '💰'}
                      {index > 3 && '✅'}
                    </div>
                    <div className="recommendation-content">
                      <p className="recommendation-text">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button
            className="action-btn btn-download"
            onClick={() => downloadReport(data)}
          >
            📥 Download Full Report
          </button>
          <button
            className="action-btn btn-copy"
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          >
            📋 Copy Results
          </button>
          <button className="action-btn btn-apply">
            🛠️ Implement Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, subtitle, color }) {
  const colorClass = `summary-card summary-${color}`;

  return (
    <div className={colorClass}>
      <h4 className="summary-card-title">{title}</h4>
      <div className="summary-card-value">{value}</div>
      <div className="summary-card-subtitle">{subtitle}</div>
    </div>
  );
}