describe('template spec', () => {
  it('Change table values', () => {
    cy.get('.a-GV-bdy .a-GV-table').should('be.visible')
    cy.wait('@data')
    cy.wait(1000)

    cy.graphdata().then(data => {
      cy.log(data)
    })

    cy.tabledata().then(data => {
      cy.log(data)
    })

    cy.updatedata(7, 'quantity', 50)
    //cy.updatedata(7, 'customer', 'Deli')

  });
});