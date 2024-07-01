import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import "../../css/Forms.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

import googleLogo from "../../assets/googleLogo.png";

function LoginForm({ setUserData }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser, setIsUserLoggedIn } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_REACT_APP_USER_LOGIN_URL,
        data
      );

      document.cookie = `token=${res.data.token}; path=/`;
      setUser(res.data.user);
      setIsUserLoggedIn(true);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 403) {
        setUserData(error.response.data);
        navigate("/forms/verification");
      }
      const errorMessages = {
        404: "User not found. Please check your credentials.",
        500: "Server error. Please try again later.",
        401: "Invalid credentials. Please try again.",
        default: "An unexpected error occurred. Please try again.",
      };

      setErrorMessage(
        error.response
          ? errorMessages[error.response.status] || errorMessages.default
          : "Network error. Please check your connection."
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URI;
  };

  return (
    <div className="formDiv mb-24 xl:mb-0">
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid form mb-8 xl:mb-0"
      >
        {/* Username or Email field */}
        <div className="field span2">
          <label htmlFor="username">Username or Email:</label>
          <input
            type="text"
            id="username"
            name="username"
            {...register("username", {
              required: "Enter username or email",
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        {/* Password field */}
        <div className="field span2">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            {...register("password", {
              required: "Enter Password",
            })}
          />
          <p className="error">{errors.password?.message}</p>
        </div>

        {/* Error message display */}
        {errorMessage && <p className="error span2">{errorMessage}</p>}

        <button type="submit" className="span2 button">
          Login
        </button>
      </form>
      <div className="googleLoginButton">
        or
        <button className="button" onClick={handleGoogleLogin}>
          <img src={googleLogo} alt="googleLogo" />
          Continue With Google
        </button>
      </div>
      <br />
      <p className="text-center mt-0 xl:mt-4">
        Don't have an account?{" "}
        {
          <Link to={"/forms/registration"}>
            {" "}
            <span className="text-blue-900">Register</span>{" "}
          </Link>
        }
      </p>
    </div>
  );
}

export default LoginForm;
