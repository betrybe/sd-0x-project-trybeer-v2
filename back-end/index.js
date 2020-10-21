/* eslint-disable no-param-reassign */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const http = require('http').createServer(express());
const io = require('socket.io')(http);

const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const saleController = require('./controllers/saleController');
const {
  validateJWT, promiseErrors, endpointNotFound,
} = require('./middlewares');
const chatController = require('./controllers/chatController');

const app = express();
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/users', userController.createUser);
app.patch('/users/me', validateJWT, userController.updateUserById);
app.post('/users/chat', validateJWT, chatController.clientAdminMessage);
app.get('/users/chat', validateJWT, chatController.getAllChats);
app.get('/users/chat/:email', validateJWT, chatController.getChatByEmail);
app.post('/users/admin/chat', validateJWT, chatController.adminClientMessage);

app.get('/login', validateJWT, userController.getLoginUser);
app.post('/login', userController.loginUser);

app.get('/products', validateJWT, productController.getAllProducts);
app.get('/products/:id', validateJWT, productController.getProductById);

app.get('/sales', validateJWT, saleController.getSale);
app.post('/sales', validateJWT, saleController.createSale);
app.get('/sales/:id', validateJWT, saleController.getSaleProducts);
app.patch('/sales/:id', validateJWT, saleController.updateSaleById);

app.use(promiseErrors);

app.use(promiseErrors);

app.all('*', endpointNotFound);

const PORTBACK = process.env.PORTBACK || 3001;
const CHAT_PORT = process.env.CHAT_PORT || 5000;

app.listen(PORTBACK, () => console.log(`Listening on ${PORTBACK}`));

io.on('connection', async (socket) => {
  socket.on('receivedMsg', async (data) => {
    const { message, userData, emailClient } = data;
    io.emit(`${emailClient || userData.email}client`,
      `${userData.role === 'administrator' ? 'Loja' : userData.email}: ${message}`);
  });

  socket.on('statusUpdate', ({ status, saleId }) => {
    io.emit(`${saleId}`, status);
  });
});

http.listen(CHAT_PORT, () => console.log(`Chat Listening on ${CHAT_PORT}`));

