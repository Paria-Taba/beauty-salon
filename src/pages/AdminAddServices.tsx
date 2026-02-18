import "../pages/css/adminAddServices.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { NavLink } from "react-router-dom"
function AdminAddSevices(){
	return(
		<div className="add-service">
			<Header></Header>
			<h1>Lägg till ny behandling</h1>
			<form className="add-form">
				<label htmlFor="title">Behandlingskategori : </label>
				<input type="text" name="title" id="title" placeholder="Skriv behandlingens kategori..."/>
				<label htmlFor="icon">Ikon (URL) :</label>
				<input type="text" name="icon" id="icon" placeholder="https://..."/>
				  <label htmlFor="description">Beskrivning :</label>
  <textarea id="description" placeholder="Skriv en kort beskrivning av behandlingen..." rows={7}></textarea>
  <div className="add-button-div">
  <button type="submit" className="form-btn">Spara</button>
  <NavLink to="/admin/oversikt" className="form-btn cancel-btn">
    Avbryt
  </NavLink>
</div>

			</form>
			<Footer></Footer>
		</div>
	)
}
export default AdminAddSevices