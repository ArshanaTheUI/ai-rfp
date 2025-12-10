import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

import "../styles/pageCard.css";
import "../styles/button.css";

export default function SendRfp() {
    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedRfp, setSelectedRfp] = useState("");
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Load RFPs + Vendors
    const loadData = async () => {
        const resRfp = await API.get("/rfps");
        setRfps(resRfp.data);

        const resVendor = await API.get("/vendors");
        setVendors(resVendor.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Select vendor
    const toggleVendor = (id) => {
        if (selectedVendors.includes(id)) {
            setSelectedVendors(selectedVendors.filter((v) => v !== id));
        } else {
            setSelectedVendors([...selectedVendors, id]);
        }
    };

    // Send RFP
    const sendRfp = async () => {
        if (!selectedRfp) return alert("Please select an RFP");
        if (selectedVendors.length === 0)
            return alert("Please select at least one vendor");

        try {
            await API.post("/send-rfp", {
                rfpId: selectedRfp,
                vendorIds: selectedVendors,
            });

            setMessage("RFP sent successfully!");
            setSelectedRfp("");
            setSelectedVendors([]);

            // Wizard auto-step AFTER sending RFP
            const params = new URLSearchParams(window.location.search);
            const fromWizard = params.get("fromWizard");
            const nextStep = params.get("nextStep");

            if (fromWizard && nextStep) {
                navigate(`/wizard?step=${nextStep}`);
            }

        } catch (err) {
            console.log(err);
            alert("Error sending RFP");
        }
    };

    return (
        <div className="page">
            <h2>Send RFP to Vendors</h2>

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="card-box" style={{ background: "var(--yellow)", color: "var(--navy)" }}>
                    {message}
                </div>
            )}

            {/* SELECT RFP */}
            <div className="card-box">
                <h3>Select RFP</h3>

                <select
                    value={selectedRfp}
                    onChange={(e) => setSelectedRfp(e.target.value)}
                >
                    <option value="">-- Select RFP --</option>

                    {rfps.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.title || "Untitled RFP"}
                        </option>
                    ))}
                </select>
            </div>

            {/* SELECT VENDORS */}
            <div className="card-box">
                <h3>Select Vendors</h3>

                {vendors.map((v) => (
                    <label key={v._id} style={{ display: "block", marginBottom: "10px", color: "var(--navy)" }}>
                        <input
                            type="checkbox"
                            checked={selectedVendors.includes(v._id)}
                            onChange={() => toggleVendor(v._id)}
                        />
                        {"  "}
                        {v.name} ({v.contactEmail})
                    </label>
                ))}
            </div>

            {/* SEND BUTTON */}
            <button className="btn-primary" onClick={sendRfp}>
                Send RFP
            </button>
        </div>
    );
}
