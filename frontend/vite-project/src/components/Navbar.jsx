// import { Link } from "react-router-dom";

// export default function Navbar() {
//     return (
//         <nav style={{ padding: "15px", background: "#222", color: "#fff" }}>
//             <Link to="/" style={{ marginRight: "20px", color: "#fff" }}>Dashboard</Link>
//             <Link to="/create-rfp" style={{ marginRight: "20px", color: "#fff" }}>Create RFP</Link>
//             <Link to="/vendors" style={{ marginRight: "20px", color: "#fff" }}>Vendors</Link>
//             <Link to="/send-rfp" style={{ marginRight: "20px", color: "#fff" }}>Send RFP</Link>
//             <Link to="/rfps" style={{ marginRight: "20px", color: "#fff" }}>RFP List</Link>
//             <Link to="/wizard" style={{ marginRight: "20px" }}>Get Started</Link>

//         </nav>
//     );
// }
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    const location = useLocation();

    const links = [
        { to: "/", label: "Dashboard" },
        { to: "/create-rfp", label: "Create RFP" },
        { to: "/vendors", label: "Vendors" },
        { to: "/send-rfp", label: "Send RFP" },
        { to: "/rfps", label: "RFP List" },
        { to: "/wizard", label: "Get Started" },
    ];

    return (
        <nav className="nav">
            <div className="nav-inner">
                {links.map((l) => (
                    <Link
                        key={l.to}
                        to={l.to}
                        className={
                            location.pathname === l.to
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        {l.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
