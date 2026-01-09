const express = require("express");
const { connectDB } = require("./db");
const router = require("./routes/route");
const cors = require("cors");
const app = express();
app.use(express.json());
require("dotenv").config();
app.use(cors());
app.use(router);
async function startServer() {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

startServer();
