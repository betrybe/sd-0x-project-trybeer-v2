export default function checkLogin(history) {
  const loginData = JSON.parse(localStorage.getItem('user')) || {};
  if (!loginData) return history.push('/login');
  return loginData.token;
}
