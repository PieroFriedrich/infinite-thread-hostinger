import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "../images/magnifying_glass.png";

const Tags = (props) => {
  const [tags, setTags] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tags");
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
    setActiveTags((prevActiveTags) => {
      if (prevActiveTags.includes(tagId)) {
        setWarning("");
        return prevActiveTags.filter((id) => id !== tagId);
      } else if (prevActiveTags.length < 5) {
        setWarning("");
        return [...prevActiveTags, tagId];
      } else {
        setWarning("You can only select up to 5 tags.");
        return prevActiveTags;
      }
    });
  };

  if (loading) return <div>Loading tags...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className={`flex flex-col items-center mx-auto ${
        props.wid ? `w-[${props.wid}%]` : "w-[100%]"
      } mt-4 gap-1`}
    >
      {!props.noSearch ? (
        <h2>Check Posts by Tag</h2>
      ) : (
        <h2>What is your post about?</h2>
      )}

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
      {warning && <p className="text-red-500 text-sm mt-2">{warning}</p>}
      {!props.noSearch && (
        <button className="w-full mt-1">
          <div className="flex gap-1 bg-myorange p-1 rounded-md text-myblue justify-center">
            <img src={SearchIcon} alt="search icon" width={20} height={20} />
            Search
          </div>
        </button>
      )}
    </div>
  );
};

export default Tags;
