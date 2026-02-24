import "../pages/css/adminDashboard.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { socket } from "../socket"

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

interface Message {
  _id: string
  email: string
  text: string
  createdAt: string
}

function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [behandlingar, setBehandlingar] = useState<Behandling[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] =
    useState<"tjanster" | "meddelanden">("tjanster")

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteType, setDeleteType] =
    useState<"behandling" | "message" | null>(null)

  const [loadingMessages, setLoadingMessages] = useState(false)
  const [errorMessages, setErrorMessages] = useState("")

  //  Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/admin")
    }
  }, [token, navigate])

  // Fetch behandlingar
  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
      .catch(err => console.error(err))
  }, [])

  //  SOCKET LISTENERS
  useEffect(() => {

    // BEHANDLING
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

    //MESSAGE 
     socket.on("new_message", (msg: Message) => {
    if (activeTab === "meddelanden") {
      setMessages(prev => [msg, ...prev])
    }
  })

  socket.on("delete_message", (id: string) => {
    if (activeTab === "meddelanden") {
      setMessages(prev =>
        prev.filter(m => m._id !== id)
      )
    }
  })

  return () => {
    socket.off("new_behandling")
    socket.off("delete_behandling")
    socket.off("update_behandling")
    socket.off("new_message")
    socket.off("delete_message")
  }

}, [activeTab])

  // Fetch messages (only when tab active)
  useEffect(() => {
    if (activeTab === "meddelanden") {
      setLoadingMessages(true)
      setErrorMessages("")

      fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 401) {
            navigate("/admin")
            return
          }
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then(data => {
          if (data) setMessages(data)
          setLoadingMessages(false)
        })
        .catch(() => {
          setErrorMessages("Något gick fel vid hämtning.")
          setLoadingMessages(false)
        })
    }
  }, [activeTab, token, navigate])

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteId || !deleteType) return

    try {
      if (deleteType === "behandling") {
        await fetch(`/api/behandlingar/${deleteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

      if (deleteType === "message") {
        await fetch(`/api/messages/${deleteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }

    } catch {
      alert("Något gick fel.")
    }

    setDeleteId(null)
    setDeleteType(null)
  }

  return (
    <div>
      <Header />

      <div className="dashboard-div">

        <div className="admin-title">
          <h1>Administrationspanel</h1>
        </div>

        {/* TAB BUTTONS */}
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

          {/* Tjänster */}
          {activeTab === "tjanster" && (
            <>
              <h2>Behandlingar</h2>

              {behandlingar.length === 0 ? (
                <p className="no-message">Inga behandlingar hittades.</p>
              ) : (
                behandlingar.map(item => (
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
                        className="delete-btn"
                        onClick={() => {
                          setDeleteId(item._id)
                          setDeleteType("behandling")
                        }}
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

          {/* Meddelanden */}
          {activeTab === "meddelanden" && (
            <>
              <h2>Meddelanden</h2>

              {loadingMessages && <p>Laddar...</p>}
              {errorMessages && <p>{errorMessages}</p>}

              {!loadingMessages && !errorMessages && (
                messages.length === 0 ? (
                  <p className="no-message">Det finns inga meddelanden.</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg._id} className="message-card">

                      <p><strong>E-post:</strong> {msg.email}</p>
                      <p><strong>Meddelande:</strong> {msg.text}</p>

                      <p className="date-text">
                        {new Date(msg.createdAt).toLocaleDateString("sv-SE")}
                        {"  |  "}
                        {new Date(msg.createdAt).toLocaleTimeString("sv-SE")}
                      </p>

                      <div className="message-btn">
                        <button
                          onClick={() =>
                            navigate(`/admin/meddelande/svar/${msg._id}`)
                          }
                        >
                          Svara
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(msg._id)
                            setDeleteType("message")
                          }}
                        >
                          Ta bort
                        </button>
                      </div>

                    </div>
                  ))
                )
              )}
            </>
          )}

        </div>
      </div>

      {/* MODAL */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3>
              {deleteType === "behandling"
                ? "Ta bort behandling?"
                : "Ta bort meddelande?"}
            </h3>

            <p>
              {deleteType === "behandling"
                ? "Är du säker på att du vill ta bort denna behandling?"
                : "Är du säker på att du vill ta bort detta meddelande?"}
            </p>

            <div className="modal-buttons">
              <button
                onClick={confirmDelete}
                className="danger-btn"
              >
                Ja, ta bort
              </button>

              <button
                onClick={() => {
                  setDeleteId(null)
                  setDeleteType(null)
                }}
              >
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