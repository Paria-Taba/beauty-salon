import { useState } from "react"
import "../components/css/header.css"
import logo from "../../public/logo.png"
import { NavLink } from "react-router-dom"
import menuIcon from "../../public/menu.png" 

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="header">
        <div className="header-logo">
          <img src={logo} alt="Logo-beauty-salon" />
        </div>

        <div className={`navbar ${open ? "active" : ""}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/book">Book now</NavLink>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <img src={menuIcon} alt="menu" />
        </div>
      </div>

      <div className="lux-divider">
        <span className="ornament">༺❀༻</span>
      </div>
    </div>
  )
}

export default Header
