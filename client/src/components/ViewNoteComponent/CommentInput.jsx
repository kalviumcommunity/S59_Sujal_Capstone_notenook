import { useState } from "react";
import { useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, gql } from "@apollo/client";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";
import "../../css/ChatComponent.css";

const POST_COMMENT = gql`
  mutation PostComment($noteId: ID!, $comment: String!) {
    postComment(noteId: $noteId, comment: $comment) {
      _id
      comment
      postedBy {
        _id
        username
      }
      updatedAt
    }
  }
`;

const CommentInput = ({ handleCommentPosted }) => {
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { documentId } = useParams();

  const [postComment] = useMutation(POST_COMMENT, {
    context: {
      headers: {
        Authorization: `bearer ${extractTokenFromCookie()}`,
      },
    },
    onCompleted: () => {
      handleCommentPosted();
      setMessageInput("");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error posting comment:", error);
      setIsLoading(false);
    },
  });

  const handleSendMessage = async () => {
    setIsLoading(true);

    try {
      await postComment({
        variables: { noteId: documentId, comment: messageInput },
      });
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="commentInputContainer">
      <input
        type="text"
        className="commentInput"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message here..."
        disabled={isLoading}
      />
      <div className="flex items-center justify-center">
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <button onClick={handleSendMessage} className="commentSendButton">
            <SendIcon fontSize="small" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentInput;
