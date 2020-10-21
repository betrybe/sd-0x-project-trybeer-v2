import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import useRefreshTotalPrice from '../../hooks/useRefreshTotalPrice';
import '../../styles/Checkout.css';

const formatPrice = (totalPrice) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice);

const interactiveFormField = (formName, label, type, formValidation) => (
  <label className="form-label" htmlFor={formName}>
    {label}
    <br />
    <input
      type={type}
      id={formName}
      className="form-field"
      data-testid={formName}
      onChange={(e) => formValidation(e.target.value)}
    />
  </label>
);

const statusHandler = ({ status, message }, setSalesStatus, history) => {
  const divStyleError = {
    fontSize: 'smaller',
    display: 'inline-block',
    background: 'red',
    color: 'black',
    fontWeight: '800',
  };

  const divStyleSucess = {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    fontSize: 'smaller',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'green',
    color: 'white',
    fontWeight: '600',
    width: '60%',
    height: '15%',
    opacity: '0',
    animationName: 'fade',
    animationDuration: '2s',
    animationFillMode: 'forwards',
  };

  if (status === 201) {
    setTimeout(() => {
      localStorage.removeItem('cart');
      return history.push('/products');
    }, 2000);

    return setSalesStatus(
      <div style={divStyleSucess} className="sales-status-container">
        <span>Compra realizada com sucesso!</span>
      </div>,
    );
  }

  return setSalesStatus(
    <div style={divStyleError} className="sales-status-container">
      <span>{`Erro código: ${status}, ${message}`}</span>
    </div>,
  );
};

const sendProducts = async (deliveryAddress, deliveryNumber, setSalesStatus, history) => {
  const productsData = JSON.parse(localStorage.getItem('cart')).map(({ id: productId, itemQty: quantity }) => ({ productId, quantity }));

  const salesObject = { products: productsData, deliveryAddress, deliveryNumber };

  const { token } = JSON.parse(localStorage.getItem('user'));

  let error;

  const salesRequest = await axios({
    baseURL: 'http://localhost:3001/sales',
    method: 'post',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: token },
    data: salesObject,
  })
    .catch(({ response: { status, data: { error: { message } } } }) => {
      error = 1;
      return statusHandler({ status, message }, setSalesStatus, history);
    });

  if (error !== 1) return statusHandler(salesRequest, setSalesStatus, history);
  return null;
};

const removeItem = (itemId, setCartData) => {
  const actualCart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : null;
  if (actualCart !== null) {
    const newCart = actualCart.filter(({ id }) => id !== itemId);
    if (String(newCart) === '') {
      localStorage.removeItem('cart');
      return setCartData(null);
    }
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(newCart));
    return setCartData(newCart);
  }
  return setCartData(null);
};

const renderFormElements = ([
  setAdressValue,
  setStreetNumber,
  addressValue,
  streetNumber,
  salesStatus,
  setSalesStatus,
  totalPrice,
  history,
]) => (
  <div className="address-form-container">
    <div className="address-header-container">
      <h3>Endereço</h3>
      <div>{salesStatus}</div>
    </div>
    <form className="address-form">
      {interactiveFormField('checkout-street-input', 'Rua:', 'text', setAdressValue)}
      {interactiveFormField('checkout-house-number-input', 'Número da casa:', 'number', setStreetNumber)}
      <button
        type="button"
        data-testid="checkout-finish-btn"
        className="checkout-finish-btn"
        onClick={() => sendProducts(addressValue, streetNumber, setSalesStatus, history)}
        disabled={!(addressValue && streetNumber && totalPrice)}
      >
        Finalizar Pedido
      </button>
    </form>
  </div>
);

const renderProductsList = (cartData, setCartData, totalPrice) => (
  <div className="checkout-products-container">
    <div className="products-header-container">
      <h3>Produtos</h3>
    </div>
    <div className="products-list-container">
      <ul>
        {cartData ? cartData.map(({
          id, itemQty, name, price, totalValue,
        }, index) => (
          <li key={name} className="product-item">
            <span data-testid={`${index}-product-qtd-input`} className="span-itemQty">{itemQty}</span>
            <span data-testid={`${index}-product-name`}>{`- ${name}`}</span>
            <span className="spacing-span" />
            <span className="span-total-product-price" data-testid={`${index}-product-total-value`}>{`${formatPrice(totalValue)}`}</span>
            <span className="span-unit-price">{`(${formatPrice(price)} un)`}</span>
            <button type="button" className="item-removal-button" onClick={() => removeItem(id, setCartData)}>X</button>
          </li>
        )) : <h2>Não há produtos no carrinho</h2>}
      </ul>
    </div>
    <div className="total-price-container">
      <span data-testid="order-total-value">{`Total: ${formatPrice(totalPrice)}`}</span>
    </div>
  </div>
);

export default withRouter(function Checkout({ history }) {
  const [cartData, setCartData] = useState([]);
  const [addressValue, setAdressValue] = useState('');
  const [streetNumber, setStreetNumber] = useState(0);
  const [salesStatus, setSalesStatus] = useState('');
  const totalPrice = useRefreshTotalPrice(cartData);

  useEffect(() => {
    const isUserLogged = JSON.parse(localStorage.getItem('user'));
    if (isUserLogged === null) return history.push('/login');

    const getAddressInfoFromLocalStorage = () => (JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : null);
    const actualCart = getAddressInfoFromLocalStorage();
    if (!actualCart || actualCart.length === 0) {
      setCartData(null);
      localStorage.removeItem('cart');
    }
    setCartData(getAddressInfoFromLocalStorage());
    return (() => {});
  }, [setCartData, history]);

  return (
    <div className="checkout-page-container">
      {renderProductsList(cartData, setCartData, totalPrice)}
      {renderFormElements([
        setAdressValue,
        setStreetNumber,
        addressValue,
        streetNumber,
        salesStatus,
        setSalesStatus,
        totalPrice,
        history,
      ])}
    </div>
  );
});
