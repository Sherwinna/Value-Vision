import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      await login(username, password)
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>
        {error && <p className="form-error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        <p className="form-link">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}