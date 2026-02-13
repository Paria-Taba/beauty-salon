import { useEffect, useState } from "react"
import "../pages/css/Services.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { NavLink } from "react-router-dom"

function Services() {
  const [behandlingar, setBehandlingar] = useState([])

  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
  }, [])

  return (
    <div>
      <Header />
      <h1>Behandlingar</h1>

      <div className="services-grid">
        {behandlingar.map((item: any) => (
          <div key={item._id} className="service-card">
            <img src={item.icon} alt={item.title} />
            <h2>{item.title}</h2>
            <p>{item.description}</p>

            <NavLink to={`/behandlingar/${item._id}`} className="more-btn">
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
