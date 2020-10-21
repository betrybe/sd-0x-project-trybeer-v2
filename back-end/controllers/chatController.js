const rescue = require('express-rescue');
const ChatService = require('../services/ChatService');

const clientAdminMessage = rescue(async (req, res) => {
  const { message, userData: { email } } = req.body;
  await ChatService.clientAdminMessage(message, email);
  return res.status(200).end();
});

const adminClientMessage = rescue(async (req, res) => {
  const { message, emailClient } = req.body;
  await ChatService.adminClientMessage(message, emailClient);
  return res.status(200).end();
});

const getAllChats = rescue(async (_req, res) => {
  const serviceAnswer = await ChatService.getAllChats();
  return res.status(200).json(serviceAnswer);
});

const getChatByEmail = rescue(async (req, res) => {
  const { email } = req.params;
  const { role, email: userEmail } = req.user;
  const serviceAnswer = await ChatService.getChatByEmail(email, role, userEmail);
  return res.status(200).json(serviceAnswer);
});

module.exports = {
  clientAdminMessage,
  adminClientMessage,
  getAllChats,
  getChatByEmail,
};
