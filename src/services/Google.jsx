import { useEffect } from "react";
import axios from "axios";

function Google() {
  const redirect = (response) => {
    console.log("response: ", response);
    const credential = response.credential;
    axios
      .post("http://localhost:3001/auth/google/login", { credential })
      .then((response) => {
        // Handle the response from your backend
        localStorage.setItem("auth_token", response.data.data.access_token);

        console.log("API response:", response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error("API error:", error);
      });
  };

  function onGoogleClickHandler() {
    console.log("Sign in with Google button clicked...");
  }
  function googleLogout() {
    localStorage.removeItem("auth_token");
    window.google?.accounts.id.revoke("piyush@devxconsultancy.com", (done) => {
      console.log("consent revoked: ", done);
    });
  }

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id:
        "533433777634-q3bsqf5pjh1rjf43agvrqrarja3bum9n.apps.googleusercontent.com",
      callback: redirect,
      access_type: "offline",
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "filled_blue",
        size: "large",
        click_listener: onGoogleClickHandler,
      }
    );
  }, []);

  return (
    <div className="login-container">
      <div>
        <div id="signInDiv"></div>
      </div>
      <div>
        <div id="signOutDiv" onClick={googleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}

export default Google;
