import { useEffect, useState } from "react"
import "../pages/css/Services.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { NavLink } from "react-router-dom"
import { socket } from "../socket"

interface Behandling {
  _id: string
  title: string
  description: string
  icon: string
}

function Services() {

  const [behandlingar, setBehandlingar] = useState<Behandling[]>([])

  //  fetch 
  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
  }, [])

  // realtime listener
  useEffect(() => {

    socket.on("new_behandling", (data: Behandling) => {
      setBehandlingar(prev => [...prev, data])
    })

    socket.on("delete_behandling", (id: string) => {
      setBehandlingar(prev =>
        prev.filter(b => b._id !== id)
      )
    })

    socket.on("update_behandling", (updated: Behandling) => {
      setBehandlingar(prev =>
        prev.map(b =>
          b._id === updated._id ? updated : b
        )
      )
    })

    return () => {
      socket.off("new_behandling")
      socket.off("delete_behandling")
      socket.off("update_behandling")
    }

  }, [])

  return (
    <div>
      <Header />
      <h1>Behandlingar</h1>

      <div className="services-grid">
        {behandlingar.map(item => (
          <div key={item._id} className="service-card">
            <div className="card-row">

              <div>
                <img src={item.icon} alt={item.title} />
              </div>

              <div className="card-text">
                <p className="card-title">{item.title}</p>
                <p className="card-des">✦ {item.description}</p>
              </div>

            </div>

            <NavLink
              to={`/behandlingar/${item._id}`}
              className="div-button"
            >
              Mer
            </NavLink>

          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default Services