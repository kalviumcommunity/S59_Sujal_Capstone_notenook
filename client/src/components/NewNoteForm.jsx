import React from "react";
import { useForm } from "react-hook-form";

function NewNoteForm({ handleClick }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="newNoteForm">
      <div className="h-full w-full absolute top-0 left-0"></div>
      <form
        className="flex flex-col gap-10 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="heading">
          Enter the details to edit notes and post files
        </h1>
        <div className="field">
          <label htmlFor="noteTitle">Note Title:</label>
          <input
            type="text"
            name="noteTitle"
            id="noteTitle"
            {...register("noteTitle", {
              required: "Note title is required",
            })}
          />
          <p className="error">{errors.noteTitle?.message}</p>
        </div>

        <div className="field">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            name="subject"
            id="subject"
            {...register("subject", {
              required: "Subject is required",
            })}
          />
          <p className="error">{errors.subject?.message}</p>
        </div>
        <div className="flex w-full justify-around">
          <div className="button cancle" onClick={handleClick}>
            Cancle
          </div>
          <button className="button" type="submit">
            Create Note
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewNoteForm;
