const express = require("express");
const { pool } = require("../db/sql");

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const [posts] = await pool.execute(`
      SELECT p.id, p.title, p.image_url, u.full_name AS author, p.details, p.created_at, 
             GROUP_CONCAT(t.name) AS tags
      FROM posts p
      LEFT JOIN users u ON p.author = u.email
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

// Create a new post
router.post("/", async (req, res) => {
  const { title, details, tags = [], imageUrl } = req.body;
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

    // Include image_url in the post insertion if an imageUrl is provided
    const [postResult] = await connection.execute(
      imageUrl
        ? "INSERT INTO posts (title, author, details, image_url, created_at) VALUES (?, ?, ?, ?, NOW())"
        : "INSERT INTO posts (title, author, details, created_at) VALUES (?, ?, ?, NOW())",
      imageUrl
        ? [title, username, details, imageUrl]
        : [title, username, details]
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

// Get a single post by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [post] = await pool.execute(
      `SELECT p.id, p.title, u.full_name AS author, p.details, p.image_url, p.created_at, 
              GROUP_CONCAT(t.name) AS tags
       FROM posts p
       LEFT JOIN users u ON p.author = u.email
       LEFT JOIN post_tags pt ON p.id = pt.post_id
       LEFT JOIN tags t ON pt.tag_id = t.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );

    if (post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post[0]); // Send back the first post (since the query only returns one)
  } catch (error) {
    console.error("Fetching post error:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Get posts by tag
router.get("/tag/:tagId", async (req, res) => {
  const { tagId } = req.params;
  const { additionalTagIds } = req.query;

  try {
    let query = `
      SELECT p.id, p.title, u.full_name AS author, p.details, p.created_at, 
             GROUP_CONCAT(DISTINCT t.name) AS tags
      FROM posts p
      LEFT JOIN users u ON p.author = u.email
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE 1=1
    `;

    const queryParams = [];

    // Always include the primary tag
    query += ` AND p.id IN (
      SELECT post_id 
      FROM post_tags 
      WHERE tag_id = ?
    )`;
    queryParams.push(tagId);

    // If additional tags are provided, add them to the filtering
    if (additionalTagIds) {
      const additionalTagArray = additionalTagIds
        .split(",")
        .map((id) => parseInt(id.trim()));
      query += ` AND p.id IN (
        SELECT post_id 
        FROM post_tags 
        WHERE tag_id IN (?)
        GROUP BY post_id
        HAVING COUNT(DISTINCT tag_id) = ?
      )`;
      queryParams.push(additionalTagArray, additionalTagArray.length + 1);
    }

    query += `
      GROUP BY p.id, p.title, u.full_name, p.details, p.created_at
      ORDER BY p.created_at DESC
    `;

    const [posts] = await pool.execute(query, queryParams);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Fetching posts by tag error:", error);
    res.status(500).json({ error: "Failed to fetch posts by tag" });
  }
});

// Get comments for a specific post
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const [comments] = await pool.execute(
      "SELECT c.id, c.text, c.created_at, u.full_name AS author FROM comments c " +
        "LEFT JOIN users u ON c.author = u.email WHERE c.post_id = ? ORDER BY c.created_at DESC",
      [postId]
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a comment to a post
router.post("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { author, text } = req.body;

  try {
    // Validate the author exists in the users table
    const [userResult] = await pool.execute(
      "SELECT email FROM users WHERE email = ?",
      [author]
    );
    if (userResult.length === 0) {
      return res.status(400).json({ error: "Author does not exist" });
    }

    // Validate the post exists in the posts table
    const [postResult] = await pool.execute(
      "SELECT id FROM posts WHERE id = ?",
      [postId]
    );
    if (postResult.length === 0) {
      return res.status(400).json({ error: "Post does not exist" });
    }

    // Insert the comment
    await pool.execute(
      "INSERT INTO comments (post_id, author, text, created_at) VALUES (?, ?, ?, NOW())",
      [postId, author, text]
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: GET /posts/:postId/comments/count
router.get("/:postId/comments/count", async (req, res) => {
  const { postId } = req.params;

  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) AS commentCount FROM comments WHERE post_id = ?",
      [postId]
    );

    res.status(200).json({ commentCount: result[0].commentCount });
  } catch (error) {
    console.error("Error fetching comment count:", error);
    res.status(500).json({ error: "Failed to fetch comment count" });
  }
});

module.exports = router;
