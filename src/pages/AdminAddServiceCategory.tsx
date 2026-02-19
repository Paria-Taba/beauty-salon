import "../pages/css/adminAddServiceCategory.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { NavLink, useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface Behandling {
  _id: string
  title: string
}

function AdminAddServiceCategory() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [behandling, setBehandling] = useState<Behandling | null>(null)
  const [loading, setLoading] = useState(true)

  const [service, setService] = useState({
    name: "",
    price: "",
    tid: "",
    description: ""
  })

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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const token = localStorage.getItem("token")

  try {
    const res = await fetch(`/api/behandlingar/${id}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: service.name,
        description: service.description,
        price: Number(service.price),
        tid: Number(service.tid)
      })
    })

    if (!res.ok) throw new Error()

    navigate(`/admin/redigera-behandling/${id}`)

  } catch (error) {
    alert("Kunde inte lägga till tjänst")
  }
}


  if (loading) return <p>Laddar...</p>
  if (!behandling) return <p>Kunde inte hitta kategorin</p>

  return (
    <div className="add-service">
      <Header />

     <h1>Lägg till ny tjänst i {behandling.title}</h1>

      <form className="add-form" onSubmit={handleSubmit}>
   <label>Namn på tjänst</label>
        <input
          type="text"
          placeholder="Ange tjänstens namn..."
          value={service.name}
          onChange={(e) =>
            setService({ ...service, name: e.target.value })
          }
        />

        <label>Pris (kr)</label>
        <input
          type="number"
          placeholder="Ange pris..."
          value={service.price}
          onChange={(e) =>
            setService({ ...service, price: e.target.value })
          }
        />

        <label>Behandlingstid (min)</label>
        <input
          type="number"
          placeholder="Ange behandlingstid..."
          value={service.tid}
          onChange={(e) =>
            setService({ ...service, tid: e.target.value })
          }
        />

        <label>Beskrivning</label>
        <textarea
          rows={6}
          placeholder="Skriv en kort beskrivning..."
          value={service.description}
          onChange={(e) =>
            setService({ ...service, description: e.target.value })
          }
        />

        <div className="add-button-div">
        

          <NavLink
            to={`/admin/oversikt`}
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

export default AdminAddServiceCategory
