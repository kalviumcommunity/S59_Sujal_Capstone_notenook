const { authenticateSocketHandshake } = require("../middlewares/socketHandshakeAuthentication");
const { AIChatHistoryModel } = require("../models/AIChatHistoryModel");
const { AIChatMessageModel } = require("../models/AIChatMessageModel");
const { getAnswerFromAI } = require("../utils/aiUtils");
const { setSocketUserId, deleteSocketUserId } = require("../utils/socketIdOperations");

let aiChatNamespace = null;

function aiChatSocket(ioNamespace) {
  aiChatNamespace = ioNamespace;

  aiChatNamespace.use(authenticateSocketHandshake);

  aiChatNamespace.on("connection", async (socket) => {
    await setSocketUserId(socket.userId, socket.id);

    let chatHistory = await fetchChatHistory(socket.userId);
    let messageHistory = chatHistory ? chatHistory.messages.map(msg => [msg.role, msg.content]) : [];

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

        const [userMessage, assistantResponse] = await saveMessages(content, assistantMessage);

        if (!chatHistory) {
          chatHistory = new AIChatHistoryModel({
            userId: socket.userId,
            messages: [],
          });
        }

        chatHistory.messages.push(userMessage._id, assistantResponse._id);
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
  });
}

async function fetchChatHistory(userId) {
  try {
    return await AIChatHistoryModel.findOne({ userId }).populate("messages").exec();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return null;
  }
}

async function saveMessages(userContent, assistantContent) {
  try {
    const userMessage = new AIChatMessageModel({ role: "user", content: userContent });
    const assistantResponse = new AIChatMessageModel({ role: "assistant", content: assistantContent });

    await Promise.all([userMessage.save(), assistantResponse.save()]);

    return [userMessage, assistantResponse];
  } catch (error) {
    console.error("Error saving messages:", error);
    throw error;
  }
}

module.exports = {
  aiChatSocket,
  getAIChatNamespace: () => aiChatNamespace,
};
