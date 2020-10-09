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
    clientSendMessage,
    verifyElementNotVisible,
    insertText,
    verifyContainsUrl,
    accessChatClient,
    getHour,
  } from '../actions/actionBase';

describe('Criar funcionalidade de chat na visão de administrador', () => {
  beforeEach( () => {
    cy.exec('npx sequelize-cli db:drop');
    cy.exec('npx sequelize-cli db:create && npx sequelize-cli db:migrate $');
    cy.exec('npx sequelize-cli db:seed:all $');
    cy.task('deleteCollection', 'messages');
    cy.visit(`${Cypress.config().baseUrl}/login`);
  });

  it('Será validado que no meu sidebar contém o botão `Conversas`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    verifyElementVisible('[data-testid="side-menu-item-chat"]');
    verifyElementContainsText('[data-testid="side-menu-item-chat"]', 'Conversas');
  });

  it('Será validado que ao entrar na tela de `admin/chats` e não houver conversas e validado se contém o texto `Nenhuma conversa por aqui`', () => {
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    verifyContainsText('Nenhuma conversa por aqui');
  });

  it('Será validado que ao entrar na tela de `admin/chats` e existir uma conversa verifico se contém o card', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    verifyElementVisible('[data-testid="containerChat"]');
  });

  it('Será validado que ao entrar na tela de `admin/chats` e existir uma conversa verifico se dentro do card contem o email do cliente', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    verifyElementVisible('[data-testid="profile-name"]');
    verifyElementContainsText('[data-testid="profile-name"]', 'zebirita@gmail.com');
  });

  it('Será validado que ao entrar na tela de `admin/chats` e existir uma conversa verifico se dentro do card contem data da ultima mensagem', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    verifyElementVisible('[data-testid="last-message"]');
  });

  it('Será validado que ao clicar no card da conversa e redirecionado pra conversa', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    verifyContainsUrl('http://localhost:3000/admin/chat');
  });

  it('Será validado que ao clicar no card da conversa poderá ser visualizado as mensagem do cliente', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    verifyElementVisible('[data-testid="nickname"]');
    verifyElementVisible('[data-testid="message-time"]');
    verifyElementVisible('[data-testid="text-message"]');
    verifyElementVisible('[data-testid="message-input"]');
    verifyElementVisible('[data-testid="send-message"]');
  });

  it('Será validado que é possivel enviar mensagem', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    insertText('[data-testid="message-input"]', 'Opa caro cliente, será enviado hoje para o correio')
    clickButton('[data-testid="send-message"]');
    cy.reload();
    verifyElementContainsText('[data-testid="text-message"]', 'Opa caro cliente, será enviado hoje para o correio');
  });

  it('Será validado que ao enviar mensagem o nickname do admin e `Loja`', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    insertText('[data-testid="message-input"]', 'Opa caro cliente, será enviado hoje para o correio');
    clickButton('[data-testid="send-message"]');
    verifyElementContainsText('[data-testid="nickname"]', 'Loja');
  });

  it('Será validado que ao enviar mensagem e listado a hora do envio da mensagem', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    insertText('[data-testid="message-input"]', 'Opa caro cliente, será enviado hoje para o correio');
    clickButton('[data-testid="send-message"]');
    verifyElementContainsText('[data-testid="message-time"]', getHour());
  });

  it('Será validado que é possivel voltar pra tela de `admin/chat` através do botão voltar', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    verifyElementVisible('[data-testid="back-button"]');
    clickButton('[data-testid="back-button"]');
    verifyContainsUrl('http://localhost:3000/admin/chats');
  });

  it('Será validado que é possivel enviar mensagem para o cliente e a mensagem poderá ser visualizada pelo cliente', () => {
    clientSendMessage();
    cy.visit(`${Cypress.config().baseUrl}/login`);
    login(Cypress.env('loginAdmin'), Cypress.env('passwordAdmin'));
    clickButton('[data-testid="side-menu-item-chat"]');
    cy.reload();
    clickButton('[data-testid="profile-name"]');
    insertText('[data-testid="message-input"]', 'Opa caro cliente, será enviado hoje para o correio');
    clickButton('[data-testid="send-message"]');
    clickButton('[data-testid="side-menu-item-logout"]');
    login(Cypress.env('login'), Cypress.env('password'));
    accessChatClient();
    verifyElementContainsText('[data-testid="text-message"]', 'Opa caro cliente, será enviado hoje para o correio');
  });
});
    