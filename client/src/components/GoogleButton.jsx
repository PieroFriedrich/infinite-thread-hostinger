import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; //here

function GoogleButton() {
  const [user, setUser] = useState({});

  //this function
  async function createUserIfNotExists(userObject) {
    try {
      // Use full email as username
      await axios.post(
        "http://localhost:3000/users",
        {
          email: userObject.email, // Use full email as username
          fullName: userObject.name,
        },
        {
          headers: {
            "x-username": userObject.email, // Pass email as username header
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
    var userObject = jwtDecode(response.credential);
    setUser(userObject);
    createUserIfNotExists(userObject); //here
    document.getElementById("signInDiv").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return (
    <div>
      <div id="signInDiv"></div>

      {Object.keys(user).length !== 0 && (
        <div className="flex flex-col items-center gap-1">
          <h2>Welcome back {user.given_name}</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* Sign Out button */}
            <button
              className={"rounded-md bg-myorange p-1"}
              onClick={(e) => handleSignOut(e)}
              style={{
                color: "white",
              }}
            >
              Sign Out from Infinite Thread
            </button>

            {/* Small version of the user's picture */}
            <img
              src={user.picture}
              alt="User Profile"
              style={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleButton;
