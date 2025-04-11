const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "railway_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 🔍 Search Trains
router.get("/search", async (req, res) => {
  const { departure, arrival, date } = req.query;

  if (!departure || !arrival || !date) {
    return res.status(400).json({ error: "Missing search parameters" });
  }

  try {
    const [depCodeResult] = await pool.query(
      `SELECT code FROM Stations WHERE name = ? OR code = ? LIMIT 1`,
      [departure, departure]
    );
    const [arrCodeResult] = await pool.query(
      `SELECT code FROM Stations WHERE name = ? OR code = ? LIMIT 1`,
      [arrival, arrival]
    );

    if (depCodeResult.length === 0 || arrCodeResult.length === 0) {
      return res.status(404).json({ error: "Invalid station name or code" });
    }

    const depCode = depCodeResult[0].code;
    const arrCode = arrCodeResult[0].code;

    const [results] = await pool.query(
      `SELECT * FROM Trains WHERE Departure = ? AND Arrival = ? AND Date = ?`,
      [depCode, arrCode, date]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "No trains found for the selected route and date." });
    }

    res.json({ success: true, trains: results });
  } catch (err) {
    console.error("❌ Train Search Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ➕ Add Train
router.post("/add", async (req, res) => {
  let connection;

  try {
    const {
      trainName,
      trainNumber,
      departure,
      arrival,
      date,
      startTime,
      totalSeats,
      routeDetails,
      runsOn
    } = req.body;

    connection = await pool.getConnection();

    // 1. Insert into `Trains` table
    const [trainResult] = await connection.query(
      "INSERT INTO trains (TrainName, TrainNumber, Departure, Arrival, Date, StartTime, TotalSeats, runs_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        trainName,
        trainNumber,
        departure,
        arrival,
        date,
        startTime,
        totalSeats,
        runsOn.join(",") // e.g., "Mon,Tue,Wed"
      ]
    );

    const trainID = trainResult.insertId;

    // 2. Insert each route stop into `routes` table
    for (const stop of routeDetails) {
      await connection.query(
        `INSERT INTO routes 
          (TrainID, CurrentStation, TimefromStart, RemainingSeats, CurrentDate, NextStation) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          trainID,
          stop.station,
          stop.timeFromStart,
          totalSeats,
          date,
          stop.nextStation || null
        ]
      );
    }

    res.status(200).json({ message: "✅ Train and route added successfully." });
  } catch (err) {
    console.error("❌ Error adding train:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
