describe('template spec', () => {
  it('Change table values', () => {
    cy.get('.a-GV-table').should('be.visible')
    cy.wait('@data')

    //cy.get('div[class*="oj-chart"] svg g[fill] *').first().should('exist')
    cy.wait(1000)

    cy.graphdata().then(data => {
      cy.log(data)
    })
  });
});