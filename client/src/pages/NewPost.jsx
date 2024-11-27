import NavBar from "../components/NavBar";
import React, { useState, useEffect } from "react";
import Tags from "../components/Tags";
import AboutUs from "../components/AboutUs";
import GoogleButton from "../components/GoogleButton";

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
  });

  // State to store selected tag IDs
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

    // Fetch all tags to get tag names by their IDs
    fetch("http://localhost:3000/tags")
      .then((response) => response.json())
      .then((allTags) => {
        // Convert tag IDs to tag names
        const tagNames = selectedTagIds
          .map((tagId) => allTags.find((tag) => tag.id === tagId)?.name)
          .filter(Boolean);

        const postData = {
          title: formData.title,
          details: formData.comment,
          tags: tagNames,
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
        // Optional: Reset form or show success message
        setFormData({ title: "", comment: "" });
        setSelectedTagIds([]); // Clear selected tags
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  return (
    <>
      <NavBar />

      <div className="flex justify-between items-start mt-10 px-4">
        {/* Left: Empty space */}
        <div className="w-[30%]"></div>

        {/* Middle: New Post form */}
        <div className="w-[40%] bg-gray-100 p-6 rounded-lg shadow-md mx-auto">
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

        {/* Right: AboutUs and GoogleButton */}
        <div className="w-[30%] flex flex-col items-center">
          <div className="my-4">
            <GoogleButton setUser={setUser} />
          </div>
          <div className="w-[80%] mx-auto text-center flex flex-col items-center">
            <AboutUs />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;
