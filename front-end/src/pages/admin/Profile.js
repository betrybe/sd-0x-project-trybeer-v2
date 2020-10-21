import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import '../../styles/AdminProfile.css';
import AdminSideBar from '../../components/admin/AdminSideBar';

export default withRouter(function AdminProfile({ history }) {
  const isLoggedIn = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!isLoggedIn) history.push('/login');
  }, [isLoggedIn, history]);

  if (!isLoggedIn) return null;
  const { name, email } = isLoggedIn;

  return (
    <div className="admin-profile-flex-container">
      <AdminSideBar />
      <div className="admin-profile-header">
        <h1>Perfil</h1>
        <div className="admin-name-field" data-testid="profile-name">
          {`Nome: ${name}`}
        </div>
        <div className="admin-email-field" data-testid="profile-email">
          {`Email: ${email}`}
        </div>
      </div>
    </div>
  );
});
