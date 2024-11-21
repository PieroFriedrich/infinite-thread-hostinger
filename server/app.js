// app.js
const express = require("express");
const bodyParser = require("body-parser");
const { pool, initializeDatabase } = require("./db/sql"); // Import from db/sql.js

const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-username"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware to check if user is authenticated
const authenticateUser = async (req, res, next) => {
  const username = req.headers["x-username"];

  if (!username) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Check if user exists, create if not
    const [users] = await pool.execute(
      "INSERT IGNORE INTO users (username) VALUES (?)",
      [username]
    );

    req.username = username;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Fetch all tags
app.get("/tags", async (req, res) => {
  try {
    const [tags] = await pool.execute("SELECT * FROM tags ORDER BY name ASC");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Fetching tags error:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const [posts] = await pool.execute(`
      SELECT p.id, p.title, p.author, p.details, p.created_at, 
             GROUP_CONCAT(t.name) AS tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Fetching posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Route to create a new post
app.post("/posts", authenticateUser, async (req, res) => {
  const { title, details, tags } = req.body;
  const username = req.username;

  if (!title || !details) {
    return res.status(400).json({ error: "Title and details are required" });
  }

  try {
    // Insert the post
    const [result] = await pool.execute(
      "INSERT INTO posts (title, author, details, created_at) VALUES (?, ?, ?, NOW())",
      [title, username, details]
    );

    const postId = result.insertId;

    // Insert tags into post_tags table (many-to-many relationship)
    if (tags && tags.length > 0) {
      const tagValues = tags.map((tagId) => [postId, tagId]);
      await pool.query("INSERT INTO post_tags (post_id, tag_id) VALUES ?", [
        tagValues,
      ]);
    }

    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDatabase(); // Initialize the database
});

module.exports = app;
