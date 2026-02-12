import { useState, useRef, useEffect } from "react"
import "../components/css/header.css"
import logo from "../../public/logo.png"
import { NavLink } from "react-router-dom"
import menuIcon from "../../public/menu.png"

function Header() {
  const [open, setOpen] = useState(false)
const navRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      navRef.current &&
      event.target instanceof Node &&
      !navRef.current.contains(event.target)
    ) {
      setOpen(false)
    }
  }

  if (open) {
    document.addEventListener("mousedown", handleClickOutside)
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [open])

  return (
    <div>
      <div className="header">
        <div className="header-logo">
          <img src={logo} alt="Logo-beauty-salon" />
        </div>

        <div
          ref={navRef}
          className={`navbar ${open ? "active" : ""}`}
        >
          <NavLink to="/">Hem</NavLink>
          <NavLink to="/services">Behandlingar</NavLink>
          <NavLink to="/contact">Kontakt</NavLink>
          <NavLink to="/book">Boka tid</NavLink>
        </div>

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
