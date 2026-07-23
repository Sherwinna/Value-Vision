import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (password !== confirm) { setError("Passwords do not match"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    try {
      await register(username, password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "40px", width: "100%", maxWidth: "380px", boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "600", color: "#111827", marginBottom: "6px", textAlign: "center" }}>Create Account</h2>
        <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center", marginBottom: "24px" }}>Join Value Vision to track your stocks</p>
        {error && <p style={{ color: "#dc2626", fontSize: "13px", background: "#fef2f2", padding: "10px 12px", borderRadius: "6px", marginBottom: "16px" }}>{error}</p>}
        <div style={{ marginBottom: "14px" }}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "14px" }}>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handleSubmit}
          style={{ width: "100%", padding: "10px", background: "#15803d", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
          Register
        </button>
        <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "16px" }}>
          Already have an account? <Link to="/login" style={{ color: "#15803d", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}