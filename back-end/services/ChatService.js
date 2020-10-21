const ChatModel = require('../mongoModels/ChatModel');

const errorMsgNotSaved = { error: true, message: 'Message not saved', code: 'bad_request' };
const errorNotFound = { error: true, message: 'Messages not found', code: 'not_found' };

const clientAdminMessage = async (message, email) => {
  const existEmail = await ChatModel.emailSchemaExist(email);
  if (!existEmail) {
    try {
      return ChatModel.registerMessages(message, email);
    } catch (err) {
      throw errorMsgNotSaved;
    }
  }
  try {
    return ChatModel.updateEmailMessage(email, message);
  } catch (err) {
    throw errorMsgNotSaved;
  }
};

const adminClientMessage = async (message, emailClient) => {
  try {
    const modelAnswer = await ChatModel.updateAdminMessage(message, emailClient);
    return modelAnswer;
  } catch (err) {
    throw errorMsgNotSaved;
  }
};

const getAllChats = async () => {
  try {
    const modelAnswer = await ChatModel.getAllChats();
    return modelAnswer;
  } catch (err) {
    throw errorNotFound;
  }
};

const getChatByEmail = async (email, role, userEmail) => {
  if (role === 'client' && email !== userEmail) {
    const error = { error: true, message: 'You do not have permission', code: 'unauthorized' };
    throw error;
  }
  try {
    const modelAnswer = await ChatModel.findClientByEmail(email);
    return modelAnswer;
  } catch (err) {
    throw errorNotFound;
  }
};

module.exports = {
  clientAdminMessage,
  adminClientMessage,
  getAllChats,
  getChatByEmail,
};
