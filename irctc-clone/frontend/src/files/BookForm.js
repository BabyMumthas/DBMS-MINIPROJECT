import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function BookForm() {
  const [searchParams] = useSearchParams();
  const trainId = searchParams.get("trainId"); // Get train ID from URL
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    email: "",
  });

  useEffect(() => {
    if (!trainId) {
      alert("No train selected! Redirecting...");
      window.location.href = "/search-train"; // Redirect if no train is selected
    }
  }, [trainId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainId,
          ...userData,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed!");
      }

      alert("Booking successful!");
      window.location.href = "/dashboard"; // Redirect to dashboard after booking
    } catch (error) {
      alert("Error booking ticket! Try again.");
    }
  };

  return (
    <div>
      <h2>Book Train Ticket</h2>
      <p>Train ID: {trainId}</p>

      <form onSubmit={handleSubmit}>
        <TextField
          required
          label="Full Name"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        <TextField
          required
          type="number"
          label="Age"
          name="age"
          value={userData.age}
          onChange={handleChange}
        />
        <TextField
          required
          type="email"
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained">Confirm Booking</Button>
      </form>
    </div>
  );
}

export default BookForm;
