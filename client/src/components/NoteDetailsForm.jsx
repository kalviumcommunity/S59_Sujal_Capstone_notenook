import React, { useContext, useState } from "react";
import { DeviceWidthContext } from "../context/deviceWidthContext";
import { useForm } from "react-hook-form";
function NoteDetailsForm() {
  const width = useContext(DeviceWidthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [formVisibility, setFormVisibility] = useState(false);
  const showForm = () => {
    setFormVisibility(!formVisibility);
  };

  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: "15",
  };
  const coverStyle = {
    backdropFilter: "blur(3px)",
    zIndex: "12",
  };

  const onSubmit = (data) => {
    console.log(formVisibility);
    if (!formVisibility) {
      setFormVisibility(true);
      return;
    }
    console.log(data);
  };

  return (
    <>
      {width < 1024 && formVisibility && (
        <div
          className="cover absolute h-full w-full top-0 left-0"
          style={coverStyle}
        ></div>
      )}

      <div
        className="postNoteForm"
        style={formVisibility && width < 1024 ? style : null}
      >
        <form className="noteDetails" onSubmit={handleSubmit(onSubmit)}>
          <div className="addNoteButtons">
            <div className="button" onClick={showForm}>
              {formVisibility ? "Close details" : "Show details"}
            </div>

            <button type="submit" className="button" disabled={!formVisibility}>
              Post
            </button>
          </div>
          <div className="file-input-container">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              aria-describedby="fileInputLabel"
              accept=".pdf"
            />
            <label
              htmlFor="fileInput"
              className="file-input-label"
              role="button"
              id="fileInputLabel"
            >
              Upload Pdf
            </label>
          </div>

          {formVisibility && (
            <>
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
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default NoteDetailsForm;
