import "../pages/css/adminAddServiceCategory.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

function AdminAddSevices() {
  const navigate = useNavigate()

  const [behandling, setBehandling] = useState({
    title: "",
    description: "",
    icon: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/behandlingar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...behandling,
          services: []   
        })
      })

      if (!res.ok) throw new Error()

      navigate("/admin/oversikt")

    } catch (error) {
      alert("Kunde inte skapa behandling")
    }
  }

  return (
    <div className="add-service">
      <Header />

      <h1>Lägg till ny behandling</h1>

      <form className="add-form" onSubmit={handleSubmit}>
        <label>Titel</label>
        <input
          type="text"
          placeholder="Ange kategoriens namn..."
          value={behandling.title}
          onChange={(e) =>
            setBehandling({ ...behandling, title: e.target.value })
          }
        />

        <label>Ikon (URL)</label>
        <input
          type="text"
          placeholder="https://..."
          value={behandling.icon}
          onChange={(e) =>
            setBehandling({ ...behandling, icon: e.target.value })
          }
        />

        <label>Beskrivning</label>
        <textarea
          rows={7}
          placeholder="Skriv en kort beskrivning av behandlingen..."
          value={behandling.description}
          onChange={(e) =>
            setBehandling({ ...behandling, description: e.target.value })
          }
        />

        <div className="add-button-div">
     

          <NavLink
            to="/admin/oversikt"
            className="form-btn cancel-btn"
          >
            Avbryt
          </NavLink>
		       <button type="submit" className="form-btn">
            Spara
          </button>
        </div>
      </form>

      <Footer />
    </div>
  )
}

export default AdminAddSevices
