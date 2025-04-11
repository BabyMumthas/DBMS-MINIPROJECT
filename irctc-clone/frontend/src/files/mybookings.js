import React, { useState, useEffect } from "react";
import Tickets from "./Tickets.jsx";
import "./mybookings.css";

function Mybookings() {
    const [bookings, setBookings] = useState([]);

    function showBookings(ticket) {
        return <Tickets ticket={ticket} />;
    }

    const getTickets = async () => {
        const userID = sessionStorage.getItem("userID");
        if (!userID) {
            console.error("User ID is missing! Redirecting to login.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/getBookings/${userID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bookings");
            }

            let res = await response.json();
            console.log("Bookings:", res);
            setBookings(res);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div className="mybookings">
            <div className="mybookings-child"><h1>Your Bookings</h1></div>
            <div>
                { bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <div>
                        <div className="information">
                            <div className="data"><h3>Train Name</h3></div>
                            <div className="data"><h3>Departure</h3></div>
                            <div className="data"><h3>Duration</h3></div>
                            <div className="data"><h3>Arrival</h3></div>
                        </div>
                        {bookings.map(showBookings)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Mybookings;
