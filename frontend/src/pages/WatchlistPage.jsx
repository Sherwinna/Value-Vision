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
    <div style={{ padding: "40px 20px" }}>
      <h2>Watchlist</h2>
      <p>Please <a href="/login">sign in</a> to view your watchlist.</p>
    </div>
  )

  if (loading) return <p>Loading watchlist...</p>

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>You haven't added any stocks yet. Go to the <a href="/">rankings page</a> and click + Watch to add stocks.</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>P/E</th>
              <th>P/B</th>
              <th>ROE</th>
              <th>Div Yield</th>
              <th>Debt/Equity</th>
              <th>Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(stock => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.name}</td>
                <td>{stock.PE_ratio ?? "N/A"}</td>
                <td>{stock.PB_ratio ?? "N/A"}</td>
                <td>{stock.ROE ?? "N/A"}</td>
                <td>{stock.dividend_yield ?? "N/A"}</td>
                <td>{stock.debt_to_equity ?? "N/A"}</td>
                <td>{stock.score}</td>
                <td>
                  <button onClick={() => removeFromWatchlist(stock.symbol)}
                    style={{ color: "red", cursor: "pointer", border: "none", background: "none" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}