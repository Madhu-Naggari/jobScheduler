const mysql = require("mysql2/promise");

let pool;

async function connectDB() {
  try {
    if (pool) return pool; // prevent re-creation

    const isProduction = process.env.NODE_ENV === "production";

    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: isProduction
        ? { rejectUnauthorized: true } // Railway internal
        : { rejectUnauthorized: false }, // Railway public (local)
    });

    // Test connection
    await pool.query("SELECT 1");

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        taskName VARCHAR(255) NOT NULL,
        payload TEXT,
        priority VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        completedAt TIMESTAMP NULL DEFAULT NULL,
        userId INT NOT NULL,
        CONSTRAINT fk_jobs_user
          FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    console.log("✅ MySQL connected & tables ensured");
    return pool;
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    throw error;
  }
}

function getDB() {
  if (!pool) {
    throw new Error("❌ DB not initialized. Call connectDB() first.");
  }
  return pool;
}

module.exports = { connectDB, getDB };
