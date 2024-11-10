describe('validate user input', () => {
  it('alter quantity for order', () => {
    let graphDataBefore = []
    let graphDataAfter = []

    let tableDataBefore = []
    let tableDataAfter = []

    cy.graphdata().then(data => {
      graphDataBefore = data
    })

    cy.tabledata().then(data => {
      tableDataBefore = data
    })

    const orderId = 7
    const quantity = 35

    cy.updatedata(orderId, 'quantity', quantity).then(() => {
      cy.graphdata().then(data => {
        graphDataAfter = data
        cy.tabledata().then(data => {
          tableDataAfter = data

          const entryOld = tableDataBefore.find(o => o.order == orderId)
          const entryOldSum = tableDataBefore
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)
          const graphQuantityBefore = graphDataBefore
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          const entryNew = tableDataAfter.find(o => o.order == orderId)
          const entryNewSum = tableDataAfter
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)
          const graphQuantityAfter = graphDataAfter
            .filter(o => o.product == entryOld.product)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          expect(entryNewSum == entryOldSum).to.be.false
          expect(graphQuantityBefore == graphQuantityAfter).to.be.false
          expect(entryNew.quantity == quantity).to.be.true
          expect(graphQuantityAfter == entryNewSum).to.be.true
        })
      })
    })
  });

  it('alter customer for order', () => {
    let graphDataBefore = []
    let graphDataAfter = []

    let tableDataBefore = []
    let tableDataAfter = []

    cy.graphdata().then(data => {
      graphDataBefore = data
    })

    cy.tabledata().then(data => {
      tableDataBefore = data
    })

    const orderId = 12
    const customer = 'Deli'

    cy.updatedata(orderId, 'customer', customer).then(() => {
      cy.graphdata().then(data => {
        graphDataAfter = data
        cy.tabledata().then(data => {
          tableDataAfter = data

          const entryOld = tableDataBefore.find(o => o.order == orderId)
          const graphItemsForCustomerBefore = graphDataBefore
            .filter(o => o.customer == entryOld.customer)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          const entryNew = tableDataAfter.find(o => o.order == orderId)
          const graphItemsForCustomerAfter = graphDataAfter
            .filter(o => o.customer == entryOld.customer)
            .map(o => o.quantity)
            .reduce((a, b) => a + b, 0)

          expect(entryNew.customer !== entryOld.customer).to.be.true
          expect(entryNew.customer == customer).to.be.true
          expect(graphItemsForCustomerBefore !== graphItemsForCustomerAfter).to.be.true
        })
      })
    })
  });
});