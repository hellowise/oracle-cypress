import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

beforeEach(() => {
    cy.intercept({ method: 'POST', 'pathname': '/pls/apex/wwv_flow.accept' }).as('login')
    cy.intercept({ method: 'POST', 'pathname': '/pls/apex/wwv_flow.ajax' }).as('data')
    cy.login(Cypress.env('email'), Cypress.env('password'))
})