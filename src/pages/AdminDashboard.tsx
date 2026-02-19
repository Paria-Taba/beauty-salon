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
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
      .catch(err => console.error(err))
  }, [])
const confirmDelete = async () => {
    if (!deleteId) return

    const res = await fetch(`/api/behandlingar/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (res.ok) {
      setBehandlingar(prev =>
        prev.filter(b => b._id !== deleteId)
      )
    }

    setDeleteId(null)
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

                <button
  onClick={() => setDeleteId(item._id)}
  className="delete-btn"
>
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
	   {/* MODAL */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Ta bort behandling?</h3>
            <p>
              Är du säker på att du vill ta bort denna behandling?
            </p>

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

export default AdminDashboard
