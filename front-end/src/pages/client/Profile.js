import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import '../../styles/Profile.css';

const verifyLocalStorage = () => JSON.parse(localStorage.getItem('user'));

const emailAndNameInputs = (type, text, value, setValue, testId) => (
  <label htmlFor={text} className={`${text}-label`}>
    {text}
    <br />
    <input
      readOnly={(text === 'email') || false}
      type={type}
      name={text}
      defaultValue={value}
      data-testid={testId}
      onChange={({ target }) => setValue((prev) => ({ ...prev, name: target.value }))}
    />
  </label>
);

const sendRequestNewName = async (newUser, setErrorStatus) => {
  const resp = await axios({
    baseURL: 'http://localhost:3001/users/me',
    method: 'patch',
    data: { name: newUser.name },
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: newUser.token,
    },
  })
    .catch(({ response: { status, data: { error: { message } } } }) => setErrorStatus(`Error: ${status}. ${message}`));
  if (resp) {
    localStorage.setItem('user', JSON.stringify(newUser));
    setErrorStatus('Atualização concluída com sucesso');
  }
};

const saveBtn = (disabled, user, setError) => (
  <button
    type="button"
    data-testid="profile-save-btn"
    disabled={disabled}
    onClick={() => sendRequestNewName(user, setError)}
  >
    Salvar
  </button>
);

const Profile = ({ history }) => {
  const [user, setUser] = useState('');
  const [initialUser, setInitialUser] = useState('');
  const [error, setError] = useState('');
  const disabled = user.name === initialUser.name;
  useEffect(() => {
    const isLSExist = verifyLocalStorage();
    if (!isLSExist || !isLSExist.token) history.push('/login');
    setUser(isLSExist);
    setInitialUser(isLSExist);
  }, [setUser, history]);
  if (error.match(/expired/i)) history.push('/login');
  return (
    <div className="profile-container">
      {(error) || <h2>{error}</h2>}
      <div className="profile-top-container">
        {emailAndNameInputs('text', 'name', user.name || '', setUser, 'profile-name-input')}
        {emailAndNameInputs('text', 'email', user.email || '', setUser, 'profile-email-input')}
      </div>
      <div className="profile-bot-container">
        {saveBtn(disabled, user, setError)}
      </div>
    </div>
  );
};

export default withRouter(Profile);

Profile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
