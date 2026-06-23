import { useState } from "react";
import { predictCost, detectWaste } from "../cloudOptimizer";
import UploadPanel from "./UploadPanel";
import ReceiptSummary from "./ReceiptSummary";
import ForecastChart from "./ForecastChart";
import ForecastTable from "./ForecastTable";
import PerformanceCard from "./PerformanceCard";
import OptimizationList from "./OptimizationList";
import WastePanel from "./WastePanel";
import "./Dashboard.css";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | ready | loading | done | error
  const [error, setError] = useState("");
  const [costData, setCostData] = useState(null);
  const [wasteData, setWasteData] = useState(null);

  const handleFileSelected = (selected) => {
    setFile(selected);
    setFileName(selected.name);
    setError("");
    setStatus("ready");
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setError("");
    setCostData(null);
    setWasteData(null);
    setStatus("idle");
  };

  const handleTrySample = async () => {
    try {
      const res = await fetch("/sample_generated.csv");
      const blob = await res.blob();
      const sampleFile = new File([blob], "sample_generated.csv", { type: "text/csv" });
      handleFileSelected(sampleFile);
    } catch {
      setError("Couldn't load the sample file. Try uploading your own CSV instead.");
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus("loading");
    setError("");

    const [costResult, wasteResult] = await Promise.allSettled([
      predictCost(file),
      detectWaste(file),
    ]);

    if (costResult.status === "fulfilled") {
      setCostData(costResult.value);
    } else {
      setCostData(null);
    }

    if (wasteResult.status === "fulfilled") {
      setWasteData(wasteResult.value);
    } else {
      setWasteData(null);
    }

    if (costResult.status === "rejected" && wasteResult.status === "rejected") {
      setError(
        "Make sure your CSV has timestamp, cpu_usage, memory_usage, disk_usage, and cost_per_hour columns, and try again."
      );
      setStatus("error");
      return;
    }

    setStatus("done");
  };

  const hasResults = status === "done" && costData;

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-inner">
          <h1 className="wordmark">Cloud Cost Optimizer</h1>
          {!hasResults && (
            <p className="page-tagline">
              Upload your cloud usage data for a 7-day cost forecast and waste report.
            </p>
          )}
          {hasResults && (
            <button className="btn btn-ghost btn-small" onClick={handleReset}>
              New analysis
            </button>
          )}
        </div>
      </header>

      <main className="page-main">
        {!hasResults && (
          <UploadPanel
            fileName={fileName}
            status={status}
            error={error}
            onFileSelected={handleFileSelected}
            onAnalyze={handleAnalyze}
            onTrySample={handleTrySample}
            onReset={handleReset}
          />
        )}

        {hasResults && (
          <div className="results">
            <div className="results-top">
              <ReceiptSummary costPredictions={costData.cost_predictions} />
              <PerformanceCard performance={costData.performance_predictions} />
            </div>

            <section className="results-section">
              <h2 className="section-heading">Forecast</h2>
              <div className="card card-chart">
                <ForecastChart days={costData.cost_predictions.predicted_cost_next_7_days} />
              </div>
              <ForecastTable days={costData.cost_predictions.predicted_cost_next_7_days} />
            </section>

            <section className="results-grid">
              <OptimizationList opportunities={costData.optimization_opportunities} />
              <WastePanel waste={wasteData} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}