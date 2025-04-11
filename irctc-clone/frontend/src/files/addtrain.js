import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./addtrain.css";

function AddTrain() {
  const [trainDetails, setTrainDetails] = useState({
    trainName: "",
    trainNumber: "",
    departure: "",
    arrival: "",
    date: "",
    startTime: "",
    totalSeats: "",
    runson: [],
  });

  const [routeFields, setRouteFields] = useState([{ station: "", timeFromStart: "" }]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleChange = (e) => {
    setTrainDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRouteChange = (e, index) => {
    const updatedRoutes = [...routeFields];
    updatedRoutes[index][e.target.name] = e.target.value;
    setRouteFields(updatedRoutes);
  };

  const addFields = () => {
    setRouteFields([...routeFields, { station: "", timeFromStart: "" }]);
  };

  const removeFields = (index) => {
    const updatedRoutes = [...routeFields];
    updatedRoutes.splice(index, 1);
    setRouteFields(updatedRoutes);
  };

  const handleCheckboxChange = (day) => {
    setTrainDetails((prev) => ({
      ...prev,
      runson: prev.runson.includes(day)
        ? prev.runson.filter((d) => d !== day)
        : [...prev.runson, day],
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
  
    if (!trainDetails.trainName || !trainDetails.trainNumber || !trainDetails.departure || !trainDetails.arrival) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/trains/add", {
        trainName: trainDetails.trainName,
        trainNumber: trainDetails.trainNumber,
        departure: trainDetails.departure,
        arrival: trainDetails.arrival,
        date: trainDetails.date,
        startTime: trainDetails.startTime,
        totalSeats: Number(trainDetails.totalSeats),
        routeDetails: routeFields,
        runsOn: trainDetails.runson
      });
  
      alert(response.data.message || "Train added successfully!");
  
      // Reset fields
      setTrainDetails({
        trainName: "",
        trainNumber: "",
        departure: "",
        arrival: "",
        date: "",
        startTime: "",
        totalSeats: "",
        runson: [],
      });
  
      setRouteFields([{ station: "", timeFromStart: "" }]);
    } catch (error) {
      console.error("Error adding train:", error);
      alert("Failed to add train.");
    }
  };
  
  return (
    <div className="add-train">
      <form onSubmit={submitForm}>
        <h2>Add Train</h2>
        <div className="train-details">
          <TextField required name="trainName" label="Train Name" value={trainDetails.trainName} onChange={handleChange} />
          <TextField required name="trainNumber" label="Train Number" type="number" value={trainDetails.trainNumber} onChange={handleChange} />
          <TextField required name="departure" label="Departure City" value={trainDetails.departure} onChange={handleChange} />
          <TextField required name="arrival" label="Arrival City" value={trainDetails.arrival} onChange={handleChange} />
          <TextField required type="date" name="date" value={trainDetails.date} onChange={handleChange} />
          <TextField required type="time" name="startTime" label="Start Time" value={trainDetails.startTime} onChange={handleChange} />
          <TextField required type="number" name="totalSeats" label="Total Seats" value={trainDetails.totalSeats} onChange={handleChange} />

          <div className="runs-on">
            <h4>Runs On:</h4>
            {daysOfWeek.map((day) => (
              <FormControlLabel
                key={day}
                control={<Checkbox checked={trainDetails.runson.includes(day)} onChange={() => handleCheckboxChange(day)} />}
                label={day}
              />
            ))}
          </div>
        </div>

        <h2>Route Details</h2>
        <div className="route-details">
          {routeFields.map((route, index) => (
            <div key={index} className="route-form-repeat">
              <TextField required name="station" label="Station Name" value={route.station} onChange={(e) => handleRouteChange(e, index)} />
              <TextField required type="number" name="timeFromStart" label="Time From Start (mins)" value={route.timeFromStart} onChange={(e) => handleRouteChange(e, index)} />
              <Button color="warning" variant="contained" onClick={() => removeFields(index)}>
                Remove Station
              </Button>
            </div>
          ))}
          <Button sx={{ backgroundColor: "#4CAF50" }} type="button" variant="contained" onClick={addFields}>
            Add Station
          </Button>
        </div>

        <Button sx={{ backgroundColor: "#4CAF50" }} type="submit" variant="contained">
          Add Train and Route
        </Button>
      </form>
    </div>
  );
}

export default AddTrain;
