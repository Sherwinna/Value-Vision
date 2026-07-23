import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { fetchWithAuth } from "../api"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

function getMetricExplanation(metric, value) {
  if (value === null || value === undefined) return "Data not available."
  switch (metric) {
    case "PE_ratio":
      if (value < 15) return `P/E of ${value} is low — you're paying $${value} per $1 of earnings. This may indicate an undervalued stock.`
      if (value < 20) return `P/E of ${value} is reasonable for a value investor.`
      return `P/E of ${value} is above the value investing threshold of 20. The stock may be overvalued.`
    case "PB_ratio":
      if (value < 1) return `P/B of ${value} means the stock trades below its book value — a strong value signal.`
      if (value < 3) return `P/B of ${value} is within the acceptable range for value investing.`
      return `P/B of ${value} is high — the stock trades well above its book value.`
    case "ROE":
      if (value < 0) return `Negative ROE means the company is losing money on shareholder equity — a red flag.`
      if (value < 0.10) return `ROE of ${(value * 100).toFixed(1)}% is low — the company is not generating strong returns.`
      return `ROE of ${(value * 100).toFixed(1)}% is healthy — the company generates good returns on equity.`
    case "dividend_yield":
      if (value === 0) return `This stock pays no dividend.`
      return `Dividend yield of ${(value * 100).toFixed(2)}% means you earn $${(value * 100).toFixed(2)} per $100 invested annually.`
    case "debt_to_equity":
      if (value < 1) return `Debt/Equity of ${value} is low — the company has manageable debt.`
      if (value < 2) return `Debt/Equity of ${value} is moderate — worth monitoring.`
      return `Debt/Equity of ${value} is high — the company carries significant debt which increases risk.`
    default: return ""
  }
}

export default function StockDetailPage() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [stock, setStock] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const [inWatchlist, setInWatchlist] = useState(false)
  const [history, setHistory] = useState([])

  function toggleWatchlist() {
    if (inWatchlist) {
      fetchWithAuth(`/api/watchlist/${symbol}`, { method: "DELETE" })
        .then(() => setInWatchlist(false))
        .catch(err => alert(err.message))
    } else {
      fetchWithAuth(`/api/watchlist/${symbol}`, { method: "POST" })
        .then(() => setInWatchlist(true))
        .catch(err => alert(err.message))
    }
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stock/${symbol}`)
      .then(res => res.json())
      .then(data => { setStock(data); setLoading(false) })
      .catch(() => { setError("Failed to load stock data."); setLoading(false) })
  }, [symbol])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stock/${symbol}/history`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => {})
  }, [symbol])

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}><p style={{ color: "#6b7280" }}>Loading...</p></div>
  if (error) return <div style={{ padding: "32px", textAlign: "center" }}><p style={{ color: "#dc2626" }}>{error}</p></div>

  const metrics = [
    { key: "PE_ratio", label: "P/E Ratio", value: stock.PE_ratio },
    { key: "PB_ratio", label: "P/B Ratio", value: stock.PB_ratio },
    { key: "ROE", label: "Return on Equity", value: stock.ROE },
    { key: "dividend_yield", label: "Dividend Yield", value: stock.dividend_yield },
    { key: "debt_to_equity", label: "Debt / Equity", value: stock.debt_to_equity },
  ]

  return (
    <div style={{ background: "#f0fdf4", minHeight: "100vh", padding: "32px 16px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button onClick={() => navigate(-1)}
          style={{ fontSize: "13px", color: "#15803d", background: "transparent", border: "1px solid #86efac", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", marginBottom: "20px" }}>
          ← Back
        </button>

        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>{stock.sector} · {stock.industry}</p>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", marginBottom: "4px" }}>{stock.name}</h1>
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>{stock.symbol}</p>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#111827", marginBottom: "12px" }}>${stock.price}</p>
          {user && (
            <button onClick={toggleWatchlist}
              style={{ padding: "8px 16px", background: inWatchlist ? "#fef2f2" : "#f0fdf4", color: inWatchlist ? "#dc2626" : "#15803d", border: `1px solid ${inWatchlist ? "#fecaca" : "#86efac"}`, borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
              {inWatchlist ? "− Remove from Watchlist" : "+ Add to Watchlist"}
            </button>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>90-Day Price Chart</h3>
          {history.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={history}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={14} />
                  <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#15803d" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                A rising price may indicate growing investor confidence. Always check the metrics below before deciding.
              </p>
            </>
          ) : (
            <p style={{ color: "#9ca3af", fontSize: "13px" }}>No price history available.</p>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>Financial Metrics</h3>
          {metrics.map(m => (
            <div key={m.key} style={{ background: "#f9fafb", borderRadius: "8px", padding: "12px 16px", marginBottom: "10px", border: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <strong style={{ fontSize: "13px", color: "#374151" }}>{m.label}</strong>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#15803d" }}>{m.value ?? "N/A"}</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{getMetricExplanation(m.key, m.value)}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>About {stock.name}</h3>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#374151", marginBottom: "12px" }}>{stock.description}</p>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>
            Employees: {stock.employees?.toLocaleString() ?? "N/A"} · Country: {stock.country ?? "N/A"}
          </p>
          {stock.website && (
            <a href={stock.website} target="_blank" rel="noreferrer" style={{ fontSize: "13px", color: "#15803d" }}>{stock.website}</a>
          )}
        </div>
      </div>
    </div>
  )
}