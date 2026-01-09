// workers/jobWorker.js

const { markAsCompleted } = require("../services/jobService");

function executeJob(jobId) {
  setTimeout(async () => {
    const completedJob = await markAsCompleted(jobId);
    console.log("✅ Job completed:", completedJob.id);
  }, 3000);
}

module.exports = { executeJob };
