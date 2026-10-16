import { useState } from 'react'
import { registerUser } from '../services/authServices'
import { useNavigate, Link } from 'react-router-dom'
import './Register.css' // We will create this for custom role picker styles

function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("")
    
    // Student fields
    const [education, setEducation] = useState("")
    const [college, setCollege] = useState("")
    const [address, setAddress] = useState("")
    const [skills, setSkills] = useState([])
    
    // Organiser fields
    const [organisation, setOrganisation] = useState("")
    const [organisationDescription, setOrganisationDescription] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleRegister = async(e) => {
        e.preventDefault()
        setError("")
        if (!role) {
            setError("You must choose a path: Student or Organiser.")
            return
        }
        setIsLoading(true)
        try {
            let data;
            if (role === "Student") {
                 data = await registerUser({name, email, password, phone, role, education, college, address, skills})
            } else if (role === "Organiser") {
                 data = await registerUser({name, email, password, phone, role, organisation, organisationDescription})
            }
            
            localStorage.setItem("token", data.token || data.tokens)
            localStorage.setItem("user", JSON.stringify(data.user))
            
            if (role === "Student") {
                navigate("/studentDashboard")
            } else {
                navigate("/organiserDashboard")
            }
        } catch(err) {
            setError(err.message || "Failed to forge crest. Ensure all details are correct.")
        } finally {
            setIsLoading(false)
        }
    }

    const studentFields = (
        <div className="fade-in">
            <h3 className="text-center mb-1" style={{ fontSize: '18px', color: 'var(--text-muted-on-dark)' }}>Gladiator Details</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="education" className="pixel-label">Education Level</label>
                <input id="education" className="pixel-input" type="text" value={education} onChange={(e) => setEducation(e.target.value)} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="college" className="pixel-label">Academy / College</label>
                <input id="college" className="pixel-input" type="text" value={college} onChange={(e) => setCollege(e.target.value)} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="address" className="pixel-label">Address</label>
                <input id="address" className="pixel-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="skills" className="pixel-label">Weaponry (Skills)</label>
                <select name="skills" id="skills" className="pixel-select" multiple value={skills} onChange={(e) => {
                    const selectedSkills = Array.from(e.target.selectedOptions, option => option.value);
                    setSkills(selectedSkills)
                }} style={{ height: '120px' }}>
                    <option value="React">React</option>
                    <option value="Express">Express</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                </select>
                <small style={{ color: 'var(--text-muted-on-dark)', fontSize: '12px' }}>Hold Ctrl/Cmd to select multiple</small>
            </div>
        </div>
    )

    const organiserFields = (
        <div className="fade-in">
            <h3 className="text-center mb-1" style={{ fontSize: '18px', color: 'var(--text-muted-on-dark)' }}>Senate Details</h3>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="organisation" className="pixel-label">Organisation Name</label>
                <input id="organisation" className="pixel-input" type="text" value={organisation} onChange={(e) => setOrganisation(e.target.value)} required />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="organisationDescription" className="pixel-label">Organisation Description</label>
                <textarea id="organisationDescription" className="pixel-textarea" rows="3" value={organisationDescription} onChange={(e) => setOrganisationDescription(e.target.value)} required />
            </div>
        </div>
    )

    return (
        <div className="register-container flex items-center justify-center" style={{ minHeight: '100vh', padding: '40px 20px' }}>
            <div className="pixel-panel register-panel" style={{ maxWidth: '600px', width: '100%' }}>
                <h2 className="text-center">Forge Your Crest</h2>
                
                {error && <div className="pixel-badge danger mb-1" style={{ display: 'block', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleRegister} className="flex-col">
                    <h3 className="text-center mb-1" style={{ fontSize: '18px', color: 'var(--text-muted-on-dark)', marginTop: '1rem' }}>Choose Your Path</h3>
                    
                    {/* Character Select Style Role Picker */}
                    <div className="role-picker">
                        <div 
                            className={`pixel-panel role-card ${role === 'Student' ? 'selected' : ''}`}
                            onClick={() => setRole('Student')}
                        >
                            <h4>Gladiator</h4>
                            <p>(Student)</p>
                            <small>Enter the arena and compete</small>
                        </div>
                        <div 
                            className={`pixel-panel role-card ${role === 'Organiser' ? 'selected' : ''}`}
                            onClick={() => setRole('Organiser')}
                        >
                            <h4>Senator</h4>
                            <p>(Organiser)</p>
                            <small>Host events and judge</small>
                        </div>
                    </div>

                    <h3 className="text-center mb-1" style={{ fontSize: '18px', color: 'var(--text-muted-on-dark)', marginTop: '2rem' }}>Basic Info</h3>
                    
                    <div className="form-grid">
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="name" className="pixel-label">Full Name</label>
                            <input id="name" className="pixel-input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="email" className="pixel-label">Email Scroll</label>
                            <input id="email" className="pixel-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="password" className="pixel-label">Secret Passcode</label>
                            <input id="password" className="pixel-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="phone" className="pixel-label">Pigeon Contact (Phone)</label>
                            <input id="phone" className="pixel-input" type="number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                    </div>

                    <hr className="pixel-divider" />
                    
                    {role === "Student" && studentFields}
                    {role === "Organiser" && organiserFields}
                    
                    <button 
                        type="submit" 
                        className="pixel-btn pixel-btn-primary mt-1" 
                        style={{ width: '100%', fontSize: '18px' }}
                        disabled={isLoading || !role}
                    >
                        {isLoading ? 'Forging...' : 'Complete Registration'}
                    </button>
                </form>

                <div className="text-center mt-1" style={{ fontSize: '16px' }}>
                    <p style={{ color: 'var(--text-muted-on-dark)' }}>
                        Already hold a crest? <Link to="/login" style={{ color: 'var(--gold)' }}>Enter here.</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
