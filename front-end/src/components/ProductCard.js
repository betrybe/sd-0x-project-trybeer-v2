import React from 'react';
import PropTypes from 'prop-types';
import CartAddOrRemoveButtons from './CartAddOrRemoveButtons';
import '../styles/ProductCard.css';

export default function ProductCard({
  index, product: {
    id, name, price, urlImage,
  },
}) {
  return (
    <div className="product-card-container">
      <div className="image-container">
        <img className="product-image" src={urlImage} alt={`Foto do produto: ${name}`} data-testid={`${index}-product-img`} />
      </div>
      <div className="content-container">
        <div className="product-name-container">
          <h5 data-testid={`${index}-product-name`}>{name}</h5>
        </div>
        <div className="product-price-container">
          <span data-testid={`${index}-product-price`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
          </span>
        </div>
        <div className="add-remove-btns-container">
          <CartAddOrRemoveButtons
            product={{
              id, name, price, urlImage,
            }}
            index={index}
          />
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  index: PropTypes.number.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    urlImage: PropTypes.string.isRequired,
  }).isRequired,
};
