import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

import '../styles/Login.css';

const MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const loginRedirect = ({
  data: {
    name, email, token, role,
  },
}, history) => {
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify({
    name, email, token, role,
  }));
  if (role === 'administrator') return history.push('/admin/orders');
  return history.push('/products');
};

const sendLoginRequest = async (email, password, setErrorMessage, history) => {
  const loginData = await axios({
    baseURL: 'http://localhost:3001/login',
    method: 'post',
    data: {
      email,
      password,
    },
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
    .catch(({ response }) => response);

  if (!loginData) return setErrorMessage('Error: Falha de Conexão');

  return loginData.data.error
    ? setErrorMessage(`Error: ${loginData.status}. ${loginData.data.error.message}`)
    : loginRedirect(loginData, history);
};

const renderPage = (interactiveFormField, formValidation, [
  emailData,
  passData,
  isEmailGood,
  isPasswordGood,
  setShouldRegister,
  errorMessage,
  setErrorMessage,
  history,
]) => (
  <div className="login-page">
    <div className="error-div">{errorMessage}</div>
    <div className="form-container">
      <form className="login-form">
        {interactiveFormField('email-input', 'email', formValidation)}
        {interactiveFormField('password-input', 'password', formValidation)}
        <button
          type="button"
          className="login-btn"
          disabled={!(isEmailGood && isPasswordGood)}
          data-testid="signin-btn"
          onClick={(e) => {
            e.preventDefault();
            sendLoginRequest(emailData, passData, setErrorMessage, history);
          }}
        >
          ENTRAR
        </button>
      </form>
    </div>
    <div className="no-account-btn-container">
      <button
        type="button"
        data-testid="no-account-btn"
        className="no-account-btn"
        onClick={() => setShouldRegister(true)}
      >
        Ainda não tenho conta
      </button>
    </div>
  </div>
);

const formValidation = (
  [type, value],
  setPassData,
  setIsPasswordGood,
  setEmailData,
  setIsEmailGood,
) => {
  if (type === 'password') {
    setPassData(value);
    if (value.length >= 6) return setIsPasswordGood(true);
    return setIsPasswordGood(false);
  }
  setEmailData(value);
  const isMailValid = value.match(MAIL_REGEX);
  if (isMailValid !== null) return setIsEmailGood(true);
  return setIsEmailGood(false);
};

const LoginScreen = (props) => {
  const [emailData, setEmailData] = useState('');
  const [passData, setPassData] = useState('');
  const [isEmailGood, setIsEmailGood] = useState(false);
  const [isPasswordGood, setIsPasswordGood] = useState(false);
  const [shouldRegister, setShouldRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { history } = props;

  if (shouldRegister) return <Redirect to="/register" />;

  const interactiveFormField = (formName, type, formVal) => (
    <label className="form-label" htmlFor={formName}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
      <br />
      <input
        type={type}
        id={formName}
        className="form-field"
        data-testid={formName}
        onChange={(e) => formVal(
          [type, e.target.value],
          setPassData,
          setIsPasswordGood,
          setEmailData,
          setIsEmailGood,
        )}
      />
    </label>
  );

  return renderPage(
    interactiveFormField,
    formValidation,
    [
      emailData,
      passData,
      isEmailGood,
      isPasswordGood,
      setShouldRegister,
      errorMessage,
      setErrorMessage,
      history,
    ],
  );
};

export default withRouter(LoginScreen);
