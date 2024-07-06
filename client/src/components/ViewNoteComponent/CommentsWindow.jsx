import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, gql, useSubscription } from "@apollo/client";

import Comment from "./Comment";
import MyComment from "./MyComment";
import CommentInput from "./CommentInput";
import ActionLoader from "../Loaders/ActionLoader";

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
  mutation DeleteComment($commentId: ID!, $noteId: ID!) {
    deleteComment(commentId: $commentId, noteId: $noteId) {
      success
      message
    }
  }
`;

const COMMENT_ADDED = gql`
  subscription CommentAdded($noteId: ID!) {
    commentAdded(noteId: $noteId) {
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

const COMMENT_DELETED = gql`
  subscription CommentDeleted($noteId: ID!) {
    commentDeleted(noteId: $noteId) {
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

  const { data: addedCommentData } = useSubscription(COMMENT_ADDED, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  const { data: deletedCommentData } = useSubscription(COMMENT_DELETED, {
    variables: { noteId },
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
  });

  useEffect(() => {
    if (addedCommentData) {
      refetch();
    }
  }, [addedCommentData, refetch]);

  useEffect(() => {
    if (deletedCommentData) {
      refetch();
    }
  }, [deletedCommentData, refetch]);

  if (loading) {
    return <ActionLoader action={"Loading comments..."} />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        {error}
      </p>
    );
  }

  const comments = data.getCommentsByNoteId;

  const myComments = comments.filter(
    (comment) => comment.postedBy?._id === user?._id
  );

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ variables: { commentId, noteId } });
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
    <div className="flex page commentWindow flex-col w-full justify-between items-center absolute top-0 backdrop-blur-sm">
      <div className="flex justify-between items-center h-[75px] w-[500px] max-w-[95vw] mb-2">
        <h2 className="heading">Comments</h2>
        <button className="button" onClick={toggleCommentsView}>
          {showMyComments ? "Show All Comments" : "Show My Comment"}
        </button>
      </div>
      <div className="comments h-calc(100%-170px) overflow-y-scroll w-[500px] max-w-[90vw] rounded-md">
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
      <div className="w-[500px] max-w-[95vw] h-[75px] mt-2">
        <CommentInput
          noteId={noteId}
          handleCommentPosted={handleCommentPosted}
        />
      </div>
    </div>
  );
}

export default CommentsWindow;
