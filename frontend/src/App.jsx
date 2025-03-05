import {Route,Routes} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
function App() {
  
  return (
     <div>
        <Routes>
          <Route path = '/' element = {<HomePage/>}></Route>
          <Route path='/login' element = {<LoginPage/>}></Route>
          <Route path='/signup' element = {<SignupPage/>}></Route>
          <Route path = '/dashboard' element = {<DashboardPage/>}></Route>
        </Routes>
        <Toaster />
     </div>
  )
}

export default App
