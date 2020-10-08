import {
  loginClientAndBuyProduct,
  accessOrdersClient,
  verifyContainsText,
  clickButton,
  logout, 
  login,
  accessOrdersAdmin,
  verifyElementVisible,
  verifyElementContainsText,
  verifyElementNotVisible,
} from '../actions/actionBase';
const shell = require('shelljs');
    
describe('Criar o status para o pedido', () => {
  beforeEach(() => {
    cy.exec('npx sequelize-cli db:drop');
    cy.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
    cy.exec('npx sequelize-cli db:seed:all $');
    cy.visit(`${Cypress.config().baseUrl}/login`);
    loginClientAndBuyProduct();
    logout();
  });

  it('Dado que é feito uma compra, será validado que ela está com status `Pendente` na tela de `Meus pedidos` do cliente', () => {
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    verifyContainsText('Pendente');
  });

  it('Dado que é feito uma compra, será validado que ela está com status `Pendente` na tela de `Detalhes do pedido` do cliente', () => {
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    verifyContainsText('Pendente');
    clickButton('[data-testid="0-order-number"]');
    verifyContainsText('Pendente');
  });

  it('Dado que é feito uma compra, será validado que ela está com status `Pendente` na tela de `Pedidos` do admin', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    verifyContainsText('Pendente');
  });

  it('Dado que é feito uma compra, será validado que ela está com status `Pendente` na tela de `Detalhes do pedido` do admin', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    verifyContainsText('Pendente');
  });

  it('Será validado que o administrador ao acessar um determinado pedido ele deve visualizar o botão `Marcar como preparando`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    verifyElementVisible('[data-testid="mark-as-prepared-btn"]');
    verifyElementContainsText('[data-testid="mark-as-prepared-btn"]', 'Marcar como preparando');
  });

  it('Será validado que o administrador ao acessar um determinado pedido ele deve visualizar o botão `Marcar como entregue`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    verifyElementVisible('[data-testid="mark-as-delivered-btn"]');
    verifyElementContainsText('[data-testid="mark-as-delivered-btn"]', 'Marcar como entregue');
  });

  it('Quando clicar no botão `Marcar como preparando` deve alterar o status do detalhe do pedido para `Preparando`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-prepared-btn"]');
    verifyContainsText('Preparando');
  });

  it('Quando clicar no botão `Marcar como entregue` deve alterar o status do detalhe do pedido para `Entregue`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-delivered-btn"]');
    verifyContainsText('Entregue');
  });

  it('Quando clicar no botão `Marcar como entregue` os botões `Marcar como preparando` e `Marcar como entregue` devem sumir da tela', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-delivered-btn"]');
    verifyElementNotVisible('[data-testid="mark-as-delivered-btn"]');
    verifyElementNotVisible('[data-testid="mark-as-prepared-btn"]');
  });

  it('Ao clicar no botão `Marcar como entregue` será validado que na tela de `Pedidos` do admin, o status estará como `Entregue`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-delivered-btn"]');
    accessOrdersAdmin();
    verifyElementContainsText('[data-testid="0-order-status"]', 'Entregue');
  });

  it('Ao clicar no botão `Marcar como preparando` será validado que na tela de `Pedidos` do admin, o status estará como `Preparando`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-prepared-btn"]');
    accessOrdersAdmin();
    verifyElementContainsText('[data-testid="0-order-status"]', 'Preparando');  
  });

  it('Dado que o admin marcou o pedido como `Preparando` é verificado que na tela de `Pedidos` do cliente o status mudou para `Preparando`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-prepared-btn"]');
    logout();
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    verifyContainsText('Preparando'); 
  });

  it('Dado que o admin marcou o pedido como `Preparando` é verificado que na tela de `detalhe do pedido` do cliente o status mudou para `Preparando`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-prepared-btn"]');
    logout();
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    clickButton('[data-testid="0-order-number"]');
    verifyContainsText('Preparando');
  });

  it('Dado que o admin marcou o pedido como `Entregue` é verificado que na tela de `Pedidos` do cliente o status mudou para `Entregue`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-delivered-btn"]');
    logout();
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    verifyContainsText('Entregue');
  });

  it('Dado que o admin marcou o pedido como `Entregue` é verificado que na tela de `detalhe do pedido` do cliente o status mudou para `Entregue`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    accessOrdersAdmin();
    clickButton('[data-testid="0-order-number"]');
    clickButton('[data-testid="mark-as-delivered-btn"]');
    logout();
    login(Cypress.env('login'), Cypress.env('password'));
    accessOrdersClient();
    clickButton('[data-testid="0-order-number"]');
    verifyContainsText('Entregue');
  });
});
  