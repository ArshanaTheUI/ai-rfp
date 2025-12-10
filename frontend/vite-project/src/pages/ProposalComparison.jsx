// frontend/src/pages/ProposalComparison.jsx
import { useEffect, useState } from "react";
import { API } from "../api";
import { useParams, Link, useNavigate } from "react-router-dom";

import "../styles/pageCard.css";   // CORRECT FILE
import "../styles/button.css";         // CORRECT FILE
import "../styles/ProposalComparison.css"; // CORRECT FILE

function formatNumber(v) {
    if (v == null) return "-";
    if (typeof v === "number") return v.toLocaleString();
    return v;
}

export default function ProposalComparison() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [rfp, setRfp] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState(null);
    const [fromWizard, setFromWizard] = useState(false);
    const [nextStep, setNextStep] = useState(null);

    async function load() {
        try {
            setLoading(true);
            const res = await API.get(`/rfps/${id}/compare`);
            setRfp(res.data.rfp);
            setProposals(res.data.proposals);
            setRecommendation(res.data.recommendation);
        } catch (err) {
            setError("Failed to load comparison");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();

        const params = new URLSearchParams(window.location.search);
        if (params.get("fromWizard")) {
            setFromWizard(true);
            setNextStep(5);
        }
    }, [id]);

    if (loading) return <p className="loading">Loading comparison...</p>;
    if (error) return <p className="no-data">{error}</p>;
    if (!rfp) return <p className="no-data">No RFP found</p>;

    const best = proposals.length
        ? proposals.reduce((a, b) => (a._score > b._score ? a : b))
        : null;

    const ranked = [...proposals].sort((a, b) => b._score - a._score);

    return (
        <div className="compare-container">
            {/* LEFT SIDE */}
            <div>
                <Link to={`/rfp/${id}`} className="back-link">
                    ← Back to RFP
                </Link>

                <h2 className="section-title">Proposal Comparison</h2>
                <h4 className="section-subtitle">{rfp.title}</h4>

                {/* RFP STRUCTURED BLOCK */}
                <div className="box">
                    <strong>RFP Structured:</strong>
                    <pre className="json-block">
                        {JSON.stringify(rfp.structured || rfp, null, 2)}
                    </pre>
                </div>

                {/* PROPOSAL TABLE */}
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Score</th>
                            <th>Total</th>
                            <th>Delivery</th>
                            <th>Warranty</th>
                            <th>Completeness</th>
                            <th>Breakdown</th>
                        </tr>
                    </thead>

                    <tbody>
                        {proposals.map((p) => {
                            const s = p.structured || {};
                            const total =
                                s.total_price ??
                                (s.pricing && s.pricing.total) ??
                                s.price ??
                                null;

                            const delivery =
                                s.delivery_days ?? s.delivery ?? s.timeline ?? "-";

                            const warranty =
                                s.warranty_months ?? s.warranty ?? "-";

                            const completeness = p._breakdown?.completeness ?? "-";

                            const isBest = best && p._id === best._id;

                            return (
                                <tr key={p._id} className={isBest ? "best-row" : ""}>
                                    <td>
                                        <div className="vendor-name">{p.vendor?.name ?? "Unknown"}</div>
                                        <div className="vendor-email">{p.vendor?.contactEmail ?? "-"}</div>
                                    </td>

                                    <td>
                                        <div className="score-value">{p._score ?? "-"}</div>
                                        <div className="score-label">weighted</div>
                                    </td>

                                    <td>{formatNumber(total)}</td>
                                    <td>{delivery}</td>
                                    <td>{warranty}</td>
                                    <td>{completeness}%</td>

                                    <td>
                                        <pre className="json-block">
                                            {p._breakdown
                                                ? JSON.stringify(p._breakdown, null, 2)
                                                : "-"}
                                        </pre>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Wizard Continue */}
                {fromWizard && (
                    <button
                        className="btn-primary"
                        style={{ marginTop: "20px" }}
                        onClick={() => navigate(`/wizard?step=${nextStep}`)}
                    >
                        ✔ Continue (Final Step)
                    </button>
                )}
            </div>

            {/* RIGHT SIDE */}
            <div>
                {/* Ranked Vendors */}
                <div className="ranked-box">
                    <h4 className="reco-title">Ranked Vendors</h4>

                    {ranked.length === 0 ? (
                        <p>No proposals yet</p>
                    ) : (
                        <ol className="ranked-list">
                            {ranked.map((r) => (
                                <li key={r._id} className="ranked-item">
                                    <div className="ranked-line">
                                        <div>
                                            <strong>{r.vendor?.name}</strong>
                                            <div className="vendor-email">{r.vendor?.contactEmail}</div>
                                        </div>

                                        <div className="ranked-score">
                                            <div className="ranked-score-value">{r._score}</div>
                                            <div className="ranked-score-label">score</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Recommendation */}
                <div className="reco-box">
                    <h4 className="reco-title">AI Recommendation</h4>

                    {recommendation ? (
                        <>
                            <strong>Recommendation</strong>
                            <div className="reco-text">
                                {recommendation.recommendation}
                            </div>

                            <strong style={{ marginTop: 10, display: "block" }}>Ranked</strong>
                            <ul>
                                {recommendation.ranked?.map((r, i) => (
                                    <li key={i}>
                                        {r.vendor} — {r.score}
                                    </li>
                                ))}
                            </ul>

                            <strong style={{ marginTop: 10, display: "block" }}>Risks</strong>
                            <ul>
                                {recommendation.risks?.length === 0
                                    ? <li>No risks highlighted</li>
                                    : recommendation.risks.map((risk, i) => (
                                        <li key={i}>{risk}</li>
                                    ))}
                            </ul>
                        </>
                    ) : (
                        <p>No AI recommendation available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
