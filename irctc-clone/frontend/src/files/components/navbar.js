import React from "react";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

import "../files.css";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate(); // Initialize navigate

  let typeUser = sessionStorage.getItem("typeUser");

  function logOut() {
    sessionStorage.setItem("typeUser", "");
    sessionStorage.removeItem("userID");
    window.location.href = "/";
  }

  return (
    <>
      {/* Default View */}
      {(typeUser === null || typeUser === "") && (
        <div className="navbar_main">
          <div className="iror">
            <h3>
              <Link to="/" className="a-link" style={{ textDecoration: "none" }}>
                IROR
              </Link>
            </h3>
          </div>
          <div className="nav_buttons_C">
            <Button variant="contained" component={Link} to="/login">
              LOGIN
            </Button>
            <Button variant="outlined" component={Link} to="/register">
              REGISTER
            </Button>
            {/* FIX: Use navigate correctly */}
            <Button variant="contained" onClick={() => navigate("/add-train")}>
              Add Train
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
