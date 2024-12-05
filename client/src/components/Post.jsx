import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/infinite_thread.png";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { id, title, author, details, tags } = post;
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Fetch and parse user email from localStorage
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email); // Store the email
      } else {
        console.warn("No user found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []); // Only runs once on component mount

  // Fetch initial like count and like status
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        // Fetch like count
        const countResponse = await axios.get(`/likes/count/${id}`);
        setLikeCount(countResponse.data.likeCount);

        // Only check the like status if userEmail exists
        if (userEmail) {
          const statusResponse = await axios.get("/likes/status", {
            params: { postId: id },
            headers: { "x-username": userEmail },
          });
          setIsLiked(statusResponse.data.isLiked);
        }
      } catch (error) {
        console.error(
          "Error fetching like data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    // Fetch only if userEmail is available
    fetchLikeData();
  }, [id, userEmail]); // Dependency array includes userEmail to trigger re-fetch

  return (
    <div className="my-8">
      <div className="bg-myblue w-[90%] mx-auto p-0 rounded-tl-xl rounded-tr-xl">
        <div className="relative p-3">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Infinite Thread Logo" width={30} height={30} />
            <p className="text-white">{author}</p>
          </div>
          <div className="bg-myorange text-white absolute top-0 right-0 p-1 rounded-tr-xl rounded-bl-xl">
            Group Category
          </div>
          <h2 className="text-white text-3xl py-3 border-b border-b-myorange">
            <Link to={`/post/${id}`} className="text-white">
              {title}
            </Link>
          </h2>
          <p className="text-white pt-3 text-sm">{details}</p>
        </div>
      </div>
      <div className="bg-myorange w-[90%] mx-auto p-0 rounded-bl-xl rounded-br-xl flex gap-1 py-2 justify-between items-center">
        <div className="flex ml-1 gap-2">
          <LikeButton
            postId={id}
            isLiked={isLiked}
            likeCount={likeCount}
            onLikeChange={(newLikeCount, newIsLiked) => {
              setLikeCount(newLikeCount);
              setIsLiked(newIsLiked);
            }}
          />
          <span className="text-white">{likeCount}</span>
        </div>

        <div className="flex mr-1 gap-1">
          {tags &&
            tags.split(",").map((tag) => (
              <p
                key={tag}
                className="bg-myyellow rounded-lg ml-2 px-2 text-myblue"
              >
                {tag}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Post;
