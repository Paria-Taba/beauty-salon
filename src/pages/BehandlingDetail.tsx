import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import "../pages/css/behandlingdetail.css"

function BehandlingDetail() {
  const { id } = useParams()
  const [behandling, setBehandling] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/behandlingar/${id}`)
      .then(res => res.json())
      .then(data => setBehandling(data))
  }, [id])

  if (!behandling) return <p>Laddar...</p>

  return (
    <div>
      <Header />
	  <div className="service-detail-title">
		 <img src={behandling.icon}  />
      <h1>{behandling.title}</h1>

	  </div>


      <div>
        {behandling.services.map((service: any) => (
  <div key={service._id}>
    <h3>{service.name}</h3>
    <p>{service.tid} min</p>
    <p>{service.description}</p>
    <p>{service.price} SEK</p>
  </div>
))}
      </div>

      <Footer />
    </div>
  )
}

export default BehandlingDetail
