import './commands'

beforeEach(() => {
    cy.intercept({ method: 'POST', 'pathname': '/pls/apex/wwv_flow.accept' }).as('login')
    cy.intercept({ method: 'POST', 'pathname': '/pls/apex/wwv_flow.ajax' }, (req) => {
        req.continue((res) => {
            // todo
        })
    }).as('data')
    cy.login(Cypress.env('email'), Cypress.env('password'))
})