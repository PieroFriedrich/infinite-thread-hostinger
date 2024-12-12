import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Post from "../components/Post";

function PostPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    // Fetch comments for the post
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/posts/${id}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    // Check if user is logged in before submitting comment
    const storedUser = localStorage.getItem("user");

    // If no user is logged in, redirect to login
    if (!storedUser) {
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "You need to log in to post a comment",
        },
      });
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/posts/${id}/comments`,
        {
          author: JSON.parse(localStorage.getItem("user")).email, // Replace with actual key if different
          text: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setComments((prev) => [...prev, response.data]); // Update comments
      setNewComment(""); // Clear the textarea
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!post) return <div>Loading post...</div>;

  return (
    <>
      <NavBar />
      <div className={"mx-auto w-[80%] md:w-[60%] sm:w-[50%]"}>
        <Post post={post} />
        <textarea
          className="bg-myblue w-full sm:w-[90%] py-3 pl-4 mx-auto block rounded-tl-xl rounded-tr-xl text-mycolor2 border"
          placeholder="Make your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="w-full sm:w-[90%] py-2 mx-auto p-0 rounded-bl-xl rounded-br-xl flex justify-end border">
          <button
            className="bg-mycolor2 text-white rounded-lg mr-2 p-1 hover:font-bold"
            onClick={handleCommentSubmit}
          >
            Comment
          </button>
        </div>
        <div className="border w-full sm:w-[90%] mx-auto mt-8 p-3 rounded-lg">
          <h3 className="text-mycolor2 text-lg mb-2">Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg mb-2 text-mycolor2 border"
              >
                <p>{comment.text}</p>
                <small>By: {comment.author}</small>
              </div>
            ))
          ) : (
            <p className="text-mycolor2">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default PostPage;
