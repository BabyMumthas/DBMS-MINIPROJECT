import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import "./files.css";

function ChangePassword() {
  const [passwords, setPasswords] = useState({
    userId: "",
    oldPassword: "",
    newPassword: "",
  });

  // Fetch userId from storage
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (storedUserId) {
      setPasswords((prev) => ({ ...prev, userId: storedUserId }));
    } else {
      console.warn("⚠️ User ID not found in localStorage or sessionStorage!");
    }
  }, []);

  // ✅ Make sure this function is present
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { userId, oldPassword, newPassword } = passwords;

    // 🛠 Debugging Logs
    console.log("🔍 Sending userId:", userId);
    console.log("🔍 Sending oldPassword:", oldPassword);
    console.log("🔍 Sending newPassword:", newPassword);

    if (!userId || !oldPassword.trim() || !newPassword.trim()) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Password changed successfully!");
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("❌ Error changing password:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="change_password">
      <h3>Change Password</h3>
      <br />
      {}
      <br />
      <form onSubmit={handleChangePassword}>
        <TextField
          sx={{ width: 319 }}
          required
          label="Old Password"
          name="oldPassword"
          type="password"
          value={passwords.oldPassword}
          onChange={handleChange} // ✅ Make sure this is correctly used
        />
        <br /><br />
        <TextField
          sx={{ width: 319 }}
          required
          label="New Password"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handleChange} // ✅ Make sure this is correctly used
        />
        <br /><br />
        <Button type="submit" variant="contained">
          CHANGE PASSWORD
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
