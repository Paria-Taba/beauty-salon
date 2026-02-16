import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../pages/css/admin.css"
import Header from "../components/Header"
import Footer from "../components/Footer"

function Admin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Fyll i både e-post och lösenord")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Inloggning misslyckades")
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)

      navigate("/admin/dashboard")

    } catch (err) {
      setError("Serverfel. Försök igen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-div">
      <Header />

      <h2>Inloggning för administratör</h2>

      <form className="login-div" onSubmit={handleLogin}>
        <label>E-post</label>
        <input
          type="email"
          placeholder="Ange din e-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Lösenord</label>
        <input
          type="password"
          placeholder="Ange ditt lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </form>

      <Footer />
    </div>
  )
}

export default Admin
