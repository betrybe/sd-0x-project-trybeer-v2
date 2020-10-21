import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history'
import Profile from '../pages/admin/Profile';
import Provider from '../context/TrybeerContext';
import renderWithRouter from '../services/renderWithRouter';

const history = createMemoryHistory();

const administratorUser = {
  name: 'Felipe Andrade',
  email: 'lipe@lipe.com',
  password: '123456',
  role: 'administrator',
};

afterEach(cleanup);

beforeEach(() => {
  localStorage.clear();
});

describe('Tests for Admin Profile', () => {
  test('Verify HTML elements appears on page', () => {
    localStorage.setItem('user', JSON.stringify(administratorUser));
    const { queryByTestId } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );

    const userName = queryByTestId('profile-name');
    const userEmail = queryByTestId('profile-email');
    const ordersLink = queryByTestId('side-menu-item-orders');
    const profileLink = queryByTestId('side-menu-item-profile');
    const logoutLink = queryByTestId('side-menu-item-logout');

    expect(userName).toBeInTheDocument();
    expect(userName.localName).toBe('div');

    expect(userEmail).toBeInTheDocument();
    expect(userEmail.localName).toBe('div');

    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink.localName).toBe('p');

    expect(profileLink).toBeInTheDocument();
    expect(profileLink.localName).toBe('p');

    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink.localName).toBe('p');
  });

  test('Verify lateral side bar funcionatily buttons', () => {
    localStorage.setItem('user', JSON.stringify(administratorUser));
    const { queryByTestId } = renderWithRouter(
      <Profile />,
    );

    const ordersLink = queryByTestId('side-menu-item-orders');
    const profileLink = queryByTestId('side-menu-item-profile');
    const logoutLink = queryByTestId('side-menu-item-logout');

    fireEvent.click(ordersLink);
    expect(history.location.pathname).toBe('/admin/orders');
    fireEvent.click(profileLink);
    expect(history.location.pathname).toBe('/admin/profile');
    fireEvent.click(logoutLink);
    expect(history.location.pathname).toBe('/login');
  });

  test('Verify useEffect redirect', () => {
    const { queryByTestId } = renderWithRouter(<Profile />);

    const ordersLink = queryByTestId('side-menu-item-orders');
    expect(ordersLink).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/login');
  });
});
