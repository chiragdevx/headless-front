import {
  FacebookOutlined,
  GithubFilled,
  GoogleOutlined,
} from "@ant-design/icons";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import {
  signInWithFacebook,
  signInWithGithub,
  signInWithGoogle,
} from "@/redux/actions/authActions";
import Google from "../../services/Google";
import Facebook from "../../services/Facebook";

const SocialLogin = ({ isLoading }) => {
  const dispatch = useDispatch();

  const onSignInWithGoogle = () => {
    dispatch(signInWithGoogle());
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

  const onSignInWithGithub = () => {
    dispatch(signInWithGithub());
  };

  return (
    <div className="auth-provider">
      <button
        className="button auth-provider-button provider-facebook"
        disabled={isLoading}
        onClick={handleFacebookLogin}
        type="button"
      >
        {/* <i className="fab fa-facebook" /> */}
        <FacebookOutlined />
        Continue with Facebook
      </button>
      <button
        className="button auth-provider-button provider-google"
        disabled={isLoading}
        onClick={onSignInWithGoogle}
        type="button"
      >
        <GoogleOutlined />
        Continue with Google
        <Google></Google>
        <Facebook></Facebook>
      </button>
      <button
        className="button auth-provider-button provider-github"
        disabled={isLoading}
        onClick={onSignInWithGithub}
        type="button"
      >
        <GithubFilled />
        Continue with GitHub
      </button>
    </div>
  );
};

SocialLogin.propTypes = {
  isLoading: PropType.bool.isRequired,
};

export default SocialLogin;
