import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import '../styles/OrdersCard.css';
import formatDateFunc from '../services/formatDateFunc';
import formatPriceFunc from '../services/formatPriceFunc';

const ENDPOINT = 'http://localhost:5000/';
const socket = socketIOClient(ENDPOINT);

export const connectStoreDatabase = (orderData, setOrderData) => socket
  .on(`${orderData.saleId}`, (status) => {
    setOrderData((state) => ({ ...state, status }));
  });

const redirectToDetailsPage = (orderId, history) => {
  history.push(`/orders/${orderId}`);
};

function OrdersCard({ history, orders, index }) {
  const formattedPrice = formatPriceFunc(orders.totalPrice);
  const formattedDate = formatDateFunc(orders.saleDate);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    setOrderData(orders);
  }, [setOrderData, orders]);

  useEffect(() => {
    connectStoreDatabase(orderData, setOrderData);

    return (() => {
      socket.emit('disconnect');
    });
  }, [orderData, setOrderData]);

  return (
    <button
      type="button"
      className="order-card-container"
      onClick={() => redirectToDetailsPage(orderData.saleId, history)}
    >
      <div className="order-card-top-content">
        <div data-testid={`${index}-order-number`} className="order-card-text">
          {`Pedido ${orderData.saleId}`}
        </div>
        <div className="order-card-text" data-testid={`${index}-order-date`}>
          {formattedDate}
        </div>
      </div>
      <div className="order-card-bot-content">
        <div className="order-card-text" data-testid={`${index}-order-total-value`}>
          {formattedPrice}
        </div>
      </div>
      {orderData.status}
    </button>
  );
}

export default withRouter(OrdersCard);

OrdersCard.propTypes = {
  orders: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
