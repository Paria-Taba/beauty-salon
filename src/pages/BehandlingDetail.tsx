import { NavLink, useParams } from "react-router-dom"
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
      <h2 className="behandling-title">{behandling.title}</h2>
	  </div>
      <div className="services-detail-grid">
        {behandling.services.map((service: any) => (
  <div key={service._id} className="service-detail-card">
    <h3>{service.name}</h3>
    <p>✦ {service.description}</p>
    <p><span className="span-detail">pris: </span>{service.price} SEK</p>
  </div>
))}
      </div>
	 <div>
		 {behandling.images  && (
  <section className="gallery">
    <h2>Inspirationsbilder</h2>
    <div className="gallery-grid">
      {behandling.images.map((img: string, index: number) => (
        <img key={index} src={img} alt={behandling.title} />
		
      ))}
    </div>
  </section>
)}
	 </div>
	  <div className="book-div">
		<NavLink to="/behandlingar" className="back-button">Tillbaka</NavLink>
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
