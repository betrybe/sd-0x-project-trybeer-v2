export default (totalPrice) => new Intl.NumberFormat(
  'pt-BR',
  { style: 'currency', currency: 'BRL' },
).format(totalPrice);
