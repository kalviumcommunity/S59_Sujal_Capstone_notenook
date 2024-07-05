import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { NotesContext } from "../../context/notesContext";

function NewNoteForm({ handleClick }) {
  const { updateNotes } = useContext(NotesContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const tokenCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));

      if (tokenCookie) {
        const token = tokenCookie.split("=")[1];

        const response = await axios.post(
          import.meta.env.VITE_REACT_APP_NEW_NOTE_URL,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const newNote = response.data.note;
        updateNotes(newNote);
        navigate(`/notenook/myNotes/writeNote/${response.data.note._id}`);
      } else {
        console.log("Token cookie not found.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="newNoteForm">
      <form
        className="flex flex-col gap-10 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="heading text-center">
          Enter the details to edit notes and post files
        </h1>
        <div className="field">
          <label htmlFor="title">Note Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            {...register("title", {
              required: "Note title is required",
            })}
          />
          <p className="error">{errors.title?.message}</p>
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
