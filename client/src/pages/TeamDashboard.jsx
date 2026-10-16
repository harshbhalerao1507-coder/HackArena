import { useState } from 'react'
import api from '../services/api.js'
import Taskbar from '../components/Taskbar.jsx'
function TeamDashboard() {
    const [teams, setTeams] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const getTeams = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get('/team/my-teams', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTeams(response.data.Teams);
        } catch (e) {
            console.error(e.response?.data);
        }
    };
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 100px' }}>
      <h1>Team Dashboard</h1>
    {teams.length === 0 ? (
        <p style={{ color: 'var(--text-muted-on-dark)', fontSize: '20px' }}>No teams joined yet.</p>
    ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {teams.map((team) => (
                <div key={team._id} className="pixel-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h2 style={{ fontSize: '20px', color: 'var(--gold)', margin: 0 }}>{team.teamName}</h2>
                    <p style={{ color: 'var(--text-on-dark)', margin: 0 }}>
                        <strong style={{ color: 'var(--steel)' }}>Hackathon:</strong> {team.hackathon?.title}
                    </p>
                    <p style={{ color: 'var(--text-on-dark)', margin: 0 }}>
                        <strong style={{ color: 'var(--steel)' }}>Members:</strong> {team.members?.length}/{team.hackathon?.reqmembers}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            className="pixel-input"
                            style={{ marginBottom: 0, padding: '8px' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setSelectedFile(file);
                            }}
                        />
                        <button
                            type="button"
                            className="pixel-btn pixel-btn-primary"
                            onClick={() => submitPPT(team._id)}
                        >
                            Submit PPT
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )}

    <Taskbar />
    </div>

  )
}

export default TeamDashboard