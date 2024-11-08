describe('template spec', () => {
  it('Change table values', () => {
    cy.get('.a-GV-bdy .a-GV-table').should('be.visible')
    cy.wait('@data')

    //cy.get('div[class*="oj-chart"] svg g[fill] *').first().should('exist')
    cy.wait(1000)

    cy.graphdata().then(data => {
      cy.log(data)
    })

    cy.get('.js-pg-first').click({ force: true }) // ensure we are on the first page
    cy.tabledata().then(data => {
      cy.log(data)
    })

  });
});