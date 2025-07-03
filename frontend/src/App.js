// ...imports unchanged
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const BACKEND_URL = "https://audience-cleanroom.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const segmentRes = await fetch(`${BACKEND_URL}/segment`);
    const historyRes = await fetch(`${BACKEND_URL}/history`);

    const segmentJson = await segmentRes.json();
    const historyJson = await historyRes.json();

    setData(segmentJson);
    setHistory(historyJson);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetch(`${BACKEND_URL}/refresh`, { method: "POST" });
    await fetchData();
    setRefreshing(false);
  };

  const chartData = data
    ? {
        labels: ["Dataset A", "Dataset B", "Overlap"],
        datasets: [
          {
            label: "User Count",
            data: [data.total_a, data.total_b, data.overlap_count],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
          },
        ],
      }
    : null;
  const handleExportCSV = () => {
    if (!history || history.length === 0) return;

    const headers = ["timestamp", "total_a", "total_b", "overlap"];
    const rows = history.map(h => [h.timestamp, h.total_a, h.total_b, h.overlap]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "segment_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.6)",
          maxWidth: "750px",
          width: "100%",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
          color: "#e2e8f0",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem", color: "#93c5fd" }}>
          🧩 Privacy-Aware Audience Targeting
        </h1>

        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "#f87171", marginTop: "-1rem", marginBottom: "1.5rem" }}>
          ⏳ Please allow up to 50 seconds for the backend to wake up if inactive.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#cbd5e1", textAlign: "center" }}>
          This simulation demonstrates how advertisers and publishers can compare user lists using
          <strong> hashed identifiers</strong> without sharing private data. It's a simplified version of what clean rooms enable: privacy-safe audience matching.
        </p>

        <hr style={{ margin: "2rem 0", borderColor: "#475569" }} />

        {loading ? (
          <p style={{ textAlign: "center" }}>🔄 Loading segment data...</p>
        ) : (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#fbbf24" }}>
              📊 Current Segment Overlap
            </h2>
            <ul style={{ fontSize: "1.1rem", listStyle: "none", paddingLeft: 0 }}>
              <li><strong>Overlap Count:</strong> {data.overlap_count}</li>
              <li><strong>Total in Dataset A:</strong> {data.total_a}</li>
              <li><strong>Total in Dataset B:</strong> {data.total_b}</li>
              <li><strong>Percent Overlap:</strong> {data.percent_overlap}%</li>
            </ul>

            <div style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {refreshing ? "Refreshing..." : "🔁 Refresh Data"}
              </button>

              <button
                onClick={() => setShowChart(!showChart)}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {showChart ? "Hide Chart" : "📈 Show Chart"}
              </button>

              <button
                onClick={() => setShowInfo(!showInfo)}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {showInfo ? "Hide Explanation" : "❓ What does this mean?"}
              </button>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                📤 Export as CSV
              </button>

            </div>

            {showChart && (
              <div style={{ marginTop: "2rem" }}>
                <Bar data={chartData} />
              </div>
            )}

            {showChart && history.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ textAlign: "center", color: "#93c5fd" }}>📈 Overlap % Trend Over Time</h3>
                <Line
                  data={{
                    labels: history.map((h) => h.timestamp.split(" ")[1]),
                    datasets: [
                      {
                        label: "Overlap %",
                        data: history.map((h) =>
                          Math.round((h.overlap / (h.total_a + h.total_b - h.overlap)) * 100)
                        ),
                        borderColor: "#60a5fa",
                        backgroundColor: "#60a5fa",
                        fill: false,
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: true, labels: { color: "#d1d5db" } },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: "#d1d5db" },
                        title: { display: true, text: "Overlap %", color: "#d1d5db" },
                      },
                      x: {
                        ticks: { color: "#d1d5db" },
                        title: { display: true, text: "Time", color: "#d1d5db" },
                      },
                    },
                  }}
                />
              </div>
            )}

            {showInfo && (
              <div style={{ fontSize: "0.95rem", color: "#cbd5e1", marginTop: "1.5rem" }}>
                <p>
                  <strong>Dataset A/B:</strong> These are simulated datasets from two separate parties,
                  such as an advertiser and a publisher.
                </p>
                <p>
                  <strong>Overlap Count:</strong> This shows how many users appear in both datasets,
                  based on matching hashed email identifiers.
                </p>
                <p>
                  <strong>Percent Overlap:</strong> The proportion of shared users across both datasets.
                  This is calculated as overlap divided by the total number of unique users in both sets.
                </p>
                <p>
                  <strong>Why it matters:</strong> In real-world marketing, overlap metrics help determine
                  if an audience is viable for targeting or if two parties can run joint campaigns effectively.
                  Clean rooms enable this analysis without revealing raw user data, preserving privacy while
                  still enabling insight and action.
                </p>
                <p>
                  You can also <strong>export the overlap history to a CSV file</strong> for deeper analysis using Excel, Google Sheets, or Python.
                </p>
              </div>
            )}
          </>
        )}

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.95rem", color: "#94a3b8" }}>
          🛠️ View the API directly:{" "}
          <a
            href="https://audience-cleanroom.onrender.com/segment"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#93c5fd", textDecoration: "none", fontWeight: "bold" }}
          >
            /segment endpoint
          </a>
        </p>
        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#64748b", marginTop: "2rem" }}>
          Built by <strong>Jasper Maximo Garcia</strong> · <a href="https://github.com/BurgahJasper/audience-cleanroom" target="_blank" rel="noopener noreferrer" style={{ color: "#93c5fd", textDecoration: "none" }}>View on GitHub</a>
        </p>

      </div>
    </div>
  );
}

export default App;
