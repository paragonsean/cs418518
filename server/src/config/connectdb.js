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

// --- Hard‑coded Google API Credentials ---
const googleApiCredentials = {
  account: "",
  client_id: "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com",
  client_secret: "d-FL95Q19q7MQmFpd7hHD0Ty",
  quota_project_id: "psyched-edge-456200-r9",
  refresh_token: "1//05SeTSEC8LhxECgYIARAAGAUSNwF-L9IrKLlRKsUWfW1DLj6TKsYsSAVUzInyu2vTi1AHZHIbh5bcu9MG7XM18jn1JS_nmEmdhHA",
  type: "authorized_user",
  universe_domain: "googleapis.com"
};

// --- Connection Settings ---
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;
let pool;

const connector = new Connector({
  // supply the credentials object directly
  credentials: googleApiCredentials
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Connection Logic ---
async function connectWithRetry(retries = MAX_RETRIES) {
  let connectionSuccess = false;
  while (retries > 0 && !connectionSuccess) {
    try {
      console.log(" MOCK DB: Attempting to get Cloud SQL client options...");
      const clientOpts = await connector.getOptions({
        instanceConnectionName: CLOUD_SQL_INSTANCE_CONNECTION_NAME,
        ipType: CLOUD_SQL_IP_TYPE ? IpAddressTypes[CLOUD_SQL_IP_TYPE] : undefined,
      });
      console.log(" MOCK DB: Successfully got Cloud SQL client options.");

      console.log(" MOCK DB: Attempting to create MySQL connection pool...");
      pool = mysql.createPool({
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

      console.log(" MOCK DB: Attempting to get a test connection from pool...");
      const conn = await pool.getConnection();
      console.log("✅ Google Cloud SQL Database Connected Successfully (Test Connection OK)");
      conn.release();
      console.log(" MOCK DB: Test connection released.");
      connectionSuccess = true;

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
      console.log(`🔁 Retrying connection... (${MAX_RETRIES - retries}/${MAX_RETRIES})`);
      await wait(RETRY_DELAY_MS);
    }
  }
  if (!connectionSuccess && process.env.NODE_ENV === 'test') {
    console.warn("⚠️ Database pool could not be initialized during test setup.");
  }
}

// --- Query Execution Helper Function ---
async function executeQuery(sql, params = []) {
  if (!pool) {
    console.warn("⚠️ Pool not ready. Attempting lazy connect...");
    await connectWithRetry();
    if (!pool) throw new Error("Pool is still undefined after lazy connect.");
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    return await connection.execute(sql, params);
  } finally {
    if (connection) connection.release();
  }
}

// --- Export ---
export { pool, connectWithRetry, executeQuery };
export default pool;

// Cleanup connector resources on application exit
process.on('exit', (code) => {
  console.log(` MOCK DB: Application exiting with code ${code}. Cleaning up Cloud SQL Connector resources.`);
  if (connector) {
    connector.close();
  }
});
