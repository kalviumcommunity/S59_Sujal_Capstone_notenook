import React, { useState } from "react";
import { useForm } from "react-hook-form";

function UpdatePasswordForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const submitForm = async (data) => {};

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
