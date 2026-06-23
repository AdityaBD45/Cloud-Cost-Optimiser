import { useRef, useState } from "react";
import { UploadIcon, DocumentIcon, AlertIcon, SpinnerIcon } from "./icons";

export default function UploadPanel({
  fileName,
  status,
  error,
  onFileSelected,
  onAnalyze,
  onTrySample,
  onReset,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  };

  const isBusy = status === "loading";

  return (
    <section className="panel-upload" aria-label="Upload usage data">
      <div
        className={`dropzone ${dragOver ? "dropzone--over" : ""} ${fileName ? "dropzone--filled" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isBusy && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelected(f);
          }}
        />

        {fileName ? (
          <div className="dropzone-file">
            <DocumentIcon className="dropzone-icon" />
            <div>
              <p className="dropzone-filename">{fileName}</p>
              <p className="dropzone-hint">Click to choose a different file</p>
            </div>
          </div>
        ) : (
          <div className="dropzone-empty">
            <UploadIcon className="dropzone-icon" />
            <p className="dropzone-title">Drop your usage CSV here</p>
            <p className="dropzone-hint">or click to browse</p>
            <p className="dropzone-columns">
              Required columns:{" "}
              <code>timestamp, cpu_usage, memory_usage, disk_usage, cost_per_hour</code>
            </p>
          </div>
        )}
      </div>

      <div className="panel-upload-actions">
        <button
          className="btn btn-primary"
          disabled={!fileName || isBusy}
          onClick={onAnalyze}
        >
          {isBusy ? (
            <>
              <SpinnerIcon className="spin" /> Analyzing usage data&hellip;
            </>
          ) : (
            "Analyze usage"
          )}
        </button>

        {!fileName && (
          <button className="btn btn-ghost" onClick={onTrySample} disabled={isBusy}>
            Try sample data
          </button>
        )}

        {fileName && !isBusy && (
          <button className="btn btn-ghost" onClick={onReset}>
            Start over
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner" role="alert">
          <AlertIcon className="error-icon" />
          <div>
            <p className="error-title">Couldn&rsquo;t analyze that file</p>
            <p className="error-detail">{error}</p>
          </div>
        </div>
      )}
    </section>
  );
}