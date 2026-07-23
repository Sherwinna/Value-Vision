import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import WatchlistPage from "./pages/WatchlistPage"
import LearnPage from "./pages/LearnPage"
import StockDetailPage from "./pages/StockDetailPage"
import { useAuth } from "./context/AuthContext"
import { fetchWithAuth } from "./api"

function StockTable() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSector, setSelectedSector] = useState("All")
  const { user } = useAuth()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => {
        setStocks(data)
        setLoading(false)
      })
  }, [])

  function addToWatchlist(symbol) {
    fetchWithAuth(`/api/watchlist/${symbol}`, { method: "POST" })
      .then(() => alert(`${symbol} added to watchlist!`))
      .catch(err => alert(err.message))
  }

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <p style={{ color: "#6b7280", fontSize: "16px" }}>Loading stocks...</p>
    </div>
  )

  const sectors = ["All", ...new Set(stocks.map(s => s.sector).filter(Boolean))]
  const filteredStocks = selectedSector === "All" ? stocks : stocks.filter(s => s.sector === selectedSector)

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px", background: "#f0fdf4", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", color: "#111827", marginBottom: "6px" }}>Top Ranked Stocks</h1>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>Ranked by composite value investing score · updated daily</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "#6b7280" }}>Filter by sector:</label>
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            style={{ fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px", padding: "4px 8px", color: "#374151" }}
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>⚠️ = Potential value trap — hover for details</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#dcfce7", borderBottom: "1px solid #e5e7eb" }}>
              {["#", "Symbol", "Name", "P/E", "P/B", "ROE", "Div Yield", "Debt/Equity", "Score", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: h === "#" || h === "Symbol" || h === "Name" || h === "" ? "left" : "right", fontSize: "11px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => (
              <tr key={stock.symbol} style={{ borderBottom: "1px solid #f3f4f6" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <td style={{ padding: "10px 14px", color: "#9ca3af", fontSize: "12px" }}>{index + 1}</td>
                <td style={{ padding: "10px 14px", fontWeight: "600", color: "#15803d" }}>{stock.symbol}</td>
                <td style={{ padding: "10px 14px" }}>
                  <a href={`/stock/${stock.symbol}`} style={{ color: "#111827", textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#2563eb"}
                    onMouseLeave={e => e.target.style.color = "#111827"}
                  >
                    {stock.name}
                  </a>
                  {stock.value_trap_flags?.length > 0 && (
                    <span title={`⚠️ Potential value trap: ${stock.value_trap_flags.join(", ")}. Visit the Learn page to understand what this means.`}
                      style={{ marginLeft: "6px", cursor: "help", fontSize: "12px" }}>⚠️</span>
                  )}
                </td>
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
                  {user && (
                    <button onClick={() => addToWatchlist(stock.symbol)}
                      style={{ fontSize: "11px", color: "#15803d", border: "1px solid #86efac", borderRadius: "4px", padding: "3px 8px", background: "transparent", cursor: "pointer" }}>
                      + Watch
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<StockTable />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App