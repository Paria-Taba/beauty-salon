import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

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

      <h1>{behandling.title}</h1>
      <p>{behandling.description}</p>

      <div>
        {behandling.services.map((service: any, index: number) => (
          <div key={index}>
            <h3>{service.name}</h3>
            <p>{service.duration} min</p>
            <p>{service.price} SEK</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default BehandlingDetail
