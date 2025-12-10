import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

import "../styles/wizard.css";
import "../styles/button.css";
import "../styles/pageCard.css";

export default function Wizard() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const startStep = Number(params.get("step") || 0);
    const [step, setStep] = useState(startStep);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function loadStats() {
            const res = await API.get("/stats");
            setStats(res.data);
        }
        loadStats();
    }, []);

    if (!stats)
        return (
            <div className="wizard-container">
                <div className="wizard-card">Loading wizard…</div>
            </div>
        );

    const steps = [
        {
            title: "Step 1: Create Your First RFP",
            desc: "Describe your requirement. The AI will create a structured RFP.",
            complete: stats.rfpCount > 0,
            cta: "Create RFP",
            to: "/create-rfp?fromWizard=1&nextStep=1",
        },
        {
            title: "Step 2: Add Vendors",
            desc: "Add supplier details to send your RFP.",
            complete: stats.vendorCount > 0,
            cta: "Add Vendors",
            to: "/vendors?fromWizard=1&nextStep=2",
        },
        {
            title: "Step 3: Send RFP",
            desc: "Send your RFP to selected vendors.",
            disabled: !(stats.rfpCount > 0 && stats.vendorCount > 0),
            cta: "Send RFP",
            to: "/send-rfp?fromWizard=1&nextStep=3",
        },
        {
            title: "Step 4: Receive Proposals",
            desc: "Proposals appear automatically when vendors reply.",
            complete: stats.proposalCount > 0,
            cta: "View RFPs",
            to: "/rfps?fromWizard=1&nextStep=4",
        },
        {
            title: "Step 5: Compare & Decide",
            desc: "AI compares proposals and recommends the best vendor.",
            complete: stats.proposalCount > 1,
            cta: "Go to RFP List",
            to: "/rfps?fromWizard=1&nextStep=5",
        },
    ];

    const current = steps[step];

    function next() {
        if (step < steps.length - 1) {
            navigate(`/wizard?step=${step + 1}`);
            setStep(step + 1);
        }
    }

    function back() {
        if (step > 0) {
            navigate(`/wizard?step=${step - 1}`);
            setStep(step - 1);
        }
    }

    function finish() {
        localStorage.setItem("rfp_wizard_done", "1");
        navigate("/wizard-success");
    }

    return (
        <div className="wizard-container">
            <div className="wizard-card">

                {/* PROGRESS BAR */}
                <div className="progress-bar">
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className={`progress-segment ${i <= step ? "active" : ""}`}
                        ></div>
                    ))}
                </div>

                {/* STEP TITLE */}
                <h2 className="wizard-title">{current.title}</h2>
                <p className="wizard-desc">{current.desc}</p>

                {/* CTA BUTTON */}
                <button
                    className="btn-primary"
                    disabled={current.disabled}
                    onClick={() => navigate(current.to)}
                >
                    {current.cta}
                </button>

                {/* STEP NAVIGATION */}
                <div className="wizard-nav">
                    <button className="btn-secondary" disabled={step === 0} onClick={back}>
                        ← Back
                    </button>

                    {step < steps.length - 1 ? (
                        <button className="btn-primary" onClick={next}>
                            Next →
                        </button>
                    ) : (
                        <button className="btn-primary" onClick={finish}>
                            Finish ✔
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
