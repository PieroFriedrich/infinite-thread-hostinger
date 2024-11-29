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

  return (
    <>
      <NavBar />
      <div className="flex w-full">
        <div className="w-[30%]">
          <Tags
            wid={80}
            tags={tags}
            onTagsChange={fetchPostsByTag}
            onSearchClick={handleSearchClick}
          />
        </div>
        <div className="w-[40%] max-h-[100vh] overflow-y-auto border border-gray-200 p-4 rounded">
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            posts.map((post) => <Post key={post.id} post={post} />)
          )}
        </div>
        <div className="w-[30%] flex flex-col items-center">
          <div className="my-4">
            <GoogleButton />
          </div>
          <div className="w-[80%] mx-auto text-center flex flex-col items-center">
            <AboutUs />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
