import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import { postedNotesReducers } from "./postedNotesReducers";
const token = extractTokenFromCookie();

export const fetchPostedNotes = createAsyncThunk(
  "postedNotes/fetchPostedNotes",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_GET_POSTED_NOTES_ENDPOINT}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.postedNotes;
  }
);

const postedNotesSlice = createSlice({
  name: "postedNotes",
  initialState: {
    postedNotes: [],
    loading: false,
    error: null,
  },
  reducers: postedNotesReducers,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostedNotes.fulfilled, (state, action) => {
        state.postedNotes = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch posted notes. Please try again.";
      });
  },
});

export const {
  addPostedNote,
  updateUpdatedPostedNote,
  removeUnpostedNote,
  removeDeletedPostedNote,
  resetError,
} = postedNotesSlice.actions;
export default postedNotesSlice.reducer;
