const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllJobsData,
  createNewJob,
  getJobDetails,
  runJob,
  getUserInfo,
} = require("../controllers/controller");
const authenticateUser = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticateUser, getUserInfo);
router.get("/jobs", authenticateUser, getAllJobsData);
router.post("/jobs", authenticateUser, createNewJob);
router.get("/jobs/:id", authenticateUser, getJobDetails);
router.post("/run-job/:id", authenticateUser, runJob);

module.exports = router;
