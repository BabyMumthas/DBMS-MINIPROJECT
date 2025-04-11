import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import trainImg from "./register_img.png";

function Register() {
    const [user, setUser] = useState({
        fname: "",
        lname: "",
        email: "",
        contactNo: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log("📤 Submitting form:", user);

            const response = await fetch("http://localhost:5000/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            console.log("🔹 Response status:", response.status);

            const res = await response.json();
            console.log("✅ Response data:", res);

            if (res.created) {
                alert("Account created successfully! Redirecting to login...");
                window.location.href = "/login";
            } else {
                alert(res.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("🚨 Error submitting form:", err);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login_page">
            <div className="login_main">
                <div className="train_image">
                    <img src={trainImg} alt="Train" />
                </div>
                <div className="login_input">
                    <div>
                        <h3>Register</h3>
                        <br />
                        <form onSubmit={onSubmitForm}>
                            <TextField
                                sx={{ width: 319 }}
                                required
                                name="fname"
                                label="First Name"
                                value={user.fname}
                                onChange={handleChange}
                            />
                            <br /><br />
                            <TextField
                                sx={{ width: 319 }}
                                required
                                name="lname"
                                label="Last Name"
                                value={user.lname}
                                onChange={handleChange}
                            />
                            <br /><br />
                            <TextField
                                sx={{ width: 319 }}
                                required
                                name="email"
                                label="Email"
                                type="email"
                                value={user.email}
                                onChange={handleChange}
                            />
                            <br /><br />
                            <TextField
                                sx={{ width: 319 }}
                                required
                                name="contactNo"
                                label="Contact No"
                                type="tel"
                                value={user.contactNo}
                                onChange={handleChange}
                            />
                            <br /><br />
                            <TextField
                                sx={{ width: 319 }}
                                required
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={user.password}
                                onChange={handleChange}
                            />
                            <br /><br />
                            <Button 
                                type="submit" 
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
