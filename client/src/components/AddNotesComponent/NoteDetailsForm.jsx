import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import axios from "axios";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import PDFUploader from "./PDFUploader";
import { NIL } from "uuid";

function NoteDetailsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [note, setNote] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { documentId } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchDefaultValues = async () => {
      const token = extractTokenFromCookie();
      try {
        if (token) {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_GET_USER_NOTE_ENDPOINT
            }?documentId=${documentId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const note = response.data.note;
          setNote(note);
          if (note.fileReference) {
            setFileName(note.fileReference.fileName);
            setFileUrl(note.fileReference.url);
          }
          setValue("noteTitle", response.data.note.title);
          setValue("subject", response.data.note.subject);
        }
      } catch (error) {
        console.error("Error fetching default values:", error);
      }
    };

    fetchDefaultValues();
  }, [setValue, useParams]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        noteId: documentId,
        title: data.noteTitle,
        subject: data.subject,
      };
      console.log(formData);

      const token = extractTokenFromCookie();
      if (token) {
        const response = await axios.patch(
          import.meta.env.VITE_REACT_APP_UPDATE_NOTE_ENDPOINT,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUnsavedChanges(false);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error("Error submitting note details:", error);
    }
  };

  const postNote = async () => {
    const token = extractTokenFromCookie();
    if (!token || !note) {
      return;
    }
    try {
      const formData = {
        noteId: documentId,
        title: note.title,
        subject: note.subject,
      };
      console.log(formData);

      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_POST_NOTE_ENDPOINT,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Posted Successfully");
        setUnsavedChanges(false);
        setNote({ ...note, postedNote: true });
      }
      console.log(response);
    } catch (error) {
      console.error("Error posting note:", error);
    }
  };

  const deletePostedNote = async () => {
    const token = extractTokenFromCookie();
    if (!token || !note) {
      return;
    }
    console.log(token);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_DELETE_POSTEDNOTE_ENDPOINT}/${
          documentId
        }`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 204) {
        alert("Posted note Deleted Successfully");
        setNote({ ...note, postedNote: false });
      }
      console.log(response);
    } catch (error) {
      console.error("Error posting note:", error);
    }
  };

  const handleInputChange = () => {
    setUnsavedChanges(true);
  };

  return (
    <>
      <div className="postNoteForm">
        <div className="flex items-center justify-around postDiv">
          <p className="w-3/4 font-bold text-gray-500">
            Upload the note so that everyone can view it
          </p>
          {note?.postedNote ? (
            <button
              type="button"
              className="button delete"
              onClick={deletePostedNote}
              title={"Remove the post?"}
            >
              Unpost
            </button>
          ) : (
            <button
              type="button"
              className="button post"
              onClick={postNote}
              disabled={unsavedChanges}
              title={unsavedChanges ? "Save the updates first" : null}
            >
              Post{" "}
            </button>
          )}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
            <p className="error">{errors.subject?.message}</p>
          </div>

          <div
            onClick={() => setShowConfirmation(true)}
            className="button post"
          >
            Update details
          </div>
          {showConfirmation && (
            <div className="confirmation-popup">
              <p className="heading text-center">
                Are you sure you want to update the note?
              </p>
              <div className="flex gap-10">
                <button type="submit" className="button yes-button">
                  Yes
                </button>
                <div
                  onClick={() => setShowConfirmation(false)}
                  className="button cancel-button"
                >
                  Cancel
                </div>
              </div>
            </div>
          )}
        </form>

        <PDFUploader
          documentId={documentId}
          fileName={fileName}
          setFileName={setFileName}
          fileUrl={fileUrl}
          setFileUrl={setFileUrl}
        />
      </div>
    </>
  );
}

export default NoteDetailsForm;
