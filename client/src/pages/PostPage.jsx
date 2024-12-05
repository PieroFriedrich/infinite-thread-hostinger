import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Post from "../components/Post";

function PostPage() {
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
    if (!newComment.trim()) return;
    console.log("Author:", JSON.parse(localStorage.getItem("user")).email);
    console.log("Post ID:", id);
    console.log("Comment Text:", newComment);

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
      <div className={"mx-auto w-[50%]"}>
        <Post post={post} />
        <textarea
          className="bg-myblue w-[90%] py-3 pl-4 mx-auto block rounded-tl-xl rounded-tr-xl text-white"
          placeholder="Make your comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="bg-myorange w-[90%] py-2 mx-auto p-0 rounded-bl-xl rounded-br-xl flex justify-end">
          <button
            className="bg-myyellow rounded-lg mr-2 p-1"
            onClick={handleCommentSubmit}
          >
            Comment
          </button>
        </div>
        <div className="bg-myblue w-[90%] mx-auto mt-8 p-3 rounded-lg">
          <h3 className="text-white text-lg mb-2">Comments</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-myblue p-3 rounded-lg mb-2 text-white"
              >
                <p>{comment.text}</p>
                <small>By: {comment.author}</small>
              </div>
            ))
          ) : (
            <p className="text-white">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default PostPage;
