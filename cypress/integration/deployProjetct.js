import {
  insertText,
  clickButton,
  verifyContainsUrl,
} from '../actions/actionBase';
import { internet } from 'faker';

const FRONT_URL = `https://${Cypress.env('gitHubUser')}-front.herokuapp.com/}`

describe("Verifica se foi feito o deploy do frontend no Heroku", () => {
  beforeEach(() => {
    console.log(Cypress.env('url'));
    cy.visit(FRONT_URL);
    clickButton('[data-testid="no-account-btn"]');
  });

  it('Será validado que é possível acessar a tela de registro', () => {
    verifyContainsUrl(`${Cypress.config().baseUrl}/register`);
  });

  it('Será validado que é possível fazer cadastro de um cliente com sucesso e ser redirecionado para tela do cliente', () => {
    let randomEmail = internet.email();
    insertText('[data-testid="signup-name"]', 'brunobatistasilva');
    insertText('[data-testid="signup-email"]', randomEmail);
    insertText('[data-testid="signup-password"]', '123456');
    clickButton('[data-testid="signup-btn"]');
    console.log(`${FRONT_URL}/products`)
    verifyContainsUrl(`${FRONT_URL}/products`);
  });
});
