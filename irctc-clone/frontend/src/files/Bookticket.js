import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Bookticket() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [trainDetails, setTrainDetails] = useState({ departure: "", arrival: "", date: "" });
  const [trainResult, setTrainResult] = useState([]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!trainDetails.departure || !trainDetails.arrival || !trainDetails.date) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    setErrorMessage("");

    const formattedDate = trainDetails.date.split("-").reverse().join("-");
    try {
      const response = await fetch("http://localhost:5000/api/get-trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departureStation: trainDetails.departure,
          arrivalStation: trainDetails.arrival,
          travelDate: formattedDate,
        }),
      });

      const res = await response.json();
      if (!response.ok) throw new Error(res.message || "Failed to fetch train data.");

      if (!res.success || res.trains.length === 0) {
        setErrorMessage("No trains found.");
        setTrainResult([]);
      } else {
        setTrainResult(res.trains);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Error fetching train data.");
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setTrainDetails((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="bookticket">
      <h2>Book Your Ticket</h2>
      <form onSubmit={onSubmitForm}>
        <TextField label="Departure" name="departure" required value={trainDetails.departure} onChange={handleChange} />
        <TextField label="Arrival" name="arrival" required value={trainDetails.arrival} onChange={handleChange} />
        <input type="date" name="date" required value={trainDetails.date} onChange={handleChange} />
        <Button type="submit" variant="contained">Search Trains</Button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {trainResult.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Train ID</th>
              <th>Train Name</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Seats Available</th>
              <th>Travel Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trainResult.map((train) => (
              <tr key={train.TrainID}>
                <td>{train.TrainID}</td>
                <td>{train.TrainName}</td>
                <td>{train.Departure}</td>
                <td>{train.Arrival}</td>
                <td>{train.RemainingSeats}</td>
                <td>{train.CurrentDate}</td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/book", { state: { train } })}
                  >
                    Book Now
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Bookticket;
