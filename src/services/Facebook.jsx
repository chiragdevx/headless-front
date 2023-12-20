import { useEffect } from "react";
import axios from "axios";

function Facebook() {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "631355542532305",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v18.0",
      });
    };
  }, []);

  const handleFacebookLogout = () => {
    window.FB.logout(function (response) {
      // Person is now logged out
      console.log("response: ", response);
    });
    localStorage.removeItem("auth_token");
  };

  const handleFacebookLogin = () => {
    // Use FB.login within this function
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          // User is authenticated
          // Make any necessary API calls or handle the response here
          axios
            .post("http://localhost:3001/auth/facebook/login", {
              credential: response.authResponse.accessToken,
            })
            .then((response) => {
              // Handle the response from your backend
              console.log("API response:", response.data);
            })
            .catch((error) => {
              // Handle any errors
              console.error("API error:", error);
            });
        } else {
          // User canceled the login
          console.log("User canceled the login");
        }
      },
      { scope: "email, public_profile" }
    );
  };

  return (
    <div className="login-container">
      <div>
        <button onClick={handleFacebookLogin}>Facebook Login</button>
        <button onClick={handleFacebookLogout}>Facebook Logout</button>
      </div>
    </div>
  );
}

export default Facebook;
