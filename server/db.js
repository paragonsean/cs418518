// file: config/connectdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Create a single pool at startup
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Optional: test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" MySQL Database Connected Successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
})();

export default pool; //  Export the pool
