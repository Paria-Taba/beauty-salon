import "../pages/css/adminDashboard.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect, useState } from "react"

function AdminDashboard() {
  const [behandlingar, setBehandlingar] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"tjanster" | "meddelanden">("tjanster")

  useEffect(() => {
    fetch("/api/behandlingar")
      .then(res => res.json())
      .then(data => setBehandlingar(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <Header />

      <div className="dashboard-div">
        <div className="admin-title">
          <h1>Admin dashboard</h1>
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

        {/* CONTENT */}
        <div className="services">

          {activeTab === "tjanster" && (
            <>
              <h2>Tjänster</h2>

              {behandlingar.length === 0 ? (
                <p>Inga tjänster hittades.</p>
              ) : (
                behandlingar.map((item) => (
                  <div key={item._id} className="services-title">
                    <div className="services-title-1">
                      <img src={item.icon} alt={item.title} />
                      <p>{item.title}</p>
                    </div>

                    <div className="dashboard-button">
                      <button>Redigera</button>
                      <button>Ta bort</button>
                    </div>
				
                  </div>
                ))
              )}
			  <div className="add-services">
						<button>Lägg till tjänster</button>
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
