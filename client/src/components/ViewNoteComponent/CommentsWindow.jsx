import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";

import Comment from "./Comment";
import MyComment from "./MyComment";
import CommentInput from "./CommentInput";
import { UserContext } from "../../context/userContext";
import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/Comments.css";

const GET_COMMENTS_BY_NOTE_ID = gql`
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
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      success
      message
    }
  }
`;

function CommentsWindow() {
  const { user } = useContext(UserContext);
  const { documentId: noteId } = useParams();
  const [showMyComments, setShowMyComments] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_COMMENTS_BY_NOTE_ID, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
    onCompleted: () => {
      refetch();
    },
  });

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (error) {
    return <p>Error loading comments: {error.message}</p>;
  }

  const comments = data.getCommentsByNoteId;

  const myComments = comments.filter(
    (comment) => comment.postedBy?._id === user?._id
  );

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { commentId } });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentPosted = () => {
    refetch();
  };

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
          myComments.length > 0 ? (
            myComments.map((comment) => (
              <MyComment
                key={comment._id}
                comment={comment}
                deleteComment={handleDeleteComment}
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
      <CommentInput noteId={noteId} handleCommentPosted={handleCommentPosted} />
    </>
  );
}

export default CommentsWindow;
