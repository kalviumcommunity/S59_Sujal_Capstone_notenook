import React from "react";
import MyNote from "./MyNote";
import { Link } from "react-router-dom";
import "../css/MyNoteList.css";

const placeHolderData = [
  {
    _id: "123456789",
    user: {
      username: "john_doe",
    },
    title: "The Hack CPU",
    subject: "BOCS",
    fileReference: null,
    document: {
      text: "This is the test Note Data",
    },
    createdAt: "2024-03-19T18:50:41.312+00:00",
    updatedAt: "2024-03-19T18:50:41.312+00:00",
  },
  {
    _id: "123456789",
    user: {
      username: "john_doe",
    },
    title: "The Hack CPU",
    subject: "BOCS",
    fileReference: null,
    document: {
      text: "This is the test Note Data",
    },
    createdAt: "2024-03-19T18:50:41.312+00:00",
    updatedAt: "2024-03-19T18:50:41.312+00:00",
  },
  {
    _id: "123456789",
    user: {
      username: "john_doe",
    },
    title: "The Hack CPU",
    subject: "BOCS",
    fileReference: null,
    document: {
      text: "This is the test Note Data",
    },
    createdAt: "2024-03-19T18:50:41.312+00:00",
    updatedAt: "2024-03-19T18:50:41.312+00:00",
  },
];

function MyNoteList() {
  return (
    <div className="myNoteList">
      <div className="flex  w-full justify-between">
        <h1 className="heading">My Notes</h1>
        <Link to={"newNote"}>
          <button className="button">New Note</button>
        </Link>
      </div>
      <div className="notes">
        {placeHolderData.map((note) => {
          return <MyNote note={note} />;
        })}
      </div>
    </div>
  );
}

export default MyNoteList;
