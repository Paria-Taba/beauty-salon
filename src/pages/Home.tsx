import Header from "../components/Header"
import "../pages/css/home.css"
import Footer from "../components/Footer.tsx"
import { NavLink } from "react-router-dom"
function Home(){
	return(
		<div>
		<Header></Header>
		<div className="title-div">
		<h1>Mary 7</h1>
		<h2 className="title-home">Skönhet & Välbefinnande</h2>
		</div>

		<div className="home-main-div">
			<div className="div-image">
				<img src="./1.jpeg" alt="Bild av skönhetssalongen" />
				<img src="./2.jpeg" alt="Bild av skönhetssalongen" />
				<img src="./3.jpeg" alt="Bild av skönhetssalongen" />
			</div>
			<div className="div-main">
				<p>Med många års erfarenhet skapar vi skönhet med passion och precision</p>
				<a 
  href="https://www.bokadirekt.se/places/mary7-47193"
  target="_blank"
  rel="noopener noreferrer"
  className="nav-button"
>
  Boka tid
</a>
			</div>

		</div>
		<div className="question-div">
			<p className="p-1">Har du en fråga?</p>
			<NavLink to={"/meddelande"} className="p-2">Skicka oss ett meddelande</NavLink>
		</div>
		<Footer></Footer>
		
		</div>
		
	)
}
export default Home