// config/connectdb.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT = 3306
} = process.env;

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 2000;
let pool;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(retries = MAX_RETRIES) {
  while (retries) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD || "",
        database: DB_NAME,
        port: DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4" // ✅ Fix cesu8 errors
      });

      const conn = await pool.getConnection();
      console.log("✅ MySQL Database Connected Successfully");
      conn.release();
      break;
    } catch (err) {
      console.error(`❌ MySQL connection failed: ${err.message}`);
      retries--;
      if (!retries) {
        console.error("❌ All connection retries failed. Exiting.");
        process.exit(1);
      }
      console.log(`🔁 Retrying... (${MAX_RETRIES - retries}/${MAX_RETRIES})`);
      await wait(RETRY_DELAY_MS);
    }
  }
}

// ✅ Prevent DB connection when running Jest
if (process.env.NODE_ENV !== "test") {
  (async () => {
    await connectWithRetry();
  })();
}

export default pool;
