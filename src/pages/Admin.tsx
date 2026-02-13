import "../pages/css/admin.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
function Admin(){
	return(
		<div className="admin-div">
			<Header></Header>
			<h2>Inloggning för administratör</h2>
			<div className="login-div">
				<label htmlFor="email">E-post :</label>
				<input id="email" type="text" placeholder="Ange din e-post"/>
				<label htmlFor="password">Lösenord :</label>
				<input id="password" type="password" placeholder="Ange ditt lösenord" />
				<button>Logga in</button>
			</div>
			<Footer></Footer>
		</div>
	)
}
export default Admin