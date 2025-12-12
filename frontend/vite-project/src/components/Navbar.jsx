
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
