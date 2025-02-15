const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL (Existing Database)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: " + err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

// 📌 Handle Form Submission (Insert Data into Existing Table)
app.post("/submit", (req, res) => {
  const { name, email, password } = req.body;

  // Basic Form Validation
  if (!name || name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // ✅ Insert into Existing Table (Change `users` to Your Table Name)
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "User registered successfully!" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
