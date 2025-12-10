import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/pageCard.css";
import "../styles/button.css";
export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({
        name: "",
        contactEmail: "",
        contactPerson: "",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    // Load vendors list
    const loadVendors = async () => {
        const res = await API.get("/vendors");
        setVendors(res.data);
    };

    useEffect(() => {
        loadVendors();
    }, []);

    // Add Vendor
    const addVendor = async () => {
        if (!form.name || !form.contactEmail) {
            return alert("Name and email are required!");
        }

        try {
            await API.post("/vendors", form);
            setMessage("Vendor added successfully!");
            setForm({ name: "", contactEmail: "", contactPerson: "" });
            loadVendors();

            // Wizard auto-step AFTER vendor is added
            const params = new URLSearchParams(window.location.search);
            const fromWizard = params.get("fromWizard");
            const nextStep = params.get("nextStep");

            if (fromWizard && nextStep) {
                navigate(`/wizard?step=${nextStep}`);
            }
        } catch (err) {
            alert("Error adding vendor");
        }
    };

    return (
        <div className="page">

            <h2>Vendors</h2>

            {/* SUCCESS MESSAGE */}
            {message && (
                <div className="card-box" style={{ background: "var(--yellow)", color: "var(--navy)" }}>
                    {message}
                </div>
            )}

            {/* ADD VENDOR FORM */}
            <div className="card-box">
                <h3>Add New Vendor</h3>

                <input
                    placeholder="Vendor Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    placeholder="Vendor Email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />

                <input
                    placeholder="Contact Person Name"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                />

                <button className="btn-primary" onClick={addVendor}>
                    Add Vendor
                </button>
            </div>

            {/* VENDOR LIST */}
            <h3 style={{ color: "var(--yellow)" }}>Existing Vendors</h3>

            <div className="card-box">
                {vendors.length === 0 ? (
                    <p>No vendors yet.</p>
                ) : (
                    <table style={{ width: "100%", color: "var(--navy)" }}>
                        <thead>
                            <tr style={{ background: "var(--orange)", color: "white" }}>
                                <th style={{ padding: "10px" }}>Name</th>
                                <th>Email</th>
                                <th>Contact Person</th>
                            </tr>
                        </thead>

                        <tbody>
                            {vendors.map((v) => (
                                <tr key={v._id}>
                                    <td>{v.name}</td>
                                    <td>{v.contactEmail}</td>
                                    <td>{v.contactPerson}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}
