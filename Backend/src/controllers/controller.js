const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  isValidUser,
  getAllJobs,
  insertJob,
  jobDetails,
} = require("../services/jobService");
const { markAsRunning } = require("../services/jobService");
const { executeJob } = require("../workers/jobWorker");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if ((!name, !email, !password))
    return res.status(401).send({ message: "all fields are required!" });
  const isAlreadyUser = await isValidUser(email);
  if (isAlreadyUser)
    return res.status(401).send({ message: "user already exist with us" });
  const hashPassword = await bcrypt.hash(password, 10);
  const userDetails = {
    name,
    email,
    password: hashPassword,
  };
  const createNewUser = await createUser(userDetails);
  res.send(createNewUser);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password))
    return res.status(401).send({ message: "all fields are required" });
  const isUser = await isValidUser(email);
  if (!isUser)
    return res.status(401).send({ message: "user not found with us" });
  const isPassword = await bcrypt.compare(password, isUser.password);
  if (!isPassword)
    return res.status(401).send({ message: "user credientals invalid" });
  const payload = {
    id: isUser.id,
    name: isUser.name,
    email: isUser.email,
  };
  console.log(isUser);
  const token = jwt.sign(payload, process.env.MY_TOKEN);
  res.send({ token });
};

const getAllJobsData = async (req, res) => {
  let { status, priority } = req.query;

  status = status?.toLowerCase();
  priority = priority?.toLowerCase();
  try {
    const allJobs = await getAllJobs({ status, priority });
    res.send(allJobs);
  } catch (err) {
    res.send("something went wrong", err);
  }
};

const createNewJob = async (req, res) => {
  try {
    const { taskName, priority, status = "pending" } = req.body;

    // Validation
    if (!taskName || !priority) {
      return res.status(404).json({
        message: "taskName and priority are required",
      });
    }

    if (!req.id || !req.email) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log(req.id);

    const newJobObj = {
      taskName,
      payload: {
        email: req.email,
      },
      priority,
      status,
      userId: req.id,
    };

    await insertJob(newJobObj);

    return res.status(201).json({
      message: "Job created successfully",
    });
  } catch (err) {
    console.error("Create Job Error:", err);

    return res.status(500).json({
      message: "Something went wrong while creating job",
    });
  }
};

const getJobDetails = async (req, res) => {
  const jobId = req.params.id;

  try {
    const getJobData = await jobDetails(jobId);
    res.send(getJobData);
  } catch (err) {
    res.send("something went wrong", err);
  }
};

async function runJob(req, res) {
  const jobId = req.params.id;

  const started = await markAsRunning(jobId);

  if (!started) {
    return res
      .status(400)
      .json({ message: "Job already running or completed" });
  }
  executeJob(jobId);
  res.json({ message: "Job started", status: "running" });
}
async function getUserInfo(req, res) {
  const userDetails = {
    id: req.id,
    name: req.name,
    email: req.email,
  };
  res.send(userDetails);
}

module.exports = {
  registerUser,
  loginUser,
  getAllJobsData,
  createNewJob,
  getJobDetails,
  runJob,
  getUserInfo,
};
