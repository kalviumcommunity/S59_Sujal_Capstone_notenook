import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import "../../css/ChatComponent.css";

const AiChatInput = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  isLoading,
}) => {
  return (
    <div className="ai-chat-input">
      <input
        type="text"
        id="ai-messageInput"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message here..."
        disabled={isLoading}
      />
      <div className="flex items-center justify-center">
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <button onClick={handleSendMessage} className="chat-send-button">
            <SendIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default AiChatInput;
