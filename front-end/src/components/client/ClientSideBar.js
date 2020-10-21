import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TrybeerContext } from '../../context/TrybeerContext';
import '../../styles/ClientSideBar.css';

const redirectButton = (history, setShowSideMenu, route) => {
  setShowSideMenu(false);
  if (route === '/login') localStorage.removeItem('user');
  history.push(`${route}`);
};

const SideBar = ({ history }) => {
  const { sideMenu: [showSideMenu, setShowSideMenu] } = useContext(TrybeerContext);
  const redirect = (route) => redirectButton(history, setShowSideMenu, route);
  return (!showSideMenu) || (
    <div className="side-menu-container">
      <div className="side-menu-top-container">
        <button type="button" data-testid="side-menu-item-products" onClick={() => redirect('/products')}>
          Produtos
        </button>
        <button type="button" data-testid="side-menu-item-my-orders" onClick={() => redirect('/orders')}>
          Meus Pedidos
        </button>
        <button type="button" data-testid="side-menu-item-my-profile" onClick={() => redirect('/profile')}>
          Meu Perfil
        </button>
        <button type="button" data-testid="side-menu-chat" onClick={() => redirect('/chat')}>
          Conversar com a loja
        </button>
      </div>
      <div className="side-menu-bot-container">
        <button type="button" data-testid="side-menu-item-logout" onClick={() => redirect('/login')}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default withRouter(SideBar);

SideBar.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
