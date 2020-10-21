import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TrybeerContext } from '../context/TrybeerContext';
import useRefreshTotalPrice from '../hooks/useRefreshTotalPrice';
import '../styles/CheckoutButton.css';

function CheckoutButton(props) {
  const { history } = props;
  const { shopCart: [totalQty] } = useContext(TrybeerContext);
  const totalPrice = useRefreshTotalPrice(totalQty);

  return (
    <div className="checkout-bottom-btn-container">
      <button
        type="button"
        data-testid="checkout-bottom-btn"
        className="checkout-bottom-btn"
        onClick={(() => history.push('/checkout'))}
        disabled={!totalPrice}
      >
        <div className="cart-link-container">
          Ver Carrinho
          <div className="total-qty-span-container">
            <span className="total-qty-span" data-testid="checkout-bottom-btn-value">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

export default withRouter(CheckoutButton);

CheckoutButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
