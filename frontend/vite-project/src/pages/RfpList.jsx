import { useEffect, useState } from "react";
import { API } from "../api";
import { Link } from "react-router-dom";

import "../styles/pageCard.css";
import "../styles/button.css";
import "../styles/RfpList.css";

export default function RfpList() {
    const [rfps, setRfps] = useState([]);

    const loadRfps = async () => {
        const res = await API.get("/rfps");
        setRfps(res.data);
    };

    useEffect(() => {
        loadRfps();
    }, []);

    return (
        <div className="page">
            <h2>All RFPs</h2>

            <div className="card-box">
                {rfps.length === 0 ? (
                    <p>No RFPs created yet.</p>
                ) : (
                    <table className="rfp-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Created</th>
                                <th>View</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rfps.map((r) => (
                                <tr key={r._id}>
                                    <td>{r.title || "Untitled"}</td>
                                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/rfp/${r._id}`} className="table-link">
                                            View Details →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
