import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/Comments.css";
import Comment from "./Comment";
import MyComment from "./MyComment";
import { UserContext } from "../../context/userContext";

function CommentsWindow() {
  const [comments, setComments] = useState([]);
  const [showMyComments, setShowMyComments] = useState(false);
  const { user } = useContext(UserContext);
  const { documentId: noteId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_REACT_APP_GRAPHQL_ENDPOINT,
          {
            query: `
            query GetCommentsByNoteId($noteId: ID!) {
              getCommentsByNoteId(noteId: $noteId) {
                _id
                postedBy {
                  _id
                  username
                }
                comment
                updatedAt
              }
            }
          `,
            variables: { noteId },
          }
        );

        setComments(response.data.data.getCommentsByNoteId);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [noteId]);

  const myComment = comments.find(
    (comment) => comment.postedBy._id === user?._id
  );

  const toggleCommentsView = () => {
    setShowMyComments(!showMyComments);
  };

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h2 className="heading">Comments</h2>
        <button className="button" onClick={toggleCommentsView}>
          {showMyComments ? "Show All Comments" : "Show My Comment"}
        </button>
      </div>
      <div className="comments">
        {showMyComments ? (
          myComment ? (
            <MyComment comment={myComment} />
          ) : (
            <p>No comments from you yet.</p>
          )
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </>
  );
}

export default CommentsWindow;
