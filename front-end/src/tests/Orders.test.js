import React from 'react';
import {
  fireEvent, cleanup, wait,
} from '@testing-library/react';
import axios from 'axios';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history'
import Provider from '../context/TrybeerContext';
import Orders from '../pages/client/Orders';
import formatDateFunc from '../services/formatDateFunc';
import formatPriceFunc from '../services/formatPriceFunc';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory();

const usersMock = {
  email: 'johnatas.henrique@gmail.com',
  name: 'Johnatas Henrique',
  role: 'client',
  token: '123456',
};

const usersMockWithoutToken = {
  email: 'johnatas.henrique@gmail.com',
  name: 'Johnatas Henrique',
  role: 'client',
};

const ordersMock = {
  data: [
    {
      saleId: 5, totalPrice: 49.35, saleDate: 1596225708000, formattedPrice: 'R$&nbsp;49,35',
    },
    {
      saleId: 6, totalPrice: 40.65, saleDate: 1596225873000, formattedPrice: 'R$&nbsp;40,65',
    },
    {
      saleId: 7, totalPrice: 59.15, saleDate: 1596225935000, formattedPrice: 'R$&nbsp;59,15',
    },
  ],
};

const dataError = {
  response: {
    status: 404,
    data: {
      error: {
        message: 'No sale was found.',
      },
    },
  },
};

jest.mock('axios');

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Testing Orders Page', () => {
  test('Testing if itens appears and click an item', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    axios.mockResolvedValueOnce(ordersMock);
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Orders />
      </Provider>,
    );
    await wait();
    ordersMock.data.forEach((order, index) => {
      const formattedDate = formatDateFunc(order.saleDate);
      expect(queryByTestId(`${index}-order-number`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-order-number`).innerHTML).toBe(`Pedido ${order.saleId}`);
      expect(queryByTestId(`${index}-order-date`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-order-date`).innerHTML).toBe(formattedDate);
      expect(queryByTestId(`${index}-order-total-value`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-order-total-value`).innerHTML).toBe(order.formattedPrice);
    });
  });

  test('if axios is rejected', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    axios.mockRejectedValueOnce(dataError);
    const { getByText } = renderWithRouter(
      <Provider>
        <Orders />
      </Provider>,
    );
    await wait();
  });

  test('if page changes when user clicks an item', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    axios.mockResolvedValueOnce(ordersMock);
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Orders />
      </Provider>,
    );
    await wait();
    expect(queryByTestId('1-order-number')).toBeInTheDocument();
    fireEvent.click(queryByTestId('1-order-number'));
    expect(history.location.pathname).toBe('/orders/6');
  });

  test('if user is logged', async () => {
    localStorage.setItem('user', JSON.stringify(usersMockWithoutToken));
    axios.mockResolvedValueOnce(ordersMock);
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Orders />
      </Provider>,
    );
    await wait();
    expect(history.location.pathname).toBe('/login');
  });
});
