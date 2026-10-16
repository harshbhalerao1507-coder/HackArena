import { Link } from 'react-router-dom';
import landingBg from '../assets/landing-page.png';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Fixed Background Layer */}
      <div 
        className="home-bg" 
        style={{ backgroundImage: `url(${landingBg})` }}
      ></div>

      {/* Content Overlay */}
      <div className="home-content">
        {/* Navbar */}
        <nav className="home-nav">
          <div className="nav-brand">HackArena</div>
          <div className="nav-links">
            <Link to="/login" className="pixel-btn pixel-btn-secondary">Login</Link>
            <Link to="/register" className="pixel-btn pixel-btn-primary">Register</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero-section text-center">
          <h1 className="hero-title">HackArena</h1>
          <p className="hero-subtitle">Enter the Digital Colosseum. Build, Compete, Conquer.</p>
          <div className="hero-cta-wrapper">
            <Link to="/login" className="pixel-btn pixel-btn-primary cta-btn">
              Enter the Arena
            </Link>
          </div>
        </header>

        {/* How It Works Section */}
        <section className="info-section">
          <h2 className="text-center">How It Works</h2>
          <div className="quest-steps">
            <div className="pixel-panel step-card">
              <h3>1. Enter</h3>
              <p>Register as a gladiator (student) and find a hackathon to join.</p>
            </div>
            <div className="pixel-panel step-card">
              <h3>2. Form Team</h3>
              <p>Gather your party. Send summons and assemble your champions.</p>
            </div>
            <div className="pixel-panel step-card">
              <h3>3. Build</h3>
              <p>Forge your project during the active competition phase.</p>
            </div>
            <div className="pixel-panel step-card">
              <h3>4. Submit</h3>
              <p>Present your creation to the organisers before the clock runs out.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="pixel-panel feature-block">
            <h3>For Students</h3>
            <ul>
              <li>Participate in exclusive hackathons</li>
              <li>Form teams securely via invite links</li>
              <li>Track eligibility and submission deadlines</li>
            </ul>
          </div>
          <div className="pixel-panel feature-block">
            <h3>For Organisers</h3>
            <ul>
              <li>Create and manage multiple hackathons</li>
              <li>Set strict team rules and deadlines</li>
              <li>Review submitted projects efficiently</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer text-center pixel-panel">
          <p>&copy; {new Date().getFullYear()} HackArena. May the best code win.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
