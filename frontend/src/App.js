import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [data, setData] = useState(null);
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
    const res = await fetch(`${BACKEND_URL}/segment`);
    const json = await res.json();
    setData(json);
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
            backgroundColor: ["#60a5fa", "#34d399", "#f59e0b"],
          },
        ],
      }
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f4ff, #e5f4ef)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
          maxWidth: "750px",
          width: "100%",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "1rem" }}>
          🧩 Privacy-Aware Audience Targeting
        </h1>

        <p style={{ fontSize: "1.1rem", color: "#444", textAlign: "center" }}>
          This simulation demonstrates how advertisers and publishers can compare user lists using
          <strong> hashed identifiers</strong> without sharing private data — a privacy-safe audience match.
        </p>

        <hr style={{ margin: "2rem 0" }} />

        {loading ? (
          <p>🔄 Loading segment data...</p>
        ) : (
          <>
            <h2 style={{ fontSize: "1.5rem" }}>📊 Current Segment Overlap</h2>
            <ul style={{ fontSize: "1.1rem", listStyle: "none", paddingLeft: 0 }}>
              <li><strong>Overlap Count:</strong> {data.overlap_count}</li>
              <li><strong>Total in Dataset A:</strong> {data.total_a}</li>
              <li><strong>Total in Dataset B:</strong> {data.total_b}</li>
              <li><strong>Percent Overlap:</strong> {data.percent_overlap}%</li>
            </ul>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "1rem",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "1rem",
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
                  marginRight: "1rem",
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
            </div>

            {showChart && chartData && (
              <div style={{ marginTop: "2rem" }}>
                <Bar data={chartData} />
              </div>
            )}

            {showInfo && (
              <div style={{ fontSize: "0.95rem", color: "#333", marginTop: "1.5rem" }}>
                <p>
                  <strong>Dataset A/B:</strong> Simulated independent user lists (e.g., advertiser & publisher).
                </p>
                <p>
                  <strong>Overlap Count:</strong> Number of users with matching hashed emails — simulating
                  shared users in a privacy-safe way.
                </p>
                <p>
                  <strong>Percent Overlap:</strong> How many users exist in both datasets as a percentage of
                  the total.
                </p>
                <p>
                  This is similar to how clean rooms like Google's Ads Data Hub work — enabling audience targeting
                  without exposing private data between parties.
                </p>
              </div>
            )}
          </>
        )}

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.95rem" }}>
          🛠️ View the API directly:{" "}
          <a
            href="https://audience-cleanroom.onrender.com/segment"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3", textDecoration: "none", fontWeight: "bold" }}
          >
            /segment endpoint
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
