// config/connectdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { Connector, IpAddressTypes } from "@google-cloud/cloud-sql-connector";

dotenv.config();

// --- Environment Variables ---
const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  CLOUD_SQL_INSTANCE_CONNECTION_NAME, // Required for Cloud SQL Connector
  CLOUD_SQL_IP_TYPE // Optional ('PUBLIC', 'PRIVATE', 'PSC')
} = process.env;

// --- Validation ---
if (!DB_USER || !DB_NAME || !CLOUD_SQL_INSTANCE_CONNECTION_NAME) {
  console.error(
    "❌ Missing required environment variables: DB_USER, DB_NAME, CLOUD_SQL_INSTANCE_CONNECTION_NAME"
  );
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
}

// --- Connection Settings ---
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;
let pool; // Declared here, assigned asynchronously by connectWithRetry

const connector = new Connector();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Connection Logic ---
// This function initializes the 'pool' variable
async function connectWithRetry(retries = MAX_RETRIES) {
  let connectionSuccess = false;
  while (retries > 0 && !connectionSuccess) {
    try {
      // Get Cloud SQL connection options from the Connector
      console.log(" MOCK DB: Attempting to get Cloud SQL client options...");
      const clientOpts = await connector.getOptions({
        instanceConnectionName: CLOUD_SQL_INSTANCE_CONNECTION_NAME,
        ipType: CLOUD_SQL_IP_TYPE ? IpAddressTypes[CLOUD_SQL_IP_TYPE] : undefined,
      });
      console.log(" MOCK DB: Successfully got Cloud SQL client options.");

      // Create the pool using Connector options and other settings
      console.log(" MOCK DB: Attempting to create MySQL connection pool...");
      pool = mysql.createPool({ // Assign to the outer 'pool' variable
        ...clientOpts,
        user: DB_USER,
        password: DB_PASSWORD || "",
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4",
      });
      console.log(" MOCK DB: MySQL connection pool created.");

      // Test the connection
      console.log(" MOCK DB: Attempting to get a test connection from pool...");
      const conn = await pool.getConnection();
      console.log("✅ Google Cloud SQL Database Connected Successfully (Test Connection OK)");
      conn.release();
      console.log(" MOCK DB: Test connection released.");
      connectionSuccess = true; // Set flag to break loop

    } catch (err) {
      console.error(`❌ Google Cloud SQL connection failed: ${err.message}`);
      console.error(err.stack);
      retries--;
      if (!retries) {
        console.error("❌ All connection retries failed. Exiting.");
        if (process.env.NODE_ENV !== "test") {
           process.exit(1);
        } else {
           throw new Error("Database connection failed after multiple retries during test setup.");
        }
      }
      console.log( `🔁 Retrying connection... (${MAX_RETRIES - retries}/${MAX_RETRIES})`);
      await wait(RETRY_DELAY_MS);
    }
  }
   if (!connectionSuccess && process.env.NODE_ENV === 'test') {
      console.warn("⚠️ Database pool could not be initialized during test setup.");
   }
}

// --- Query Execution Helper Function ---
/**
 * Executes a SQL query using the connection pool.
 * Ensures the pool is initialized before attempting to query.
 * Handles connection acquisition and release.
 * @param {string} sql - The SQL query string (use ? for placeholders).
 * @param {Array} [params=[]] - Optional array of parameters for prepared statements.
 * @returns {Promise<Array>} A promise that resolves with the query results (e.g., [rows, fields]).
 * @throws {Error} If the pool is not initialized or if the query fails.
 */
async function executeQuery(sql, params = []) {
  if (!pool) {
    console.warn("⚠️ Pool not ready. Attempting lazy connect...");
    await connectWithRetry();
    if (!pool) throw new Error("Pool is still undefined after lazy connect.");
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    const results = await connection.execute(sql, params);
    return results;
  } finally {
    if (connection) connection.release();
  }
}



// --- Initialization ---
// REMOVED - Connection must be initiated explicitly by server.js

// --- Export ---
// Export the pool, the connection function, AND the query function using named exports.
// Keep default export temporarily if needed elsewhere, but named is preferred.
export { pool, connectWithRetry, executeQuery }; // Named exports
export default pool;                            // Default export (consider removing eventually)

// Cleanup connector resources on application exit
process.on('exit', (code) => {
   console.log(` MOCK DB: Application exiting with code ${code}. Cleaning up Cloud SQL Connector resources.`);
   if (connector) {
      connector.close();
   }
});
