# Cloud Cost Optimizer - Frontend

A modern dashboard for analyzing and optimizing cloud infrastructure costs. Upload your cloud usage data to get AI-powered insights and reduce spending.

## Features

This project is designed for simple testing, no cloud credentials, and no complex setup — just upload a CSV file.

🚀 Features
🔮 Cost Prediction

Predicts next 7 days of infrastructure cost

Detects cost trend direction

Estimates CPU & memory usage patterns

Suggests optimization opportunities

♻️ Waste Detection

Identifies idle / underutilized periods

Calculates wasted cost

Estimates monthly savings

Provides actionable recommendations

📂 CSV-First Design

No dashboards or agents required

Just upload a CSV file

Ideal for students, demos, and analysis

🧠 Tech Stack
Layer	Technology
Backend	FastAPI
ML / Analytics	Pandas, NumPy, Scikit-Learn, LightGBM
API Server	Uvicorn
Containerization	Docker
Hosting	Render (Free Tier)
Frontend	React (separate repo)
📂 CSV-Based Input (Easy Testing)
✅ Required CSV Columns
timestamp,cpu_usage,memory_usage,disk_usage,cost_per_hour

Column	Description
timestamp	Date & time (YYYY-MM-DD HH:MM:SS)
cpu_usage	CPU usage (%)
memory_usage	Memory usage (%)
disk_usage	Disk usage (%)
cost_per_hour	Hourly cost (USD)
🧪 Sample CSV File (For Testing)

