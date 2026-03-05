import { NavLink, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../pages/css/behandlingdetail.css"
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
  images?: string[]
}

function BehandlingDetail() {

  const { id } = useParams()
  const [behandling, setBehandling] = useState<Behandling | null>(null)

  
  useEffect(() => {
    fetch(`/api/behandlingar/${id}`)
      .then(res => res.json())
      .then(data => setBehandling(data))
  }, [id])

  //  realtime
  useEffect(() => {

    socket.on("update_behandling", (updated: Behandling) => {
      if (updated._id === id) {
        setBehandling(updated)
      }
    })

    socket.on("delete_behandling", (deletedId: string) => {
      if (deletedId === id) {
        setBehandling(null)
      }
    })

    return () => {
      socket.off("update_behandling")
      socket.off("delete_behandling")
    }

  }, [id])

  if (!behandling) return <p>Laddar...</p>

  return (
    <div>
      <Header />

      <div className="service-detail-title">
        <img src={behandling.icon} alt={behandling.title} />
        <h2 className="behandling-title">{behandling.title}</h2>
      </div>

      <div className="services-detail-grid">
        {behandling.services.map(service => (
          <div key={service._id} className="service-detail-card">
            <h3>{service.name}</h3>
            <p>✦ {service.description}</p>
            <p>
              <span className="span-detail">pris: </span>
              {service.price} SEK
            </p>
          </div>
        ))}
      </div>

     {behandling.images && behandling.images.length > 0 && (
  <section className="gallery">
    <h2>✨ Inspirationsbilder ✨</h2>
    <div className="gallery-grid">
      {behandling.images.map((img, index) => (
        <img key={index} src={img} alt={behandling.title} />
      ))}
    </div>
  </section>
)}

      <div className="book-div">
        <NavLink to="/behandlingar" className="back-button">
          Tillbaka
        </NavLink>

        <a
          href="https://www.bokadirekt.se/places/mary7-47193"
          target="_blank"
          rel="noopener noreferrer"
          className="book-button"
        >
          Boka din behandling
        </a>
      </div>

      <Footer />
    </div>
  )
}

export default BehandlingDetail