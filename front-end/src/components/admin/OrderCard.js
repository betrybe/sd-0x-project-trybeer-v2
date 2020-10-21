import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminOrderCard.css';
import PropTypes from 'prop-types';
import formatPriceFunc from '../../services/formatPriceFunc';

export const getStatusColor = (status) => {
  if (status === 'Pendente') return { color: 'red' };
  if (status === 'Preparando') return { color: 'yellow' };
  if (status === 'Entregue') return { color: 'green' };
  return console.error('Status desconhecido.');
};

export default function OrderCard({
  orders: {
    totalPrice, status, saleId, deliveryNumber, deliveryAddress,
  }, index,
}) {
  return (
    <Link to={`/admin/orders/${saleId}`} className="order-card-link">
      <div className="order-card-container">
        <div className="order-card-top-content">
          <div className="order-card-text" data-testid={`${index}-order-number`}>
            {`Pedido ${saleId}`}
          </div>
          <div className="order-card-address-container">
            <span className="order-card-address" data-testid={`${index}-order-address`}>
              {`${deliveryAddress}, ${deliveryNumber}`}
            </span>
          </div>
        </div>
        <div className="order-card-bot-content">
          <div className="order-card-text" data-testid={`${index}-order-total-value`}>
            {formatPriceFunc(totalPrice)}
          </div>
          <div className="order-card-status-content">
            <span data-testid={`${index}-order-status`} className="order-card-status" style={getStatusColor(status)}>{status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

OrderCard.propTypes = {
  orders: PropTypes.shape({
    totalPrice: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    saleId: PropTypes.number.isRequired,
    deliveryNumber: PropTypes.string.isRequired,
    deliveryAddress: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
