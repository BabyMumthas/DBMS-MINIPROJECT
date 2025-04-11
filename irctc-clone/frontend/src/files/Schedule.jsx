// Updated Schedule.js
import React from "react";

const Schedule = ({ data }) => {
  return (
    <div>
      <h3>Train Schedule</h3>
      {data && data.map((station, index) => (
        <div key={index}>
          <p>Station: {station.station_name}</p>
          <p>Arrival: {station.arrival_time}</p>
          <p>Departure: {station.departure_time}</p>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
