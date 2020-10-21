import React from 'react';
import { fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import { TrybeerContext } from '../context/TrybeerContext';
import CheckoutButton from '../components/CheckoutButton';
import useRefreshTotalPrice from '../hooks/useRefreshTotalPrice';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory();

const totalQty = 10;

const storeMock = {
  shopCart: [totalQty],
};

jest.mock('../hooks/useRefreshTotalPrice');

describe('Test checkout button component', () => {
  useRefreshTotalPrice.mockReturnValue(10);
  test('if checkout button is enable and redirect to checkout page', () => {
    const { queryByTestId } = renderWithRouter(
      <TrybeerContext.Provider value={storeMock}>
        <CheckoutButton />
      </TrybeerContext.Provider>, 
    );
    expect(queryByTestId('checkout-bottom-btn').disabled).toBeFalsy();
    fireEvent.click(queryByTestId('checkout-bottom-btn'));
    expect(history.location.pathname).toBe('/checkout');
  });
});
