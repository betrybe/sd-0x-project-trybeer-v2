import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import OrdersCard from '../../components/OrdersCard';

const sendRequestOrders = async (setErrorStatus, history) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData || !userData.token) {
    return history.push('/login');
  }

  const { token } = userData;
  const resp = await axios({
    baseURL: 'http://localhost:3001/sales',
    method: 'get',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: token },
  })
    .catch(({ response: { status, data: { error: { message } } } }) => {
      if (status === 404) {
        setErrorStatus('Você ainda não tem nenhum pedido.');
        return true;
      }
      setErrorStatus(`Error: ${status}. ${message}`);
      return true;
    });
  if (!resp) return 'Error: 500. Falha na conexão com o Banco';
  if (resp.data) return resp.data;
  return resp;
};

const Orders = ({ history }) => {
  const [error, setErrorStatus] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const isLSExist = JSON.parse(localStorage.getItem('user'));
    if (!isLSExist || !isLSExist.token) history.push('/login');
    const fetchOrders = async () => {
      setData(await sendRequestOrders(setErrorStatus, history));
    };
    fetchOrders();
  }, [setErrorStatus, setData, history]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="orders-container">
      {error
        || data.map((orders, index) => (
          <OrdersCard
            key={orders.saleId}
            orders={orders}
            index={index}
          />
        ))}
    </div>
  );
};

export default withRouter(Orders);

Orders.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};
