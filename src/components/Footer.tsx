import "../components/css/footer.css"
import "../components/css/header.css"
import logo from "../../public/logo.png"
import { NavLink } from "react-router-dom"
function Footer(){
	return(
		<div className="footer">
		<div className="lux-divider">
		<span className="ornament">༺❀༻</span>
		</div>
		<div className="footer-div">
		<div>
		<p>📍 Lergöksgatan 1M, Frölunda</p>
		<p>🕘 Mån–Fre 10–18</p>
		<p>📷    
		<a 
		href="https://instagram.com/mary7.salong" 
		target="_blank" 
		rel="noopener noreferrer"
		className="insta-link"
		>
		@mary7.salong
		</a>
		</p>
		</div>
		<div className="login-footer">
				<NavLink to={"/admin"}>Inloggning för ägare</NavLink>
			<div className="header-logo">
          <img src={logo} alt="Logo-beauty-salon" />
        </div>
	
		</div>
		
		
		
		
		</div>
		
		</div>
	)
}
export default Footer