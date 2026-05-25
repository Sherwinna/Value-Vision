import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function StockTable() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/stocks")
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
      <table border="1">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Symbol</th>
            <th>Name</th>
            <th>P/E</th>
            <th>P/B</th>
            <th>ROE</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.symbol}>
              <td>{index + 1}</td>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>{stock.PE_ratio}</td>
              <td>{stock.PB_ratio}</td>
              <td>{stock.ROE}</td>
              <td>{stock.score}</td>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App