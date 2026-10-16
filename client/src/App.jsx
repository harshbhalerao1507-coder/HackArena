import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import StudentDashboard from "./pages/StudentDashboard.jsx"
import OrganiserDashboard from "./pages/OrganiserDashboard.jsx"
import TeamDashboard from "./pages/TeamDashboard.jsx"
import Invitations from "./pages/Invitations.jsx"
import Home from "./pages/Home.jsx"
function App() {
  return(
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/studentDashboard" element={<StudentDashboard/>}/>
      <Route path="/studentDashboard/invitations" element={<Invitations/>}/>
      <Route path="/organiserDashboard" element={<OrganiserDashboard/>}/>
      <Route path="/teamDashboard" element={<TeamDashboard/>}/>
    </Routes>
    

    </>
  )
}

export default App
