const express = require("express");
const bodyParser = require("body-parser");
const { pool, initializeDatabase } = require("./db/sql");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-username"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.post("/users", async (req, res) => {
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
      SELECT p.id, p.title, u.full_name AS author, p.details, p.created_at, 
             GROUP_CONCAT(t.name) AS tags
      FROM posts p
      LEFT JOIN users u ON p.author = u.email  /* Assuming author is the email in posts table */
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
    await connection.beginTransaction();

    const [postResult] = await connection.execute(
      "INSERT INTO posts (title, author, details, created_at) VALUES (?, ?, ?, NOW())",
      [title, username, details]
    );

    const postId = postResult.insertId;

    if (tags && tags.length > 0) {
      const tagPromises = tags.map(async (tagName) => {
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

      const tagIds = await Promise.all(tagPromises);

      if (tagIds.length > 0) {
        const tagAssociations = tagIds.map((tagId) => [postId, tagId]);
        await connection.query(
          "INSERT INTO post_tags (post_id, tag_id) VALUES ?",
          [tagAssociations]
        );
      }
    }

    await connection.commit();

    res.status(201).json({
      message: "Post created successfully",
      postId: postId,
      tags: tags,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Post creation error:", error);
    res.status(500).json({ error: "Failed to create post" });
  } finally {
    connection.release();
  }
});

app.get("/posts/tag/:tagId", async (req, res) => {
  const { tagId } = req.params;

  try {
    const [posts] = await pool.execute(
      `
      SELECT p.id, p.title, u.full_name AS author, p.details, p.created_at, 
             GROUP_CONCAT(t.name) AS tags
      FROM posts p
      LEFT JOIN users u ON p.author = u.email
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE pt.tag_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      [tagId]
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Fetching posts by tag error:", error);
    res.status(500).json({ error: "Failed to fetch posts by tag" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDatabase();
});

module.exports = app;
