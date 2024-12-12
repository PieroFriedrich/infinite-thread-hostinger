import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import GoogleButton from "../components/GoogleButton";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) {
          // If email exists, redirect to home page
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <>
      <NavBar />
      <div className="mt-8 mx-auto w-[50%] text-center">
        <h2 className="mb-4 font-bold text-2xl">Welcome to Infinite Thread!</h2>
        <p className="mb-4">
          First time in here? Log into your Google Account and get access to
          participate in our Tech Community
        </p>
        <h2 className="text-md font-bold mt-6">
          Login to Infinite Thread with Google:
        </h2>
        <div className="mt-2 mb-6">
          <GoogleButton />
        </div>

        <p className="mb-4">
          Infinite Thread is your go-to platform for exploring, sharing, and
          connecting within the ever-evolving world of IT. Whether you're a
          seasoned developer, an aspiring tech enthusiast, or simply someone
          curious about the latest in technology, Infinite Thread is here to
          empower you.
        </p>
        <p className="mb-4">Here you can:</p>
        <ul className="list-disc pl-6">
          <li className="mb-4">
            Create posts to share your knowledge, ideas, or projects.
          </li>
          <li className="mb-4">
            Discover insightful content from others in the IT community.
          </li>
          <li className="mb-4">
            Stay updated on trends, tools, and best practices in the tech
            industry.
          </li>
        </ul>
        <p className="mb-4">
          Join us in building a collaborative space where innovation and
          learning thrive. Together, we can weave an infinite thread of ideas
          that shape the future of technology.
        </p>
      </div>
    </>
  );
}

export default Login;
