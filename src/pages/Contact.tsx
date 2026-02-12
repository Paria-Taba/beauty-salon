import "../pages/css/contact.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import salonImage from "../../public/5.jpeg"
import salonImage1 from "../../public/7.jpeg"
function Contact(){
	return(
		<div >
			<Header></Header>
			<h1>Kontakt</h1>
			<div className="contact-div contact-reverse">
				<div className="contact-image">
					<img src={salonImage} alt="Bild av skönhetssalongen" />
				</div>
				<div>
					<h2>🕘 Öppettider</h2>
					<p>Måndag: 10:00–18:00</p>
					<p>Tisdag: 10:00–18:00</p>
					<p>Onsdag: 10:00–18:00</p>
					<p>Torsdag: 10:00–18:00</p>
					<p>Fredag: 10:00–18:00</p>
					<p>Lördag: 11:00–15:00</p>
					<p>Söndag: Stängt</p>
				</div>
			</div>
			<div className="contact-div">
				
				<div>
					<h2>📍 Kontaktinformation</h2>
					<p>Telefon: 📞 073-977 57 55</p>
					<p>Adress: 📍 Lergöksgatan 1M, Frölunda, Sverige</p>
					<p>Instagram: 📷 	<a 
		href="https://instagram.com/mary7.salong" 
		target="_blank" 
		rel="noopener noreferrer"
		className="insta-link"
		>
		@mary7.salong
		</a></p>
		<p className="text-contact">You can find us in Frölunda, just a short walk from local transport.</p>
				
				</div>
				<div className="contact1-image">
					<img src={salonImage1} alt="Bild av skönhetssalongen" />
				</div>
			</div>
			<Footer></Footer>
		</div>

	)
}
export default Contact