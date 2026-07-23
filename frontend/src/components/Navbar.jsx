import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [ticker, setTicker] = useState("")

  function handleSearch(e) {
    if (e.key === "Enter" && ticker.trim()) {
      navigate(`/stock/${ticker.trim().toUpperCase()}`)
      setTicker("")
    }
  }

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <Link to="/" style={{ fontSize: "16px", fontWeight: "700", color: "#15803d", textDecoration: "none" }}>Value Vision</Link>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/learn" style={{ fontSize: "13px", color: "#374151", textDecoration: "none", fontWeight: "500" }}>Learn</Link>
        <Link to="/watchlist" style={{ fontSize: "13px", color: "#374151", textDecoration: "none", fontWeight: "500" }}>Watchlist</Link>
        <input
          type="text"
          placeholder="Search ticker..."
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onKeyDown={handleSearch}
          style={{ fontSize: "13px", border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 12px", outline: "none", width: "160px", color: "#374151" }}
        />
        {user ? (
          <>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{user.username}</span>
            <button onClick={logout} style={{ fontSize: "13px", color: "#15803d", border: "1px solid #86efac", borderRadius: "6px", padding: "5px 12px", background: "transparent", cursor: "pointer", fontWeight: "500" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize: "13px", color: "#374151", textDecoration: "none", fontWeight: "500" }}>Sign In</Link>
            <Link to="/register" style={{ fontSize: "13px", background: "#15803d", color: "#fff", textDecoration: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "500" }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}