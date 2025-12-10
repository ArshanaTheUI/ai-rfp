import { useEffect, useState } from "react";
import { API } from "../api";
import { useParams, Link } from "react-router-dom";

import "../styles/pageCard.css";
import "../styles/button.css";
import "../styles/RfpDetails.css";

export default function RfpDetails() {
    const { id } = useParams();
    const [rfp, setRfp] = useState(null);
    const [proposals, setProposals] = useState([]);

    const loadData = async () => {
        const res = await API.get(`/rfps/${id}/details`);
        setRfp(res.data.rfp);
        setProposals(res.data.proposals);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (!rfp) return <p className="loading">Loading...</p>;

    return (
        <div className="page">
            <h2>{rfp.title}</h2>

            {/* STRUCTURED RFP */}
            <div className="card-box">
                <h3>Structured AI Output</h3>

                <pre className="json-block">
                    {JSON.stringify(rfp.structured, null, 2)}
                </pre>
            </div>

            {/* COMPARE BUTTON */}
            <Link to={`/rfp/${id}/compare`} className="btn-primary" style={{ marginBottom: "20px", display: "inline-block" }}>
                Compare Proposals →
            </Link>

            {/* PROPOSALS */}
            <h3 style={{ color: "var(--yellow)" }}>Vendor Proposals</h3>

            <div className="card-box">
                {proposals.length === 0 ? (
                    <p>No proposals received yet.</p>
                ) : (
                    <table className="details-table">
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Email</th>
                                <th>Proposal</th>
                                <th>Received</th>
                            </tr>
                        </thead>

                        <tbody>
                            {proposals.map((p) => (
                                <tr key={p._id}>
                                    <td>{p.vendor?.name}</td>
                                    <td>{p.vendor?.contactEmail}</td>
                                    <td>
                                        <pre className="json-block small-json">
                                            {JSON.stringify(p.structured, null, 2)}
                                        </pre>
                                    </td>
                                    <td>{new Date(p.receivedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
