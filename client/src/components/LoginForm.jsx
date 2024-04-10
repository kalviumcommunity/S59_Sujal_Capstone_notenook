import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../css/Forms.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

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

      console.log(res);

      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage("Invalid username or password. Please try again.");
      } else {
        setErrorMessage("Network error. Please check your connection.");
      }
    }
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
