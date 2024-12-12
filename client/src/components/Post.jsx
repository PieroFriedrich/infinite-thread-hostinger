import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../images/infinite_thread_blue.png";
import { formatDistanceToNow } from "date-fns";
import CommentIcon from "../images/comment_icon.svg";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { id, title, author, image_url, details, tags, created_at } = post;
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [timeAgo, setTimeAgo] = useState("");

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

  useEffect(() => {
    if (created_at) {
      const timeAgoString = formatDistanceToNow(new Date(created_at), {
        addSuffix: true,
      });

      // Custom formatting to convert "about 1 hour ago" to "1h ago"
      const formattedTimeAgo = timeAgoString
        .replace("about ", "")
        .replace(" hour ago", "h ago")
        .replace(" hours ago", "h ago")
        .replace(" minute ago", "m ago")
        .replace(" minutes ago", "m ago")
        .replace(" day ago", "d ago")
        .replace(" days ago", "d ago")
        .replace("less than am ago", "less than 1m ago");

      setTimeAgo(formattedTimeAgo);
    }
  }, [created_at]);

  return (
    <div className="my-4 sm:my-8">
      <div className="w-full sm:w-[90%] mx-auto p-0 rounded-tl-xl rounded-tr-xl border bg-white">
        <div className="relative p-3">
          <div className="flex items-center gap-2">
            <img
              src={imageUrl || Logo}
              alt={`${author}'s profile`}
              className="w-[30px] h-[30px] rounded-full"
              onError={() => setImageUrl(Logo)}
            />
            <p className="text-mycolor2 text-sm sm:text-base">{author}</p>
          </div>
          <div className="bg-mycolor4 text-mycolor2 absolute top-0 right-0 p-1 rounded-tr-xl rounded-bl-xl text-xs sm:text-sm">
            {timeAgo}
          </div>
          <h2 className="text-mycolor2 text-md sm:text-xl py-2 sm:py-3 border-b border-b-mycolor5 font-bold">
            <Link to={`/post/${id}`} className="text-mycolor2 hover:underline">
              {title}
            </Link>
          </h2>
          <p className="text-mycolor2 pt-2 sm:pt-3 text-xs sm:text-sm line-clamp-3">
            {details}
          </p>
        </div>
      </div>
      <div className="bg-white w-full sm:w-[90%] mx-auto p-0 rounded-bl-xl rounded-br-xl flex items-center justify-between py-2 border">
        {/* Interaction Section (Likes and Comments) */}
        <div className="flex items-center ml-2">
          <div className="flex items-center gap-1 min-w-[40px]">
            <LikeButton
              postId={id}
              isLiked={isLiked}
              likeCount={likeCount}
              onLikeChange={(newLikeCount, newIsLiked) => {
                setLikeCount(newLikeCount);
                setIsLiked(newIsLiked);
              }}
            />
            <span className="text-mycolor2 text-xs sm:text-sm">
              {likeCount}
            </span>
          </div>

          <div className="flex items-center gap-1 min-w-[40px]">
            <Link to={`/post/${id}`}>
              <img
                src={CommentIcon}
                alt="Comments Icon"
                width={20}
                height={20}
                className="transform hover:scale-110 transition-transform duration-200"
              />
            </Link>
            <span className="text-mycolor2 text-xs sm:text-sm">
              {commentCount}
            </span>
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1 items-center justify-end max-w-[85%] overflow-x-auto mr-2">
          {tags &&
            tags.split(",").map((tag) => (
              <p
                key={tag}
                className="bg-mycolor4 rounded-lg px-1 sm:px-2 text-white text-xs sm:text-sm whitespace-nowrap"
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
