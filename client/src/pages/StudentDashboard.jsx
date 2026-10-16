import { useState, useEffect } from "react";
import api from "../services/api";
import "./StudentDashboard.css";
import Taskbar from "../components/Taskbar";

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

    const getErrorMessage = (e) => e.response?.data?.message || e.response?.data?.error || "Something went wrong. Please try again.";
    const formatDate = (date) => new Date(date).toLocaleDateString();
    
    const registrationStatus = (hackathon) => {
        const now = new Date();
        if (now < new Date(hackathon.regStart)) return "Opens soon";
        if (now > new Date(hackathon.regEnd)) return "Closed";
        return "Open";
    };

    const getStatusClass = (status, isRegistered) => {
        if (isRegistered) return "success";
        if (status === "Open") return "success";
        if (status === "Closed") return "danger";
        return "warning"; // Opens soon
    }

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

    return (
        <>
            <div className="student-dashboard">
                <h1>Student Dashboard</h1>
                <p className="dashboard-intro">Explore upcoming hackathons and register while registration is open.</p>
                {error && <p className="dashboard-error" role="alert">{error}</p>}

                {loading ? (
                    <p style={{ color: 'var(--text-on-dark)', fontSize: '24px' }}>Loading the arena...</p>
                ) : hackathons.length === 0 ? (
                    <p style={{ color: 'var(--text-muted-on-dark)', fontSize: '20px' }}>No hackathons are available right now.</p>
                ) : (
                    <div className="hackathon-grid">
                        {hackathons.map((hackathon) => {
                            const status = registrationStatus(hackathon);
                            const canRegister = status === "Open" && !hackathon.isRegistered;
                            const badgeClass = getStatusClass(status, hackathon.isRegistered);
                            return (
                                <article className="stone-tablet" key={hackathon._id}>
                                    <div className="stone-tablet-inner">
                                        <h2>{hackathon.title}</h2>
                                        <div className="carved-divider"></div>
                                        <p className="tablet-desc">{hackathon.description}</p>
                                        
                                        <div className="info-grid">
                                            <span className="info-label">Registration</span>
                                            <span className="info-value status-wrapper">
                                                <span className={`gem-badge ${badgeClass}`}></span>
                                                {hackathon.isRegistered ? "Registered" : status}
                                            </span>
                                            
                                            <span className="info-label">Reg Closes</span>
                                            <span className="info-value">{formatDate(hackathon.regEnd)}</span>
                                            
                                            <span className="info-label">Hackathon</span>
                                            <span className="info-value">{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                                        </div>
                                        
                                        <div className="card-actions">
                                            <button type="button" className="carved-btn carved-btn-secondary" onClick={() => setSelectedHackathon(hackathon)}>View Details</button>
                                            <button type="button" className="carved-btn carved-btn-primary" disabled={!canRegister} onClick={() => openRegistrationModal(hackathon)}>
                                                {hackathon.isRegistered ? "Registered" : status === "Open" ? "Register" : status}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
            
            {/* View Details Modal */}
            {selectedHackathon && (
                <div className="details-backdrop" role="presentation" onClick={() => setSelectedHackathon(null)}>
                    <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="hackathon-details-title" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-button" aria-label="Close details" onClick={() => setSelectedHackathon(null)}>×</button>
                        <h2 id="hackathon-details-title">{selectedHackathon.title}</h2>
                        <p style={{ marginBottom: '16px' }}>{selectedHackathon.description}</p>
                        
                        <div className="info-grid" style={{ marginBottom: '16px' }}>
                            <span className="info-label">Registration</span>
                            <span className="info-value">{formatDate(selectedHackathon.regStart)} - {formatDate(selectedHackathon.regEnd)}</span>
                            
                            <span className="info-label">Hackathon</span>
                            <span className="info-value">{formatDate(selectedHackathon.startDate)} - {formatDate(selectedHackathon.endDate)}</span>
                            
                            <span className="info-label">Submission</span>
                            <span className="info-value">{formatDate(selectedHackathon.subStart)} - {formatDate(selectedHackathon.subEnd)}</span>
                            
                            <span className="info-label">Team Size</span>
                            <span className="info-value">{selectedHackathon.reqmembers}</span>
                        </div>
                        
                        <p style={{ marginBottom: '16px' }}><strong>Rules:</strong> {selectedHackathon.rules}</p>
                        {selectedHackathon.ps && <p><a href={selectedHackathon.ps} target="_blank" rel="noreferrer" style={{ color: 'var(--text-on-stone)', textDecoration: 'underline' }}>View problem statement</a></p>}
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
                                <label className="pixel-label">Team Name</label>
                                <input className="pixel-input" type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Enter team name" />
                            </div>

                            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Team Members</h3>
                            {teamMembers.map((member, index) => (
                                <div key={index} className="member-group">
                                    <h4>Member {index + 1}</h4>
                                    <div className="form-group">
                                        <label className="pixel-label">Name</label>
                                        <input className="pixel-input" type="text" value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} placeholder="Name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="pixel-label">Email</label>
                                        <input className="pixel-input" type="email" value={member.email} onChange={(e) => updateMember(index, 'email', e.target.value)} placeholder="Email address" />
                                    </div>
                                </div>
                            ))}
                            
                            <button type="button" className="pixel-btn pixel-btn-secondary" onClick={addMember} style={{ marginBottom: '20px' }}>
                                + Add Member
                            </button>

                            <div className="card-actions" style={{ justifyContent: 'flex-end' }}>
                                <button type="button" className="pixel-btn pixel-btn-secondary" onClick={() => setShowRegistrationModal(false)}>Cancel</button>
                                <button type="button" className="pixel-btn pixel-btn-primary" onClick={() => {
                                    console.log("Team Info collected:", { teamName, teamMembers });
                                    setShowRegistrationModal(false);
                                    handleRegistration();
                                }}>Continue</button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
            <Taskbar />
        </>
    );
}

export default StudentDashboard;
