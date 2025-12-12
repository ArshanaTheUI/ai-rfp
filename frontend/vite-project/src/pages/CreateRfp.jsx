import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/pageCard.css";
import "../styles/button.css";

export default function CreateRfp() {
    const [text, setText] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createRfp = async () => {
        if (!text || text.trim().length === 0) {
            return alert("Please enter an RFP description.");
        }

        try {
            setLoading(true);
            const res = await API.post("/rfps", { text });
            setResponse(res.data);
            setText("");

            // Wizard auto step (only if invoked from wizard)
            const params = new URLSearchParams(window.location.search);
            const fromWizard = params.get("fromWizard");
            const nextStep = params.get("nextStep");

            if (fromWizard && nextStep) {
                navigate(`/wizard?step=${nextStep}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error creating RFP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <h2>Create RFP</h2>

            <div className="card-box">
                <label style={{ color: "var(--navy)", fontWeight: 700 }}>Describe what you need</label>
                <textarea
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='e.g. "I need 20 ergonomic office chairs, budget 50k INR, delivery within 10 days, 1 year warranty"'
                />
                <div style={{ marginTop: 12 }}>
                    <button className="btn-primary" onClick={createRfp} disabled={loading}>
                        {loading ? "Creating..." : "Create RFP"}
                    </button>
                </div>
            </div>

            {response && (
                <div className="card-box" style={{ marginTop: 20 }}>
                    <h3 style={{ color: "var(--yellow)" }}>Structured RFP</h3>
                    <pre style={{ background: "#eef0ff", padding: 12, borderRadius: 8, color: "var(--navy)" }}>
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
