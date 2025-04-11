require("dotenv").config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
    console.error("❌ Missing required environment variables.");
    process.exit(1); // Exit the process with an error code
}

const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

// ✅ Create a connection pool (NO imports from `index.js`)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,  // Timeout in milliseconds
    charset: 'utf8mb4',     // Recommended charset for MySQL
});

// ✅ Function to execute SQL queries
const executeQuery = async (query, params = []) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            console.log("🛠 Running Query:", query, "Params:", params);
        }
        const [results] = await pool.execute(query, params);
        if (process.env.NODE_ENV === 'development') {
            console.log("✅ Query Results:", results);
        }
        return results;
    } catch (err) {
        console.error("❌ MySQL Query Error:", err);
        throw err;
    }
};

// ✅ Function to rehash or create admin password
const rehashAdminPassword = async () => {
    try {
        const admin = await executeQuery("SELECT * FROM ADMINS WHERE AdminEmail = 'head@example.com'");
        if (admin.length === 0) {
            // Create the admin account if it doesn't exist
            const hashedPassword = await bcrypt.hash("admin123", 12);
            await executeQuery("INSERT INTO ADMINS (AdminEmail, Password) VALUES (?, ?)", ['head@example.com', hashedPassword]);
            console.log("✅ Admin account created successfully");
        } else {
            // Rehash the password for the existing admin account
            const hashedPassword = await bcrypt.hash("admin123", 12);
            await executeQuery("UPDATE ADMINS SET Password = ? WHERE AdminEmail = ?", [hashedPassword, 'head@example.com']);
            console.log("✅ Admin password rehashed successfully");
        }
    } catch (err) {
        console.error("❌ Error rehashing or creating admin password:", err.message || err);
    }
};

// Call the rehash function once during server startup
(async () => {
    await rehashAdminPassword();
})();

// ✅ Export `executeQuery` and `pool`
module.exports = { executeQuery, pool };
