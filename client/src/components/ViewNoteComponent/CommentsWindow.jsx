import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Comment from "./Comment";
import MyComment from "./MyComment";
import CommentInput from "./CommentInput";
import { UserContext } from "../../context/userContext";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/Comments.css";


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
          },
          {
            headers: {
              Authorization: `bearer ${extractTokenFromCookie()}`,
            },
          }
        );

        setComments(response.data.data.getCommentsByNoteId);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [noteId]);

  const myComments = comments.filter(
    (comment) => comment.postedBy?._id === user?._id
  );

  const toggleCommentsView = () => {
    setShowMyComments(!showMyComments);
  };

  const deleteComment = async (commentId) => {
    console.log(commentId)
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_GRAPHQL_ENDPOINT,
        {
          query: `
          mutation DeleteComment($commentId: ID!) {
            deleteComment(commentId: $commentId) {
              success
              message
            }
          }
        `,
          variables: { commentId },
        },
        {
          headers: {
            Authorization: `bearer ${extractTokenFromCookie()}`,
          },
        }
      );

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  const handleCommentPosted = (newComment) => {
    setComments([...comments, newComment]);
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
          myComments.length > 0 ? (
            myComments.map((comment) => (
              <MyComment
                key={comment._id}
                comment={comment}
                deleteComment={deleteComment}
              />
            ))
          ) : (
            <p>No comments from you yet.</p>
          )
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
      <CommentInput noteId={noteId} onCommentPosted={handleCommentPosted} />
    </>
  );
}

export default CommentsWindow;
