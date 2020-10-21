export default function (date) {
  const options = { month: '2-digit', day: '2-digit' };
  const formatedDate = new Date(date).toLocaleDateString('pt-br', options);
  return formatedDate;
}
