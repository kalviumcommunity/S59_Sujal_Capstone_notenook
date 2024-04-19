import React, { useContext, useState } from "react";
import { DeviceWidthContext } from "../context/deviceWidthContext";
import { useForm } from "react-hook-form";
function NoteDetailsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "10",
  };

  const width = useContext(DeviceWidthContext);
  console.log(width);
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
    <div
      className="postNoteForm"
      style={formVisibility && width < 1024 ? style : null}
    >
      <form className="noteDetails" onSubmit={handleSubmit(onSubmit)}>
        <div className="addNoteButtons">
          <div className="button" onClick={showForm}>
            Note details
          </div>
          <button type="submit" className="button" disabled={!formVisibility}>
            Post
          </button>
        </div>
        <div class="file-input-container">
          <input
            type="file"
            id="fileInput"
            class="file-input"
            aria-describedby="fileInputLabel"
            accept=".pdf"
          />
          <label
            for="fileInput"
            class="file-input-label"
            role="button"
            id="fileInputLabel"
          >
            Upload Pdf
          </label>
        </div>

        {formVisibility && (
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
                {...register("subject", {
                  required: "Subject is required",
                })}
              />

              <p className="error">{errors.subject?.message}</p>
            </div>
            <div className="field">
              <label htmlFor="chapter">Chapter:</label>
              <input
                type="text"
                name="chapter"
                id="chapter"
                {...register("chapter", {
                  required: "Chapter is required",
                })}
              />

              <p className="error">{errors.chapter?.message}</p>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default NoteDetailsForm;
