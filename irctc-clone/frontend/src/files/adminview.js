import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminView() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = sessionStorage.getItem("role");
        if (role !== "admin") {
            alert("Access Denied! Admins only.");
            navigate("/"); // Redirect non-admins
        }
    }, [navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Manage trains, users, and bookings here.</p>
        </div>
    );
}

export default AdminView;
