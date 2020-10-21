import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminSideBar from '../../components/admin/AdminSideBar';
import checkLogin from '../../services/checkLogin';
import './AdminChat.css';

const token = checkLogin();

const Conversations = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const requestChats = async () => {
      const { data } = await axios({
        baseURL: 'http://localhost:3001/users/chat',
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setChats(data);
    };
    requestChats();
  }, []);

  return (
    <div className="containerAllChats">
      <AdminSideBar />
      <div className="all-chats-container">
        {chats.length === 0
          ? (
            <div className="noMsg" data-testid="text-for-no-conversation">
              Nenhuma conversa por aqui
            </div>
          )
          : chats.map(({ email, time }) => (
            <div className="containerChat" key={time} data-testid="containerChat">
              <Link to={{ pathname: '/admin/chat', state: { email } }}>
                <div className="containerEmail" data-testid="profile-name">
                  {email}
                </div>
              </Link>
              <div className="containerTime" data-testid="last-message">
                {`Última mensagem às ${new Date(time)
                  .toLocaleTimeString([], { timeStyle: 'short' })}`}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Conversations;
