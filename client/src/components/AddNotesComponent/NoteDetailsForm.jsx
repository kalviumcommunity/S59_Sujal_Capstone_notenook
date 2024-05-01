import { useState } from "react";
import { useForm } from "react-hook-form";

function NoteDetailsForm() {
  const [fileName, setFileName] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "");
    setValue("file", file);
  };

  const handleRemoveFile = () => {
    setFileName("");
    setValue("file", null);

    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <>
      <div className="postNoteForm">
        <div className="flex items-center justify-around postDiv">
          <p className="w-3/4 font-bold text-gray-500">
            Upload the note so that everyone can view it
          </p>
          <button type="submit" className="button post">
            Post
          </button>
        </div>

        <form className="noteDetails" onSubmit={handleSubmit(onSubmit)}>
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

          <div
            className="file-name-container"
            title={fileName || "No file chosen"}
          >
            <p className="file-name">{fileName || "No file"}</p>
            {fileName ? (
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={handleRemoveFile}
              >
                Remove
              </button>
            ) : (
              "chosen"
            )}
          </div>

          <div className="flex w-full justify-around">
            <div className="file-input-container ">
              <input
                type="file"
                id="fileInput"
                className="file-input"
                aria-describedby="fileInputLabel"
                accept=".pdf"
                multiple={false}
                {...register("file", {})}
                defaultValue={null}
                onChange={handleFileChange}
              />

              <label
                htmlFor="fileInput"
                className="file-input-label button"
                role="button"
                id="fileInputLabel"
              >
                Upload Pdf
              </label>
            </div>

            <button type="submit" className="button post">
              Update details
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default NoteDetailsForm;
