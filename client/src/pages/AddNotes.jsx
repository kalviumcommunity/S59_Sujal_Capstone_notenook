import React from "react";
import { useForm } from "react-hook-form";
import TextEditor from "../components/TextEditor";
import "../css/AddNotes.css";

function AddNotes() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="addNotesPage">
      <TextEditor />
      <div>
        <form className="noteDetails" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="noteTitle">Note Title:</label>
            <input
              type="text"
              name="noteTitle"
              id="noteTitle"
              {...register("noteTitle", { required: "Note title is required" })}
            />

            <p className="error">{errors.noteTitle?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              name="subject"
              id="subject"
              {...register("subject", { required: "Subject is required" })}
            />

            <p className="error">{errors.subject?.message}</p>
          </div>
          <div className="field">
            <label htmlFor="chapter">Chapter:</label>
            <input
              type="text"
              name="chapter"
              id="chapter"
              {...register("chapter", { required: "Chapter is required" })}
            />

            <p className="error">{errors.chapter?.message}</p>
          </div>
          <div className="file-input-container">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              aria-describedby="fileInputLabel"
            />
            <label
              htmlFor="fileInput"
              className="file-input-label"
              role="button"
              id="fileInputLabel"
            >
              Choose a file
            </label>
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNotes;
