import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Add } from '../images/Add.svg';
import { ReactComponent as Remove } from '../images/Minus.svg';
import { TrybeerContext } from '../context/TrybeerContext';
import '../styles/CartAddOrRemoveButtons.css';

export default function CartAddOrRemoveButtons({
  index, product: {
    id, name, price, urlImage,
  },
}) {
  const [itemQty, setItemQty] = useState(0);
  const [lastAction, setLastAction] = useState('null');
  const { shopCart: [, setTotalQty] } = useContext(TrybeerContext);

  useEffect(() => {
    const createCartItem = () => {
      const totalValue = price * itemQty;
      return {
        id, name, price, urlImage, itemQty, totalValue,
      };
    };

    const sendToLocalStorage = (products) => {
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(products));
      const currentCart = localStorage.getItem('cart');
      if (currentCart === '[]') localStorage.removeItem('cart');
    };

    const updateItemQty = (currentCart) => sendToLocalStorage(currentCart.map((product) => {
      if (product.id === id) {
        return createCartItem();
      }
      return product;
    }));

    const removeProduct = (currentCart) => {
      const cartRemovedItem = currentCart.filter((item) => item.id !== id);
      if (itemQty === 0) return sendToLocalStorage(cartRemovedItem);

      const currentCart2 = localStorage.getItem('cart');
      if (currentCart2 === '[]') return localStorage.removeItem('cart');

      updateItemQty(currentCart);
      return null;
    };

    const addProduct = (currentCart) => {
      if (!currentCart) return localStorage.setItem('cart', JSON.stringify([createCartItem()]));

      const newProducts = currentCart;
      const productIds = currentCart.map(({ id: currentId }) => currentId);
      if (productIds.some((productId) => productId === id)) return updateItemQty(currentCart);
      newProducts.push(createCartItem());
      return sendToLocalStorage(newProducts);
    };

    const refreshCart = () => {
      const currentCart = JSON.parse(localStorage.getItem('cart'));
      if (lastAction === 'null') {
        const thisItem = currentCart && currentCart.find((product) => product.id === id);
        if (thisItem === undefined) return setItemQty(0);
        return thisItem ? setItemQty(thisItem.itemQty) : setItemQty(0);
      }
      if (lastAction === 'add') return addProduct(currentCart);
      return removeProduct(currentCart);
    };

    const fetchTotalItemQty = () => {
      const currentCart = JSON.parse(localStorage.getItem('cart'));
      const totalQty = currentCart ? currentCart.reduce(
        (total, { itemQty: newQty }) => total + newQty, 0,
      ) : 0;
      setTotalQty(totalQty);
    };

    refreshCart();
    fetchTotalItemQty();
  }, [itemQty, setTotalQty, id, lastAction, name, price, urlImage]);

  return (
    <div className="add-remove-btns-container">
      <div className="remove-btn-container">
        <button
          type="button"
          data-testid={`${index}-product-minus`}
          onClick={() => {
            setLastAction('remove');
            return itemQty > 0 && setItemQty((qty) => qty - 1);
          }}
        >
          <Remove className="remove-btn" />
        </button>
      </div>
      <div className="item-qty-container">
        <span data-testid={`${index}-product-qtd`}>{itemQty}</span>
      </div>
      <div className="add-btn-container">
        <button
          type="button"
          data-testid={`${index}-product-plus`}
          onClick={() => {
            setLastAction('add');
            setItemQty((qty) => qty + 1);
          }}
        >
          <Add className="add-btn" />
        </button>
      </div>
    </div>
  );
}
export const propCard = {
  index: PropTypes.number.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    urlImage: PropTypes.string.isRequired,
  }).isRequired,
};

CartAddOrRemoveButtons.propTypes = propCard;
