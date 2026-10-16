import { useState } from 'react';
import CreateHackathon from '../components/CreateHackathon';

function OrganiserDashboard() {
    const [showCreateHackathon, setShowCreateHackathon] = useState(false);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px 100px' }}>
            <h1>Organiser Dashboard</h1>
            <p style={{ color: 'var(--text-on-dark)', fontSize: '20px', marginBottom: '2rem' }}>
                Host tournaments and manage hackathons in the Digital Colosseum.
            </p>
            <button
                type="button"
                className="pixel-btn pixel-btn-primary"
                onClick={() => setShowCreateHackathon(true)}
            >
                + Create Hackathon
            </button>
            {showCreateHackathon && (
                <CreateHackathon onClose={() => setShowCreateHackathon(false)} />
            )}
        </div>
    );
}

export default OrganiserDashboard;