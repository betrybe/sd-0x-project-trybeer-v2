import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MessageBox, ListItem, requestChats } from './admin/AdminChat';
import checkLogin from '../services/checkLogin';
import './Chat.css';

const ENDPOINT = 'http://localhost:5000/';
const socket = socketIOClient(ENDPOINT);

const clientPostMessage = async (value, history, userData) => {
  const token = checkLogin(history);

  return axios({
    baseURL: 'http://localhost:3001/users/chat',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    data: { message: value, userData },
  });
};

const submitClientForm = async (e, value, clearInput, history, userData) => {
  e.preventDefault();
  await clientPostMessage(value, history, userData);
  socket.emit('receivedMsg', { message: value, userData });
  clearInput('');
};

const infoForm = (chatValue, setChatValue) => (
  <div className="containerInput">
    <input data-testid="message-input"
      className="messageInput"
      value={chatValue}
      onChange={(e) => setChatValue(e.target.value)}
    />
  </div>
);

const ClientFormList = ({ history, userData }) => {
  const [chatValue, setChatValue] = useState('');
  return (
    <form action="">
      {infoForm(chatValue, setChatValue)}
      <div className="buttonContainer">
        <button
          type="submit"
          data-testid="send-message"
          onClick={(e) => submitClientForm(e, chatValue, setChatValue, history, userData)}
        >
          Send
        </button>
      </div>
    </form>
  );
};

const ClientChat = ({ history }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket.on(`${userData.email}client`, (message) => {
      setChatMessages((state) => [...state, message]);
    });
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await requestChats(history, userData.email);
      setChats(allChats);
    };
    fetchChats();
  }, [userData.email, history]);

  return (
    <div className="firstContainer">
      <div className="chatContainer">
        <MessageBox chat={chatMessages} chatHistory={chats || []} />
        <div className="inputMessageContainer">
          <ClientFormList history={history} userData={userData} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(ClientChat);

ListItem.propTypes = {
  value: PropTypes.string.isRequired,
};

MessageBox.propTypes = {
  chat: PropTypes.instanceOf(Object).isRequired,
};

ClientFormList.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  userData: PropTypes.instanceOf(Object).isRequired,
};

ClientChat.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
