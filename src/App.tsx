
import { HashRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Admin from "./pages/Admin"
import Message from './pages/Message'
import BehandlingDetail from './pages/BehandlingDetail'
import AdminDahboard from './pages/AdminDashboard'

function App() {
  

  return (
    <div>
      <HashRouter>
		<Routes>
			<Route path='/' element={<Home></Home>}></Route>
			<Route path='/behandlingar' element={<Services></Services>}></Route>
			<Route path='/kontakt' element={<Contact></Contact>}></Route>
			<Route path='/admin' element={<Admin></Admin>}></Route>
			<Route path='/meddelande' element={<Message></Message>}></Route>
			<Route path="/behandlingar/:id" element={<BehandlingDetail />} />
				<Route path="/admin/dashboard" element={<AdminDahboard/>} />
		</Routes>
	  </HashRouter>
    </div>
  )
}

export default App
