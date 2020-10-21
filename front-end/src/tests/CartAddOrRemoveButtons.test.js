import React from 'react';
import { fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import Provider from '../context/TrybeerContext';
import CartAddOrRemoveButtons from '../components/CartAddOrRemoveButtons';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory();

const index = 0;

const product = {
  id: 1,
  name: 'Skol',
  price: 3.33,
  urlImage: 'localhost:3001/Skol',
};

const productMock = [
  {
    id: 2,
    name: 'Brahma',
    price: 3.33,
    urlImage: 'localhost:3001/Brahma',
  },
];

beforeEach(() => localStorage.clear());

describe('testing CartAddOrRemoveButtons', () => {
  test('if component is rendering', () => {
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <CartAddOrRemoveButtons product={product} index={index} />
      </Provider>,
    );
    expect(queryByTestId(`${index}-product-minus`)).toBeInTheDocument();
    expect(queryByTestId(`${index}-product-minus`).tagName).toBe('BUTTON');
    expect(queryByTestId(`${index}-product-qtd`)).toBeInTheDocument();
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('0');
    expect(queryByTestId(`${index}-product-plus`)).toBeInTheDocument();
    expect(queryByTestId(`${index}-product-plus`).tagName).toBe('BUTTON');
  });
  test('if add button and remove button is working', () => {
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <CartAddOrRemoveButtons product={product} index={index} />
      </Provider>,
    );
    const addButton = queryByTestId(`${index}-product-plus`);
    const removeButton = queryByTestId(`${index}-product-minus`);
    fireEvent.click(addButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('1');
    fireEvent.click(addButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('2');
    fireEvent.click(addButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('3');

    fireEvent.click(removeButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('2');
    fireEvent.click(removeButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('1');
    fireEvent.click(removeButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('0');
    fireEvent.click(removeButton);
    expect(queryByTestId(`${index}-product-qtd`).innerHTML).toBe('0');
  });
  test('if localstorage exist with another product', () => {
    localStorage.setItem('cart', JSON.stringify(productMock));
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <CartAddOrRemoveButtons product={product} index={index} />
      </Provider>,
    );
    const addButton = queryByTestId(`${index}-product-plus`);
    const removeButton = queryByTestId(`${index}-product-minus`);
    fireEvent.click(addButton);
  });
});
