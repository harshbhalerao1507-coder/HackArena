import { useState } from "react"
import { loginUser } from "../services/authServices.js"
import { useNavigate, Link } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            const data = await loginUser({email, password})
            localStorage.setItem("token", data.tokens)
            localStorage.setItem("user", JSON.stringify(data.user))
            const role = data.user.role
            if (role === "Student") {
                navigate("/studentDashboard")
            } else {
                navigate("/organiserDashboard")
            }
        } catch(err) {
            setError(err.message || "Failed to enter the arena. Check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container flex items-center justify-center" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="pixel-panel login-panel" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center">Gates of the Arena</h2>
                <p className="text-center mb-1" style={{ color: 'var(--text-muted-on-dark)', fontSize: '16px' }}>Identify yourself, Champion.</p>
                
                {error && <div className="pixel-badge danger mb-1" style={{ display: 'block', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin} className="flex-col">
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" className="pixel-label">Email Scroll</label>
                        <input 
                            id="email"
                            className="pixel-input"
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <label htmlFor="password" className="pixel-label">Secret Passcode</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                id="password"
                                className="pixel-input"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ marginBottom: 0 }}
                                required
                            />
                            <button 
                                type="button" 
                                className="pixel-btn pixel-btn-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ padding: '0 10px', fontSize: '10px' }}
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="pixel-btn pixel-btn-primary" 
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Opening Gates...' : 'Enter'}
                    </button>
                </form>

                <div className="text-center mt-1" style={{ fontSize: '16px' }}>
                    <p style={{ color: 'var(--text-muted-on-dark)' }}>
                        No crest yet? <Link to="/register" style={{ color: 'var(--gold)' }}>Forge one here.</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
