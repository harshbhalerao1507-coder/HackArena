import React, { useState } from "react";
import "./CreateHackathon.css";
import api from "../services/api";
function CreateHackathon({onClose}) {
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
        const formData=new FormData();
        formData.append("title",title);
        formData.append("description",description);
        formData.append("startDate",startDate);
        formData.append("endDate",endDate);
        formData.append("regStart",regStart);
        formData.append("regEnd",regEnd);
        formData.append("subStart",subStart);
        formData.append("subEnd",subEnd);
        formData.append("reqmembers",reqmembers);
        formData.append("rules",rules);
        if(!ps){
            alert("Please upload a problem statement PDF.");
            return;
        }
        formData.append("ps",ps);
        try
        {const token=localStorage.getItem("token");
         await api.post("/hackathons",formData,{
            headers:{Authorization:`Bearer ${token}`}
        })
    }
        catch{
        }
        
    };

    return (
        <div className="modal-container">
            <form onSubmit={handleSubmit}>

                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label htmlFor="startDate">Start Date</label>
                <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label htmlFor="endDate">End Date</label>
                <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <label htmlFor="regStart">
                    Registration Start Date
                </label>
                <input
                    id="regStart"
                    type="datetime-local"
                    value={regStart}
                    onChange={(e) => setRegStart(e.target.value)}
                />

                <label htmlFor="regEnd">
                    Registration End Date
                </label>
                <input
                    id="regEnd"
                    type="datetime-local"
                    value={regEnd}
                    onChange={(e) => setRegEnd(e.target.value)}
                />

                <label htmlFor="subStart">
                    Submission Start Date
                </label>
                <input
                    id="subStart"
                    type="datetime-local"
                    value={subStart}
                    onChange={(e) => setSubStart(e.target.value)}
                />

                <label htmlFor="subEnd">
                    Submission End Date
                </label>
                <input
                    id="subEnd"
                    type="datetime-local"
                    value={subEnd}
                    onChange={(e) => setSubEnd(e.target.value)}
                />

                <label htmlFor="reqmembers">
                    Required Members
                </label>
                <input
                    id="reqmembers"
                    type="number"
                    value={reqmembers}
                    onChange={(e) => setReqMembers(e.target.value)}
                />

                <label htmlFor="rules">Rules</label>
                <input
                    id="rules"
                    type="text"
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                />

                <label htmlFor="ps">
                    Problem Statement PDF
                </label>
                <input
                    id="ps"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setPs(e.target.files[0])}
                />

                <button type="submit">
                    Create Hackathon
                </button>
                
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default CreateHackathon;
