import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import { UserContext } from "../../context/userContext";

function UpdateUserForm({ userInfo, setUserInfo }) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    setValue("username", userInfo.username);
    setValue("fullname", userInfo.fullname);
    setValue("email", userInfo.email);
  }, [userInfo]);

  const submitForm = async (data) => {
    try {
      const token = extractTokenFromCookie();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.patch(
        import.meta.env.VITE_REACT_APP_USER_DETAIL_UPDATE_ENDPOINT,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Updated details successflully");
        setUser({
          ...user,
          username: data.username,
          email: data.email,
          fullname: data.fullname,
        });
        setUserInfo({
          ...userInfo,
          username: data.username,
          email: data.email,
          fullname: data.fullname,
        });
        navigate("/notenook/profile");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="updateUserForm">
      <h1 className="heading">Edit details</h1>
      <div className="field">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          {...register("username", {
            required: "Enter username",
            minLength: {
              value: 3,
              message: "Username Must be longer than 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Username must be shorter than 30 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]{3,30}$/,
              message:
                "Can contain only letters, numbers, underscores, and dashes",
            },
          })}
        />
        <p className="error">{errors.username?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="fullname">Full Name:</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          {...register("fullname", {
            required: "Enter Full name",
          })}
        />
        <p className="error">{errors.fullname?.message}</p>
      </div>

      <div className="field span2">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          {...register("email", {
            required: "Enter e-mail",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
        />
        <p className="error">{errors.email?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          {...register("password", {
            required: "Enter Password",
          })}
        />
        <p className="error">{errors.password?.message || errorMessage}</p>
      </div>

      <button type="submit" className="button">
        Update
      </button>
    </form>
  );
}

export default UpdateUserForm;
