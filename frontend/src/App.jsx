import { useAuth } from "./context/AuthContext"
import { fetchWithAuth } from "./api"
import StockDetailPage from "./pages/StockDetailPage"
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import WatchlistPage from "./pages/WatchlistPage"
import LearnPage from "./pages/LearnPage"

function StockTable() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

function addToWatchlist(symbol) {
  fetchWithAuth(`/api/watchlist/${symbol}`, { method: "POST" })
    .then(() => alert(`${symbol} added to watchlist!`))
    .catch(err => alert(err.message))
}

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => {
        setStocks(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading stocks...</p>

  return (
    <div>
      <h1>Value Vision</h1>
      <h2>Top Ranked Stocks</h2>
      <p style={{ fontSize: "13px", color: "gray", marginBottom: "8px" }}>
  ⚠️ = Potential value trap — hover over the warning for details
    </p>
      <table border="1">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>P/E</th>
            <th>P/B</th>
            <th>ROE</th>
            <th>Div Yield</th>
            <th>Debt/Equity</th>
            <th>Score</th>
            <th>Watchlist</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.symbol}>
              <td>{index + 1}</td>
              <td>{stock.symbol}</td>
              <td>
                <a href={`/stock/${stock.symbol}`} style={{ textDecoration: "none", color: "#6200ea" }}>
                  {stock.name}
                </a>
                {stock.value_trap_flags && stock.value_trap_flags.length > 0 && (
                  <span title={stock.value_trap_flags.join(", ")} style={{
                    marginLeft: "8px",
                    color: "orange",
                    cursor: "help",
                    fontSize: "14px"
                  }}>
                    ⚠️
                  </span>
                )}
              </td>
              <td>{stock.PE_ratio ?? "N/A"}</td>
              <td>{stock.PB_ratio ?? "N/A"}</td>
              <td>{stock.ROE ?? "N/A"}</td>
              <td>{stock.dividend_yield ?? "N/A"}</td>
              <td>{stock.debt_to_equity ?? "N/A"}</td>
              <td>{stock.score}</td>
              <td>
        {user && (
          <button onClick={() => addToWatchlist(stock.symbol)}
            style={{ cursor: "pointer" }}>
            + Watch
          </button>
        )}
      </td>
            </tr>
          ))}
        </tbody>
      </table>
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