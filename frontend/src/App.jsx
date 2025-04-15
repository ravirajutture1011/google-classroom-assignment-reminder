import {Route,Routes} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import StudentPage from './pages/StudentPage'
import Navbar from './components/Navbar'
import ProfilePage from './pages/ProfilePage'

 
function App() {
  
  return (
     <div>
        <Navbar/>
        <Routes>
          <Route path = '/' element = {<HomePage/>}></Route>
          <Route path='/login' element = {<LoginPage/>}></Route>
          <Route path='/signup' element = {<SignupPage/>}></Route>
          <Route path = '/dashboard' element = {<DashboardPage/>}></Route>
          <Route path = '/student' element = {<StudentPage/>}></Route>
          <Route path='/profile' element={<ProfilePage/>}></Route>
        </Routes>
        <Toaster />
 
     </div>
  )
}

export default App
