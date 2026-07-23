import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { fetchWithAuth } from "../api"

export default function WatchlistPage() {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchWithAuth("/api/watchlist")
      .then(data => {
        setWatchlist(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  function removeFromWatchlist(symbol) {
    fetchWithAuth(`/api/watchlist/${symbol}`, { method: "DELETE" })
      .then(() => setWatchlist(prev => prev.filter(s => s.symbol !== symbol)))
      .catch(err => alert(err.message))
  }

  if (!user) return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px", minHeight: "100vh", background: "#f0fdf4" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>My Watchlist</h2>
      <p style={{ color: "#6b7280" }}>Please <a href="/login" style={{ color: "#15803d" }}>sign in</a> to view your watchlist.</p>
    </div>
  )

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <p style={{ color: "#6b7280" }}>Loading watchlist...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px", minHeight: "100vh", background: "#f0fdf4" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>My Watchlist</h1>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>{watchlist.length} stock{watchlist.length !== 1 ? "s" : ""} tracked</p>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#6b7280", marginBottom: "8px" }}>You haven't added any stocks yet.</p>
          <a href="/" style={{ color: "#15803d", fontSize: "14px" }}>← Go to rankings to add stocks</a>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#dcfce7", borderBottom: "1px solid #e5e7eb" }}>
                {["Symbol", "Name", "P/E", "P/B", "ROE", "Div Yield", "Debt/Equity", "Score", ""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: h === "Symbol" || h === "Name" || h === "" ? "left" : "right", fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watchlist.map(stock => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #f3f4f6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <td style={{ padding: "10px 14px", fontWeight: "600", color: "#15803d" }}>{stock.symbol}</td>
                  <td style={{ padding: "10px 14px", color: "#111827" }}>{stock.name}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{stock.PE_ratio ?? <span style={{ color: "#d1d5db" }}>N/A</span>}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{stock.PB_ratio ?? <span style={{ color: "#d1d5db" }}>N/A</span>}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{stock.ROE ?? <span style={{ color: "#d1d5db" }}>N/A</span>}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{stock.dividend_yield ?? <span style={{ color: "#d1d5db" }}>N/A</span>}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "#374151" }}>{stock.debt_to_equity ?? <span style={{ color: "#d1d5db" }}>N/A</span>}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "99px" }}>
                      {stock.score}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => removeFromWatchlist(stock.symbol)}
                      style={{ fontSize: "11px", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "4px", padding: "3px 8px", background: "transparent", cursor: "pointer" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}