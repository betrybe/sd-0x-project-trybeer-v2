import React from 'react';
import { fireEvent, wait } from '@testing-library/react';
import axios from 'axios';
import { createMemoryHistory } from 'history'
import Provider from '../context/TrybeerContext';
import Profile from '../pages/client/Profile';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory();


const usersMock = {
  email: 'jctaraujo@hotmail.com',
  name: 'Julio Cezar',
  role: 'client',
  token: '12345677',
};

const usersMockWithoutToken = {
  email: 'jctaraujo@hotmail.com',
  name: 'Julio Cezar',
  role: 'client',
};

const data = {
  data: {
    qualquer: 'coisa',
  },
};

const dataError = {
  response: {
    status: 404,
    data: {
      error: {
        message: 'expired',
      },
    },
  },
};

jest.mock('axios');

beforeEach(() => localStorage.clear());

describe('Testando funcionamento da pagina de profile', () => {
  test('Testing if Fetch API is working', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    history.push('/profile');
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );
    expect(queryByTestId('profile-save-btn')).toBeInTheDocument();
    expect(queryByTestId('profile-save-btn').innerHTML).toBe('Salvar');
    expect(queryByTestId('profile-save-btn').disabled).toBeTruthy();
    expect(queryByTestId('profile-name-input')).toBeInTheDocument();
    expect(queryByTestId('profile-name-input').value).toBe('Julio Cezar');
    expect(queryByTestId('profile-email-input')).toBeInTheDocument();
    expect(queryByTestId('profile-email-input').value).toBe('jctaraujo@hotmail.com');
    expect(queryByTestId('profile-email-input').readOnly).toBeTruthy();

    const inputName = queryByTestId('profile-name-input');
    const saveBtn = queryByTestId('profile-save-btn');

    fireEvent.change(inputName, { target: { value: 'Julio' } });
    expect(queryByTestId('profile-name-input').value).toBe('Julio');
    expect(queryByTestId('profile-save-btn').disabled).toBeFalsy();
    axios.mockImplementationOnce(() => Promise.resolve(data));
    fireEvent.click(saveBtn);
    await wait();
  });

  it('fetches erroneously data from an API', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    history.push('/profile');
    const { queryByTestId } = renderWithRouter(
      <Profile />,
    );
    expect(queryByTestId('profile-save-btn')).toBeInTheDocument();
    expect(queryByTestId('profile-save-btn').innerHTML).toBe('Salvar');
    expect(queryByTestId('profile-save-btn').disabled).toBeTruthy();
    expect(queryByTestId('profile-name-input')).toBeInTheDocument();
    expect(queryByTestId('profile-name-input').value).toBe('Julio Cezar');
    expect(queryByTestId('profile-email-input')).toBeInTheDocument();
    expect(queryByTestId('profile-email-input').value).toBe('jctaraujo@hotmail.com');
    expect(queryByTestId('profile-email-input').readOnly).toBeTruthy();

    const inputName = queryByTestId('profile-name-input');
    const saveBtn = queryByTestId('profile-save-btn');

    fireEvent.change(inputName, { target: { value: 'Julio' } });
    expect(queryByTestId('profile-name-input').value).toBe('Julio');
    expect(queryByTestId('profile-save-btn').disabled).toBeFalsy();
    axios.mockImplementationOnce(() => Promise.reject(dataError));
    fireEvent.click(saveBtn);
    await wait();
    expect(history.location.pathname).toBe('/login');
  });
  test('if user is logged', () => {
    localStorage.setItem('user', JSON.stringify(usersMockWithoutToken));
    history.push('/profile');
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );
    expect(history.location.pathname).toBe('/login');
  });
});
