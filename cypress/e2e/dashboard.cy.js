/// <reference types="cypress" />

// This listener will catch any unhandled exceptions from your application
// and prevent them from failing the test. This is key to debugging "white screen" issues.
Cypress.on('uncaught:exception', (err, runnable) => {
  // We can log the error to the Cypress console
  console.error('Uncaught exception:', err.message);
  // Returning false here prevents Cypress from failing the test
  return false;
});

describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.visit('/auth/fdff1878-a54a-44ee-b82c-a62bdc5cdb55');

    cy.contains('.ant-form-item-label', '帳號')
      .parent()
      .find('input')
      .should('be.visible')
      .type('test@oco.com');

    cy.contains('.ant-form-item-label', '密碼')
      .parent()
      .find('input[type="password"]')
      .should('be.visible')
      .type('111111');

    // Intercept login API to wait for completion reliably
    cy.intercept('POST', '**/api/Staff/StaffLogin').as('login');

    // Click the login button by its visible text
    cy.contains('button', '登入')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Wait for login request to finish successfully
    cy.wait('@login', { timeout: 20000 })
      .its('response.statusCode')
      .should('be.oneOf', [200, 204]);

    // Wait for the navigation to complete and dashboard to load
    cy.url().should('include', 'http://localhost:8080');
    cy.contains('button', '新增圖表', { timeout: 20000 }).should('be.visible');
  });

  it('should successfully log in and display the dashboard', () => {
    // Verify we are on the dashboard page (title is a span, not h2)
    cy.contains('.ant-page-header-heading-title', '首頁', { timeout: 20000 }).should('be.visible');
    cy.contains('button', '新增圖表').should('be.visible');
  });
}); 