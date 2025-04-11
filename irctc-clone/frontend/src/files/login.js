import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import trainImg from "./register_img.png";
import "./files.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState({ email: "", password: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  }

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", user);
  
    // Determine the correct API endpoint based on the entered email
    const isAdmin = user.email === "head@example.com";
    const loginEndpoint = isAdmin 
      ? "http://localhost:5000/api/admin/login" 
      : "http://localhost:5000/api/user/login";
  
    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      console.log("Response Status:", response.status);
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (data.success) {
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("userId", data.userId);
        
        // Redirect based on role
        if (data.role === "admin") {
          navigate("/addtrain"); // Redirect to Add Train page
        } else {
          navigate("/search-train");
        }
        
      } else {
        setErrorMsg("Invalid Credentials! Try Again.");
        setOpen(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Server error! Please try again later.");
      setOpen(true);
    }
  };
  
  return (
    <div className="login_page">
      <div className="login_main">
        <div className="train_image">
          <img src={trainImg} alt="Train" />
        </div>
        <div className="login_input">
          <h3>Login</h3>
          <form onSubmit={onSubmitForm}>
            <TextField
              sx={{ width: 319 }}
              required
              name="email"
              label="Email"
              value={user.email}
              onChange={handleChange}
            />
            <br /><br />
            <TextField
              sx={{ width: 319 }}
              required
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
            />
            <br /><br />
            <Button type="submit" variant="contained">
              Login
            </Button>
          </form>
        </div>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Login;