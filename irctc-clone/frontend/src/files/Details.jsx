import React from "react";
import "./Details.css";
import Button from '@mui/material/Button';
import { createSearchParams, useNavigate } from "react-router-dom";

function Details(props) {
    const {
        TrainID, TrainName, RemainingSeats, DepartureStation, ArrivalTime, ArrivalDate,
        DestinationStation, DepartureTime, DepartureDate, RouteID, Price, DurationHours,
        DurationMinutes, RunsOn
    } = props;

    const months = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Jul",
        "08": "Aug", "09": "Sep", "10": "Nov", "11": "Dec", "12": "Dec"
    };

    const navigate = useNavigate();
    const bookTicket = () => {
        navigate({
            pathname: "/pd",
            search: createSearchParams({
                id: TrainID,
                remainingSeats: RemainingSeats,
                departure: DepartureStation,
                arrival: DestinationStation,
                routeId: RouteID,
                price: Price
            }).toString()
        });
    };

    return (
        <div className="trainDetails">
            <div>
                <div className="information">
                    <div className="box">
                        <h3>{TrainName}</h3>
                        <h3>{TrainID}</h3>
                        <h4 style={{ color: '#4CAF50' }}>{RemainingSeats} Left</h4>
                        <div style={{ display: 'flex', gap: 30 }}>
                            <Button onClick={bookTicket} variant="contained" className="Dbutton">Book</Button>
                            <h4 style={{ color: '#03A9F4' }}>₹{Price}</h4>
                        </div>
                    </div>
                    <div className="box">
                        <h3>{DepartureStation}</h3>
                        <h4>{DepartureTime}</h4>
                        <h4>{DepartureDate.slice(8, 10)} {months[DepartureDate.slice(5, 7)]}</h4>
                    </div>
                    <div className="box">
                        <h5>{DurationHours} Hrs {DurationMinutes} Mins</h5>
                        <h5>Runs On</h5>
                        <h5>{RunsOn}</h5>
                    </div>
                    <div className="box">
                        <h3>{DestinationStation}</h3>
                        <h4>{ArrivalTime}</h4>
                        <h4>{ArrivalDate.slice(8, 10)} {months[ArrivalDate.slice(5, 7)]}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;
