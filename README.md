# Cloud Cost Optimizer — Frontend

A React + Vite web app for visualizing cloud infrastructure cost forecasts and waste reports. Upload a CSV of your cloud usage data and get a 7-day cost prediction, confidence intervals, peak load analysis, idle resource detection, and optimization recommendations.

**Live app →** https://cloud-cost-optimiser-lemon.vercel.app/

> The backend is on Render Free Tier. The first request after inactivity may take 30–60 seconds (cold start). Subsequent requests are fast.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Project Structure](#project-structure)
- [Component Breakdown](#component-breakdown)
- [API Integration](#api-integration)
- [Design System](#design-system)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Tech Stack](#tech-stack)

---

## What It Does

1. User uploads a cloud usage CSV (or clicks **Try sample data**)
2. Two API calls fire in parallel — `/predict-cost` and `/detect-waste`
3. Results are displayed as:
   - **Receipt-style summary card** — weekly total cost, trend direction, model confidence
   - **7-day forecast chart** — SVG area chart with a P10/P90 confidence band
   - **Ledger table** — daily breakdown with cost, range, CPU%, memory%, confidence bar
   - **Peak load card** — expected CPU/memory peaks and bottleneck risk badge
   - **Optimization list** — ranked recommendations with savings estimates
   - **Waste panel** — idle periods, underutilization %, estimated monthly savings

---

## Project Structure

```
cloud-cost-optimizer-ui/
│
├── public/
│   └── sample_generated.csv       # Sample data fetched by "Try sample data" button
│
├── src/
│   ├── index.css                  # Global design tokens (CSS variables)
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Root component (renders Dashboard)
│   ├── cloudOptimizer.js          # API client (predictCost, detectWaste)
│   │
│   └── components/
│       ├── Dashboard.jsx          # State management and page layout
│       ├── Dashboard.css          # All component styles
│       ├── icons.jsx              # Custom inline SVG icon set
│       ├── UploadPanel.jsx        # Drag-and-drop file upload + states
│       ├── ReceiptSummary.jsx     # Weekly total "receipt" card
│       ├── ForecastChart.jsx      # Custom SVG area chart (no chart library)
│       ├── ForecastTable.jsx      # Ledger-style 7-day table
│       ├── PerformanceCard.jsx    # Peak CPU/memory + risk badge
│       ├── OptimizationList.jsx   # Optimization recommendations
│       └── WastePanel.jsx        # Idle periods and waste stats
│
├── index.html                     # HTML shell + Google Fonts
├── vite.config.js
└── package.json
```

---

## Component Breakdown

### `Dashboard.jsx`

The top-level orchestrator. Owns all state — file selection, loading/error status, API results.

**State:**

| State       | Values                              | Description                        |
|-------------|-------------------------------------|------------------------------------|
| `file`      | `File \| null`                      | The selected CSV file object       |
| `fileName`  | `string`                            | Display name                       |
| `status`    | `idle \| ready \| loading \| done \| error` | Controls which view renders |
| `costData`  | `object \| null`                    | Response from `/predict-cost`      |
| `wasteData` | `object \| null`                    | Response from `/detect-waste`      |
| `error`     | `string`                            | Error message for the banner       |

Both API calls run in **parallel** via `Promise.allSettled` — if one fails, the other's results still render. An error banner only appears if both fail.

---

### `UploadPanel.jsx`

Handles the upload interaction before results are available.

- Drag-and-drop zone (uses `onDrop` / `onDragOver`)
- Hidden `<input type="file" accept=".csv">` triggered by click or Enter/Space keypress
- Displays filename once selected, allows switching files
- "Try sample data" button fetches `/sample_generated.csv` from the public folder
- Loading state shows a spinning icon in the button and disables all controls
- Error state renders a color-coded banner below the actions

---

### `ReceiptSummary.jsx`

The signature visual — styled like a physical receipt/invoice.

- Weekly total rendered in large copper monospace numerals
- Dashed internal rule line
- Trend badge with directional icon (up/down/flat) and daily % change rate
- Model confidence displayed as an average across the 7 forecast days
- Bottom edge rendered with a CSS `radial-gradient` perforation effect (a row of punched circles)

---

### `ForecastChart.jsx`

Custom SVG chart — no chart library used.

- **Confidence band** — filled path traced from P90 values forward and P10 values in reverse (closing a polygon), rendered as a copper-tinted fill
- **Median line** — SVG `<path>` with copper stroke connecting P50 values
- **Points** — white-filled circles with copper stroke at each day
- **Grid + axis labels** — SVG `<line>` and `<text>` elements, values formatted as `$X.X`
- Chart is fully responsive (scales with container via `viewBox` + `width: 100%`)
- Each point has a `<title>` tooltip showing full date and P10/P50/P90 values

---

### `ForecastTable.jsx`

Ledger-style tabular breakdown.

- Grid layout (6 columns desktop, 3 columns mobile — Range/CPU/Memory hidden via `.col-range / .col-cpu / .col-mem` CSS classes)
- Day and date stacked vertically
- Cost in copper, range in muted tone
- Confidence shown as a green progress bar + numeric value side-by-side
- Header row uses monospace uppercase labels with letter-spacing

---

### `PerformanceCard.jsx`

- Two horizontal bar charts (copper for CPU, forest green for memory) with labelled percentages
- Peak timestamp formatted with `toLocaleString` into a human-readable "Thu 3:00 PM" format
- Risk badge: `high` (brick red), `medium` (copper), `low` (forest green)

---

### `OptimizationList.jsx`

Translates the API's `type` strings into human-readable labels and plain-English descriptions:

| API `type`          | Label shown to user                   |
|---------------------|---------------------------------------|
| `right_sizing`      | Right-size your instances             |
| `scheduling`        | Schedule off-hours shutdown           |
| `burstable_instance`| Switch to burstable instances         |
| `auto_scaling`      | Enable auto-scaling                   |
| `monitoring`        | Keep monitoring                       |

Each item shows the label, a savings estimate in forest green, a description, and a confidence bar.

---

### `WastePanel.jsx`

- Two large stat figures: underutilization % and estimated monthly savings
- List of flagged idle periods (capped at 6, shows "+N more" if there are extras)
- Bulleted recommendations from the API

---

### `icons.jsx`

A small set of custom inline SVG icons — avoids any icon library dependency. The old codebase imported `lucide-react` without declaring it in `package.json`, which breaks a fresh `npm install`. All icons here use `currentColor` stroke so they inherit color from parent CSS.

| Export           | Used in                  |
|------------------|--------------------------|
| `UploadIcon`     | UploadPanel (dropzone)   |
| `DocumentIcon`   | UploadPanel (file ready) |
| `AlertIcon`      | UploadPanel (error)      |
| `SpinnerIcon`    | UploadPanel (loading)    |
| `ClockIcon`      | PerformanceCard, WastePanel |
| `TrendUpIcon`    | ReceiptSummary           |
| `TrendDownIcon`  | ReceiptSummary           |
| `TrendFlatIcon`  | ReceiptSummary           |
| `GaugeIcon`      | PerformanceCard          |
| `BoltIcon`       | OptimizationList         |
| `StampCheckIcon` | WastePanel               |

---

## API Integration

**`src/cloudOptimizer.js`**

```js
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  || "https://cloudcost-optimizer-api.onrender.com";

export const predictCost = (file) => postCsv("/predict-cost", file);
export const detectWaste = (file) => postCsv("/detect-waste", file);
```

Both functions send a `multipart/form-data` POST with the file attached as `"file"`.

To point at a local backend during development, create a `.env.local` file:

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Design System

The visual design follows a **ledger/statement** aesthetic — a nod to the fact that the output is literally a cost report:

**`src/index.css`** defines all design tokens as CSS custom properties:

```css
--paper: #F1F3EC;         /* sage-tinted background */
--paper-raised: #FBFCF8;  /* card surfaces */
--ink: #1F2A24;           /* primary text */
--ink-soft: #5C6B61;      /* secondary text */
--copper: #B8742E;        /* primary accent — all cost figures */
--forest: #2F6B5E;        /* savings / positive values */
--brick: #A33B2E;         /* risk / error states */

--font-display: 'Fraunces', Georgia, serif;  /* headings */
--font-mono: 'IBM Plex Mono', Consolas;      /* all numbers */
--font-body: 'IBM Plex Sans', sans-serif;    /* body text */
```

The background uses a `linear-gradient` CSS rule to render horizontal ledger lines across the page.

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/AdityaBD45/Cloud-Cost-Optimiser.git
cd Cloud-Cost-Optimiser/cloud-cost-optimizer-ui

# Install dependencies (zero extra packages beyond React + Vite)
npm install

# Start dev server
npm run dev
```

App runs at http://localhost:5173

To use a locally running backend instead of the deployed API:

```bash
# In cloud-cost-optimizer-ui/, create .env.local
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

---

## Deployment

The frontend is deployed on **Vercel** via GitHub integration — any push to `main` triggers an automatic redeploy.

No build configuration changes are needed. Vercel auto-detects Vite and sets `npm run build` + `dist` as the output directory.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | React 19 + Vite 7                       |
| Styling     | Plain CSS (custom properties, no library) |
| Charts      | Custom SVG (no Recharts or Chart.js)    |
| HTTP        | Native `fetch` API (no Axios)           |
| Icons       | Inline SVG (no icon library)            |
| Fonts       | Google Fonts (Fraunces, IBM Plex Mono, IBM Plex Sans) |
| Deployment  | Vercel                                  |

---

## Related

- **Backend repo →** https://github.com/AdityaBD45/CloudCost-Optimizer-api
- **Live API docs →** https://cloudcost-optimizer-api.onrender.com/docs