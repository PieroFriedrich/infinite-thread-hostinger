import React, { useState, useEffect } from "react";
import axios from "axios";

function Comment({ postId, userEmail }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_HOST}/posts/${postId}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // Add a new comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST}/posts/${postId}/comments`,
        { text: newComment },
        { headers: { "x-username": userEmail } }
      );
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment(""); // Clear input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="bg-myblue w-full py-3 pl-4 block rounded-lg text-white mb-2"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <button
        className="bg-myyellow rounded-lg p-2"
        onClick={handleCommentSubmit}
      >
        Post Comment
      </button>
      <div className="mt-4">
        {comments.length === 0 ? (
          <p className="text-white">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-myblue p-3 rounded-lg mb-2 text-white"
            >
              <p>{comment.text}</p>
              <small>By: {comment.author}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comment;
