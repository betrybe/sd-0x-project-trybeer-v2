import React from 'react';
import { withRouter, Router } from 'react-router-dom';
import { fireEvent, wait } from '@testing-library/react';
import Provider from '../context/TrybeerContext';
import App from '../App';
import renderWithRouter from '../services/renderWithRouter';


const AppWithRouter = withRouter(App);

describe('testing top menu dont display', () => {
  test('if top menu dont display at route /login', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
          <AppWithRouter />
        </Provider>, { route: '/login'}
    );
    expect(queryByTestId('top-title')).toBeNull();
  });
  test('if top menu dont display at route /register', async () => {
    const { queryByTestId, history } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>
    );
    const noAccountButton = queryByTestId('no-account-btn');
    fireEvent.click(noAccountButton);
    await wait(() => expect(history.location.pathname).toBe('/register'))
    
    expect(queryByTestId('top-title')).toBeNull();
  });
  test('if top menu dont display at route /admin/profile', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/admin/profile'}
    );
    expect(queryByTestId('top-title')).toBeNull();
  });
  test('if top menu dont display at route /admin/orders', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/admin/orders' }
    );
    expect(queryByTestId('top-title')).toBeNull();
  });
});

describe('if top menu display', () => {
  test('if display at /products', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/products' }
    );

    expect(queryByTestId('top-title')).toBeInTheDocument();
    expect(queryByTestId('top-title').innerHTML).toBe('TryBeer');
  });
  test('if display at /orders', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/orders'}
    );
    expect(queryByTestId('top-title')).toBeInTheDocument();
    expect(queryByTestId('top-title').innerHTML).toBe('Meus Pedidos');
  });
  test('if display at /orders/:orderId', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/orders/1'}
    );
    expect(queryByTestId('top-title')).toBeInTheDocument();
    expect(queryByTestId('top-title').innerHTML).toBe('Detalhes de Pedido');
  });
  test('if display at /profile', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/profile'}
    );
    expect(queryByTestId('top-title')).toBeInTheDocument();
    expect(queryByTestId('top-title').innerHTML).toBe('Meu perfil');
  });
  test('if display at /checkout', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/checkout'}
    );
    expect(queryByTestId('top-title')).toBeInTheDocument();
    expect(queryByTestId('top-title').innerHTML).toBe('Finalizar Pedido');
  });
});

describe('display side bar after click hamburguer menu', () => {
  test('if side bar display correctly', () => {
    const { queryByTestId } = renderWithRouter(
        <Provider>
           <AppWithRouter />
        </Provider>, { route: '/products'}
    );
    const hamburguerButton = queryByTestId('top-hamburguer');
    fireEvent.click(hamburguerButton);
    expect(queryByTestId('side-menu-item-products')).toBeInTheDocument();
    expect(queryByTestId('side-menu-item-my-orders')).toBeInTheDocument();
    expect(queryByTestId('side-menu-item-my-profile')).toBeInTheDocument();
    expect(queryByTestId('side-menu-item-logout')).toBeInTheDocument();
  });
});
