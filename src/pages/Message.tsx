import "./css/message.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"

function Message() {

  const [email, setEmail] = useState("")
  const [text, setText] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSuccess("")
    setError("")

    if (!email || !text) {
      setError("E-post och meddelande är obligatoriska.")
      return
    }

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          text
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Något gick fel")
      }

      setSuccess("Meddelandet har skickats. ✅")
      setEmail("")
      setText("")

    } catch (err: any) {
      setError(err.message || "Kunde inte skicka meddelandet")
    }
  }

  return (
    <div className="message-div">
      <Header />

      <div>
        <h2>Skicka oss ett meddelande</h2>
        <p className="send-p">
          Skicka oss ett meddelande så återkommer vi till dig via e-post så snart som möjligt.
        </p>

        <form className="send-div" onSubmit={handleSubmit}>

          <label htmlFor="email">E-post :</label>
          <input
            type="email"
            id="email"
            placeholder="Ange din e-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="message">Meddelande :</label>
          <textarea
            id="message"
            placeholder="Skriv ditt meddelande"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          <button type="submit">Skicka</button>

          {success && <p className="success-text">{success}</p>}
          {error && <p className="error-text">{error}</p>}

        </form>
      </div>

      <Footer />
    </div>
  )
}

export default Message