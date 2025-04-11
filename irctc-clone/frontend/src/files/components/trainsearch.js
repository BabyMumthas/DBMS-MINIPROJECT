import React, { useState, useEffect } from "react";
import "../files.css";
import "./trainsearch.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function Trainsearch() {
  const [searchParams, setSearchParams] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Fetch stations from backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stations");
        if (!response.ok) {
          throw new Error("Failed to fetch stations.");
        }
        const data = await response.json();
        setStations(data.stations || []);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to fetch stations.");
      }
    };

    fetchStations();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Submit search form
  const onSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSearched(false);

    const { departure, arrival, date } = searchParams;

    if (!departure || !arrival || !date) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/trains/search?departure=${encodeURIComponent(departure)}&arrival=${encodeURIComponent(arrival)}&date=${date}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const res = await response.json();
      if (!Array.isArray(res.trains) || res.trains.length === 0) {
        setError("No trains found for the selected route and date.");
        setTrains([]);
        setSearched(true);
        return;
      }

      setTrains(res.trains);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching trains:", err);
      setError("Failed to fetch train details. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainsearch">
      <div className="flex-child">
        <h2>Search Train</h2>
        <form onSubmit={onSubmitForm}>
          <div className="search-for-flex">
            <TextField
              required
              label="Departure Station"
              name="departure"
              value={searchParams.departure}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              required
              label="Arrival Station"
              name="arrival"
              value={searchParams.arrival}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              required
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "FIND"}
            </Button>
          </div>
        </form>
      </div>

      <div className="flex-child margin-10-10">
        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Loading trains...</p>
        ) : searched && trains.length === 0 ? (
          <p>No trains found for the selected route and date.</p>
        ) : searched && (
          <div>
            <h3>Available Trains</h3>
            <ul>
              {trains.map((train) => (
                <li key={train.TrainID}>
                  <strong>{train.TrainName}</strong> ({train.TrainID}) <br />
                  Runs On: {train.RunsOn} <br />
                  Total Seats: {train.TotalSeats} <br />
                  Start Time: {train.StartTime}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Trainsearch;
