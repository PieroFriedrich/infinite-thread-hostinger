import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Logo from "../images/infinite_thread.png";

function GoogleButton() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  async function createUserIfNotExists(userObject) {
    try {
      console.log(userObject);
      await axios.post(
        "http://localhost:3000/users",
        {
          email: userObject.email,
          fullName: userObject.name,
        },
        {
          headers: {
            "x-username": userObject.email,
          },
        }
      );
      console.log("User created or already exists");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID Token: ", response.credential);
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
    createUserIfNotExists(userObject);

    window.location.reload();
  }

  function handleSignOut() {
    setUser({});
    localStorage.removeItem("user");

    window.location.reload();
  }

  useEffect(() => {
    if (window.google && window.google.accounts) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
    } else {
      console.error("Google API not loaded.");
    }

    if (Object.keys(user).length !== 0) {
      document.getElementById("signInDiv").hidden = true;
    }
  }, [user]);

  return (
    <div>
      <div id="signInDiv" className="mx-auto w-max"></div>

      {Object.keys(user).length !== 0 && (
        <div className="flex flex-col items-center gap-1">
          <h2>Welcome back, {user.given_name || user.name}</h2>{" "}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              className="rounded-md bg-myorange p-1"
              onClick={handleSignOut}
              style={{ color: "white" }}
            >
              Sign Out from Infinite Thread
            </button>
            <img
              src={user.picture}
              alt="User Profile"
              onError={(e) => (e.target.src = Logo)} // change to logo if picture fails
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleButton;
