import React, { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { NotesContext } from "../../context/notesContext";
import MyReviewNote from "../NoteCards/MyReviewNote";
import MySavedReviewNote from "../NoteCards/MySavedReviewNote";

function ReviewList() {
  const {
    notes,
    savedNotes,
    handleMarkForReview,
    handleUnmarkForReview,
    handleMarkSavedNoteForReview,
    handleUnmarkSavedNoteForReview,
  } = useContext(NotesContext);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const filteredNotes = notes.filter((note) => note.markedForReview);
  const filteredSavedNotes = savedNotes.filter(
    (savedNote) => savedNote.savedNote.markedForReview
  );

  return (
    <>
      <Tabs defaultValue="Normal" className="w-full flex flex-col">
        <TabsList className="self-end mb-4">
          <TabsTrigger value="Normal" onClick={() => handleTabClick("Normal")}>
            My Notes
          </TabsTrigger>
          <TabsTrigger value="Saved" onClick={() => handleTabClick("Saved")}>
            Saved Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Normal">
          <div className="grid reviewList min-h-20 grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-min gap-2">
            {!filteredSavedNotes.length && (
              <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
                Your Review List Appears here
              </p>
            )}
            {filteredNotes.map((note) => (
              <MyReviewNote
                key={note._id}
                note={note}
                handleMarkForReview={handleMarkForReview}
                handleUnmarkForReview={handleUnmarkForReview}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="Saved">
          <div className="grid reviewList min-h-20 grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows-min gap-2">
            {!filteredSavedNotes.length && (
              <p className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-sm text-neutral-300 text-center">
                Your Saved Notes Review List Appears here
              </p>
            )}
            {filteredSavedNotes.map((savedNote) => (
              <MySavedReviewNote
                key={savedNote.savedNote._id}
                savedNote={savedNote.savedNote}
                originalNoteId={savedNote.originalNote}
                handleMarkForReview={handleMarkSavedNoteForReview}
                handleUnmarkForReview={handleUnmarkSavedNoteForReview}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default ReviewList;
