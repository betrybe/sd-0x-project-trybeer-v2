import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import OrderCard from '../../components/admin/OrderCard';
import AdminSideBar from '../../components/admin/AdminSideBar';
import checkLogin from '../../services/checkLogin';
import '../../styles/AdminOrders.css';

export default function AdminOrders({ history }) {
  const [ordersData, setOrdersData] = useState([]);
  useEffect(() => {
    const token = checkLogin(history);

    const getOrders = async () => {
      const ordersInfo = await axios({
        baseURL: 'http://localhost:3001/sales',
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .catch(({ response: { status } }) => status === 401 && history.push('/login'));
      return ordersInfo && setOrdersData(ordersInfo.data);
    };

    getOrders();
  }, [setOrdersData, history]);

  return (
    <div className="admin-orders-page-container">
      <AdminSideBar />
      <div className="admin-orders-content">
        <h1 className="admin-orders-header">Pedidos</h1>
        <div className="admin-orders-container">
          {ordersData && ordersData.length !== 0 && ordersData.map((order, index) => (
            <div className="admin-orders-card" key={order.saleId}>
              <OrderCard orders={order} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

AdminOrders.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
