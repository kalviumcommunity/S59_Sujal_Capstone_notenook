import React, { useState } from "react";
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
    console.log(formVisibility);
    if (!formVisibility) {
      setFormVisibility(true);
      return;
    }
    console.log(data);
  };

  const [formVisibility, setFormVisibility] = useState(true);

  const showForm = () => {
    setFormVisibility(!formVisibility);
  };

  return (
    <div className="addNotesPage">
      <div className="addNotes">
        <TextEditor />
        <div className="postNoteForm">
          <form className="noteDetails" onSubmit={handleSubmit(onSubmit)}>
            <div className="addNoteButtons">
              {formVisibility && (
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
                    Upload Files
                  </label>
                </div>
              )}
              <div className="button" onClick={showForm}>
                Note details
              </div>
              <button
                type="submit"
                className="button"
                disabled={!formVisibility}
              >
                Post
              </button>
            </div>

            {/* {formVisibility && (
            <>
              {" "}
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
            </>
          )} */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNotes;
