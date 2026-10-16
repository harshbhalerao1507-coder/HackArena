import { useState } from "react";
import "./CreateHackathon.css";
import api from "../services/api";

function CreateHackathon({ onClose }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [regStart, setRegStart] = useState("");
    const [regEnd, setRegEnd] = useState("");
    const [subStart, setSubStart] = useState("");
    const [subEnd, setSubEnd] = useState("");
    const [reqmembers, setReqMembers] = useState("");
    const [rules, setRules] = useState("");
    const [ps, setPs] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("regStart", regStart);
        formData.append("regEnd", regEnd);
        formData.append("subStart", subStart);
        formData.append("subEnd", subEnd);
        formData.append("reqmembers", reqmembers);
        formData.append("rules", rules);
        if (!ps) {
            alert("Please upload a problem statement PDF.");
            return;
        }
        formData.append("ps", ps);
        try {
            const token = localStorage.getItem("token");
            await api.post("/hackathons", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onClose();
        } catch {
            // Keep error handling intact
        }
    };

    return (
        <div className="create-hackathon-backdrop" role="presentation" onClick={onClose}>
            <div
                className="modal-container"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-hackathon-heading"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="create-hackathon-heading">Create Tournament</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            className="pixel-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            id="description"
                            className="pixel-input"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            id="startDate"
                            className="pixel-input"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            id="endDate"
                            className="pixel-input"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="regStart">Registration Start Date</label>
                        <input
                            id="regStart"
                            className="pixel-input"
                            type="datetime-local"
                            value={regStart}
                            onChange={(e) => setRegStart(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="regEnd">Registration End Date</label>
                        <input
                            id="regEnd"
                            className="pixel-input"
                            type="datetime-local"
                            value={regEnd}
                            onChange={(e) => setRegEnd(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subStart">Submission Start Date</label>
                        <input
                            id="subStart"
                            className="pixel-input"
                            type="datetime-local"
                            value={subStart}
                            onChange={(e) => setSubStart(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subEnd">Submission End Date</label>
                        <input
                            id="subEnd"
                            className="pixel-input"
                            type="datetime-local"
                            value={subEnd}
                            onChange={(e) => setSubEnd(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reqmembers">Required Members</label>
                        <input
                            id="reqmembers"
                            className="pixel-input"
                            type="number"
                            value={reqmembers}
                            onChange={(e) => setReqMembers(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rules">Rules</label>
                        <input
                            id="rules"
                            className="pixel-input"
                            type="text"
                            value={rules}
                            onChange={(e) => setRules(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ps">Problem Statement PDF</label>
                        <input
                            id="ps"
                            className="pixel-input"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={(e) => setPs(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="pixel-btn pixel-btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="submit" className="pixel-btn pixel-btn-primary">
                            Create Hackathon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateHackathon;
