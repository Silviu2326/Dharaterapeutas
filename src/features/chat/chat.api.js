// TODO: Implement chat API functions

export const getConversations = async () => {
  // TODO: Fetch conversations list
  return { conversations: [] };
};

export const getMessages = async (conversationId) => {
  // TODO: Fetch messages for a conversation
  return { messages: [] };
};

export const sendMessage = async (conversationId, message) => {
  // TODO: Send a message
  return { success: true, message };
};

export const markAsRead = async (conversationId) => {
  // TODO: Mark conversation as read
  return { success: true };
};