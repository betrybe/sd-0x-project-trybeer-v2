import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';
import { connectStoreDatabase } from './OrdersCard';
import formatDateFunc from '../services/formatDateFunc';
import formatPriceFunc from '../services/formatPriceFunc';
import '../styles/OrderCardDetails.css';

const ENDPOINT = 'http://localhost:5000/';
const socket = socketIOClient(ENDPOINT);

const showSaleProducts = ({
  name, price, quantity, saleId,
}) => (
  <div key={name} className="card-details-mid-container">
    <div data-testid={`${saleId}-product-qtd`}>
      {`${quantity} -`}
    </div>
    <div data-testid={`${saleId}-product-name`}>{name}</div>
    <div data-testid={`${saleId}-product-total-value`}>
      {formatPriceFunc(quantity * price)}
    </div>
  </div>
);

const OrderCardDetails = ({ data, id }) => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    setOrderData(data[0]);
  }, [setOrderData, data]);

  useEffect(() => {
    connectStoreDatabase(orderData, setOrderData);

    return (() => {
      socket.emit('disconnect');
    });
  }, [orderData, setOrderData]);

  const formatedDate = formatDateFunc(orderData.saleDate);
  return (
    <div className="card-details-container">
      <div className="card-details-top-container">
        <div data-testid="order-number">{`Pedido ${id}`}</div>
        <div data-testid="order-date">{formatedDate}</div>
      </div>
      {showSaleProducts(orderData)}
      {orderData.status}
      <div data-testid="order-total-value" className="card-details-bot-container">
        {`Total: ${formatPriceFunc(orderData.totalPrice)}`}
      </div>
    </div>
  );
};

export default OrderCardDetails;

OrderCardDetails.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
  id: PropTypes.string.isRequired,
};
