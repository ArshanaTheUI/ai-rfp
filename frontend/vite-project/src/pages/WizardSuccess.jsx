import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "../styles/WizardSuccess.css";

export default function WizardSuccess() {
    const navigate = useNavigate();

    return (
        <div className="success-container">

            {/* 🎉 Confetti Animation */}
            <Confetti numberOfPieces={300} recycle={false} />

            <div className="success-card">
                <h1 className="title">🎉 Workflow Complete!</h1>

                <p className="subtitle">
                    You have successfully completed the entire RFP process.
                </p>

                <ul className="steps-list">
                    <li>📝 Created your RFP</li>
                    <li>👥 Added vendors</li>
                    <li>✉️ Sent RFP to selected vendors</li>
                    <li>📩 Received vendor proposals</li>
                    <li>📊 Compared proposals and got AI recommendations</li>
                </ul>

                <div className="actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Go to Dashboard
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/wizard?step=0")}
                    >
                        Restart Wizard
                    </button>
                </div>
            </div>
        </div>
    );
}
