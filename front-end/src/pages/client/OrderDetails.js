import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import OrderCardDetails from '../../components/OrderCardDetails';

const sendRequestOrdersDetails = async (saleId, setErrorStatus, history) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData || !userData.token) {
    history.push('/login');
  }
  const { token } = userData;
  const resp = await axios({
    baseURL: `http://localhost:3001/sales/${saleId}`,
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
    .catch(({ response: { status, data: { error: { message } } } }) => setErrorStatus(`Error: ${status}. ${message}`));
  if (resp) return resp.data;
  return null;
};

const OrderDetails = ({ history, match: { params: { orderId } } }) => {
  const [, setErrorStatus] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const isLSExist = JSON.parse(localStorage.getItem('user'));
    if (!isLSExist || !isLSExist.token) return history.push('/login');
    const fetchOrderDetails = async () => setData(
      await sendRequestOrdersDetails(orderId, setErrorStatus, history),
    );
    fetchOrderDetails();

    return (() => setData(null));
  }, [orderId, setErrorStatus, history]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <OrderCardDetails data={data} id={orderId} />
    </div>
  );
};

export default withRouter(OrderDetails);

OrderDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.instanceOf(Object).isRequired,
    orderId: PropTypes.number,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

OrderDetails.defaultProps = {
  match: { orderId: 0 },
};
