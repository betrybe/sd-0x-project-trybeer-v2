import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import checkLogin from '../../services/checkLogin';
import { getStatusColor } from '../../components/admin/OrderCard';
import formatPriceFunc from '../../services/formatPriceFunc';
import '../../styles/AdminOrderDetails.css';
import AdminSideBar from '../../components/admin/AdminSideBar';

const ENDPOINT = 'http://localhost:5000/';
const socket = socketIOClient(ENDPOINT);

const reqAdminOrder = (thisOrderID, token) => ({
  method: 'get',
  baseURL: `http://localhost:3001/sales/${thisOrderID}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: token,
  },
});

const setStatus = async (saleId, token, setOrderDetails, status) => {
  socket.emit('statusUpdate', { status, saleId });

  await axios({
    method: 'patch',
    baseURL: `http://localhost:3001/sales/${saleId}`,
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
    data: {
      status,
    },
  })
    .catch((err) => console.error(err.response))
    .then(() => setOrderDetails((prevValues) => (
      {
        orderDetails: [...prevValues.orderDetails.map(
          (product) => ({ ...product, status }),
        )],
      }
    )));
};

const renderProductData = (saleId, status, orderDetails, totalPrice) => (
  <>
    <div className="orders-details-header">
      <span data-testid="order-number">{`Pedido ${saleId} - `}</span>
      <span data-testid="order-status" style={getStatusColor(status)}>{status}</span>
    </div>
    <div className="products-container">
      <ul className="products-unordered-list">
        {orderDetails && orderDetails.map(({ quantity, name, price }, index) => (
          <li className="product-list-item" key={`${name}_${index + 1}`}>
            <div className="product-main-info">
              <span data-testid={`${index}-product-qtd`}>{`${quantity} - `}</span>
              <span data-testid={`${index}-product-name`}>{`${name}`}</span>
            </div>
            <div className="product-price-info">
              <span data-testid={`${index}-product-total-value`}>
                {`${formatPriceFunc(price * quantity)}`}
              </span>
              <span className="product-unitary-price">{`  (${formatPriceFunc(price)})`}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="total-value-container">
        <span data-testid="order-total-value" className="order-total-value">
          {`Total: ${formatPriceFunc(totalPrice)}`}
        </span>
      </div>
    </div>
  </>
);

export default withRouter(function AdminOrdersDetails({ history }) {
  const [
    {
      orderDetails,
      orderDetails: [{ totalPrice, status, saleId }],
    }, setOrderDetails] = useState(
    { orderDetails: [{ totalPrice: 0, status: 'Pendente', saleId: 0 }] },
  );

  const [displaySendOrderBtn, setDisplaySendOrderBtn] = useState(true);

  const thisOrderID = Number(history.location.pathname.match(/[0-9]+/g));

  const token = checkLogin(history);

  useEffect(() => {
    const getOrderDetails = async () => {
      const detailsData = await axios(reqAdminOrder(thisOrderID, token))
        .catch((err) => {
          console.error(err.response);
          return err.response.status === 401 && history.push('/login');
        });

      return detailsData && setOrderDetails({ orderDetails: detailsData.data });
    };

    getOrderDetails();
  }, [thisOrderID, token, history]);

  useEffect(() => {
    if (status === 'Entregue') setDisplaySendOrderBtn(false);
  }, [status]);

  return (
    <div className="admin-orders-details-flex-container">
      <AdminSideBar />
      <div className="admin-orders-details-container">
        {renderProductData(saleId, status, orderDetails, totalPrice)}
        {displaySendOrderBtn && (
          <div>
            <button
              type="button"
              data-testid="mark-as-prepared-btn"
              className="mark-as-prepared-btn"
              onClick={() => setStatus(saleId, token, setOrderDetails, 'Preparando')}
            >
              Preparar pedido
            </button>
            <button
              type="button"
              data-testid="mark-as-delivered-btn"
              className="mark-as-delivered-btn"
              onClick={() => setStatus(saleId, token, setOrderDetails, 'Entregue')}
            >
              Marcar como entregue
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
