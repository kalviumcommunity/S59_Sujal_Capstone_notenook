import React from "react";
import { useForm } from "react-hook-form";
import "../css/Forms.css";
function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleFormSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="formDiv">
      <h1>Register Now!</h1>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid form mb-8 xl:mb-0"
      >
        {/* username field  */}
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
                message: "username Must be longer than 3 characters",
              },
              maxLength: {
                value: 30,
                message: "username must be shorter than 30 characters",
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

        {/* last name field  */}
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
              minLength: {
                value: 10,
                message: "Passowrd Must be longer than 10 characters",
              },
              pattern: {
                value: /^(?=.*[!@#$%^&*])/,
                message: "Password must contain at least one special character",
              },
            })}
          />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div className="field">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm Your Password",
              validate: (val) => {
                return val === watch("password") || "Passwords Don't match";
              },
            })}
          />
          <p className="error">{errors.confirmPassword?.message}</p>
        </div>

        <button type="submit" className="span2 button">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
