import { useState, useEffect } from "react";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedHackathon, setSelectedHackathon] = useState(null);

    // Registration Modal State
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [registrationHackathon, setRegistrationHackathon] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [teamMembers, setTeamMembers] = useState([{ name: "", email: "" }]);

    const [invitations,setInvitations]=useState([]);
    const getInvitations=async()=>{
        try{
            const token=localStorage.getItem("token");
            const response=await api.get("/invite",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log("INVITATIONS RESPONSE:", response.data);

            setInvitations(response.data.Invitations || []);
        }
        catch(e){
            console.log(e.response?.data)
        }
    }
    useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getInvitations()
    },[])
    const getErrorMessage = (e) => e.response?.data?.message || e.response?.data?.error || "Something went wrong. Please try again.";
    const formatDate = (date) => new Date(date).toLocaleDateString();
    const registrationStatus = (hackathon) => {
        const now = new Date();
        if (now < new Date(hackathon.regStart)) return "Opens soon";
        if (now > new Date(hackathon.regEnd)) return "Closed";
        return "Open";
    };

    useEffect(() => {
        const getHackathons = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get("/hackathons", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setHackathons(response.data.Hackathons);
            } catch (e) {
                setError(getErrorMessage(e));
            } finally {
                setLoading(false);
            }
        };

        getHackathons();
    }, []);

    
    const openRegistrationModal = (hackathon) => {
        setRegistrationHackathon(hackathon);
        setTeamName("");
        setTeamMembers([{ name: "", email: "" }]);
        setShowRegistrationModal(true);
    };
    const handleRegistration = async () => {

    try {

        const token = localStorage.getItem("token");

        const data = {
            teamName: teamName,
            hackathonid: registrationHackathon._id,
            };
        console.log(data)
        const response = await api.post("/team", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        for (const member of teamMembers) {
            const data = {
                name: member.name,
                email: member.email
            };

            await api.post(
                `/invite/${response.data.team._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }
        

        setShowRegistrationModal(false);

    } catch (e) {

        console.log(e.response?.data);

    }

};
    const addMember = () => {
        setTeamMembers([...teamMembers, { name: "", email: "" }]);
    };

    const updateMember = (index, field, value) => {
        const newMembers = [...teamMembers];
        newMembers[index][field] = value;
        setTeamMembers(newMembers);
    };

    const acceptInvitation = async (inviteToken) => {
    try {
        const authToken = localStorage.getItem("token");

        await api.post(`/invite/${inviteToken}/accept`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        getInvitations();

    } catch (e) {
        console.error(e.response?.data);
    }
};

const rejectInvitation = async (inviteToken) => {
    try {
        const authToken = localStorage.getItem("token");

        await api.post(`/invite/${inviteToken}/reject`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        getInvitations();

    } catch (e) {
        console.error(e.response?.data);
    }
};

    return (
        <>
            <div className="student-dashboard">
                <h1>Student Dashboard</h1>
                <p className="dashboard-intro">Explore upcoming hackathons and register while registration is open.</p>
                {error && <p className="dashboard-error" role="alert">{error}</p>}
                <div className="invitations-section">
    <h2>Invitations</h2>

    {invitations.length === 0 ? (
        <p>No invitations at the moment.</p>
    ) : (
        <ul>
            {invitations.map((invite) => (
                <li key={invite._id}>

                    <p>
                        <strong>Team:</strong>{" "}
                        {invite.team.teamName}
                    </p>

                    <p>
                        <strong>Hackathon:</strong>{" "}
                        {invite.team.hackathon.title}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {invite.status}
                    </p>

                    <button
                        onClick={() => acceptInvitation(invite.token)}
                    >
                        Accept
                    </button>

                    <button
                        onClick={() => rejectInvitation(invite.token)}
                    >
                        Reject
                    </button>

                </li>
            ))}
        </ul>
    )}
</div>
                

                {loading ? (
                    <p>Loading...</p>
                ) : hackathons.length === 0 ? (
                    <p>No hackathons are available right now.</p>
                ) : (
                    <div className="hackathon-grid">
                    {hackathons.map((hackathon) => {
                        const status = registrationStatus(hackathon);
                        const canRegister = status === "Open" && !hackathon.isRegistered;
                        return (
                        <article className="hackathon-card" key={hackathon._id}>
                            <h2>{hackathon.title}</h2>
                            <p>{hackathon.description}</p>
                            <p><strong>Registration:</strong> <span className={`status status-${status.toLowerCase().replace(" ", "-")}`}>{hackathon.isRegistered ? "Registered" : status}</span></p>
                            <p><strong>Registration closes:</strong> {formatDate(hackathon.regEnd)}</p>
                            <p><strong>Hackathon:</strong> {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</p>
                            <div className="card-actions">
                                <button type="button" className="secondary-button" onClick={() => setSelectedHackathon(hackathon)}>View Details</button>
                                <button type="button" disabled={!canRegister} onClick={() => openRegistrationModal(hackathon)}>
                                    {hackathon.isRegistered ? "Registered" : status === "Open" ? "Register" : status}
                                </button>
                            </div>
                        </article>
                    )})}
                    </div>
                )}
            </div>
            
            {/* View Details Modal */}
            {selectedHackathon && (
                <div className="details-backdrop" role="presentation" onClick={() => setSelectedHackathon(null)}>
                    <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="hackathon-details-title" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-button" aria-label="Close details" onClick={() => setSelectedHackathon(null)}>×</button>
                        <h2 id="hackathon-details-title">{selectedHackathon.title}</h2>
                        <p>{selectedHackathon.description}</p>
                        <p><strong>Registration:</strong> {formatDate(selectedHackathon.regStart)} - {formatDate(selectedHackathon.regEnd)}</p>
                        <p><strong>Hackathon:</strong> {formatDate(selectedHackathon.startDate)} - {formatDate(selectedHackathon.endDate)}</p>
                        <p><strong>Submission:</strong> {formatDate(selectedHackathon.subStart)} - {formatDate(selectedHackathon.subEnd)}</p>
                        <p><strong>Team size:</strong> {selectedHackathon.reqmembers}</p>
                        <p><strong>Rules:</strong> {selectedHackathon.rules}</p>
                        {selectedHackathon.ps && <p><a href={selectedHackathon.ps} target="_blank" rel="noreferrer">View problem statement</a></p>}
                    </section>
                </div>
            )}

            {/* Registration Modal */}
            {showRegistrationModal && registrationHackathon && (
                <div className="details-backdrop" role="presentation" onClick={() => setShowRegistrationModal(false)}>
                    <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-button" aria-label="Close registration" onClick={() => setShowRegistrationModal(false)}>×</button>
                        <h2 id="registration-title">Register for {registrationHackathon.title}</h2>
                        
                        <div className="registration-form">
                            <div className="form-group">
                                <label>Team Name</label>
                                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name" />
                            </div>

                            <h3>Team Members</h3>
                            {teamMembers.map((member, index) => (
                                <div key={index} className="member-group">
                                    <h4>Member {index + 1}</h4>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} placeholder="Name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={member.email} onChange={(e) => updateMember(index, 'email', e.target.value)} placeholder="Email address" />
                                    </div>
                                </div>
                            ))}
                            
                            <button type="button" className="secondary-button" onClick={addMember} style={{ marginBottom: '20px' }}>
                                + Add Member
                            </button>

                            <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
                                <button type="button" className="secondary-button" onClick={() => setShowRegistrationModal(false)}>Cancel</button>
                                <button type="button" onClick={() => {
                                    console.log("Team Info collected:", { teamName, teamMembers });
                                    setShowRegistrationModal(false);
                                    handleRegistration();
                                }}>Continue</button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}

export default StudentDashboard;
