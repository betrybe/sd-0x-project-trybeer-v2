import { useState, useEffect } from 'react';

export default function useRefreshTotalPrice(sensorVariable) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const refreshTotalPrice = () => {
      const currentCart = JSON.parse(localStorage.getItem('cart'));
      const cartTotalPrice = currentCart ? currentCart.reduce(
        (total, { totalValue }) => total + totalValue, 0,
      ) : 0;
      setTotalPrice(cartTotalPrice);
    };
    refreshTotalPrice();
  }, [setTotalPrice, sensorVariable]);

  return totalPrice;
}
