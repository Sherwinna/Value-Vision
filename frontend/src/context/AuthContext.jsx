/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser, getMe } from "../api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (!token) return
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token")
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  async function login(username, password) {
    const data = await loginUser(username, password)
    localStorage.setItem("token", data.token)
    setToken(data.token)
    setUser(data.user)
  }

  async function register(username, password) {
    const data = await registerUser(username, password)
    localStorage.setItem("token", data.token)
    setToken(data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}