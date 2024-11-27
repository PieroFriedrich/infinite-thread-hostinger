import { useState, useEffect } from "react";
import Post from "../components/Post";
import NavBar from "../components/NavBar";
import Tags from "../components/Tags";
import AboutUs from "../components/AboutUs";
import GoogleButton from "../components/GoogleButton";

function Home() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);

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

  return (
    <>
      <NavBar />
      <div className="flex w-full">
        <div className="w-[30%]">
          <Tags wid={80} tags={tags} />
        </div>
        <div className="w-[40%]">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
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
