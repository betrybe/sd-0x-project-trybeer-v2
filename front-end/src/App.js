import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import AdminOrders from './pages/admin/Orders';
import AdminOrdersDetails from './pages/admin/OrderDetails';
import AdminProfile from './pages/admin/Profile';
import ClientProducts from './pages/client/Products';
import Checkout from './pages/client/Checkout';
import TopMenu from './components/TopMenu';
import ClientSideBar from './components/client/ClientSideBar';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/client/Orders';
import OrdersDetails from './pages/client/OrderDetails';
import Profile from './pages/client/Profile';
import ClientChat from './pages/ClientChat';
import AllChatsAdmin from './pages/admin/AllChatsAdmin';
import AdminChat from './pages/admin/AdminChat';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopMenu />
        <ClientSideBar />
        <Switch>
          <Route exact path="/admin/orders" component={AdminOrders} />
          <Route exact path="/admin/orders/:id" component={AdminOrdersDetails} />
          <Route exact path="/admin/profile" component={AdminProfile} />
          <Route exact path="/admin/chats" component={AllChatsAdmin} />
          <Route exact path="/products" component={ClientProducts} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/orders" component={OrdersPage} />
          <Route exact path="/orders/:orderId" component={OrdersDetails} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/chat" component={ClientChat} />
          <Route exact path="/admin/chat" component={AdminChat} />
          <Route exact path="/" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
