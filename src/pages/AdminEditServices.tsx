import "../pages/css/AdminEditServices.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
function AdminEditServices(){
	return(
		<div className="edit-service">
			<Header></Header>
			<h1>Redigera behandlingen</h1>
			<form className="edit-form">
				<h2>Information om kategorin</h2>
				<label htmlFor="title">Titel : </label>
				<input type="text" name="title" id="title"/>
				<label htmlFor="icon">Ikon (URL) :</label>
				<input type="text" name="icon" id="icon" />
				  <label htmlFor="description">Beskrivning :</label>
  <textarea id="description"  rows={7}></textarea>
  <div className="edit-button-div">
  <button type="submit" className="form-btn">Spara ändringar</button>
  
</div>

			</form>
			<div className="service-category">
				<h2>Tjänster i denna kategori </h2>

			</div>
			<Footer></Footer>
		</div>
	)
}
export default AdminEditServices