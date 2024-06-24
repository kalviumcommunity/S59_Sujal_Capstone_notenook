import { useState } from "react";
import { useParams } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import extractTokenFromCookie from "../../Functions/ExtractTokenFromCookie";

import "../../css/ChatComponent.css";

const CommentInput = ({ onCommentPosted }) => {
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { documentId } = useParams();
  const handleSendMessage = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_GRAPHQL_ENDPOINT,
        {
          query: `
            mutation PostComment($noteId: ID!, $comment: String!) {
              postComment(noteId: $noteId, comment: $comment) {
                _id
                comment
                postedBy {
                  _id
                  username
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { noteId: documentId, comment: messageInput },
        },
        {
          headers: {
            Authorization: `bearer ${extractTokenFromCookie()}`,
          },
        }
      );
      console.log(response);
      onCommentPosted(response.data.data.postComment);
      setMessageInput("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
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
