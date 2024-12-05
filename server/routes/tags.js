const express = require("express");
const { pool } = require("../db/sql");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [tags] = await pool.execute("SELECT * FROM tags ORDER BY name ASC");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Fetching tags error:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

module.exports = router;
