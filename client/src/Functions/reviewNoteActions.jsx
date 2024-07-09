import axios from "axios";

import extractTokenFromCookie from "./ExtractTokenFromCookie";

const token = extractTokenFromCookie();

export const markNoteForReview = async (noteId) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_REACT_APP_MARK_REVIEW_NOTE_ENDPOINT}/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return noteId;
  } catch (error) {
    throw error.response ? error.response.data.error : error.message;
  }
};

export const unmarkNoteForReview = async (noteId) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_REACT_APP_UNMARK_REVIEW_NOTE_ENDPOINT}/${noteId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return noteId;
  } catch (error) {
    console.log(error)
    throw error.response ? error.response.data.error : error.message;
  }
};
