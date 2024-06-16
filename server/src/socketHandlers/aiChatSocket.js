const {
  authenticateSocketHandshake,
} = require("../middlewares/socketHandshakeAuthentication");

const { AIChatHistoryModel } = require("../models/AIChatHistoryModel");
const { AIChatMessageModel } = require("../models/AIChatMessageModel");
const { getAnswerFromAI } = require("../utils/aiUtils");
const {
  setSocketUserId,
  deleteSocketUserId,
} = require("../utils/socketIdOperations");

let aiChatNamespace = null;

function aiChatSocket(ioNamespace) {
  aiChatNamespace = ioNamespace;

  aiChatNamespace.use(authenticateSocketHandshake);

  aiChatNamespace.on("connection", async (socket) => {
    await setSocketUserId(socket.userId, socket.id);

    try {
      let chatHistory = await AIChatHistoryModel.findOne({
        userId: socket.userId,
      }).populate("messages");

      let messageHistory = [];
      if (chatHistory) {
        messageHistory = chatHistory.messages.map((msg) => [
          msg.role,
          msg.content,
        ]);
      }

      socket.emit("connectionSuccess", {
        message: "You have successfully connected to the AI chat server.",
        history: messageHistory,
      });

      socket.on("sendMessage", async (data) => {
        const { content } = data;
        if (!content) {
          return socket.emit("errorMessage", "Message content is required.");
        }

        try {
          messageHistory.push(["user", content]);

          const assistantMessage = await getAnswerFromAI(messageHistory);

          const userMessage = new AIChatMessageModel({
            role: "user",
            content,
          });
          const assistantResponse = new AIChatMessageModel({
            role: "assistant",
            content: assistantMessage,
          });

          await userMessage.save();
          await assistantResponse.save();

          if (!chatHistory) {
            chatHistory = new AIChatHistoryModel({
              userId: socket.userId,
              messages: [],
            });
          }

          chatHistory.messages.push(userMessage._id);
          chatHistory.messages.push(assistantResponse._id);
          await chatHistory.save();

          messageHistory.push(["assistant", assistantMessage]);

          socket.emit("receiveMessage", {
            assistantMessage: assistantResponse.content,
          });
        } catch (error) {
          console.error("Error handling sendMessage event:", error);
          socket.emit("errorMessage", "Failed to send message.");
        }
      });

      socket.on("disconnect", async () => {
        await deleteSocketUserId(socket.userId);
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      socket.emit("errorMessage", "Failed to fetch chat history.");
    }
  });
}

module.exports = {
  aiChatSocket,
  getAIChatNamespace: () => aiChatNamespace,
};
