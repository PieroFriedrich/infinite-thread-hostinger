import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/infinite_thread.png";
import CommentIcon from "../images/comment_icon.svg";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { id, title, author, image_url, details, tags } = post;
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const fetchImage = async () => {
    try {
      const response = await fetch(image_url);
      const blob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      setImageUrl(imageObjectUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, [image_url]);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email);
      } else {
        console.warn("No user found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const countResponse = await axios.get(`/likes/count/${id}`);
        setLikeCount(countResponse.data.likeCount);

        const commentResponse = await axios.get(`/posts/${id}/comments/count`);
        setCommentCount(commentResponse.data.commentCount);

        if (userEmail) {
          const statusResponse = await axios.get("/likes/status", {
            params: { postId: id },
            headers: { "x-username": userEmail },
          });
          setIsLiked(statusResponse.data.isLiked);
        }
      } catch (error) {
        console.error(
          "Error fetching post data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchPostData();
  }, [id, userEmail]);

  return (
    <div className="my-8">
      <div className="bg-myblue w-[90%] mx-auto p-0 rounded-tl-xl rounded-tr-xl">
        <div className="relative p-3">
          <div className="flex items-center gap-2">
            <img
              src={imageUrl}
              alt={`${author}'s profile`}
              className="w-[30px] h-[30px] rounded-full"
              onError={() => setImageUrl(Logo)}
            />
            <p className="text-white">{author}</p>
          </div>
          <div className="bg-myorange text-white absolute top-0 right-0 p-1 rounded-tr-xl rounded-bl-xl">
            Group Category
          </div>
          <h2 className="text-white text-3xl py-3 border-b border-b-myorange">
            <Link to={`/post/${id}`} className="text-white hover:text-myorange">
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
          <div className="flex items-center gap-1">
            <Link to={`/post/${id}`}>
              <img src={CommentIcon} alt="Comments Icon" width={20} />
            </Link>
            <span className="text-white">{commentCount}</span>
          </div>
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
