const API = import.meta.env.VITE_API_URL

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token")
  const headers = { ...options.headers }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  const res = await fetch(`${API}${url}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Something went wrong")
  return data
}

export async function loginUser(username, password) {
  return fetchWithAuth("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
}

export async function registerUser(username, password) {
  return fetchWithAuth("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
}

export async function getMe() {
  return fetchWithAuth("/api/me")
}