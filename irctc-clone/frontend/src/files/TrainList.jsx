import React, { useEffect, useState } from "react";

function TrainList() {
    const [trains, setTrains] = useState([]);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/trains");
                const data = await response.json();
                setTrains(data);
            } catch (error) {
                console.error("Error fetching train data:", error);
            }
        };

        fetchTrains();
    }, []);

    return (
        <div>
            <h1>Train List</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Train ID</th>
                        <th>Train Name</th>
                        <th>Runs On</th>
                        <th>Total Seats</th>
                        <th>Start Time</th>
                    </tr>
                </thead>
                <tbody>
                    {trains.map((train) => (
                        <tr key={train.TrainID}>
                            <td>{train.TrainID}</td>
                            <td>{train.TrainName}</td>
                            <td>{train.RunsOn}</td>
                            <td>{train.TotalSeats}</td>
                            <td>{train.StartTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TrainList;
