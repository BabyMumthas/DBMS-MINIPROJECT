import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./files.css";

export default function AllTrain() {
  const columns = [
    { field: "trainid", headerName: "Train ID", width: 100 },
    { field: "sourcestation", headerName: "Source", width: 150 },
    { field: "destinationstation", headerName: "Destination", width: 130 },
    { field: "price", headerName: "Price", type: "number", width: 130 },
    { field: "noofpassenger", headerName: "No of Passengers", type: "number", width: 180 },
  ];

  const [rows, setRows] = useState([]);

  // ✅ Wrapped in useCallback to fix useEffect warning
  const getAllBookings = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5050/allBookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const res = await response.json();

      if (res.allBookingsData) {
        // Ensure unique "id" for each row
        const updatedRows = res.allBookingsData.map((item, index) => ({
          ...item,
          id: index,
        }));

        setRows(updatedRows);
      } else {
        console.error("No booking data found");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, []);

  // ✅ Added `getAllBookings` to dependency array to fix warning
  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  return (
    <div className="datagrid-containter">
      <br />
      <h1>All Bookings</h1>
      <br />
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={11}
          rowsPerPageOptions={[11]}
        />
      </div>
    </div>
  );
}
