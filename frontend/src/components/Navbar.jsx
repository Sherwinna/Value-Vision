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
    <nav className="navbar">
      <Link to="/" className="nav-brand">Value Vision</Link>
      <div className="nav-links">
        <Link to="/learn" className="nav-link">Learn</Link>
        <Link to="/watchlist" className="nav-link">Watchlist</Link>
        <input
          className="nav-search"
          type="text"
          placeholder="Search ticker..."
          value={ticker}
          onChange={e => setTicker(e.target.value)}
          onKeyDown={handleSearch}
        />
        {user ? (
          <>
            <span className="nav-user">{user.username}</span>
            <button onClick={logout} className="nav-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}