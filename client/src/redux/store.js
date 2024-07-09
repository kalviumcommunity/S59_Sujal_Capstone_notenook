import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notes/notesSlice";
import postedNotesReducer from "./notes/postedNotesSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    postedNotes: postedNotesReducer,
  },
});
