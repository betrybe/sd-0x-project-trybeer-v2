import React from 'react';
import { cleanup, wait } from '@testing-library/react';
import axios from 'axios';
import { createMemoryHistory } from 'history'
import Provider from '../context/TrybeerContext';
import OrderDetails from '../pages/client/OrderDetails';
import formatDateFunc from '../services/formatDateFunc';
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

const orderMock = {
  data: [
    {
      saleId: 7,
      name: 'Antarctica Pilsen 300ml',
      quantity: '9',
      price: 2.49,
      totalPrice: 49.35,
      saleDate: 1596225935000,
      formattedPrice: 'R$&nbsp;2,49',
      formattedTotalPrice: 'R$&nbsp;49,35',
      totalProduct: 'R$&nbsp;22,41',
    },
    {
      saleId: 7,
      name: 'Skol Beats Senses 313ml',
      quantity: '6',
      price: 4.49,
      totalPrice: 49.35,
      saleDate: 1596225935000,
      formattedPrice: 'R$&nbsp;4,49',
      formattedTotalPrice: 'R$&nbsp;49,35',
      totalProduct: 'R$&nbsp;26,94',
    },
  ],
};

jest.mock('axios');

beforeEach(() => {
  cleanup();
  localStorage.clear();
});

const orderId = 7;

describe('Testing Order Details Page', () => {
  test('Testing if elements appears', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    history.push('/orders/7');

    axios.mockResolvedValueOnce(orderMock);
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <OrderDetails match={{ params: { id: orderId } }} />
      </Provider>,
    );
    await wait();

    const saleMock = orderMock.data[0];
    expect(history.location.pathname).toBe('/orders/7');
    expect(queryByTestId('order-number')).toBeInTheDocument();
    expect(queryByTestId('order-date')).toBeInTheDocument();

    const formattedDate = formatDateFunc(saleMock.saleDate);
    expect(queryByTestId('order-date').innerHTML).toBe(formattedDate);
    expect(queryByTestId('order-total-value')).toBeInTheDocument();
    expect(queryByTestId('order-total-value').innerHTML).toBe(`Total: ${saleMock.formattedTotalPrice}`);

    orderMock.data.forEach((order, index) => {
      expect(queryByTestId(`${index}-product-qtd`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe(`${order.quantity} -`);
      expect(queryByTestId(`${index}-product-name`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-product-name`).innerHTML).toBe(order.name);
      expect(queryByTestId(`${index}-product-total-value`)).toBeInTheDocument();
      expect(queryByTestId(`${index}-product-total-value`).innerHTML).toBe(order.totalProduct);
    });
  });

  test('if axios is rejected', async () => {
    localStorage.setItem('user', JSON.stringify(usersMock));
    axios.mockRejectedValueOnce(dataError);
    const { getByText } = renderWithRouter(
      <Provider>
        <OrderDetails match={{ params: { id: orderId } }} />
      </Provider>,
    );
    await wait();
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  test('if user is Logged', async () => {
    localStorage.setItem('user', JSON.stringify(usersMockWithoutToken));
    axios.mockResolvedValueOnce(orderMock);
    renderWithRouter(
      <Provider>
        <OrderDetails match={{ params: { id: orderId } }} />
      </Provider>,
    );
    await wait();
    expect(history.location.pathname).toBe('/login');
  });
});
