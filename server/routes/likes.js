const express = require("express");
const { pool } = require("../db/sql");

const router = express.Router();

// Add a like
router.post("/", async (req, res) => {
  const { postId } = req.body;
  const userEmail = req.headers["x-username"];

  if (!postId || !userEmail) {
    return res
      .status(400)
      .json({ error: "Post ID and User Email are required" });
  }

  try {
    // Insert new like
    const [result] = await pool.execute(
      "INSERT INTO likes (user_email, post_id) VALUES (?, ?)",
      [userEmail, postId]
    );

    // Fetch updated like count
    const [likeCountResult] = await pool.execute(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?",
      [postId]
    );

    res.status(201).json({
      message: "Liked successfully",
      postId: postId,
      likeCount: likeCountResult[0].likeCount,
    });
  } catch (error) {
    console.error("Like creation error:", error);
    res.status(500).json({
      error: "Failed to like post",
      details: error.message,
    });
  }
});

// Remove a like
router.delete("/", async (req, res) => {
  const { postId } = req.body;
  const userEmail = req.headers["x-username"];

  if (!postId || !userEmail) {
    return res
      .status(400)
      .json({ error: "Post ID and User Email are required" });
  }

  try {
    // Delete the user's like for this specific post
    const [result] = await pool.execute(
      "DELETE FROM likes WHERE user_email = ? AND post_id = ?",
      [userEmail, postId]
    );

    // Fetch updated like count
    const [likeCountResult] = await pool.execute(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?",
      [postId]
    );

    res.status(200).json({
      message: "Unliked successfully",
      postId: postId,
      likeCount: likeCountResult[0].likeCount,
    });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({
      error: "Failed to unlike post",
      details: error.message,
    });
  }
});

// Get likes count for a post
router.get("/count/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const [result] = await pool.execute(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?",
      [postId]
    );

    res.status(200).json({
      postId: postId,
      likeCount: result[0].likeCount,
    });
  } catch (error) {
    console.error("Fetching likes count error:", error);
    res.status(500).json({ error: "Failed to fetch likes count" });
  }
});

// Check if a user has liked a post
router.get("/status", async (req, res) => {
  const postId = req.query.postId;
  const userEmail = req.headers["x-username"];

  if (!postId || !userEmail) {
    return res
      .status(400)
      .json({ error: "Post ID and User Email are required" });
  }

  try {
    const [result] = await pool.execute(
      "SELECT EXISTS(SELECT 1 FROM likes WHERE user_email = ? AND post_id = ?) AS isLiked",
      [userEmail, postId]
    );

    res.status(200).json({
      postId: postId,
      isLiked: result[0].isLiked === 1,
    });
  } catch (error) {
    console.error("Checking like status error:", error);
    res.status(500).json({ error: "Failed to check like status" });
  }
});

module.exports = router;
