import NavBar from "../components/NavBar";
import React, { useState } from "react";

const NewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation (optional)
    if (!formData.title || !formData.comment) {
      alert("Title and comment are required!");
      return;
    }

    console.log("Form Data Submitted:", formData);

    // Submit form data to backend (replace with your API)
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post created:", data);
        alert("Post created successfully!");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert("Failed to create post.");
      });
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Create a New Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block font-medium text-gray-700">
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

          {/* Comment Field */}
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

          {/* Tags Field */}
          <div>
            <label htmlFor="tags" className="block font-medium text-gray-700">
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-500"
              placeholder="Enter tags separated by commas (e.g., React,Node.js)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-500"
          >
            Submit Post
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPost;
