import { NavLink } from "react-router-dom"
import Login from "./pages/Login.jsx"
import { Route,Routes } from "react-router-dom"
import Register from "./pages/Register.jsx"
import StudentDashboard from "./pages/StudentDashboard.jsx"
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx"
import TeamDashboard from "./pages/TeamDashboard.jsx"
function App() {
  return(
    <>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/studentDashboard" element={<StudentDashboard/>}/>
      <Route path="/organiserDashboard" element={<OrganiserDashboard/>}/>
      <Route path="/teamDashboard" element={<TeamDashboard/>}/>
    </Routes>
    

    </>
  )
}

export default App
