
import { HashRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Admin from "./pages/Admin"
import Message from './pages/Message'
import BehandlingDetail from './pages/BehandlingDetail'
import AdminDahboard from './pages/AdminDashboard'
import AdminAddSevices from './pages/AdminAddServices'
import AdminEditServices from './pages/AdminEditServices'
import AdminAddServiceCategory from './pages/AdminAddServiceCategory'
import AdminMeddelandeSvar from './pages/AdminMeddelandeSvar'

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
				<Route path="/admin/oversikt" element={<AdminDahboard/>} />
				<Route path="/admin/lagg-till-behandling" element={<AdminAddSevices/>} />
				<Route path="/admin/redigera-behandling/:id" element={<AdminEditServices/>} />
				<Route path="/admin/meddelande/svar/:id" element={<AdminMeddelandeSvar/>} />
				<Route 
  path="/admin/behandlingar/:id/lagg-till-tjanst" 
  element={<AdminAddServiceCategory/>} 
/>
		</Routes>
		
	  </HashRouter>
    </div>
  )
}

export default App
