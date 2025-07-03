# 🧩 Privacy-Aware Audience Targeting System (Clean Room Simulation)

This project simulates how advertisers and publishers can securely segment audiences using hashed identifiers, without ever sharing personally identifiable information (PII). It mimics how modern clean rooms (like Google's Ads Data Hub or Meta’s Advanced Matching) enable privacy-safe data collaboration.

> 🔐 Built by [Jasper Maximo Garcia](https://www.linkedin.com/in/burgahjasper/)  
> 🌐 [Live Demo](https://audience-cleanroom.vercel.app/) • [API Docs](https://audience-cleanroom.onrender.com/segment)

---

## 🚀 Features

- 🔗 **Privacy-safe joins** using SHA256 hashed email identifiers
- 📊 **Audience overlap metrics** between two synthetic datasets
- 🔁 **Dynamic refresh simulation** to mimic live data updates
- 📈 **Trend tracking** with historical logging and interactive line chart
- 🧠 **Explanatory UI + Exportable CSV** for educational clarity and analysis
- 🌙 **Dark mode styling** for sleek and recruiter-friendly presentation

---

## 🧪 Technologies Used

| Layer      | Stack                                    |
|------------|------------------------------------------|
| Frontend   | React, Chart.js, CSS                     |
| Backend    | Python, Flask, Flask-CORS, SQLAlchemy    |
| Database   | PostgreSQL (hosted on Render)            |
| Hosting    | Frontend on Vercel, Backend on Render    |

---

## 🛠 How It Works

- **User data is simulated** via randomized emails and interests.
- **Emails are hashed** with SHA256 before storage to preserve privacy.
- **A clean-room-style join** is performed between datasets A and B using the hashed IDs.
- **Historical refreshes** are stored and visualized over time.
- When **Privacy Mode is enabled**, overlap data is suppressed to comply with GDPR/CCPA concepts.

---

## 📤 Exportable Data

Click "Export as CSV" in the app to download historical overlap logs. Perfect for deeper analysis in Excel or Python.

---

## 🧠 Why This Matters

Understanding privacy-preserving audience segmentation is crucial in today's data-driven world. This project demonstrates how clean rooms work in principle, and how ethical data use can still enable effective marketing.

---

## 🙋‍♂️ Built By

**Jasper Maximo Garcia**  
💼 [Portfolio](https://burgahjasper.github.io/terminalPortfolio/)  
🔗 [LinkedIn](https://www.linkedin.com/in/burgahjasper/)  
📧 jaspermaximo@gmail.com  
