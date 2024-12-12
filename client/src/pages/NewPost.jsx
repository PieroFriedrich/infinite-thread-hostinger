import NavBar from "../components/NavBar";
import React, { useState, useEffect } from "react";
import Tags from "../components/Tags";
import AboutUs from "../components/AboutUs";
import GoogleButton from "../components/GoogleButton";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    comment: "",
  });

  const [selectedTagIds, setSelectedTagIds] = useState([]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.comment) {
      alert("Title and comment are required!");
      return;
    }

    fetch("http://localhost:3000/tags")
      .then((response) => response.json())
      .then((allTags) => {
        const tagNames = selectedTagIds
          .map((tagId) => allTags.find((tag) => tag.id === tagId)?.name)
          .filter(Boolean);

        const postData = {
          title: formData.title,
          details: formData.comment,
          tags: tagNames,
          imageUrl: user.picture,
        };

        console.log("Form Data Submitted:", postData);

        return fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-username": user.email,
          },
          body: JSON.stringify(postData),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post created:", data);
        navigate("/");
        setFormData({ title: "", comment: "" });
        setSelectedTagIds([]);
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  return (
    <>
      <NavBar />

      <div className="flex flex-col lg:flex-row justify-center lg:items-start mt-10 px-4 space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left: AboutUs and GoogleButton */}
        <div className="w-full lg:w-[30%] flex flex-col items-center space-y-4">
          <div className="w-full mx-auto">
            <GoogleButton setUser={setUser} />
          </div>
          <div className="w-full text-center">
            <AboutUs />
          </div>
        </div>

        {/* Middle: New Post form */}
        <div className="w-full lg:w-[40%] bg-gray-100 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Create a New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block font-medium text-gray-700"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="5"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-500"
                placeholder="Write your comment"
                required
              ></textarea>
            </div>

            {/* Pass the setSelectedTagIds as a prop */}
            <Tags noSearch={true} onTagsChange={setSelectedTagIds} />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-500"
              disabled={!user}
            >
              {user ? "Create a New Post" : "Log in to create a post"}{" "}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewPost;
