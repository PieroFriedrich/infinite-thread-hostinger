import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "../images/magnifying_glass.png";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]); // Track active (selected) tags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tags"); // Adjust URL if needed
        setTags(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags");
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId) => {
    // Toggle the activation state of a tag
    setActiveTags(
      (prevActiveTags) =>
        prevActiveTags.includes(tagId)
          ? prevActiveTags.filter((id) => id !== tagId) // Remove tag if already active
          : [...prevActiveTags, tagId] // Add tag if not active
    );
  };

  if (loading) return <div>Loading tags...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center mx-auto w-[80%] mt-4 gap-1">
      <h2>Check Posts by Tag</h2>
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
              activeTags.includes(tag.id)
                ? "bg-orange-500 text-white font-bold"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </span>
        ))}
      </div>
      <button className="w-full mt-1">
        <div className="flex gap-1 bg-myorange p-1 rounded-md text-myblue justify-center">
          <img src={SearchIcon} alt="search icon" width={20} height={20} />
          Search
        </div>
      </button>
    </div>
  );
};

export default Tags;
