
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/images", require("./routes/images"));

app.get("/", (req, res) => {
  res.send("✅ Uploader API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
