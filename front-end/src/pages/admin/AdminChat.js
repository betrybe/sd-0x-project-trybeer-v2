import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import checkLogin from '../../services/checkLogin';
import AdminSideBar from '../../components/admin/AdminSideBar';
import { ReactComponent as BackButton } from '../../images/back-arrow.svg';

const ENDPOINT_CLIENT = 'http://localhost:5000/';
const socket = socketIOClient(ENDPOINT_CLIENT);
const userData = JSON.parse(localStorage.getItem('user'));
const keyStamp = () => Date.now();

export const requestChats = async (history, email) => {
  const token = checkLogin(history);
  const { data } = await axios({
    baseURL: `http://localhost:3001/users/chat/${email}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  return data;
};

 const adminSubmitForm = async (e, value, clearInput, emailClient, history) => {
  const token = checkLogin(history);
  e.preventDefault();
  await axios({
    baseURL: 'http://localhost:3001/users/admin/chat',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    data: { message: value, emailClient },
  });
  socket.emit('receivedMsg', { message: value, userData, emailClient });

  clearInput('');
}; 

export const ListItem = ({
  user, message, time, name, key
}) => (
  <li className={`${user}-chat-container`}>
    <div className="li-container">
      <div className={`${user}-li-header`} data-testid="nickname">
        <span>{`${name} -`}</span>
      </div>
      <div className={`${user}-li-header`} data-testid="message-time">
        <span>{`- ${time}`}</span>
      </div>
    </div>
    <div className={`${user}-li-body`} data-testid="text-message">
      {message}
    </div>
  </li>
);
export const MessageBox = ({ chat, chatHistory }) => (

  <div className="messagesBox">
    <ul className="ul-container">
      {
        (chatHistory.length === 0)
        || chatHistory[0].messages.map(({ sentMessage, chatName, time }) => (
          <ListItem
            key={`${sentMessage}${keyStamp() * Math.random()}`}
            time={`${new Date().getHours()}:${('0'+new Date().getMinutes()).slice(-2)}`}
            name={chatName}
            message={sentMessage}
            user={(chatName === 'Loja') ? 'admin' : 'client'}
          />
        ))
      }
    </ul>
    <ul className="message-container">
      {
        chat.map((message) => (
          <ListItem
            key={`${message}${keyStamp() * Math.random()}`}
            time={`${new Date().getHours()}:${('0'+new Date().getMinutes()).slice(-2)}`}
            name={message.split(':', 1)}
            message={message.slice(message.split(':', 1)[0].length + 1, message.length)}
            user={'Loja'.match(message.split(':', 1)) ? 'admin' : 'client'}
          />
        ))
      }
    </ul>
  </div>
);

export const FormList = ({ emailClient, history }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <form action="">
      <div className="containerInput">
        <input
          data-testid="message-input"
          className="messageInput"
          value="inputValue"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="buttonContainer">
        <button
          data-testid="send-message"
          type="submit"
          onClick={(e) => adminSubmitForm(e, inputValue, setInputValue, emailClient, history)}
        >
          Send
        </button>
      </div>
    </form>
  );
};

const AdminChat = ({ location: { state: { email } }, history }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    socket.on(`${email}client`, (message) => {
      setChatMessages((state) => [...state, message]);
    });
  }, [email]);

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await requestChats(history, email);
      setChats(allChats);
    };
    fetchChats();
  }, [email, history]);

  return (
    <div className="firstContainer">
      <AdminSideBar />
      <div className="chatContainer">
        <Link to="/admin/chats">
          <BackButton
            className="back-button"
            alt="Back Button - Icons made by Kiranshastry@https://www.flaticon.com/authors/google"
          />
          <div data-testid="back-button" className="back-button-message">{`Coversando com ${email}`}</div>
        </Link>
        <MessageBox chat={chatMessages} chatHistory={chats} />
        <div className="inputMessageContainer">
          <FormList emailClient={email} history={history} />
        </div>
      </div>
    </div>
  );
};

export default withRouter(AdminChat);

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

MessageBox.propTypes = {
  chat: PropTypes.instanceOf(Object).isRequired,
  chatHistory: PropTypes.instanceOf(Array).isRequired,
};

FormList.propTypes = {
  emailClient: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

AdminChat.defaultProps = {
  state: {},
};

AdminChat.propTypes = {
  location: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object).isRequired,
};
