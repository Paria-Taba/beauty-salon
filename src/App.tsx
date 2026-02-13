
import { HashRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Admin from "./pages/Admin"
import Message from './pages/Message'

function App() {
  

  return (
    <div>
      <HashRouter>
		<Routes>
			<Route path='/' element={<Home></Home>}></Route>
			<Route path='/services' element={<Services></Services>}></Route>
			<Route path='/contact' element={<Contact></Contact>}></Route>
			<Route path='/admin' element={<Admin></Admin>}></Route>
			<Route path='/message' element={<Message></Message>}></Route>
		</Routes>
	  </HashRouter>
    </div>
  )
}

export default App
