# ☁️ Cloud Cost Optimiser

A modern, AI-powered web application for **analyzing, predicting, and optimizing cloud infrastructure costs**.  
Users can upload cloud usage data (CSV) to get **7-day cost predictions**, **waste detection**, and **actionable optimization insights**.

---

## 🚀 Live Demo

### 🔹 Frontend (Vercel)
👉 https://cloud-cost-optimiser-lemon.vercel.app/

### 🔹 Backend API (Render)
👉 https://cloudcost-optimizer-api.onrender.com/docs

> ⚠️ **Note:**  
> The backend is hosted on Render Free Tier.  
> The **first request may take up to 30–60 seconds** due to cold start.  
> Subsequent requests are fast.

---

## 🧠 Key Features

- 📊 **7-Day Cost Prediction**
- 🧹 **Idle Resource & Waste Detection**
- 💡 **Optimization Recommendations**
- 📂 **CSV-based input (simple & flexible)**
- ⚡ **Modern React UI**
- 🧪 **ML-powered backend (FastAPI + Python)**

---

## 📂 CSV-Based Input

Upload a CSV file with the following **required columns**:

```csv
timestamp,cpu_usage,memory_usage,disk_usage,cost_per_hour


✅ Sample CSV (Ready to Use)

A ready-to-use sample CSV file is included in this repository:
sample_generated.csv

👉 How to use it:

Click sample_generated.csv in GitHub

Click Download

Upload it directly in the web app

This allows anyone to test the project instantly.

🖥️ Frontend Tech Stack

⚛️ React (Vite)

🎨 CSS (custom styling)

📈 Recharts

🔗 Axios

🌐 Deployed on Vercel

⚙️ Backend Tech Stack

🐍 Python

⚡ FastAPI

📊 Pandas, NumPy

🤖 Scikit-learn, LightGBM

🐳 Docker

☁️ Deployed on Render


🧪 How It Works (High Level)

User uploads cloud usage CSV

Backend parses and validates data

ML models analyze trends and patterns

API returns:

Cost predictions

Idle resource detection

Optimization recommendations

Frontend visualizes results clearly

📦 Local Development (Optional)
Frontend
npm install
npm run dev


Backend
pip install -r requirements.txt
uvicorn api.main:app --reload
