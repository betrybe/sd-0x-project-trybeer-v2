import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history'
import {
  fireEvent, wait, cleanup,
} from '@testing-library/react';
import axios from 'axios';
import Register from '../pages/RegisterPage';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory()

const newUser = {
  name: 'Felipe Andrade',
  email: 'lipe@lipe.com',
  password: '123456',
  role: 'client',
};

const administratorUser = {
  name: 'Felipe Andrade',
  email: 'lipe@lipe.com',
  password: '123456',
  role: 'administrator',
};

const loginAdmUser = {
  data: {
    name: 'Felipe Andrade',
    email: 'lipe@lipe.com',
    password: '123456',
    role: 'sellerData',
  },
};

const loginUser = {
  data: {
    name: 'Felipe Andrade',
    email: 'lipe@lipe.com',
    password: '123456',
    role: 'client',
  },
};

const dataError = {
  response: {
    status: 409,
    data: {
      error: {
        message: 'E-mail already in database.',
      },
    },
  },
};

const dataErrorLogin = {
  response: {
    status: 409,
    data: {
      error: {
        message: 'E-mail not found or password wrong.',
      },
    },
  },
};

jest.mock('axios');

afterEach(cleanup);

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Testing Register Page', () => {
  test('Testing if HTML elements appears', () => {
    const { queryByTestId } = renderWithRouter(
      <Register />,
    );

    const nameInput = queryByTestId('signup-name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.value).toBe('');
    const emailInput = queryByTestId('signup-email');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.value).toBe('');
    const passInput = queryByTestId('signup-password');
    expect(passInput).toBeInTheDocument();
    expect(passInput.value).toBe('');
    const sellInput = queryByTestId('signup-seller');
    expect(sellInput).toBeInTheDocument();
    expect(sellInput.checked).toBeFalsy();
    const signInButton = queryByTestId('signup-btn');
    expect(signInButton).toBeInTheDocument();
    expect(signInButton.disabled).toBeTruthy();
  });

  test('Testing funcionality of HTML elements', async () => {
    const { queryByTestId } = renderWithRouter(
      <Register />,
    );

    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');
    const signInButton = queryByTestId('signup-btn');
    const sellerCheckBox = queryByTestId('signup-seller');

    fireEvent.change(nameInput, { target: { value: 'Felipe' } });
    expect(nameInput.value).toBe('Felipe');
    fireEvent.change(emailInput, { target: { value: 'lipe@.lipe.com' } });
    expect(emailInput.value).toBe('lipe@.lipe.com');
    fireEvent.change(passInput, { target: { value: '12345' } });
    expect(passInput.value).toBe('12345');
    fireEvent.change(sellerCheckBox, { target: { checked: true } });
    expect(sellerCheckBox.checked).toBeTruthy();
    fireEvent.change(sellerCheckBox, { target: { checked: false } });
    expect(sellerCheckBox.checked).toBeFalsy();
    expect(signInButton.disabled).toBeTruthy();
    fireEvent.change(emailInput, { target: { value: 'lipe@lipe.com' } });
    expect(signInButton.disabled).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    expect(signInButton.disabled).toBeTruthy();
    fireEvent.change(passInput, { target: { value: '123456' } });
    expect(signInButton.disabled).toBeFalsy();
  });

  test('Testing Login funcionality Button with client role', async () => {
    const { queryByTestId } = renderWithRouter(
      <Register />,
    );
    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');
    const signInButton = queryByTestId('signup-btn');
    const sellerCheckBox = queryByTestId('signup-seller');

    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    fireEvent.change(emailInput, { target: { value: 'lipe@lipe.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });
    fireEvent.change(sellerCheckBox, { target: { value: 'false' } });
    expect(sellerCheckBox.value).toBe('false');
    expect(sellerCheckBox.checked).toBeFalsy();
    expect(signInButton.disabled).toBeFalsy();
    axios.post.mockImplementationOnce(() => Promise.resolve(newUser));
    axios.mockImplementation(() => Promise.resolve(loginUser));
    fireEvent.click(signInButton);
    await wait();
    expect(history.location.pathname).toBe('/products');
  });

  test('Testing Login funcionality Button with administrator role', async () => {
    const { queryByTestId } = renderWithRouter(
      <Register />,
    );
    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');
    const signInButton = queryByTestId('signup-btn');
    const sellerCheckBox = queryByTestId('signup-seller');

    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    fireEvent.change(emailInput, { target: { value: 'lipe@lipe.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });
    fireEvent.click(sellerCheckBox);
    expect(sellerCheckBox.checked).toBeTruthy();
    expect(signInButton.disabled).toBeFalsy();
    axios.post.mockImplementationOnce(() => Promise.resolve(administratorUser));
    axios.mockImplementationOnce(() => Promise.resolve(loginAdmUser));
    fireEvent.click(signInButton);
    await wait();
    expect(history.location.pathname).toBe('/admin/orders');
  });

  test('Testing if register fail', async () => {
    const { queryByTestId, queryByText } = renderWithRouter(
      <Register />,
    );
    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');
    const signInButton = queryByTestId('signup-btn');
    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    fireEvent.change(emailInput, { target: { value: 'lipe@lipe.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });
    expect(signInButton.disabled).toBeFalsy();
    axios.post.mockImplementationOnce(() => Promise.reject(dataError));
    fireEvent.click(signInButton);
    await wait();
    expect(queryByText(/E-mail already in database./i, { selector: 'h2' })).toBeInTheDocument();
  });

  test('Testing if inputs is valids', async () => {
    const { queryByTestId } = renderWithRouter(
      <Register />,
    );

    window.alert = jest.fn();
    const signInButton = queryByTestId('signup-btn');
    signInButton.disabled = '';
    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');

    expect(signInButton.disabled).toBeFalsy();
    fireEvent.click(signInButton);
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('O nome deve possuir 12 caracteres e sem caracteres especiais');
    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    expect(nameInput.value).toBe('Felipe Andrade');
    signInButton.disabled = '';
    expect(signInButton.disabled).toBeFalsy();
    fireEvent.click(signInButton);
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('A senha deve conter ao menos 6 números');
    fireEvent.change(passInput, { target: { value: '123456' } });
    signInButton.disabled = '';
    expect(signInButton.disabled).toBeFalsy();
    fireEvent.click(signInButton);
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Formato de Email invalido');
    fireEvent.change(emailInput, { target: { value: 'lilipe@lipe.com' } });
    expect(emailInput.value).toBe('lilipe@lipe.com');
    expect(signInButton.disabled).toBeFalsy();
    expect(signInButton.disabled).toBeFalsy();
    axios.post.mockImplementationOnce(() => Promise.resolve(administratorUser));
    fireEvent.click(signInButton);
    expect(history.location.pathname).toBe('/admin/orders');
  });

  test('Testing if Login fail', async () => {
    const { queryByTestId, queryByText } = renderWithRouter(
      <Register />,
    );
    const nameInput = queryByTestId('signup-name');
    const emailInput = queryByTestId('signup-email');
    const passInput = queryByTestId('signup-password');
    const signInButton = queryByTestId('signup-btn');

    fireEvent.change(nameInput, { target: { value: 'Felipe Andrade' } });
    fireEvent.change(emailInput, { target: { value: 'lipe@lipe.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });
    expect(signInButton.disabled).toBeFalsy();
    axios.post.mockImplementationOnce(() => Promise.resolve(loginUser));
    axios.mockImplementationOnce(() => Promise.reject(dataErrorLogin));
    fireEvent.click(signInButton);
    await wait();
    expect(queryByText(/E-mail not found or password wrong/i, { selector: 'h2' })).toBeInTheDocument();
  });
});
