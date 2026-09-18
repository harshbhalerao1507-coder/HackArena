import React, { useState } from 'react'
import CreateHackathon from '../components/CreateHackathon';

function OrganiserDashboard() {
    const [showCreateHackathon, setShowCreateHackathon] = useState(false);
    

  return (
    <div>
       <h1>OrganiserDashboard</h1>
        <button onClick={(e)=>{
            setShowCreateHackathon(true)
        }}>Create Hackathon</button>
        {showCreateHackathon && <CreateHackathon onClose={()=>{setShowCreateHackathon(false)}}/>}

    </div>

    
  )
}

export default OrganiserDashboard