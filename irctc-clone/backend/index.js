require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const trainRoutes = require("./routes/trainRoutes"); // ✅ Only once

const app = express();

// ✅ Validate Required Env Variables
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env file!");
  process.exit(1);
}

// ✅ Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// ✅ MySQL Pool Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "railway_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test MySQL Connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database Connected Successfully!");
    connection.release();
  } catch (err) {
    console.error("🚨 Database Connection Failed:", err.message);
    process.exit(1);
  }
})();

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// ✅ Root Route
app.get("/", (req, res) => res.json({ message: "🚀 Railway Reservation System API is running!" }));

// ✅ Use trainRoutes FIRST before other endpoints under /api/trains
app.use("/api/trains", trainRoutes);

// ✅ Register User
app.post("/api/user/register", async (req, res) => {
  const { fname, lname, email, contactNo, password } = req.body;

  try {
    const [existingUser] = await db.query("SELECT * FROM Users WHERE ContactNo = ?", [contactNo]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Contact number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      "INSERT INTO Users (FirstName, LastName, Email, ContactNo, Password, Role) VALUES (?, ?, ?, ?, ?, 'user')",
      [fname, lname, email, contactNo, hashedPassword]
    );

    res.status(201).json({ created: true });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// ✅ Login User
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM Users WHERE Email = ?", [email]);

    if (!user || user.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user[0].Password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user[0].UserID, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token, userId: user[0].UserID, role: "user" });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ success: false, message: "Unexpected server error" });
  }
});

// ✅ Get Stations
app.get("/api/stations", async (req, res) => {
  try {
    const [results] = await db.query("SELECT name FROM stations");
    const stationNames = results.map(row => row.name);
    res.json({ stations: stationNames });
  } catch (err) {
    console.error("❌ Error fetching stations:", err.message);
    res.status(500).json({ error: "Failed to fetch stations" });
  }
});

// ✅ Ticket Booking
app.post("/api/bookings", async (req, res) => {
  const {
    userId,
    routeId,
    trainId,
    sourceStation,
    destinationStation,
    price,
    email,
    contactNo,
    passengers
  } = req.body;

  try {
    const [ticketResult] = await db.query(
      `INSERT INTO Tickets (UserID, RouteID, TrainID, SourceStation, DestinationStation, Price, Email, ContactNo, NoOfPassenger) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, routeId, trainId, sourceStation, destinationStation, price, email, contactNo, passengers.length]
    );

    const ticketId = ticketResult.insertId;

    for (const passenger of passengers) {
      await db.query(
        `INSERT INTO Passengers (TicketID, Name, Age, Gender) VALUES (?, ?, ?, ?)`,
        [ticketId, passenger.name, passenger.age, passenger.gender]
      );
    }

    res.status(201).json({ created: true, ticketId });
  } catch (error) {
    console.error("❌ Booking Error:", error.message);
    res.status(500).json({ created: false, error: "Unexpected server error" });
  }
});

// ✅ Add New Train
// ✅ Add New Train with runsOn support
app.post("/api/trains/add", async (req, res) => {
  const {
    trainName,
    trainNumber,
    departureName,
    departureCode,
    arrivalName,
    arrivalCode,
    date,
    startTime,
    totalSeats,
    runsOn
  } = req.body;

  try {
    // Step 1: Insert Departure Station if not exists
    await db.query(
      `INSERT IGNORE INTO Stations (name, code) VALUES (?, ?)`,
      [departureName, departureCode]
    );

    // Step 2: Insert Arrival Station if not exists
    await db.query(
      `INSERT IGNORE INTO Stations (name, code) VALUES (?, ?)`,
      [arrivalName, arrivalCode]
    );

    // Step 3: Add Train
    const [result] = await db.query(
      `INSERT INTO Trains 
      (TrainName, TrainNumber, Departure, Arrival, Date, StartTime, TotalSeats, RunsOn) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trainName,
        trainNumber,
        departureCode,
        arrivalCode,
        date,
        startTime,
        totalSeats,
        runsOn
      ]
    );

    res.status(201).json({
      success: true,
      message: "Train and station data added successfully!",
      trainId: result.insertId
    });
  } catch (error) {
    console.error("❌ Error adding train:", error);
    res.status(500).json({
      success: false,
      message: "Unexpected server error.",
      error: error.message
    });
  }
});
app.post("/api/trains/add", async (req, res) => {
  const {
    trainName,
    trainNumber,
    departureName,
    departureCode,
    arrivalName,
    arrivalCode,
    date,
    startTime,
    totalSeats,
    runsOn // Array like ['Mon', 'Tue']
  } = req.body;

  try {
    // Insert stations if not already present
    await db.query(`INSERT IGNORE INTO Stations (name, code) VALUES (?, ?)`, [departureName, departureCode]);
    await db.query(`INSERT IGNORE INTO Stations (name, code) VALUES (?, ?)`, [arrivalName, arrivalCode]);

    // Convert runsOn array to a comma-separated string
    const runsOnString = runsOn.join(','); // "Mon,Tue,Wed"

    // Insert train
    const [result] = await db.query(
      `INSERT INTO Trains 
      (TrainName, TrainNumber, Departure, Arrival, Date, StartTime, TotalSeats, RunsOn) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [trainName, trainNumber, departureCode, arrivalCode, date, startTime, totalSeats, runsOnString]
    );

    res.status(201).json({
      success: true,
      message: "Train and station data added successfully!",
      trainId: result.insertId
    });
  } catch (error) {
    console.error("❌ Error adding train:", error);
    res.status(500).json({
      success: false,
      message: "Unexpected server error.",
      error: error.message
    });
  }
});

app.get('/api/search-trains', async (req, res) => {
  const { departure, arrival } = req.query;

  try {
    const [fromStation] = await db.query('SELECT code FROM Stations WHERE name = ?', [departure]);
    const [toStation] = await db.query('SELECT code FROM Stations WHERE name = ?', [arrival]);

    if (fromStation.length === 0 || toStation.length === 0) {
      return res.status(404).json({ message: 'Station not found' });
    }

    const fromCode = fromStation[0].code;
    const toCode = toStation[0].code;

    const [trains] = await db.query(
      'SELECT * FROM Trains WHERE Departure = ? AND Arrival = ?',
      [fromCode, toCode]
    );

    res.json(trains);
  } catch (error) {
    console.error("❌ Error searching trains:", error.message);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
