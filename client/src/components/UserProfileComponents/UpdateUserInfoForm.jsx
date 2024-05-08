import React, { useState } from "react";
import { useForm } from "react-hook-form";

function UpdateUserForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitForm = async (data) => {};

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
