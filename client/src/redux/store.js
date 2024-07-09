import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./notes/notesSlice";
import postedNotesReducer from "./notes/postedNotesSlice";
import savedNotesReducer from "./notes/savedNotesSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    savedNotes: savedNotesReducer,
    postedNotes: postedNotesReducer,
  },
});
