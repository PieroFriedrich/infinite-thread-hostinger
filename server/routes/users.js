const express = require("express");
const { pool } = require("../db/sql");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, fullName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT IGNORE INTO users (email, full_name) VALUES (?, ?)",
      [email, fullName]
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: "User already exists" });
    }

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
