import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./files.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AdminLogin() {
    const [admin, setAdmin] = useState({ email: "", password: "" });
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    function handleChange(event) {
        setAdmin({ ...admin, [event.target.name]: event.target.value });
    }

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(admin),
            });

            const res = await response.json();
            console.log("Login Response:", res); // Debugging

            if (!res.success) {
                setErrorMsg("Invalid Credentials! Please try again.");
                setOpen(true);
            } else {
                sessionStorage.setItem("adminID", res.adminId);
                sessionStorage.setItem("role", "admin");

                console.log("Stored Role:", "admin"); // Debugging

                navigate("/admin", { replace: true }); // ✅ Redirect to Admin Dashboard
            }
        } catch (err) {
            console.error("Login Error:", err);
            setErrorMsg("Server error! Please try again later.");
            setOpen(true);
        }
    };

    return (
        <div className="login_page">
            <div className="login_main">
                <h3>Admin Login</h3>
                <form onSubmit={onSubmitForm}>
                    <TextField
                        required
                        label="Email"
                        name="email"
                        value={admin.email}
                        onChange={handleChange}
                    />
                    <br /><br />
                    <TextField
                        required
                        label="Password"
                        name="password"
                        type="password"
                        value={admin.password}
                        onChange={handleChange}
                    />
                    <br /><br />
                    <Button type="submit" variant="contained">Login</Button>
                </form>

                <p>Don't have an account? <a href="/adminRegister">Register here</a></p>

                <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                    <Alert severity="error" onClose={handleClose}>{errorMsg}</Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default AdminLogin;
