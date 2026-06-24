import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

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
    default:
      return ""
  }
}

export default function StockDetailPage() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [stock, setStock] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stock/${symbol}`)
      .then(res => res.json())
      .then(data => {
        setStock(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load stock data.")
        setLoading(false)
      })
  }, [symbol])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  const metrics = [
    { key: "PE_ratio", label: "P/E Ratio", value: stock.PE_ratio },
    { key: "PB_ratio", label: "P/B Ratio", value: stock.PB_ratio },
    { key: "ROE", label: "Return on Equity", value: stock.ROE },
    { key: "dividend_yield", label: "Dividend Yield", value: stock.dividend_yield },
    { key: "debt_to_equity", label: "Debt / Equity", value: stock.debt_to_equity },
  ]

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "16px", cursor: "pointer" }}>
        ← Back to rankings
      </button>

      <h1>{stock.name} ({stock.symbol})</h1>
      <p style={{ color: "gray" }}>{stock.sector} · {stock.industry}</p>
      <h2 style={{ fontSize: "32px" }}>${stock.price}</h2>

      <hr />

      <h3>Financial Metrics</h3>
      {metrics.map(m => (
        <div key={m.key} style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "10px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{m.label}</strong>
            <span>{m.value ?? "N/A"}</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#555" }}>
            {getMetricExplanation(m.key, m.value)}
          </p>
        </div>
      ))}

      <hr />

      <h3>About {stock.name}</h3>
      <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{stock.description}</p>
      <p style={{ fontSize: "13px", color: "gray" }}>
        Employees: {stock.employees?.toLocaleString() ?? "N/A"} · Country: {stock.country ?? "N/A"}
      </p>
      {stock.website && (
        <a href={stock.website} target="_blank" rel="noreferrer">{stock.website}</a>
      )}
    </div>
  )
}