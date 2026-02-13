import "./css/message.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
function Message(){
	return(
		<div className="message-div">
			<Header></Header>
			<div>
				<h2>Skicka oss ett meddelande</h2>
				<p className="send-p">Skicka oss ett meddelande så återkommer vi till dig via e-post så snart som möjligt.</p>
				<form className="send-div">
					  <label htmlFor="email">E-post :</label>
  <input type="email" id="email" placeholder="Ange din e-post" />
   <label htmlFor="message">Meddelande :</label>
  <textarea id="message" placeholder="Skriv ditt meddelande" rows={7}></textarea>
  <button type="submit">Skicka</button>
</form>
			</div>
			<Footer></Footer>
		</div>

	)
}
export default Message