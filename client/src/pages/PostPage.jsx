import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Post from "../components/Post";

function PostPage() {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading post...</div>;

  return (
    <>
      <NavBar />
      <div className={"mx-auto w-[50%]"}>
        <Post post={post} />
      </div>
    </>
  );
}

export default PostPage;
