import "../pages/css/admin.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
function Admin(){
	return(
		<div className="admin-div">
			<Header></Header>
			<h2>Inloggning för administratör</h2>
			<div className="login-div">
				<input type="text" placeholder="Ange din e-post"/>
				<input type="password" placeholder="Ange ditt lösenord" />
				<button>Logga in</button>
			</div>
			<Footer></Footer>
		</div>
	)
}
export default Admin