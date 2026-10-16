import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import DockIcon from "./DockIcon";
import { DOCK_ITEMS_CONFIG } from "../config/dockConfig";
import "./Taskbar.css";

function Taskbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [invitationCount, setInvitationCount] = useState(0);
    const [showProfile, setShowProfile] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    // Fetch pending invitations count using existing API endpoint
    const getInvitations = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await api.get("/invite", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvitationCount(response.data.Invitations?.length || 0);
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        getInvitations();

        // Listen for instant updates from Invitations page after accept/reject
        const handleInvitationUpdate = () => {
            getInvitations();
        };
        window.addEventListener("hackarena:invitations-updated", handleInvitationUpdate);
        return () => {
            window.removeEventListener("hackarena:invitations-updated", handleInvitationUpdate);
        };
    }, [getInvitations]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const response = await api.get("/student/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setEditData({
                ...response.data,
                skills: response.data.skills ? response.data.skills.join(", ") : ""
            });
        } catch (e) {
            console.log(e);
        }
    };

    const handleProfileClick = () => {
        if (!showProfile) {
            fetchProfile();
        }
        setShowProfile(!showProfile);
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const dataToUpdate = { ...editData };
            if (typeof dataToUpdate.skills === "string") {
                dataToUpdate.skills = dataToUpdate.skills.split(",").map(s => s.trim()).filter(s => s);
            }
            const response = await api.patch("/student/profile", dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setIsEditing(false);
            alert("Profile updated successfully");
        } catch {
            alert("Error updating profile");
        }
    };

    // Determine which dock item is active
    const isItemActive = (item) => {
        if (item.id === "profile") {
            return showProfile;
        }
        if (item.id === "home") {
            return location.pathname === "/studentDashboard";
        }
        if (item.id === "invitations") {
            return location.pathname === "/studentDashboard/invitations";
        }
        if (item.id === "teams") {
            return location.pathname === "/teamDashboard";
        }
        return false;
    };

    const handleItemClick = (item) => {
        if (item.id === "profile") {
            handleProfileClick();
        } else if (item.route) {
            setShowProfile(false);
            navigate(item.route);
        }
    };

    return (
        <>
            {/* Compact Floating Dock */}
            <nav className="dock-container" aria-label="Student Arena Dock">
                <div className="dock-slab">
                    {DOCK_ITEMS_CONFIG.map((item) => {
                        const active = isItemActive(item);
                        const badge = item.showBadge ? invitationCount : 0;

                        return (
                            <DockIcon
                                key={item.id}
                                label={item.label}
                                image={item.image}
                                route={item.route}
                                onClick={() => handleItemClick(item)}
                                isActive={active}
                                badgeCount={badge}
                                fallbackKey={item.fallbackKey}
                                ariaLabel={item.ariaLabel}
                            />
                        );
                    })}
                </div>
            </nav>

            {/* Profile Panel Modal / Drawer */}
            {showProfile && profile && (
                <div
                    className="profile-backdrop"
                    role="presentation"
                    onClick={() => setShowProfile(false)}
                >
                    <div
                        className="profile-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-heading"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="profile-panel-header">
                            <h3 id="profile-heading">Gladiator Scroll</h3>
                            <button
                                type="button"
                                className="profile-close-btn"
                                onClick={() => setShowProfile(false)}
                                aria-label="Close profile"
                            >
                                ×
                            </button>
                        </div>

                        <div className="carved-divider" style={{ width: "100%", margin: "8px 0 16px" }} />

                        {!isEditing ? (
                            <div className="profile-details">
                                <div className="profile-info-grid">
                                    <span className="info-label">Name</span>
                                    <span className="info-value">{profile.name}</span>
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{profile.email}</span>
                                    <span className="info-label">Rank</span>
                                    <span className="info-value">{profile.role}</span>
                                    <span className="info-label">College</span>
                                    <span className="info-value">{profile.college || "N/A"}</span>
                                    <span className="info-label">Education</span>
                                    <span className="info-value">{profile.education || "N/A"}</span>
                                    <span className="info-label">Comm Line</span>
                                    <span className="info-value">{profile.phone || "N/A"}</span>
                                    <span className="info-label">Skills</span>
                                    <span className="info-value">{profile.skills?.join(", ") || "N/A"}</span>
                                    <span className="info-label">Colosseum HQ</span>
                                    <span className="info-value">{profile.address || "N/A"}</span>
                                </div>
                                <div className="card-actions" style={{ marginTop: "16px" }}>
                                    <button
                                        type="button"
                                        className="carved-btn carved-btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Scroll
                                    </button>
                                    <button
                                        type="button"
                                        className="carved-btn leave-arena-btn"
                                        onClick={handleLogout}
                                    >
                                        Leave Arena
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-edit">
                                <div className="form-group">
                                    <label className="pixel-label">Name</label>
                                    <input
                                        className="pixel-input"
                                        name="name"
                                        value={editData.name || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="pixel-label">Phone</label>
                                    <input
                                        className="pixel-input"
                                        name="phone"
                                        value={editData.phone || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="pixel-label">College</label>
                                    <input
                                        className="pixel-input"
                                        name="college"
                                        value={editData.college || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="pixel-label">Education</label>
                                    <input
                                        className="pixel-input"
                                        name="education"
                                        value={editData.education || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="pixel-label">Skills (comma separated)</label>
                                    <input
                                        className="pixel-input"
                                        name="skills"
                                        value={editData.skills || ""}
                                        onChange={handleEditChange}
                                        placeholder="React, Node, Solidity"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="pixel-label">Address</label>
                                    <input
                                        className="pixel-input"
                                        name="address"
                                        value={editData.address || ""}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className="card-actions" style={{ marginTop: "16px" }}>
                                    <button
                                        type="button"
                                        className="carved-btn carved-btn-primary"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="carved-btn carved-btn-secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Taskbar;
