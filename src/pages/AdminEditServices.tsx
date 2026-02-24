import "../pages/css/AdminEditServices.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { socket } from "../socket"

interface Service {
  _id: string
  name: string
  price: string
  description: string
}

interface Behandling {
  _id: string
  title: string
  description: string
  icon: string
  services: Service[]
}

function AdminEditServices() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [behandling, setBehandling] = useState<Behandling | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  //  Fetch initial data
  useEffect(() => {
    fetch(`/api/behandlingar/${id}`)
      .then(res => res.json())
      .then(data => {
        setBehandling(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  //  REALTIME LISTENER
  useEffect(() => {

    socket.on("update_behandling", (updated: Behandling) => {
      if (updated._id === id) {
        setBehandling(updated)
      }
    })

    socket.on("delete_behandling", (deletedId: string) => {
      if (deletedId === id) {
        navigate("/admin/oversikt")
      }
    })

    return () => {
      socket.off("update_behandling")
      socket.off("delete_behandling")
    }

  }, [id, navigate])

  //  Update category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!behandling) return

    try {
      const res = await fetch(`/api/behandlingar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: behandling.title,
          description: behandling.description,
          icon: behandling.icon
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Fel vid uppdatering")
      }

      const updated = await res.json()
      setBehandling(updated)

      navigate("/admin/oversikt")

    } catch (error: any) {
      alert(error.message || "Kunde inte spara ❌")
    }
  }

  //  Delete service
  const confirmDelete = async () => {
    if (!deleteId || !behandling) return

    const token = localStorage.getItem("token")

    try {
      const res = await fetch(
        `/api/behandlingar/${behandling._id}/services/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )

      if (!res.ok) throw new Error()


      setDeleteId(null)

    } catch {
      alert("Kunde inte ta bort tjänst ❌")
    }
  }

  if (loading) return <p>Laddar...</p>
  if (!behandling) return <p>Ingen behandling hittades</p>

  return (
    <div className="edit-service">
      <Header />

      <h1>Redigera behandling</h1>

      <form className="edit-form" onSubmit={handleSubmit}>
        <h2>Information om kategorin</h2>

        <label>Titel</label>
        <input
          type="text"
          value={behandling.title}
          onChange={(e) =>
            setBehandling({ ...behandling, title: e.target.value })
          }
        />

        <label>Ikon (URL)</label>
        <div className="service-icon-div">
          <input
            type="text"
            value={behandling.icon}
            onChange={(e) =>
              setBehandling({ ...behandling, icon: e.target.value })
            }
          />
          {behandling.icon && (
            <img src={behandling.icon} alt="ikon preview" />
          )}
        </div>

        <label>Beskrivning</label>
        <textarea
          rows={6}
          value={behandling.description}
          onChange={(e) =>
            setBehandling({ ...behandling, description: e.target.value })
          }
        />

        <button type="submit">Spara ändringar</button>
      </form>

      <div className="service-category">
        <h2>Tjänster i {behandling.title}</h2>

        <div className="edit-services-detail">
          {behandling.services.length === 0 ? (
            <p>Inga tjänster ännu</p>
          ) : (
            behandling.services.map(service => (
              <div key={service._id} className="service-row">
                <div>
                  <p><span className="title-edit">Namn:</span> {service.name}</p>
                  <p><span className="title-edit">Pris :</span> {service.price} kr</p>
                  <p><span className="title-edit">Beskrivning :</span> {service.description} min</p>
                </div>

                <div className="delete-button">
                  <button onClick={() => setDeleteId(service._id)}>
                    Ta bort
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="add-service-category">
          <NavLink to={"/admin/oversikt"}>Tillbaka</NavLink>
          <NavLink to={`/admin/behandlingar/${behandling._id}/lagg-till-tjanst`}>
            Lägg till ny tjänst ➕
          </NavLink>
        </div>
      </div>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Ta bort tjänst?</h3>
            <p>Är du säker på att du vill ta bort denna tjänst?</p>

            <div className="modal-buttons">
              <button
                onClick={confirmDelete}
                className="danger-btn"
              >
                Ja, ta bort
              </button>

              <button onClick={() => setDeleteId(null)}>
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AdminEditServices