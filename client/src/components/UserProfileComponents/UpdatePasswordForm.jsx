import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

function UpdatePasswordForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const submitForm = async (data) => {
    try {
      const token = extractTokenFromCookie();
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.patch(
        import.meta.env.VITE_REACT_APP_USER_DETAIL_UPDATE_PASSOWRD_ENDPOINT,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Updated password successflully");
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
    <form onSubmit={handleSubmit(submitForm)} className="updatePasswordForm">
      <h1 className="heading">Change Password</h1>

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

      <div className="field">
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          {...register("newPassword", {
            required: "Enter newPassword",
            minLength: {
              value: 10,
              message: "Password Must be longer than 10 characters",
            },
            pattern: {
              value: /^(?=.*[!@#$%^&*])/,
              message: "Password must contain at least one special character",
            },
          })}
        />
        <p className="error">{errors.newPassword?.message}</p>
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          {...register("confirmPassword", {
            required: "Confirm Your Password",
            validate: (val) => {
              return val === watch("newPassword") || "Passwords Don't match";
            },
          })}
        />
        <p className="error">{errors.confirmPassword?.message}</p>
      </div>

      <button type="submit" className="button">
        Change Password
      </button>
    </form>
  );
}

export default UpdatePasswordForm;
