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
// const authenticateUser = async (req, res, next) => {
//   const username = req.headers["x-username"];

//   if (!username) {
//     return res.status(401).json({ error: "Authentication required" });
//   }

//   try {
//     // Check if user exists, create if not
//     const [users] = await pool.execute(
//       "INSERT IGNORE INTO users (username) VALUES (?)",
//       [username]
//     );

//     req.username = username;
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// };

// Route to create a new user
app.post("/users", async (req, res) => {
  const { email, fullName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Insert the user if not exists
    const [result] = await pool.execute(
      "INSERT IGNORE INTO users (email, full_name) VALUES (?, ?)",
      [email, fullName]
    );

    if (result.affectedRows === 0) {
      // User already exists
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
// app.post("/posts", authenticateUser, async (req, res) => {
app.post("/posts", async (req, res) => {
  const { title, details, tags = [] } = req.body;
  const username = req.headers["x-username"];

  if (!title || !details) {
    return res.status(400).json({ error: "Title and details are required" });
  }

  if (!username) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const connection = await pool.getConnection();

  try {
    // Start a transaction to ensure data consistency
    await connection.beginTransaction();

    // Insert the post
    const [postResult] = await connection.execute(
      "INSERT INTO posts (title, author, details, created_at) VALUES (?, ?, ?, NOW())",
      [title, username, details]
    );

    const postId = postResult.insertId;

    // If tags are provided, process them
    if (tags && tags.length > 0) {
      // Find existing tag IDs, create new tags if they don't exist
      const tagPromises = tags.map(async (tagName) => {
        // First, try to find the existing tag
        const [existingTag] = await connection.execute(
          "SELECT id FROM tags WHERE name = ?",
          [tagName]
        );

        if (existingTag.length > 0) {
          return existingTag[0].id;
        } else {
          // If tag doesn't exist, insert it
          const [newTagResult] = await connection.execute(
            "INSERT INTO tags (name) VALUES (?)",
            [tagName]
          );
          return newTagResult.insertId;
        }
      });

      // Resolve all tag promises
      const tagIds = await Promise.all(tagPromises);

      // Insert associations into post_tags
      if (tagIds.length > 0) {
        const tagAssociations = tagIds.map((tagId) => [postId, tagId]);
        await connection.query(
          "INSERT INTO post_tags (post_id, tag_id) VALUES ?",
          [tagAssociations]
        );
      }
    }

    // Commit the transaction
    await connection.commit();

    res.status(201).json({
      message: "Post created successfully",
      postId: postId,
      tags: tags,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await connection.rollback();
    console.error("Post creation error:", error);
    res.status(500).json({ error: "Failed to create post" });
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDatabase(); // Initialize the database
});

module.exports = app;
