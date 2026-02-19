import "../pages/css/adminDashboard.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

interface Service {
  _id: string
  name: string
  price: number
  description: string
  tid: number
}

interface Behandling {
  _id: string
  title: string
  description: string
  icon: string
  services: Service[]
}

function AdminDashboard() {
  const [behandlingar, setBehandlingar] = useState<Behandling[]>([])
  const [activeTab, setActiveTab] = useState<"tjanster" | "meddelanden">("tjanster")

  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
      .catch(err => console.error(err))
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Är du säker att du vill ta bort denna behandling?")) return

    try {
      await fetch(`/api/behandlingar/${id}`, { method: "DELETE" })

      setBehandlingar(prev => prev.filter(item => item._id !== id))
    } catch (error) {
      console.error(error)
      alert("Kunde inte ta bort ❌")
    }
  }

  return (
    <div>
      <Header />

      <div className="dashboard-div">
        <div className="admin-title">
          <h1>Administrationspanel</h1>
        </div>

        <div className="button-div">
          <button
            className={activeTab === "tjanster" ? "active" : ""}
            onClick={() => setActiveTab("tjanster")}
          >
            Tjänster
          </button>

          <button
            className={activeTab === "meddelanden" ? "active" : ""}
            onClick={() => setActiveTab("meddelanden")}
          >
            Meddelanden
          </button>
        </div>

        <div className="services">
          {activeTab === "tjanster" && (
            <>
              <h2>Behandlingar</h2>

              {behandlingar.length === 0 ? (
                <p>Inga behandlingar hittades.</p>
              ) : (
                behandlingar.map((item) => (
                  <div key={item._id} className="services-title">
                    <div className="services-title-1">
                      <img src={item.icon} alt={item.title} />
                      <p>{item.title}</p>
                    </div>

                    <div className="dashboard-button">
                      <NavLink to={`/admin/redigera-behandling/${item._id}`}>
                        Redigera
                      </NavLink>

                      <button onClick={() => handleDelete(item._id)}>
                        Ta bort
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="add-services">
                <NavLink to="/admin/lagg-till-behandling">
                  Lägg till behandling ➕
                </NavLink>
              </div>
            </>
          )}

          {activeTab === "meddelanden" && (
            <>
              <h2>Meddelanden</h2>
              <p>Här visas inkommande meddelanden...</p>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
