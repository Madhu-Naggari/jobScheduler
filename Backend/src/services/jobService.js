const { getDB } = require("../db");

async function createUser(user) {
  const db = getDB();

  const [result] = await db.execute(
    `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
    `,
    [user.name ?? null, user.email ?? null, user.password ?? null]
  );

  return {
    id: result.insertId,
    name: user.name,
    email: user.email,
  };
}

async function isValidUser(email) {
  const db = getDB();
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);
  return rows[0];
}

async function insertJob(job) {
  const db = getDB();
  const [result] = await db.execute(
    `
    INSERT INTO jobs (taskName, payload, priority, status, userId)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      job.taskName,
      JSON.stringify(job.payload || {}),
      job.priority,
      job.status,
      job.userId,
    ]
  );

  return { id: result.insertId, ...job };
}

async function markAsRunning(jobId) {
  const db = getDB();

  const [result] = await db.execute(
    `
    UPDATE jobs
    SET status = 'running'
    WHERE id = ? AND status = 'pending'
    `,
    [jobId]
  );

  return result.affectedRows === 1;
}

async function markAsCompleted(jobId) {
  const db = getDB();

  await db.execute(
    `
    UPDATE jobs
    SET status = 'completed', completedAt = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [jobId]
  );

  const [rows] = await db.execute(`SELECT * FROM jobs WHERE id = ?`, [jobId]);

  return rows[0];
}

async function jobDetails(jobId) {
  const db = getDB();
  const [result] = await db.execute(
    `
    SELECT * FROM jobs WHERE id = ?
    `,
    [jobId]
  );
  return result;
}

const getAllJobs = async ({ status, priority }) => {
  const db = getDB();

  let query = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  if (status) {
    query += " AND status = ?";
    params.push(status);
  }

  if (priority) {
    query += " AND priority = ?";
    params.push(priority);
  }

  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  createUser,
  isValidUser,
  insertJob,
  markAsRunning,
  markAsCompleted,
  getAllJobs,
  jobDetails,
};
