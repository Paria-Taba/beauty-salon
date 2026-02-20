import Footer from "../components/Footer"
import "../pages/css/adminMeddelandeSvar.css"
import Header from "../components/Header"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface Message {
  _id: string
  email: string
  text: string
  reply?: string
  answered?: boolean
  createdAt: string
}

function AdminMeddelandeSvar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [message, setMessage] = useState<Message | null>(null)
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Hämta meddelandet
  useEffect(() => {
    if (!id) return

    const fetchMessage = async () => {
      try {
        const res = await fetch(`/api/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error()

        const data = await res.json()
        setMessage(data)
      } catch {
        setError("Kunde inte hämta meddelandet.")
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [id, token])

  // Skicka svar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reply.trim()) {
      setError("Skriv ett svar först.")
      return
    }

    setSending(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply })
      })

      if (!res.ok) throw new Error()

      setSuccess("Meddelandet har skickats. ✅")
      setReply("") 
    } catch {
      setError("E-post kunde inte skickas.")
    } finally {
      setSending(false)
    }
  }

  if (loading) return <p>Laddar...</p>
  if (error && !message) return <p>{error}</p>
  if (!message) return <p>Meddelandet hittades inte.</p>

  return (
    <div>
      <Header />

      <div className="answer-container">
        <h2>Svara på meddelande</h2>

        <div className="original-message">
          <p><strong>E-post:</strong> {message.email}</p>
          <p><strong>Meddelande:</strong> {message.text}</p>
          <p className="date-text">
            {new Date(message.createdAt).toLocaleDateString("sv-SE")}
            {" | "}
            {new Date(message.createdAt).toLocaleTimeString("sv-SE")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reply-form">

          <label>Ditt svar:</label>

          <textarea
            rows={8}
            placeholder="Skriv ditt svar här..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <div className="reply-buttons">
            <button type="submit" disabled={sending}>
              {sending ? "Skickar..." : "Skicka svar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/oversikt")}
            >
              Avbryt
            </button>
          </div>

        </form>

      </div>

      <Footer />
    </div>
  )
}

export default AdminMeddelandeSvar