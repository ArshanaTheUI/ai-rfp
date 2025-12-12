import { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function loadStats() {
        try {
            setLoading(true);
            const res = await API.get("/stats");
            setStats(res.data);
        } catch (err) {
            console.error("Stats load error", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadStats();
    }, []);
    useEffect(() => {
        const done = localStorage.getItem("rfp_wizard_done");
        if (!done) {
            navigate("/wizard");
        }
    }, []);

    if (loading) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-top">
                <h1>Welcome to AI RFP System</h1>
                <p className="subtitle">Quick actions and summary of your RFPs</p>
            </div>

            <div className="stat-cards">
                <div className="card">
                    <div className="card-title">RFPs</div>
                    <div className="card-value">{stats.rfpCount}</div>
                    <Link to="/create-rfp" className="card-cta">Create RFP</Link>
                </div>

                <div className="card">
                    <div className="card-title">Vendors</div>
                    <div className="card-value">{stats.vendorCount}</div>
                    <Link to="/vendors" className="card-cta">Manage Vendors</Link>
                </div>

                <div className="card">
                    <div className="card-title">Proposals</div>
                    <div className="card-value">{stats.proposalCount}</div>
                    <Link to="/rfps" className="card-cta">View Proposals</Link>
                </div>
            </div>

            <div className="recent">
                <h3>Recent RFPs</h3>
                {stats.recentRfps.length === 0 ? <p>No RFPs yet</p> : (
                    <ul>
                        {stats.recentRfps.map(r => (
                            <li key={r._id}>
                                <div className="recent-row">
                                    <div>
                                        <strong>{r.title}</strong>
                                        <div className="recent-sub">{new Date(r.createdAt).toLocaleString()}</div>
                                    </div>
                                    <Link to={`/rfp/${r._id}`} className="link">View</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="quick-actions">
                <h3>Quick actions</h3>
                <div className="quick-buttons">
                    <Link to="/create-rfp" className="btn-primary">Create RFP</Link>
                    <Link to="/vendors" className="btn-secondary">Add Vendor</Link>
                    <Link to="/send-rfp" className="btn-secondary">Send RFP</Link>
                    <Link to="/rfps" className="btn-secondary">Compare Proposals</Link>
                </div>
            </div>
        </div>
    );
}
