import React from 'react'
import {useState} from 'react'
import api from '../services/api.js'
function TeamDashboard() {
    const [teams,setTeams]=React.useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const getTeams=async()=>{
        try{
            const token=localStorage.getItem("token");
            const response=await api.get('/team/my-teams',{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            setTeams(response.data.Teams);

            }
        catch(e){
            error: e.response?.data
        }
        }
    getTeams();
    const submitPPT = async (teamId) => {
    try {
        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();

        formData.append("file", selectedFile);
        formData.append("teamId", teamId);

        const token = localStorage.getItem("token");

        const response = await api.post("/submission", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data);

        } catch (e) {
            console.log(e.response?.data || e.message);
        }
    };
  return (
    <div><h1>Team Dashboard</h1>
    {teams.length==0?<p>No teams yet</p>:
        <ul>
            {teams.map((team)=>(
                <li key={team._id}>
                <h2>{team.teamName}</h2>

                <p>
                    Hackathon: {team.hackathon.title}
                </p>

                <p>
                    Members: {team.members.length}/{team.hackathon.reqmembers}
                </p>
                <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        
                    }}
                />
                <button onClick={() => submitPPT(team._id)}>Submit PPT</button>
            </li>
            ))}
        </ul>
    }


    </div>

  )
}

export default TeamDashboard