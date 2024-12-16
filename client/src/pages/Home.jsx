import { useState, useEffect } from "react";
import Post from "../components/Post";
import NavBar from "../components/NavBar";
import Tags from "../components/Tags";
import AboutUs from "../components/AboutUs";
import GoogleButton from "../components/GoogleButton";

function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:3000/tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchPosts();
    fetchTags();
  }, []);

  const fetchPostsByTag = async (selectedTagIds) => {
    setPosts(posts);
  };

  const handleSearchClick = async (selectedTagIds) => {
    try {
      // If no tags are selected, show all posts
      if (selectedTagIds.length === 0) {
        const response = await fetch("http://localhost:3000/posts");
        const data = await response.json();
        setPosts(data);
        setIsSearched(false);
        return;
      }

      const tagPromises = selectedTagIds.map(async (tagId) => {
        const response = await fetch(
          `http://localhost:3000/posts/tag/${tagId}`
        );
        return response.json();
      });

      const tagPostResults = await Promise.all(tagPromises);

      const combinedPosts = tagPostResults.flat();
      const uniquePosts = Array.from(
        new Set(combinedPosts.map((p) => p.id))
      ).map((id) => combinedPosts.find((p) => p.id === id));

      setPosts(uniquePosts);
      setIsSearched(true);
    } catch (error) {
      console.error("Error fetching posts by tags:", error);
    }
  };

  const toggleTagsVisibility = () => {
    setIsTagsVisible(!isTagsVisible);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col lg:flex-row w-full bg-white">
        {/* Tags Toggle Button for Mobile and Tablet */}
        <div className="lg:hidden flex justify-between items-center p-4">
          <button
            onClick={toggleTagsVisibility}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isTagsVisible ? "Hide Tags" : "Show Tags"}
          </button>
        </div>

        {/* Tags Section with Responsive Visibility */}
        <div
          className={`
            lg:w-[25%]
            ${isTagsVisible ? "block" : "hidden lg:block"}
            px-4 lg:px-0
          `}
        >
          <Tags
            wid={80}
            tags={tags}
            onTagsChange={fetchPostsByTag}
            onSearchClick={handleSearchClick}
          />
        </div>

        {/* Posts Section */}
        <div className="w-full lg:w-[50%] max-h-[100vh] overflow-y-auto border border-gray-200 p-4 rounded bg-mycolor5">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post) => (
              <Post key={post.id} post={post} lineblock={true} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div
          className={`
            w-full lg:w-[25%] 
            ${isTagsVisible ? "hidden" : "block"}
            lg:flex lg:flex-col lg:items-center
            p-4 lg:p-0
          `}
        >
          <div className="my-4 flex justify-center">
            <GoogleButton />
          </div>
          <div className="sm:w-[80%] md:w-[65%] lg:w-[80%] mx-auto text-center flex flex-col items-center">
            <AboutUs />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
