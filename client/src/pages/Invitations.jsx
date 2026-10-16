import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Taskbar from "../components/Taskbar";
import "./Invitations.css";

function Invitations() {
    const navigate = useNavigate();
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] = useState(null);
    const [processingToken, setProcessingToken] = useState(null);

    // Student guard: ensure user has token and is a Student
    useEffect(() => {
        const token = localStorage.getItem("token");
        let userRole;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            userRole = user?.role;
        } catch {
            userRole = null;
        }

        if (!token || (userRole && userRole !== "Student")) {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch student's pending invitations reusing existing API endpoint
    const getInvitations = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await api.get("/invite", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setInvitations(response.data.Invitations || []);
            setError("");
        } catch (e) {
            console.error("Failed to summon invitations:", e.response?.data);
            const msg = e.response?.data?.message || e.response?.data?.error || "Could not retrieve invitations.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getInvitations();
    }, [getInvitations]);

    // Accept invitation handler reusing existing endpoint
    const acceptInvitation = async (inviteToken) => {
        try {
            setProcessingToken(inviteToken);
            setStatusMessage(null);
            setError("");
            const authToken = localStorage.getItem("token");

            const res = await api.post(`/invite/${inviteToken}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            setStatusMessage({
                type: "success",
                text: res.data?.message || "Summons accepted! You have entered the cohort."
            });

            // Update list immediately
            await getInvitations();

            // Notify dock to refresh badge count
            window.dispatchEvent(new CustomEvent("hackarena:invitations-updated"));
        } catch (e) {
            console.error("Accept invitation error:", e.response?.data);
            const msg = e.response?.data?.message || e.response?.data?.error || "Failed to accept the summons.";
            setError(msg);
        } finally {
            setProcessingToken(null);
        }
    };

    // Reject invitation handler reusing existing endpoint
    const rejectInvitation = async (inviteToken) => {
        try {
            setProcessingToken(inviteToken);
            setStatusMessage(null);
            setError("");
            const authToken = localStorage.getItem("token");

            const res = await api.post(`/invite/${inviteToken}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            setStatusMessage({
                type: "success",
                text: res.data?.message || "Summons rejected."
            });

            // Update list immediately
            await getInvitations();

            // Notify dock to refresh badge count
            window.dispatchEvent(new CustomEvent("hackarena:invitations-updated"));
        } catch (e) {
            console.error("Reject invitation error:", e.response?.data);
            const msg = e.response?.data?.message || e.response?.data?.error || "Failed to reject the summons.";
            setError(msg);
        } finally {
            setProcessingToken(null);
        }
    };

    return (
        <>
            <div className="invitations-page">
                {/* Header matching Student Dashboard header */}
                <div className="invitations-header">
                    <div>
                        <h1>Arena Summons</h1>
                        <p className="dashboard-intro">
                            Review your pending battle summons and decide whether to pledge your allegiance.
                        </p>
                    </div>
                    <Link
                        to="/studentDashboard"
                        className="carved-btn carved-btn-secondary back-to-dashboard-btn"
                        aria-label="Back to Student Dashboard"
                    >
                        ← Back to Arena
                    </Link>
                </div>

                {/* Notifications & Status alerts */}
                {error && (
                    <p className="dashboard-error" role="alert">
                        {error}
                    </p>
                )}

                {statusMessage && (
                    <div className="dashboard-success" role="status">
                        {statusMessage.text}
                    </div>
                )}

                {/* Main Content Area */}
                <section className="invitations-content" aria-label="Pending Summons List">
                    {loading ? (
                        <div className="invitations-loading">
                            <p style={{ color: "var(--text-on-dark)", fontSize: "24px" }}>
                                Summoning pending invitations from the arena...
                            </p>
                        </div>
                    ) : invitations.length === 0 ? (
                        <div className="empty-summons-state">
                            <p className="empty-message">No summons from the arena yet.</p>
                            <p className="empty-subtext">
                                When a team leader sends you an invitation, your stone tablet summons will appear here.
                            </p>
                            <Link
                                to="/studentDashboard"
                                className="carved-btn carved-btn-primary"
                                style={{ marginTop: "16px", display: "inline-block" }}
                            >
                                Explore Hackathons
                            </Link>
                        </div>
                    ) : (
                        <div className="invitations-grid">
                            {invitations.map((invite) => {
                                const isBusy = processingToken === invite.token;
                                const inviterDisplay =
                                    invite.team?.leader?.name ||
                                    invite.team?.leader?.email ||
                                    invite.name ||
                                    "Team Leader";

                                return (
                                    <article key={invite._id} className="stone-tablet invitation-card">
                                        <div className="stone-tablet-inner">
                                            <h2>Summons Tablet</h2>
                                            <div className="carved-divider"></div>

                                            <div className="info-grid">
                                                <span className="info-label">Team</span>
                                                <span className="info-value">
                                                    {invite.team?.teamName || "Unnamed Team"}
                                                </span>

                                                <span className="info-label">Hackathon</span>
                                                <span className="info-value">
                                                    {invite.team?.hackathon?.title || "Arena Battle"}
                                                </span>

                                                <span className="info-label">Inviter</span>
                                                <span className="info-value">{inviterDisplay}</span>

                                                <span className="info-label">Status</span>
                                                <span className="info-value status-wrapper">
                                                    <span
                                                        className={`gem-badge ${
                                                            invite.status === "Pending" ? "warning" : "success"
                                                        }`}
                                                    ></span>
                                                    {invite.status}
                                                </span>
                                            </div>

                                            <div className="card-actions">
                                                <button
                                                    type="button"
                                                    className="carved-btn carved-btn-primary"
                                                    disabled={isBusy}
                                                    onClick={() => acceptInvitation(invite.token)}
                                                >
                                                    {isBusy ? "Accepting..." : "Accept"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="carved-btn carved-btn-secondary"
                                                    disabled={isBusy}
                                                    onClick={() => rejectInvitation(invite.token)}
                                                >
                                                    {isBusy ? "Rejecting..." : "Reject"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            {/* Shared Floating Dock */}
            <Taskbar />
        </>
    );
}

export default Invitations;
